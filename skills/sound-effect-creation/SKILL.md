---
name: sound-effect-creation
description: 'Use when making a sound effect, UI sound or ambience element from scratch: choosing synthesis, recording or layering, building variations, editing and rendering so the sound is readable, original and reproducible.'
---

# Sound effect creation

A sound effect does a job: it tells the player something. Craft serves
that job. Practitioners build sounds from a model of the thing (what
physically makes the sound, or what it should feel like), then layer,
vary and edit until it reads instantly in the mix.

## Step 1: define the target

From the event list row (see `audio-brief-and-spotting`) write down:
purpose, priority, length budget, how often it fires, 2D or 3D, and two
or three words for character ("dry, wooden, light"). If you cannot, the
brief is incomplete; fix that first.

## Step 2: choose the source method

| Method | Use when | Notes |
|---|---|---|
| Synthesis (subtractive, FM, additive, wavetable, granular, noise shaping) | UI, sci-fi, abstract feedback, tonal cues, anything that must be regenerated or parameterised | Script it or save the patch so it can be re-rendered with changes. |
| Procedural or physical model | Sounds driven by continuous game values (speed, force, size): engines, wind, rolling, impacts by mass | Analyse the physical process, build a model, implement it (the analysis-model-method approach of procedural audio). May run at runtime. |
| Recording (field, Foley, studio) | Natural, material, human or organic sounds | Record your own with notes (see below). |
| Layering existing material you own or licensed | Complex sounds: impacts, creatures, magic, explosions | Each layer needs provenance; see `sound-provenance`. |

Prefer a method that leaves a **reproducible source** (generator script,
synth patch, DAW session) over a one-off render.

### Recording notes (every session)

Mic type and pattern, distance, room, sample rate and bit depth, gain,
what was performed, take numbers, date, recordist. Record at the
project's source format (commonly 48 kHz / 24-bit or higher). Leave
headroom: peaks well below 0 dBFS; clipping cannot be undone. Record
room tone. Never record copyrighted playback (radio, music, films) into
the take.

## Step 3: design the layers

Build complex sounds from layers with distinct jobs, so each can be
tuned on its own:

| Layer | Job | Typical content |
|---|---|---|
| Transient (attack) | Timing and impact; makes it read at low volume | Clicks, snaps, short noise bursts, high-mid energy |
| Body | Identity and material | Tonal or textural core |
| Low end (sub/weight) | Size and power | Low sine or filtered thump; use sparingly, it eats headroom |
| Tail | Space and decay | Reverb, debris, ring-out; often left to the runtime reverb for 3D sounds |
| Sweetener | Character, emotion | A tonal element, a reversed swell, a recognisable motif for rewards |

Rules:
- Give layers different frequency ranges; overlapping layers mask each
  other and muddy the result. Cut, then boost.
- Check phase when stacking similar layers (polarity flip, small time
  offsets); a thinner sum means cancellation.
- Short and frequent sounds need a strong transient and little tail.
- Priority 1 cues keep a signature (pitch contour, rhythm, timbre) no
  other cue shares.
- Pitch, length or layer count can follow a game value (combo count,
  charge level). Rising pitch per step is one common example; pick what
  fits the brief.

## Step 4: variations

- Create the number of variations the event list asks for. Vary
  performance and layer choice, not only pitch.
- Plan runtime randomisation as well (pitch, volume, layer selection);
  record the intended ranges in the cue contract, not in the files.
- Listen to the variations in rapid succession: no one variation should
  stand out (louder, longer, different tail).

## Step 5: edit and render

- Trim silence; add short fades at start and end (a few milliseconds) to
  avoid clicks; zero-crossing edits for loops.
- Remove DC offset, rumble below the useful range and unwanted noise.
- Level by category (see `mixing-and-loudness`), not by peak-normalising
  every file to the same value.
- Render at the project's source format; conversion to delivery formats
  happens later (see `audio-formats-and-budgets`).
- Name files per the cue naming rule with two-digit variation suffixes
  (`gp_door_wood_open_01`).

## Step 6: check in context

Play it in the game or a mock-up at the reference listening level, with
music and the busiest moment running, on small speakers and headphones.
Ask: is the purpose obvious? Does it mask anything more important? Would
it annoy on the hundredth repetition?

## Quality checklist

- [ ] Purpose identifiable in under a second, with the screen off.
- [ ] No clicks, pops, clipping, DC offset or audible noise floor.
- [ ] Variations sound like one family; none sticks out.
- [ ] Works in mono and on a small speaker.
- [ ] Source (script, patch or session) saved outside the shipped build.
- [ ] Provenance line written (see `sound-provenance`).

## Failure modes

- Too much low end and tail on frequent sounds: the mix turns to mud.
- Designing in solo at high volume: the sound vanishes or dominates in
  context.
- One great variation copied with pitch shifts only: the machine-gun
  effect.
- Lifting a layer from a reference game, film or song: never; it is
  copying, whatever the processing.

## Documentation

New sounds owe an update to the cue table and provenance log
(**reference**). A new sound family or design approach that others will
extend owes a short **explanation** (why it sounds this way); a reusable
procedure (e.g. a generator script others will run) owes a **how-to**.
