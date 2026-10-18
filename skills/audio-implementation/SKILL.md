---
name: audio-implementation
description: Use when connecting sounds to the running project: cue naming, the cue contract that code calls, parameters, randomisation, voice limits and priority, buses, spatial settings, and behaviour when a cue is missing.
---

# Audio implementation

Most game audio postings now ask for implementation as well as creation:
a sound designer gets audio into the game and makes it behave. The core
idea is an **event (cue) layer**: code says what happened, by name; the
audio side decides what that sounds like. Whether the project uses
middleware or the engine's own audio system, the method is the same.

## The cue contract

One file (path in the project profile) lists every cue. Code calls only
names in it; you own its contents; changes are coordinated with the
gameplay-programmer.

Per cue, record:

| Field | Meaning |
|---|---|
| name | Stable identifier, by meaning (rules below). |
| type | one-shot, loop (with start/stop), music state, stinger, parameter. |
| files | Asset files or container (variations). |
| bus | Which mix bus (see `mixing-and-loudness`). |
| volume / pitch | Base values plus random ranges (e.g. pitch ±1 semitone, volume ±1.5 dB). |
| selection | random without immediate repeat, sequence, or switch on a parameter. |
| max voices / steal | Instance limit and what happens past it (oldest, quietest, reject new). |
| priority | 1 critical, 2 feedback, 3 flavour (from the event list). |
| spatial | 2D, or 3D with attenuation range and curve. |
| parameters | Game values the cue reads (name, range, meaning). |
| status | placeholder, draft, final. |

## Naming rules

- One case style everywhere (snake_case is common); underscores between
  every segment; no spaces.
- General to specific: `category_subject_detail_action`, e.g.
  `ui_button_confirm`, `gp_player_jump`, `amb_forest_day_loop`,
  `mus_explore`.
- Use a short agreed prefix list (`ui`, `gp`, `amb`, `mus`, `vo`) and
  document it.
- End with a verb for actions; keep one tense and form (`open`, not a mix
  of `open` and `opening`).
- Two-digit variation suffixes (`_01`, `_02`) so files sort correctly.
- Never `final`, `v2` or dates in names; version control holds history.
- Use the same nouns as design and art for the same thing.

## Behaviour rules

- **Missing cue:** log a warning once and stay silent. Code can then call
  cues before sounds exist, and a missing file never crashes the game.
- **Voice limits:** every frequent cue has a max instance count; a global
  voice budget comes from the profile. When over budget, steal by
  priority, then by audibility.
- **No repeat:** random selection avoids playing the same variation twice
  in a row.
- **Loops** have explicit start and stop cues (or a stop on owner
  destruction); a loop that never stops is a bug.
- **Parameters** are normalised and named by meaning (`speed`,
  `intensity`), mapped to sound properties on the audio side, not in game
  code.
- **3D sounds:** attenuation range matches gameplay relevance (a threat
  is audible as far as it matters); occlusion and reverb zones as the
  project supports.
- **Timing:** sounds tied to animation fire on the exact frame event, not
  on a timer.

## Steps for a batch of cues

1. Read the event list rows and the current contract.
2. For each cue, prepare the contract entry and asset files. When working
   in parallel with others, return contract lines rather than editing the
   shared file; one person applies all lines in a single edit.
3. Hook up: the gameplay-programmer calls the cue name at the trigger;
   you configure everything else.
4. Test in the build: trigger each cue, then the busiest moment; watch
   voice counts and warnings.
5. Mark status; update the contract, provenance log and docs together.

## Quality checklist

- [ ] Every cue code calls exists in the contract (and vice versa,
  except planned ones marked placeholder).
- [ ] Names follow the rules; no renames without coordination.
- [ ] Frequent cues have voice limits and no-repeat selection.
- [ ] Every loop has a stop path.
- [ ] No missing-cue warnings in a normal play session.
- [ ] Busiest moment stays within the voice budget.

## Failure modes

- Code that plays file paths instead of cue names: every audio change
  becomes a code change.
- Volume and pitch hard-coded in game code.
- Parallel contributors editing the cue table at once: merge conflicts
  and lost rows.
- Unlimited instances of a rapid cue: phasing, clipping and stolen
  important voices.

## Documentation

The cue contract is **reference**: update it in the same change. A new
audio system (buses, parameter set, occlusion) owes reference plus an
**explanation** of its design; a new procedure other roles follow (e.g.
how to request a cue) owes a **how-to**.
