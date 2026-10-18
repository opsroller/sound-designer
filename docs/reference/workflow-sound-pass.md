# Workflow: `sound-pass`

*Reference: for users and agents looking up the `sound-pass` workflow's arguments, phases and outputs.*

| Field | Value |
|---|---|
| File | [`workflows/sound-pass.js`](../../workflows/sound-pass.js) |
| Command | `/sound-designer:sound-pass` |
| Arguments | `cues` (required): array of `{ name, brief }`. `scope` (optional): feature or level name used in docs. |
| Returns | `status` (`done`, `done-unverified`, `blocked`), `made`, `failed`, `review_notes`, `docs`, `docs_problems`; when blocked: `stage` and `problems` or `open`. |

## Phases

| Phase | Does | Skills |
|---|---|---|
| Plan | Checks names, purpose, priority, variations, output folders; lists affected Diataxis doc kinds. Stops on problems. | audio-brief-and-spotting, audio-implementation |
| Make | One agent per cue creates variations and source; returns contract, provenance and credits lines. | sound-effect-creation, music-and-adaptive-scoring, sound-provenance |
| Integrate | One agent applies all returned lines and configures cues. | audio-implementation, sound-provenance |
| Check | Reviewer checks playback, mix, budgets, provenance; up to two fix rounds. | mixing-and-loudness, audio-formats-and-budgets, sound-provenance |
| Docs | Updates the planned doc kinds and commits; a second agent checks one kind per page. | (Diataxis guide) |

## Rules

- Parallel agents write only to their own output folder; shared files (cue contract, provenance log, credits) are edited by one agent in one edit.
- A failed agent result is never treated as success: missing plans stop the run; failed reviewers mark the result unverified.
- Blockers still open after two fix rounds return `status: "blocked"` with the open items; nothing further is committed.
- Usage text is returned when required arguments are missing.
