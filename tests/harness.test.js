// Tests of verification/run-engine.mjs. Cases are written from the engine spec
// (sections 2 to 6), PROTOCOL.md sections 1 to 4, and the URS worked example F-01 only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HARNESS = fileURLToPath(new URL('../verification/run-engine.mjs', import.meta.url));
const X = '×';

function run(cases) {
  const p = spawnSync(process.execPath, [HARNESS], { input: JSON.stringify(cases), encoding: 'utf8' });
  assert.equal(p.status, 0, p.stderr);
  return JSON.parse(p.stdout);
}
const one = (fn, args, id = 'T-1') => run([{ id, fn, args }])[0];

test('harness: same order, same ids, envelope members on every result', () => {
  const out = run([
    { id: 'a', fn: 'squareVolume', args: { A: '1', d: '0.1' } },
    { id: 'b', fn: 'strengthFactor', args: { P: null, dyeNamed: false } },
    { id: 'c', fn: 'splitVolumes', args: { Vnew: '0', N: '2' } },
  ]);
  assert.deepEqual(out.map((r) => r.id), ['a', 'b', 'c']);
  assert.deepEqual(out.map((r) => r.status), ['result', 'incomplete', 'rejected']);
  for (const r of out) {
    for (const k of ['id', 'status', 'incomplete', 'rejection', 'flags', 'values', 'engine']) assert.ok(k in r, k);
    assert.equal(r.engine.package, '@ligant/bench-engines');
    assert.equal(r.engine.version, '0.1.0');
  }
});

test('harness: incompleteIndices is present and [] on done, rejected and scalar-missing incomplete results', () => {
  const out = run([
    { id: 'a', fn: 'squareVolume', args: { A: '1', d: '0.1' } },
    { id: 'b', fn: 'splitVolumes', args: { Vnew: '0', N: '2' } },
    { id: 'c', fn: 'strengthFactor', args: { P: null, dyeNamed: false } },
  ]);
  assert.deepEqual(out.map((r) => r.status), ['result', 'rejected', 'incomplete']);
  for (const r of out) assert.deepEqual(r.incompleteIndices, []);
});

test('harness: URS F-01 chained concentrations call', () => {
  const r = one('concentrations', { live: ['86', '94', '90', '90'], dead: ['8', '12', '10', '10'], P: '2', A: '1', d: '0.1' });
  assert.equal(r.status, 'result');
  assert.deepEqual(r.incomplete, []);
  assert.equal(r.rejection, null);
  assert.deepEqual(r.flags, []);
  assert.equal(r.values.Clive, 1800000);
  assert.equal(r.values.Cdead, 200000);
  assert.equal(r.values.Ctotal, 2000000);
  assert.equal(r.values.nSq, 4);
  assert.equal(r.values.sumLive, 360);
  assert.equal(r.values.sumDead, 40);
  assert.equal(r.values.f, 2);
  assert.equal(r.display.Clive, `1.80 ${X} 10^6`);
  assert.equal(r.display.Cdead, `2.00 ${X} 10^5`);
  assert.equal(r.display.Ctotal, `2.00 ${X} 10^6`);
  assert.equal(r.engine.module, 'E9');
});

test('harness: chained call merges incomplete across stages in argument order', () => {
  const r = one('concentrations', { live: ['5', null], dead: ['1', '1'], P: null, A: '1', d: ' ' });
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.incomplete, ['live', 'P', 'd']);
  assert.deepEqual(r.incompleteIndices, [1]);
  assert.deepEqual(r.values, {});
  assert.equal('display' in r, false);
});

test('harness: chained call reports RF-03 once, fields in argument order, square indices', () => {
  const r = one('concentrations', { live: ['5', '-2'], dead: ['1', '1'], P: '0.5', A: '1', d: '0.1' });
  assert.equal(r.status, 'rejected');
  assert.equal(r.rejection.code, 'CCS-RF-03');
  assert.deepEqual(r.rejection.fields, ['live', 'P']);
  assert.deepEqual(r.rejection.indices, [1]);
  assert.deepEqual(r.values, {});
  assert.equal('display' in r, false);
});

test('harness: chained call with nothing counted is RF-06', () => {
  const r = one('concentrations', { live: ['0', '0'], dead: ['0', '0'], P: '2', A: '1', d: '0.1' });
  assert.equal(r.status, 'rejected');
  assert.equal(r.rejection.code, 'CCS-RF-06');
});

test('harness: RF-05 engine members go to rejection.context, never to values', () => {
  const r = one('seedingVolumes', { rho: '2000', Vfinal: '5', Clive: '1000' });
  assert.equal(r.status, 'rejected');
  assert.equal(r.rejection.code, 'CCS-RF-05');
  assert.deepEqual(r.rejection.indices, []);
  assert.deepEqual(r.values, {});
  assert.equal(r.rejection.context.Vseed, 10);
  assert.equal(r.rejection.context.Vfinal, 5);
  assert.equal(r.rejection.context.Clive, 1000);
  assert.equal('display' in r, false);
  assert.equal('context' in r, false);
});

test('harness: FL-06 and FL-01 flags are codes in flags, not values', () => {
  const eq = one('seedingVolumes', { rho: '1000', Vfinal: '5', Clive: '1000' });
  assert.equal(eq.status, 'result');
  assert.deepEqual(eq.flags, ['CCS-FL-06']);
  assert.equal(eq.values.Vmed, 0);
  assert.equal(eq.display.Vmed, '0');
  assert.equal('flags' in eq.values, false);
  const f = one('strengthFactor', { P: '1', dyeNamed: true });
  assert.deepEqual(f.flags, ['CCS-FL-01']);
  assert.equal(f.values.f, 1);
});

test('harness: seeding volumes display (sig3 volumes, sci3 cells)', () => {
  const r = one('seedingVolumes', { rho: '50000', Vfinal: '10', Clive: '4000000' });
  assert.equal(r.values.cellsNeeded, 500000);
  assert.equal(r.display.Vseed, '0.125');
  assert.equal(r.display.Vmed, '9.88'); // 9.875 half away from zero
  assert.equal(r.display.cellsNeeded, `5.00 ${X} 10^5`);
});

test('harness: split N = 1 shows exact zero', () => {
  const r = one('splitVolumes', { Vnew: '10', N: '1' });
  assert.equal(r.values.Vmedium, 0);
  assert.equal(r.display.Vmedium, '0');
  assert.equal(r.display.Vtr, '10.0');
});

test('harness: viability and poissonCV displays; RF-07 and RF-06', () => {
  assert.equal(one('viability', { sumLive: '360', sumDead: '40' }).display.viabilityPercent, '90.0');
  assert.equal(one('viability', { sumLive: '0', sumDead: '5' }).display.viabilityPercent, '0.0');
  assert.equal(one('poissonCV', { sumLive: '360', sumDead: '40' }).display.cvPercent, '5.27');
  assert.equal(one('poissonCV', { sumLive: '0', sumDead: '4' }).rejection.code, 'CCS-RF-07');
  assert.equal(one('poissonCV', { sumLive: '0', sumDead: '0' }).rejection.code, 'CCS-RF-06');
  assert.equal(one('viability', { sumLive: '0', sumDead: '0' }).rejection.code, 'CCS-RF-06');
  assert.equal(one('seedingVolumes', { rho: '1', Vfinal: '1', Clive: '0' }).rejection.code, 'CCS-RF-07');
});

test('harness: Q7 args null and non-array live/dead are error cases, the rest still returned', () => {
  const out = run([
    { id: 'n', fn: 'squareVolume', args: null },
    { id: 'l', fn: 'meanPerSquare', args: { live: '5', dead: ['1'] } },
    { id: 'd', fn: 'meanPerSquare', args: { live: ['5'], dead: { 0: '1' } } },
    { id: 'c', fn: 'concentrations', args: { live: 5, dead: ['1'], P: '2', A: '1', d: '0.1' } },
    { id: 'ok', fn: 'squareVolume', args: { A: '1', d: '0.1' } },
  ]);
  assert.deepEqual(out.map((r) => r.id), ['n', 'l', 'd', 'c', 'ok']);
  assert.deepEqual(out.map((r) => r.status), ['error', 'error', 'error', 'error', 'result']);
});

test('harness: Q8 text members are 40-significant-digit truncated strings; Q6 moduleVersion is joined text', () => {
  const r = one('splitVolumes', { Vnew: '1', N: '3' });
  assert.equal(r.values.Vtr, '0.' + '3'.repeat(40));
  assert.equal(typeof r.values.Vmedium, 'string');
  const v = one('version', {});
  assert.equal(typeof v.engine.moduleVersion, 'string');
  assert.ok(v.engine.moduleVersion.includes(', '));
});

test('harness: meanPerSquare blank entry is incomplete with the square named', () => {
  const r = one('meanPerSquare', { live: ['1', ' ', '3'], dead: ['0', '1', null] });
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.incomplete, ['live', 'dead']);
  assert.deepEqual(r.incompleteIndices, [1, 2]);
  const bad = one('meanPerSquare', { live: ['1', '2.5'], dead: ['0', '1'] });
  assert.equal(bad.status, 'rejected');
  assert.deepEqual(bad.rejection.fields, ['live']);
  assert.deepEqual(bad.rejection.indices, [1]);
});

test('harness: totalCells after leaves liveRemaining null and undisplayed', () => {
  const r = one('totalCells', { Clive: '1000', Ctotal: '2000', Vsusp: '5', timing: 'after', Valiquot: null });
  assert.equal(r.status, 'result');
  assert.equal(r.values.liveCells, 5000);
  assert.equal(r.values.allCells, 10000);
  assert.equal(r.values.liveRemaining, null);
  assert.equal('liveRemaining' in r.display, false);
  assert.equal(r.display.liveCells, `5.00 ${X} 10^3`);
  assert.equal(one('totalCells', { Clive: '1', Ctotal: '2', Vsusp: '5', timing: 'before', Valiquot: '5' }).rejection.code, 'CCS-RF-04');
});

test('harness: display cases carry the string; version carries the engine block', () => {
  assert.equal(one('display', { mode: 'fixed1', value: '81.25' }).display.value, '81.3');
  assert.equal(one('display', { mode: 'sci3', value: '9995000' }).display.value, `1.00 ${X} 10^7`);
  assert.equal(one('display', { mode: 'sig3', value: '2.675' }).display.value, '2.68');
  const v = one('version', {});
  assert.equal(v.status, 'result');
  assert.equal(v.engine.package, '@ligant/bench-engines');
  assert.equal(v.engine.version, '0.1.0');
  assert.ok(v.engine.moduleVersion);
});

test('harness: an exception, an unknown fn and the held x10Comparison are error (P2); others still returned', () => {
  const out = run([
    { id: 'e1', fn: 'x10Comparison', args: { Vsq: '0.1' } },
    { id: 'e2', fn: 'noSuchFunction', args: {} },
    { id: 'e3', fn: 'display', args: { mode: 'sci4', value: '1' } },
    { id: 'ok', fn: 'squareVolume', args: { A: '1', d: '2' } },
  ]);
  assert.deepEqual(out.map((r) => r.status), ['error', 'error', 'error', 'result']);
  assert.deepEqual(out.map((r) => r.id), ['e1', 'e2', 'e3', 'ok']);
  assert.deepEqual(out[0].values, {});
  assert.equal(out[3].values.Vsq, 2);
});

test('harness: no arithmetic operators in run-engine.mjs (G8 grep)', () => {
  const src = readFileSync(HARNESS, 'utf8')
    .replace(/\/\/.*$/gm, '')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
  assert.equal(/[-+*%<]/.test(src), false, 'operator found');
  assert.equal(/\/(?![/])/.test(src), false, 'division found');
});
