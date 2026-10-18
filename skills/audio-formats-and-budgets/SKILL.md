---
name: audio-formats-and-budgets
description: Use when choosing source and delivery audio formats, codecs, sample rates, streaming versus memory-resident loading, loop encoding, and when setting or checking audio memory, disk, voice and CPU budgets.
---

# Audio formats and budgets

Audio competes with everything else for memory, disk, CPU and download
size. Decide formats per category, measure against the budget the
project profile sets, and keep high-quality sources so delivery formats
can be re-encoded at any time.

## Source versus delivery

- **Source (masters):** uncompressed PCM (e.g. WAV) at the project's
  source rate and depth, commonly 48 kHz / 24-bit. Kept under version
  control or the project's asset store, outside the shipped build, with
  generator scripts and sessions.
- **Delivery:** converted per platform by the build or asset pipeline
  (owned with the technical-artist and devops-engineer). Never edit a
  delivery file by hand; re-export from source.

## Choosing delivery format per category

| Category | Loading | Format family | Why |
|---|---|---|---|
| Short, frequent, latency-critical SFX and UI | Loaded in memory | Uncompressed PCM or a light codec (e.g. ADPCM) | Instant start, cheap to decode |
| Medium SFX, variations | In memory, compressed | Perceptual codec (e.g. Vorbis or Opus) at moderate quality | Saves memory; small decode cost |
| Music, long ambience, long dialogue | Streamed from disk | Perceptual codec | Too large for memory; latency acceptable |
| Seamless loops | Either | A format and decoder that support sample-accurate, gapless loops | Some codecs (e.g. MP3) add padding that breaks seams |

Decision rules:
- Starts on an exact frame (hits, UI)? Memory-resident.
- Longer than roughly 10-20 seconds and not latency critical? Stream.
- Many streams at once cost disk bandwidth; cap concurrent streams.
- Lower the sample rate only where the content allows it (e.g. low
  rumble, distant ambience) and listen after converting.
- Mono for 3D-positioned sounds (the engine positions them); stereo or
  more for 2D music, ambience beds and UI where width matters.

## Budgets

Read from the profile, or propose and agree with the project-manager and
technical-artist:

| Budget | Measure |
|---|---|
| Memory (resident audio) | Sum of decoded or compressed in-memory sizes per scene/level |
| Disk / download size | Total delivered audio |
| Voices | Max simultaneous playing voices (global and per cue) |
| Streams | Max concurrent streams |
| CPU | Audio thread cost: decoding, effects, voice count |

Method:
1. Estimate per category from the event list (count x length x format).
2. Measure in the build at the busiest moment and per level load.
3. Over budget: cut variations that are not heard, shorten tails, move
   long sounds to streaming, lower rates on suitable content, share
   assets between cues, raise compression on low-priority sounds. Cut
   low-priority content before degrading priority-1 cues.
4. Record the measured numbers in the project's audio reference.

## Encoding checks

- [ ] Loops still seamless after encoding (no gap, no click).
- [ ] No audible codec artefacts on transients or cymbal-like content.
- [ ] Short sounds keep their attack (no encoder pre-roll delay).
- [ ] Mono-compatible if folded down.
- [ ] Delivery files regenerate from source with the documented command.

## Failure modes

- Everything streamed: dozens of streams and audible start delays.
- Everything in memory uncompressed: blows the memory budget late in
  production.
- Lossy-to-lossy re-encoding (editing compressed deliveries): artefacts
  compound.
- Sources lost; only compressed files remain: nothing can be fixed.

## Documentation

Format rules per category and budgets with measured values are
**reference**; a decision to change formats or loading strategy owes an
**explanation** (ADR style); the conversion command or pipeline step
others run is a **how-to**.
