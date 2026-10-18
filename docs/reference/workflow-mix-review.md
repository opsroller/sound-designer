# Workflow: `mix-review`

*Reference: for users and agents looking up the `mix-review` workflow's arguments, phases and outputs.*

| Field | Value |
|---|---|
| File | [`workflows/mix-review.js`](../../workflows/mix-review.js) |
| Command | `/sound-designer:mix-review` |
| Arguments | `target` (optional): loudness target; defaults to the project profile, else console -24 LUFS ±2 LU, mobile -18 LUFS, true peak -1 dBTP. `scope` (optional): build, level or feature. |
| Returns | `status` (`done`, `done-unverified`, `incomplete`, `blocked`), `unverified` areas, `measurements` per area, `notes`, `docs`, `docs_problems`; when blocked: `open` items prefixed by area. |

## Phases

| Phase | Does | Skills |
|---|---|---|
| Plan | States target and tolerance, a 30-minute-plus capture plan, budgets, affected doc kinds. | mixing-and-loudness |
| Audit | Four read-only reviewers in parallel: loudness, clarity, budgets, provenance. | mixing-and-loudness, audio-implementation, audio-formats-and-budgets, sound-provenance |
| Fix | One agent fixes blockers; failing areas re-checked; up to two rounds. | as above |
| Docs | Records measurements and decisions; checks one kind per page. | (Diataxis guide) |

## Rules

- Parallel agents write only to their own output folder; shared files (cue contract, provenance log, credits) are edited by one agent in one edit.
- A failed agent result is never treated as success: missing plans stop the run; failed reviewers mark the result unverified.
- Blockers still open after two fix rounds return `status: "blocked"` with the open items; nothing further is committed.
- `incomplete` is returned when the docs agent failed or the docs check found problems.
- Results from parallel agents are matched to their inputs by position, not by the name an agent echoes back.
- Usage text is returned when required arguments are missing.

## Run modes

Run modes v1. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `plan`, `audit:<area>` (`audit:loudness`, `audit:clarity`, `audit:budgets`, `audit:provenance`), `fix-<round>`, `recheck:<area>`, `docs-do`, `docs-check`.
