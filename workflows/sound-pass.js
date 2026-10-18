// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'sound-pass',
  description: 'Create or refresh a batch of sound cues end to end: plan against the event list and cue contract, make each cue in parallel (separate files, no shared edits), integrate all contract and provenance lines in one edit, mix-check, review, update docs, then push it as a handoff for engineering-practices deliver-package or land-pr. Use for any set of new or replaced sounds. args: { cues: [{ name: "ui_button_confirm", brief: "what it must tell the player and how it should feel" }, ...], scope?: "feature or level name for docs" }',
  phases: [
    { title: 'Plan', detail: 'check names, purpose, priority, variations; list doc kinds affected' },
    { title: 'Make', detail: 'one agent per cue: create sound, variations, source, provenance line' },
    { title: 'Integrate', detail: 'one agent applies all cue contract, provenance and credits lines' },
    { title: 'Check', detail: 'mix, loudness, budget and provenance review; fix loop' },
    { title: 'Docs', detail: 'update the planned Diataxis pages, then check one kind per page' },
    { title: 'Handoff', detail: 'commit and push the pass, run the project checks, return a handoff for engineering-practices deliver-package or land-pr' },
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
        how: 'Do each brief in next, in order: follow its prompt in this session (it may tell you to edit files, commit or push), and shape your answer to its schema when one is given, with every required field. A brief marked independent reviews work this run produced, so do not answer it yourself: send its prompt to a reviewer with no part in the work (the project\'s code-reviewer role, a fresh session or a fresh subagent), use their answer, and name them in run.reviewers under its key; if you must answer it yourself, it is listed in self_reviewed and must be reported as self-reviewed. A brief with a note was answered before without the fields it names. Add each answer to results under its key, then run this workflow again with the same args, run.results set to the merged results and run.reviewers to the merged reviewers. Repeat until status is "done". To avoid pasting results back on every call, drive the run with engineering-practices tools/run-inline.mjs and a state file instead: it stores each answer and prints only the next briefs.',
      }
    }
    return { run: mode, status: 'done', result: value, results: out, reviewers: by, self_reviewed, skipped, logs }
  }
  return { agent, phase, log, finish, halted, error }
})(typeof args === 'undefined' ? undefined : args, agent, phase, log)
if (RUN.error) return RUN.error
const RUN_OUT = await Promise.race([RUN.halted, (async (agent, phase, log) => {
// --- run-modes v2 end (workflow body follows; close it with the tail line) ---

const cues = (args && Array.isArray(args.cues)) ? args.cues.filter(c => c && c.name && c.brief) : []
if (!cues.length) {
  return 'Usage: sound-pass with args { cues: [{ name: "ui_button_confirm", brief: "confirms a choice; short, soft, positive" }], scope?: "settings menu" }'
}
const scope = (args && args.scope) || 'this sound pass'

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under the project\'s docs/<kind>/ (per its profile), keep each page to one kind, title it by the project pattern, and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

// ---------- Plan ----------
phase('Plan')
const PLAN = {
  type: 'object',
  properties: {
    cues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          brief: { type: 'string' },
          purpose: { type: 'string' },
          priority: { type: 'integer' },
          variations: { type: 'integer' },
          spatial: { type: 'string' },
          method: { type: 'string' },
          output_dir: { type: 'string' },
        },
        required: ['name', 'brief', 'purpose', 'priority', 'variations', 'output_dir'],
      },
    },
    doc_kinds: { type: 'array', items: { type: 'string' } },
    problems: { type: 'array', items: { type: 'string' } },
  },
  required: ['cues', 'doc_kinds', 'problems'],
}
const plan = await agent(
  `You are the sound-designer. Follow engineering-practices project-onboarding first. Then, following the sound-designer skills audio-brief-and-spotting and audio-implementation, plan this sound pass for ${scope}.\n` +
  `Requested cues:\n${JSON.stringify(cues, null, 2)}\n` +
  'For each cue: check the name against the naming rules and the existing cue contract (flag renames of names code already calls), write its purpose in one line, set priority (1-3), variation count, 2D/3D, source method (synth, record, layer, licensed), and a separate output_dir or file prefix so parallel makers never write the same file. ' +
  'List the Diataxis doc kinds this pass will affect (compass: reference for cue table/provenance, explanation for new design approaches, how-to for new procedures). Put blocking issues (unclear purpose, conflicting names) in problems. Do not edit any file.',
  { schema: PLAN, phase: 'Plan', label: 'plan' },
)
if (!plan || !Array.isArray(plan.cues)) return 'planning failed: no plan returned; nothing was changed.'
if (plan.problems && plan.problems.length) {
  return { status: 'blocked', stage: 'plan', problems: plan.problems }
}

// ---------- Make (parallel, no shared edits) ----------
phase('Make')
const MADE = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    files: { type: 'array', items: { type: 'string' } },
    source: { type: 'string' },
    contract_line: { type: 'string' },
    provenance_lines: { type: 'array', items: { type: 'string' } },
    credits_lines: { type: 'array', items: { type: 'string' } },
    integrated_lufs_or_peak: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['name', 'files', 'source', 'contract_line', 'provenance_lines'],
}
const made = await pipeline(plan.cues, c => agent(
  `You are the sound-designer. Following the sound-designer skills sound-effect-creation (or music-and-adaptive-scoring for music cues) and sound-provenance, and the tools named in the project profile, create cue "${c.name}".\n` +
  `Plan: ${JSON.stringify(c)}\n` +
  `Write only inside ${c.output_dir} (sources such as generator scripts or sessions go where the profile keeps audio sources, under a path named for this cue). Make ${c.variations} variation(s), edited and rendered at the project source format, checked for clicks and clipping. ` +
  'Do NOT edit the shared cue contract, provenance log or credits file: return the exact lines to add instead (contract_line in the contract\'s format with bus, volume/pitch ranges, voices, priority, spatial; one provenance line per file or layer; credits lines if a licence requires attribution). Report a level measurement.',
  { schema: MADE, phase: 'Make', label: `make:${c.name}` },
))
// Key results by index: made[i] belongs to plan.cues[i], whatever name the agent echoed.
const ok = made.map((m, i) => (m ? Object.assign({}, m, { name: plan.cues[i].name }) : null)).filter(Boolean)
const failed = plan.cues.filter((c, i) => !made[i]).map(c => c.name)
if (!ok.length) return { status: 'blocked', stage: 'make', problems: ['every cue maker failed'], failed }

// ---------- Integrate (single writer) ----------
phase('Integrate')
const integrated = await agent(
  'You are the sound-designer. Following the sound-designer skills audio-implementation and sound-provenance, apply these results in ONE edit per shared file: add or update every contract_line in the cue contract, every provenance line in the provenance log, every credits line in the credits file. Keep the files\' existing format and order.\n' +
  `Results:\n${JSON.stringify(ok, null, 2)}\n` +
  'Then configure the cues in the project\'s audio system as the contract says. Report what you changed.',
  { phase: 'Integrate', label: 'integrate' },
)
if (!integrated) return { status: 'blocked', stage: 'integrate', problems: ['integration agent failed; shared files may be unchanged'], made: ok.map(m => m.name) }

// ---------- Check (review and fix loop) ----------
phase('Check')
const REVIEW = {
  type: 'object',
  properties: {
    blockers: { type: 'array', items: { type: 'string' } },
    notes: { type: 'array', items: { type: 'string' } },
  },
  required: ['blockers'],
}
const reviewPrompt = 'You are reviewing a sound pass as a second sound-designer. Following the sound-designer skills mixing-and-loudness, audio-formats-and-budgets, audio-implementation and sound-provenance, check in the running project (or the closest available test): each new cue plays by name and is identifiable; no clicks, clipping or audible repetition; priority-1 cues cut through the busiest moment; voice limits set; formats and memory within budget; every new file has a provenance line and required credits; no non-commercial, unknown or imitative material. ' +
  `Cues: ${ok.map(m => m.name).join(', ')}. Return blockers (must fix before shipping) and notes. Do not edit files.`
let review = await agent(reviewPrompt, { schema: REVIEW, phase: 'Check', label: 'review', independent: true })
let unverified = !review
for (let round = 0; review && review.blockers && review.blockers.length && round < 2; round++) {
  const fixed = await agent(
    `You are the sound-designer. Fix these review blockers following the relevant sound-designer skills. A single agent edits shared files.\nBlockers:\n${review.blockers.join('\n')}`,
    { phase: 'Check', label: `fix-${round + 1}` },
  )
  if (!fixed) break
  review = await agent(reviewPrompt, { schema: REVIEW, phase: 'Check', label: `re-review-${round + 1}`, independent: true })
  if (!review) unverified = true
}
if (review && review.blockers && review.blockers.length) {
  return { status: 'blocked', stage: 'check', open: review.blockers, made: ok.map(m => m.name), failed }
}

// ---------- Docs: Do, then Check ----------
phase('Docs')
const docsDone = await agent(
  `You are the sound-designer documenting ${scope}. Planned doc kinds: ${JSON.stringify(plan.doc_kinds)}. Cues: ${ok.map(m => m.name).join(', ')}.\n${DOCS_FRAGMENT}\nThen commit sounds, sources, shared-file edits and docs together with a Conventional Commit (e.g. "feat(audio): add settings menu sounds").`,
  { schema: { type: 'object', properties: { pages: { type: 'array', items: { type: 'string' } }, undocumented: { type: 'array', items: { type: 'string' } } }, required: ['pages'] }, phase: 'Docs', label: 'docs-do' },
)
const DOCREV = { type: 'object', properties: { problems: { type: 'array', items: { type: 'string' } } }, required: ['problems'] }
const docsCheck = docsDone ? await agent(
  'Review the documentation pages touched by the last commit against the Diataxis rules: each page holds one kind only (no instructions in reference or explanation, no explanation beyond a clause in how-tos and tutorials); how-to titles name a user goal; explanation titles read with "About"; each page starts with a line saying its kind and audience; pages link to the related kinds. Return problems; do not edit.',
  { schema: DOCREV, phase: 'Docs', label: 'docs-check', independent: true },
) : null

const docsProblems = docsCheck ? (docsCheck.problems || []) : ['docs check did not run or failed; docs unverified']
const incomplete = !docsDone || docsProblems.length > 0 || failed.length > 0
const result = {
  status: incomplete ? 'incomplete' : (unverified ? 'done-unverified' : 'done'),
  made: ok.map(m => m.name),
  failed,
  review_notes: review ? (review.notes || []) : ['review agent failed; sounds unverified'],
  docs: docsDone ? 'updated' : 'docs agent failed; docs not updated',
  docs_problems: docsProblems,
}
if (incomplete) return result

// The handoff is what engineering-practices deliver-package takes as
// prior, so the sound pass ships without being made again.
phase('Handoff')
const HANDOFF = { type: 'object', properties: { branch: { type: 'string' }, pr: { type: 'string' }, head_sha: { type: 'string' }, tests_pass: { type: 'boolean' }, problem: { type: 'string' } }, required: ['branch', 'tests_pass'] }
const pages = Array.isArray(docsDone.pages) ? docsDone.pages : []
const hand = await agent(
  `Hand off the sound pass for ${scope} (cues: ${ok.map(m => m.name).join(', ')}). If you are on the default branch, cut a Conventional branch (feat/<slug>) from the latest remote default branch; otherwise stay on the current feature branch. Commit everything this run wrote that is not yet committed (the cue files and their sources, the cue contract, provenance log and credits file edits, the audio-system configuration, and the docs pages ${pages.join(', ') || 'as written'}) as Conventional Commits, and push. Run the project checks that apply (tests, asset or audio validator, docs and link checks the project profile names) on the pushed head. Do not open, mark ready or merge a PR: the engineering-practices workflow named in the result does that. Follow the engineering-practices git-workflow skill. Return the branch, any open PR, the head commit SHA, whether the checks pass on that head, and the problem if not.`,
  { schema: HANDOFF, phase: 'Handoff', label: 'handoff' },
)
if (!hand || !hand.branch) return { status: 'blocked', stage: 'handoff', open: [hand && hand.problem ? hand.problem : 'handoff step returned nothing; the pass may be uncommitted or unpushed'], made: ok.map(m => m.name), failed }
if (!hand.tests_pass) return { status: 'blocked', stage: 'handoff', open: [`project checks fail on ${hand.branch}${hand.head_sha ? ' at ' + hand.head_sha : ''}: ${hand.problem || 'no details'}`], made: ok.map(m => m.name), failed }
// Licensed or attributed sources are the pass's non-original items.
const nonOriginal = ok.filter(m => /licen/i.test(m.source || '') || (m.credits_lines || []).length).map(m => `${m.name}: ${m.source}`)
return Object.assign(result, {
  handoff: {
    from: 'sound-designer:sound-pass',
    branch: hand.branch,
    pr: hand.pr || '',
    head_sha: hand.head_sha || '',
    tests_pass: true,
    docs: pages,
    undocumented: Array.isArray(docsDone.undocumented) ? docsDone.undocumented : [],
    non_original: nonOriginal,
    notes: [`provenance recorded for ${ok.length} cue(s) in the project's provenance log`].concat(unverified ? ['a reviewer agent failed; the sounds are unverified'] : []),
  },
  next: 'ship it without rebuilding: /engineering-practices:deliver-package { wp: "<the package>", prior: <this result> }; with no work package, /engineering-practices:land-pr { branch: "<handoff.branch>" }',
})
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
