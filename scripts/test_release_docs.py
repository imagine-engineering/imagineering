"""Release publication regression tests; no network calls or deployments."""

import io
import hashlib
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
import zipfile
from unittest.mock import patch

from release_docs import (
    ARTIFACT,
    KIND,
    SOURCE,
    accept,
    extract,
    input_key,
    last_success,
    package,
    record,
    safe_path,
    should_publish,
    trusted_run,
)
from site_publication import ROUTES


class ReleasePolicy(unittest.TestCase):
    def test_first_unchanged_changed_and_forced_publication(self):
        candidate = {"input_key": "a" * 64, "force": False}
        self.assertTrue(should_publish(candidate, None))
        self.assertFalse(should_publish(candidate, candidate))
        self.assertTrue(should_publish(candidate, {"input_key": "b" * 64}))
        self.assertTrue(should_publish(dict(candidate, force=True), candidate))

    def test_only_successful_own_deployments_are_baselines(self):
        pages = [
            {"id": 3, "payload": {"kind": KIND, "input_key": "failed"}},
            {"id": 2, "payload": {"kind": "unrelated"}},
            {"id": 1, "payload": {"kind": KIND, "input_key": "verified"}},
        ]

        def call(path):
            if "/statuses" in path:
                return [{"state": "success" if "/1/" in path else "failure"}]
            return pages

        self.assertEqual(last_success(call)["input_key"], "verified")

    def test_empty_history_is_first_deployment(self):
        self.assertIsNone(last_success(lambda path: []))

    def test_api_failure_cannot_be_mistaken_for_first_deployment(self):
        def fail(path):
            raise RuntimeError("API unavailable")

        with self.assertRaises(RuntimeError):
            last_success(fail)

    def test_record_orders_creation_before_success_and_does_not_inactivate_pages(self):
        calls = []

        def call(path, method="GET", data=None):
            calls.append((path, method, data))
            return {"id": 12}

        record({"kind": KIND, "website_sha": "b" * 40}, call)
        self.assertEqual(calls[0][2]["required_contexts"], [])
        self.assertEqual(calls[1][2]["state"], "success")
        self.assertFalse(calls[1][2]["auto_inactive"])

    def test_untrusted_pull_request_branch_repository_and_failure_cannot_deploy(self):
        run = {
            "path": ".github/workflows/release_docs.yml",
            "event": "workflow_dispatch",
            "head_branch": "dev",
            "head_repository": {"full_name": SOURCE},
            "repository": {"full_name": SOURCE},
        }
        self.assertTrue(trusted_run(run, "dev"))
        self.assertTrue(
            trusted_run(
                dict(run, event="release", head_branch=None, head_sha="a" * 40), "dev"
            )
        )
        self.assertFalse(
            trusted_run(dict(run, event="release", head_sha="not-a-commit"), "dev")
        )
        for key, value in (
            ("event", "pull_request"),
            ("head_branch", "attacker"),
            ("path", ".github/workflows/run_tests.yml"),
            ("head_repository", {"full_name": "other/repo"}),
        ):
            self.assertFalse(trusted_run(dict(run, **{key: value}), "dev"))


class BuildInputs(unittest.TestCase):
    def test_content_and_build_input_changes_invalidate_without_using_commit_sha(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "app").mkdir()
            page = root / "app/page.tsx"
            page.write_text("same content across releases")
            before = input_key(root, "a" * 64)
            (root / "unrelated.md").write_text("an unrelated commit")
            self.assertEqual(before, input_key(root, "a" * 64))
            page.write_text("changed docs")
            self.assertNotEqual(before, input_key(root, "a" * 64))
            self.assertNotEqual(input_key(root, "a" * 64), input_key(root, "b" * 64))
            lock = root / "pnpm-lock.yaml"
            before = input_key(root)
            lock.write_text("changed build input")
            self.assertNotEqual(before, input_key(root))

    def test_generated_python_cache_does_not_cause_retry_loop(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "scripts").mkdir()
            before = input_key(root)
            (root / "scripts/__pycache__").mkdir()
            (root / "scripts/__pycache__/test.pyc").write_bytes(b"cache")
            self.assertEqual(before, input_key(root))
            (root / "scripts/.DS_Store").write_bytes(b"OS metadata")
            self.assertEqual(before, input_key(root))


class PublicArtifacts(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.website = self.root / "website"
        for route in ROUTES:
            page = self.website / "out" / route.lstrip("/") / "index.html"
            page.parent.mkdir(parents=True, exist_ok=True)
            page.write_text(f"<html><body>{route}</body></html>")
        for index in range(100):
            (self.website / f"out/docs/reference/chapter-{index}.html").write_text(
                f"<h1>{index}</h1>"
            )
        self.archive = self.root / "site.tar.gz"
        self.manifest = package(
            self.website, "a" * 40, "b" * 40, "rust-v1.2.3", "c" * 64, self.archive
        )

    def test_round_trip_exports_only_checked_output(self):
        destination = self.root / "received"
        result = extract(self.archive, destination)
        self.assertEqual(result, self.manifest)
        self.assertEqual(len(result["files"]), 106)
        self.assertFalse((destination / "package.json").exists())

    def test_private_checkout_sourcemap_and_source_extensions_are_rejected(self):
        for path in (
            "../secret",
            "/secret",
            ".git/config",
            "a/.env",
            "app/page.tsx",
            "source.rs",
            "bundle.js.map",
            "package.json",
            "Cargo.lock",
            "a\\secret.html",
        ):
            with self.subTest(path=path), self.assertRaises(ValueError):
                safe_path(path)

    def unsafe(self, name, kind=tarfile.REGTYPE):
        with tarfile.open(self.archive, "w:gz") as archive:
            member = tarfile.TarInfo(name)
            member.type = kind
            member.linkname = "/private/source"
            archive.addfile(member, io.BytesIO(b""))

    def test_traversal_and_links_are_rejected_before_extraction(self):
        for index, (name, kind) in enumerate(
            (
                ("../outside.html", tarfile.REGTYPE),
                ("index.html", tarfile.SYMTYPE),
                ("index.html", tarfile.LNKTYPE),
            )
        ):
            self.unsafe(name, kind)
            destination = self.root / f"unsafe-{index}"
            with self.assertRaises(ValueError):
                extract(self.archive, destination)
            self.assertFalse(destination.exists())

    def test_duplicate_tar_members_are_rejected(self):
        with tarfile.open(self.archive, "w:gz") as archive:
            for repeat in range(2):
                archive.addfile(tarfile.TarInfo("index.html"), io.BytesIO(b""))
        with self.assertRaises(ValueError):
            extract(self.archive, self.root / "duplicate")

    def test_modified_content_cannot_pass_manifest_validation(self):
        (self.website / "out/docs/copper/index.html").write_text("tampered")
        with tarfile.open(self.archive, "w:gz") as archive:
            for path in (self.website / "out").rglob("*"):
                if path.is_file():
                    archive.add(
                        path, arcname=str(path.relative_to(self.website / "out"))
                    )
        with self.assertRaisesRegex(ValueError, "inventory"):
            extract(self.archive, self.root / "tampered")

    def test_packaging_excludes_os_metadata_without_removing_source_files(self):
        metadata = self.website / "out/.DS_Store"
        metadata.write_bytes(b"private Finder metadata")
        manifest = package(
            self.website, "a" * 40, "b" * 40, "rust-v1.2.3", "c" * 64, self.archive
        )
        self.assertTrue(metadata.exists())
        self.assertNotIn(".DS_Store", manifest["files"])
        with tarfile.open(self.archive) as archive:
            self.assertNotIn(".DS_Store", archive.getnames())
        (self.website / "out/.env").write_text("private configuration")
        with self.assertRaisesRegex(ValueError, "Hidden source/configuration"):
            package(
                self.website, "a" * 40, "b" * 40, "rust-v1.2.3", "c" * 64, self.archive
            )

    def test_transfer_archive_does_not_disclose_runner_identity(self):
        with tarfile.open(self.archive) as archive:
            for member in archive:
                self.assertEqual(
                    (member.uid, member.gid, member.uname, member.gname, member.mtime),
                    (0, 0, "", "", 0),
                )

    def test_failed_and_timed_out_private_builds_never_download(self):
        base = {
            "path": ".github/workflows/release_docs.yml",
            "event": "workflow_dispatch",
            "head_branch": "dev",
            "head_repository": {"full_name": SOURCE},
            "repository": {"full_name": SOURCE},
        }
        for status, conclusion in (("completed", "failure"), ("in_progress", None)):
            run = dict(base, status=status, conclusion=conclusion)

            def call(path):
                return {"default_branch": "dev"} if path == f"repos/{SOURCE}" else run

            with (
                patch("release_docs.subprocess.run") as download,
                self.assertRaises(ValueError),
            ):
                accept(
                    "12", "b" * 40, self.root / "not-received", call, lambda delay: None
                )
            download.assert_not_called()

    def test_real_transfer_accepts_only_current_website_commit(self):
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w") as archive:
            archive.writestr("site.tar.gz", self.archive.read_bytes())
        payload = buffer.getvalue()
        digest = "sha256:" + hashlib.sha256(payload).hexdigest()
        run = {
            "path": ".github/workflows/release_docs.yml",
            "event": "workflow_dispatch",
            "head_branch": "dev",
            "head_repository": {"full_name": SOURCE},
            "repository": {"full_name": SOURCE},
            "status": "completed",
            "conclusion": "success",
        }

        def call(path):
            if path == f"repos/{SOURCE}":
                return {"default_branch": "dev"}
            if "/artifacts?" in path:
                return {
                    "artifacts": [
                        {
                            "id": 34,
                            "name": ARTIFACT,
                            "expired": False,
                            "digest": digest,
                            "size_in_bytes": len(payload),
                        }
                    ]
                }
            return run

        def download(command, stdout, check):
            self.assertEqual(command[-1], f"repos/{SOURCE}/actions/artifacts/34/zip")
            stdout.write(payload)

        with patch("release_docs.subprocess.run", side_effect=download):
            self.assertEqual(
                accept("12", "b" * 40, self.root / "accepted", call)["source_sha"],
                "a" * 40,
            )
            with self.assertRaisesRegex(ValueError, "Website changed"):
                accept("12", "d" * 40, self.root / "stale", call)
            digest = "sha256:" + "0" * 64
            with self.assertRaisesRegex(ValueError, "digest differs"):
                accept("12", "b" * 40, self.root / "bad-digest", call)
            self.assertFalse((self.root / "bad-digest").exists())

    def test_bad_release_identity_is_rejected_before_deployment(self):
        manifest_path = self.website / "out/.well-known/site-build.json"
        manifest = json.loads(manifest_path.read_text())
        manifest["revision"] = "d" * 40
        manifest_path.write_text(json.dumps(manifest))
        with tarfile.open(self.archive, "w:gz") as archive:
            for path in (self.website / "out").rglob("*"):
                if path.is_file():
                    archive.add(
                        path, arcname=str(path.relative_to(self.website / "out"))
                    )
        with self.assertRaisesRegex(ValueError, "release identity"):
            extract(self.archive, self.root / "wrong-release")

    def test_oversized_declared_member_fails_before_reading_or_writing_content(self):
        with tarfile.open(self.archive, "w:gz") as archive:
            member = tarfile.TarInfo("index.html")
            member.size = 1024 * 1024 * 1024 + 1
            archive.fileobj.write(member.tobuf())
        with self.assertRaisesRegex(ValueError, "oversized"):
            extract(self.archive, self.root / "oversized")
        self.assertFalse((self.root / "oversized").exists())

    def test_missing_reference_book_never_packages(self):
        for page in (self.website / "out/docs/reference").glob("chapter-*.html"):
            page.unlink()
        with self.assertRaisesRegex(ValueError, "Full reference"):
            package(
                self.website, "a" * 40, "b" * 40, "rust-v1.2.3", "c" * 64, self.archive
            )


if __name__ == "__main__":
    unittest.main()
