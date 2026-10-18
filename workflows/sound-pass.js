// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'sound-pass',
  description: 'Create or refresh a batch of sound cues end to end: plan against the event list and cue contract, make each cue in parallel (separate files, no shared edits), integrate all contract and provenance lines in one edit, mix-check, review, and update docs. Use for any set of new or replaced sounds. args: { cues: [{ name: "ui_button_confirm", brief: "what it must tell the player and how it should feel" }, ...], scope?: "feature or level name for docs" }',
  phases: [
    { title: 'Plan', detail: 'check names, purpose, priority, variations; list doc kinds affected' },
    { title: 'Make', detail: 'one agent per cue: create sound, variations, source, provenance line' },
    { title: 'Integrate', detail: 'one agent applies all cue contract, provenance and credits lines' },
    { title: 'Check', detail: 'mix, loudness, budget and provenance review; fix loop' },
    { title: 'Docs', detail: 'update the planned Diataxis pages, then check one kind per page' },
  ],
}

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
let review = await agent(reviewPrompt, { schema: REVIEW, phase: 'Check', label: 'review' })
let unverified = !review
for (let round = 0; review && review.blockers && review.blockers.length && round < 2; round++) {
  const fixed = await agent(
    `You are the sound-designer. Fix these review blockers following the relevant sound-designer skills. A single agent edits shared files.\nBlockers:\n${review.blockers.join('\n')}`,
    { phase: 'Check', label: `fix-${round + 1}` },
  )
  if (!fixed) break
  review = await agent(reviewPrompt, { schema: REVIEW, phase: 'Check', label: `re-review-${round + 1}` })
  if (!review) unverified = true
}
if (review && review.blockers && review.blockers.length) {
  return { status: 'blocked', stage: 'check', open: review.blockers, made: ok.map(m => m.name), failed }
}

// ---------- Docs: Do, then Check ----------
phase('Docs')
const docsDone = await agent(
  `You are the sound-designer documenting ${scope}. Planned doc kinds: ${JSON.stringify(plan.doc_kinds)}. Cues: ${ok.map(m => m.name).join(', ')}.\n${DOCS_FRAGMENT}\nThen commit sounds, sources, shared-file edits and docs together with a Conventional Commit (e.g. "feat(audio): add settings menu sounds").`,
  { phase: 'Docs', label: 'docs-do' },
)
const DOCREV = { type: 'object', properties: { problems: { type: 'array', items: { type: 'string' } } }, required: ['problems'] }
const docsCheck = docsDone ? await agent(
  'Review the documentation pages touched by the last commit against the Diataxis rules: each page holds one kind only (no instructions in reference or explanation, no explanation beyond a clause in how-tos and tutorials); how-to titles name a user goal; explanation titles read with "About"; each page starts with a line saying its kind and audience; pages link to the related kinds. Return problems; do not edit.',
  { schema: DOCREV, phase: 'Docs', label: 'docs-check' },
) : null

const docsProblems = docsCheck ? (docsCheck.problems || []) : ['docs check did not run or failed; docs unverified']
const incomplete = !docsDone || docsProblems.length > 0 || failed.length > 0
return {
  status: incomplete ? 'incomplete' : (unverified ? 'done-unverified' : 'done'),
  made: ok.map(m => m.name),
  failed,
  review_notes: review ? (review.notes || []) : ['review agent failed; sounds unverified'],
  docs: docsDone ? 'updated' : 'docs agent failed; docs not updated',
  docs_problems: docsProblems,
}
