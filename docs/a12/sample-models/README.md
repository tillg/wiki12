# A12 sample models — corpus for a model-authoring agent

Goal: build up a corpus of A12 **document models** in their real serialized
(`*_DM.json`) format, so we can (later) build an agent that authors A12 models
programmatically — and get the wiki12 models we need along the way.

## The workflow (how this collection grows)

1. **Seed with ground truth** — vendor real, known-good models from upstream
   (`reference/`) and author wiki12 models in that exact format
   (`document-models/`).
2. **Validate in the SME** — Till opens each authored model in the Simple Model
   Editor and reports what the SME flags (errors, warnings, anything off).
3. **Correct** — fix the model *and* encode the lesson as a check in the
   **validator** (`src/model_tools/validate.py`) so it can never recur, and fix
   whatever produced it (format notes below, and eventually the authoring agent).
4. **Repeat / scale** — once the format is confirmed on a small batch, grow the
   collection (Till can also drop more real SME-exported models into
   `reference/`).
5. **Build the agent** — once we have enough validated examples, build an agent
   that emits new models in this format, and keep tightening it with the same
   SME-feedback loop.

> **Status: validation batch.** We deliberately started with a *few* models, not
> a large collection — there's no point mass-producing models against an
> unverified format. Validate these in the SME first; then we scale.

> **Before handing any model to the SME, run the validator:**
> `python3 src/model_tools/validate.py` — it mechanically enforces every lesson
> we've learned so far (see *Findings* below), so we stop re-making known mistakes.

## Findings (confirmed; enforced by the validator)

1. **`modelVersion` must be `28.4.0` for A12 2025.06.** First batch used `1.0.0`
   and the SME refused to open them ("wrong A12 version"). The Project Template
   (`a12-full-stack-project-template`, release 2025.06) and the tutorial app both
   use **`28.4.0`** — this is the A12 model-format version, not a version we get
   to choose. The validator derives the accepted value from the `reference/`
   models, so it stays correct as A12 evolves.

2. **wiki12 config must be FIELD-level annotations, not model-header lists.** First
   batch put `wiki12.keyFields`/`wiki12.searchFields` CSV lists in the model header;
   the SME didn't surface them on the fields (header annotations live in *Model
   Settings*, and the modeler looking at the fields saw nothing). Per
   sme-dm-ba-docs §Annotations, annotations belong on **each element** and an
   annotated field shows an **"A" icon** in the model tree. So config now lives on
   the fields themselves (see the annotation scheme below) — visible and editable
   in the SME, and robust (the annotation rides with the field, no name-list to
   desync).

## `reference/` — real, known-good models (gold)

Vendored verbatim from **[mgm-tp/a12-tutorial-application](https://github.com/mgm-tp/a12-tutorial-application)**
(`import/models/…`, public repo) — the authoritative format reference:

| File | Type | Notes |
|---|---|---|
| `Contact_DM.json` | Document model | `modelVersion` 28.4.0; groups PersonalData/Phones/Address; String/Number/Date/Enumeration fields, validation Rules |
| `Contact_FM.json` | Form model | how the DM is laid out for editing |
| `Contact_OM.json` | Overview model | list/table view over the DM |
| `Tutorial_AM.json` | Application model | ties the models into an app |
| `ProjectTemplate_Person_DM.json` | Document model | from `a12-full-stack-project-template` (release **2025.06**); `modelVersion` 28.4.0 |
| `ProjectTemplate_Person_FM.json` | Form model | its form twin; `modelVersion` **37.4.0** — the format reference for the DM→FM generator |

Do **not** edit `reference/` — it's our source of truth for the format. Add more
real SME exports here as we get them.

## `form-models/` — default form models (generated)

Default Form Models for each document model, produced by **`src/dm-to-fm/`** (the
headless "Build Screens From Fields" — A12 has no built-in form generator, see
findings-a12.md §2). Regenerate:

```bash
node --experimental-strip-types src/dm-to-fm/src/cli.ts \
  docs/a12/sample-models/document-models/*.json --out docs/a12/sample-models/form-models
```

One screen, a section per group, one control per field; the internal `searchText`
field is excluded. Pending SME validation, same loop as the document models.

## `document-models/` — wiki12 models (DRAFT, pending SME validation)

Authored by Claude in the verified format, for the wiki12 content types:

| File | Type | Key field(s) → slug | Fields | SME-validated? |
|---|---|---|---|---|
| `Page_DM.json` | built-in `page` | Title | Title, Slug, Body (markdown) | ⬜ not yet |
| `Person_DM.json` | entity `person` | FirstName + LastName | + BirthDate, Nationality, Description (markdown) | ⬜ not yet |
| `Film_DM.json` | entity `film` | Title | + ReleaseYear (number), Director, Description (markdown) | ⬜ not yet |
| `Location_DM.json` | entity `location` | Name | + Country, Description (markdown) | ⬜ not yet |

## Verified format (reverse-engineered from `reference/Contact_DM.json`)

```
{
  "header": {
    "id": "<Name>_DM",
    "modelType": "document",
    "modelVersion": "<semver>",            // e.g. "1.0.0"
    "locales": [ { "code": "en" }, { "code": "de" } ],
    "labels": [],
    "annotations": [ { "name": "roles", "value": "user" }, … ],
    "modelReferences": []                   // includes / type-def refs go here
  },
  "content": {
    "modelInfo":   { "name": "<Name>_DM", "immutable": false },
    "modelConfig": { "timeZone": "UTC", "decimalSeparator": ".",
                     "conditionLanguage": { "code": "en_US" } },
    "modelRoot": { "rootGroups": [ <element> ] }
  }
}
```

Every model element is recursive: `{ "type": "<T>", "id": "<id>", "name": "<Name>",
"<T>": { …details… } }` where `<T>` ∈ `Group` | `Field` | `Rule` | …

- **Group**: `"Group": { "repeatability": 1, "elements": [ <element>, … ] }`
  (root level holds groups; fields live inside groups).
- **Field**: `"Field": { "fieldType": <ft>, "label": [{locale,text}],
  "requirednessConfig": { "mode": "absoluteOrRelativeToNextRepAncestor" } }`
  - `fieldType` = `{ "type": "StringType" }` (bare) or
    `{ "type": "StringType", "StringType": { …config… } }`. Seen types:
    - `StringType` config: `pattern`, `errorMessage:[{locale,text}]`,
      `lineBreaksPermitted: true` (multi-line — **what wiki12 uses for markdown
      bodies**, since A12 has no native markdown/rich-text field type),
      `noValueValidation`.
    - `NumberType` (bare), `DateType` → `{ "format": "yyyy-MM-dd" }`,
      `EnumerationType` → `{ "values": [ { "value", "label":[{locale,text}] } ] }`.
- **Rule** (validation): `"Rule": { "errorEntityRelPath", "errorCode",
  "errorCondition": "<Kernel expression>", "severity": "ERROR",
  "errorMessage": [{locale,text}] }` — conditions use the Kernel language,
  e.g. `GroupFilled(RuleGroup) and FieldNotFilled(internal_filename)`.

## wiki12 field-level annotations (the config the listeners read)

Config lives on the **fields** (not the model header), so it's visible in the SME
(annotated fields show an "A" icon) and robust. The generic before-write listener
reads these to populate two **derived, read-only fields** (`Slug`, `searchText`):

| Field annotation | On which fields | Drives |
|---|---|---|
| `wiki12.keyField` = `"<order>"` | each slug key field (order = concat order) | `Slug` = slugify(concat key fields) → namespace `<type>:` → sticky `_N` |
| `wiki12.searchable` = `"true"` | each queryable field | `searchText` = normalized concat (lowercase/strip); fan-out `simple_search` runs on it |
| `wiki12.derived` = `"slug"` | the `Slug` field | marks the slug target (system-written, read-only) |
| `wiki12.derived` = `"searchText"` | the `searchText` field | marks the search blob (excluded from generated forms) |

The slug rule is **not** a Kernel computed field (Design B); the `searchText` blob
is its search twin (findings-a12.md §3). Model-level annotations are limited to
`roles`. The validator enforces this scheme (≥1 `wiki12.keyField`, exactly one
`wiki12.derived=slug`, etc.).

## Open questions to confirm in the SME (first-round risks)

1. **Mandatory fields** — we set `requirednessConfig.mode` on key fields (mirroring
   Contact_DM) but did **not** add explicit "required" Rules. Does that actually
   make a field mandatory, or is a `FieldNotFilled` Rule (or another flag) needed?
2. **Slug as a plain String field** — slug is system-maintained/read-only, but in
   the DM it's just a `StringType`. Read-only-ness belongs in the Form model.
   Confirm the SME is happy with it as a normal field.
3. **Auto-added metadata** — the tutorial notes the SME shows metadata fields it
   adds itself. Do our models need anything for that, or does the SME add it?
4. **IDs** — we used simple `G1`/`F1…`. Confirm the SME accepts author-chosen ids
   (Contact_DM mixed `G2`/`F3` with generated `group_4ca01`/`rule_6ed58`).

Resolved so far: `modelVersion` (Finding #1), field-level annotations (Finding #2).

Report whatever the SME says against each model and we'll correct both the model
and these notes.
