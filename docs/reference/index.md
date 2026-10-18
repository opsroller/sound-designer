# Sound-designer reference

*Reference landing page: for users and agents looking up the parts of the sound-designer plugin.*

The plugin has one agent, seven skills and three workflows. Each has its
own page.

## Agent

- [Agent: `sound-designer`](agent.md): the subagent's mission, responsibilities, quality bar, boundaries and "never" list.

## Skills, in the order work usually flows

Planning and creation:

- [`audio-brief-and-spotting`](skill-audio-brief-and-spotting.md): audio brief and event list.
- [`sound-effect-creation`](skill-sound-effect-creation.md): synthesis, recording, layering, variations.
- [`music-and-adaptive-scoring`](skill-music-and-adaptive-scoring.md): loops, segments, layers, stingers, transitions.

Integration and delivery:

- [`audio-implementation`](skill-audio-implementation.md): cue contract, naming, runtime behaviour.
- [`mixing-and-loudness`](skill-mixing-and-loudness.md): buses, ducking, loudness measurement; [targets table](../../skills/mixing-and-loudness/loudness-targets.md).
- [`audio-formats-and-budgets`](skill-audio-formats-and-budgets.md): formats, loading, memory and voice budgets.
- [`sound-provenance`](skill-sound-provenance.md): origin and licence of every sound.

## Workflows

- [`sound-pass`](workflow-sound-pass.md): a batch of cues from plan to docs.
- [`mix-review`](workflow-mix-review.md): pre-release audit of loudness, clarity, budgets and provenance.
- [`adaptive-music`](workflow-adaptive-music.md): one adaptive music piece from structure to docs.

## Plugin manifest

`.claude-plugin/plugin.json` fields:

| Field | Value |
|---|---|
| `name` | `sound-designer` |
| `version` | `0.2.0` |
| `description` | One-sentence summary of the role |
| `author.name` | `opsroller` |
| `repository` | `https://github.com/opsroller/sound-designer` |
| `license` | `GPL-2.0-or-later` |
| `keywords` | `role`, `job-function`, `sound-design`, `game-audio`, `music`, `adaptive-audio`, `mixing`, `loudness`, `provenance` |

## Sources

The research behind the plugin is listed in [SOURCES.md](../../SOURCES.md).
