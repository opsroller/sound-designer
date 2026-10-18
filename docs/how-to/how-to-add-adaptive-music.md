# How to add adaptive music to a level or feature

*How-to guide: for a project member who needs a music piece that changes with play.*

This guide shows you how to design, compose and implement one adaptive
piece with the `adaptive-music` workflow.

1. Agree the musical states and what triggers them with the
   game-designer (e.g. calm, tension, intense), and the parameter or
   event names with the gameplay-programmer. The workflow stops at
   planning if a trigger does not exist.
2. Write a brief: mood, setting, and what the music tells the player.
3. Run:

   ```
   /sound-designer:adaptive-music
   args: { piece: "mus_explore", states: ["calm", "tension", "intense"],
           brief: "calm forest exploration that tightens as threats approach" }
   ```

4. If you need a specific structure (for example layers only, to save
   memory), add it to the brief; otherwise the planner picks the simplest
   structure that fits.
5. Read the result. On `blocked` at `compose`, rerun after fixing the
   listed parts; on `blocked` at `check`, the open items name the
   transitions or layer combinations that fail. On `incomplete`, the
   music works but the docs need the fixes listed in `docs_problems`. On
   `blocked` at `handoff`, the push or the project checks failed on the
   branch named in `open`. On `done`, the piece is pushed on a feature
   branch and the result carries a `handoff`.
6. Ship it without composing it again. For a work package, pass the whole
   result as `prior`:
   `/engineering-practices:deliver-package { wp: "<the package>", prior: <the result> }`.
   With no work package, land the branch:
   `/engineering-practices:land-pr { branch: "<handoff.branch>" }`.
7. Listen to a long session yourself: repetition fatigue only shows over
   time.

See the [adaptive-music reference](../reference/workflow-adaptive-music.md)
for phases and outputs, and the
[music-and-adaptive-scoring reference](../reference/skill-music-and-adaptive-scoring.md)
for the structures.
