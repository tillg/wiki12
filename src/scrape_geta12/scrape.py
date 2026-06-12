#!/usr/bin/env python3
"""Mirror the geta12.com A12 documentation into the repo as Markdown.

The geta12.com docs are a JS SPA, but the content itself is served as static
Asciidoctor HTML at predictable URLs:

    https://geta12.com/docs/<version>/<edition>/<category>/<docid>/index.html

This tool fetches each page listed in ``pages.txt`` (one ``category/docid`` per
line), extracts the ``#content`` body, absolutizes asset/link references so the
mirror stays usable offline-ish, converts to Markdown, and writes a browsable
tree under the output directory (default ``docs/a12/``).

Usage:
    python3 src/scrape_geta12/scrape.py [--out docs/a12] [--pages src/scrape_geta12/pages.txt]
                                        [--version 2025.06] [--edition ext5] [--workers 12]

Dependencies: ``markdownify`` and ``beautifulsoup4`` (``pip install --user markdownify beautifulsoup4``).

Regenerating pages.txt:
    The page list was derived by enumerating the SPA's search index
    (``/docs/<version>/<edition>/search-index.json`` -> distinct ``documentation``
    ids), harvesting child links from the section landing pages, and probing
    candidate ``<category>/`` prefixes for a 200. See README.md for details.
"""
import argparse
import concurrent.futures
import os
import urllib.parse
import urllib.request

from bs4 import BeautifulSoup
from markdownify import markdownify as md

SCRAPE_DATE = "2026-06-12"


def load_pages(path):
    pairs = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "/" in line:
                cat, docid = line.split("/", 1)
                pairs.append((cat, docid))
    return pairs


def fetch(base, cat, docid):
    url = f"{base}/{cat}/{docid}/index.html"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "wiki12-doc-mirror"})
        html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001 - report and continue
        return (cat, docid, None, f"FETCH ERROR: {e}")

    soup = BeautifulSoup(html, "html.parser")
    title_el = soup.find("title")
    title = title_el.get_text(strip=True) if title_el else docid
    content = soup.find(id="content") or soup.body
    page_base = f"{base}/{cat}/{docid}/"

    # Absolutize relative asset/link refs so images and cross-links still resolve.
    for tag, attr in (("img", "src"), ("a", "href")):
        for el in content.find_all(tag):
            v = el.get(attr)
            if not v or v.startswith(("#", "http", "mailto:")):
                continue
            el[attr] = urllib.parse.urljoin(page_base, v)

    body_md = md(str(content), heading_style="ATX", strip=["script", "style"])

    # Collapse runs of blank lines to at most one.
    out, blanks = [], 0
    for ln in body_md.split("\n"):
        if ln.strip() == "":
            blanks += 1
            if blanks <= 2:
                out.append("")
        else:
            blanks = 0
            out.append(ln.rstrip())
    body_md = "\n".join(out).strip()

    fm = (
        f"---\nsource: {url}\n"
        f"category: {cat}\ndocid: {docid}\nscraped: {SCRAPE_DATE}\n---\n\n"
    )
    return (cat, docid, f"{fm}# {title}\n\n{body_md}\n", f"OK {len(body_md)}B")


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(here, "..", ".."))
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", default=os.path.join(repo_root, "docs", "a12"))
    ap.add_argument("--pages", default=os.path.join(here, "pages.txt"))
    ap.add_argument("--version", default="2025.06")
    ap.add_argument("--edition", default="ext5")
    ap.add_argument("--workers", type=int, default=12)
    args = ap.parse_args()

    base = f"https://geta12.com/docs/{args.version}/{args.edition}"
    pairs = load_pages(args.pages)
    os.makedirs(args.out, exist_ok=True)
    print(f"Mirroring {len(pairs)} pages from {base} -> {args.out}")

    ok = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = [ex.submit(fetch, base, c, d) for c, d in pairs]
        for fut in concurrent.futures.as_completed(futs):
            cat, docid, doc, status = fut.result()
            if doc:
                d = os.path.join(args.out, cat)
                os.makedirs(d, exist_ok=True)
                with open(os.path.join(d, f"{docid}.md"), "w") as f:
                    f.write(doc)
                ok += 1
            print(f"  {cat}/{docid}: {status}")

    print(f"\nDONE: {ok}/{len(pairs)} pages written to {args.out}")


if __name__ == "__main__":
    main()
