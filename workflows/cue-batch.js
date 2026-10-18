export const meta = {
  name: 'cue-batch',
  description: 'Synthesise a set of sound cues in parallel, then mix-check them together',
  whenToUse: 'Make or refresh many cues. args: { cues: [{ name: "<cue name>", brief: "<what it should sound like>" }, ...] }',
  phases: [{ title: 'Make', detail: 'one agent per cue' }, { title: 'Mix', detail: 'levels, clipping, cue table' }],
}
const cues = (args && args.cues) || []
if (!cues.length) return 'Pass args.cues: [{ name, brief }].'
const R = { type: 'object', properties: { name: { type: 'string' }, file: { type: 'string' }, peak_dbfs: { type: 'number' }, generator: { type: 'string' } }, required: ['name', 'file', 'generator'] }
const made = await pipeline(cues, c => agent(`Following the sound-designer sound-synthesis skill and the project profile's tools, create cue "${c.name}": ${c.brief}. Write a generator script in the project's tools folder, render the file, and report its peak level. Do not edit the shared cue table or provenance log; return the lines to add.`, { schema: R, phase: 'Make', label: `cue:${c.name}` }))
phase('Mix')
return await agent(`Mix-check these cues together:\n${JSON.stringify(made.filter(Boolean))}\nNormalise to the skill's levels, check that a rapid chain of the busiest cues doesn't clip, then add every cue to the cue table and provenance log in one edit. Commit with Conventional Commits.`, { label: 'mix' })
