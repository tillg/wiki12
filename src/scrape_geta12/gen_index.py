#!/usr/bin/env python3
"""Generate docs/a12/index.md — a browsable tree of the mirrored A12 docs."""
import os, glob, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "docs", "a12"))
SCRAPE_DATE = "2026-06-12"
BASE = "https://geta12.com/docs/2025.06/ext5"

# Friendly category ordering/labels — relevant-to-wiki12 first.
CAT_LABELS = {
    "overall": "Overall (concepts, tutorials, modeling/dev guides)",
    "data_services": "Data Services",
    "crud": "CRUD",
    "content_engine": "Content Engine",
    "form_engine": "Form Engine",
    "kernel": "Kernel (validation language)",
    "sme": "Simple Model Editor (SME)",
    "client": "Client",
    "expression": "Expression Language",
    "relationship_engine": "Relationship Engine",
    "overview_engine": "Overview Engine",
    "tree_engine": "Tree Engine",
    "diagram_editor": "Diagram Editor",
    "transformer": "Transformer",
    "data_distribution": "Data Distribution",
    "notification_center": "Notification Center",
    "user_management": "User Management",
    "uaa": "UAA (auth)",
    "cms": "CMS",
    "plasma": "Plasma (design system)",
    "print_engine": "Print Engine",
    "workflows": "Workflows",
    "kernel": "Kernel",
    "base": "Base",
    "project_template": "Project Template",
    "build_and_deployment": "Build & Deployment",
    "tdg": "Test Data Generator",
    "utils_server_connector": "Utils — Server Connector",
    "utils_localization": "Utils — Localization",
    "utils_logging_collections": "Utils — Logging & Collections",
}
ORDER = list(CAT_LABELS.keys())


def title_of(path):
    with open(path) as f:
        for line in f:
            m = re.match(r"^#\s+(.*)", line)
            if m:
                return m.group(1).strip()
    return os.path.basename(path)


cats = {}
for p in glob.glob(os.path.join(ROOT, "*", "*.md")):
    cat = os.path.basename(os.path.dirname(p))
    if cat == "widgets":  # nested tree, listed separately below
        continue
    cats.setdefault(cat, []).append(p)

ordered = [c for c in ORDER if c in cats] + sorted(c for c in cats if c not in ORDER)

# Widgets Showcase mirror: docs/a12/widgets/<category>/<slug>.md (nested)
widget_root = os.path.join(ROOT, "widgets")
widget_cats = {}
for p in glob.glob(os.path.join(widget_root, "**", "*.md"), recursive=True):
    cat = os.path.relpath(p, widget_root).split(os.sep)[0]
    widget_cats.setdefault(cat, []).append(p)
widget_total = sum(len(v) for v in widget_cats.values())

lines = [
    "# A12 Documentation Mirror",
    "",
    "> ## ⚠️ START HERE for any new A12 Widgets–based project",
    "> **Follow the A12 Widgets Quick Start guide _first_:**",
    "> <https://www.mgm-tp.com/a12.htmlshowcase/#/get-started/quick-start>",
    "> (in-repo mirror: [`widgets/get-started/quick-start.md`](widgets/get-started/quick-start.md))",
    ">",
    "> Setting up the environment, packages, and providers per the Quick Start before "
    "writing widget code avoids re-deriving the bootstrapping by hand. Don't skip it.",
    "",
    f"In-repo mirror of the [geta12.com]({BASE}/overall/what_is_a12/index.html) "
    "A12 platform documentation, **version 2025.06 / edition ext5**.",
    "",
    f"- **Scraped:** {SCRAPE_DATE}",
    f"- **Source:** `{BASE}/<category>/<docid>/index.html`",
    f"- **Pages:** {sum(len(v) for v in cats.values())} across {len(cats)} categories",
    "- **Tool:** `src/scrape_geta12/` (re-runnable; see its README)",
    "",
    "Each page is Markdown converted from the original Asciidoctor HTML; "
    "front-matter records the `source` URL and scrape date. Images/links point "
    "back at geta12.com (absolutized), so they need network to render.",
    "",
    "## A12 community & support (not in this mirror)",
    "",
    "Questions the docs don't answer often have answers here — check before "
    "assuming a capability is missing:",
    "",
    "- **A12 Discourse forum** — <https://discourse.geta12.com/> — community Q&A. "
    "(e.g. global field uniqueness is discussed in "
    "[topic 1214 \"Validate field is unique between documents\"](https://discourse.geta12.com/t/1214).)",
    "- **A12 training / e-learning** — <https://training.geta12.com/> (GetA12 login).",
    "- **A12 Support Portal** — mgm Jira service desk for partners (tickets).",
    "",
    "## Sections",
    "",
]
for cat in ordered:
    label = CAT_LABELS.get(cat, cat.replace("_", " ").title())
    lines.append(f"### {label} — `{cat}/`")
    lines.append("")
    for p in sorted(cats[cat]):
        rel = os.path.relpath(p, ROOT)
        lines.append(f"- [{title_of(p)}]({rel})")
    lines.append("")

# Widgets Showcase section
if widget_cats:
    lines += [
        "## Widgets Showcase",
        "",
        f"Mirror of the [A12 Widgets Showcase](https://www.mgm-tp.com/a12.htmlshowcase/#/) "
        f"(`@com.mgmtp.a12.widgets/widgets-core`) — {widget_total} component pages. "
        "Tool: `src/scrape_showcase/`.",
        "",
    ]
    for cat in sorted(widget_cats):
        lines.append(f"### Widgets — {cat.replace('-', ' ').title()} — `widgets/{cat}/`")
        lines.append("")
        for p in sorted(widget_cats[cat]):
            rel = os.path.relpath(p, ROOT)
            lines.append(f"- [{title_of(p)}]({rel})")
        lines.append("")

with open(os.path.join(ROOT, "index.md"), "w") as f:
    f.write("\n".join(lines).rstrip() + "\n")
print("wrote", os.path.join(ROOT, "index.md"))
