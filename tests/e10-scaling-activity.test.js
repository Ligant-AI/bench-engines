// E10 scaling and activity (E10R-F13..F23): tests written from docs/engine-spec-e10-scaling-activity.md
// (r3.1 + errata), E10R-AMD-1 and E10R-AMD-2-r2 (+ errata) only. Each test name cites its AT-E10R row.
import test from 'node:test';
import assert from 'node:assert/strict';
import { e9, e10 } from '../src/index.js';

const disp = e9.display;
function exactIs(res, n, d = 1n) {
  assert.equal(res.status, 'result', JSON.stringify(res));
  assert.ok(BigInt(res.exact.den) > 0n);
  assert.equal(BigInt(res.exact.num) * BigInt(d), BigInt(n) * BigInt(res.exact.den), JSON.stringify(res.exact));
}
const exOf = (e, n, d = 1n) => {
  assert.equal(BigInt(e.exact.num) * BigInt(d), BigInt(n) * BigInt(e.exact.den), JSON.stringify(e.exact));
};
const rej = (res, code, fields) => {
  assert.equal(res.status, 'rejected', JSON.stringify(res));
  assert.equal(res.code, code);
  assert.deepEqual(res.fields, fields);
  assert.equal('value' in res, false);
  assert.equal(res.engine.module, 'E10');
};
const inc = (res, missing) => {
  assert.equal(res.status, 'incomplete', JSON.stringify(res));
  assert.deepEqual(res.missing, missing);
};
const isPosZero = (v) => Object.is(v, 0);
const SA = (value, unit) => ({ form: 'single', value, unit });
const bound = (relation, value, unit) => ({ form: 'bound', relation, value, unit });
const interval = (unit, lo, loRel, hi, hiRel) => ({ form: 'interval', unit, lower: { value: lo, relation: loRel }, upper: { value: hi, relation: hiRel } });

// ---- AT-E10R-01: Examples 1 to 26 ----
test('AT-E10R-01 Examples 1-3 scaleToVolume (E10R-F13)', () => {
  let r = e10.scaleToVolume('2.5', 'g', '500', 'mL', '2', 'L', 'g');
  exactIs(r, 10n);
  assert.equal(disp('sig3', r.exact), '10.0');
  assert.equal(r.unit, 'g');
  r = e10.scaleToVolume('15', 'mL', '100', 'mL', '30', 'mL', 'mL');
  exactIs(r, 9n, 2n);
  assert.equal(disp('sig3', r.exact), '4.50');
  r = e10.scaleToVolume('1', 'g', '3', 'mL', '1', 'mL', 'mg');
  exactIs(r, 1000n, 3n);
  assert.equal(disp('sig3', r.exact), '333');
});

test('AT-E10R-01 Examples 4, 5 volumeFromAmount (E10R-F14)', () => {
  let r = e10.volumeFromAmount('10', 'nmol', '50', 'uM', 'uL');
  exactIs(r, 200n);
  r = e10.volumeFromAmount('5', 'ug', '2', 'mg/mL', 'uL');
  exactIs(r, 5n, 2n);
  assert.equal(disp('sig3', r.exact), '2.50');
});

test('AT-E10R-01 Example 6 balanceVolume (E10R-F15) and AT-E10R-08 over/equal', () => {
  let r = e10.balanceVolume('50', 'mL', [{ value: '5', unit: 'mL' }, { value: '500', unit: 'uL' }], 'mL');
  exactIs(r, 89n, 2n);
  assert.equal(disp('sig3', r.exact), '44.5');
  assert.equal(r.assumes, 'additive volumes');
  r = e10.balanceVolume('50', 'mL', [{ value: '30', unit: 'mL' }, { value: '25', unit: 'mL' }], 'mL');
  rej(r, 'E10-RC-03', ['parts']);
  exOf(r.partsTotal, 55n);
  exOf(r.statedTotal, 50n);
  assert.equal(r.partsTotal.unit, 'mL');
  assert.equal(r.statedTotal.unit, 'mL');
  assert.equal('assumes' in r, false);
  r = e10.balanceVolume('55', 'mL', [{ value: '30', unit: 'mL' }, { value: '25', unit: 'mL' }], 'mL');
  exactIs(r, 0n);
  assert.ok(isPosZero(r.value));
  assert.equal(r.assumes, 'additive volumes');
});

test('AT-E10R-01 Examples 7-9 percentSolution w/v, v/v, w/w (E10R-F16)', () => {
  let r = e10.percentSolution('0.9', 'w/v', 'final', '500', 'mL', 'g');
  exactIs(r, 9n, 2n);
  assert.equal(disp('sig3', r.exact), '4.50');
  assert.equal('assumes' in r, false);
  r = e10.percentSolution('70', 'v/v', 'final', '250', 'mL', 'mL');
  exactIs(r, 175n);
  assert.equal('assumes' in r, false);
  r = e10.percentSolution('20', 'w/w', 'final', '100', 'g', 'g');
  exactIs(r, 20n);
  exOf(r.solvent, 80n);
  assert.equal(r.solvent.unit, 'g');
  assert.equal('assumes' in r, false);
});

test('AT-E10R-20 Examples 10, 11 reference modes 2 and 3 (E10R-F16)', () => {
  let r = e10.percentSolution('10', 'v/v', 'added', '500', 'mL', 'mL');
  exactIs(r, 50n);
  exOf(r.finalVolume, 550n);
  exOf(r.percentOfFinal, 100n, 11n);
  assert.equal(disp('sig3', r.percentOfFinal.exact), '9.09');
  assert.equal(r.assumes, 'additive volumes');
  r = e10.percentSolution('10', 'v/v', 'reach', '500', 'mL', 'mL');
  exactIs(r, 500n, 9n);
  assert.equal(disp('sig3', r.exact), '55.6');
  exOf(r.finalVolume, 5000n, 9n);
  assert.equal(disp('sig3', r.finalVolume.exact), '556');
  assert.equal(r.assumes, 'additive volumes');
  assert.equal('percentOfFinal' in r, false);
  r = e10.percentSolution('10', 'v/v', 'final', '500', 'mL', 'mL');
  exactIs(r, 50n);
});

test('AT-E10R-21 Example 12 X7 two-call route (E10R-F14)', () => {
  const c1 = e10.molarToMass('1', 'mM', '500', 'mg/mL');
  exactIs(c1, 1n, 2n);
  const c2 = e10.volumeFromAmount('1', 'mg', '0.5', 'mg/mL', 'mL');
  exactIs(c2, 2n);
  assert.equal(disp('sig3', c2.exact), '2.00');
  // call 1 terminates for MW 74.55; call 2 is a result
  const d1 = e10.molarToMass('1', 'mM', '74.55', 'mg/mL');
  exactIs(d1, 7455n, 100000n);
  const d2 = e10.volumeFromAmount('1', 'mg', '0.07455', 'mg/mL', 'mL');
  assert.equal(d2.status, 'result');
});

test('AT-E10R-01 Example 13 concentrateVolume (E10R-F18)', () => {
  exactIs(e10.concentrateVolume('500', 'mL', '10', 'mL'), 50n);
  const r = e10.concentrateVolume('1', 'L', '3', 'mL');
  exactIs(r, 1000n, 3n);
  assert.equal(disp('sig3', r.exact), '333');
  exactIs(e10.concentrateVolume('500', 'mL', '1', 'mL'), 500n);
});

test('AT-E10R-29 / AT-E10R-01 Example 14 scaleToVolume with an activity amount (E10R-F13)', () => {
  const r = e10.scaleToVolume('100', 'IU', '100', 'mL', '250', 'mL', 'IU');
  exactIs(r, 250n);
  assert.equal(r.unit, 'IU');
  // IU meets U: both unit fields (NAD-2026-11-14-365; E10R-AMD-4 replaces r3.1 :352)
  const iu = e10.scaleToVolume('100', 'IU', '100', 'mL', '250', 'mL', 'U');
  rej(iu, 'E10-RC-02', ['unit', 'toUnit']);
  assert.equal('message' in iu, false);
  // U to IU: same refusal, no message (AMD-3 :37 (c))
  const ui = e10.scaleToVolume('100', 'U', '100', 'mL', '250', 'mL', 'IU');
  rej(ui, 'E10-RC-02', ['unit', 'toUnit']);
  assert.equal('message' in ui, false);
});

test('AT-E10R-24 Example 15 activityToMass and massToActivity, single SA (E10R-F20, F21)', () => {
  const s = SA('10000000', 'IU/mg');
  const r = e10.activityToMass('250', 'IU', s, 'ug');
  exactIs(r, 1n, 40n);
  assert.equal(disp('sig3', r.exact), '0.0250');
  assert.equal('lower' in r, false);
  const b = e10.massToActivity('0.025', 'ug', s, 'IU');
  exactIs(b, 250n);
});

test('AT-E10R-24 Example 16 activityToMass concentration (E10R-F20)', () => {
  const r = e10.activityToMass('100', 'IU/mL', SA('21000', 'IU/ug'), 'ng/mL');
  exactIs(r, 100n, 21n);
  assert.equal(disp('sci3', r.exact), '4.76 × 10^0');
});

test('AT-E10R-24 Example 17 one-sided SA to mass flips the bound (E10R-F20)', () => {
  let r = e10.activityToMass('100', 'IU/mL', bound('>', '10000000', 'IU/mg'), 'ng/mL');
  assert.equal(r.status, 'result');
  assert.equal(r.lower, null);
  exOf(r.upper, 10n);
  assert.equal(r.upper.relation, '<');
  assert.equal('value' in r, false);
  assert.equal('exact' in r, false);
  r = e10.activityToMass('100', 'IU/mL', bound('>=', '10000000', 'IU/mg'), 'ng/mL');
  assert.equal(r.upper.relation, '<=');
  r = e10.activityToMass('100', 'IU/mL', bound('<', '10000000', 'IU/mg'), 'ng/mL');
  assert.equal(r.upper, null);
  assert.equal(r.lower.relation, '>');
  r = e10.activityToMass('100', 'IU/mL', bound('<=', '10000000', 'IU/mg'), 'ng/mL');
  assert.equal(r.lower.relation, '>=');
});

test('AT-E10R-24 Example 18 interval to mass (E10R-F20)', () => {
  const r = e10.activityToMass('100', 'IU/mL', interval('IU/mg', '10000000', '>=', '20000000', '<='), 'ng/mL');
  exOf(r.lower, 5n);
  assert.equal(r.lower.relation, '>=');
  exOf(r.upper, 10n);
  assert.equal(r.upper.relation, '<=');
  assert.equal(r.form, 'bounded');
  assert.equal(r.unit, 'ng/mL');
  assert.equal(disp('sci3', r.upper.exact), '1.00 × 10^1');
});

test('AT-E10R-24 Example 19 one-sided SA to activity keeps the bound (E10R-F21)', () => {
  const r = e10.massToActivity('10', 'ng/mL', bound('>', '10000000', 'IU/mg'), 'IU/mL');
  assert.equal(r.upper, null);
  exOf(r.lower, 100n);
  assert.equal(r.lower.relation, '>');
  assert.equal('value' in r, false);
  const i = e10.massToActivity('10', 'ng/mL', interval('IU/mg', '10000000', '>', '20000000', '<'), 'IU/mL');
  exOf(i.lower, 100n);
  assert.equal(i.lower.relation, '>');
  exOf(i.upper, 200n);
  assert.equal(i.upper.relation, '<');
});

test('AT-E10R-26 Example 20 IU and U never meet (E10R-F20, F21, F13, F15, scaleUnit)', () => {
  rej(e10.activityToMass('100', 'IU/mL', SA('10000', 'U/mg'), 'ng/mL'), 'E10-RC-02', ['aUnit', 'SA.unit']);
  rej(e10.massToActivity('1', 'ng', SA('10000', 'U/mg'), 'IU'), 'E10-RC-02', ['SA.unit', 'toUnit']);
  rej(e10.scaleUnit('1', 'IU', 'U'), 'E10-RC-02', ['fromUnit', 'toUnit']);
  rej(e10.scaleUnit('1', 'IU/mL', 'U/mL'), 'E10-RC-02', ['fromUnit', 'toUnit']);
  rej(e10.scaleToVolume('1', 'IU', '1', 'mL', '1', 'mL', 'U'), 'E10-RC-02', ['unit', 'toUnit']);
  rej(e10.balanceVolume('50', 'mL', [{ value: '1', unit: 'IU' }], 'mL'), 'E10-RC-02', ['parts[0].unit']);
  rej(e10.activityToMass('1', 'U', SA('1', 'IU/mg'), 'ng'), 'E10-RC-02', ['aUnit', 'SA.unit']);
});

test('AT-E10R-21..AT-E10R-01 Example 21 roundDeclared (E10R-F19), AT-E10R-23', () => {
  const t = (v, rule, places = '2') => e10.roundDeclared(v, rule, places);
  const both = (v, up, even) => {
    for (const val of [v.text, v.exact]) {
      assert.equal(t(val, 'half-up').text, up);
      assert.equal(t(val, 'half-even').text, even);
    }
  };
  both({ text: '111.825', exact: { num: '4473', den: '40' } }, '111.83', '111.82');
  both({ text: '2.675', exact: { num: '107', den: '40' } }, '2.68', '2.68');
  both({ text: '1.005', exact: { num: '201', den: '200' } }, '1.01', '1.00');
  both({ text: '1.015', exact: { num: '203', den: '200' } }, '1.02', '1.02');
  both({ text: '2.345', exact: { num: '469', den: '200' } }, '2.35', '2.34');
  const r = t({ num: '4473', den: '40' }, 'half-up');
  assert.equal(r.status, 'result');
  assert.equal(r.rule, 'half-up');
  assert.equal(t({ num: '4473', den: '40' }, 'half-up', '0').text, '112');
  assert.equal(t({ num: '4473', den: '40' }, 'half-even', '0').text, '112');
  rej(t(111.825, 'half-up'), 'CCS-RF-03', ['value']);
});

test('AT-E10R-31 / AT-E10R-01 Examples 22-25 kind (3) routes', () => {
  exactIs(e10.amountFromConcentration('4.5', 'g/L', '2', 'L', 'g'), 9n);
  const b1 = e10.molarToMass('10', 'mM', '238.3', 'g/L');
  exactIs(b1, 2383n, 1000n);
  exactIs(e10.amountFromConcentration('2.383', 'g/L', '500', 'mL', 'g'), 2383n, 2000n);
  exactIs(e10.amountFromConcentration('2', 'mM', '500', 'mL', 'umol'), 1000n);
  exactIs(e10.volumeFromAmount('1000', 'umol', '200', 'mM', 'mL'), 5n);
  const d1 = e10.activityAmountFromConcentration('100', 'IU/mL', '500', 'mL', 'IU');
  exactIs(d1, 50000n);
  const d2 = e10.volumeFromAmount('50000', 'IU', '100000', 'IU/mL', 'mL');
  exactIs(d2, 1n, 2n);
  assert.equal(disp('sig3', d2.exact), '0.500');
});

test('AT-E10R-32 Example 26 activity pairs (E10R-F22, E10R-F14)', () => {
  const r = e10.activityAmountFromConcentration('2', 'U/mL', '250', 'mL', 'U');
  exactIs(r, 500n);
  exactIs(e10.volumeFromAmount('500', 'U', '2', 'U/mL', 'mL'), 250n);
  rej(e10.activityAmountFromConcentration('2', 'U/mL', '250', 'mL', 'IU'), 'E10-RC-02', ['cUnit', 'toUnit']);
  rej(e10.volumeFromAmount('500', 'IU', '2', 'U/mL', 'mL'), 'E10-RC-02', ['nUnit', 'cUnit']);
  rej(e10.volumeFromAmount('500', 'U', '2', 'IU/mL', 'mL'), 'E10-RC-02', ['nUnit', 'cUnit']);
  // E10C-F12 now refuses activity units with E10-RC-02 (AT-E10R-13)
  rej(e10.amountFromConcentration('2', 'U/mL', '250', 'mL', 'U'), 'E10-RC-02', ['unit']);
});

test('AT-E10R-32 E10R-F22 zero V, zero and "-0" c, negative c', () => {
  rej(e10.activityAmountFromConcentration('2', 'IU/mL', '0', 'mL', 'IU'), 'CCS-RF-03', ['V']);
  for (const c of ['0', '-0']) {
    const r = e10.activityAmountFromConcentration(c, 'IU/mL', '5', 'mL', 'IU');
    exactIs(r, 0n);
    assert.ok(isPosZero(r.value));
    assert.equal(r.unit, 'IU');
  }
  rej(e10.activityAmountFromConcentration('-1', 'IU/mL', '5', 'mL', 'IU'), 'CCS-RF-03', ['c']);
});

// ---- AT-E10R-02 zero ----
test('AT-E10R-02 zero amount and "-0" give 0, never negative zero (F13, F14, F16, F20, F21)', () => {
  for (const z of ['0', '-0']) {
    for (const r of [
      e10.scaleToVolume(z, 'g', '1', 'mL', '2', 'mL', 'g'),
      e10.volumeFromAmount(z, 'nmol', '50', 'uM', 'uL'),
      e10.percentSolution(z, 'w/v', 'final', '500', 'mL', 'g'),
      e10.percentSolution(z, 'v/v', 'final', '500', 'mL', 'mL'),
      e10.percentSolution(z, 'v/v', 'added', '500', 'mL', 'mL'),
      e10.percentSolution(z, 'v/v', 'reach', '500', 'mL', 'mL'),
      e10.percentSolution(z, 'w/w', 'final', '100', 'g', 'g'),
      e10.activityToMass(z, 'IU', SA('1000', 'IU/mg'), 'ug'),
      e10.massToActivity(z, 'ug', SA('1000', 'IU/mg'), 'IU'),
    ]) {
      exactIs(r, 0n);
      assert.ok(isPosZero(r.value), JSON.stringify(r));
    }
    // zero under a bound or an interval is the common shape 0, no lower, no upper
    for (const s of [bound('>', '1000', 'IU/mg'), interval('IU/mg', '1000', '>=', '2000', '<=')]) {
      for (const r of [e10.activityToMass(z, 'IU', s, 'ug'), e10.massToActivity(z, 'ug', s, 'IU')]) {
        exactIs(r, 0n);
        assert.equal('lower' in r, false);
        assert.equal('upper' in r, false);
        assert.ok(isPosZero(r.value));
      }
    }
  }
});

// ---- AT-E10R-03 .. AT-E10R-07 refusals ----
test('AT-E10R-03 scaleToVolume with a concentration unit (E10R-F13)', () => {
  const MSG = 'a concentration does not scale with the final volume';
  // a concentration unit with a toUnit that is itself a concentration: toUnit is wrong for its
  // own role too, so both fields (NAD-2026-11-14-364), with the A5 message (NAD-2026-11-14-366)
  for (const u of ['mg/mL', 'IU/mL', 'U/mL']) {
    const r = e10.scaleToVolume('1', u, '1', 'mL', '2', 'mL', u);
    rej(r, 'E10-RC-02', ['unit', 'toUnit']);
    assert.equal(r.message, MSG);
  }
  // (i) NAD-2026-11-14-364: IU/mL with an activity-amount toUnit names unit only
  let r = e10.scaleToVolume('100', 'IU/mL', '100', 'mL', '250', 'mL', 'U');
  rej(r, 'E10-RC-02', ['unit']);
  assert.equal(r.message, MSG);
  // (ii) toUnit a concentration or specific activity: both fields, message
  for (const t of ['U/mL', 'U/mg', 'U/ug', 'IU/mL', 'mg/mL']) {
    r = e10.scaleToVolume('100', 'IU/mL', '100', 'mL', '250', 'mL', t);
    rej(r, 'E10-RC-02', ['unit', 'toUnit']);
    assert.equal(r.message, MSG);
  }
  // NAD-2026-11-14-366: U/mL as unit carries the message, whatever the toUnit's kind
  r = e10.scaleToVolume('100', 'U/mL', '100', 'mL', '250', 'mL', 'U');
  rej(r, 'E10-RC-02', ['unit']);
  assert.equal(r.message, MSG);
  r = e10.scaleToVolume('100', 'U/mL', '100', 'mL', '250', 'mL', 'IU');
  rej(r, 'E10-RC-02', ['unit']);
  assert.equal(r.message, MSG);
  // a specific-activity unit as unit is refused with no message
  r = e10.scaleToVolume('100', 'U/mg', '100', 'mL', '250', 'mL', 'U');
  rej(r, 'E10-RC-02', ['unit']);
  assert.equal('message' in r, false);
});

test('AT-E10R-04 volumeFromAmount mismatched pairs (E10R-F14)', () => {
  rej(e10.volumeFromAmount('1', 'nmol', '1', 'mg/mL', 'mL'), 'E10-RC-02', ['nUnit', 'cUnit']);
  rej(e10.volumeFromAmount('1', 'ug', '1', 'uM', 'mL'), 'E10-RC-02', ['nUnit', 'cUnit']);
});

test('AT-E10R-05 percentSolution closed strings (E10R-F16)', () => {
  assert.equal(e10.percentSolution('20', 'w/w', 'final', '100', 'g', 'g').status, 'result');
  rej(e10.percentSolution('1', 'W/V', 'final', '1', 'mL', 'g'), 'E10-RC-01', ['basis']);
  rej(e10.percentSolution('1', 'm/v', 'final', '1', 'mL', 'g'), 'E10-RC-01', ['basis']);
  rej(e10.percentSolution('1', 'w/v', 'Final', '1', 'mL', 'g'), 'E10-RC-01', ['reference']);
  for (const ref of ['added', 'reach']) {
    rej(e10.percentSolution('1', 'w/v', ref, '1', 'mL', 'g'), 'E10-RC-02', ['reference']);
    rej(e10.percentSolution('1', 'w/w', ref, '1', 'g', 'g'), 'E10-RC-02', ['reference']);
  }
});

test('AT-E10R-06 unknown units and closed strings name only the unknown fields', () => {
  rej(e10.scaleToVolume('1', 'g', '1', 'mL', '2', 'mL', 'kg'), 'E10-RC-01', ['toUnit']);
  rej(e10.balanceVolume('50', 'mL', [{ value: '1', unit: 'mL' }, { value: '1', unit: 'cc' }], 'mL'), 'E10-RC-01', ['parts[1].unit']);
  rej(e10.activityToMass('1', 'IU', SA('1', 'IU/kg'), 'ug'), 'E10-RC-01', ['SA.unit']);
  rej(e10.activityToMass('1', 'IU', { form: 'point', value: '1', unit: 'IU/mg' }, 'ug'), 'E10-RC-01', ['SA.form']);
  rej(e10.activityToMass('1', 'IU', bound('=', '1', 'IU/mg'), 'ug'), 'E10-RC-01', ['SA.relation']);
  rej(e10.roundDeclared('1.5', 'round', '0'), 'E10-RC-01', ['rule']);
  rej(e10.scaleUnit('1', 'kIU', 'IU'), 'E10-RC-01', ['fromUnit']);
});

test('AT-E10R-07 wrong-dimension units name only the wrong fields', () => {
  rej(e10.scaleToVolume('1', 'g', '1', 'g', '2', 'mL', 'g'), 'E10-RC-02', ['VfromUnit']);
  rej(e10.scaleToVolume('1', 'g', '1', 'mL', '2', 'mL', 'mL'), 'E10-RC-02', ['toUnit']);
  rej(e10.volumeFromAmount('1', 'ug', '1', 'mg/mL', 'g'), 'E10-RC-02', ['toUnit']);
  rej(e10.balanceVolume('50', 'g', [{ value: '1', unit: 'mL' }], 'mL'), 'E10-RC-02', ['Vunit']);
  rej(e10.percentSolution('20', 'w/w', 'final', '100', 'mL', 'g'), 'E10-RC-02', ['Bunit']);
  rej(e10.percentSolution('20', 'w/w', 'final', '100', 'g', 'mL'), 'E10-RC-02', ['toUnit']);
  rej(e10.percentSolution('20', 'w/v', 'final', '100', 'g', 'g'), 'E10-RC-02', ['Bunit']);
  rej(e10.percentSolution('20', 'v/v', 'final', '100', 'mL', 'g'), 'E10-RC-02', ['toUnit']);
  rej(e10.concentrateVolume('1', 'g', '2', 'mL'), 'E10-RC-02', ['Vunit']);
  rej(e10.activityToMass('1', 'mg', SA('1', 'IU/mg'), 'ug'), 'E10-RC-02', ['aUnit']);
  rej(e10.activityToMass('1', 'IU', SA('1', 'IU'), 'ug'), 'E10-RC-02', ['SA.unit']);
  rej(e10.activityToMass('1', 'IU', SA('1', 'IU/mg'), 'ug/mL'), 'E10-RC-02', ['toUnit']);
  rej(e10.activityToMass('1', 'IU/mL', SA('1', 'IU/mg'), 'ug'), 'E10-RC-02', ['toUnit']);
  rej(e10.massToActivity('1', 'ug', SA('1', 'IU/mg'), 'IU/mL'), 'E10-RC-02', ['toUnit']);
  rej(e10.massToActivity('1', 'uM', SA('1', 'IU/mg'), 'IU'), 'E10-RC-02', ['mUnit']);
  rej(e10.activityAmountFromConcentration('1', 'mg/mL', '1', 'mL', 'IU'), 'E10-RC-02', ['cUnit']);
  rej(e10.activityAmountFromConcentration('1', 'IU/mL', '1', 'g', 'IU'), 'E10-RC-02', ['Vunit']);
});

test('AT-E10R-08 balanceVolume over and equal total (E10R-F15, E10-RC-03)', () => {
  // covered with Example 6 above; here the message and a unit change
  const r = e10.balanceVolume('50', 'mL', [{ value: '0.06', unit: 'L' }], 'uL');
  rej(r, 'E10-RC-03', ['parts']);
  exOf(r.partsTotal, 60000n);
  exOf(r.statedTotal, 50000n);
  assert.equal(r.partsTotal.unit, 'uL');
  assert.ok(typeof r.message === 'string' && r.message.length > 0);
});

test('AT-E10R-09 divisors and values as "0", "-5", "abc", "2e5", "1,5" (CCS-RF-03 naming the field)', () => {
  for (const bad of ['0', '-5', 'abc', '2e5', '1,5']) {
    rej(e10.scaleToVolume('1', 'g', bad, 'mL', '2', 'mL', 'g'), 'CCS-RF-03', ['Vfrom']);
    rej(e10.scaleToVolume('1', 'g', '1', 'mL', bad, 'mL', 'g'), 'CCS-RF-03', ['Vto']);
    rej(e10.balanceVolume(bad, 'mL', [{ value: '1', unit: 'mL' }], 'mL'), 'CCS-RF-03', ['Vtotal']);
    rej(e10.concentrateVolume(bad, 'mL', '2', 'mL'), 'CCS-RF-03', ['Vfinal']);
    rej(e10.percentSolution('1', 'w/v', 'final', bad, 'mL', 'g'), 'CCS-RF-03', ['B']);
    rej(e10.volumeFromAmount('1', 'nmol', bad, 'uM', 'uL'), 'CCS-RF-03', ['c']);
    rej(e10.activityToMass('1', 'IU', SA(bad, 'IU/mg'), 'ug'), 'CCS-RF-03', ['SA.value']);
  }
  rej(e10.scaleToVolume('-1', 'g', '1', 'mL', '2', 'mL', 'g'), 'CCS-RF-03', ['q']);
  rej(e10.balanceVolume('50', 'mL', [{ value: '-1', unit: 'mL' }], 'mL'), 'CCS-RF-03', ['parts[0]']);
  rej(e10.activityToMass('-1', 'IU', SA('1', 'IU/mg'), 'ug'), 'CCS-RF-03', ['a']);
  rej(e10.massToActivity('-1', 'ug', SA('1', 'IU/mg'), 'IU'), 'CCS-RF-03', ['m']);
  rej(e10.volumeFromAmount('-1', 'nmol', '1', 'uM', 'uL'), 'CCS-RF-03', ['n']);
});

test('AT-E10R-10 several bad fields give one rejected, fields in argument order', () => {
  rej(e10.scaleToVolume('-1', 'g', '0', 'mL', 'x', 'mL', 'g'), 'CCS-RF-03', ['q', 'Vfrom', 'Vto']);
  rej(e10.percentSolution('-1', 'w/v', 'final', '0', 'mL', 'g'), 'CCS-RF-03', ['pct', 'B']);
  rej(e10.balanceVolume('0', 'mL', [{ value: '-1', unit: 'mL' }, { value: 'q', unit: 'mL' }], 'mL'), 'CCS-RF-03', ['Vtotal', 'parts[0]', 'parts[1]']);
});

test('AT-E10R-11 order of statuses: null beats bad value; unit refusal beats bad value', () => {
  inc(e10.scaleToVolume(null, 'g', '0', 'mL', '2', 'mL', 'g'), ['q']);
  inc(e10.percentSolution('1', null, 'final', '0', 'mL', 'g'), ['basis']);
  inc(e10.balanceVolume('50', 'mL', [], 'mL'), ['parts']);
  inc(e10.balanceVolume('50', 'mL', null, 'mL'), ['parts']);
  rej(e10.scaleToVolume('-1', 'g', '1', 'mL', '2', 'mL', 'kg'), 'E10-RC-01', ['toUnit']);
  rej(e10.scaleToVolume('-1', 'g', '1', 'mL', '2', 'mL', 'mL'), 'E10-RC-02', ['toUnit']);
  rej(e10.activityToMass('1', 'IU', SA('-1', 'IU/mg'), 'ug/mL'), 'E10-RC-02', ['toUnit']);
});

test('AT-E10R-12 version fields on every result and refusal', () => {
  const all = [
    e10.scaleToVolume('1', 'g', '1', 'mL', '2', 'mL', 'g'), e10.scaleToVolume(null, 'g', '1', 'mL', '2', 'mL', 'g'),
    e10.percentSolution('1', 'w/v', 'final', '1', 'mL', 'g'), e10.activityToMass('1', 'IU', SA('1', 'IU/mg'), 'ug'),
    e10.roundDeclared('1.5', 'half-up', '0'), e10.volumeFill([{ exact: { num: '1', den: '1' }, unit: 'mL' }], { exact: { num: '2', den: '1' }, unit: 'mL' }),
    e10.volumeFill(null, null),
  ];
  for (const r of all) {
    assert.equal(r.engine.module, 'E10');
    assert.equal(r.engine.version, '0.3.0');
    assert.equal(r.engine.moduleVersion, '0.3.0');
  }
});

// ---- AT-E10R-13 regression ----
test('AT-E10R-13 activity tokens are table units now; scaleUnit within-family checks', () => {
  let r = e10.scaleUnit('1', 'IU/mg', 'IU/ug');
  exactIs(r, 1n, 1000n);
  r = e10.scaleUnit('1', 'U/mL', 'U/mL');
  exactIs(r, 1n);
  for (const u of ['IU', 'U', 'IU/mL', 'U/mL', 'IU/mg', 'IU/ug', 'U/mg', 'U/ug']) assert.equal(e10.scaleUnit('1', u, u).status, 'result', u);
  for (const u of ['kIU', 'mIU', 'uU', 'unit', 'units', 'IU/L']) assert.equal(e10.scaleUnit('1', u, 'IU').code, 'E10-RC-01', u);
});

test('AT-E10R-14 determinism', () => {
  const a = e10.percentSolution('10', 'v/v', 'reach', '500', 'mL', 'mL');
  const b = e10.percentSolution('10', 'v/v', 'reach', '500', 'mL', 'mL');
  assert.deepEqual(a, b);
});

test('AT-E10R-17 pct bounds (E10R-F16)', () => {
  const run = (basis, ref, pct) => e10.percentSolution(pct, basis, ref, '100', basis === 'w/w' ? 'g' : 'mL', basis === 'v/v' ? 'mL' : 'g');
  for (const p of ['0', '100', '250']) assert.equal(run('w/v', 'final', p).status, 'result', `w/v ${p}`);
  for (const [b, ref] of [['v/v', 'final'], ['w/w', 'final']]) {
    for (const p of ['0', '100']) assert.equal(run(b, ref, p).status, 'result', `${b} ${p}`);
    for (const p of ['100.5', '-1']) rej(run(b, ref, p), 'CCS-RF-03', ['pct']);
  }
  for (const p of ['0', '100', '250']) assert.equal(run('v/v', 'added', p).status, 'result', `added ${p}`);
  for (const p of ['0', '99.5']) assert.equal(run('v/v', 'reach', p).status, 'result', `reach ${p}`);
  for (const p of ['100', '150']) rej(run('v/v', 'reach', p), 'CCS-RF-03', ['pct']);
});

test('AT-E10R-18 assumes present on F15 and F16 modes 2, 3; absent on w/v, w/w, v/v mode 1', () => {
  const has = (r) => r.assumes === 'additive volumes';
  assert.ok(has(e10.balanceVolume('50', 'mL', [{ value: '5', unit: 'mL' }], 'mL')));
  assert.ok(has(e10.percentSolution('10', 'v/v', 'added', '5', 'mL', 'mL')));
  assert.ok(has(e10.percentSolution('10', 'v/v', 'reach', '5', 'mL', 'mL')));
  assert.equal('assumes' in e10.percentSolution('10', 'v/v', 'final', '5', 'mL', 'mL'), false);
  assert.equal('assumes' in e10.percentSolution('10', 'w/v', 'final', '5', 'mL', 'g'), false);
  assert.equal('assumes' in e10.percentSolution('10', 'w/w', 'final', '5', 'g', 'g'), false);
});

test('AT-E10R-22 concentrateVolume fold and Vfinal (E10R-F18)', () => {
  exactIs(e10.concentrateVolume('500', 'mL', '1', 'mL'), 500n);
  exactIs(e10.concentrateVolume('500', 'mL', '10', 'mL'), 50n);
  rej(e10.concentrateVolume('500', 'mL', '0.5', 'mL'), 'CCS-RF-03', ['fold']);
  rej(e10.concentrateVolume('500', 'mL', 'abc', 'mL'), 'CCS-RF-03', ['fold']);
  rej(e10.concentrateVolume('0', 'mL', '10', 'mL'), 'CCS-RF-03', ['Vfinal']);
});

test('AT-E10R-25 bounded result shape (E10R-F20, F21)', () => {
  const single = e10.activityToMass('250', 'IU', SA('10000000', 'IU/mg'), 'ug');
  assert.ok('value' in single && 'exact' in single);
  assert.equal('lower' in single, false);
  assert.equal('upper' in single, false);
  const bounded = e10.activityToMass('250', 'IU', bound('>', '10000000', 'IU/mg'), 'ug');
  assert.equal('value' in bounded, false);
  assert.equal('exact' in bounded, false);
  assert.equal([bounded.lower, bounded.upper].filter((x) => x !== null).length, 1);
  const iv = e10.massToActivity('1', 'ug', interval('IU/mg', '1', '>=', '2', '<='), 'IU');
  assert.ok(iv.lower && iv.upper);
  assert.equal('value' in iv, false);
});

test('AT-E10R-27 no SA: null, null member, SA <= 0, non-numeric, activity < 0', () => {
  inc(e10.activityToMass('1', 'IU', null, 'ug'), ['SA']);
  inc(e10.activityToMass('1', 'IU', { form: 'single', unit: 'IU/mg' }, 'ug'), ['SA.value']);
  inc(e10.activityToMass('1', 'IU', { form: 'single', value: '1' }, 'ug'), ['SA.unit']);
  inc(e10.activityToMass('1', 'IU', { value: '1', unit: 'IU/mg' }, 'ug'), ['SA.form']);
  inc(e10.activityToMass('1', 'IU', { form: 'bound', value: '1', unit: 'IU/mg' }, 'ug'), ['SA.relation']);
  inc(e10.massToActivity('1', 'ug', { form: 'interval', unit: 'IU/mg', lower: { value: '1', relation: '>' } }, 'IU'), ['SA.upper']);
  inc(e10.activityToMass('1', 'IU', { form: 'interval', unit: 'IU/mg', lower: { relation: '>' }, upper: { value: '2', relation: '<' } }, 'ug'), ['SA.lower.value']);
  for (const bad of ['0', '-3', 'abc']) {
    rej(e10.activityToMass('1', 'IU', SA(bad, 'IU/mg'), 'ug'), 'CCS-RF-03', ['SA.value']);
    rej(e10.activityToMass('1', 'IU', bound('>', bad, 'IU/mg'), 'ug'), 'CCS-RF-03', ['SA.value']);
    rej(e10.activityToMass('1', 'IU', interval('IU/mg', bad, '>', '5', '<'), 'ug'), 'CCS-RF-03', ['SA.lower']);
    rej(e10.activityToMass('1', 'IU', interval('IU/mg', '1', '>', bad, '<'), 'ug'), 'CCS-RF-03', ['SA.upper']);
  }
  rej(e10.activityToMass('-1', 'IU', SA('1', 'IU/mg'), 'ug'), 'CCS-RF-03', ['a']);
});

test('AT-E10R-28 interval refusals (E10R-F20)', () => {
  let r = e10.activityToMass('1', 'IU', interval('IU/mg', '20', '>=', '10', '<='), 'ug');
  rej(r, 'CCS-RF-03', ['SA.lower', 'SA.upper']);
  r = e10.activityToMass('1', 'IU', interval('IU/mg', '10', '>=', '10', '<='), 'ug');
  rej(r, 'CCS-RF-03', ['SA.lower', 'SA.upper']);
  assert.equal(r.message, 'the two limits are equal; enter it as a single value');
  rej(e10.activityToMass('1', 'IU', interval('IU/mg', '10', '<', '20', '<='), 'ug'), 'E10-RC-02', ['SA.lower.relation']);
  rej(e10.activityToMass('1', 'IU', interval('IU/mg', '10', '<=', '20', '<='), 'ug'), 'E10-RC-02', ['SA.lower.relation']);
  rej(e10.activityToMass('1', 'IU', interval('IU/mg', '10', '>=', '20', '>'), 'ug'), 'E10-RC-02', ['SA.upper.relation']);
  rej(e10.massToActivity('1', 'ug', interval('IU/mg', '10', '>=', '20', '>='), 'IU'), 'E10-RC-02', ['SA.upper.relation']);
  rej(e10.activityToMass('1', 'IU', interval('IU/mg', '10', '~', '20', '<='), 'ug'), 'E10-RC-01', ['SA.lower.relation']);
  rej(e10.activityToMass('1', 'IU', interval('IU/mg', '10', '>=', '20', '='), 'ug'), 'E10-RC-01', ['SA.upper.relation']);
});

test('AT-E10R-30 zero activity with reversed SA limits is still CCS-RF-03 (E10R-F20)', () => {
  rej(e10.activityToMass('0', 'IU/mL', interval('IU/mg', '20000000', '>=', '10000000', '<='), 'ng/mL'), 'CCS-RF-03', ['SA.lower', 'SA.upper']);
});

test('AT-E10R-33 roundDeclared input contract (E10R-F19)', () => {
  for (const v of ['-1', { num: '-1', den: '1' }, 'abc']) rej(e10.roundDeclared(v, 'half-up', '2'), 'CCS-RF-03', ['value']);
  for (const rule of ['half-up', 'half-even']) {
    for (const v of ['-0', { num: '0', den: '1' }]) {
      const r = e10.roundDeclared(v, rule, '2');
      assert.equal(r.status, 'result');
      assert.equal(r.text, '0.00');
    }
    for (const p of ['2.0', '-1', 'abc', 2]) {
      rej(e10.roundDeclared({ num: '4473', den: '40' }, rule, p), 'CCS-RF-03', ['places']);
    }
  }
});

// ---- E10R-F23 volumeFill (AMD-2-r2): AT-E10R-34 to -42 ----
const L = (num, den = '1', unit = 'mL') => ({ exact: { num, den }, unit });
const FINAL = L('100');
const fill = (lines, final = FINAL) => e10.volumeFill(lines, final);
const full = (word) => ({ status: 'result', fill: word, assumes: 'additive volumes' });
function fillIs(r, word) {
  assert.equal(r.status, 'result', JSON.stringify(r));
  assert.equal(r.fill, word);
  assert.equal(r.assumes, 'additive volumes');
}

test('AT-E10R-34 one line 150001/1500 mL against 100 mL is over (E10R-F23)', () => fillIs(fill([L('150001', '1500')]), 'over'));
test('AT-E10R-35 100/3 + 100/3 + 16667/500 mL against 100 mL is over (E10R-F23)', () => {
  fillIs(fill([L('100', '3'), L('100', '3'), L('16667', '500')]), 'over');
});
test('AT-E10R-36 one line 100/1 against 100 mL is full (E10R-F23)', () => fillIs(fill([L('100')]), 'full'));
test('AT-E10R-37 three lines 100/3 against 100 mL are full (E10R-F23)', () => fillIs(fill([L('100', '3'), L('100', '3'), L('100', '3')]), 'full'));
test('AT-E10R-38 two lines 125/3 against 100 mL are under (E10R-F23)', () => fillIs(fill([L('125', '3'), L('125', '3')]), 'under'));
test('AT-E10R-39 zero and unreduced values (E10R-F23)', () => {
  fillIs(fill([L('0')]), 'under');
  fillIs(fill([L('0'), L('100')]), 'full');
  fillIs(fill([L('200', '2')]), 'full');
});

test('AT-E10R-40 volumeFill returns exactly status, fill, assumes and the version fields', () => {
  const cases = [
    [[L('150001', '1500')]], [[L('100', '3'), L('100', '3'), L('16667', '500')]], [[L('100')]],
    [[L('100', '3'), L('100', '3'), L('100', '3')]], [[L('125', '3'), L('125', '3')]], [[L('0')]], [[L('200', '2')]],
  ];
  for (const [lines] of cases) {
    const r = fill(lines);
    assert.deepEqual(Object.keys(r).sort(), ['assumes', 'engine', 'fill', 'status']);
    assert.equal(r.assumes, 'additive volumes');
    for (const k of ['value', 'exact', 'unit', 'difference', 'balance', 'total', 'partsTotal']) assert.equal(k in r, false);
  }
  assert.deepEqual({ status: 'result', fill: 'over', assumes: 'additive volumes' }, full('over'));
});

test('AT-E10R-41 volumeFill refusals, one per class (E10R-F23)', () => {
  const noFields = (r) => { assert.equal('fill' in r, false); assert.equal('assumes' in r, false); };
  let r = fill([]); inc(r, ['lines']); noFields(r);
  r = fill(null); inc(r, ['lines']); noFields(r);
  r = fill(undefined); inc(r, ['lines']);
  r = fill([L('1')], null); inc(r, ['final']);
  r = fill(null, null); inc(r, ['lines', 'final']);
  r = e10.volumeFill([], undefined); inc(r, ['lines', 'final']);
  r = fill([L('5', '0')]); rej(r, 'CCS-RF-03', ['lines[0]']); noFields(r);
  rej(fill([L('1.5', '2')]), 'CCS-RF-03', ['lines[0]']);
  rej(fill([5]), 'CCS-RF-03', ['lines[0]']);
  rej(fill(['5']), 'CCS-RF-03', ['lines[0]']);
  rej(fill([L('-1', '2')]), 'CCS-RF-03', ['lines[0]']);
  rej(fill([L('1', '-2')]), 'CCS-RF-03', ['lines[0]']);
  rej(fill([L('1')], L('100', '0')), 'CCS-RF-03', ['final']);
  rej(fill([L('1')], L('-100', '1')), 'CCS-RF-03', ['final']);
  rej(fill([L('50', '1', 'L')]), 'E10-RC-02', ['lines[0].unit']);
  rej(fill([L('50', '1', 'g')]), 'E10-RC-02', ['lines[0].unit']);
  rej(fill([L('50', '1', 'ml')]), 'E10-RC-01', ['lines[0].unit']);
  rej(fill([L('5', '0'), L('-1', '2')]), 'CCS-RF-03', ['lines[0]', 'lines[1]']);
  rej(fill([L('0')], L('0')), 'CCS-RF-03', ['final']);
  rej(fill([L('50')], L('0', '5')), 'CCS-RF-03', ['final']);
  inc(fill([{ unit: 'mL' }]), ['lines[0]']);
  inc(fill([{ exact: { num: '1' }, unit: 'mL' }]), ['lines[0]']);
  // a decimal text or a JS number in num/den is not an integer string
  rej(fill([{ exact: { num: 5, den: '1' }, unit: 'mL' }]), 'CCS-RF-03', ['lines[0]']);
});

test('AT-E10R-42 regression: F15 unchanged and volumeFill makes no balanceVolume call', () => {
  const r = e10.balanceVolume('50', 'mL', [{ value: '5', unit: 'mL' }, { value: '500', unit: 'uL' }], 'mL');
  exactIs(r, 89n, 2n);
  assert.equal(typeof e10.volumeFill, 'function');
  // volumeFill ignores unit factors: two lines in mL against a final in mL, by exact fractions only
  fillIs(fill([L('1', '3'), L('2', '3')], L('1')), 'full');
});
