#!/usr/bin/env python3
"""Convert captured A12 Widgets Showcase content panels into Markdown.

The widgets showcase (https://www.mgm-tp.com/a12.htmlshowcase/#/) is a fully
client-rendered React SPA — content is not static HTML, so pages were captured
by driving the browser (Playwright MCP): for each route the `.breadcrumb-wrapper`
parent (the content panel, excluding the sidebar) was serialized to HTML and
saved as JSON under tmp/. This script converts those captures to Markdown under
docs/a12/widgets/, mirroring the showcase route tree.

Input JSON files (each: {"results":[{route,title,breadcrumb,html,htmlLen,notFound}]}
or the charts_wizard shape {"data": {Label: {hash,html,...}}}).

Usage: python3 src/scrape_showcase/convert.py
"""
import glob
import json
import os
import re

from bs4 import BeautifulSoup
from markdownify import markdownify as md

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(REPO, "docs", "a12", "widgets")
TMP = os.path.join(REPO, "tmp")
SHOWCASE = "https://www.mgm-tp.com/a12.htmlshowcase/#/"
SCRAPED = "2026-06-12"

INPUTS = ["widgets_raw.json", "widgets_raw2.json", "widgets_raw3.json",
          "charts_wizard.json", "quickstart.json"]


def entries():
    """Yield {route,title,breadcrumb,html} from all capture files."""
    for name in INPUTS:
        path = os.path.join(TMP, name)
        if not os.path.exists(path):
            continue
        d = json.load(open(path))
        if "results" in d:
            for r in d["results"]:
                yield r
        if "data" in d:  # charts_wizard shape, keyed by label, route from hash
            for label, v in d["data"].items():
                if isinstance(v, dict) and v.get("hash"):
                    v = dict(v)
                    v["route"] = v["hash"].lstrip("#/")
                    yield v
        if "results" not in d and "data" not in d and d.get("html"):
            # single-page capture (e.g. quickstart): route from hash
            v = dict(d)
            v["route"] = (d.get("hash") or "").lstrip("#/")
            yield v


def clean_route(route):
    route = (route or "").strip("/")
    # store rich-text-editor sub-pages nested; drop the leading "widgets/"
    if route.startswith("widgets/"):
        route = route[len("widgets/"):]
    return route


def to_markdown(html):
    soup = BeautifulSoup(html, "html.parser")
    # Drop the breadcrumb wrapper itself (we render our own title) and noisy svg.
    for sel in soup.select(".breadcrumb-wrapper"):
        sel.decompose()
    for svg in soup.find_all("svg"):
        svg.decompose()
    body = md(str(soup), heading_style="ATX", strip=["script", "style"])
    # Strip Material-icon ligatures that render as standalone italic tokens (pure UI chrome).
    ICONS = ("link", "open_in_new", "more_horiz", "more_vert", "content_copy", "launch",
             "keyboard_arrow_down", "keyboard_arrow_up", "keyboard_arrow_right",
             "keyboard_arrow_left", "expand_more", "chevron_right", "arrow_forward")
    body = re.sub(r"\*(?:" + "|".join(ICONS) + r")\*", "", body)
    out, blanks = [], 0
    for ln in body.split("\n"):
        if ln.strip() == "":
            blanks += 1
            if blanks <= 2:
                out.append("")
        else:
            blanks = 0
            out.append(ln.rstrip())
    return "\n".join(out).strip()


def main():
    seen = {}
    for e in entries():
        if not e or not e.get("html") or e.get("notFound") or e.get("htmlLen", 0) <= 500:
            continue
        orig = (e.get("route") or "").strip("/")
        route = clean_route(orig)
        if not route or route in seen:
            continue
        e = dict(e)
        e["_orig"] = orig  # full showcase hash path, for the source URL
        seen[route] = e

    count = 0
    for route, e in sorted(seen.items()):
        rel = route + ".md"
        path = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        title = (e.get("breadcrumb") or e.get("title") or route).replace(" - Widgets Showcase", "")
        body = to_markdown(e["html"])
        fm = (
            f"---\nsource: {SHOWCASE}{e['_orig']}\n"
            f"widget: {route}\nscraped: {SCRAPED}\n---\n\n"
        )
        with open(path, "w") as f:
            f.write(f"{fm}# {title}\n\n{body}\n")
        count += 1
    print(f"Wrote {count} widget pages to {OUT}")


if __name__ == "__main__":
    main()
