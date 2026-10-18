# Loudness targets and measurement (reference)

Reference for the `mixing-and-loudness` skill. The project profile's
target wins; use these when it names none. All loudness figures are
measured per ITU-R BS.1770 (K-weighted, gated integrated loudness).

## Targets

| Context | Integrated loudness | Tolerance | Max true peak | Loudness range | Source |
|---|---|---|---|---|---|
| Console / TV games (home entertainment) | -24 LUFS | ±2 LU | -1 dBTP | at most 20 LU | Sony ASWG-R001 as reported by Audiokinetic (2024); G.A.N.G. IESD mix reference levels |
| Mobile / handheld / portable | -18 LUFS (Sony) or -16 LUFS (IESD) | ±2 LU | -1 dBTP | 10-15 LU (IESD mobile) | Sony ASWG; G.A.N.G. IESD |
| Broadcast programme (trailers for TV) | -23 LUFS | ±0.5 LU (±1 LU live) | -1 dBTP | not limited | EBU R 128 |
| Music streaming services | about -14 to -16 LUFS | service-normalised | -1 dBTP common | n/a | service specs, via EBU R 128 summaries |

When a game ships on several platforms, either keep one mix at the
console target and offer a dynamics/loudness option for mobile, or keep
platform mixes; record which in the project's audio reference.

## Measurement terms

| Term | Definition |
|---|---|
| LUFS | Loudness units relative to full scale; 1 LU = 1 dB change. |
| Integrated loudness | Gated average over the whole capture: absolute gate -70 LUFS, relative gate 10 LU below the ungated level. |
| Momentary loudness | 400 ms sliding window, ungated. |
| Short-term loudness | 3 s sliding window, ungated. |
| Loudness range (LRA) | Spread of short-term loudness (EBU Tech 3342); not meaningful under about one minute. |
| True peak (dBTP) | Inter-sample peak estimate from an oversampling meter; higher than sample peak. |

## Measurement rules

- Capture at least 30 minutes of representative gameplay; no upper limit.
- Measure the device's real output where possible (digital output into
  an interface, or the platform's own capture tools), avoiding consumer
  amplifiers in the chain.
- Measure surround and its stereo downmix; they should match.
- Monitoring reference: 79 dB SPL in a large mix room; around 76 dB SPL
  in rooms under about 1,500 cubic feet (IESD, following ATSC A/85).

## Per-asset levels

No standard sets per-file levels. Practitioners level by category
relative to an anchor and verify with the integrated measurement above.
Peak-normalising all files to one value is not a substitute.
