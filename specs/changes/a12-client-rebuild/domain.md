# Domain — A12 Client rebuild

This change introduces **no new content concepts**. It re-expresses the existing
wiki12 UI in the vocabulary of the **A12 Client** runtime. Read `CONTEXT.md` for the
canonical content language; this file maps those nouns onto Client concepts.

## Existing concepts (unchanged — from CONTEXT.md)

- **Content item** — `{ type, slug, id, fields }`; the one mechanism behind Pages
  and Entities.
- **Page / Entity** — the two vocabularies over the content item (`page` is the
  default type; entities are user-defined types like `person`, `film`, `location`).
- **Slug** — read-only, system-derived human handle `<type>:<name>`; the canonical
  link (see the slug-based-urls change).
- **Technical ID** — opaque stable id; resolution is **try-ID-then-slug**.
- **Key Fields / Data Model (DM) / Form Model (FM) / Migration** — as in CONTEXT.md.
- **Standard envelope** — `Title`, `Slug`, `CreatedOn`, `Changes` (append-only),
  derived server-side and surfaced read-only on read.

## A12 Client vocabulary (new to this change)

**Application Model** *(A12 model type)*
: The declarative description of the **whole client**: which **Activities** exist,
  what **scene directives** they run (which **Views** to place in which **Regions**),
  and how navigation flows. The screenflow lives here, not in hand-written routing.

**Activity**
: A runtime unit of work with a *descriptor* (e.g. `{ model: "Person", instance:
  "__NEW__" | <docRef> }`) and a loading state. Creating an Activity triggers scene
  directives. Master/detail = an overview Activity that spawns a dependent detail
  Activity. (Client docs §"From Activities to Views to Engines".)

**View / Region**
: A View renders into a **Region** of the **Application Frame** (`header`,
  `sidebar`, `content`). A View hosts an **Engine** (or a custom component).

**Engine**
: A generic, model-driven renderer.
  - **Overview Engine** — renders a list/table/cards from a Query/Overview Model.
    wiki12's Browse + Search result lists.
  - **Form Engine** — renders a Form Model against a document for view/create/edit.
    Two-way binds values; picks the widget by data type (Date → DatePicker, …).

**Data Provider**
: The Client extension point that loads/saves an Activity's data. wiki12's data
  providers translate to the Data Service JSON-RPC ops (`QUERY`, `GET_DOCUMENT`,
  `ADD_DOCUMENT`, `MODIFY_DOCUMENT`, `DELETE_DOCUMENT`, `ResolveBySlug`,
  `UnifiedSearch`). This is the wiring that makes Form-Engine binding actually
  persist — the piece our standalone embedding lacked.

**Screen** *(this change's working term)*
: One coherent UI surface the user perceives (Browse, View, Edit, …), realized as an
  Activity + its Views + Engine. Enumerated in `screens.md`.

**Screenflow**
: The transitions between Screens (Browse → View → Edit → back; New → Create →
  View; Search → View). Declared via Activity creation/cancellation in the
  Application Model. Mirrors the deep-link routes today.

**Deep link**
: A bookmarkable URL bound to an Activity by the Client's deep-linking feature.
  wiki12 keeps `/view/<slug>`, `/edit/<slug>`, `/search?q=&type=`, resolving slugs
  via `ResolveBySlug` (try-ID-then-slug).

## Mapping wiki12 → A12 Client

| wiki12 (today)                    | A12 Client (target)                                   |
|-----------------------------------|-------------------------------------------------------|
| React Router routes               | Application Model activities + deep linking           |
| `BrowsePage` card gallery         | Overview Engine view (master)                         |
| `SearchPage` results              | Overview Engine view over `UnifiedSearch`             |
| `ViewPage` (read-only detail)     | Form Engine view, read-only mode                      |
| `EditPage` create/edit (`SimpleForm`) | Form Engine view (`__NEW__` / existing instance)  |
| `api/content.ts` + `api/search.ts`| Data Providers over the same JSON-RPC ops             |
| Milkdown markdown editor          | Custom widget in the ClientWidgetMap (`Body` field)   |
| Header search box / New dropdown  | Views in the `header` region                          |
| Login (UAA token)                 | Template's Keycloak/UAA auth                           |

## Why a fallback path existed (and is being retired)

`SimpleForm` was a deliberate workaround for broken standalone form-engine binding.
Moving onto the Client removes the need for it: binding becomes the framework's job.
`SimpleForm`, `docModel.ts`, and the bare `FormEngineHost.tsx` are retired once the
Client path renders and saves every type.
