// Written from the signed spec (sections 2-6) and the URS worked example F-01 only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e9, e7, e10, ENGINE_VERSION, version } from '../src/index.js';

const X = '×';

test('F-01 chain: square volume, mean, concentrations, viability, CV', () => {
  const vsq = e9.squareVolume('1', '0.1');
  assert.equal(vsq.status, 'result');
  assert.equal(vsq.Vsq, '0.1'); // spec :21 text member, not a float
  const m = e9.meanPerSquare(['86', '94', '90', '90'], ['8', '12', '10', '10']);
  assert.deepEqual([m.nSq, m.sumLive, m.sumDead, m.Lbar, m.Dbar], [4, 360, 40, 90, 10]);
  const f = e10.strengthFactor('2', false);
  assert.equal(f.f, 2);
  const c = e9.concentrations(m.Lbar, m.Dbar, f.f, vsq.Vsq, m.sumLive, m.sumDead);
  assert.equal(e9.display('sci3', String(c.Clive)), `1.80 ${X} 10^6`);
  assert.equal(e9.display('sci3', String(c.Cdead)), `2.00 ${X} 10^5`);
  assert.equal(e9.display('sci3', String(c.Ctotal)), `2.00 ${X} 10^6`);
  assert.equal(e9.display('fixed1', String(e9.viability({ sumLive: 360, sumDead: 40 }).viabilityPercent)), '90.0');
  assert.equal(e9.display('fixed2', String(e7.poissonCV({ sumLive: '360', sumDead: '40' }).cvPercent)), '5.27');
});

test('engine block on every result', () => {
  const r = e9.squareVolume('1', '0.1');
  assert.equal(r.engine.package, '@ligant/bench-engines');
  assert.equal(r.engine.version, ENGINE_VERSION);
  assert.equal(r.engine.module, 'E9');
  assert.equal(e7.poissonCV({ sumLive: '4', sumDead: '0' }).engine.module, 'E7');
  assert.equal(e10.splitVolumes('10', '5').engine.module, 'E10');
});

test('incomplete lists every missing field in argument order; blank counts as missing', () => {
  assert.deepEqual(e9.squareVolume(null, '  ').missing, ['A', 'd']);
  assert.equal(e9.squareVolume(null, '  ').status, 'incomplete');
  assert.deepEqual(e10.splitVolumes('', null).missing, ['Vnew', 'N']);
  assert.deepEqual(e10.strengthFactor(null).missing, ['P']);
});

test('non-plain-decimal text is rejected CCS-RF-03, never thrown', () => {
  for (const bad of ['2e5', '2x10^5', '1,5', 'NaN', 'Infinity', '0x10', '5 mL']) {
    const r = e9.squareVolume(bad, '0.1');
    assert.equal(r.status, 'rejected', bad);
    assert.equal(r.code, 'CCS-RF-03');
    assert.deepEqual(r.fields, ['A']);
  }
  assert.deepEqual(e9.squareVolume('0', '-1').fields, ['A', 'd']);
});

test('strengthFactor: bounds and FL-01', () => {
  assert.equal(e10.strengthFactor('1', false).f, 1);
  assert.deepEqual(e10.strengthFactor('1', false).flags, []);
  assert.deepEqual(e10.strengthFactor('1.0', true).flags, ['CCS-FL-01']);
  assert.deepEqual(e10.strengthFactor('2', true).flags, []);
  assert.equal(e10.strengthFactor('0.99').code, 'CCS-RF-03');
  assert.equal(e10.strengthFactor('1.5').f, 1.5);
});

test('splitVolumes: Vtr = Vnew/N, medium = Vnew - Vtr; N = 1 allowed', () => {
  const r = e10.splitVolumes('12', '4');
  assert.equal(r.Vtr, 3);
  assert.equal(r.Vmedium, 9);
  const one = e10.splitVolumes('10', '1');
  assert.equal(one.Vtr, 10);
  assert.equal(one.Vmedium, 0);
  assert.equal(Object.is(one.Vmedium, 0), true);
  assert.equal(e9.display('sig3', String(one.Vmedium)), '0');
  assert.deepEqual(e10.splitVolumes('0', '0.5').fields, ['Vnew', 'N']);
  assert.equal(e10.splitVolumes('1', '3').Vtr, '0.' + '3'.repeat(40)); // Q8: 40 significant digits, truncated
});

test('meanPerSquare: refusals with indices; no SD returned', () => {
  const r = e9.meanPerSquare(['1', '2.5', '3'], ['0', '1', '-1']);
  assert.equal(r.status, 'rejected');
  assert.equal(r.code, 'CCS-RF-03');
  assert.deepEqual(r.fields, ['live', 'dead']);
  assert.deepEqual(r.indices, [1, 2]);
  assert.equal(e9.meanPerSquare([], []).code, 'CCS-RF-03');
  assert.equal(e9.meanPerSquare(['1'], ['1', '2']).code, 'CCS-RF-03');
  const ok = e9.meanPerSquare(['0', '20.0'], ['0', '0']);
  assert.equal(ok.status, 'result');
  assert.equal(ok.Lbar, 10);
  assert.equal('sd' in ok || 'cv' in ok, false);
  assert.equal(e9.meanPerSquare(null, ['1']).status, 'incomplete');
});

test('concentrations: RF-06 when nothing counted; dead cells/mL by derivation', () => {
  assert.equal(e9.concentrations(0, 0, 2, 0.1, 0, 0).code, 'CCS-RF-06');
  const r = e9.concentrations('0', '2', '1', '1', '0', '8');
  assert.equal(r.Clive, 0);
  assert.equal(r.Cdead, 2000);
  assert.equal(r.Ctotal, 2000);
  assert.equal(e9.concentrations('1', '1', '0.5', '1', '1', '1').fields[0], 'f');
});

test('viability: ratio of sums, RF-06, RF-03, zero live', () => {
  assert.equal(e9.viability({ sumLive: '81.25', sumDead: '0' }).code, 'CCS-RF-03');
  assert.equal(e9.viability({ sumLive: '0', sumDead: '5' }).viabilityPercent, 0);
  assert.equal(e9.viability({ sumLive: '0', sumDead: '0' }).code, 'CCS-RF-06');
  assert.equal(e9.viability({ sumLive: '3', sumDead: null }).status, 'incomplete');
  assert.equal(e9.viability({ sumLive: 3, sumDead: 1 }).viabilityPercent, 75);
});

test('totalCells: before and after, RF-04, incomplete', () => {
  const b = e9.totalCells('1e0'.replace('e0', ''), '2', '10', 'before', '4');
  assert.equal(b.liveCells, 10);
  assert.equal(b.allCells, 20);
  assert.equal(b.liveRemaining, 6);
  const a = e9.totalCells('1', '2', '10', 'after', null);
  assert.equal(a.liveRemaining, null);
  assert.equal(e9.totalCells('1', '2', '10', 'before', '10').code, 'CCS-RF-04');
  assert.deepEqual(e9.totalCells('1', '2', null, null, null).missing, ['Vsusp', 'timing']);
  assert.deepEqual(e9.totalCells('1', '2', '10', 'before', null).missing, ['Valiquot']);
  assert.equal(e9.totalCells('1', '2', '0', 'after', null).code, 'CCS-RF-03');
});

test('seedingVolumes: relation, FL-06, RF-05, RF-07, exact comparison', () => {
  const r = e9.seedingVolumes('50000', '10', '4000000');
  assert.equal(r.cellsNeeded, 500000);
  assert.equal(r.Vseed, 0.125);
  assert.equal(r.Vmed, 9.875);
  assert.deepEqual(r.flags, []);
  assert.equal(e9.display('sig3', String(r.Vseed)), '0.125');
  const eq = e9.seedingVolumes('1000', '5', '1000');
  assert.deepEqual(eq.flags, ['CCS-FL-06']);
  assert.equal(eq.Vmed, 0);
  const over = e9.seedingVolumes('1000.0000000000000001', '5', '1000');
  assert.equal(over.code, 'CCS-RF-05');
  assert.equal(over.Vfinal, 5);
  assert.equal(over.Clive, 1000);
  assert.equal(e9.seedingVolumes('1', '5', '0').code, 'CCS-RF-07');
  assert.deepEqual(e9.seedingVolumes(null, '5', '1').missing, ['rho']);
  assert.equal(e9.seedingVolumes('0', '5', '1').code, 'CCS-RF-03');
});

test('poissonCV: relation and refusals', () => {
  assert.equal(e7.poissonCV({ sumLive: '100', sumDead: '3' }).cvPercent, 10);
  assert.equal(e7.poissonCV({ sumLive: '0', sumDead: '3' }).code, 'CCS-RF-07');
  assert.equal(e7.poissonCV({ sumLive: '0', sumDead: '0' }).code, 'CCS-RF-06');
  assert.equal(e7.poissonCV({ sumLive: '-1', sumDead: '0' }).code, 'CCS-RF-03');
  assert.equal(e7.poissonCV({ sumLive: '4', sumDead: '1.5' }).code, 'CCS-RF-03');
  assert.deepEqual(e7.poissonCV({ sumLive: null, sumDead: '' }).missing, ['sumLive', 'sumDead']);
  for (const [n, s] of [[200, '7.07'], [400, '5.00'], [50, '14.14']]) {
    assert.equal(e9.display('fixed2', String(e7.poissonCV({ sumLive: n, sumDead: 0 }).cvPercent)), s);
  }
});

test('display: modes, ties, carry, zero', () => {
  const d = e9.display;
  assert.equal(d('sci3', '1800000'), `1.80 ${X} 10^6`);
  assert.equal(d('sci3', '9'), `9.00 ${X} 10^0`);
  assert.equal(d('sci3', '9995000'), `1.00 ${X} 10^7`);
  assert.equal(d('sci3', '9994999'), `9.99 ${X} 10^6`);
  assert.equal(d('sci3', '0.002'), `2.00 ${X} 10^-3`);
  assert.equal(d('sci3', '0'), '0');
  assert.equal(d('sig3', '8'), '8.00');
  assert.equal(d('sig3', '0.0125'), '0.0125');
  assert.equal(d('sig3', '1.111'), '1.11');
  assert.equal(d('sig3', '9.995'), '10.0');
  assert.equal(d('sig3', '0.09995'), '0.100');
  assert.equal(d('sig3', '1234'), '1230');
  assert.equal(d('sig3', '0'), '0');
  assert.equal(d('sig3', '2.675'), '2.68');
  assert.equal(d('sig3trim', '25'), '25');
  assert.equal(d('sig3trim', '1.50'), '1.5');
  assert.equal(d('sig3trim', '1.005'), '1.01');
  assert.equal(d('sig3trim', '9.995'), '10');
  assert.equal(d('sig3trim', '1.389'), '1.39');
  assert.equal(d('fixed1', '81.25'), '81.3');
  assert.equal(d('fixed1', '99.95'), '100.0');
  assert.equal(d('fixed1', '0'), '0.0');
  assert.equal(d('fixed1', '-0.01'), '0.0');
  assert.equal(d('fixed2', '9.995'), '10.00');
  assert.equal(d('fixed2', '5.265'), '5.27');
  assert.equal(d('exact', '0.0125'), '0.0125');
  assert.equal(d('exact', '0.100'), '0.1');
  assert.equal(d('exact', '12.50'), '12.5');
  assert.throws(() => d('sci4', '1'));
});

test('S-1: derived refusals name their fields in argument order', () => {
  assert.deepEqual(e9.totalCells('1', '2', '10', 'before', '10').fields, ['Vsusp', 'Valiquot']);
  assert.deepEqual(e9.totalCells('1', '2', '10', 'before', '11').fields, ['Vsusp', 'Valiquot']);
  const rf5 = e9.seedingVolumes('2000', '5', '1000');
  assert.equal(rf5.code, 'CCS-RF-05');
  assert.deepEqual(rf5.fields, ['rho', 'Clive']);
  assert.deepEqual(rf5.indices, []);
  const rf6 = e9.viability({ sumLive: '0', sumDead: '0' });
  assert.deepEqual(rf6.fields, ['sumLive', 'sumDead']);
  assert.deepEqual(rf6.indices, []);
  assert.deepEqual(e9.concentrations(0, 0, 2, 0.1, 0, 0).fields, ['sumLive', 'sumDead']);
  const rf7 = e9.seedingVolumes('1', '5', '0');
  assert.equal(rf7.code, 'CCS-RF-07');
  assert.deepEqual(rf7.fields, ['Clive']);
  assert.deepEqual(rf7.indices, []);
  const cv7 = e7.poissonCV({ sumLive: '0', sumDead: '3' });
  assert.equal(cv7.code, 'CCS-RF-07');
  assert.deepEqual(cv7.fields, ['sumLive']);
  assert.deepEqual(cv7.indices, []);
});

test('S-3: empty list and unequal lengths name the lists, indices empty', () => {
  const empty = e9.meanPerSquare([], []);
  assert.equal(empty.code, 'CCS-RF-03');
  assert.deepEqual(empty.fields, ['live', 'dead']);
  assert.deepEqual(empty.indices, []);
  const oneEmpty = e9.meanPerSquare([], ['1']);
  assert.equal(oneEmpty.code, 'CCS-RF-03');
  assert.ok(oneEmpty.fields.includes('live'));
  assert.deepEqual(oneEmpty.indices, []);
  const uneq = e9.meanPerSquare(['1'], ['1', '2']);
  assert.equal(uneq.code, 'CCS-RF-03');
  assert.deepEqual(uneq.fields, ['live', 'dead']);
  assert.deepEqual(uneq.indices, []);
});

test('S-4: unrecognised timing is incomplete [timing], never a default', () => {
  for (const t of ['Before', 'during', 'x', 5]) {
    const r = e9.totalCells('1', '2', '10', t, '4');
    assert.equal(r.status, 'incomplete', String(t));
    assert.deepEqual(r.missing, ['timing']);
  }
  assert.equal(e9.totalCells('1', '2', '10', '', null).status, 'incomplete');
  assert.deepEqual(e9.totalCells('1', '2', null, 'during', null).missing, ['Vsusp', 'timing']);
  // with "after", Valiquot is not evaluated
  assert.equal(e9.totalCells('1', '2', '10', 'after', '-3').status, 'result');
});

test('S-6: Clive null is incomplete; negative or malformed is RF-03 [Clive]', () => {
  assert.deepEqual(e9.seedingVolumes('1', '5', null).missing, ['Clive']);
  assert.equal(e9.seedingVolumes('1', '5', null).status, 'incomplete');
  for (const bad of ['-1', '2e5', 'abc', '1,5']) {
    const r = e9.seedingVolumes('1', '5', bad);
    assert.equal(r.status, 'rejected', bad);
    assert.equal(r.code, 'CCS-RF-03', bad);
    assert.deepEqual(r.fields, ['Clive']);
  }
  assert.equal(e9.seedingVolumes('1', '5', '0').code, 'CCS-RF-07');
});

test('spec 0.1.0: version string and version()', () => {
  assert.equal(ENGINE_VERSION, '0.1.0');
  assert.equal(e9.squareVolume('1', '0.1').engine.version, '0.1.0');
  assert.equal(version().version, '0.1.0');
  assert.equal(version().package, '@ligant/bench-engines');
});

test('spec 4.5: Clive = 0 is a result; Ctotal <= 0 and Clive < 0 are RF-03', () => {
  const r = e9.totalCells('0', '5', '10', 'after', null);
  assert.equal(r.status, 'result');
  assert.equal(r.liveCells, 0);
  assert.equal(r.allCells, 50);
  assert.equal(e9.totalCells('0', '5', '10', 'before', '4').liveRemaining, 0);
  assert.deepEqual(e9.totalCells('1', '0', '10', 'after', null).fields, ['Ctotal']);
  assert.equal(e9.totalCells('1', '-1', '10', 'after', null).code, 'CCS-RF-03');
  assert.deepEqual(e9.totalCells('-1', '5', '10', 'after', null).fields, ['Clive']);
});

test('spec 4.2: blank square entry is RF-01 incomplete, before any RF-03', () => {
  const r = e9.meanPerSquare(['1', null, '3'], ['0', '1', '']);
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.missing, ['live', 'dead']);
  assert.deepEqual(r.missingIndices, [1, 2]);
  // Q3: union is ascending even when the blanks are in different lists
  assert.deepEqual(e9.meanPerSquare(['1', '2', null], ['', '1', '1']).missingIndices, [0, 2]);
  // blank wins over a negative count and over unequal length
  assert.equal(e9.meanPerSquare(['-1', ' '], ['0']).status, 'incomplete');
  assert.equal(e9.meanPerSquare(['-1'], ['0']).status, 'rejected');
});

test('spec 4.2/S-3 (ADC-117): unequal lengths with element faults carry the fault-index union', () => {
  const r = e9.meanPerSquare(['1', '-2', '3'], ['4', '5']);
  assert.equal(r.status, 'rejected');
  assert.equal(r.code, 'CCS-RF-03');
  assert.deepEqual(r.fields, ['live', 'dead']);
  assert.deepEqual(r.indices, [1]);
  // ascending union across lists, each index once
  const u = e9.meanPerSquare(['1', '2', '3.5', '4'], ['x1', '2', '-3']);
  assert.deepEqual(u.indices, [0, 2]);
  assert.deepEqual(u.fields, ['live', 'dead']);
  // unequal with no element fault, and empty lists, keep []
  assert.deepEqual(e9.meanPerSquare(['1', '2', '3'], ['1', '2']).indices, []);
  assert.deepEqual(e9.meanPerSquare([], []).indices, []);
});

test('spec 2: flat refusal shape, indices always present; RF-05 context members flat', () => {
  const r = e9.seedingVolumes('2000', '5', '1000');
  assert.equal(r.status, 'rejected');
  assert.equal(r.code, 'CCS-RF-05');
  assert.deepEqual(r.indices, []);
  assert.equal('rejection' in r || 'context' in r || 'values' in r, false);
  assert.equal(r.Vseed, 10);
  assert.equal(e10.strengthFactor('0.5').indices.length, 0);
});
