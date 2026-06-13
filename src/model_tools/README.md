# model_tools

Tooling for authoring and checking A12 models for wiki12.

## `validate.py` — deterministic model validator

The **executable memory** of the model-authoring loop (see
`docs/a12/sample-models/README.md`). Every time the SME rejects or flags one of
our models, we encode the lesson here as a check, so the (eventual) authoring
agent can never ship that mistake again. **Run it before handing models to the SME.**

```bash
python3 src/model_tools/validate.py                 # validate docs/a12/sample-models/document-models/
python3 src/model_tools/validate.py path/to/X_DM.json …
```

Exit code `0` = all valid, `1` = at least one error (so it can gate generation/CI).

It learns the accepted `modelVersion`(s) from the known-good models in
`docs/a12/sample-models/reference/`, so it self-updates as we add ground truth
rather than hard-coding a version.

Checks currently enforced (each maps to a finding or a reference-model fact):
- valid JSON; top-level `header`/`content`; `modelType == "document"`
- **`modelVersion` ∈ reference versions** (Finding #1: SME rejects unknown
  versions — 2025.06 uses `28.4.0`)
- non-empty `locales`; `modelInfo`/`modelConfig`/`modelRoot` present
- `rootGroups` non-empty; root level holds Groups
- recursive element well-formedness (`type`/`id`/`name` + `<type>` detail object),
  known element types, known `fieldType.type`, unique element ids
- **wiki12 derived-field config**: every field named in a `wiki12.*` annotation
  (`keyFields`, `searchFields`, `slugField`, `searchField`) must exist in the model
- **markdown body/description present**: at least one searchable `StringType`
  field with `lineBreaksPermitted` (distinct from the derived `searchText` blob)
  — page needs a `body`, entities a `description` (domain.md §Markdown)

As we learn more from the SME, add checks here (and a matching note in the
sample-models README *Findings* section).
