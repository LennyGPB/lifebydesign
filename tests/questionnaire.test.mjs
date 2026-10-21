import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

// Execute the project's TypeScript business rules with the installed compiler.
const require = createRequire(import.meta.url);
const previous = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { recommend, validateAnswers, cleanAnswers, leadPriority } = require('../lib/questionnaire.ts');
const { getFormuleById } = require('../config/formules.ts');
require.extensions['.ts'] = previous;

const base = {
  firstName: 'Test', email: 'test@example.com', telegram: '@test_profile', instagram: '',
  location: 'idf', adult: 'yes', level: 'new', experience: ['none'], blocker: 'strategy',
  job: 'employee', time: '3to6', format: 'presentiel', rhythm: 'monthly', reserve: 'ready',
  budget: '2300plus', commitment: '9', motivation: 'Je souhaite construire une routine et une strategie ecrite.',
  money: 'calm', source: 'instagram', confirmations: ['skill', 'education', 'coachable'],
};

test('a complete profile validates and optional fields can be empty', () => assert.deepEqual(validateAnswers(base), {}));
test('all exclusion rules are applied before matching a formula', () => {
  for (const [patch, reason] of [[{ adult: 'no' }, 'age'], [{ reserve: 'living' }, 'reserve'], [{ budget: 'under1200' }, 'budget']]) {
    assert.deepEqual(recommend({ ...base, ...patch }), { status: 'blocked', reason });
  }
});
const fixtures = [
  [{}, 'complet-presentiel', '6 mois'],
  [{ level: 'basics' }, 'complet-presentiel', '6 mois'],
  [{ level: 'advanced', rhythm: 'weekly' }, 'complet-presentiel', '6 mois'],
  [{ level: 'intermediate' }, 'avance-presentiel', '4 mois'],
  [{ level: 'advanced' }, 'avance-presentiel', '3 mois'],
  [{ format: 'distance' }, 'complet-distance', '6 mois'],
  [{ level: 'advanced', format: 'distance' }, 'avance-distance', '3 mois'],
  [{ location: 'france' }, 'complet-distance', '6 mois'],
  [{ location: 'abroad', level: 'intermediate' }, 'avance-distance', '4 mois'],
  [{ budget: '1200to1800' }, 'complet-distance', '6 mois'],
  [{ budget: '1800to2300' }, 'complet-presentiel', '6 mois'],
  [{ level: 'advanced', budget: '1200to1800' }, 'avance-presentiel', '3 mois'],
];
for (const [patch, id, duration] of fixtures) test(`matching ${JSON.stringify(patch)}`, () => {
  const result = recommend({ ...base, ...patch });
  assert.equal(result.status, 'recommended'); assert.equal(result.formuleId, id); assert.equal(result.duration, duration);
});
test('budget fallback and location fallback offer an in-person option', () => {
  assert.equal(recommend({ ...base, budget: '1200to1800' }).inPersonOption, true);
  assert.equal(recommend({ ...base, location: 'abroad' }).inPersonOption, true);
  assert.equal(recommend({ ...base, format: 'distance' }).inPersonOption, false);
});
test('budget never downgrades a beginner or weekly profile to advanced', () => {
  for (const level of ['new', 'basics', 'intermediate', 'advanced']) for (const rhythm of ['weekly', 'monthly']) for (const budget of ['under1200', '1200to1800', '1800to2300', '2300plus']) {
    const result = recommend({ ...base, level, rhythm, budget });
    if (result.status === 'recommended' && (['new', 'basics'].includes(level) || rhythm === 'weekly')) assert.equal(getFormuleById(result.formuleId).niveau, 'complet');
  }
});
test('all contextual recommendations are retained', () => {
  const result = recommend({ ...base, money: 'complicated', time: 'under3', reserve: 'building', blocker: 'discipline' });
  assert.equal(result.notes.length, 4);
  assert.match(result.notes[0], /inclus/);
});
test('experience cannot combine none with another choice', () => assert.ok(validateAnswers({ ...base, experience: ['none', 'plan'] }).experience));
test('all three confirmations are required, and duplicates rejected', () => {
  assert.ok(validateAnswers({ ...base, confirmations: ['skill', 'education'] }).confirmations);
  assert.ok(validateAnswers({ ...base, confirmations: ['skill', 'skill', 'coachable'] }).confirmations);
});
test('server validation rejects forged options and types', () => {
  for (const patch of [{ budget: 'unlimited' }, { commitment: '11' }, { email: 'not-email' }, { telegram: 'abc' }, { firstName: [] }, { experience: ['forged'] }, { motivation: '   ' }]) assert.ok(Object.keys(validateAnswers({ ...base, ...patch })).length);
});
test('normalization trims values, drops unexpected fields, and rejects objects', () => {
  assert.deepEqual(cleanAnswers({ firstName: ' Test ', hacked: true }), { firstName: 'Test' });
  assert.equal(cleanAnswers({ firstName: {} }), null);
  assert.equal(cleanAnswers(null), null);
});
test('priority is indicative and preserves low commitment and limited availability', () => {
  assert.equal(leadPriority(base), 'A');
  assert.equal(leadPriority({ ...base, commitment: '7' }), 'B');
  assert.equal(leadPriority({ ...base, reserve: 'building' }), 'B');
  assert.equal(leadPriority({ ...base, time: 'under3' }), 'B');
  assert.equal(leadPriority({ ...base, commitment: '5' }), 'C');
});
