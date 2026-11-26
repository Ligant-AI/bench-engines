// E20 slice C: F05 assessResult. Every expected value is worked by hand from section 6
// (E20L-F05), section 4.1, section 4.2 and section 7.1 of the specification.
// Base case: a typed limit of 0.5 EU/mL (D is mL, c is 1), lambda 0.05, so MVD = 0.5 / 0.05 = 10.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessResult, assessSuitability } from '../src/e20/index.js';

const typed = (value = '0.5', unit = 'EU/mL', extra = {}) => ({ form: 'typed', value, unit, source: 's', ...extra });
const SUIT = {
  sampleCV: { value: '3', max: '5', source: 's' },
  spikeCV: { value: '4', max: '5', source: 's' },
  recovery: {
    B: '12', A: '2', added: '10', basis: 'as-measured',
    range: { form: 'declared', low: '50', high: '200', source: 's' },
  },
};

// Named arguments in signature order, with the base case as the default.
const ORDER = ['limit', 'technique', 'c', 'cUnit', 'lambda', 'highestStandard', 'DF', 'resultQualifier', 'resultValue', 'reagentType', 'suitability'];
const BASE = {
  limit: typed(), technique: 'chromogenic', c: null, cUnit: null, lambda: '0.05', highestStandard: '5',
  DF: '4', resultQualifier: '=', resultValue: '0.8', reagentType: 'lal', suitability: SUIT,
};
const call = (over = {}) => {
  const a = { ...BASE, ...over };
  return assessResult(...ORDER.map((k) => a[k]));
};

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

test('F05 "=" in the base case: every member, hand-worked', () => {
  // raw = 0.8 / 4 = 0.2 EU/mL, within 0.05 and 5; R = 0.8 against L = 0.5 is above; y = 0.05 x 4 = 0.2
  const r = call();
  assert.equal(r.status, 'result');
  assert.equal(r.mvd.status, 'result');
  assert.deepEqual(r.mvd.mvd.exact, { num: '10', den: '1' });
  assert.equal(r.mvd.resultBlockOffered, true);
  assert.deepEqual(r.dilution.DF.exact, { num: '4', den: '1' });
  assert.deepEqual(r.dilution.mvd.exact, { num: '10', den: '1' });
  assert.equal(r.dilution.relation, 'below');
  assert.equal(r.dilution.permitted, true);
  assert.equal(r.dilution.withheldReason, null);
  assert.equal(r.dilution.printExact, false);
  assert.equal(r.rawReading.applies, true);
  assert.deepEqual(r.rawReading.raw.exact, { num: '1', den: '5' });
  assert.equal(r.rawReading.raw.unit, 'EU/mL');
  assert.equal(r.rawReading.position, 'within');
  assert.equal(r.rawReading.belowLowestStandard, false);
  assert.equal(r.rawReading.printExact, false);
  assert.equal(r.inLimitUnit.role, 'result');
  assert.deepEqual(r.inLimitUnit.value.exact, { num: '4', den: '5' });
  assert.equal(r.inLimitUnit.value.unit, 'EU/mL');
  assert.equal(r.inLimitUnit.conversionShown, false);
  assert.deepEqual(r.relation, { state: 'above', printExact: false });
  assert.equal(r.relationKind, 'measured');
  assert.deepEqual(r.sensitivity.exact, { num: '1', den: '5' });
  assert.equal(r.sensitivity.unit, 'EU/mL');
  assert.equal(r.floorDiffers, null);
  assert.equal(r.floorPrintExact, null);
  assert.deepEqual(r.withheld, []);
  assert.equal(r.suitabilityMissing, null);
  assert.equal(r.suitabilityOutside, null);
  assert.equal(r.relationLineShown, true);
  assert.equal(r.reagentType, 'lal');
  assert.equal(r.engine.module, 'E20');
});

test('F05 the suitability member is the F06 result, unchanged', () => {
  assert.deepEqual(call().suitability, assessSuitability(SUIT));
  assert.equal(call().suitability.summary, 'all-within');
});

test('F05 relation of R with L: below, equal, above; exact values, not figures', () => {
  assert.equal(call({ resultValue: '0.4' }).relation.state, 'below');
  assert.equal(call({ resultValue: '0.5' }).relation.state, 'equal');
  assert.equal(call({ resultValue: '0.50' }).relation.state, 'equal');
  assert.equal(call({ resultValue: '0.5' }).relation.printExact, false);
  // 0.5004 shows 0.500 like L but is above it
  const near = call({ resultValue: '0.5004' });
  assert.equal(near.relation.state, 'above');
  assert.equal(near.relation.printExact, true);
});

test('F05 "<": the floor is x = floor / c, three states, the raw block does not apply', () => {
  // floor 0.2 = y (0.05 x 4) ; x = 0.2 against L = 0.5 is below
  const r = call({ resultQualifier: '<', resultValue: '0.2', highestStandard: null });
  assert.equal(r.status, 'result');
  assert.deepEqual(r.rawReading, { applies: false });
  assert.equal(r.inLimitUnit.role, 'floor');
  assert.deepEqual(r.inLimitUnit.value.exact, { num: '1', den: '5' });
  assert.equal(r.relation.state, 'below');
  assert.equal(r.relationKind, 'upper-bound');
  assert.equal(r.floorDiffers, false);
  assert.equal(r.floorPrintExact, false);
  assert.deepEqual(r.withheld, []);
  assert.equal(r.relationLineShown, true);
  assert.equal(call({ resultQualifier: '<', resultValue: '0.5' }).relation.state, 'equal');
  assert.equal(call({ resultQualifier: '<', resultValue: '0.6' }).relation.state, 'above');
});

test('F05 "<": the floor differs from y; printExact when they look alike', () => {
  const differs = call({ resultQualifier: '<', resultValue: '0.25' });
  assert.equal(differs.floorDiffers, true);
  assert.equal(differs.floorPrintExact, false);
  // 0.2001 and 0.2 both show 0.200
  const close = call({ resultQualifier: '<', resultValue: '0.2001' });
  assert.equal(close.floorDiffers, true);
  assert.equal(close.floorPrintExact, true);
});

test('F05 "<" never withholds on the raw reading, and does not read the highest standard', () => {
  const r = call({ resultQualifier: '<', resultValue: '0.01', highestStandard: 'abc', DF: '4' });
  assert.equal(r.status, 'result');
  assert.deepEqual(r.withheld, []);
  assert.equal(r.floorDiffers, true);
});

test('F05 raw reading: below the lowest, within (bounds included), above the highest', () => {
  // raw = C / 4
  const below = call({ resultValue: '0.1' }); // 0.025 < 0.05
  assert.equal(below.rawReading.position, 'below-lowest');
  assert.equal(below.rawReading.belowLowestStandard, true);
  assert.deepEqual(below.withheld, ['raw-reading-outside']);
  assert.equal(below.relationLineShown, false);
  assert.equal(below.relation.state, 'below'); // still returned
  const zero = call({ resultValue: '0' });
  assert.equal(zero.rawReading.position, 'below-lowest');
  assert.equal(zero.rawReading.belowLowestStandard, true);
  assert.equal(call({ resultValue: '0.2' }).rawReading.position, 'within'); // raw = 0.05 = lambda
  assert.equal(call({ resultValue: '20' }).rawReading.position, 'within'); // raw = 5 = highest
  const above = call({ resultValue: '30' }); // raw = 7.5 > 5
  assert.equal(above.rawReading.position, 'above-highest');
  assert.equal(above.rawReading.belowLowestStandard, false);
  assert.deepEqual(above.withheld, ['raw-reading-outside']);
});

test('F05 raw reading printExact: looks like a bound without being equal to it', () => {
  // raw = 0.20016 / 4 = 0.05004, shows 0.0500 like lambda 0.05
  const r = call({ resultValue: '0.20016' });
  assert.equal(r.rawReading.position, 'within');
  assert.equal(r.rawReading.printExact, true);
  // raw = 5.004 shows 5.00 like the highest standard, and is above it
  const hi = call({ resultValue: '20.016' });
  assert.equal(hi.rawReading.position, 'above-highest');
  assert.equal(hi.rawReading.printExact, true);
});

test('F05 dilution: above the MVD is withheld, equal is permitted', () => {
  const above = call({ DF: '20', resultValue: '4' }); // raw = 0.2
  assert.equal(above.dilution.relation, 'above');
  assert.equal(above.dilution.permitted, false);
  assert.equal(above.dilution.withheldReason, 'df-above-mvd');
  assert.deepEqual(above.withheld, ['df-above-mvd']);
  assert.equal(above.relationLineShown, false);
  assert.deepEqual(above.sensitivity.exact, { num: '1', den: '1' }); // 0.05 x 20
  const equal = call({ DF: '10', resultValue: '2' });
  assert.equal(equal.dilution.relation, 'equal');
  assert.equal(equal.dilution.permitted, true);
  assert.deepEqual(equal.withheld, []);
});

test('F05 D not mL: the result in the limit unit is C / c and the conversion shows', () => {
  // K = 5 EU/kg, M = 2 mg/kg: L = 5/2 EU/mg ; c = 2 mg/mL ; MVD = (5/2 x 2) / 0.05 = 100
  const limit = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  const r = call({ limit, c: '2', cUnit: 'mg/mL', resultValue: '10' });
  assert.equal(r.status, 'result');
  assert.deepEqual(r.mvd.mvd.exact, { num: '100', den: '1' });
  assert.deepEqual(r.inLimitUnit.value.exact, { num: '5', den: '1' }); // 10 / 2
  assert.equal(r.inLimitUnit.value.unit, 'EU/mg');
  assert.equal(r.inLimitUnit.conversionShown, true);
  assert.equal(r.relation.state, 'above'); // 5 against 5/2
  assert.deepEqual(r.rawReading.raw.exact, { num: '5', den: '2' }); // 10 / 4
  const floor = call({ limit, c: '2', cUnit: 'mg/mL', resultQualifier: '<', resultValue: '5' });
  assert.deepEqual(floor.inLimitUnit.value.exact, { num: '5', den: '2' }); // x = 5 / 2
  assert.equal(floor.relation.state, 'equal');
  assert.equal(floor.inLimitUnit.role, 'floor');
});

test('F05 withheld reasons: only those that apply, in the fixed order', () => {
  // DF above the MVD, raw below the lowest, no suitability, no reagent type
  const r = call({ DF: '20', resultValue: '0.8', suitability: null, reagentType: null });
  assert.deepEqual(r.withheld, ['df-above-mvd', 'raw-reading-outside', 'suitability-not-entered', 'reagent-not-selected']);
  assert.equal(r.relationLineShown, false);
  assert.equal(r.reagentType, null);
  assert.equal(r.suitabilityMissing, null);
  assert.equal(r.suitabilityOutside, null);
  // calculated values stay present
  assert.deepEqual(r.mvd.mvd.exact, { num: '10', den: '1' });
  assert.deepEqual(r.inLimitUnit.value.exact, { num: '4', den: '5' });
  assert.equal(r.relation.state, 'above');
});

test('F05 reagent type null is withheld, never incomplete and never changes a value', () => {
  const none = call({ reagentType: null });
  assert.equal(none.status, 'result');
  assert.deepEqual(none.withheld, ['reagent-not-selected']);
  const rfc = call({ reagentType: 'rfc' });
  assert.deepEqual(rfc.withheld, []);
  assert.equal(rfc.reagentType, 'rfc');
  assert.deepEqual({ ...none, withheld: 0, relationLineShown: 0, reagentType: 0 }, { ...rfc, withheld: 0, relationLineShown: 0, reagentType: 0 });
});

test('F05 suitability not entered, incomplete, rejected, outside', () => {
  const nul = call({ suitability: null });
  assert.deepEqual(nul.withheld, ['suitability-not-entered']);
  assert.equal(nul.suitability.status, 'incomplete');
  assert.equal(nul.suitability.notEntered, true);
  assert.equal(nul.suitabilityMissing, null);

  const part = call({ suitability: { sampleCV: { value: '3' } } });
  assert.deepEqual(part.withheld, ['suitability-incomplete']);
  assert.deepEqual(part.suitabilityMissing, part.suitability.missing);
  assert.equal(part.suitabilityMissing[0], 'suitability.sampleCV.max');

  const bad = call({ suitability: { ...SUIT, recovery: { ...SUIT.recovery, B: '-1' } } });
  assert.equal(bad.status, 'result');
  assert.deepEqual(bad.withheld, ['suitability-incomplete']);
  assert.deepEqual(bad.suitabilityMissing, ['suitability.recovery.B']);
  assert.equal(bad.suitability.code, 'CCS-RF-03');

  const wrong = call({ suitability: 'abc' });
  assert.equal(wrong.status, 'result');
  assert.deepEqual(wrong.withheld, ['suitability-incomplete']);
  assert.deepEqual(wrong.suitabilityMissing, ['suitability']);

  const unknown = call({ suitability: { ...SUIT, recovery: { ...SUIT.recovery, basis: 'zz' } } });
  assert.deepEqual(unknown.withheld, ['suitability-incomplete']);
  assert.deepEqual(unknown.suitabilityMissing, ['suitability.recovery.basis']);
  assert.equal(unknown.suitability.code, 'E20-RC-01');

  const out = call({ suitability: { ...SUIT, sampleCV: { value: '6', max: '5', source: 's' } } });
  assert.deepEqual(out.withheld, ['suitability-outside']);
  assert.deepEqual(out.suitabilityOutside, ['sample-cv']);
  assert.equal(out.suitabilityMissing, null);
  assert.equal(out.relationLineShown, false);
});

test('F05 step 1: missing names in signature order; the highest standard only for "="', () => {
  incomplete(assessResult(null, null, null, null, null, null, null, '=', null, null, null),
    ['limit', 'technique', 'lambda', 'highestStandard', 'DF', 'resultValue']);
  incomplete(assessResult(null, null, null, null, null, null, null, '<', null, null, null),
    ['limit', 'technique', 'lambda', 'DF', 'resultValue']);
  incomplete(assessResult(null, null, null, null, null, null, null, '>', null, null, null),
    ['limit', 'technique', 'lambda', 'DF', 'resultValue']);
  incomplete(assessResult(null, null, null, null, null, null, null, null, null, null, null),
    ['limit', 'technique', 'lambda', 'DF', 'resultQualifier', 'resultValue']);
  incomplete(call({ resultQualifier: null }), ['resultQualifier']);
  incomplete(call({ resultQualifier: '  ' }), ['resultQualifier']);
  incomplete(call({ highestStandard: '' }), ['highestStandard']);
  incomplete(call({ resultQualifier: '<', highestStandard: '', resultValue: undefined }), ['resultValue']);
});

test('F05 step 1: members of the limit and c, cUnit when D is not mL', () => {
  const limit = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  incomplete(call({ limit, c: null, cUnit: ' ' }), ['c', 'cUnit']);
  incomplete(call({ limit: { form: 'typed', unit: 'EU/mL' }, DF: null }), ['limit.value', 'limit.source', 'DF']);
  incomplete(call({ limit: { form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' }, technique: '' }), ['technique']);
});

test('F05 suitability leaves are never named missing by this call', () => {
  const r = call({ suitability: { sampleCV: null } });
  assert.equal(r.status, 'result');
});

test('F05 step 2: gel-clot is E20-RC-02 on technique', () => {
  rejected(call({ technique: 'gel-clot' }), 'E20-RC-02', ['technique']);
});

test('F05 step 2: unknown closed strings, argument order, E20-RC-01 before RC-02', () => {
  rejected(call({ resultQualifier: '>=' }), 'E20-RC-01', ['resultQualifier']);
  rejected(call({ resultQualifier: '≥' }), 'E20-RC-01', ['resultQualifier']);
  rejected(call({ resultQualifier: 5 }), 'E20-RC-01', ['resultQualifier']);
  rejected(call({ resultQualifier: 'EQ' }), 'E20-RC-01', ['resultQualifier']);
  rejected(call({ reagentType: 'LAL' }), 'E20-RC-01', ['reagentType']);
  rejected(call({ reagentType: 5 }), 'E20-RC-01', ['reagentType']);
  rejected(call({ technique: 'x', resultQualifier: 'y', reagentType: 'z' }), 'E20-RC-01', ['technique', 'resultQualifier', 'reagentType']);
  rejected(call({ technique: 'gel-clot', resultQualifier: '>=' }), 'E20-RC-01', ['resultQualifier']);
  rejected(call({ limit: { form: 'preset', presetId: 'preset-4' }, technique: 'gel-clot' }), 'E20-RC-02', ['limit.presetId', 'technique']);
  rejected(call({ limit: { form: 'other' } }), 'E20-RC-01', ['limit.form']);
});

test('F05 step 2: the concentration unit must cancel the denominator (E20-RC-03)', () => {
  const limit = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  rejected(call({ limit, c: '2', cUnit: 'Units/mL' }), 'E20-RC-03', ['cUnit']);
  rejected(call({ limit, c: '0', cUnit: 'mg' }), 'E20-RC-03', ['cUnit']); // alone, before the value fault
});

test('F05 step 3: the greater-than qualifier is a value fault, never an unknown string', () => {
  faults(call({ resultQualifier: '>', resultValue: '5' }), [[['resultQualifier'], 'greater-than-not-a-quantity']]);
  // the highest standard is not required and not read
  faults(call({ resultQualifier: '>', resultValue: '5', highestStandard: 'abc' }), [[['resultQualifier'], 'greater-than-not-a-quantity']]);
  incomplete(call({ resultQualifier: '>', resultValue: null }), ['resultValue']);
});

test('F05 step 3: both arguments carry the greater-than fault, two entries in argument order', () => {
  const r = call({ resultQualifier: '>', resultValue: '>5', highestStandard: null });
  faults(r, [
    [['resultQualifier'], 'greater-than-not-a-quantity'],
    [['resultValue'], 'greater-than-not-a-quantity'],
  ]);
  assert.deepEqual(r.fields, ['resultQualifier', 'resultValue']);
  // earlier faults come first
  faults(call({ DF: '0.5', resultQualifier: '>', resultValue: '>5' }), [
    [['DF'], 'below-one'],
    [['resultQualifier'], 'greater-than-not-a-quantity'],
    [['resultValue'], 'greater-than-not-a-quantity'],
  ]);
});

test('F05 step 3: the text of resultValue, three tests in order before the pattern', () => {
  for (const v of ['>5', ' >5', '>=5', '≥5', '> ', '\t>', '  ≥5', '>abc']) {
    faults(call({ resultValue: v }), [[['resultValue'], 'greater-than-not-a-quantity']]);
  }
  for (const v of ['<5', '5>', 'abc', '1e3', '1,5', '5 >', '=5', '1+2', '+', '≤ 5']) {
    faults(call({ resultValue: v }), [[['resultValue'], 'not-plain-decimal']]);
  }
  for (const v of ['-1', '-0.001', ' -5 ']) {
    faults(call({ resultValue: v }), [[['resultValue'], 'negative']]);
  }
  faults(call({ resultValue: 5 }), [[['resultValue'], 'wrong-form']]);
  faults(call({ resultValue: 5n }), [[['resultValue'], 'wrong-form']]);
  faults(call({ resultValue: { a: 1 } }), [[['resultValue'], 'wrong-form']]);
  // with "<" the text rules are the same
  faults(call({ resultQualifier: '<', resultValue: '-1' }), [[['resultValue'], 'negative']]);
  // zero, and signed or spaced plain decimals, are accepted
  for (const v of ['0', '+0.8', ' .8 ', '0.8']) assert.equal(call({ resultValue: v }).status, 'result', v);
});

test('F05 step 3: highest standard not above lambda names lambda then highestStandard', () => {
  for (const h of ['0.05', '0.01']) {
    faults(call({ highestStandard: h }), [[['lambda', 'highestStandard'], 'highest-not-above-lambda']]);
  }
  assert.equal(call({ highestStandard: '0.0501' }).status, 'result');
  // not judged unless both pass their own checks
  faults(call({ lambda: '0', highestStandard: '0.01' }), [[['lambda'], 'not-above-zero']]);
  faults(call({ highestStandard: 'abc' }), [[['highestStandard'], 'not-plain-decimal']]);
  faults(call({ highestStandard: '0' }), [[['highestStandard'], 'not-above-zero']]);
  // not judged for "<"
  assert.equal(call({ resultQualifier: '<', highestStandard: '0.01' }).status, 'result');
  // an entry of two names stands at the place of its first
  faults(call({ limit: typed('0'), highestStandard: '0.01', DF: '0.5' }), [
    [['limit.value'], 'not-above-zero'],
    [['lambda', 'highestStandard'], 'highest-not-above-lambda'],
    [['DF'], 'below-one'],
  ]);
});

test('F05 step 3: every value fault of the call together, argument order', () => {
  const limit = { form: 'km', K: '0', KSource: 's', M: 'x', Munit: 'mg', MSource: 's' };
  const r = call({ limit, c: '0', cUnit: 'mg/mL', lambda: '-1', highestStandard: '1', DF: '0', resultValue: '-3' });
  faults(r, [
    [['limit.K'], 'not-above-zero'],
    [['limit.M'], 'not-plain-decimal'],
    [['c'], 'not-above-zero'],
    [['lambda'], 'not-above-zero'],
    [['DF'], 'below-one'],
    [['resultValue'], 'negative'],
  ]);
  assert.deepEqual(r.fields, ['limit.K', 'limit.M', 'c', 'lambda', 'DF', 'resultValue']);
});

test('F05 step 3: lambda, c and DF checks; a wrong-form limit', () => {
  faults(call({ lambda: 'x' }), [[['lambda'], 'not-plain-decimal']]);
  faults(call({ lambda: 0.05 }), [[['lambda'], 'wrong-form']]);
  faults(call({ DF: '0.5' }), [[['DF'], 'below-one']]);
  faults(call({ limit: 'text' }), [[['limit'], 'wrong-form']]);
});

test('F05 order of statuses: step 1 before 2 before 3', () => {
  incomplete(call({ DF: null, technique: 'gel-clot', lambda: '0' }), ['DF']);
  rejected(call({ technique: 'gel-clot', lambda: '0' }), 'E20-RC-02', ['technique']);
});

test('F05 no suitability fault is a refusal of this call, and its fields never appear', () => {
  const r = call({ suitability: { sampleCV: 'x', spikeCV: [], recovery: 5 } });
  assert.equal(r.status, 'result');
  assert.equal(r.suitability.status, 'rejected');
  // F05 own faults list no suitability name
  const bad = call({ DF: '0.5', suitability: { sampleCV: 'x' } });
  assert.deepEqual(bad.fields, ['DF']);
});

test('F05 the whole result is built from raw inputs by the F03 and F04 definitions', () => {
  const r = call({ DF: '10' });
  assert.equal(r.dilution.relation, 'equal');
  assert.deepEqual(r.dilution.mvd, r.mvd.mvd);
});
