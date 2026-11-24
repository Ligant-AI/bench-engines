// E20 slice B: F01 resolveLimit and F03 mvdFromLimit. Every expected value is worked by hand
// from the specification text (sections 4, 5 and 6).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLimit, mvdFromLimit } from '../src/e20/index.js';

const typed = (value, unit, extra = {}) => ({ form: 'typed', value, unit, source: 's', ...extra });
const km = (K, M, Munit, extra = {}) => ({ form: 'km', K, KSource: 's', M, Munit, MSource: 's', ...extra });
const preset = (presetId, M, Munit, extra = {}) => ({ form: 'preset', presetId, M, Munit, MSource: 's', ...extra });

const incomplete = (r, missing) => {
  assert.equal(r.status, 'incomplete');
  assert.equal(r.code, 'CCS-RF-01');
  assert.deepEqual(r.missing, missing);
  assert.equal(r.engine.module, 'E20');
};
const rejected = (r, code, fields) => {
  assert.equal(r.status, 'rejected');
  assert.equal(r.code, code);
  assert.deepEqual(r.fields, fields);
  assert.deepEqual(r.indices, []);
};
const faults = (r, list) => {
  rejected(r, 'CCS-RF-03', [...new Set(list.flatMap(([f]) => f))]);
  assert.deepEqual(r.reasons, list.map(([fields, reason]) => ({ fields, reason })));
};

// ---- F01 ----

test('F01 typed limit: L is the typed value, no computation', () => {
  const r = resolveLimit(typed('0.5', 'EU/mL'));
  assert.equal(r.status, 'result');
  assert.equal(r.form, 'typed');
  assert.deepEqual(r.L.exact, { num: '1', den: '2' });
  assert.equal(r.L.decimal, '0.5');
  assert.equal(r.L.fraction, '1/2');
  assert.equal(r.L.display, '0.500');
  assert.equal(r.L.unit, 'EU/mL');
  assert.deepEqual(r.denominator, { kind: 'mL', label: 'mL' });
  assert.equal(r.K, null);
  assert.equal(r.M, null);
  assert.equal(r.presetId, null);
  assert.equal(r.kFromPreset, false);
  assert.deepEqual(r.engine, { ...r.engine, module: 'E20', moduleVersion: '0.1.0' });
});

test('F01 typed units mg and Unit; "other" keeps the label exactly as typed', () => {
  assert.equal(resolveLimit(typed('3', 'EU/mg')).L.unit, 'EU/mg');
  assert.deepEqual(resolveLimit(typed('3', 'EU/Unit')).denominator, { kind: 'Unit', label: 'Unit' });
  const r = resolveLimit(typed('2', 'other', { otherLabel: ' Jar /x ' }));
  assert.deepEqual(r.denominator, { kind: 'other', label: ' Jar /x ' });
  assert.equal(r.L.unit, 'EU/ Jar /x ');
});

test('F01 K and M: L = K / M in one exact value', () => {
  const r = resolveLimit(km('5', '3', 'mg'));
  assert.deepEqual(r.L.exact, { num: '5', den: '3' });
  assert.equal(r.L.decimal, null);
  assert.equal(r.L.fraction, '5/3');
  assert.equal(r.L.display, '1.67');
  assert.equal(r.L.unit, 'EU/mg');
  assert.deepEqual(r.K.exact, { num: '5', den: '1' });
  assert.equal(r.K.unit, 'EU/kg');
  assert.deepEqual(r.M.exact, { num: '3', den: '1' });
  assert.equal(r.M.unit, 'mg/kg');
  assert.equal(r.kFromPreset, false);
  const t = resolveLimit(km('5', '2', 'mL'));
  assert.equal(t.L.decimal, '2.5');
  assert.equal(t.L.display, '2.50');
});

test('F01 K and M with the unit "other"', () => {
  const r = resolveLimit(km('1', '4', 'other', { otherLabel: 'jar' }));
  assert.equal(r.L.unit, 'EU/jar');
  assert.equal(r.M.unit, 'jar/kg');
  assert.deepEqual(r.L.exact, { num: '1', den: '4' });
});

test('F01 presets 1 and 2 supply K; preset 3 supplies L in EU/mL', () => {
  const a = resolveLimit(preset('preset-1', '10', 'mL'));
  assert.deepEqual(a.L.exact, { num: '1', den: '2' });
  assert.equal(a.kFromPreset, true);
  assert.equal(a.presetId, 'preset-1');
  assert.deepEqual(a.K.exact, { num: '5', den: '1' });
  assert.equal(a.K.unit, 'EU/kg');
  assert.equal(a.M.unit, 'mL/kg');
  const b = resolveLimit(preset('preset-2', '2', 'mg'));
  assert.deepEqual(b.L.exact, { num: '1', den: '10' });
  assert.equal(b.L.decimal, '0.1');
  assert.equal(b.L.unit, 'EU/mg');
  const c = resolveLimit({ form: 'preset', presetId: 'preset-3' });
  assert.deepEqual(c.L.exact, { num: '1', den: '2' });
  assert.equal(c.L.unit, 'EU/mL');
  assert.deepEqual(c.denominator, { kind: 'mL', label: 'mL' });
  assert.equal(c.K, null);
  assert.equal(c.M, null);
  assert.equal(c.presetId, 'preset-3');
  assert.equal(c.kFromPreset, false);
});

test('F01 source text is never returned', () => {
  const r = resolveLimit({ ...km('5', '3', 'mg'), KSource: 'SECRET-K', MSource: 'SECRET-M' });
  assert.equal(JSON.stringify(r).includes('SECRET'), false);
  assert.equal(JSON.stringify(resolveLimit(typed('1', 'EU/mL', { source: 'SECRET-T' }))).includes('SECRET'), false);
});

test('F01 step 1: missing names in member order', () => {
  incomplete(resolveLimit(null), ['limit']);
  incomplete(resolveLimit(undefined), ['limit']);
  incomplete(resolveLimit('   '), ['limit']);
  incomplete(resolveLimit({}), ['limit.form']);
  incomplete(resolveLimit({ form: '' }), ['limit.form']);
  incomplete(resolveLimit({ form: 'typed' }), ['limit.value', 'limit.unit', 'limit.source']);
  incomplete(resolveLimit({ form: 'typed', value: ' ', unit: 'EU/mL', source: null }), ['limit.value', 'limit.source']);
  incomplete(resolveLimit({ form: 'typed', value: '1', unit: 'other', source: 's' }), ['limit.otherLabel']);
  incomplete(resolveLimit(typed('1', 'other', { otherLabel: '   ' })), ['limit.otherLabel']);
  incomplete(resolveLimit({ form: 'km' }), ['limit.K', 'limit.KSource', 'limit.M', 'limit.Munit', 'limit.MSource']);
  incomplete(resolveLimit({ form: 'km', K: '1', KSource: 's', M: '1', Munit: 'other', MSource: 's' }), ['limit.otherLabel']);
  incomplete(resolveLimit({ form: 'km', K: '1', KSource: 's', M: '1', Munit: 'other' }), ['limit.otherLabel', 'limit.MSource']);
  incomplete(resolveLimit({ form: 'preset' }), ['limit.presetId']);
  incomplete(resolveLimit({ form: 'preset', presetId: 'preset-1' }), ['limit.M', 'limit.Munit', 'limit.MSource']);
  incomplete(resolveLimit({ form: 'preset', presetId: 'preset-2', M: '1', Munit: 'other', MSource: 's' }), ['limit.otherLabel']);
});

test('F01 a missing closed string is named alone; the member that depends on it is not required', () => {
  incomplete(resolveLimit({ form: 'typed', value: '1', source: 's' }), ['limit.unit']);
  incomplete(resolveLimit({ form: 'km', K: '1', KSource: 's', M: '1', MSource: 's' }), ['limit.Munit']);
});

test('F01 null, absent, empty and blank text are the same', () => {
  for (const v of [null, undefined, '', '  \t']) {
    incomplete(resolveLimit({ form: 'typed', value: v, unit: 'EU/mL', source: 's' }), ['limit.value']);
  }
});

test('F01 step 1 comes before step 2 and step 3', () => {
  incomplete(resolveLimit({ form: 'typed', unit: 'x', value: '0' }), ['limit.source']);
});

test('F01 step 2: unknown closed strings are E20-RC-01 and nothing depends on them', () => {
  rejected(resolveLimit({ form: 'other', value: '0' }), 'E20-RC-01', ['limit.form']);
  rejected(resolveLimit({ form: 5 }), 'E20-RC-01', ['limit.form']);
  rejected(resolveLimit({ form: 'Typed' }), 'E20-RC-01', ['limit.form']);
  rejected(resolveLimit(typed('0', 'EU/L')), 'E20-RC-01', ['limit.unit']);
  rejected(resolveLimit(typed('1', 5)), 'E20-RC-01', ['limit.unit']);
  rejected(resolveLimit(km('1', '1', 'g')), 'E20-RC-01', ['limit.Munit']);
  rejected(resolveLimit({ form: 'preset', presetId: 'preset-9' }), 'E20-RC-01', ['limit.presetId']);
});

test('F01 step 2: preset 4 and 5 are E20-RC-02 as a limit, no M member required', () => {
  rejected(resolveLimit({ form: 'preset', presetId: 'preset-4' }), 'E20-RC-02', ['limit.presetId']);
  rejected(resolveLimit({ form: 'preset', presetId: 'preset-5', M: '0' }), 'E20-RC-02', ['limit.presetId']);
});

test('F01 step 3: value faults, all together, member order', () => {
  faults(resolveLimit(typed('0', 'EU/mL')), [[['limit.value'], 'not-above-zero']]);
  faults(resolveLimit(typed('-1', 'EU/mL')), [[['limit.value'], 'not-above-zero']]);
  faults(resolveLimit(typed('1,5', 'EU/mL')), [[['limit.value'], 'not-plain-decimal']]);
  faults(resolveLimit(typed('2e5', 'EU/mL')), [[['limit.value'], 'not-plain-decimal']]);
  faults(resolveLimit(typed(5, 'EU/mL')), [[['limit.value'], 'wrong-form']]);
  faults(resolveLimit(typed(5n, 'EU/mL')), [[['limit.value'], 'wrong-form']]);
  faults(resolveLimit(km('0', 'abc', 'mL')), [[['limit.K'], 'not-above-zero'], [['limit.M'], 'not-plain-decimal']]);
  faults(resolveLimit(preset('preset-1', '0', 'mL')), [[['limit.M'], 'not-above-zero']]);
  faults(resolveLimit(typed('1', 'other', { otherLabel: 5 })), [[['limit.otherLabel'], 'wrong-form']]);
});

test('F01 plain decimal text forms of E20L-IN-01 are read', () => {
  for (const [text, exact] of [['.5', '1/2'], ['5.', '5/1'], ['+5', '5/1'], [' 2.50 ', '5/2']]) {
    const r = resolveLimit(typed(text, 'EU/mL'));
    assert.equal(r.L.fraction, exact, text);
  }
  faults(resolveLimit(typed('+', 'EU/mL')), [[['limit.value'], 'not-plain-decimal']]);
});

test('F01 a limit that is present but not an object is wrong-form and requires nothing', () => {
  for (const v of ['text', 5, true, []]) faults(resolveLimit(v), [[['limit'], 'wrong-form']]);
});

// ---- F03 ----

const mLimit = typed('0.5', 'EU/mL');

test('F03 D = mL: c is fixed, MVD = L / lambda', () => {
  const r = mvdFromLimit(mLimit, 'chromogenic', null, null, '0.25');
  assert.equal(r.status, 'result');
  assert.deepEqual(r.mvd.exact, { num: '2', den: '1' });
  assert.equal(r.mvd.display, '2.00');
  assert.equal(r.mvd.unit, null);
  assert.deepEqual(r.Lc.exact, { num: '1', den: '2' });
  assert.equal(r.Lc.unit, 'EU/mL');
  assert.deepEqual(r.L.exact, { num: '1', den: '2' });
  assert.deepEqual(r.c.exact, { num: '1', den: '1' });
  assert.equal(r.c.unit, 'mL/mL');
  assert.equal(r.cFixed, true);
  assert.deepEqual(r.lambda.exact, { num: '1', den: '4' });
  assert.equal(r.lambda.unit, 'EU/mL');
  assert.equal(r.technique, 'chromogenic');
  assert.equal(r.lambdaMeaning, 'lowest-standard');
  assert.equal(r.resultBlockOffered, true);
  assert.deepEqual(r.denominator, { kind: 'mL', label: 'mL' });
  assert.equal(r.K, null);
  assert.equal(r.presetId, null);
  assert.equal(r.kFromPreset, false);
});

test('F03 D = mL: c and cUnit are not read, whatever they hold', () => {
  const base = mvdFromLimit(mLimit, 'chromogenic', null, null, '0.25');
  for (const [c, u] of [['0', 'zzz'], ['abc', 5], [7, {}], ['2', 'mg/mL']]) {
    assert.deepEqual(mvdFromLimit(mLimit, 'chromogenic', c, u, '0.25'), base);
  }
});

test('F03 D = mg with a K and M limit: one chain (K x c) / (M x lambda)', () => {
  const r = mvdFromLimit(km('5', '3', 'mg'), 'gel-clot', '2', 'mg/mL', '0.25');
  assert.deepEqual(r.mvd.exact, { num: '40', den: '3' });
  assert.equal(r.mvd.decimal, null);
  assert.equal(r.mvd.display, '13.3');
  assert.deepEqual(r.Lc.exact, { num: '10', den: '3' });
  assert.deepEqual(r.L.exact, { num: '5', den: '3' });
  assert.equal(r.c.unit, 'mg/mL');
  assert.equal(r.cFixed, false);
  assert.equal(r.lambdaMeaning, 'labelled-sensitivity');
  assert.equal(r.resultBlockOffered, false);
  assert.equal(r.M.unit, 'mg/kg');
});

test('F03 D = Unit and D = other', () => {
  const u = mvdFromLimit(typed('4', 'EU/Unit'), 'fluorimetric', '0.5', 'Units/mL', '0.5');
  assert.deepEqual(u.Lc.exact, { num: '2', den: '1' });
  assert.deepEqual(u.mvd.exact, { num: '4', den: '1' });
  assert.equal(u.c.unit, 'Units/mL');
  const o = mvdFromLimit(typed('2', 'other', { otherLabel: 'jar' }), 'turbidimetric', '2', 'jar/mL', '0.25');
  assert.deepEqual(o.Lc.exact, { num: '4', den: '1' });
  assert.deepEqual(o.mvd.exact, { num: '16', den: '1' });
  assert.equal(o.c.unit, 'jar/mL');
});

test('F03 preset limit as K and M', () => {
  const r = mvdFromLimit(preset('preset-1', '10', 'mL'), 'chromogenic', null, null, '0.25');
  assert.deepEqual(r.mvd.exact, { num: '2', den: '1' });
  assert.equal(r.kFromPreset, true);
  assert.equal(r.presetId, 'preset-1');
});

test('F03 E20-RC-03: the unit must be exactly the fixed pairing, or the label plus /mL', () => {
  const mg = typed('1', 'EU/mg');
  for (const u of ['g/mL', 'mg/mL ', 'MG/mL', 'Units/mL', 'mg/ml', 'mg']) {
    rejected(mvdFromLimit(mg, 'chromogenic', '1', u, '1'), 'E20-RC-03', ['cUnit']);
  }
  rejected(mvdFromLimit(typed('1', 'EU/Unit'), 'chromogenic', '1', 'Unit/mL', '1'), 'E20-RC-03', ['cUnit']);
  const jar = typed('1', 'other', { otherLabel: 'jar' });
  for (const u of ['Jar/mL', 'jar /mL', ' jar/mL', 'jar/ml', 'jar/mL ', 'mg/mL']) {
    rejected(mvdFromLimit(jar, 'chromogenic', '1', u, '1'), 'E20-RC-03', ['cUnit']);
  }
  assert.equal(mvdFromLimit(jar, 'chromogenic', '1', 'jar/mL', '1').status, 'result');
});

test('F03 a bad unit and a zero concentration give E20-RC-03 alone', () => {
  rejected(mvdFromLimit(typed('1', 'EU/mg'), 'chromogenic', '0', 'Units/mL', '0'), 'E20-RC-03', ['cUnit']);
});

test('F03 a non-text label or unit makes E20-RC-03 not judged', () => {
  const r = mvdFromLimit(typed('1', 'other', { otherLabel: 5 }), 'chromogenic', '1', 'x/mL', '1');
  faults(r, [[['limit.otherLabel'], 'wrong-form']]);
  faults(mvdFromLimit(typed('1', 'EU/mg'), 'chromogenic', '1', 5, '1'), [[['cUnit'], 'wrong-form']]);
});

test('F03 step 1: missing names in argument order', () => {
  incomplete(mvdFromLimit(null, null, null, null, null), ['limit', 'technique', 'lambda']);
  incomplete(mvdFromLimit(typed('1', 'EU/mg'), null, null, null, null), ['technique', 'c', 'cUnit', 'lambda']);
  incomplete(mvdFromLimit(typed('1', 'EU/mg'), 'chromogenic', '  ', undefined, '1'), ['c', 'cUnit']);
  incomplete(mvdFromLimit(mLimit, '', null, null, ''), ['technique', 'lambda']);
  incomplete(mvdFromLimit({ form: 'km', K: '1', KSource: 's', M: '1', MSource: 's' }, null, null, null, null), ['limit.Munit', 'technique', 'lambda']);
  incomplete(mvdFromLimit({ form: 'typed' }, 'chromogenic', null, null, '1'), ['limit.value', 'limit.unit', 'limit.source']);
});

test('F03 c and cUnit are not required when D cannot be known', () => {
  incomplete(mvdFromLimit({ form: 'other' }, 'chromogenic', null, null, null), ['lambda']);
  incomplete(mvdFromLimit({ form: 'preset', presetId: 'preset-4' }, 'chromogenic', null, null, null), ['lambda']);
  faults(mvdFromLimit('text', 'chromogenic', null, null, '0'), [[['limit'], 'wrong-form'], [['lambda'], 'not-above-zero']]);
});

test('F03 step 2: unknown, then not allowed, in one result', () => {
  rejected(mvdFromLimit(mLimit, 'x', null, null, '1'), 'E20-RC-01', ['technique']);
  rejected(mvdFromLimit(mLimit, 5, null, null, '1'), 'E20-RC-01', ['technique']);
  rejected(mvdFromLimit(typed('1', 'EU/L'), 'x', null, null, '1'), 'E20-RC-01', ['limit.unit', 'technique']);
  rejected(mvdFromLimit({ form: 'preset', presetId: 'preset-5' }, 'chromogenic', null, null, '1'), 'E20-RC-02', ['limit.presetId']);
  rejected(mvdFromLimit({ form: 'preset', presetId: 'preset-4' }, 'x', null, null, '1'), 'E20-RC-01', ['technique']);
  rejected(mvdFromLimit(typed('1', 'EU/mg'), 'x', '1', 'Units/mL', '1'), 'E20-RC-01', ['technique']);
});

test('F03 step 1 comes before step 2', () => {
  incomplete(mvdFromLimit(mLimit, 'x', null, null, null), ['lambda']);
});

test('F03 step 3: value faults of the call together, argument order', () => {
  const mg = typed('1', 'EU/mg');
  faults(mvdFromLimit(mg, 'chromogenic', '0', 'mg/mL', '-1'), [[['c'], 'not-above-zero'], [['lambda'], 'not-above-zero']]);
  faults(mvdFromLimit(mg, 'chromogenic', '1', 'mg/mL', '1,5'), [[['lambda'], 'not-plain-decimal']]);
  faults(mvdFromLimit(mg, 'chromogenic', 2, 'mg/mL', 0.5), [[['c'], 'wrong-form'], [['lambda'], 'wrong-form']]);
  faults(mvdFromLimit(typed('0', 'EU/mL'), 'chromogenic', null, null, '0'), [[['limit.value'], 'not-above-zero'], [['lambda'], 'not-above-zero']]);
  faults(mvdFromLimit(mLimit, 'chromogenic', 'abc', 'zzz', '0'), [[['lambda'], 'not-above-zero']]);
});

test('F03 an unknown closed string hides value faults', () => {
  rejected(mvdFromLimit(typed('0', 'EU/L'), 'chromogenic', null, null, '0'), 'E20-RC-01', ['limit.unit']);
});
