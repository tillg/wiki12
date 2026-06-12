# scrape_geta12

Mirrors the [geta12.com](https://geta12.com) A12 documentation
(version `2025.06`, edition `ext5`) into the repo as Markdown under `docs/a12/`,
so the platform reference lives in-repo and survives the SPA / future site
changes. Created for `basic_setup` Step 0 (see `specs/changes/basic_setup/plan.md`).

## Why a scraper

`geta12.com` is a JavaScript single-page app, so a plain HTTP fetch of a doc URL
returns the app shell, not the content. But the content *itself* is served as
static [Asciidoctor](https://asciidoctor.org) HTML at predictable URLs:

```
https://geta12.com/docs/<version>/<edition>/<category>/<docid>/index.html
```

The SPA just embeds that HTML in an `<iframe>`. So the mirror is plain `curl` +
HTML→Markdown — no browser rendering per page.

## Usage

```bash
pip install --user markdownify beautifulsoup4
python3 src/scrape_geta12/scrape.py            # writes docs/a12/
```

Options: `--out`, `--pages`, `--version`, `--edition`, `--workers`
(run with `-h`). Each output file carries front-matter with its `source` URL,
`category`, `docid`, and `scraped` date.

Then regenerate the browsable table of contents:

```bash
python3 src/scrape_geta12/gen_index.py   # writes docs/a12/index.md
```

## pages.txt

The list of `category/docid` pages to mirror (all 104 doc-sets). It was derived by:

1. **Enumerate doc-sets** — the SPA loads
   `…/<version>/<edition>/search-index.json` (a MiniSearch index). Its
   `storedFields` yield 104 distinct `documentation` ids (the doc-set leaves).
2. **Recover categories** — the URL category prefix isn't in the index. Section
   landing pages (e.g. `overall/a12_modeling/index.html`) link children as
   `/docs/<category>/<docid>/index.html`; harvesting those gave a partial map.
3. **Probe the rest** — remaining doc-ids were resolved by `HEAD`-probing
   candidate `<category>/` prefixes for a `200`. A handful use compound or
   non-obvious categories recovered from the index's `component` field
   (e.g. `utils_server_connector/`, `utils_logging_collections/`, and
   `diagram_editor/de-dev-docs` — "de" = Diagram Editor).

To refresh for a new A12 release, bump `--version`/`--edition` and re-derive
`pages.txt` with the steps above.
