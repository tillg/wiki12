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

TBD.
