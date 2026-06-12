# wiki12

A wiki-style application built on **A12** (mgm technology partners). It manages
**content items** of typed kinds over one mechanism: a built-in **Page** type
and user-defined **Entities** (person, film, location, …). Access is through a
React/TypeScript web client, a `wiki12` command-line interface, and the standard
A12 Data Service backend, with PostgreSQL for persistence. The whole system runs
under Docker Compose.

## Status

Early specification phase. The first concrete change, **`basic_setup`**, defines
the foundational system end to end. See its spec artifacts:

- [`specs/changes/basic_setup/proposal.md`](specs/changes/basic_setup/proposal.md) — what & why
- [`specs/changes/basic_setup/domain.md`](specs/changes/basic_setup/domain.md) — domain concepts
- [`specs/changes/basic_setup/architecture.md`](specs/changes/basic_setup/architecture.md) — technical approach
- [`specs/changes/basic_setup/plan.md`](specs/changes/basic_setup/plan.md) — implementation steps (starts with an A12 research phase)

### Where we are — `basic_setup` Step 0 (A12 research) done, ⏸ at review gate

Step 0 ("understand & document A12") is complete except its final **review
gate**. We mirrored the A12 docs into the repo and answered the research
questions; the headline result is that the **server-side extensibility gate is a
GO** — slug logic, ID/slug resolution, and substring search can all live in the
stock A12 Data Service (no façade needed). What got built:

- **[`docs/a12/index.md`](docs/a12/index.md)** — in-repo mirror of the A12 docs
  (geta12.com 2025.06/ext5, **104 pages**) and the **A12 Widgets Showcase**
  (**65 pages**, incl. the Lexical Rich Text Editor and the Quick Start guide).
- **[`src/scrape_geta12/`](src/scrape_geta12)** + **[`src/scrape_showcase/`](src/scrape_showcase)**
  — the re-runnable scraper tools that produced those mirrors (see their READMEs).

**👉 Next session — read these, in order:**

1. **[`specs/changes/basic_setup/findings-a12.md`](specs/changes/basic_setup/findings-a12.md)**
   — the research findings. Start with §0 (the GO verdict) and **§8 (open
   questions / decisions)**: default form model (no server-side generation),
   unified search shape, migration approach, distribution via the A12 Project
   Template, **registry/credentials (likely blocker)**, and markdown vs. rich text.
2. Skim **[`docs/a12/index.md`](docs/a12/index.md)** — note the ⚠️ Quick Start
   callout at the top (also in [`CONTEXT.md`](CONTEXT.md)).
3. Re-check the spec artifacts above against the findings; §8 lists suggested
   updates to ADR-0002/0003, `domain.md`, and `architecture.md`.

Once the findings are approved and the §8 decisions are made, the review gate
closes and implementation starts at **Step 1** (project scaffolding) in
[`plan.md`](specs/changes/basic_setup/plan.md).

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
