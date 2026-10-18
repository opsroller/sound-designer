// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'mix-review',
  description: 'Audit and fix the whole game mix before a milestone or release: loudness and true peak, clarity and priority, formats and budgets, and provenance are checked in parallel, one agent fixes blockers, then docs are updated. args: { target?: "e.g. console -24 LUFS or mobile -18 LUFS; defaults to the project profile", scope?: "build, level or feature to review" }',
  phases: [
    { title: 'Plan', detail: 'read target, budgets, capture plan; list doc kinds affected' },
    { title: 'Audit', detail: 'four parallel reviewers, read-only' },
    { title: 'Fix', detail: 'one agent fixes blockers; re-audit failing areas' },
    { title: 'Docs', detail: 'record measurements and decisions; check one kind per page' },
  ],
}

const target = (args && args.target) || 'the loudness target in the project profile (if none: console -24 LUFS +/-2 LU, mobile -18 LUFS, true peak -1 dBTP)'
const scope = (args && args.scope) || 'the current build'

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under the project\'s docs/<kind>/ (per its profile), keep each page to one kind, title it by the project pattern, and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

phase('Plan')
const PLAN = {
  type: 'object',
  properties: {
    target: { type: 'string' },
    capture_plan: { type: 'string' },
    budgets: { type: 'string' },
    doc_kinds: { type: 'array', items: { type: 'string' } },
  },
  required: ['target', 'capture_plan', 'doc_kinds'],
}
const plan = await agent(
  `You are the sound-designer. Follow engineering-practices project-onboarding first. Plan a mix review of ${scope} against ${target}, following the sound-designer skill mixing-and-loudness and its loudness-targets.md. ` +
  'State the exact target and tolerance, a capture plan of at least 30 minutes covering quiet, busy and menu states on the real output path, the audio budgets from the profile, and the Diataxis doc kinds this review will touch (usually reference for measured results; explanation if a mix decision changes). Do not edit files.',
  { schema: PLAN, phase: 'Plan', label: 'plan' },
)
if (!plan) return 'planning failed: no plan returned; nothing was changed.'

phase('Audit')
const FIND = {
  type: 'object',
  properties: {
    area: { type: 'string' },
    measurements: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
    notes: { type: 'array', items: { type: 'string' } },
  },
  required: ['area', 'blockers'],
}
const areas = [
  { area: 'loudness', skill: 'mixing-and-loudness', ask: `Capture per this plan: ${plan.capture_plan}. Measure integrated loudness, max true peak, loudness range and short-term outliers with a BS.1770 meter; compare with ${plan.target}; check stereo/mono downmix loudness.` },
  { area: 'clarity', skill: 'mixing-and-loudness and audio-implementation', ask: 'Play the busiest moments: are priority-1 cues audible, including in mono and on a small speaker? Are ducking, bus routing, volume sliders and accessibility options (visual equivalents, mono) working? Any missing-cue warnings or runaway loops?' },
  { area: 'budgets', skill: 'audio-formats-and-budgets', ask: `Measure memory, disk, voices, streams and audio CPU at peak against: ${plan.budgets || 'the profile budgets'}. Check loops after encoding and codec artefacts.` },
  { area: 'provenance', skill: 'sound-provenance', ask: 'Audit every shipped audio file against the provenance log and credits; flag any missing, non-commercial, unknown or imitative item and stale log lines.' },
]
const audits = await parallel(areas.map(a => () => agent(
  `You are a sound-designer reviewer for the ${a.area} area of ${scope}. Following the sound-designer skill ${a.skill}: ${a.ask} Return measurements, blockers (must fix before release) and notes. Read-only: do not edit any file.`,
  { schema: FIND, phase: 'Audit', label: `audit:${a.area}` },
)))
const unverifiedAreas = areas.filter((a, i) => !audits[i]).map(a => a.area)
const found = audits.filter(Boolean)
let blockers = found.flatMap(f => (f.blockers || []).map(b => `[${f.area}] ${b}`))

phase('Fix')
for (let round = 0; blockers.length && round < 2; round++) {
  const fixed = await agent(
    `You are the sound-designer. Fix these mix-review blockers following the sound-designer skill for each bracketed area (loudness/clarity: mixing-and-loudness; budgets: audio-formats-and-budgets; provenance: sound-provenance). Adjust bus and category levels rather than the master limiter. You are the only agent editing files now.\n${blockers.join('\n')}`,
    { phase: 'Fix', label: `fix-${round + 1}` },
  )
  if (!fixed) break
  const failingAreas = areas.filter(a => blockers.some(b => b.startsWith(`[${a.area}]`)))
  const again = await parallel(failingAreas.map(a => () => agent(
    `Re-check the ${a.area} area of ${scope} following the sound-designer skill ${a.skill}: ${a.ask} Return blockers still open. Read-only.`,
    { schema: FIND, phase: 'Fix', label: `recheck:${a.area}` },
  )))
  const still = []
  failingAreas.forEach((a, i) => {
    const r = again[i]
    if (!r) { still.push(`[${a.area}] re-check failed; previous blockers remain unverified`); return }
    for (const b of (r.blockers || [])) still.push(`[${a.area}] ${b}`)
    const prev = found.find(f => f.area === a.area)
    if (prev && r.measurements) prev.measurements = r.measurements
  })
  blockers = still
}
if (blockers.length) {
  return { status: 'blocked', open: blockers, unverified: unverifiedAreas, measurements: found.map(f => ({ area: f.area, measurements: f.measurements || [] })) }
}

phase('Docs')
const docsDone = await agent(
  `You are the sound-designer. Record the mix review of ${scope}: target ${plan.target}, measurements ${JSON.stringify(found.map(f => ({ area: f.area, measurements: f.measurements || [] })))}, unverified areas ${JSON.stringify(unverifiedAreas)}. Planned doc kinds: ${JSON.stringify(plan.doc_kinds)}.\n${DOCS_FRAGMENT}\nCommit fixes and docs together with a Conventional Commit (e.g. "fix(audio): bring mix to loudness target").`,
  { phase: 'Docs', label: 'docs-do' },
)
const DOCREV = { type: 'object', properties: { problems: { type: 'array', items: { type: 'string' } } }, required: ['problems'] }
const docsCheck = docsDone ? await agent(
  'Review the documentation pages touched by the last commit against the Diataxis rules: one kind per page; measured results as reference (dry tables, build and date); reasons as explanation titled "About ..."; how-to titles name a goal; each page opens with its kind and audience; related kinds linked. Return problems; do not edit.',
  { schema: DOCREV, phase: 'Docs', label: 'docs-check' },
) : null

return {
  status: unverifiedAreas.length ? 'done-unverified' : 'done',
  unverified: unverifiedAreas,
  measurements: found.map(f => ({ area: f.area, measurements: f.measurements || [] })),
  notes: found.flatMap(f => f.notes || []),
  docs: docsDone ? 'updated' : 'docs agent failed; docs not updated',
  docs_problems: docsCheck ? docsCheck.problems : ['docs check did not run or failed; docs unverified'],
}
