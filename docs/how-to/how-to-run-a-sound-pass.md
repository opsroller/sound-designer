# How to run a sound pass

*How-to guide: for a project member who needs a batch of new or replaced sounds made, implemented and documented.*

This guide shows you how to create several cues at once with the
`sound-pass` workflow.

1. Make sure the project profile names the cue contract, provenance log,
   credits file and audio source folder. If it does not, add them first;
   the workflow's agents follow the profile.
2. Write one line per cue: a name by meaning and a brief saying what the
   sound must tell the player and how it should feel.
3. Run the workflow:

   ```
   /sound-designer:sound-pass
   args: { cues: [
     { name: "ui_button_confirm", brief: "confirms a choice; short, soft, positive" },
     { name: "gp_door_wood_open", brief: "a wooden door opens; light, creaky, 3D" }
   ], scope: "settings menu and first room" }
   ```

4. Read the result:
   - `status: "done"`: sounds, shared files and docs are committed.
   - `status: "blocked"` with `stage: "plan"`: fix the listed problems
     (unclear purpose, name clashes) and run again.
   - `status: "blocked"` with `stage: "check"`: the open blockers are
     listed; fix them or run again after deciding with the team.
   - `status: "done-unverified"`: a reviewer agent failed; listen to the
     cues yourself or run [How to review the mix before release](how-to-review-the-mix-before-release.md).
5. If a cue name is already called by code under a different name, agree
   the rename with the gameplay-programmer before running.

For arguments, phases and outputs, see the
[sound-pass reference](../reference/workflow-sound-pass.md).
