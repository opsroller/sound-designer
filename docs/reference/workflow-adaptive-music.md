# Workflow: `adaptive-music`

*Reference: for users and agents looking up the `adaptive-music` workflow's arguments, phases and outputs.*

| Field | Value |
|---|---|
| File | [`workflows/adaptive-music.js`](../../workflows/adaptive-music.js) |
| Command | `/sound-designer:adaptive-music` |
| Arguments | `piece` (required): cue name of the piece. `states` (required): array of state names. `brief` (required): mood, setting, what the music tells the player. |
| Returns | `status` (`done`, `done-unverified`, `incomplete`, `blocked`), `piece`, `parts`, `notes`, `docs`, `docs_problems`; when blocked: `stage` and `problems` or `open`. |

## Phases

| Phase | Does | Skills |
|---|---|---|
| Plan | Chooses structure, tempo/meter/key, parts with separate output folders, transition table, doc kinds. Stops on missing triggers. | music-and-adaptive-scoring |
| Compose | One agent per part (segment, layer or stinger); returns provenance lines and loop points. | music-and-adaptive-scoring, sound-provenance |
| Implement | One agent wires states and transitions and edits contract and log once. | audio-implementation |
| Check | Reviewer forces every transition and layer combination; up to two fix rounds. | music-and-adaptive-scoring, mixing-and-loudness |
| Docs | Reference and explanation for the music system; checks one kind per page. | (Diataxis guide) |

## Rules

- Parallel agents write only to their own output folder; shared files (cue contract, provenance log, credits) are edited by one agent in one edit.
- A failed agent result is never treated as success: missing plans stop the run; failed reviewers mark the result unverified.
- Blockers still open after two fix rounds return `status: "blocked"` with the open items; nothing further is committed.
- `incomplete` is returned when the docs agent failed or the docs check found problems.
- Results from parallel agents are matched to their inputs by position, not by the name an agent echoes back.
- Usage text is returned when required arguments are missing.
