---
name: mixing-and-loudness
description: 'Use when balancing the game''s audio as a whole: bus structure, priority and ducking, levels by category, loudness measurement against a target (integrated LUFS, true peak, loudness range), mastering, player volume settings and audio accessibility options.'
---

# Mixing and loudness

A game mix is never finished in a DAW: it happens at runtime, across
states nobody can fully predict. The mix must keep the important things
audible ("dense clarity": many sounds, one clear message) and land at a
consistent, measured loudness so players do not reach for the remote
when switching between your game and anything else.

Targets and measurement details: [loudness-targets.md](loudness-targets.md).

## Step 1: bus structure

A minimal tree; the project may add more:

```
master
  music
  sfx
    gameplay (priority 1-2)
    world / ambience
  ui
  voice (if any)
```

- Each player-facing volume setting maps to one bus (at least music,
  effects, voice if present; UI often too). The ui-developer builds the
  settings screen; you define the buses.
- Effects such as reverb sit on send buses, not on every sound.

## Step 2: gain staging and levels

- Monitor at a calibrated reference level (79 dB SPL for a large room,
  around 76 dB SPL in a small one, per the console-industry
  recommendation) or at a fixed, noted headphone level. Never mix by
  turning the monitors up.
- Set levels by category relative to an anchor (dialogue if present,
  otherwise the main gameplay feedback). Music and ambience sit below
  gameplay information; UI sits close to gameplay but short.
- Aim for the mix to reach the loudness target without master gain, so
  you mix at the level that ships.

## Step 3: priority and ducking

- Use the priority from the event list: priority 1 cues duck lower
  priorities (music, ambience, flavour) briefly while they play.
- Use sidechain or state-based ducking for dialogue and critical cues;
  keep ducks short and shallow (a few dB) so they are felt, not heard.
- Where the project supports it, a dynamic mix that tracks what matters
  most to the player (nearest threat, what the player is aiming at) beats
  static levels.
- States (pause, menu, low health, underwater) apply snapshot changes to
  buses, not to individual sounds.

## Step 4: master

- A limiter on the master catches stray peaks only; it is a safety net,
  not the loudness control. Set it so the true-peak ceiling holds.
- Master EQ and compression stay subtle (broad moves of a few dB). Fix
  problems in the mix, because master changes hit every state and
  cutscene.
- Provide a reduced-dynamics option ("night mode" or "small speakers")
  if the project targets varied devices: compress the master's range
  rather than raising everything.

## Step 5: measure

1. Capture at least 30 minutes of representative play (a cross-section
   of quiet, busy and menu states, not only the loudest scene), from the
   real output of the target device where possible. Middleware meters
   may not see post-mix processing.
2. Measure with a meter compliant with ITU-R BS.1770: integrated
   loudness, maximum true peak, loudness range; scan short-term loudness
   (3 s) for outliers.
3. Compare to the project's target (see the table in
   [loudness-targets.md](loudness-targets.md)). Adjust bus and category
   levels, not the master limiter, then measure again.
4. Check the stereo downmix (or mono) matches the full mix in loudness
   and that nothing important disappears in mono.
5. Record the result (date, build, capture length, numbers) in the
   project's audio reference.

## Step 6: listen on targets

Small speaker (phone or laptop), TV speakers, good headphones, and the
loudest and quietest settings of each player volume slider.

## Accessibility

- Separate volume sliders per bus; a master slider; mute.
- Every priority-1 cue has a visual equivalent or subtitle/caption,
  agreed with the game-designer and ui-developer.
- Mono output option; important information never only in one channel
  or only in stereo position.
- Avoid relying on very high or very low frequencies alone for
  information.

## Quality checklist

- [ ] Integrated loudness within tolerance of the target over 30+ minutes.
- [ ] True peak never above the ceiling (commonly -1 dBTP).
- [ ] Loudness range suits the platform (narrower for mobile).
- [ ] Priority-1 cues audible in the busiest moment, including in mono
  and on a small speaker.
- [ ] Volume sliders each control one bus and reach silence.
- [ ] Measurement recorded with build and date.

## Failure modes

- Peak-normalising every asset and calling it a mix.
- Measuring only the loudest scene (reads hot) or only the menu (reads
  quiet).
- Using the master limiter to hit the loudness number: pumping and
  flattened impacts.
- Mixing on headphones only, or loud: mix collapses on TVs and phones.
- Music mastered as a standalone album and dropped into the game.

## Documentation

Bus structure, settings and loudness targets with measured results are
**reference**. The reasoning behind the mix approach (priorities, what
ducks what) is **explanation**. A repeatable measurement procedure for
others is a **how-to**.
