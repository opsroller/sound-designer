# About the sound-designer role

*Explanation: for anyone who wants to understand what a sound designer does on a team, where the role stops, and why this plugin works the way it does.*

## What the job is

A sound designer decides what a product sounds like and makes it so. In
games and other interactive work that means sound effects, music (or
working with a composer), ambience and interface sounds, and, more and
more, getting all of it into the running product and making it behave.
A 2026 survey of 142 game-audio job postings found implementation
mentioned in more than half of them, ahead of most individual tools:
employers assume you can make good audio and hire for whether you can
ship it.

Sound in interactive work differs from film in one decisive way: nobody
knows in advance what will happen, when, or how often. A footstep may
play ten thousand times; a music cue may be interrupted at any beat; the
busiest moment is decided by the player. Most of the role's methods
exist to cope with that uncertainty.

## Sound as information

The strongest idea in modern game audio is that sound is gameplay
information. Teams that set "play by sound" goals (a player could act
with the screen off) design from the information hierarchy down: what
must the player always hear, what can duck, what can drop. That is why
this plugin starts every job with a brief and an event list ranked by
priority, and why the mix skill talks about priority and ducking before
it talks about EQ. The film editor Walter Murch's idea of "dense
clarity" (many sounds, one clear message) is the target.

## Why loudness is measured, not judged

Broadcasting spent decades with programmes and adverts at wildly
different perceived levels because levels were set by peak meters. The
EBU's R 128 recommendation replaced peak normalisation with loudness
normalisation measured to ITU-R BS.1770, and games followed: Sony's
Audio Standards Working Group published console and mobile targets, and
the Game Audio Network Guild's Interactive Entertainment Sound Developers
group aligned console makers on similar figures. The reasons were
practical: players switch between games, films and streaming on the same
device and should not reach for the remote; producers pushed for
"louder" with nothing to push back with.

Games still differ from broadcast. Their content varies hugely by state,
so the agreed method is a long, representative capture (at least 30
minutes) rather than one scene, and the targets carry a wider tolerance
(±2 LU) than broadcast (±0.5 LU). Mobile targets are louder and narrower
in range because phones are played in noisy places on small speakers.
This plugin defaults to those published figures but always defers to the
project's own target.

## Why provenance is part of the craft

Audio is unusually easy to copy and unusually hard to trace: a two-second
layer from a film, a library sample with a non-commercial clause, a
melody that recalls a famous theme. Any of these can block a release
long after it was added. This plugin therefore treats the origin and
licence of every sound as part of making it, not a separate legal step,
and prefers reproducible sources (generator scripts, patches, sessions)
that prove a sound is original and let it be changed later. It applies
the shared `provenance` skill from `engineering-practices` to audio's
particular cases: library licences, Creative Commons variants, presets
and sound-alikes.

## Trade-offs behind the methods

- **Synthesis and scripts versus recording.** Generated sounds are
  reproducible, parameterisable and clearly original; recorded sounds
  carry organic detail synthesis struggles to match. The plugin prefers
  reproducible sources but treats recording as first-class, with session
  notes as its provenance.
- **Adaptive structure versus composition.** Horizontal re-sequencing
  tracks progress but fragments the music; vertical layering keeps it
  whole but demands every combination sound finished. The plugin asks for
  the simplest structure that serves play.
- **Memory versus latency.** Short, frequent sounds live in memory for
  instant response; long ones stream. Budgets decide the middle.
- **One mix versus per-platform mixes.** One mix is cheaper to maintain;
  per-platform mixes fit devices better. Either is defensible if recorded.

## Boundaries with neighbouring roles

The game-designer decides which events exist and what they mean; the
sound designer proposes audio feedback and owns how it sounds. The
gameplay-programmer calls cues by name from game code; the sound designer
owns the cue contract and everything behind the name. The ui-developer
builds settings screens and captions; the sound designer defines the
buses and which cues need visual equivalents. The technical-artist and
devops-engineer own asset pipelines and builds that convert and package
audio. Keeping these lines clean is what lets each role work in parallel.

## From junior to senior

Studios and practitioners describe a consistent ladder:

- **Junior:** sound sense and passable craft; has tried middleware or an
  engine's audio system; open to feedback and iteration. Entry roles are
  rare, so portfolios and modding count.
- **Mid-level (about 2-5 years):** solid dynamics, mixing basics,
  recording, implementation tasks such as sidechain ducking; a shipped
  title.
- **Senior (about 5-7 years):** strong mixing and mastering, complex
  sound design (creatures, systems), wide implementation knowledge, works
  with little supervision, mentors, communicates across departments.
- **Lead and principal (6-15 years):** a lead is often a player-coach who
  plans, reviews and manages people and vendors; a principal is a senior
  individual contributor who sets technical and creative direction.
- **Audio director:** owns the product's sonic vision and team.

Across levels, hiring managers say attitude counts as much as craft:
openness to feedback, sharing work, no ego, putting the team first.

## Related pages

- [Build your first sound cue](../tutorials/first-task.md) (tutorial)
- [How to review the mix before release](../how-to/how-to-review-the-mix-before-release.md) (how-to)
- [Reference index](../reference/index.md) and [SOURCES.md](../../SOURCES.md)
