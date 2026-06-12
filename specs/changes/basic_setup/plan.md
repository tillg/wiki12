# Plan: basic_setup

Ordered implementation steps. Read `proposal.md`, `domain.md`, and
`architecture.md` first. Each task is sized for a single implementation step.

## 0. Understand & document A12 (research — review gate before proceeding)

Goal: before writing any code, learn how A12 actually works and capture the
findings so the rest of the plan rests on facts, not assumptions. Record results
in `specs/changes/basic_setup/findings-a12.md`.

> **Sources for this research:**
> - **A12 source code** — the A12 products are on GitHub:
>   <https://github.com/orgs/mgm-tp/repositories?q=a12>
> - **Concepts / overview / docs** — <https://geta12.com/#/docs/2025.06/ext5/overall/what_is_a12>
>   ⚠️ `geta12.com` is a JavaScript-heavy **Single Page App** — plain HTTP fetch
>   won't return the rendered content. Use a browser tool (Playwright MCP) to
>   read it.

- [ ] **Vendor the full A12 documentation into the repo (deliverable)**: scrape
      the entire geta12.com documentation set (version **2025.06**, the `ext5`
      docs linked above) and commit it under **`docs/a12/`**, so the platform
      reference lives in-repo and survives the SPA / future site changes. Because
      the site is a JS SPA, render each page with the Playwright MCP and save it
      as Markdown (or HTML), **preserving the navigation/section tree** so the
      mirror is browsable. Capture an `index.md` with the doc tree and the
      source URL + scrape date. This in-repo mirror is the durable reference the
      rest of Step 0's findings cite.

- [ ] **Data & form models**: How do we *author*, *validate*, and *register* A12
      data models and form models? What is the file format / schema, and what
      tooling validates them (modeler, CLI, build step)?
- [ ] **Server-side extensibility — the central go/no-go (ADR-0002)**: Can the
      stock Data Service run custom server-side logic/queries (computed fields /
      write hooks / interceptors / custom search)? Slug derivation, slug
      resolution, and unified substring search all depend on this. Resolve it as
      a single gate: YES → logic lives in the Data Service; NO → a thin façade in
      front of it owns all three and A12 is pure storage.
- [ ] **Default form model generation**: Confirm A12 generates and **stores** a
      default form model from a data model server-side, and that the client form
      engine renders from (data model + form model + document) with client-side
      validation. Where is generation triggered, and how is it managed/persisted?
- [ ] **Data Service**: How and where do we obtain the A12 Data Service (Java)?
      Distribution (Maven artifact / Docker image / source), license/access,
      version, and its config + persistence wiring to PostgreSQL.
- [ ] **Data Service API**: What is the CRUD/query contract (endpoints, payload
      shape, how models are referenced, how search is expressed)?
- [ ] **A12 Forms in React**: How do we integrate A12 Forms/widgets into a
      from-scratch React+TS app? Packages (npm registry/access), required
      providers/bootstrapping, how a form model is bound to a widget tree, and
      markdown field support.
- [ ] **Markdown as a model field type**: How do we extend A12's model
      capabilities to represent markdown fields? Is there a native rich-text/text
      type to reuse, or do we define a custom field type/format, and how does
      that flow through data model → form model → validation?
- [ ] **Markdown editor in A12 forms**: How do we integrate a markdown editor
      into an A12 form? Is there a built-in/custom widget mechanism, how is it
      bound to a markdown field, and what editor component do we wrap?
- [ ] **Versioning & migration hooks**: How does A12 represent data-model
      versions on instances, and what is the supported path to migrate instances
      across versions (informs the TS migration runner)?
- [ ] **Access**: Confirm how we get A12 artifacts and docs — the A12 product
      repos (<https://github.com/orgs/mgm-tp/repositories?q=a12>), any registry
      creds for published packages, and reachability of the geta12.com docs (see
      Sources note above).
- [ ] **Open questions log**: capture anything unresolved as explicit risks.
- [ ] **REVIEW GATE**: present `findings-a12.md` to the user and walk through it
      together. The headline output is the **extensibility go/no-go** — it selects
      the architecture (Data Service vs. façade per ADR-0002). Do not start Step 1
      until the user has reviewed and approved the findings (and any plan
      adjustments they imply).

## 1. Project scaffolding & infrastructure

- [ ] Initialize the monorepo layout: `server/`, `client/`, `cli/`,
      `models/`, `migrations/`, `docker/`.
- [ ] Add `docker-compose.yml` with `postgres`, `data-service`, and `client`
      services on a shared network.
- [ ] Configure PostgreSQL service (volume, credentials via env, healthcheck).
- [ ] Provision the A12 Data Service (Java) container; wire DB connection;
      depend on healthy `postgres`.
- [ ] `docker compose up` brings up all three services and they report healthy.

## 2. Data models

- [ ] Define the `page` data model (`title`, `slug`, `body` markdown, `id`),
      versioned at v1.
- [ ] Define entity data models for `person`, `film`, `location` (common fields
      `type`, `slug`, `id`, markdown description + type-specific fields), v1.
- [ ] Register models with the Data Service; confirm generic CRUD endpoints
      respond for each model.
- [ ] Enforce slug rules server-side (or in the façade, per the Step 0 gate):
      slugs are read-only, **namespaced `<type>:<name>`** (page: from title →
      `page:<name>`; entity: from the type's key fields), lowercase `[a-z0-9_]`
      with `_` separator and `:` delimiter; `page` is the default namespace.
      (Re)computed on create and on key-field change; **globally unique** with a
      **sticky `_N` suffix** on collision (fixed at creation).
- [ ] Resolve items by **either Technical ID or slug** (try-ID-then-slug; reserve
      the ID grammar so slugs can't collide with it; bare names default to
      `page:`).
- [ ] Have the Data Service return the old → new slug when a write changes it, so
      clients can notify the user; the old slug then 404s.

## 3. Form models

- [ ] Confirm server-side default form model generation works for each data
      model (forms render with no explicit form model), with the form model
      stored/managed server-side and the client form engine rendering from (data
      model + form model + document).
- [ ] Add an explicit form model for `page` (markdown body editor layout) as the
      reference example.

## 4. Web client (React + A12 widgets)

- [ ] Scaffold the React/TS app from the A12 widgets quick start; point it at the
      Data Service.
- [ ] Implement **search** against the unified search endpoint (all content over
      title/slug/body), rendering the typed results (kind/type, slug, snippet).
- [ ] Implement **read/view** with markdown rendering.
- [ ] Implement **create/edit** using form models (markdown editor for bodies);
      render the slug as read-only.
- [ ] When an edit changes the slug, show a **clear notification** (e.g. toast/
      banner stating the slug changed old → new).
- [ ] Implement **delete** with confirmation.
- [ ] Build the client into the `client` container (served static, e.g. nginx).
- [ ] Verify in a browser: search → open → edit → save → delete round-trips for
      both a Page and an Entity.

## 5. `wiki12` CLI (Node/TS)

- [ ] Scaffold the CLI with a command framework and global `-h/--help`.
- [ ] `wiki12 search <query> [--kind ...] [--type ...]` (unified search).
- [ ] `wiki12 page create|read|update|delete|search` (sugar for `entity --type
      page`); accept either Technical ID or slug as the item argument.
- [ ] `wiki12 entity create|read|update|delete|search --type <type>`; accept
      either Technical ID or slug.
- [ ] `wiki12 model create|read|update <type>` — data models for any type,
      `page` included.
- [ ] `wiki12 form create|read|update <type>` — form models for any type, `page`
      included.
- [ ] Ensure every command and subcommand has `-h` documentation; add a top-level
      usage overview.
- [ ] When an `update` changes an item's slug, print a **clear message** stating
      the slug changed old → new.
- [ ] Verify CLI operations hit the same Data Service and stay consistent with
      the web client.

## 6. Migrations

- [ ] Define the migration convention: `migrations/<type>/<from>-<to>.ts`
      exporting a single-document transform `(doc at vN) → (doc at vN+1)`.
- [ ] Implement the migration runner in the CLI: `wiki12 migrate <type>
      --from <v> --to <v> [--dry-run]` (runner owns iteration, IO, reporting).
- [ ] **Gate the version bump**: `wiki12 model update <type> --version N` refuses
      unless `migrations/<type>/<N-1>-<N>.ts` exists (`page` included).
- [ ] Provide a worked example: bump one data model to v2 and ship its `1-2.ts`
      migration.
- [ ] Verify: `--dry-run` reports affected instances **and the old→new slug
      manifest** when key fields change; a real run upgrades all v1 instances to
      v2 with a summary report and no data loss.

## 7. Seed & verification

- [ ] Add a seed step (CLI or init script) creating a few sample pages and
      entities (incl. `person:till_gartner`).
- [ ] End-to-end check: fresh `docker compose up`, browse the seeded content,
      perform CRUD from both web and CLI.
- [ ] Write a short `README.md`: run instructions, CLI usage, model/migration
      workflow.

## 8. Hand-off to system description

- [ ] After apply, promote the stabilized `domain.md` and `architecture.md`
      into `specs/system/` (via `/spec:document-system`) as the project baseline.
