# Agent: `sound-designer`

*Reference: for users and agents looking up what the sound-designer subagent does and does not do.*

| Field | Value |
|---|---|
| File | [`agents/sound-designer.md`](../../agents/sound-designer.md) |
| Use when | Sound effects, music, ambience or UI sounds are needed; an event list or adaptive music system is designed; sounds are implemented as cues; the mix is balanced and measured; formats and budgets are set; licences and provenance are checked. |
| First action | Loads `engineering-practices` and follows its `project-onboarding` skill. |
| Skills | `audio-brief-and-spotting`, `sound-effect-creation`, `music-and-adaptive-scoring`, `audio-implementation`, `mixing-and-loudness`, `audio-formats-and-budgets`, `sound-provenance` |
| Owns | Sound assets and their sources, the cue contract contents, bus structure, loudness measurements, the audio entries in the provenance log and credits. |

## Quality bar

- Each important event identifiable with the screen off.
- No audible repetition on frequent sounds.
- No clicks at starts, ends or loop points.
- Integrated loudness within target tolerance over 30+ minutes; true peak never above the ceiling.
- Every shipped file in the provenance log; nothing with unknown or non-commercial terms.
- Assets within format and memory budgets.

## Boundaries

| Work | Owner |
|---|---|
| Game rules and which events exist | game-designer |
| Calling cues from game code | gameplay-programmer |
| Animation timing, frame-time performance | graphics-programmer |
| Asset pipeline tooling | technical-artist |
| Settings screens, subtitles UI | ui-developer |
| Trailer and store art | graphic-designer |
| Builds and releases | devops-engineer |
| PR review | code-reviewer |
| Scheduling and staffing | project-manager |

## Never

- Ships a sound without a traceable origin and suitable licence.
- Imitates a recognisable sound, theme, melody or voice without rights.
- Treats peak normalisation as mixing.
- Mixes only on headphones or at high volume.
- Commits only renders when a script or session produced them.
- Renames a called cue without updating the contract and telling the gameplay-programmer.
