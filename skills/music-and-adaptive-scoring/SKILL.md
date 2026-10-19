---
name: music-and-adaptive-scoring
description: 'Use when composing or arranging original music or ambience beds for an interactive project, and when designing how it adapts to play: loops, segments (horizontal re-sequencing), layers (vertical layering), stingers, transitions and runtime processing.'
---

# Music and adaptive scoring

Game music must survive what linear music never faces: unknown length,
repetition, and interruption at any moment. Adaptive scoring answers with
a small set of structures. Choose the simplest structure that serves the
player's journey through the content.

## Step 1: map music to play

List the musical states the content needs (e.g. calm, tension,
intense, success, menu) and the game values or events that move between
them. For each state write the emotion and the information it carries
(is the player safe? is time running out?). Agree the triggers with the
game-designer and the parameter names with the gameplay-programmer.

## Step 2: choose a structure

| Structure | What it is | Use when | Cost |
|---|---|---|---|
| Linear loop | One seamless piece repeated | Menus, simple levels, short sessions | Repetition fatigue on long play |
| Horizontal re-sequencing | Track split into segments that play in an order chosen at runtime | Progress through a level, mood shifts, momentum | Fragments the composition; needs transition rules |
| Vertical layering | Synchronised stems added or removed over a continuous bed | Intensity that rises and falls (threat, speed, health) | Every layer combination must sound finished |
| Hybrid | Segments and layers together | Long levels that need both progress and variety | Most authoring and testing |
| Stingers | Short cues played over or between music on events | Rewards, discoveries, warnings | Must fit any key and tempo they land on, or be quantised |
| Runtime processing | Filters, effects or mix changes on the music | Pause, underwater, low health, distance | Cheap; keep it subtle |

Decision rules:
- Intensity changes often and smoothly: vertical layering.
- The player moves through distinct places or phases: horizontal.
- An event must be acknowledged instantly: stinger, quantised to the
  next beat or bar when the gap is acceptable.
- Short sessions or limited memory: linear loops plus stingers.

## Step 3: compose for the structure

- Fix a tempo and meter per piece, and a key plan; note them in the music
  reference so transitions and stingers can be quantised.
- **Loops:** the end must flow into the start. Include the reverb tail
  of the end in the start (or render with a pre-roll and crop) so the
  seam is inaudible; set loop points to the exact sample.
- **Layers:** write each layer so every allowed combination is complete
  and balanced; render all stems with identical length and start.
- **Segments:** write entry and exit points on bar lines; give each
  segment a matching ending or transition segment.
- **Stingers:** short, harmonically neutral or provided per key; make
  reward motifs recognisable and consistent across contexts.
- Leave space for gameplay audio: avoid dense melody in the frequency
  range where priority-1 effects and dialogue sit; music ducks around
  them anyway (see `mixing-and-loudness`).
- Ambience beds: long, seamless, low on distinct events (distinct events
  are better as separate randomised one-shots over the bed).

## Step 4: transitions

For every state change, define: when it may happen (immediate, next
beat, next bar, end of segment), how (crossfade length, transition
segment, stinger, cut), and what happens if the state flips back during
the transition. Write this as a table in the music reference.

## Step 5: test

- Force every transition and every layer combination; listen for
  clashes, gaps and level jumps.
- Play a long session; note when repetition becomes tiresome and add
  variation segments or silence.
- Check level against the other buses in the busiest moment.

## Quality checklist

- [ ] All music original or licensed with provenance recorded.
- [ ] Loop seams inaudible; no clicks at loop points or transitions.
- [ ] Every layer combination and transition auditioned.
- [ ] Tempo, meter, key and loop points recorded in the music reference.
- [ ] Music never masks priority-1 cues.

## Failure modes

- A melody or progression that recalls a known theme too closely: rewrite
  it; "inspired by" a specific track is a rights risk.
- Layers that only sound right all together.
- Transitions that fire mid-phrase and jar on every state change.
- A loop so short or busy that players turn music off.
- Mastering music hot in isolation; it then dominates the game mix.

## Documentation

An adaptive music system owes **reference** (states, parameters,
transition table, tempo/key/loop points) and an **explanation** of the
structure chosen and why. If others must add new pieces to it, add a
**how-to**.
