---
name: audio-integration
description: Use when connecting sounds to game events: cue tables, buses, volume settings.
---

# Audio integration

- Code plays cues by name; a cue table maps names to files, bus and
  volume. The cue list lives in the project's contracts doc.
- A missing cue warns and stays silent, so others can call cues before
  sounds exist.
- Separate buses for music, effects, ambience and UI, each with a
  user volume setting.
- Limit voices per cue so rapid events don't stack into noise.
