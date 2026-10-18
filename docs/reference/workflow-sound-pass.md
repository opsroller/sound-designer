# Workflow: `sound-pass`

*Reference: for users and agents looking up the `sound-pass` workflow's arguments, phases and outputs.*

| Field | Value |
|---|---|
| File | [`workflows/sound-pass.js`](../../workflows/sound-pass.js) |
| Command | `/sound-designer:sound-pass` |
| Arguments | `cues` (required): array of `{ name, brief }`. `scope` (optional): feature or level name used in docs. |
| Returns | `status` (`done`, `done-unverified`, `incomplete`, `blocked`), `made`, `failed`, `review_notes`, `docs`, `docs_problems`; on `done` and `done-unverified` also `handoff` and `next`; when blocked: `stage` and `problems` or `open`. |

## Phases

| Phase | Does | Skills |
|---|---|---|
| Plan | Checks names, purpose, priority, variations, output folders; lists affected Diataxis doc kinds. Stops on problems. | audio-brief-and-spotting, audio-implementation |
| Make | One agent per cue creates variations and source; returns contract, provenance and credits lines. | sound-effect-creation, music-and-adaptive-scoring, sound-provenance |
| Integrate | One agent applies all returned lines and configures cues. | audio-implementation, sound-provenance |
| Check | Reviewer checks playback, mix, budgets, provenance; up to two fix rounds. | mixing-and-loudness, audio-formats-and-budgets, sound-provenance |
| Docs | Updates the planned doc kinds and commits; returns `pages` and `undocumented`; a second agent checks one kind per page. | (Diataxis guide) |
| Handoff | Commits anything left on a feature branch, pushes, runs the project checks on the pushed head. Never opens or merges a PR. Skipped when the result is `incomplete`. | (engineering-practices git-workflow) |

## Rules

- Parallel agents write only to their own output folder; shared files (cue contract, provenance log, credits) are edited by one agent in one edit.
- A failed agent result is never treated as success: missing plans stop the run; failed reviewers mark the result unverified.
- Blockers still open after two fix rounds return `status: "blocked"` with the open items; nothing further is committed.
- `incomplete` is returned when the docs agent failed, the docs check found problems, or any cue maker failed; no handoff is made.
- `status: "blocked"` with `stage: "handoff"` is returned when the handoff step returns no branch or the project checks fail on the pushed head; `open` names the problem.
- Results from parallel agents are matched to their inputs by position, not by the name an agent echoes back.
- Usage text is returned when required arguments are missing.

## Handoff

`handoff` is the object engineering-practices
[deliver-package](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-deliver-package.md)
takes as `prior`, so pass the whole result and the sound pass ships without
being made again: `from` (`sound-designer:sound-pass`), `branch`, `pr`,
`head_sha`, `tests_pass`, `docs` (page paths), `undocumented`, `non_original` (cues from licensed or attributed sources), `notes`.
With no work package, land the branch with land-pr instead; `next` names both.

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `plan`, `make:<cue>` (one per cue), `integrate`, `review`, `fix-<round>`, `re-review-<round>`, `docs-do`, `docs-check`, `handoff`.

Independent steps: `review`, `re-review-<round>`, `docs-check`. They review work this run produced, so in inline mode send each to a reviewer with no part in the work and name them in `run.reviewers`; a step you answer yourself is reported in `self_reviewed`.
