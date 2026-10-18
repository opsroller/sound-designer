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

// --- run-modes v2 begin ---
const RUN = ((a, realAgent, realPhase, realLog) => {
  const opted = !!(a && typeof a === 'object' && a.run && typeof a.run === 'object')
  const c = opted ? a.run : {}
  const mode = c.mode === 'inline' ? 'inline' : 'agents'
  const results = c.results && typeof c.results === 'object' ? c.results : {}
  const reviewers = c.reviewers && typeof c.reviewers === 'object' ? c.reviewers : {}
  const only = Array.isArray(c.only) && c.only.length ? c.only.map(String) : null
  const from = c.from ? String(c.from) : null
  const titles = typeof meta !== 'undefined' && meta && Array.isArray(meta.phases) ? meta.phases.map((p) => p.title) : []
  const unknown = titles.length ? (from ? [from] : []).filter((t) => !titles.includes(t)) : []
  const error = c.mode && !['agents', 'inline'].includes(c.mode)
    ? `run.mode must be "agents" or "inline", got "${c.mode}"`
    : unknown.length ? `run.from names no phase: ${unknown.join(', ')}. Phases: ${titles.join(', ')}` : null
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
  // An answer must carry every required key of its schema, as the runtime
  // enforces for agents; returns the missing keys, or null when it fits.
  const missing = (v, schema) => {
    if (v === null || v === undefined) return 'an answer'
    if (!schema || schema.type !== 'object') return null
    if (typeof v !== 'object' || Array.isArray(v)) return 'a JSON object'
    const gap = (schema.required || []).filter((k) => !has(v, k) || v[k] === undefined)
    return gap.length ? gap.join(', ') : null
  }
  const seen = {}
  const out = {}
  // Who answered each step marked independent: "subagent" when this run
  // spawned it, else the reviewer named in run.reviewers, else "self".
  const by = {}
  const who = (k) => (typeof reviewers[k] === 'string' && reviewers[k].trim() ? reviewers[k].trim() : 'self')
  const skipped = []
  const next = []
  const logs = []
  let current = ''
  let reached = !from
  let halting = false
  let release = () => {}
  const halted = new Promise((r) => { release = r })
  const picked = (ph, label) => reached && (!only || only.some((s) => s === ph || s === label || label.startsWith(s + ':')))
  const agent = (prompt, opts) => {
    const op = opts || {}
    const independent = op.independent === true
    const ph = op.phase || current
    const base = op.label || ph || 'agent'
    seen[base] = (seen[base] || 0) + 1
    const key = seen[base] > 1 ? `${base}#${seen[base]}` : base
    let note = null
    if (has(results, key)) {
      const gap = missing(results[key], op.schema)
      if (!gap) { out[key] = results[key]; if (independent) by[key] = who(key); return Promise.resolve(results[key]) }
      note = `answer missing ${gap}; answer this brief again`
    }
    if (!picked(ph, base)) { skipped.push(key); return Promise.resolve(null) }
    if (mode === 'agents') {
      const pass = Object.assign({}, op)
      delete pass.independent
      return realAgent(prompt, opts ? pass : opts).then((r) => {
        if (r !== null && r !== undefined) { out[key] = r; if (independent) by[key] = 'subagent' }
        return r
      })
    }
    const brief = { key, phase: ph, prompt, schema: op.schema || null }
    if (independent) brief.independent = true
    if (note) brief.note = note
    next.push(brief)
    if (!halting) {
      halting = true
      // Wait 200 microtask turns before pausing, so every sibling in a
      // parallel() or pipeline() fan-out queues its brief into this pause.
      ;(async () => { for (let i = 0; i < 200; i++) await null; release('__run_halted__') })()
    }
    return new Promise(() => {})
  }
  const phase = (t) => { current = t; if (from && t === from) reached = true; return realPhase(t) }
  const log = (m) => { logs.push(String(m)); return realLog(m) }
  const finish = (value) => {
    if (!opted) return value
    const self_reviewed = Object.keys(by).filter((k) => by[k] === 'self')
    if (value === '__run_halted__') {
      return {
        run: 'inline', status: 'next', next, results: out, reviewers: by, self_reviewed, skipped, logs,
        how: 'Do each brief in next, in order: follow its prompt in this session (it may tell you to edit files, commit or push), and shape your answer to its schema when one is given, with every required field. A brief marked independent reviews work this run produced, so do not answer it yourself: send its prompt to a reviewer with no part in the work (the project\'s code-reviewer role, a fresh session or a fresh subagent), use their answer, and name them in run.reviewers under its key; if you must answer it yourself, it is listed in self_reviewed and must be reported as self-reviewed. A brief with a note was answered before without the fields it names. Add each answer to results under its key, then run this workflow again with the same args, run.results set to the merged results and run.reviewers to the merged reviewers. Repeat until status is "done".',
      }
    }
    return { run: mode, status: 'done', result: value, results: out, reviewers: by, self_reviewed, skipped, logs }
  }
  return { agent, phase, log, finish, halted, error }
})(typeof args === 'undefined' ? undefined : args, agent, phase, log)
if (RUN.error) return RUN.error
const RUN_OUT = await Promise.race([RUN.halted, (async (agent, phase, log) => {
// --- run-modes v2 end (workflow body follows; close it with the tail line) ---

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
// Key results by index: audits[i] belongs to areas[i], whatever area name the agent echoed.
const found = audits.map((f, i) => (f ? Object.assign({}, f, { area: areas[i].area }) : null)).filter(Boolean)
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
    { schema: FIND, phase: 'Fix', label: `recheck:${a.area}`, independent: true },
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
  { schema: DOCREV, phase: 'Docs', label: 'docs-check', independent: true },
) : null

const docsProblems = docsCheck ? (docsCheck.problems || []) : ['docs check did not run or failed; docs unverified']
const incomplete = !docsDone || docsProblems.length > 0
return {
  status: incomplete ? 'incomplete' : (unverifiedAreas.length ? 'done-unverified' : 'done'),
  unverified: unverifiedAreas,
  measurements: found.map(f => ({ area: f.area, measurements: f.measurements || [] })),
  notes: found.flatMap(f => f.notes || []),
  docs: docsDone ? 'updated' : 'docs agent failed; docs not updated',
  docs_problems: docsProblems,
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
