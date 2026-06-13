# models

Canonical, deployable A12 models for wiki12. These are the models registered
with the Data Service (one data model per content type, plus its form model).

```
models/
├── document-models/   # canonical deployable Document Models (DMs)
│   ├── Page_DM.json        built-in `page` type
│   ├── Person_DM.json      entity type `person`
│   ├── Film_DM.json        entity type `film`
│   └── Location_DM.json    entity type `location`
└── form-models/       # Form Models (FMs)
    ├── Page_FM.json        EXPLICIT, hand-tuned (markdown body editor)
    ├── Person_FM.json      generated default
    ├── Film_FM.json        generated default
    └── Location_FM.json    generated default
```

- **`document-models/`** — the canonical, deployable Document Models. Each is a
  versioned structural definition of one content type (`modelVersion 28.4.0`,
  A12 2025.06). Source of truth for the deployed schema. The hand-authored
  originals under `docs/a12/sample-models/document-models/` are kept only as
  reference; this directory is what ships.
- **`form-models/`** — the Form Models (presentation/editing). Three are
  **generated defaults** (one screen, a section per group, one control per
  field) from the matching DM. `Page_FM.json` is the one **explicit** form model
  — a worked reference example with the markdown body in a full-width editor row
  (see below).

## Validate the document models

```bash
just validate-models
# = python3 src/model_tools/validate.py models/document-models/*.json
```

Must exit `0` before models are handed to the SME / registered. The validator
(`src/model_tools/validate.py`) is the executable memory of the model-authoring
loop — every SME finding is encoded there as a check.

## (Re)generate the form models

```bash
just generate-forms
# = node --experimental-strip-types src/dm-to-fm/src/cli.ts \
#       models/document-models/*_DM.json --out models/form-models
```

Generation is reproducible: it overwrites each generated default and **skips**
`Page_FM.json` because it is marked explicit (header annotation
`wiki12.formModel="explicit"`). The CLI fails if any generated control fails to
resolve to a DM field. Tooling lives in `src/dm-to-fm/` (`npm test` there for
the generator unit tests).

## Annotation conventions (what the slug/search listener relies on)

The wiki12 server-side listener reads these field-level annotations off the
document model to derive slugs and the search blob (see `domain.md`):

| Annotation | Value | Meaning |
|---|---|---|
| `wiki12.keyField` | `"1"`, `"2"`, … | This field is a **key field**; the value is its order. The slug `<name>` is derived from the key fields in order (page: `title`; person: `first` + `last` → `person:till_gartner`). |
| `wiki12.derived` | `"slug"` | This field **holds the derived slug**. Read-only; the system maintains it (exactly one per model). |
| `wiki12.derived` | `"searchText"` | This field **holds the generated search blob** (concatenated searchable fields). Read-only; excluded from generated forms. |
| `wiki12.searchable` | `"true"` | This field's text feeds the `searchText` blob (substring search over title/slug/body etc.). |

A conforming content type therefore has: at least one `wiki12.keyField` (unique
order values), exactly one `wiki12.derived="slug"` field, at most one
`wiki12.derived="searchText"` field, and a searchable markdown body/description
(`StringType` with `lineBreaksPermitted`). The validator enforces all of these.
