"""Check the actual Pages artifact, including links, image bytes, fonts and metadata."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import argparse
import hashlib
import re
import struct

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--directory", type=Path, default=ROOT / "out")
OUT = parser.parse_args().directory.resolve()
ORIGIN = "https://imagine.engineering"


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.ids = set()
        self.documentation_links = []
        self.navigation_stack = []
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        self.elements.append((tag, attributes))
        if tag == "nav":
            self.navigation_stack.append(
                attributes.get("aria-label") == "Documentation"
            )
        if tag == "a" and any(self.navigation_stack):
            self.documentation_links.append(attributes.get("href"))
        if "id" in attributes:
            self.ids.add(attributes["id"])

    def handle_endtag(self, tag):
        if tag == "nav" and self.navigation_stack:
            self.navigation_stack.pop()


def target_file(path):
    candidate = OUT / unquote(path).lstrip("/")
    assert candidate.resolve().is_relative_to(OUT.resolve()), path
    if candidate.is_dir():
        candidate /= "index.html"
    assert candidate.is_file(), f"Missing exported path: {path}"
    return candidate


assert (OUT / "index.html").is_file(), "Run pnpm build first"
assert (OUT / "404.html").is_file(), "Missing static error page"
assert (OUT / ".nojekyll").is_file(), "Missing underscore-asset protection"
html_files = list(OUT.rglob("*.html"))
references = set()
for html in html_files:
    route = "/" + str(html.relative_to(OUT)).removesuffix("index.html")
    document = Document(html.read_text())
    for tag, attributes in document.elements:
        for attribute in ("src", "href"):
            value = attributes.get(attribute)
            if not value:
                continue
            url = urlsplit(urljoin(ORIGIN + route, value))
            if (
                url.scheme not in ("http", "https")
                or url.netloc != "imagine.engineering"
            ):
                continue
            assert not url.path.startswith(("/_next/image", "/_vercel/")), value
            asset = target_file(url.path)
            references.add(url.path)
            if tag == "a" and url.fragment:
                destination = document if asset == html else Document(asset.read_text())
                assert unquote(url.fragment) in destination.ids, (
                    f"Broken fragment: {value}"
                )

home = Document((OUT / "index.html").read_text())
metadata = {
    a.get("property", a.get("name")): a.get("content")
    for tag, a in home.elements
    if tag == "meta"
}
canonical = [
    a["href"]
    for tag, a in home.elements
    if tag == "link" and a.get("rel") == "canonical"
]
assert canonical == [ORIGIN + "/"], canonical
assert metadata["og:url"].rstrip("/") == ORIGIN
for name in ("og:image", "twitter:image"):
    url = urlsplit(metadata[name])
    assert url.netloc == "imagine.engineering" and url.path.endswith(".png"), metadata[
        name
    ]
    png = target_file(url.path).read_bytes()
    assert png[:8] == b"\x89PNG\r\n\x1a\n" and struct.unpack(">II", png[16:24]) == (
        1200,
        630,
    )

documentation_routes = {
    "/docs/": "Start with your product",
    "/docs/copper/": "Rust development with Copper",
    "/docs/groovy/": "Try the guarded JVM candidate",
    "/docs/build-and-run/": "Build and run from source",
    "/support/": "Help and support",
}
for route, heading in documentation_routes.items():
    html = target_file(route)
    source = html.read_text()
    document = Document(source)
    assert heading in source, f"Missing substantive documentation: {route}"
    canonicals = [
        a["href"]
        for tag, a in document.elements
        if tag == "link" and a.get("rel") == "canonical"
    ]
    assert canonicals == [ORIGIN + route], (
        f"Wrong documentation canonical: {route}: {canonicals}"
    )
    navigation = [
        a
        for tag, a in document.elements
        if tag == "nav" and a.get("aria-label") == "Documentation"
    ]
    assert len(navigation) == 1, f"Missing documentation navigation: {route}"
    assert document.documentation_links == list(documentation_routes) + [
        "/docs/reference/"
    ], f"Incomplete documentation navigation: {route}: {document.documentation_links}"
    assert any(
        tag == "a" and a.get("href") == "#documentation-content"
        for tag, a in document.elements
    ), f"Missing keyboard skip link: {route}"
    assert any(
        tag == "main"
        and a.get("id") == "documentation-content"
        and a.get("tabindex") == "-1"
        for tag, a in document.elements
    ), f"Unfocusable keyboard skip target: {route}"
    current = [
        a.get("href")
        for tag, a in document.elements
        if tag == "a" and a.get("aria-current") == "page"
    ]
    assert current == [route], f"Wrong current-page label: {route}: {current}"
    assert "documentation-content" in document.ids, (
        f"Missing keyboard skip target: {route}"
    )

reference_document = Document(target_file("/docs/reference/").read_text())
if any(
    tag == "nav" and attributes.get("aria-label") == "Documentation"
    for tag, attributes in reference_document.elements
):
    assert [
        attributes.get("href")
        for tag, attributes in reference_document.elements
        if tag == "a" and attributes.get("aria-current") == "page"
    ] == ["/docs/reference/"], "Reference overview must identify the current page"
else:
    assert any(
        tag == "aside" and attributes.get("aria-label") == "Reference provenance"
        for tag, attributes in reference_document.elements
    ), "Missing reference provenance"
    assert any(
        tag == "main"
        and attributes.get("id") == "reference-main"
        and attributes.get("tabindex") == "-1"
        for tag, attributes in reference_document.elements
    ), "Missing reference keyboard target"
    assert any(
        tag == "a" and attributes.get("href") == "#reference-main"
        for tag, attributes in reference_document.elements
    ), "Missing reference keyboard skip link"
    assert {"menu-bar", "theme-toggle", "theme-list"}.issubset(
        reference_document.ids
    ), "Missing pinned mdBook script hooks"
    assert any(
        "menu-title" in attributes.get("class", "").split()
        for tag, attributes in reference_document.elements
    ), "Missing pinned mdBook menu-title hook"
    assert any(
        tag == "link"
        and attributes.get("rel") == "canonical"
        and attributes.get("href") == ORIGIN + "/docs/reference/"
        for tag, attributes in reference_document.elements
    ), "Wrong reference canonical"
    assert any(
        tag == "a" and attributes.get("aria-current") == "page"
        for tag, attributes in reference_document.elements
    ), "Missing current reference chapter"
    assert len(list((OUT / "docs/reference").rglob("*.html"))) >= 100, (
        "Incomplete reference book"
    )


font_count = 0
for css in (OUT / "_next").rglob("*.css"):
    route = "/" + str(css.relative_to(OUT))
    for value in re.findall(r"url\(['\"]?([^)'\"]+)", css.read_text()):
        url = urlsplit(urljoin(ORIGIN + route, value))
        if url.scheme == "data":
            continue
        assert url.netloc == "imagine.engineering", f"External CSS asset: {value}"
        target_file(url.path)
        if url.path.endswith((".woff", ".woff2")):
            font_count += 1
assert font_count, "Fonts must be exported locally"

for asset in (ROOT / "public").rglob("*"):
    if asset.is_file() and asset.name != ".DS_Store":
        exported = OUT / asset.relative_to(ROOT / "public")
        assert exported.is_file() and asset.read_bytes() == exported.read_bytes(), (
            f"Altered asset: {asset}"
        )
assert (
    hashlib.sha256((OUT / "images/copper-origin-dev.jpg").read_bytes()).hexdigest()
    == "c059ac3e110494ffb6f3e80287c293629240313128a75926c46d43b4dfcc0fed"
), "Copper screenshot provenance changed"

for js in (OUT / "_next").rglob("*.js"):
    assert "/_vercel/insights" not in js.read_text(), "Vercel-only analytics remains"
print(
    f"Export verified: {len(html_files)} HTML routes, {len(references)} local references, {font_count} font references; social PNG and original Copper screenshot intact."
)
