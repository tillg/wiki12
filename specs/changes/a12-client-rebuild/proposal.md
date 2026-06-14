# Proposal — Rebuild the web client on the A12 Client framework

## What

Replace the hand-rolled React/`SimpleForm` web client with a new client built on
the **A12 Client** runtime, started from the **A12 project template**. The UI is
declared as an **Application Model** (Activities → Views → Engines): list screens
use the **Overview Engine**, and create/edit/view screens use the **Form Engine**
as a View component — which two-way binds field values (including proper
**Date / DateTime / Time pickers**) the way our standalone form-engine embedding
could not.

The Data Service contract is **unchanged**. This is a frontend rebuild: the same
JSON-RPC ops, the same custom `ResolveBySlug` / `UnifiedSearch`, the same
server-side slug + envelope derivation.

## Why

1. **Standalone form-engine binding does not work — confirmed.** The current client
   hand-rolls forms (`SimpleForm`) because the bare `<EngineConnected>` embedding
   never persists typed values. Reproduced this session against the live engine:
   typing into a rendered control dispatches no value into the store, `ADD_DOCUMENT`
   sends `{ "Person": {} }`, and the kernel rejects it (mandatory fields). The
   engine *renders* correctly (real fields, the A12 DatePicker, validation) — only
   the value binding is dead. This is the previously-abandoned wall
   (`FormEngineHost.tsx` header note).

   **Root cause:** the standalone embedding lacks the Client framework's
   **Activity + Data-Provider + saga** wiring that drives `valueChange` into the
   document. The form-engine docs' working examples *all* run the engine **inside
   the Client** (an Activity with a single-document data provider) — not as a bare
   connected renderer.

2. **Today's date bug is a symptom.** With the hand-rolled form, a date field is a
   plain text box, so `BirthDate = 29.09.1967` reaches the kernel verbatim and is
   rejected (`-32009`, "not valid for type date representation"). A real Form Engine
   renders **Date → TextLine + DatePicker** automatically (form-engine docs control
   table) and emits the correct kernel representation — no hand-rolled date parsing.

3. **The Client is the supported host.** It gives us, for free and correctly: the
   Form Engine with working binding, the Overview Engine for lists, declarative
   screenflow, data loading/saving, deep linking, auth (Keycloak/UAA), localization,
   responsive layout.

## Scope

**In scope (new client, from the project template):**
- Adopt the project-template **Client** app and its build/run scaffolding.
- An **Application Model** declaring every wiki12 screen as Activities/Views/Engines.
- **Data Providers** mapping activity load/save to the existing JSON-RPC ops
  (`QUERY`, `GET_DOCUMENT`, `ADD_DOCUMENT`, `MODIFY_DOCUMENT`, `DELETE_DOCUMENT`)
  and the custom ops (`ResolveBySlug`, `UnifiedSearch`).
- Re-create **all current screens** (see `screens.md`): Browse, Search, View,
  Create, Edit, Delete, System/Migrations, plus the global chrome (header with the
  live global search + the **New** type dropdown; sidebar).
- Keep the **markdown body** editor (Milkdown) by registering it in the client's
  widget map for the `Body` field.
- **Slug-based deep links** (`/view/<slug>`, `/edit/<slug>`) via the Client's
  deep-linking feature, resolving slugs through `ResolveBySlug`.

**Out of scope:**
- The **Data Service** (`server/`): slug listener, `ResolveBySlug`, `UnifiedSearch`,
  envelope derivation — all unchanged.
- Document/Form **model** semantics, the migration workflow, auth model, new content
  types.
- The `wiki12` CLI (addresses items by ref, not URL).

## Expected outcome

- Creating a **Person** (and every type) works: the Form Engine renders a
  **DatePicker** for `BirthDate`, binds the value, and `ADD_DOCUMENT` succeeds with a
  valid date — the `29.09.1967` class of bug is gone by construction.
- Every screen we have today is reproduced on the A12 Client (`screens.md` is the
  build contract).
- Deep links resolve (slug or Technical ID); search is shareable; the envelope
  (`Title`, `Slug`, `CreatedOn`, `Changes`) renders read-only.

## Risks / notes

- **Large effort.** This adopts the A12 Client runtime — a different architecture
  from the current React SPA. It is deliberately a from-scratch change.
- **Server reuse.** wiki12's Data Service (custom ops, slug/envelope) is kept; the
  template's sample server models are not used. The integration seam is the JSON-RPC
  contract, which already exists and is exercised by the CLI.
- **`screens.md` is authored so another agent can build the whole client from
  scratch on the A12 Client** — it is the primary deliverable of this change.
