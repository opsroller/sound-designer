# Sound Designer

Sound designer: creates original sound effects, music and ambience, and integrates them through a cue system with clean mixing.

This plugin is a **job function**, not a project. It says how the job is done; the project it works on says with which tools, in its `CLAUDE.md` and project profile.

## Skills

| Skill | Use when |
|---|---|
| `sound-synthesis` | Use when generating sound effects or music, especially by script. |
| `audio-integration` | Use when connecting sounds to game events: cue tables, buses, volume settings. |

## Workflows

Multi-agent workflows (Claude Code Workflow scripts in `workflows/`).

| Workflow | Does |
|---|---|
| `/sound-designer:cue-batch` | Synthesise a set of sound cues in parallel, then mix-check them together |

## Agent

`agents/sound-designer.md` defines the role as a subagent.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install sound-designer@opsroller
```

Versioned on its own with semver tags (`v0.1.0`). Changes follow Conventional Commits.
