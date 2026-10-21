"""Exercise the actual export checker and post-publication failure boundaries."""

import argparse
from contextlib import contextmanager
import copy
import io
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from urllib.error import HTTPError

from site_publication import (
    MANIFEST_PATH,
    ROUTES,
    checked_base,
    revision_value,
    stamp,
    verify_once,
)

ROOT = Path(__file__).resolve().parents[1]
REVISION = "a" * 40


class ExportChecks(unittest.TestCase):
    @contextmanager
    def artifact(self):
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary) / "out"
            shutil.copytree(ROOT / "out", directory)
            yield directory

    def check(self, directory):
        return subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts/check-export.py"),
                "--directory",
                str(directory),
            ],
            capture_output=True,
            text=True,
        )

    def test_actual_export_passes(self):
        result = self.check(ROOT / "out")
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_incomplete_navigation_fails(self):
        with self.artifact() as directory:
            page = directory / "docs/index.html"
            source = page.read_text()
            before = 'href="/docs/copper/"'
            self.assertIn(before, source)
            page.write_text(source.replace(before, 'href="/docs/"', 1))
            result = self.check(directory)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Incomplete documentation navigation", result.stderr)

    def test_missing_route_fails(self):
        with self.artifact() as directory:
            (directory / "docs/groovy/index.html").unlink()
            result = self.check(directory)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Missing exported path", result.stderr)

    def test_broken_fragment_fails(self):
        with self.artifact() as directory:
            page = directory / "docs/index.html"
            page.write_text(
                page.read_text().replace(
                    "#documentation-content", "#missing-documentation-content", 1
                )
            )
            result = self.check(directory)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Broken fragment", result.stderr)

    def test_altered_original_asset_fails(self):
        with self.artifact() as directory:
            (directory / "images/copper-origin-dev.jpg").write_bytes(b"incorrect image")
            result = self.check(directory)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Altered asset", result.stderr)

    def test_current_page_marker_fails_closed(self):
        with self.artifact() as directory:
            page = directory / "support/index.html"
            self.assertIn('aria-current="page"', page.read_text())
            page.write_text(
                page.read_text().replace('aria-current="page"', 'aria-current="false"')
            )
            result = self.check(directory)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Wrong current-page label", result.stderr)


class Response(io.BytesIO):
    status = 200

    def __init__(self, url, body):
        super().__init__(body)
        self.url = url

    def geturl(self):
        return self.url


class PublicationChecks(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)
        for route in ROUTES:
            page = self.directory / route.lstrip("/") / "index.html"
            page.parent.mkdir(parents=True)
            page.write_text(f"<!doctype html><h1>{route}</h1>")
        self.manifest = stamp(self.directory, REVISION)
        self.base = "https://imagine.engineering"
        self.payloads = {
            route: (self.directory / route.lstrip("/") / "index.html").read_bytes()
            for route in ROUTES
        }
        self.payloads[MANIFEST_PATH] = json.dumps(self.manifest).encode()

    def opener(self, request, timeout):
        self.assertEqual(timeout, 15)
        path = request.full_url.removeprefix(self.base)
        if path not in self.payloads:
            error = HTTPError(request.full_url, 404, "Not found", {}, None)
            error.close()
            raise error
        return Response(request.full_url, self.payloads[path])

    def test_only_complete_commit_revisions_are_accepted(self):
        self.assertEqual(revision_value(REVISION), REVISION)
        for invalid in ("main", "a" * 7, "A" * 40, "../private"):
            with self.assertRaises(argparse.ArgumentTypeError):
                revision_value(invalid)

    def test_matching_deployment_and_every_route_pass(self):
        result = verify_once(self.base, REVISION, self.opener)
        self.assertEqual(result, {"revision": REVISION, "routes": list(ROUTES)})

    def test_stale_website_build_with_same_source_commit_cannot_authorize_cutover(self):
        with self.assertRaisesRegex(ValueError, "build inputs"):
            verify_once(self.base, REVISION, self.opener, expected_key="b" * 64)

    def test_non_object_manifest_fails(self):
        self.payloads[MANIFEST_PATH] = b"[]"
        with self.assertRaisesRegex(ValueError, "object"):
            verify_once(self.base, REVISION, self.opener)

    def test_previous_deployment_cannot_authorize_cutover(self):
        with self.assertRaisesRegex(ValueError, "revision"):
            verify_once(self.base, "b" * 40, self.opener)

    def test_stale_or_soft_404_document_fails(self):
        self.payloads["/docs/groovy/"] = b"<!doctype html><h1>Not found</h1>"
        with self.assertRaisesRegex(ValueError, "differs"):
            verify_once(self.base, REVISION, self.opener)

    def test_missing_route_fails(self):
        del self.payloads["/support/"]
        with self.assertRaises(HTTPError):
            verify_once(self.base, REVISION, self.opener)

    def test_incomplete_manifest_fails(self):
        manifest = copy.deepcopy(self.manifest)
        del manifest["documents"]["/support/"]
        self.payloads[MANIFEST_PATH] = json.dumps(manifest).encode()
        with self.assertRaisesRegex(ValueError, "every documentation"):
            verify_once(self.base, REVISION, self.opener)

    def test_redirect_away_from_route_fails(self):
        def redirect(request, timeout):
            return Response("https://example.invalid/login", b"login")

        with self.assertRaisesRegex(ValueError, "redirected"):
            verify_once(self.base, REVISION, redirect)

    def test_private_or_query_destinations_are_rejected(self):
        for value in [
            "https://github.com/simtropolis/made",
            "https://imagine.engineering/?environment=private",
            "https://imagine.engineering/docs/",
            "http://127.0.0.1:3136",
        ]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                checked_base(value)
        self.assertEqual(checked_base("https://imagine.engineering/"), self.base)
        self.assertEqual(
            checked_base("http://127.0.0.1:3136/", allow_local=True),
            "http://127.0.0.1:3136",
        )

    def test_missing_local_route_cannot_be_stamped(self):
        (self.directory / "support/index.html").unlink()
        with self.assertRaises(FileNotFoundError):
            stamp(self.directory, REVISION)


if __name__ == "__main__":
    unittest.main()
