// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'adaptive-music',
  description: 'Design, compose and implement one adaptive music piece: choose the structure (segments, layers, stingers), compose each part in parallel into separate files, implement states and transitions in one edit, audition every transition and layer combination, then document. args: { piece: "mus_explore", states: ["calm", "tension", "intense"], brief: "mood, setting, what the music tells the player" }',
  phases: [
    { title: 'Plan', detail: 'structure, parts, transition table, doc kinds' },
    { title: 'Compose', detail: 'one agent per part (segment, layer or stinger), separate files' },
    { title: 'Implement', detail: 'one agent wires states, transitions, contract and provenance' },
    { title: 'Check', detail: 'audition all transitions and combinations; fix loop' },
    { title: 'Docs', detail: 'reference and explanation for the music system; check one kind per page' },
  ],
}

const piece = args && args.piece
const states = (args && Array.isArray(args.states)) ? args.states.filter(Boolean) : []
const brief = args && args.brief
if (!piece || !states.length || !brief) {
  return 'Usage: adaptive-music with args { piece: "mus_explore", states: ["calm", "tension", "intense"], brief: "calm forest exploration that tightens as threats approach" }'
}

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under the project\'s docs/<kind>/ (per its profile), keep each page to one kind, title it by the project pattern, and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

phase('Plan')
const PLAN = {
  type: 'object',
  properties: {
    structure: { type: 'string' },
    tempo_meter_key: { type: 'string' },
    parts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          kind: { type: 'string' },
          role: { type: 'string' },
          length: { type: 'string' },
          output_dir: { type: 'string' },
        },
        required: ['name', 'kind', 'role', 'output_dir'],
      },
    },
    transitions: { type: 'array', items: { type: 'string' } },
    doc_kinds: { type: 'array', items: { type: 'string' } },
    problems: { type: 'array', items: { type: 'string' } },
  },
  required: ['structure', 'tempo_meter_key', 'parts', 'transitions', 'doc_kinds', 'problems'],
}
const plan = await agent(
  `You are the sound-designer. Follow engineering-practices project-onboarding first. Following the sound-designer skill music-and-adaptive-scoring, plan adaptive piece "${piece}" with states ${JSON.stringify(states)}. Brief: ${brief}.\n` +
  'Choose the simplest structure that serves play (linear loop, horizontal segments, vertical layers, hybrid, plus stingers), fix tempo, meter and key plan, list every part (segment, layer stem or stinger) with a separate output_dir or file prefix, and write a transition table row per state change (when: immediate/beat/bar/segment end; how: crossfade, transition segment, stinger; what if it flips back). Confirm trigger and parameter names exist or flag them in problems. List the Diataxis doc kinds affected. Do not edit files.',
  { schema: PLAN, phase: 'Plan', label: 'plan' },
)
if (!plan || !Array.isArray(plan.parts) || !plan.parts.length) return 'planning failed: no structure returned; nothing was changed.'
if (plan.problems && plan.problems.length) return { status: 'blocked', stage: 'plan', problems: plan.problems }

phase('Compose')
const PART = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    files: { type: 'array', items: { type: 'string' } },
    source: { type: 'string' },
    loop_points: { type: 'string' },
    provenance_lines: { type: 'array', items: { type: 'string' } },
  },
  required: ['name', 'files', 'source', 'provenance_lines'],
}
const parts = await pipeline(plan.parts, p => agent(
  `You are the sound-designer composing part "${p.name}" (${p.kind}: ${p.role}) of "${piece}". Following the sound-designer skills music-and-adaptive-scoring and sound-provenance: tempo/meter/key ${plan.tempo_meter_key}; structure ${plan.structure}. ` +
  `Original material only. Write only inside ${p.output_dir}; keep the session or generator source where the profile keeps audio sources. Stems share length and start; loops are sample-accurate and seamless; layers must sound complete in every allowed combination. ` +
  'Do NOT edit the cue contract, provenance log or credits: return provenance lines and loop points.',
  { schema: PART, phase: 'Compose', label: `part:${p.name}` },
))
const done = parts.filter(Boolean)
const missing = plan.parts.filter(p => !done.some(d => d.name === p.name)).map(p => p.name)
if (missing.length) return { status: 'blocked', stage: 'compose', problems: [`parts not produced: ${missing.join(', ')}`], produced: done.map(d => d.name) }

phase('Implement')
const impl = await agent(
  `You are the sound-designer. Following the sound-designer skills audio-implementation and music-and-adaptive-scoring, implement "${piece}" in the project's audio system: states ${JSON.stringify(states)}, parts ${JSON.stringify(done)}, transitions ${JSON.stringify(plan.transitions)}. ` +
  'As the single writer, add the music cues and parameters to the cue contract and every provenance line to the provenance log in one edit each. Route music to the music bus with ducking per mixing-and-loudness.',
  { phase: 'Implement', label: 'implement' },
)
if (!impl) return { status: 'blocked', stage: 'implement', problems: ['implementation agent failed; contract and log may be unchanged'] }

phase('Check')
const REVIEW = { type: 'object', properties: { blockers: { type: 'array', items: { type: 'string' } }, notes: { type: 'array', items: { type: 'string' } } }, required: ['blockers'] }
const reviewPrompt = `Review adaptive piece "${piece}" as a second sound-designer, following the sound-designer skills music-and-adaptive-scoring and mixing-and-loudness. Force every transition in this table: ${JSON.stringify(plan.transitions)}, including flipping back mid-transition, and every layer combination. Listen for clicks, gaps, clashes, level jumps, seams, and music masking priority-1 cues. Check provenance lines exist for every file and the material is original. Return blockers and notes. Do not edit files.`
let review = await agent(reviewPrompt, { schema: REVIEW, phase: 'Check', label: 'review' })
let unverified = !review
for (let round = 0; review && review.blockers && review.blockers.length && round < 2; round++) {
  const fixed = await agent(`You are the sound-designer. Fix these blockers in "${piece}" following music-and-adaptive-scoring; you are the only agent editing files.\n${review.blockers.join('\n')}`, { phase: 'Check', label: `fix-${round + 1}` })
  if (!fixed) break
  review = await agent(reviewPrompt, { schema: REVIEW, phase: 'Check', label: `re-review-${round + 1}` })
  if (!review) unverified = true
}
if (review && review.blockers && review.blockers.length) return { status: 'blocked', stage: 'check', open: review.blockers }

phase('Docs')
const docsDone = await agent(
  `You are the sound-designer documenting adaptive piece "${piece}": structure ${plan.structure}; tempo/meter/key ${plan.tempo_meter_key}; transitions ${JSON.stringify(plan.transitions)}. Planned doc kinds: ${JSON.stringify(plan.doc_kinds)} (typically reference for states, parameters, transition table and loop points; explanation for why this structure).\n${DOCS_FRAGMENT}\nCommit music, sources, shared-file edits and docs together with a Conventional Commit (e.g. "feat(audio): add adaptive exploration music").`,
  { phase: 'Docs', label: 'docs-do' },
)
const DOCREV = { type: 'object', properties: { problems: { type: 'array', items: { type: 'string' } } }, required: ['problems'] }
const docsCheck = docsDone ? await agent(
  'Review the documentation pages touched by the last commit against the Diataxis rules: one kind per page; reference dry and structured; explanation titled "About ..." with reasons and trade-offs; how-to titles name a goal; each page opens with its kind and audience; related kinds linked. Return problems; do not edit.',
  { schema: DOCREV, phase: 'Docs', label: 'docs-check' },
) : null

return {
  status: unverified ? 'done-unverified' : 'done',
  piece,
  parts: done.map(d => d.name),
  notes: review ? (review.notes || []) : ['review agent failed; music unverified'],
  docs: docsDone ? 'updated' : 'docs agent failed; docs not updated',
  docs_problems: docsCheck ? docsCheck.problems : ['docs check did not run or failed; docs unverified'],
}
