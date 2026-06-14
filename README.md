# wiki12

A wiki-style application built on **A12** (mgm technology partners). It manages
**content items** of typed kinds over one mechanism: a built-in **Page** type
and user-defined **Entities** (person, film, location, …). Access is through a
React/TypeScript web client, a `wiki12` command-line interface, and the standard
A12 Data Service backend, with PostgreSQL for persistence. The whole system runs
under Docker Compose.

## Status

**`basic_setup` baseline implemented (offline-verified).** The first change,
**`basic_setup`**, bootstraps the whole system end to end. Every component is in
place; everything verifiable without a live A12 stack is built and tested:

- **108 tests pass** — `wiki12` CLI (39), model-lifecycle service (18), DM→FM
  generator (5), web client (21), Java `Slugifier` (25).
- **4 data models validate** (`page`, `person`, `film`, `location`) + the
  `Migration` model; default form models generated, plus an explicit `Page` form.
- **The web client type-checks and bundles against the real A12 widget stack**
  (`@com.mgmtp.a12.*` from `artifacts.geta12.com`).
- **`docker compose config` is valid** for the five-service stack.

What still needs a **running stack / external build to verify** (no missing code —
see [`specs/changes/basic_setup/DECISIONS.md`](specs/changes/basic_setup/DECISIONS.md)
D0/D13): building the Java Data Service image (Gradle pulls A12 Maven artifacts),
`docker compose up` health, the **slug-concurrency spike**, the live browser
round-trip, and confirming the handful of A12 `// VERIFY` op/event shapes the
TS/Java code assumes (listed in each component's `README.md`).

Spec artifacts: [proposal](specs/changes/basic_setup/proposal.md) ·
[domain](specs/changes/basic_setup/domain.md) ·
[architecture](specs/changes/basic_setup/architecture.md) ·
[plan](specs/changes/basic_setup/plan.md) ·
[findings](specs/changes/basic_setup/findings-a12.md) ·
[decisions](specs/changes/basic_setup/DECISIONS.md).

## Repository layout

| Path | What |
|---|---|
| `server/` | A12 Data Service (Java/Spring Boot): slug listener, `ResolveBySlug` + `UnifiedSearch` ops, `Slugifier`, Dockerfile |
| `client/` | React + TypeScript web client on A12 Widgets (search/read/edit/delete, Milkdown, System area), nginx |
| `model-lifecycle/` | Node service: form-model generation + TS migration runner (esbuild + `isolated-vm` sandbox) |
| `cli/` | the `wiki12` CLI (Node/TS) |
| `models/` | canonical document models + generated/explicit form models |
| `src/dm-to-fm/`, `src/model_tools/` | shared DM→FM generator + the model validator |
| `docker/`, `docker-compose.yml`, `justfile` | Postgres/Keycloak config + orchestration |
| `seed/` | sample content + a seed runner (drives the CLI) |
| `docs/a12/` | in-repo A12 docs mirror (104 pages) + Widgets Showcase (65 pages) |

## Running it

```sh
cp .env.example .env          # adjust ports/credentials if needed
just dev                      # docker compose up --build (all 5 services)
# client http://localhost:8081 · data-service :8082 · keycloak :8089 (admin/admin)
just seed                     # create sample pages + entities (stack must be up)
```

Every build bumps the **patch** (3rd) number of the stack `VERSION` and stamps it
into all images as `WIKI12_VERSION` — `just build`, `just dev`, and `just up` each
run `just bump` first (deterministic, `scripts/bump-version.sh`; edit `VERSION`
directly for major/minor bumps).

Other recipes: `just check` (validate compose), `just validate-models`,
`just generate-forms`, `just test` (all offline tests + model validation),
`just bump` (patch-bump `VERSION`), `just logs <service>`, `just dev-clean`. The
`wiki12` CLI:

```sh
node --experimental-strip-types cli/src/index.ts --help
wiki12 search einstein
wiki12 page create --field Title="Albert Einstein" --field Body="# ..."
wiki12 entity create --type person --field FirstName=Till --field LastName=Gartner
wiki12 migrate person --from 1 --to 2 --dry-run
```

## Core concepts

- **Content item** — the single underlying mechanism: a typed, versioned item
  with a technical ID and a namespaced slug `<type>:<name>`. "Page" and "Entity"
  are vocabulary over this one mechanism, not separate implementations.
- **Page** — a content item of the built-in **`page`** type: `title`, markdown
  `body`, technical ID, slug `page:albert_einstein`. The `page` type always
  exists and is the default slug namespace (a bare `albert_einstein` resolves as
  `page:albert_einstein`).
- **Entity** — a content item of a user-defined type, with a globally unique
  namespaced slug, e.g. `person:till_gartner`.
- **Content envelope** — every content item carries three standard,
  system-maintained fields beyond its own: **CreatedOn** (stamped once at create),
  a **Title** display label (authored or derived from the key fields), and an
  append-only **Changes** log (one `{ ChangedOn, Summary }` entry per write). All
  read-only, derived in the Data Service write transaction.
- **Data model / form model** — content structure is model-driven via A12; form
  models are auto-generated when not provided (derived envelope fields are
  excluded from edit forms).
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

## Developer skills

This repo ships a set of [agent skills](https://github.com/mattpocock/skills) by
[Matt Pocock](https://github.com/mattpocock) that help drive disciplined
engineering with AI coding agents. They're installed for **both** agents in the
same `SKILL.md` format, just in each agent's conventional location:

- **Claude Code** → [`.claude/skills/`](.claude/skills) (auto-discovered when the repo is opened)
- **OpenAI Codex** → [`.agents/skills/`](.agents/skills) (Codex scans `$CWD/.agents/skills`)

Invoke a skill in your agent with its slash command, e.g. `/tdd`.

| Skill | What it does |
|---|---|
| `/grill-with-docs` | Relentless grilling session that stress-tests your plan against the project's domain model and updates docs (CONTEXT.md, ADRs) inline as decisions are made. |
| `/tdd` | Test-driven development with a red → green → refactor loop; test-first feature work and bug fixes. |
| `/diagnose` | Disciplined diagnosis loop for hard bugs and perf regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test. |
| `/to-prd` | Turns the current conversation into a **PRD** and publishes it to the issue tracker. |
| `/zoom-out` | Asks the agent to step back and explain how a piece of code fits the bigger picture. |
| `/improve-codebase-architecture` | Finds architecture/refactoring "deepening" opportunities, guided by CONTEXT.md and ADRs. |

> **What's a PRD?** A *Product Requirements Document* — a short write-up that
> says, in plain language, **what** we're building and **why**, who it's for, and
> what "done" looks like (problem, solution, user stories, key decisions). It's
> the shared description everyone agrees on *before* code gets written, so the
> agent builds the thing you actually meant.

Skills are vendored copies; to update them, re-pull from
[`mattpocock/skills`](https://github.com/mattpocock/skills).

## License

Licensed under the **European Union Public Licence v. 1.2 (EUPL-1.2)** —
`SPDX-License-Identifier: EUPL-1.2`. See [`LICENSE`](LICENSE) for the full text.
Copyright © 2026 mgm technology partners GmbH.
