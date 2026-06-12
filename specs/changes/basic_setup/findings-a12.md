# Findings: A12 research (basic_setup Step 0)

Research output for the Step 0 review gate. Every claim cites the in-repo A12
documentation mirror under `docs/a12/` (geta12.com 2025.06/ext5, scraped
2026-06-12) or the A12 Widgets Showcase mirror under `docs/a12/widgets/`.

Confidence tags: **[HIGH]** explicit in docs · **[MED]** inferred from docs ·
**[LOW]** weak/absent evidence.

---

## 0. Headline: server-side extensibility gate (ADR-0002) → **GO**

**The stock A12 Data Service supports custom server-side Java logic.** All three
behaviors the wiki12 architecture rests on can live *inside* the Data Service —
no façade is required. A12 is **not** a closed black box. **[HIGH]**

The Data Service is a Spring Boot server you build and own (via the Project
Template); it exposes documented extension points:

- **Custom JSON-RPC operations / endpoints** — a Java class annotated
  `@RemoteOperation` with a public `rpc` method, registered in
  `mgmtp.a12.dataservices.jsonRpc.allowedOperations`
  (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md`;
  `docs/a12/data_services/dataservices-documentation-src.md § "Operation"`). **[HIGH]**
- **Document lifecycle hooks** — `DocumentBeforeCreateEvent`,
  `DocumentBeforeUpdateEvent`, `…After…`, `DocumentAfterLoadEvent`, etc.,
  registered via `@CommonDataServicesEventListener`. The before-write document
  is mutable and the mutation is persisted — the exact mechanism for slug
  derivation (`docs/a12/overall/dev_tutorial_backend_document_access.md`;
  `…/dev_tutorial_backend_document_manipulation.md`). **[HIGH]**
- **Injected platform APIs** — `QueryService` and `IDocumentRepository` are
  injectable into custom beans, so a write hook can query for slug collisions and
  a resolver endpoint can fetch by `docRef`
  (`docs/a12/data_services/dataservices-documentation-src.md § "IDocumentRepository"`). **[HIGH]**

**The one caveat that keeps this from being a "clean" GO:** global slug
uniqueness with a sticky numeric suffix has **no built-in primitive**. We build
it in a before-write listener (query for collisions, assign/keep `_N`). Race
safety under concurrent creates likely needs a Postgres unique index (custom
Liquibase changeset) or in-listener locking — **not documented**, flagged as a
risk. **[MED]**

> **Architectural consequence:** proceed with the **Data Service–hosted** branch
> of ADR-0002 (logic in-server), not the façade. ADR-0002 should be updated to
> record the gate as resolved = GO.

---

## 1. Data & form models — authoring, validation, registration

- **Data Model = A12 "Document Model"**, persisted as **JSON**, authored in the
  **Simple Model Editor (SME)** Document Model Editor; fields organized in
  groups, with validation/computation rules in the **Kernel Language** DSL
  (`docs/a12/overall/types_of_models.md`; `docs/a12/sme/sme-dm-ba-docs.md`). **[HIGH]**
- **Field/data types:** String, Number, Date/DateTime/Time/DateFragment/DateRange,
  Boolean, Confirm, Enumeration, **Custom**, Type Definition; plus Attachment and
  Multi-Select structural elements (`docs/a12/sme/sme-dm-ba-docs.md § "Data Type"`). **[HIGH]**
- **Registration/deployment:** models live in a **Workspace** and reach the Data
  Service via **Workspace deploy** ("Deploy All"); note Document Models deploy via
  the Workspace, not a per-editor button
  (`docs/a12/sme/sme-ba-docs.md § "Workspace Deployment"`). **[HIGH]**
- **Runtime form inputs:** a Document Model is consumed at runtime as
  `documentModel.json` + generated **`validation.js`**; the form engine binds
  (data model + form model + document) (`docs/a12/form_engine/formengine-documentation-bundle.md`). **[HIGH]**
- **Form Model** = UI model (also JSON) that references ≥1 Document Model; controls
  are references to fields; widget choice is derived from field type + a per-control
  "exposition" setting (e.g. `String + linebreaksPermitted → TextArea`)
  (`docs/a12/sme/sme-fm-ba-docs.md`; `docs/a12/form_engine/formengine-documentation-bundle.md § "Controls"`). **[HIGH]**

### Open issue — programmatic model authoring
The docs confirm models are JSON but publish **no formal JSON schema** and
document no path to author/validate models **outside the SME GUI** (no CLI/build
validator found in the read set). wiki12's plan assumes models + migrations are
file-based and CLI-managed — **we must confirm we can hand-author/generate the
model JSON** (inspect Project Template model files + `sme-dev-docs`/`kernel-documentation-dev`). **[MED risk]**

---

## 2. Default form model generation → **not server-side (as far as documented)**

- The only documented default-form mechanism is the SME **"Build Screens From
  Fields"** action — an explicit, authoring-time step that produces an editable,
  stored Form Model JSON (`docs/a12/sme/sme-fm-ba-docs.md § "Adding a New Form Model"`). **[HIGH]**
- **No evidence** that the Data Service / form engine auto-generates or serves a
  default form for a Document Model lacking a Form Model. The runtime always loads
  an explicit `formModel.json` (`docs/a12/form_engine/formengine-documentation-bundle.md`). **[HIGH for absence]**

> **Consequence for the proposal/domain "default form model" claim:** treat
> "every type has a generated default form model, server-side" as **unconfirmed
> → likely false**. Plan: generate a default Form Model at modeling/build time
> (the SME action or our own generator from the data model) and ship it, rather
> than relying on a server fallback. ADR/domain wording on this should be softened.

---

## 3. Data Service API & search

- **Protocol:** JSON-RPC 2.0 over a single `POST /api/v2/rpc`; operations can be
  batched in one transaction (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md`;
  `docs/a12/data_services/dataservices-documentation-src.md`). **[HIGH]**
- **CRUD ops:** `ADD_DOCUMENT` (create), `GET_DOCUMENT` (read by `docRef`),
  `QUERY` (read/search), plus modify/delete ops; models referenced by name,
  instances by `docRef = "<ModelName>/<uuid>"` (`docs/a12/overall/dev_tutorial_query_migration.md`). **[HIGH]**
- **Query language:** operator tree — `exact_match`, `double_range`, `date_range`,
  `undefined_match`, **`simple_search`**, with `and`/`or`/`not` and a `has`
  relationship operator (`docs/a12/overall/dev_tutorial_query_discovering_queries.md`). **[HIGH]**
- **Substring/ILIKE search exists:** `simple_search` is a **case-insensitive
  substring** match; with no `fields` it searches **all indexed fields** of the
  target model — directly satisfies wiki12's title/slug/body search
  (`docs/a12/data_services/dataservices-documentation-src.md § "Simple Search Operator"`). **[HIGH]**
  - Caveats: min token length 3 (configurable), only **indexed** fields, no query
    parser, and it is among the **slowest** operators (regex-based) — body-field
    search on a large corpus needs index tuning. **[HIGH]**
- **Slug/ID resolution (try-ID-then-slug):** fetch by ID = `GET_DOCUMENT`; fetch by
  slug = `QUERY exact_match` on the slug field. Both stock. **[HIGH]**

### Open issue — unified cross-content search
A single `QUERY` targets **one** `targetDocumentModel` (subtypes included via
heterogeneity). There is **no documented one-call search across unrelated models**.
For wiki12's "search all content (page + every entity type)" we must choose:
(a) a **shared supertype Document Model** for all content (one heterogeneous
query), or (b) **batched fan-out** (one `QUERY` per model in a single JSON-RPC
array). This is an architecture decision Step 2/4 must make. **[MED]**

---

## 4. Versioning & migration

- Instances carry a `modelVersion` in `__meta` (null in sample data — confirm it
  populates on save) (`docs/a12/overall/dev_tutorial_query_discovering_queries.md`). **[HIGH/MED]**
- A12 has a **built-in server-side migration framework**: `@MigrationStep` /
  `@MigrationTask` classes, executed once and tracked in a `migration_step` table
  (`docs/a12/data_services/dataservices-documentation-src.md § "Data Migration Support"`),
  plus a model-aware `IDocumentModelMigrator`
  (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md`). **[HIGH]**
- The **Content Engine** (page-body content models) ships its **own client-side
  TS migration tool** with versioned per-element `transform` functions
  (`docs/a12/content_engine/contentengine-dev-docs.md § "Content Model Migration"`). **[HIGH]**

> **Consequence for ADR-0003 (TS migration runner in the CLI):** A12 already
> provides a **Java-side** instance migrator that runs in-server. Two viable paths:
> keep the planned **CLI/TS runner** (consistent across page+entity, Node already
> present) *or* adopt A12's built-in `@MigrationStep`. Recommend a short ADR-0003
> revisit; the TS runner remains reasonable but is no longer the *only* option.
> The Content Engine's TS migrator is precedent for the TS approach. **[MED]**

---

## 5. A12 Forms in React + the markdown editor

- **Packages** (scope `@com.mgmtp.a12.*`): `@com.mgmtp.a12.formengine/formengine-core`,
  `@com.mgmtp.a12.widgets/widgets-core`, `@com.mgmtp.a12.client/client-core`,
  `@com.mgmtp.a12.kernel/kernel-md-facade`, `@com.mgmtp.a12.utils/*`
  (`docs/a12/form_engine/formengine-documentation-bundle.md § "Getting Started"/"Artifacts"`). **[HIGH]**
- **From-scratch integration is documented** ("Non-Redux Applications"): create a
  private Redux store, `unmarshallFormModel` + `createEmptyDocument` +
  `createEngineStore({models:{formModel,documentModel,validatorProvider}, data:{document}})`,
  render `<EngineConnected/>`. Client-side validation runs on every change but is
  **non-authoritative** — full validation must also run server-side
  (`docs/a12/form_engine/formengine-documentation-bundle.md`). **[HIGH]**
- **Markdown editor — there IS a widget:** the A12 Widgets library ships a
  **Lexical-based Rich Text Editor** (`RichTextEditor` + `DefaultRichTextEditor`),
  built on the Text Field, with pre-built plugins and a custom-plugin API
  (`docs/a12/widgets/data-entry/rich-text-editor.md` and its `default` /
  `pre-built-plugins` / `plugin-creation` sub-pages). **[HIGH]**
  - The form-engine docs alone showed no built-in rich-text widget; the **Widgets
    Showcase** (now mirrored) is where it surfaced — this is why scraping the
    showcase mattered. Binding it into a form uses the documented **custom-widget
    mechanism** (annotate the control, override the `widgetMap` entry)
    (`docs/a12/form_engine/formengine-documentation-bundle.md § "Customizing Specific Elements"`;
    `docs/a12/overall/dev_tutorial_frontend_form_customization.md`). **[HIGH]**
  - **Note on data shape:** the Rich Text Editor is rich text (Lexical), not
    markdown-native. wiki12 must decide: store markdown (serialize Lexical ↔
    markdown) vs. store the editor's rich format. A12 has **no native
    markdown/rich-text *data-model field type*** — a body is a **String field**;
    "markdown-ness" is a UI/serialization concern, not a model type
    (`docs/a12/sme/sme-dm-ba-docs.md § "Data Type"`). **[HIGH]**
- **Markdown read-view rendering:** no A12 widget renders markdown; the A12
  frontend tutorial itself uses **`react-markdown`**
  (`docs/a12/overall/dev_tutorial_frontend_application_frame.md`). **[HIGH]**

---

## 6. Distribution, access & deployment

- **Use the official Project Template, not from-scratch.** It is the canonical
  full-stack scaffold: `client/` (React frontend), `server/app` (Data Services
  backend) + `server/init`, `compose/` (docker-compose + Keycloak + Postgres)
  (`docs/a12/project_template/project-template-documentation.md`). **[HIGH]**
  - Download: `project-template-202506.5.1.tgz` (Community); build images with
    `gradle buildImagesComposeUp`. **[HIGH]**
- **docker-compose is first-class** and matches our deployment target:
  `gradle composeUp` starts **Postgres, Keycloak, Server (Data Services),
  Frontend**. Default ports: Frontend `:8081`, Server `:8082`, Postgres `:8083`,
  Keycloak `:8089`. Toolchain: JDK 21, Gradle 8.5–8.x, Node 22, Docker Compose
  ≥ 2.20 (`docs/a12/project_template/project-template-documentation.md`). **[HIGH]**
- **Licensing:** dual — **Community (free, no-auth artifacts)** vs Enterprise
  (credential-gated). The base template + Data Services + Keycloak are
  **Community**; the Helm "A12 Stack" and Notification Center are Enterprise (not
  needed for our compose wiki) (`docs/a12/overall/access_artifacts.md`;
  `docs/a12/build_and_deployment/a12-stack.md`). **[HIGH]**
- **PostgreSQL is supported and is the prod target.** External-Postgres config via
  Spring profile `dataservices-external_postgres`: `spring.datasources.dataservices.url`
  (`jdbc:postgresql://…`), `.username/.password`, `org.postgresql.Driver`, HikariCP;
  schema auto-provisioned via **Liquibase** on startup
  (`docs/a12/data_services/dataservices-documentation-src.md § "External Postgres Database"/"Database Migration"`). **[HIGH]**

### Open issue — registry/credentials & "pure docker pull" path
- The exact npm/Gradle/Docker **registry URLs + auth** for `@com.mgmtp.a12.*` are
  **not in the public docs**; they come via the Project Template's config / mgm
  onboarding. Our email is `@mgm-tp.net` (mgm-internal) → likely the **internal
  mgm Artifactory**, not `artifacts.geta12.com`. **Confirm before scaffolding.** **[risk]**
- There is **no documented "just `docker pull` a prebuilt Data Service image"**
  path for Community use — the image is produced by `gradle buildImages` from the
  template (needs the JDK/Node/Gradle toolchain). This affects how "single
  `docker compose up`" (proposal goal) is achieved: we likely build images once,
  then `compose up`. **[risk to surface]**

---

## 7. The in-repo A12 reference (deliverable)

- **`docs/a12/`** — full geta12.com 2025.06/ext5 mirror: **104 doc pages** across
  29 categories, browsable via `docs/a12/index.md`. Tool: `src/scrape_geta12/`
  (re-runnable: static Asciidoctor HTML behind the SPA, fetched with curl).
- **`docs/a12/widgets/`** — A12 Widgets Showcase mirror: **65 component pages**
  (incl. Rich Text Editor + sub-pages, and the Quick Start guide). Tool:
  `src/scrape_showcase/` (SPA captured via browser, converted to Markdown).
- **Known gap:** `widgets/data-display/charts` (nested chart group) not pinned
  down; charts unused by wiki12. `deprecated-charts` overview is mirrored.

---

## 8. Open questions / risks log (for the review gate)

1. **Slug uniqueness race-safety** — before-write listener pattern is clear, but
   concurrent-create safety (DB unique index / locking) is undocumented. **[gate]**
2. **Unified cross-content search** — shared supertype model vs. fan-out;
   architecture decision. **[gate]**
3. **Programmatic model authoring** — can we hand-author/generate Document/Form
   Model JSON outside the SME GUI? No documented schema/CLI validator found. **[gate]**
4. **Default form model** — no server-side generation; plan to generate+ship
   default forms at build time. Update domain/ADR wording. **[gate]**
5. **Migration approach** — A12 has a built-in Java migrator; revisit ADR-0003
   (TS-in-CLI remains viable). **[decision]**
6. **Registry/credentials** — internal mgm Artifactory vs geta12.com; confirm
   access for `@com.mgmtp.a12.*` and Data Service artifacts. **[blocker before Step 1]**
7. **`docker compose up` shape** — build images via Project Template + Gradle
   first; no Community pull-and-run image. Reconcile with the proposal's single
   `docker compose up` goal. **[decision]**
8. **Rich text vs markdown** — A12 Rich Text Editor is Lexical-based; decide
   markdown serialization strategy and that body fields are plain String. **[decision]**

### Suggested artifact updates if findings are accepted
- **ADR-0002:** record the gate resolved → **GO** (Data Service–hosted logic).
- **ADR-0003:** note A12's built-in migrator; confirm/justify the TS-in-CLI runner.
- **domain.md / proposal.md:** soften "server-generated default form model";
  clarify markdown body = String field + Rich Text Editor widget + react-markdown.
- **architecture.md:** adopt Project Template as the scaffold; record JSON-RPC
  `/api/v2/rpc` + `simple_search`; decide unified-search shape.
