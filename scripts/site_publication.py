"""Stamp a checked Pages artifact and verify its documentation after publication."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ROUTES = (
    "/docs/",
    "/docs/copper/",
    "/docs/groovy/",
    "/docs/build-and-run/",
    "/support/",
    "/docs/reference/",
)
MANIFEST_PATH = "/.well-known/site-build.json"


def revision_value(value):
    if not re.fullmatch(r"[0-9a-f]{40}", value):
        raise argparse.ArgumentTypeError(
            "Revision must be a complete lowercase Git commit SHA"
        )
    return value


def stamp(directory, revision):
    documents = {}
    for route in ROUTES:
        html = directory / route.lstrip("/") / "index.html"
        documents[route] = hashlib.sha256(html.read_bytes()).hexdigest()
    manifest = {"schema_version": 1, "revision": revision, "documents": documents}
    destination = directory / MANIFEST_PATH.lstrip("/")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(manifest, indent=2) + "\n")
    return manifest


def checked_base(value, allow_local=False):
    parsed = urlsplit(value)
    production = parsed.scheme == "https" and parsed.netloc == "imagine.engineering"
    local = (
        allow_local
        and parsed.scheme == "http"
        and parsed.hostname in ("127.0.0.1", "localhost")
    )
    if (
        not (production or local)
        or parsed.path not in ("", "/")
        or parsed.query
        or parsed.fragment
        or parsed.username
        or parsed.password
    ):
        raise ValueError(
            "Use https://imagine.engineering/ or explicitly allow a local fixture origin"
        )
    return value.rstrip("/")


def fetch(base, path, opener=urlopen):
    url = base + path
    request = Request(
        url,
        headers={
            "User-Agent": "Imagineering-Publication-Check",
            "Cache-Control": "no-cache",
        },
    )
    with opener(request, timeout=15) as response:
        final = urlsplit(response.geturl())
        expected = urlsplit(url)
        if (
            (final.scheme, final.netloc, final.path)
            != (expected.scheme, expected.netloc, expected.path)
            or final.query
            or final.fragment
        ):
            raise ValueError(
                "Publication check redirected away from the expected route"
            )
        if response.status != 200:
            raise ValueError(
                f"Publication route returned HTTP {response.status}: {path}"
            )
        body = response.read(5 * 1024 * 1024 + 1)
        if len(body) > 5 * 1024 * 1024:
            raise ValueError(f"Publication route exceeds the response limit: {path}")
        return body


def verify_once(base, revision, opener=urlopen, expected_key=None):
    manifest = json.loads(fetch(base, MANIFEST_PATH, opener))
    if not isinstance(manifest, dict):
        raise ValueError("Published build manifest must be an object")
    if manifest.get("schema_version") != 1 or manifest.get("revision") != revision:
        raise ValueError(
            "Published build revision does not match the requested deployment"
        )
    if expected_key is not None and manifest.get("input_key") != expected_key:
        raise ValueError("Published build inputs do not match the requested deployment")
    documents = manifest.get("documents")
    if not isinstance(documents, dict) or set(documents) != set(ROUTES):
        raise ValueError(
            "Published manifest does not cover every documentation/support route"
        )
    checked = []
    for route in ROUTES:
        expected_hash = documents[route]
        if not isinstance(expected_hash, str) or not re.fullmatch(
            r"[0-9a-f]{64}", expected_hash
        ):
            raise ValueError(f"Invalid published document hash: {route}")
        actual = hashlib.sha256(fetch(base, route, opener)).hexdigest()
        if actual != expected_hash:
            raise ValueError(
                f"Published document differs from its deployment manifest: {route}"
            )
        checked.append(route)
    return {"revision": revision, "routes": checked}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    stamp_parser = commands.add_parser("stamp")
    stamp_parser.add_argument("--directory", type=Path, default=Path("out"))
    stamp_parser.add_argument("--revision", type=revision_value, required=True)
    verify_parser = commands.add_parser("verify")
    verify_parser.add_argument("--base-url", default="https://imagine.engineering/")
    verify_parser.add_argument("--revision", type=revision_value, required=True)
    verify_parser.add_argument("--allow-local", action="store_true")
    verify_parser.add_argument("--input-key")
    verify_parser.add_argument("--attempts", type=int, default=1)
    verify_parser.add_argument("--delay", type=float, default=10)
    verify_parser.add_argument("--report", type=Path)
    arguments = parser.parse_args()
    if arguments.command == "stamp":
        print(json.dumps(stamp(arguments.directory, arguments.revision)))
        return
    base = checked_base(arguments.base_url, arguments.allow_local)
    if not 1 <= arguments.attempts <= 12 or not 0 <= arguments.delay <= 30:
        parser.error("Use 1-12 attempts and a 0-30 second delay")
    report = {
        "base_url": base,
        "expected_revision": arguments.revision,
        "verified": False,
        "attempts": [],
    }
    for attempt in range(arguments.attempts):
        try:
            report["result"] = verify_once(
                base, arguments.revision, expected_key=arguments.input_key
            )
            report["verified"] = True
            report["attempts"].append({"number": attempt + 1, "success": True})
            break
        except (HTTPError, URLError, OSError, ValueError, TypeError) as error:
            report["attempts"].append({"number": attempt + 1, "error": str(error)})
            if attempt + 1 < arguments.attempts:
                time.sleep(arguments.delay)
    if arguments.report:
        arguments.report.parent.mkdir(parents=True, exist_ok=True)
        arguments.report.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    if not report["verified"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
