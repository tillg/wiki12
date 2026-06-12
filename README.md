# wiki12

A wiki-style application built on **A12** (mgm technology partners). It manages
two kinds of content — **Pages** and typed **Entities** (person, film,
location, …) — through a React/TypeScript web client, a `wiki12` command-line
interface, and the standard A12 Data Service backend, with PostgreSQL for
persistence. The whole system runs under Docker Compose.

## Status

Early specification phase. The first concrete change, **`basic_setup`**, defines
the foundational system end to end. See its spec artifacts:

- [`specs/changes/basic_setup/proposal.md`](specs/changes/basic_setup/proposal.md) — what & why
- [`specs/changes/basic_setup/domain.md`](specs/changes/basic_setup/domain.md) — domain concepts
- [`specs/changes/basic_setup/architecture.md`](specs/changes/basic_setup/architecture.md) — technical approach
- [`specs/changes/basic_setup/plan.md`](specs/changes/basic_setup/plan.md) — implementation steps (starts with an A12 research phase)

## Core concepts

- **Page** — basic wiki item: `title`, `slug` (derived from the title),
  technical ID, markdown `body`.
- **Entity** — typed item with a globally unique namespaced slug, e.g.
  `person:till_gartner`.
- **Data model / form model** — content structure is model-driven via A12; form
  models are auto-generated when not provided.
- **Migrations** — TypeScript scripts upgrade existing instances when a data
  model changes version.

## Planned stack

| Layer | Technology |
|---|---|
| Backend | A12 Data Service (Java) |
| Database | PostgreSQL |
| Web client | React + TypeScript with A12 widgets |
| CLI | `wiki12` (Node/TypeScript) |
| Orchestration | Docker Compose |

## License

TBD.
