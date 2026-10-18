---
name: sound-synthesis
description: Use when generating sound effects or music, especially by script.
---

# Sound synthesis

- Script generation where possible (the profile names the tools, e.g.
  Python with numpy and ffmpeg) so sounds can be regenerated; only the
  output ships.
- Effects: additive or FM synthesis, filtered noise for impacts, short
  envelopes. Chains (combos, cascades) rise in pitch per step.
- Music and ambience as seamless loops.
- Short effects uncompressed for latency; music compressed. Normalise
  effects to about -6 dBFS peak, music to about -16 LUFS.
