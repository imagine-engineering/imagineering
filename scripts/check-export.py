"""Check the actual Pages artifact, including links, image bytes, fonts and metadata."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import hashlib
import re
import struct

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"
ORIGIN = "https://imagine.engineering"


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.ids = set()
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        self.elements.append((tag, attributes))
        if "id" in attributes:
            self.ids.add(attributes["id"])


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
            if url.scheme not in ("http", "https") or url.netloc != "imagine.engineering":
                continue
            assert not url.path.startswith(("/_next/image", "/_vercel/")), value
            asset = target_file(url.path)
            references.add(url.path)
            if tag == "a" and url.fragment:
                destination = document if asset == html else Document(asset.read_text())
                assert unquote(url.fragment) in destination.ids, f"Broken fragment: {value}"

home = Document((OUT / "index.html").read_text())
metadata = {a.get("property", a.get("name")): a.get("content") for tag, a in home.elements if tag == "meta"}
canonical = [a["href"] for tag, a in home.elements if tag == "link" and a.get("rel") == "canonical"]
assert canonical == [ORIGIN + "/"], canonical
assert metadata["og:url"].rstrip("/") == ORIGIN
for name in ("og:image", "twitter:image"):
    url = urlsplit(metadata[name])
    assert url.netloc == "imagine.engineering" and url.path.endswith(".png"), metadata[name]
    png = target_file(url.path).read_bytes()
    assert png[:8] == b"\x89PNG\r\n\x1a\n" and struct.unpack(">II", png[16:24]) == (1200, 630)

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
        assert exported.is_file() and asset.read_bytes() == exported.read_bytes(), f"Altered asset: {asset}"
assert hashlib.sha256((OUT / "images/copper-origin-dev.jpg").read_bytes()).hexdigest() == "c059ac3e110494ffb6f3e80287c293629240313128a75926c46d43b4dfcc0fed", "Copper screenshot provenance changed"

for js in (OUT / "_next").rglob("*.js"):
    assert "/_vercel/insights" not in js.read_text(), "Vercel-only analytics remains"
print(f"Export verified: {len(html_files)} HTML routes, {len(references)} local references, {font_count} font references; social PNG and original Copper screenshot intact.")
