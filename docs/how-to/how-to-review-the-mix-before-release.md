# How to review the mix before release

*How-to guide: for a sound designer or lead preparing a milestone or release build.*

This guide shows you how to audit loudness, clarity, budgets and
provenance with the `mix-review` workflow and leave a measured record.

1. Build the version you intend to ship and make it runnable on the
   target device, with its real audio output path available for capture.
2. Check the project profile states a loudness target. If it does not,
   pass one:

   ```
   /sound-designer:mix-review
   args: { target: "console -24 LUFS +/-2 LU, true peak -1 dBTP", scope: "release candidate 1" }
   ```

   For a phone or handheld build use the mobile target from the
   [loudness targets reference](../../skills/mixing-and-loudness/loudness-targets.md).
3. Let the capture run its full length (at least 30 minutes covering
   quiet, busy and menu states). A shorter capture gives a misleading
   integrated figure.
4. Read the result:
   - `done`: measurements are recorded in the project's audio reference
     and fixes are committed.
   - `blocked`: each open item is prefixed with its area (`[loudness]`,
     `[clarity]`, `[budgets]`, `[provenance]`). Provenance blockers stop
     a release; remove or replace the file.
   - `done-unverified`: the listed areas were not checked; check them by
     hand before shipping.
5. If you ship on several platforms, run once per target.

For what each area checks, see the
[mix-review reference](../reference/workflow-mix-review.md).
