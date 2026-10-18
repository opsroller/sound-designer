---
name: audio-brief-and-spotting
description: Use when starting audio for a project, feature or level, before making any sound; turns the design into an audio brief (sonic identity, pillars, references) and an event list (spotting pass) with purpose, priority and status for every sound.
---

# Audio brief and spotting

Sound starts from purpose. Before you synthesise or record anything,
agree what the audio must do and list every event that needs it. Studios
that ship "play by sound" games (where a player can act on audio alone)
plan this way: pillars first, then an event list ranked by gameplay
importance.

## Outputs

1. **Audio brief** (one page, in the project's docs; an explanation doc).
2. **Event list** (a table, usually beside the cue contract; reference).

## Step 1: the brief

Write short answers; get the game-designer to confirm them.

| Section | Content |
|---|---|
| Pillars | 3-5 statements the audio must achieve, e.g. "danger is heard before it is seen", "rewards feel generous". |
| Sonic identity | Palette in words: materials, era, synthetic vs acoustic, dry vs reverberant, tonal centre. |
| References | Moods and techniques (genre, instrumentation, texture), described in words. Never a specific copyrighted sound to copy. |
| Information hierarchy | What the player must always hear, in order (e.g. threat > own actions > rewards > UI > ambience > music). |
| Platforms and listening | Target devices (TV, headphones, phone speaker), loudness target, mono-compatibility needs. |
| Constraints | Format and memory budget, voice limit, tools, schedule. |
| Accessibility | Which cues need a visual equivalent or subtitle; separate volume controls; mono option. |

## Step 2: the spotting pass

Walk the design (spec, level, build or storyboard) event by event, as a
film sound editor spots a picture. For each event record:

| Column | Meaning |
|---|---|
| cue | Name by meaning, per the naming rule in `audio-implementation` (e.g. `gp_player_jump`). |
| trigger | What fires it (designer's event name). |
| purpose | What the player learns or feels. One line. |
| priority | 1 critical gameplay info, 2 feedback, 3 flavour. Drives mix and voice stealing. |
| type | one-shot, loop, music segment, stinger, ambience bed, UI. |
| frequency | How often it can fire (per second worst case). Drives variation count. |
| variations | Count needed (see rule below). |
| spatial | 2D (UI, music) or 3D (world). |
| source plan | synth / record / layer / licensed library (name the library). |
| status | todo, placeholder, draft, final. |

### Decision rules

- **Variations:** fires rarely (under once a minute) = 1; regularly =
  3-5; constantly (footsteps, weapon fire, hits) = 6+ plus pitch and
  volume randomisation.
- **Priority 1 cues** get a distinct spectral or rhythmic signature that
  nothing else in the palette shares.
- **Silence is a choice.** Mark events that deliberately have no sound.
- **Placeholders** are allowed early, but must be original or licensed,
  named like the final cue, and marked `placeholder` in status.
- **Missing events:** if the design implies feedback with no event
  (e.g. low health), raise it with the game-designer rather than
  inventing a trigger.

## Step 3: review

- Every design event has a row or an explicit "silent".
- No two priority-1 cues are likely to be confused.
- Worst-case simultaneous voices estimated for the busiest moment.
- Brief and list agreed with the game-designer; cue names agreed with the
  gameplay-programmer before they code against them.

## Failure modes

- Making sounds before the purpose is agreed: polished audio for the wrong
  job.
- Listing sounds by asset instead of by event: gaps appear where events
  have no owner.
- References that name a specific sound to copy: a provenance problem
  waiting to happen.
- Everything priority 1: the mix then has nothing to duck.

## Documentation

The brief is an **explanation** doc (why the audio is the way it is). The
event list and cue table are **reference**. Put them where the project
profile's docs layout says.
