# How to measure a game's loudness

*How-to guide: for a sound designer checking a build against a loudness target by hand.*

This guide shows you how to get an integrated loudness, true peak and
loudness range figure you can trust.

1. Find the target in the project profile. If there is none, use the
   [loudness targets reference](../../skills/mixing-and-loudness/loudness-targets.md).
2. Route the device's real output to a recorder: a digital output into an
   audio interface, or the platform's own capture tool. Avoid consumer
   amplifiers in the chain. If you can only capture inside the engine,
   note that post-mix processing may be missing.
3. Set every player volume slider to its default.
4. Play at least 30 minutes covering the real mix of states: menus,
   quiet exploration, the busiest moments, cutscenes if any.
5. Measure the recording with a meter compliant with ITU-R BS.1770 (a
   loudness meter plug-in or command-line tool, e.g. an FFmpeg loudness
   filter). Read integrated loudness, maximum true peak and loudness
   range; scan short-term loudness for outliers.
6. If you ship surround, measure the stereo downmix too.
7. If out of tolerance, change bus and category levels, not the master
   limiter, and measure again.
8. Record build, date, capture length and the three numbers in the
   project's audio reference page.
