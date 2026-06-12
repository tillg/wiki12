# dm-to-fm

Generate a default **A12 Form Model** from a **Document Model** — the headless
equivalent of the SME's *"Build Screens From Fields"* action. A12 has **no**
server-side/runtime/CLI form generation (only the SME GUI; see
`specs/changes/basic_setup/findings-a12.md` §2), so wiki12 generates default
forms itself at build time. Clean-room: the output format was learned from the
real form models in `docs/a12/sample-models/reference/`
(`Contact_FM.json`, `ProjectTemplate_Person_FM.json`), not from SME source.

TypeScript, runs on Node 22's native type-stripping (no build step needed).

## Usage

```bash
# generate <X>_FM.json next to each DM (or into --out <dir>)
node --experimental-strip-types src/dm-to-fm/src/cli.ts \
  docs/a12/sample-models/document-models/*.json \
  --out docs/a12/sample-models/form-models

# or via npm scripts (cd src/dm-to-fm first)
npm run generate -- <DM.json…> [--out <dir>]
npm run typecheck     # tsc --noEmit (needs: npm install)
```

## What it produces

For a Document Model it emits a Form Model with:
- `modelType: "form"`, `modelVersion: "37.4.0"` (FM format version — **distinct
  from the DM's `28.4.0`**), and a `modelReferences` **data-binding** pointer to
  the source DM.
- one `Screen` ("Screen1"); a **`MultiColumnSection` per DM group** (depth-first),
  each with a single-column `ControlGrid` of one `Control` per field
  (`Control.elementRef` = the DM field id);
- a footer with **Save** (full validation) + **Cancel**, and default ADD/CANCEL
  button labels.

Field labels are **not** copied — the form engine reads them from the DM at
runtime. Section titles are humanized group names (`PersonalData` → "Personal
Data").

### wiki12-aware default
The field annotated `wiki12.derived="searchText"` (the internal search blob) is
**excluded** from the form — it's a generated index field, not for editing.
Override via `GenerateOptions.exclude` if needed. The `Slug` field **is** included
(shown; making it read-only is a form-config refinement for later).

## Validation
The CLI fails if any generated `Control.elementRef` doesn't resolve to a DM field
id. Beyond that, generated forms go through the same SME-feedback loop as the
models (`docs/a12/sample-models/README.md`): open them in the SME, report what it
flags, fix the generator. The output is regenerable, so fixes are reproducible.
