# scrape_showcase

Mirrors the **A12 Widgets Showcase** (<https://www.mgm-tp.com/a12.htmlshowcase/#/>)
into the repo as Markdown under `docs/a12/widgets/`. This is the catalog of
A12's React widget library (`@com.mgmtp.a12.widgets/widgets-core`) — the
components the wiki12 client renders forms and views with. Captured for
`basic_setup` Step 0.

## Why this is a two-step (capture → convert), not a curl mirror

Unlike geta12.com (static Asciidoctor HTML behind a SPA shell), the widgets
showcase is a **fully client-rendered React SPA** — there is no static HTML to
fetch, and the route table lives in the JS bundle. So pages were captured by
driving a browser (Playwright MCP):

1. **Discover routes.** The route table isn't a clean manifest. Routes were
   recovered from the JS bundle (`static/js/index.*.js`) and by clicking the
   sidebar accordion. Every page is `#/widgets/<category>/<slug>` — categories:
   `general`, `layout`, `navigation`, `data-entry`, `data-display`, `feedback`,
   `utils`, `business-case`, plus `basics/*` and `experimental/*`. The resolved
   list is in `routes.txt` (64 pages).
2. **Capture content panels.** For each route, navigate (`location.hash`), wait
   for the `.breadcrumb-wrapper` to match (or detect the SPA's "page doesn't
   exist" 404), then serialize `.breadcrumb-wrapper`'s **parent** — the content
   panel, which excludes the left sidebar. The serialized HTML was saved to
   `tmp/widgets_raw*.json` / `tmp/charts_wizard.json`.
3. **Convert.** `convert.py` reads those JSON captures, strips the breadcrumb,
   SVGs, and Material-icon ligatures, and markdownifies each panel into
   `docs/a12/widgets/<category>/<slug>.md` with front-matter (`source`, `widget`,
   `scraped`).

```bash
pip install --user markdownify beautifulsoup4
python3 src/scrape_showcase/convert.py     # regenerates docs/a12/widgets/ from tmp captures
```

## Re-capturing from scratch

The `tmp/*.json` captures are scratch artifacts (gitignored), so `convert.py`
only re-runs against an existing capture. To refresh the mirror against a new
showcase build you must re-drive the browser to produce the capture JSON (the
panel selector and 404 string above are the load-bearing details), then convert.

## Known gap

`widgets/data-display/charts` is a nested chart **group** (Bar/Line/Pie + their
migration pages) rather than a single page; its leaves resolve through a deeper
sub-route that the capture didn't pin down. Charts are not used by wiki12, so it
was left out — the `deprecated-charts` overview page is captured. Everything
else in the catalog (64 pages) is mirrored, including the wiki12-relevant
**Rich Text Editor** (+ its `default`, `pre-built-plugins`, `plugin-creation`
sub-pages), Text Field/Area, Select, Autocomplete, Multiselect, File Upload,
Table, etc.
