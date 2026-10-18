# Sound Designer

The sound-designer plugin gives Claude Code the job function of a sound
designer: it plans what a product must sound like, creates original
sound effects, music and ambience by synthesis, recording and layering,
designs adaptive music, implements everything as named cues, mixes to a
measured loudness target within format and memory budgets, and records
the origin and licence of every sound. It is a job, not a project: the
project you use it on names the tools, paths and targets in its own
`CLAUDE.md` and project profile.

The plugin contains one agent (`sound-designer`), seven skills and three
workflows (`sound-pass`, `mix-review`, `adaptive-music`). It builds on
`engineering-practices`.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install engineering-practices@opsroller
/plugin install sound-designer@opsroller
```

## Documentation

**New to the plugin?** Start with the tutorial
[Build your first sound cue](docs/tutorials/first-task.md), which takes one
interface sound from brief to committed, documented cue.

**Getting a job done?** The how-to guides cover the common tasks:
[run a sound pass](docs/how-to/how-to-run-a-sound-pass.md) for a batch of cues,
[add adaptive music](docs/how-to/how-to-add-adaptive-music.md),
[measure a game's loudness](docs/how-to/how-to-measure-game-loudness.md),
[review the mix before release](docs/how-to/how-to-review-the-mix-before-release.md), and
[clear a third-party sound](docs/how-to/how-to-clear-a-third-party-sound.md).

**Looking something up?** The [reference index](docs/reference/index.md)
describes the agent, each skill and each workflow's arguments, phases and
outputs, and links the research in [SOURCES.md](SOURCES.md).

**Want the background?** [About the sound-designer role](docs/explanation/about-the-role.md)
explains what the job is, why sound is treated as gameplay information,
why loudness is measured, why provenance is part of the craft, and how
the role grows from junior to senior.

Changes follow Conventional Commits and are squash-merged; versions are
tagged with semver (`v0.1.0`).

## License

Copyright (C) 2026 the contributors. Licensed under the GNU General Public License v2.0 or later (`GPL-2.0-or-later`); see `LICENSE`.
