// E20 slice D: the order of statuses and the input rules that every function shares
// (section 4.1, E20L-IN-01 to -04, E20L-RF-01 to -04, AT-E20L-06, AT-E20L-07). The expected
// values are worked by hand from the specification text; none is read from an engine result.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as e20 from '../src/e20/index.js';

const TYPED = { form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' };
const KM_MG = { form: 'km', K: '5', KSource: 's', M: '3', Munit: 'mg', MSource: 's' };
const KM_NO_M = { form: 'km', K: '5', KSource: 's', Munit: 'mg', MSource: 's' };
const RANGE = { form: 'declared', low: '50', high: '200', source: 's' };
const SUIT = {
  sampleCV: { value: '3', max: '5', source: 's' },
  spikeCV: { value: '4', max: '5', source: 's' },
  recovery: { B: '12', A: '2', added: '10', basis: 'as-measured', range: RANGE },
};
const GONE = Symbol('absent');
const BLANKS = [null, undefined, '', '   ', '\t\n '];

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
const put = (obj, key, v) => {
  const o = { ...obj };
  if (v === GONE) delete o[key]; else o[key] = v;
  return o;
};
const f05 = (over = {}) => {
  const a = {
    limit: TYPED, technique: 'chromogenic', c: null, cUnit: null, lambda: '0.05', highest: '5', DF: '4',
    q: '=', value: '0.8', reagent: 'lal', suit: SUIT, ...over,
  };
  return e20.assessResult(a.limit, a.technique, a.c, a.cUnit, a.lambda, a.highest, a.DF, a.q, a.value, a.reagent, a.suit);
};

test('E20L-RF-01 a call with a missing member, an unknown string, a unit mismatch and a bad number: one status at a time (F03)', () => {
  const call = (limit, technique, cUnit, c) => e20.mvdFromLimit(limit, technique, c, cUnit, 'abc');
  incomplete(call(KM_NO_M, 'bogus', 'Units/mL', '0'), ['limit.M']);
  rejected(call(KM_MG, 'bogus', 'Units/mL', '0'), 'E20-RC-01', ['technique']);
  rejected(call(KM_MG, 'chromogenic', 'Units/mL', '0'), 'E20-RC-03', ['cUnit']);
  faults(call(KM_MG, 'chromogenic', 'mg/mL', '0'), [[['c'], 'not-above-zero'], [['lambda'], 'not-plain-decimal']]);
  // an unknown string is RC-01 whatever else is not allowed
  rejected(e20.mvdFromLimit({ form: 'preset', presetId: 'preset-4' }, 'bogus', null, null, '1'), 'E20-RC-01', ['technique']);
  rejected(e20.mvdFromLimit({ form: 'preset', presetId: 'preset-4' }, 'chromogenic', null, null, '1'), 'E20-RC-02', ['limit.presetId']);
});

test('E20L-RF-01 the same order in F05', () => {
  const run = (limit, technique, q, cUnit) => f05({ limit, technique, c: '0', cUnit, DF: '0', q, value: 'x' });
  incomplete(run(KM_NO_M, 'gel-clot', '>=', 'Units/mL'), ['limit.M']);
  rejected(run(KM_MG, 'gel-clot', '>=', 'Units/mL'), 'E20-RC-01', ['resultQualifier']);
  rejected(run(KM_MG, 'gel-clot', '=', 'Units/mL'), 'E20-RC-02', ['technique']);
  rejected(run(KM_MG, 'chromogenic', '=', 'Units/mL'), 'E20-RC-03', ['cUnit']);
  faults(run(KM_MG, 'chromogenic', '=', 'mg/mL'),
    [[['c'], 'not-above-zero'], [['DF'], 'below-one'], [['resultValue'], 'not-plain-decimal']]);
});

test('E20L-RF-01 the same order in F07', () => {
  const curves = [{ lambda: '0', channels: [{ DF: '1', recovery: '1' }] }];
  const run = (limit, range, cUnit) => e20.screenDilutions(limit, '0', cUnit, range, null, curves);
  incomplete(run(KM_NO_M, { form: 'bogus' }, 'Units/mL'), ['limit.M']);
  rejected(run(KM_MG, { form: 'bogus' }, 'Units/mL'), 'E20-RC-01', ['recoveryRange.form']);
  rejected(run(KM_MG, { form: 'preset', presetId: 'preset-1' }, 'Units/mL'), 'E20-RC-02', ['recoveryRange.presetId']);
  rejected(run(KM_MG, RANGE, 'Units/mL'), 'E20-RC-03', ['cUnit']);
  faults(run(KM_MG, RANGE, 'mg/mL'), [[['c'], 'not-above-zero'], [['curves[0].lambda'], 'not-above-zero']]);
});

test('E20L-RF-01 the same order in F06 and F04', () => {
  const s = (over) => ({
    sampleCV: { value: '3', max: '5', source: 's' },
    spikeCV: { value: '4', max: '5', source: 's' },
    recovery: { B: '-1', A: '2', added: '10', basis: 'bogus', range: { form: 'preset', presetId: 'preset-5' }, ...over },
  });
  const noMax = s();
  noMax.sampleCV = { value: '3', source: 's' };
  incomplete(e20.assessSuitability(noMax), ['suitability.sampleCV.max']);
  rejected(e20.assessSuitability(s()), 'E20-RC-01', ['suitability.recovery.basis']);
  rejected(e20.assessSuitability(s({ basis: 'times-df' })), 'E20-RC-02', ['suitability.recovery.range.presetId']);
  faults(e20.assessSuitability(s({ basis: 'times-df', range: RANGE })), [[['suitability.recovery.B'], 'negative']]);
  incomplete(e20.checkDilution(null, 'x'), ['DF']);
  faults(e20.checkDilution('0.5', 'x'), [[['DF'], 'below-one'], [['mvd'], 'wrong-form']]);
});

test('E20L-IN-02 null, absent and blank text are the same: one incomplete result naming the same member', () => {
  const same = (build, missing) => {
    const first = build(BLANKS[0]);
    incomplete(first, missing);
    for (const b of [...BLANKS, GONE]) assert.deepEqual(build(b), first, String(b));
  };
  const val = (b) => (b === GONE ? undefined : b);
  same((b) => e20.resolveLimit(put(TYPED, 'value', b)), ['limit.value']);
  same((b) => e20.resolveLimit(put(TYPED, 'source', b)), ['limit.source']);
  same((b) => e20.resolveLimit(put(KM_MG, 'MSource', b)), ['limit.MSource']);
  same((b) => e20.mvdFromLimit(TYPED, 'chromogenic', null, null, val(b)), ['lambda']);
  same((b) => e20.mvdFromLimit(TYPED, val(b), null, null, '0.05'), ['technique']);
  same((b) => e20.mvdFromLimit(KM_MG, 'chromogenic', val(b), 'mg/mL', '0.05'), ['c']);
  same((b) => e20.mvdFromLimit(KM_MG, 'chromogenic', '2', val(b), '0.05'), ['cUnit']);
  same((b) => e20.checkDilution(val(b), { num: '1', den: '1' }), ['DF']);
  same((b) => e20.checkDilution('2', val(b)), ['mvd']);
  same((b) => e20.formatThreeFigures(val(b)), ['value']);
  same((b) => e20.assessSuitability(put(SUIT, 'sampleCV', b)), [
    'suitability.sampleCV.value', 'suitability.sampleCV.max', 'suitability.sampleCV.source']);
  same((b) => e20.assessSuitability({ ...SUIT, spikeCV: put(SUIT.spikeCV, 'max', b) }), ['suitability.spikeCV.max']);
  same((b) => e20.screenDilutions(TYPED, null, null, RANGE, null, [put({ channels: [{ DF: '1', recovery: '1' }] }, 'lambda', b)]),
    ['curves[0].lambda']);
  same((b) => e20.screenDilutions(TYPED, null, null, RANGE, null, [{ lambda: '1', channels: [put({ DF: '1' }, 'recovery', b)] }]),
    ['curves[0].channels[0].recovery']);
  same((b) => f05({ q: val(b) }), ['resultQualifier']);
  same((b) => f05({ value: val(b) }), ['resultValue']);
  same((b) => f05({ highest: val(b) }), ['highestStandard']);
  same((b) => f05({ DF: val(b) }), ['DF']);
});

test('E20L-IN-02 an optional argument that is blank in any form is not declared and never incomplete', () => {
  const first = f05({ reagent: null, suit: null });
  assert.equal(first.status, 'result');
  assert.equal(first.reagentType, null);
  for (const b of BLANKS) assert.deepEqual(f05({ reagent: b, suit: b }), first);
  const noCap = f05({ q: '<', highest: undefined });
  for (const b of BLANKS) assert.deepEqual(f05({ q: '<', highest: b }), noCap);
  assert.equal(noCap.status, 'result');
  const dates = e20.checkRecordDates();
  for (const b of BLANKS) assert.deepEqual(e20.checkRecordDates(b, b, b), dates);
});

test('E20L-RF-04 a present value of the wrong form is a refusal naming the argument, never missing', () => {
  faults(e20.resolveLimit({ ...TYPED, value: 5 }), [[['limit.value'], 'wrong-form']]);
  faults(e20.resolveLimit({ ...TYPED, value: 5n }), [[['limit.value'], 'wrong-form']]);
  faults(e20.resolveLimit({ ...TYPED, value: {} }), [[['limit.value'], 'wrong-form']]);
  for (const v of ['text', 7, [], true]) faults(e20.resolveLimit(v), [[['limit'], 'wrong-form']]);
  faults(e20.mvdFromLimit(KM_MG, 'chromogenic', 2, 'mg/mL', '0.05'), [[['c'], 'wrong-form']]);
  faults(e20.mvdFromLimit(KM_MG, 'chromogenic', '2', 5, '0.05'), [[['cUnit'], 'wrong-form']]);
  faults(e20.mvdFromLimit(TYPED, 'chromogenic', null, null, 0.05), [[['lambda'], 'wrong-form']]);
  faults(e20.checkDilution(2, { num: '1', den: '1' }), [[['DF'], 'wrong-form']]);
  faults(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, B: 12 } }), [[['suitability.recovery.B'], 'wrong-form']]);
  faults(e20.assessSuitability('text'), [[['suitability'], 'wrong-form']]);
  faults(e20.assessSuitability({ ...SUIT, sampleCV: 'x' }), [[['suitability.sampleCV'], 'wrong-form']]);
  faults(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, range: 5 } }), [[['suitability.recovery.range'], 'wrong-form']]);
  faults(f05({ value: 0.8 }), [[['resultValue'], 'wrong-form']]);
  faults(f05({ highest: 5n }), [[['highestStandard'], 'wrong-form']]);
  faults(e20.resolveLimit({ form: 'typed', value: '2', unit: 'other', otherLabel: 5, source: 's' }), [[['limit.otherLabel'], 'wrong-form']]);
});

test('E20L-NF-02 an exact argument must be {num, den} of integer strings; for F04 num is above zero', () => {
  for (const bad of ['10', 10, [], {}, { num: '1' }, { num: '1', den: '0' }, { num: '1', den: '-2' }, { num: 1, den: '1' },
    { num: '1.5', den: '2' }, { num: '1', den: 2 }, { num: '0', den: '1' }, { num: '-1', den: '1' }, { num: '', den: '1' }]) {
    const r = e20.checkDilution('2', bad);
    assert.equal(r.status, 'rejected', JSON.stringify(bad));
    assert.deepEqual(r.reasons, [{ fields: ['mvd'], reason: 'wrong-form' }], JSON.stringify(bad));
  }
  const loose = e20.checkDilution('1', { num: '10', den: '4' }); // not in lowest terms
  assert.equal(loose.status, 'result');
  assert.deepEqual(loose.mvd.exact, { num: '5', den: '2' });
  // F08 accepts zero and negative values
  assert.equal(e20.formatThreeFigures({ num: '0', den: '1' }).text, '0');
  assert.equal(e20.formatThreeFigures({ num: '-5', den: '1' }).text, '-5.00');
  for (const bad of [5, [], true, { num: 'x', den: '1' }, { num: '1', den: '0' }, { num: '1' }]) {
    faults(e20.formatThreeFigures(bad), [[['value'], 'wrong-form']]);
  }
});

test('E20L-IN-05 a source that is not text counts as declared and is never returned', () => {
  const r = e20.resolveLimit({ ...TYPED, source: 5 });
  assert.equal(r.status, 'result');
  assert.equal(e20.resolveLimit({ ...TYPED, source: { a: 1 } }).status, 'result');
  assert.equal(JSON.stringify(r).includes('"source"'), false);
  const secret = e20.resolveLimit({ ...TYPED, source: 'SECRET-TEXT-X' });
  assert.equal(JSON.stringify(secret).includes('SECRET-TEXT-X'), false);
  assert.deepEqual(secret, e20.resolveLimit(TYPED));
});

test('E20L-IN-03 closed strings: unknown or other-case text is E20-RC-01 in every slot, known text is read', () => {
  const rc01 = (r, field) => rejected(r, 'E20-RC-01', [field]);
  for (const v of ['Typed', 'TYPED', 'typed ', 'other', 5, {}]) rc01(e20.resolveLimit({ ...TYPED, form: v }), 'limit.form');
  for (const v of ['EU/ML', 'eu/mL', 'EU/L', 'mL', 5]) rc01(e20.resolveLimit({ ...TYPED, unit: v }), 'limit.unit');
  for (const v of ['ML', 'g', 'unit', 5]) rc01(e20.resolveLimit({ ...KM_MG, Munit: v }), 'limit.Munit');
  for (const v of ['preset-0', 'preset-6', 'Preset-1', 'preset-1 ', 5]) {
    rc01(e20.resolveLimit({ form: 'preset', presetId: v, M: '1', Munit: 'mL', MSource: 's' }), 'limit.presetId');
  }
  for (const v of ['Gel-clot', 'gel clot', 'turbidimetry', 5]) rc01(e20.mvdFromLimit(TYPED, v, null, null, '1'), 'technique');
  for (const t of ['gel-clot', 'turbidimetric', 'chromogenic', 'fluorimetric']) {
    assert.equal(e20.mvdFromLimit(TYPED, t, null, null, '1').status, 'result', t);
  }
  for (const v of ['>=', '≥', '==', '<=', 'x', 5]) rc01(f05({ q: v }), 'resultQualifier');
  for (const q of ['=', '<']) assert.equal(f05({ q, highest: '5' }).status, 'result', q);
  for (const v of ['LAL', 'recombinant', 'rfc ', 5]) rc01(f05({ reagent: v }), 'reagentType');
  for (const t of ['lal', 'rcr', 'rfc']) assert.equal(f05({ reagent: t }).reagentType, t);
  for (const v of ['asMeasured', 'AS-MEASURED', 5]) {
    rc01(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, basis: v } }), 'suitability.recovery.basis');
  }
  for (const b of ['as-measured', 'times-df']) {
    assert.equal(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, basis: b } }).recovery.basis, b);
  }
  for (const v of ['Declared', 'range', 5]) {
    rc01(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, range: { form: v } } }), 'suitability.recovery.range.form');
  }
});

test('E20L-IN-03 the qualifier text > is a reason of its own, not an unknown string', () => {
  const r = f05({ q: '>', highest: undefined });
  faults(r, [[['resultQualifier'], 'greater-than-not-a-quantity']]);
  const both = f05({ q: '>', value: '>5', highest: undefined });
  faults(both, [[['resultQualifier'], 'greater-than-not-a-quantity'], [['resultValue'], 'greater-than-not-a-quantity']]);
});

test('E20L-IN-04 dependent members: not required, and not read, when the string they depend on is unknown', () => {
  rejected(e20.mvdFromLimit({ form: 'zzz' }, 'chromogenic', null, null, '1'), 'E20-RC-01', ['limit.form']);
  rejected(e20.resolveLimit({ form: 'typed', value: '1', source: 's', unit: 'zzz' }), 'E20-RC-01', ['limit.unit']);
  rejected(e20.mvdFromLimit({ form: 'typed', value: '1', source: 's', unit: 'zzz' }, 'chromogenic', null, null, '1'),
    'E20-RC-01', ['limit.unit']);
  rejected(e20.resolveLimit({ ...KM_MG, Munit: 'zzz', M: '2' }), 'E20-RC-01', ['limit.Munit']);
  rejected(e20.resolveLimit({ form: 'preset', presetId: 'zzz' }), 'E20-RC-01', ['limit.presetId']);
  rejected(e20.resolveLimit({ form: 'preset', presetId: 'preset-4' }), 'E20-RC-02', ['limit.presetId']);
  // other: the label, c and cUnit are all required
  incomplete(e20.mvdFromLimit({ form: 'typed', value: '1', source: 's', unit: 'other' }, 'chromogenic', null, null, '1'),
    ['limit.otherLabel', 'c', 'cUnit']);
  // the qualifier decides whether the highest standard is read
  rejected(f05({ q: '>=', highest: undefined }), 'E20-RC-01', ['resultQualifier']);
  rejected(f05({ q: 'bogus', highest: undefined }), 'E20-RC-01', ['resultQualifier']);
  incomplete(f05({ q: '=', highest: undefined }), ['highestStandard']);
  assert.equal(f05({ q: '<', highest: undefined }).status, 'result');
  // D is mL: c and cUnit are not read, supplied or absent
  const base = e20.mvdFromLimit(TYPED, 'chromogenic', null, null, '0.05');
  assert.deepEqual(e20.mvdFromLimit(TYPED, 'chromogenic', '9', 'x', '0.05'), base);
  assert.deepEqual(e20.mvdFromLimit(TYPED, 'chromogenic', 0, 7, '0.05'), base);
  assert.equal(base.cFixed, true);
  assert.deepEqual(base.c.exact, { num: '1', den: '1' });
});

test('E20L-IN-04 a non-object slot is wrong-form and its members are not required', () => {
  for (const bad of ['text', 5, [], [TYPED]]) {
    faults(e20.mvdFromLimit(bad, 'chromogenic', null, null, '1'), [[['limit'], 'wrong-form']]);
    faults(e20.assessSuitability(bad), [[['suitability'], 'wrong-form']]);
  }
  const range = e20.screenDilutions(TYPED, null, null, 'x', null, [{ lambda: '1', channels: [{ DF: '1', recovery: '1' }] }]);
  faults(range, [[['recoveryRange'], 'wrong-form']]);
  const crit = e20.screenDilutions(TYPED, null, null, RANGE, 7, [{ lambda: '1', r: '0.5', channels: [{ DF: '1', recovery: '1' }] }]);
  faults(crit, [[['criterion'], 'wrong-form']]);
});

test('section 4.1 step 1: each member of each limit form is named alone when it is the one left out', () => {
  const forms = [
    [TYPED, ['value', 'unit', 'source'], null, null],
    [{ form: 'typed', value: '2', unit: 'EU/mg', source: 's' }, ['value', 'unit', 'source'], '2', 'mg/mL'],
    [{ form: 'typed', value: '2', unit: 'other', otherLabel: 'jar', source: 's' }, ['value', 'unit', 'otherLabel', 'source'], '2', 'jar/mL'],
    [KM_MG, ['K', 'KSource', 'M', 'Munit', 'MSource'], '2', 'mg/mL'],
    [{ ...KM_MG, Munit: 'other', otherLabel: 'jar' }, ['K', 'KSource', 'M', 'Munit', 'otherLabel', 'MSource'], '2', 'jar/mL'],
    [{ form: 'preset', presetId: 'preset-1', M: '7', Munit: 'Unit', MSource: 's' }, ['presetId', 'M', 'Munit', 'MSource'], '2', 'Units/mL'],
    [{ form: 'preset', presetId: 'preset-2', M: '7', Munit: 'mL', MSource: 's' }, ['presetId', 'M', 'Munit', 'MSource'], null, null],
    [{ form: 'preset', presetId: 'preset-3' }, ['presetId'], null, null],
  ];
  for (const [limit, members, c, cUnit] of forms) {
    assert.equal(e20.resolveLimit(limit).status, 'result', JSON.stringify(limit));
    assert.equal(e20.mvdFromLimit(limit, 'chromogenic', c, cUnit, '0.05').status, 'result', JSON.stringify(limit));
    for (const m of members) {
      const cut = put(limit, m, GONE);
      incomplete(e20.resolveLimit(cut), [`limit.${m}`]);
      incomplete(e20.mvdFromLimit(cut, 'chromogenic', c, cUnit, '0.05'), [`limit.${m}`]);
      incomplete(f05({ limit: cut, c, cUnit }), [`limit.${m}`]);
    }
  }
  for (const fn of [(l) => e20.resolveLimit(l), (l) => e20.mvdFromLimit(l, 'chromogenic', null, null, '1'), (l) => f05({ limit: l })]) {
    incomplete(fn(null), ['limit']);
    incomplete(fn(undefined), ['limit']);
    incomplete(fn({}), ['limit.form']);
    incomplete(fn({ form: 'preset' }), ['limit.presetId']);
  }
});

test('section 4.1 step 1: every missing name in argument order, F05 and F06', () => {
  incomplete(e20.assessResult(null, null, null, null, null, null, null, null, null, null, null), [
    'limit', 'technique', 'lambda', 'DF', 'resultQualifier', 'resultValue']);
  incomplete(e20.assessResult(KM_MG, null, null, null, null, null, null, '=', null, null, null), [
    'technique', 'c', 'cUnit', 'lambda', 'highestStandard', 'DF', 'resultValue']);
  const none = e20.assessSuitability(null);
  incomplete(none, [
    'suitability.sampleCV.value', 'suitability.sampleCV.max', 'suitability.sampleCV.source',
    'suitability.spikeCV.value', 'suitability.spikeCV.max', 'suitability.spikeCV.source',
    'suitability.recovery.B', 'suitability.recovery.A', 'suitability.recovery.added', 'suitability.recovery.basis',
    'suitability.recovery.range.form']);
  assert.equal(none.notEntered, true);
  const some = e20.assessSuitability({ sampleCV: { value: '3' } });
  assert.equal(some.notEntered, false);
  const wrongSlot = e20.assessSuitability({ sampleCV: 'x' }); // the other leaves are still required
  assert.equal(wrongSlot.status, 'incomplete');
  assert.equal(wrongSlot.notEntered, false);
  assert.equal(wrongSlot.missing.some((m) => m.startsWith('suitability.sampleCV')), false);
  const declared = e20.assessSuitability({ recovery: { range: { form: 'declared' } } });
  assert.deepEqual(declared.missing.slice(-3), [
    'suitability.recovery.range.low', 'suitability.recovery.range.high', 'suitability.recovery.range.source']);
});

test('E20L-IN-01 decimal text edges, in a numeric argument other than the result text', () => {
  const lam = (v) => e20.mvdFromLimit(TYPED, 'chromogenic', null, null, v);
  const ref = lam('0.5');
  for (const v of ['.5', '0.5', ' 0.5 ', '+0.5', '0.50', '\t0.5\n']) assert.deepEqual(lam(v), ref, JSON.stringify(v));
  assert.deepEqual(lam('5.'), lam('5'));
  for (const v of ['+', '-', '.', '1,5', '2e5', '1e-3', 'NaN', 'Infinity', '5 mg', '0x10', '1 000', '--1', '+-1', '1.2.3', '>5', '≥5', '<5', '٥']) {
    faults(lam(v), [[['lambda'], 'not-plain-decimal']]);
  }
  for (const v of ['0', '-1', '-0.5', '0.0']) faults(lam(v), [[['lambda'], 'not-above-zero']]);
  assert.equal(e20.checkDilution('1', { num: '1', den: '1' }).status, 'result');
  faults(e20.checkDilution('0.999', { num: '1', den: '1' }), [[['DF'], 'below-one']]);
  faults(e20.checkDilution('-5', { num: '1', den: '1' }), [[['DF'], 'below-one']]);
  faults(e20.checkDilution('1,5', { num: '1', den: '1' }), [[['DF'], 'not-plain-decimal']]);
});

test('E20L-F05 the text of the result: the > test comes first, then the pattern, then the sign', () => {
  const val = (v) => f05({ value: v });
  const quantity = 'greater-than-not-a-quantity';
  for (const v of ['>5', '> 5', ' >5', '\t>5', '>=5', '≥5', ' ≥ 5', '>', '>abc']) faults(val(v), [[['resultValue'], quantity]]);
  for (const v of ['<5', '5>', '5 >', 'abc', 'five', '1,5', '2e5', '5%', '=5', 'x>']) {
    faults(val(v), [[['resultValue'], 'not-plain-decimal']]);
  }
  faults(val('-1'), [[['resultValue'], 'negative']]);
  faults(val('-0.0001'), [[['resultValue'], 'negative']]);
  const zero = val('0');
  assert.equal(zero.status, 'result');
  assert.deepEqual(val('-0'), zero); // the text -0 is zero
  assert.deepEqual(val('.8'), val('0.8'));
  assert.deepEqual(val('+0.8'), val('0.8'));
  assert.deepEqual(val(' 0.8 '), val('0.8'));
  // a negative result is negative under either qualifier
  faults(f05({ q: '<', value: '-1', highest: undefined }), [[['resultValue'], 'negative']]);
});

test('E20L-RF-05 a relation the numbers make true is never a refusal', () => {
  const r = f05({ DF: '20', value: '0.1' }); // DF above MVD (10), raw reading below the lowest standard
  assert.equal(r.status, 'result');
  assert.equal(r.dilution.permitted, false);
  assert.equal(r.rawReading.belowLowestStandard, true);
  assert.equal(r.dilution.withheldReason, 'df-above-mvd');
  assert.equal(e20.checkDilution('20', { num: '10', den: '1' }).status, 'result');
  const outside = e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, B: '2', A: '12' } }); // recovery below zero
  assert.equal(outside.status, 'result');
  assert.equal(outside.recovery.state, 'outside');
  assert.equal(outside.summary, 'outside');
  assert.deepEqual(outside.outside, ['recovery']);
});

test('E20L-F06 bounds: low equal to high, low above high, negative bounds, maxima of zero and below', () => {
  const rec = (range) => e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, range } });
  assert.equal(rec({ form: 'declared', low: '100', high: '100', source: 's' }).recovery.state, 'within');
  faults(rec({ form: 'declared', low: '100.1', high: '100', source: 's' }),
    [[['suitability.recovery.range.low', 'suitability.recovery.range.high'], 'low-above-high']]);
  assert.equal(rec({ form: 'declared', low: '-5', high: '-1', source: 's' }).recovery.state, 'outside');
  assert.equal(rec({ form: 'declared', low: '-5', high: '500', source: 's' }).recovery.state, 'within');
  const cv = (value, max) => e20.assessSuitability({ ...SUIT, sampleCV: { value, max, source: 's' } });
  assert.equal(cv('0', '0').sampleCV.state, 'within');
  assert.equal(cv('0.1', '0').sampleCV.state, 'outside');
  faults(cv('1', '-1'), [[['suitability.sampleCV.max'], 'negative']]);
  faults(cv('-1', '5'), [[['suitability.sampleCV.value'], 'negative']]);
  faults(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, B: '-0.1' } }), [[['suitability.recovery.B'], 'negative']]);
  faults(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, A: '-0.1' } }), [[['suitability.recovery.A'], 'negative']]);
  faults(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, added: '0' } }), [[['suitability.recovery.added'], 'not-above-zero']]);
  assert.equal(e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, B: '0', A: '0' } }).recovery.value.exact.num, '0');
});
