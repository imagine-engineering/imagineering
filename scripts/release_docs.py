"""Coordinate released documentation with the existing GitHub Pages deployment."""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import tarfile
import time
import zipfile

from site_publication import ROUTES, stamp, verify_once

WEBSITE = "imagine-engineering/imagineering"
SOURCE = "simtropolis/made"
KIND = "imagineering-documentation-v1"
ARTIFACT = "public-documentation-site"
EXTENSIONS = {
    ".html",
    ".css",
    ".js",
    ".json",
    ".txt",
    ".md",
    ".xml",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
    ".webmanifest",
}
INPUTS = (
    "app",
    "components",
    "lib",
    "public",
    "scripts",
    "package.json",
    "pnpm-lock.yaml",
    "next.config.mjs",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs",
    ".github/workflows/pages.yml",
)


def api(path, method="GET", data=None):
    command = ["gh", "api", "--method", method, path]
    if data is not None:
        command += ["--input", "-"]
    result = subprocess.run(
        command,
        input=json.dumps(data) if data is not None else None,
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout) if result.stdout.strip() else None


def sha(value):
    if not isinstance(value, str) or not re.fullmatch(r"[0-9a-f]{40}", value):
        raise ValueError("Expected a complete commit SHA")
    return value


def safe_path(value):
    path = PurePosixPath(value)
    if (
        path.is_absolute()
        or ".." in path.parts
        or not path.parts
        or "\\" in value
        or str(path) != value
    ):
        raise ValueError("Unsafe artifact path")
    if any(
        part.startswith(".") and part not in (".well-known", ".nojekyll")
        for part in path.parts
    ):
        raise ValueError(f"Hidden source/configuration cannot be published: {path}")
    if path.name in {
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "pnpm-lock.yaml",
        "Cargo.lock",
        "Cargo.toml",
    } or (path.suffix not in EXTENSIONS and path.name not in {".nojekyll", "CNAME"}):
        raise ValueError(f"Non-public output type: {path}")
    return path


def files(directory):
    result = {}
    for path in sorted(directory.rglob("*")):
        if path.is_symlink():
            raise ValueError("Artifacts cannot contain symbolic links")
        if path.is_file() and path.name != ".DS_Store":
            relative = str(path.relative_to(directory))
            safe_path(relative)
            result[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def input_key(website, source_key=""):
    if source_key and not re.fullmatch(r"[0-9a-f]{64}", source_key):
        raise ValueError("Invalid source build input key")
    digest = hashlib.sha256(source_key.encode())
    for name in INPUTS:
        root = website / name
        paths = sorted(root.rglob("*")) if root.is_dir() else [root]
        for path in paths:
            if path.is_symlink():
                raise ValueError("Build inputs cannot be symbolic links")
            if (
                path.is_file()
                and path.name != ".DS_Store"
                and "__pycache__" not in path.parts
            ):
                relative = str(path.relative_to(website))
                digest.update(
                    relative.encode()
                    + b"\0"
                    + hashlib.sha256(path.read_bytes()).digest()
                )
    return digest.hexdigest()


def output(name, value):
    with open(os.environ["GITHUB_OUTPUT"], "a") as stream:
        stream.write(f"{name}={value}\n")


def package(website, source_sha, website_sha, tag, key, destination, force=False):
    sha(source_sha)
    sha(website_sha)
    if not re.fullmatch(r"[0-9a-f]{64}", key) or not re.fullmatch(
        r"rust-v\d+\.\d+\.\d+", tag
    ):
        raise ValueError("Invalid release publication identity")
    directory = website / "out"
    if len(list((directory / "docs/reference").rglob("*.html"))) < 100:
        raise ValueError("Full reference book is required in release output")
    manifest = stamp(directory, source_sha)
    manifest.update(
        {
            "kind": KIND,
            "source_sha": source_sha,
            "website_sha": website_sha,
            "release_tag": tag,
            "input_key": key,
            "force": force,
            "files": files(directory),
        }
    )
    # The manifest's own hash cannot be recursively included in its inventory.
    manifest["files"].pop(".well-known/site-build.json", None)
    (directory / ".well-known/site-build.json").write_text(
        json.dumps(manifest, indent=2) + "\n"
    )

    def public_metadata(member):
        member.uid = member.gid = 0
        member.uname = member.gname = ""
        member.mtime = 0
        member.mode = 0o644
        member.pax_headers = {}
        return member

    with tarfile.open(destination, "w:gz") as archive:
        for name in sorted([*manifest["files"], ".well-known/site-build.json"]):
            archive.add(
                directory / name, arcname=name, recursive=False, filter=public_metadata
            )
    return manifest


def last_success(call=api):
    for page in range(1, 101):
        deployments = call(
            f"repos/{WEBSITE}/deployments?environment=github-pages&per_page=100&page={page}"
        )
        for deployment in deployments:
            payload = deployment.get("payload")
            if isinstance(payload, str):
                if not payload.strip():
                    continue
                payload = json.loads(payload)
            if not isinstance(payload, dict) or payload.get("kind") != KIND:
                continue
            # Only this controller's success attestation is eligible, never a pending Pages record.
            statuses = call(
                f"repos/{WEBSITE}/deployments/{deployment['id']}/statuses?per_page=100"
            )
            if any(status.get("state") == "success" for status in statuses):
                return payload
        if len(deployments) < 100:
            return None
    raise ValueError("Deployment history exceeded the audited pagination bound")


def should_publish(manifest, previous):
    return (
        manifest["force"]
        or previous is None
        or previous.get("input_key") != manifest["input_key"]
    )


def extract(archive_path, destination):
    if destination.exists():
        raise ValueError("Artifact destination must be new")
    with tarfile.open(archive_path, "r:gz") as archive:
        members = []
        total = 0
        names = set()
        for member in archive:
            safe_path(member.name)
            total += member.size
            if (
                not member.isfile()
                or member.name in names
                or len(members) >= 20000
                or total > 1024 * 1024 * 1024
            ):
                raise ValueError(
                    "Invalid, duplicate, linked or oversized static artifact"
                )
            names.add(member.name)
            members.append(member)
        destination.mkdir(parents=True)
        for member in members:
            path = destination / member.name
            path.parent.mkdir(parents=True, exist_ok=True)
            stream = archive.extractfile(member)
            if stream is None:
                raise ValueError("Unreadable artifact member")
            with stream:
                path.write_bytes(stream.read())
    manifest_path = destination / ".well-known/site-build.json"
    manifest = json.loads(manifest_path.read_text())
    if not isinstance(manifest, dict) or manifest.get("kind") != KIND:
        raise ValueError("Missing released documentation provenance")
    sha(manifest.get("source_sha"))
    sha(manifest.get("website_sha"))
    if (
        manifest.get("schema_version") != 1
        or manifest.get("revision") != manifest["source_sha"]
        or not re.fullmatch(r"rust-v\d+\.\d+\.\d+", manifest.get("release_tag", ""))
    ):
        raise ValueError("Artifact release identity does not match its source commit")
    if not isinstance(manifest.get("force"), bool) or not re.fullmatch(
        r"[0-9a-f]{64}", manifest.get("input_key", "")
    ):
        raise ValueError("Invalid publication key/preference")
    actual = files(destination)
    actual.pop(".well-known/site-build.json")
    if actual != manifest.get("files"):
        raise ValueError("Public artifact inventory differs from the built output")
    documents = manifest.get("documents")
    if not isinstance(documents, dict) or set(documents) != set(ROUTES):
        raise ValueError(
            "Artifact must include every documentation/support entry route"
        )
    for route in ROUTES:
        path = str(Path(route.lstrip("/")) / "index.html")
        if documents[route] != actual.get(path):
            raise ValueError(
                "Artifact route hashes do not match the public file inventory"
            )
    return manifest


def trusted_run(run, default_branch):
    event = run.get("event")
    trusted_ref = (
        run.get("head_branch") == default_branch
        if event == "workflow_dispatch"
        else event == "release"
        and bool(re.fullmatch(r"[0-9a-f]{40}", run.get("head_sha", "")))
    )
    return (
        run.get("path") == ".github/workflows/release_docs.yml"
        and trusted_ref
        and run.get("head_repository", {}).get("full_name") == SOURCE
        and run.get("repository", {}).get("full_name") == SOURCE
    )


def accept(run_id, website_sha, destination, call=api, pause=time.sleep):
    if not re.fullmatch(r"[1-9][0-9]*", run_id):
        raise ValueError("Expected a private documentation workflow run ID")
    default_branch = call(f"repos/{SOURCE}")["default_branch"]
    for attempt in range(31):
        run = call(f"repos/{SOURCE}/actions/runs/{run_id}")
        if not trusted_run(run, default_branch):
            raise ValueError(
                "Artifact did not originate in the trusted private documentation workflow"
            )
        if run.get("status") == "completed":
            if run.get("conclusion") != "success":
                raise ValueError("Private documentation build failed")
            break
        if attempt == 30:
            raise ValueError("Timed out waiting for the private documentation build")
        pause(10)
    artifacts = call(f"repos/{SOURCE}/actions/runs/{run_id}/artifacts?per_page=100")[
        "artifacts"
    ]
    matches = [
        artifact
        for artifact in artifacts
        if artifact.get("name") == ARTIFACT and not artifact.get("expired")
    ]
    if len(matches) != 1:
        raise ValueError("Expected one unexpired public-output artifact")
    artifact = matches[0]
    digest = artifact.get("digest", "")
    if (
        not re.fullmatch(r"sha256:[0-9a-f]{64}", digest)
        or not 0 < artifact.get("size_in_bytes", 0) <= 512 * 1024 * 1024
    ):
        raise ValueError("Missing artifact digest or invalid transfer size")
    archive_id = artifact["id"]
    zip_path = destination.parent / "incoming-docs.zip"
    with zip_path.open("wb") as stream:
        subprocess.run(
            ["gh", "api", f"repos/{SOURCE}/actions/artifacts/{archive_id}/zip"],
            stdout=stream,
            check=True,
        )
    if (
        zip_path.stat().st_size > 512 * 1024 * 1024
        or "sha256:" + hashlib.sha256(zip_path.read_bytes()).hexdigest() != digest
    ):
        raise ValueError("Transferred artifact digest differs from GitHub provenance")
    with zipfile.ZipFile(zip_path) as archive:
        if (
            archive.namelist() != ["site.tar.gz"]
            or archive.getinfo("site.tar.gz").file_size > 512 * 1024 * 1024
        ):
            raise ValueError("Unexpected files in documentation transfer")
        tar_path = destination.parent / "incoming-site.tar.gz"
        with tar_path.open("wb") as stream:
            stream.write(archive.read("site.tar.gz"))
    manifest = extract(tar_path, destination)
    if run["event"] == "release" and manifest["source_sha"] != run["head_sha"]:
        raise ValueError(
            "Release-event artifact differs from the tagged release commit"
        )
    if manifest["website_sha"] != sha(website_sha):
        raise ValueError(
            "Website changed since the release build; request a fresh build"
        )
    return manifest


def record(manifest, call=api):
    deployment = call(
        f"repos/{WEBSITE}/deployments",
        "POST",
        {
            "ref": manifest["website_sha"],
            "environment": "github-pages",
            "auto_merge": False,
            "required_contexts": [],
            "production_environment": True,
            "payload": manifest,
            "description": "Verified released documentation publication",
        },
    )
    call(
        f"repos/{WEBSITE}/deployments/{deployment['id']}/statuses",
        "POST",
        {
            "state": "success",
            "auto_inactive": False,
            "environment_url": "https://imagine.engineering/",
            "description": "Public documentation routes and hashes verified",
        },
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    key = commands.add_parser("key")
    key.add_argument("--website", type=Path, default=Path("."))
    key.add_argument("--source-key", default="")
    pack = commands.add_parser("package")
    pack.add_argument("--website", type=Path, default=Path("."))
    pack.add_argument("--source-sha", required=True)
    pack.add_argument("--website-sha", required=True)
    pack.add_argument("--tag", required=True)
    pack.add_argument("--key", required=True)
    pack.add_argument("--force", action="store_true")
    pack.add_argument("--destination", type=Path, required=True)
    commands.add_parser("request")
    receive = commands.add_parser("accept")
    receive.add_argument("--run-id", required=True)
    receive.add_argument("--website-sha", required=True)
    receive.add_argument("--destination", type=Path, default=Path("out"))
    commands.add_parser("decide")
    commands.add_parser("record")
    arguments = parser.parse_args()
    if arguments.command == "key":
        print(input_key(arguments.website, arguments.source_key))
    elif arguments.command == "package":
        package(
            arguments.website,
            arguments.source_sha,
            arguments.website_sha,
            arguments.tag,
            arguments.key,
            arguments.destination,
            arguments.force,
        )
    elif arguments.command == "request":
        api(
            f"repos/{SOURCE}/actions/workflows/release_docs.yml/dispatches",
            "POST",
            {
                "ref": api(f"repos/{SOURCE}")["default_branch"],
                "inputs": {
                    "release_tag": os.environ.get("RELEASE_TAG", ""),
                    "website_sha": sha(os.environ["GITHUB_SHA"]),
                    "force": os.environ.get("FORCE", "false") == "true",
                },
            },
        )
    elif arguments.command == "accept":
        accept(arguments.run_id, arguments.website_sha, arguments.destination)
    elif arguments.command == "decide":
        manifest = json.loads(Path("out/.well-known/site-build.json").read_text())
        previous = last_success()
        publish = should_publish(manifest, previous)
        if not publish:
            verify_once(
                "https://imagine.engineering",
                previous["source_sha"],
                expected_key=manifest["input_key"],
            )
        output("publish", str(publish).lower())
    else:
        # This command is called only after site_publication verifies the deployed artifact.
        manifest = json.loads(Path("out/.well-known/site-build.json").read_text())
        record(
            {
                key: value
                for key, value in manifest.items()
                if key not in {"files", "documents"}
            }
        )


if __name__ == "__main__":
    main()
