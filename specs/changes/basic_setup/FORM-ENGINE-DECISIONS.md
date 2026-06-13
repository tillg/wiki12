# Form-engine load/read-back — investigation & decision (2026-06-13)

Task: wire up the A12 form-engine document **load** (populate edit form) and
**read-back** (save create/edit). Autonomous mode.

## What I found (docs-grounded, all verified live)

1. **Model-serving + auth + op shapes** — already solved earlier (QA-LOG B7–B14):
   models at `/api/v2/models/<Name>`, `UAABearer` token, `Accept-Language: en`,
   `ADD/MODIFY/DELETE_DOCUMENT` shapes.
2. **Document shape is array-of-instances.** kernel-documentation-dev.md:1131 shows
   a document is `{ "RGx": [ {field: value}, … ] }` — groups (incl. the root) are
   **arrays of group instances**, not plain objects. Our server returns object-form
   groups (`{Location:{…}}`), and `createEmptyDocument` returned `{}`. Fixed
   `FormEngineHost` to build `{ <Group>: [ {…} ] }` + `id`/`modelId`.
3. **Load/read-back pipeline.** kernel-documentation-dev.md:165 — load =
   `addTransientFields` → `parseDates`; save = `formatDates` → `removeTransientFields`.
   Implemented both.
4. **Dispatch wiring works.** The field widget is a **`BufferedTextLine`** that
   commits `onValueChange` on **blur/Enter** (not per keystroke) — that's why early
   tests saw nothing. With Enter, `form-engine/event/VALUE_CHANGE` *does* dispatch
   to our store (confirmed via a spy middleware).
5. **react-redux 7 → 9.** react-redux 7 doesn't support React 19; upgraded to 9
   (+ redux 5). (Didn't fix binding, but correct regardless.)

## The remaining blocker (unresolved)

Even with the **correct array-shaped document** in `data.document`
(`{Location:[{Name:"Ulm",…}],id,modelId}`, confirmed via the live store):
- **Read (edit):** the inputs render but stay **empty** — the widget's value
  selector doesn't surface `document.Location[0].Name`.
- **Write (create):** typing + Enter dispatches `VALUE_CHANGE`, but
  `data.document.Page[0]` stays `{}` and `dirty` stays false — the
  `onValueChangeMiddleware` doesn't write the value into the document.

Both directions fail despite the documented structure. The most likely root cause
is that our **hand-generated form models** (`src/dm-to-fm`) don't fully drive the
engine's value binding (the control→document-path resolution), and/or the bare
non-Redux bootstrap needs the kernel `DocumentV2` instance / additional engine
context that the full A12 client-core activity stack normally provides. Confirming
this would require either SME-produced form models or adopting the client-core
activity/saga stack — both beyond a bounded fix here.

## Decision

To **finish the user's actual goal** (working create/edit in the browser), I add a
**model-driven simple form** for create/edit:
- Renders an input per Data-Model field (read from `/api/v2/models/<Type>_DM`),
  skipping system/derived fields (`Slug`, `searchText`); markdown body as a textarea.
- **Load:** prefills from the server document (`document.<Group>.<field>`).
- **Read-back:** builds `{ <Group>: {…fields} }` and calls ADD/MODIFY_DOCUMENT.
- Plain React state — reliable, fully testable, no engine value-binding dependency.

Trade-off: loses A12 form-engine features (declarative validation, rich widgets,
computed fields, Milkdown-as-widget). The `FormEngineHost` + Milkdown code is kept
in the repo for a future correct integration; create/edit route to the simple form.

This is a pragmatic baseline so content is editable in the browser today; the
proper A12 form-engine binding is logged as the follow-on.

## Outcome (verified live)

Implemented the model-driven `SimpleForm` (`client/src/components/SimpleForm.tsx`)
+ `client/src/lib/docModel.ts` (parse editable fields from the DM, skipping
derived `Slug`/`searchText`); `EditPage` now uses it. **Full CRUD verified in the
browser via Playwright:**
- **Create** "Ada Lovelace" page → saved → view renders title + markdown body.
- **Edit** Ulm → form **pre-populated** (Name/Country/Description) → changed
  Description (markdown) → saved → view shows the change rendered.
- **Delete** the page → confirm dialog → removed (search returns 0).
- Plus the earlier **search / view / login** flows.

Also fixed **B21**: `MODIFY_DOCUMENT` accepts ONLY `{ docRef, document }` (adding
`documentModelName`/`locale` → `-32602 invalid params`). `ADD_DOCUMENT` keeps
`{ documentModelName, locale, document }`.

`FormEngineHost` (+ Milkdown widget) is retained as the scaffold for a future
proper A12 form-engine integration, with the load/read-back pipeline implemented
and the value-binding gap documented above.
