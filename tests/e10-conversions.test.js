// E10 conversions (E10C-F03 to E10C-F12): tests written from docs/engine-spec-e10-conversions.md only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { e9, e10 } from '../src/index.js';

const disp = e9.display;
// exact equality by cross-multiplication with the spec rational n/d
function exactIs(res, n, d = 1n) {
  assert.equal(res.status, 'result', JSON.stringify(res));
  const a = BigInt(res.exact.num);
  const b = BigInt(res.exact.den);
  assert.ok(b > 0n);
  assert.equal(a * BigInt(d), BigInt(n) * b);
}
const rej = (res, code, fields) => {
  assert.equal(res.status, 'rejected', JSON.stringify(res));
  assert.equal(res.code, code);
  assert.deepEqual(res.fields, fields);
  assert.deepEqual(res.indices, []);
  assert.equal('value' in res, false);
  assert.equal(res.engine.module, 'E10');
};
const E = (n, k) => BigInt(n) * 10n ** BigInt(k); // n x 10^k
const NA = 602214076n * 10n ** 15n;

// ---- AT-E10C-01 / AT-E10C-18: Examples 1 to 14 ----
test('Example 1 massToMolar 1 mg/mL, MW 150000 -> uM (E10C-F04)', () => {
  const r = e10.massToMolar('1', 'mg/mL', '150000', 'uM');
  exactIs(r, 20n, 3n);
  assert.equal(r.unit, 'uM');
  assert.equal(disp('sci3', r.exact), '6.67 × 10^0');
});

test('Example 2 molarToMass 50 nM, MW 25000 -> ug/mL (E10C-F05)', () => {
  const r = e10.molarToMass('50', 'nM', '25000', 'ug/mL');
  exactIs(r, 125n, 100n);
  assert.equal(r.unit, 'ug/mL');
  assert.equal(disp('sci3', r.exact), '1.25 × 10^0');
});

test('Example 3 massToCopies 1 ng, MW 3250000 (E10C-F10), exact 2408856304/13', () => {
  const r = e10.massToCopies('1', 'ng', '3250000', 'copies');
  assert.deepEqual(r.exact, { num: '2408856304', den: '13' });
  assert.equal(r.unit, 'copies');
  assert.equal(disp('sci3', r.exact), '1.85 × 10^8');
  assert.equal(typeof r.value, 'number');
});

test('Example 4 scaleUnit (E10C-F03)', () => {
  let r = e10.scaleUnit('2.5', 'ug/uL', 'g/L');
  exactIs(r, 5n, 2n);
  assert.equal(disp('sci3', r.exact), '2.50 × 10^0');
  r = e10.scaleUnit('2.5', 'ug/uL', 'mg/mL');
  exactIs(r, 5n, 2n);
  r = e10.scaleUnit('2', 'uM', 'nM');
  exactIs(r, 2000n);
  assert.equal(disp('sci3', r.exact), '2.00 × 10^3');
  rej(e10.scaleUnit('1', 'g/L', 'M'), 'E10-RC-02', ['fromUnit', 'toUnit']);
});

test('Example 5 amountFromConcentration then massToCopies (E10C-F12, F10)', () => {
  const a = e10.amountFromConcentration('10', 'ng/uL', '2', 'uL', 'ng');
  exactIs(a, 20n);
  assert.equal(disp('sig3', a.exact), '20.0');
  const r = e10.massToCopies('20', 'ng', '3250000', 'copies');
  exactIs(r, 48177126080n, 13n);
  assert.equal(disp('sci3', r.exact), '3.71 × 10^9');
});

test('Example 6 molesToCopies 1 pmol (E10C-F08)', () => {
  const r = e10.molesToCopies('1', 'pmol', 'copies');
  exactIs(r, 602214076000n);
  assert.equal(disp('sci3', r.exact), '6.02 × 10^11');
});

test('Example 7 copiesToMoles 1e12 -> pmol (E10C-F09)', () => {
  const r = e10.copiesToMoles('1000000000000', 'pmol');
  exactIs(r, 250000000n, 150553519n);
  assert.equal(disp('sig3', r.exact), '1.66');
});

test('Example 8 massToMoles and molesToMass (E10C-F06, F07)', () => {
  const a = e10.massToMoles('5', 'ug', '25000', 'pmol');
  exactIs(a, 200n);
  assert.equal(disp('sig3', a.exact), '200');
  const b = e10.molesToMass('2', 'nmol', '25000', 'ug');
  exactIs(b, 50n);
  assert.equal(disp('sig3', b.exact), '50.0');
});

test('Example 9 amountFromConcentration molar (E10C-F12)', () => {
  const r = e10.amountFromConcentration('50', 'nM', '100', 'uL', 'pmol');
  exactIs(r, 5n);
  assert.equal(disp('sig3', r.exact), '5.00');
});

test('Example 10 exact tie scaleUnit 1.005 ug/mL -> mg/mL', () => {
  const r = e10.scaleUnit('1.005', 'ug/mL', 'mg/mL');
  exactIs(r, 1005n, 1000000n);
  assert.equal(disp('sig3', r.exact), '0.00101');
  assert.equal(disp('sci3', r.exact), '1.01 × 10^-3');
});

test('Example 11 non-terminating near-ties through MW', () => {
  const a = e10.massToMolar('221', 'mg/mL', '220000', 'mM');
  exactIs(a, 221n, 220n);
  assert.equal(disp('sci3', a.exact), '1.00 × 10^0');
  const b = e10.massToMolar('199', 'mg/mL', '198000', 'mM');
  exactIs(b, 199n, 198n);
  assert.equal(disp('sci3', b.exact), '1.01 × 10^0');
});

test('Example 12 smallest units', () => {
  let r = e10.molesToCopies('1', 'amol', 'copies');
  exactIs(r, 150553519n, 250n);
  assert.equal(disp('sci3', r.exact), '6.02 × 10^5');
  r = e10.scaleUnit('1', 'fM', 'M');
  exactIs(r, 1n, E(1, 15));
  assert.equal(disp('sci3', r.exact), '1.00 × 10^-15');
  r = e10.scaleUnit('1', 'fM', 'pM');
  exactIs(r, 1n, 1000n);
  assert.equal(disp('sci3', r.exact), '1.00 × 10^-3');
  r = e10.scaleUnit('1', 'amol', 'mol');
  exactIs(r, 1n, E(1, 18));
});

test('Example 13 copiesToMass (E10C-F11)', () => {
  const r = e10.copiesToMass('602214076000000', '150000', 'ug');
  exactIs(r, 150n);
  assert.equal(r.unit, 'ug');
  assert.equal(disp('sig3', r.exact), '150');
});

test('Example 14 "-0" text is zero, status result, 0/1', () => {
  const r = e10.scaleUnit('-0', 'mg/mL', 'g/L');
  assert.equal(r.status, 'result');
  assert.equal(Object.is(r.value, 0), true);
  assert.deepEqual(r.exact, { num: '0', den: '1' });
  assert.equal(disp('sig3', r.exact), '0');
});

test('carry row: 9.995 rounds to 1.00 x 10^1 (AT-E10C-18)', () => {
  const r = e10.scaleUnit('9.995', 'g/L', 'g/L');
  assert.equal(disp('sci3', r.exact), '1.00 × 10^1');
});

// ---- AT-E10C-02 / -03 ----
test('AT-E10C-02 every unit to its base and back (round trip exact)', () => {
  // AT-E10R-13: the activity dimensions are table units now; their nominal bases (IU/L, IU/g...) are not tokens, so a token of the dimension stands in
  const bases = { massConc: 'g/L', molarConc: 'M', mass: 'g', amount: 'mol', copies: 'copies', volume: 'L', actIU: 'IU', actU: 'U', actConcIU: 'IU/mL', actConcU: 'U/mL', saIU: 'IU/mg', saU: 'U/mg' };
  for (const [dim, units] of Object.entries(e10.UNITS)) {
    for (const u of units) {
      const there = e10.scaleUnit('7', u, bases[dim]);
      // the base value is 7 x f(u): check through the rational (cross-multiplication)
      const one = e10.scaleUnit('1', u, bases[dim]);
      assert.equal(BigInt(there.exact.num) * BigInt(one.exact.den), 7n * BigInt(one.exact.num) * BigInt(there.exact.den));
    }
  }
  // factors as the section 3 table
  const f = (u, v = 'g/L') => e10.scaleUnit('1', u, v).exact;
  assert.deepEqual(f('ug/mL'), { num: '1', den: '1000' });
  assert.deepEqual(f('ng/uL'), { num: '1', den: '1000' });
  assert.deepEqual(f('ng/mL'), { num: '1', den: '1000000' });
  assert.deepEqual(f('pg/uL'), { num: '1', den: '1000000' });
  assert.deepEqual(f('fM', 'M'), { num: '1', den: E(1, 15).toString() });
  assert.deepEqual(f('amol', 'mol'), { num: '1', den: E(1, 18).toString() });
  assert.deepEqual(f('fg', 'g'), { num: '1', den: E(1, 15).toString() });
  assert.deepEqual(f('mL', 'L'), { num: '1', den: '1000' });
  assert.deepEqual(e10.scaleUnit('1', 'uL', 'L').exact, { num: '1', den: '1000000' });
});

test('AT-E10C-02 round trip through scaleUnit returns the input exactly', () => {
  const fwd = e10.scaleUnit('3.7', 'ng/uL', 'ng/mL'); // x 1000
  exactIs(fwd, 3700n);
  const back = e10.scaleUnit('3700', 'ng/mL', 'ng/uL');
  exactIs(back, 37n, 10n);
});

test('AT-E10C-03 g/L, mg/mL, ug/uL identical', () => {
  for (const [a, b] of [['g/L', 'mg/mL'], ['mg/mL', 'ug/uL'], ['ug/uL', 'g/L']]) {
    exactIs(e10.scaleUnit('12.5', a, b), 125n, 10n);
  }
});

// ---- AT-E10C-04 zero and "-0" in every function ----
test('AT-E10C-04 zero and "-0" return 0/1 in E10C-F03 to F12', () => {
  for (const z of ['0', '-0', '0.0']) {
    const calls = [
      e10.scaleUnit(z, 'mg/mL', 'g/L'),
      e10.massToMolar(z, 'mg/mL', '150000', 'uM'),
      e10.molarToMass(z, 'nM', '25000', 'ug/mL'),
      e10.massToMoles(z, 'ug', '25000', 'pmol'),
      e10.molesToMass(z, 'nmol', '25000', 'ug'),
      e10.molesToCopies(z, 'pmol', 'copies'),
      e10.copiesToMoles(z, 'pmol'),
      e10.massToCopies(z, 'ng', '3250000', 'copies'),
      e10.copiesToMass(z, '150000', 'ug'),
      e10.amountFromConcentration(z, 'ng/uL', '2', 'uL', 'ng'),
    ];
    for (const r of calls) {
      assert.equal(r.status, 'result');
      assert.equal(Object.is(r.value, 0), true);
      assert.deepEqual(r.exact, { num: '0', den: '1' });
    }
  }
});

// ---- AT-E10C-05 / -06 / -07: unit refusals ----
test('AT-E10C-05 scaleUnit across dimensions; same-dimension control', () => {
  const r = e10.scaleUnit('1', 'g/L', 'M');
  rej(r, 'E10-RC-02', ['fromUnit', 'toUnit']);
  assert.match(r.message, /molecular weight/);
  rej(e10.scaleUnit('1', 'mol', 'g'), 'E10-RC-02', ['fromUnit', 'toUnit']);
  const c = e10.scaleUnit('1', 'mL', 'L');
  assert.equal(c.status, 'result');
  assert.equal(c.value, 0.001);
  assert.deepEqual(c.exact, { num: '1', den: '1000' });
  assert.equal(c.unit, 'L');
});

test('AT-E10C-06 unknown units are E10-RC-01 naming only the unknown fields', () => {
  for (const bad of ['mg/ml', 'MM', 'mg / mL', 'µM', 'kg', 'kDa', 'copies/uL', 'kcopies', 'ug/ML']) {
    rej(e10.massToMolar('1', bad, '150000', 'uM'), 'E10-RC-01', ['unit']);
    rej(e10.massToMolar('1', 'mg/mL', '150000', bad), 'E10-RC-01', ['toUnit']);
    rej(e10.scaleUnit('1', bad, 'g/L'), 'E10-RC-01', ['fromUnit']);
    rej(e10.scaleUnit('1', 'g/L', bad), 'E10-RC-01', ['toUnit']);
  }
  rej(e10.scaleUnit('1', 'mg/ml', 'MM'), 'E10-RC-01', ['fromUnit', 'toUnit']);
  // one unknown, other known and of another dimension: only the unknown is named, RC-01 first
  rej(e10.scaleUnit('1', 'mg/ml', 'M'), 'E10-RC-01', ['fromUnit']);
});

test('AT-E10C-07 wrong-dimension unit and toUnit', () => {
  rej(e10.massToMolar('1', 'nM', '150000', 'uM'), 'E10-RC-02', ['unit']);
  rej(e10.massToMoles('1', 'mol', '150000', 'pmol'), 'E10-RC-02', ['unit']);
  rej(e10.massToMolar('1', 'mg/mL', '150000', 'mg/mL'), 'E10-RC-02', ['toUnit']);
  rej(e10.massToMolar('1', 'uM', '150000', 'mg/mL'), 'E10-RC-02', ['unit', 'toUnit']);
  rej(e10.molarToMass('1', 'M', '10', 'M'), 'E10-RC-02', ['toUnit']);
  rej(e10.molesToMass('1', 'g', '10', 'g'), 'E10-RC-02', ['unit']);
  rej(e10.copiesToMoles('1', 'ng'), 'E10-RC-02', ['toUnit']);
  rej(e10.copiesToMass('1', '10', 'pmol'), 'E10-RC-02', ['toUnit']);
  rej(e10.molesToCopies('1', 'ng', 'copies'), 'E10-RC-02', ['unit']);
});

test('AT-E10C-20 and -21 massToCopies toUnit (AT-E10C-21: kcopies is unknown, E10-RC-01)', () => {
  rej(e10.massToCopies('1', 'ng', '3250000', 'mol'), 'E10-RC-02', ['toUnit']);
  rej(e10.massToCopies('1', 'ng', '3250000', 'kcopies'), 'E10-RC-01', ['toUnit']);
  rej(e10.molesToCopies('1', 'pmol', 'ng'), 'E10-RC-02', ['toUnit']);
  rej(e10.molesToCopies('1', 'pmol', 'kcopies'), 'E10-RC-01', ['toUnit']);
});

test('AT-E10C-19 scaleUnit copies to copies is the identity', () => {
  const r = e10.scaleUnit('602214076', 'copies', 'copies');
  exactIs(r, 602214076n);
  assert.equal(r.unit, 'copies');
});

// ---- AT-E10C-08 MW ----
test('AT-E10C-08 MW null then 0, -5, abc, in the six MW functions', () => {
  const calls = {
    massToMolar: (mw) => e10.massToMolar('1', 'mg/mL', mw, 'uM'),
    molarToMass: (mw) => e10.molarToMass('1', 'nM', mw, 'ug/mL'),
    massToMoles: (mw) => e10.massToMoles('1', 'ug', mw, 'pmol'),
    molesToMass: (mw) => e10.molesToMass('1', 'nmol', mw, 'ug'),
    massToCopies: (mw) => e10.massToCopies('1', 'ng', mw, 'copies'),
    copiesToMass: (mw) => e10.copiesToMass('1', mw, 'ug'),
  };
  for (const f of Object.values(calls)) {
    const n = f(null);
    assert.equal(n.status, 'incomplete');
    assert.deepEqual(n.missing, ['MW']);
    for (const bad of ['0', '-5', 'abc']) rej(f(bad), 'CCS-RF-03', ['MW']);
  }
});

// ---- E10C-IN-01 (KAITO-2026-11-10-06): numeric inputs are decimal text only ----
test('E10C-IN-01 a JS number in each numeric argument is rejected CCS-RF-03 naming the field', () => {
  const N = 5;
  rej(e10.scaleUnit(N, 'g/L', 'g/L'), 'CCS-RF-03', ['value']);
  rej(e10.massToMolar(N, 'mg/mL', '1', 'uM'), 'CCS-RF-03', ['c']);
  rej(e10.massToMolar('1', 'mg/mL', N, 'uM'), 'CCS-RF-03', ['MW']);
  rej(e10.molarToMass(N, 'nM', '1', 'ug/mL'), 'CCS-RF-03', ['c']);
  rej(e10.molarToMass('1', 'nM', N, 'ug/mL'), 'CCS-RF-03', ['MW']);
  rej(e10.massToMoles(N, 'ug', '1', 'pmol'), 'CCS-RF-03', ['m']);
  rej(e10.massToMoles('1', 'ug', N, 'pmol'), 'CCS-RF-03', ['MW']);
  rej(e10.molesToMass(N, 'nmol', '1', 'ug'), 'CCS-RF-03', ['n']);
  rej(e10.molesToMass('1', 'nmol', N, 'ug'), 'CCS-RF-03', ['MW']);
  rej(e10.molesToCopies(N, 'pmol', 'copies'), 'CCS-RF-03', ['n']);
  rej(e10.copiesToMoles(N, 'pmol'), 'CCS-RF-03', ['N']);
  rej(e10.massToCopies(N, 'ng', '1', 'copies'), 'CCS-RF-03', ['m']);
  rej(e10.massToCopies('1', 'ng', N, 'copies'), 'CCS-RF-03', ['MW']);
  rej(e10.copiesToMass(N, '1', 'ug'), 'CCS-RF-03', ['N']);
  rej(e10.copiesToMass('1', N, 'ug'), 'CCS-RF-03', ['MW']);
  rej(e10.amountFromConcentration(N, 'ng/uL', '1', 'uL', 'ng'), 'CCS-RF-03', ['c']);
  rej(e10.amountFromConcentration('1', 'ng/uL', N, 'uL', 'ng'), 'CCS-RF-03', ['V']);
  // both numeric arguments non-text: both named, in argument order
  rej(e10.massToMolar(N, 'mg/mL', N, 'uM'), 'CCS-RF-03', ['c', 'MW']);
});

test('E10C-IN-01 a bigint, a boolean and an object are rejected CCS-RF-03', () => {
  rej(e10.massToMolar(5n, 'mg/mL', '1', 'uM'), 'CCS-RF-03', ['c']);
  rej(e10.copiesToMoles(5n, 'pmol'), 'CCS-RF-03', ['N']);
  rej(e10.scaleUnit(true, 'g/L', 'g/L'), 'CCS-RF-03', ['value']);
  rej(e10.massToCopies('1', 'ng', false, 'copies'), 'CCS-RF-03', ['MW']);
  rej(e10.molesToMass({}, 'nmol', '1', 'ug'), 'CCS-RF-03', ['n']);
});

test('E10C-IN-01 a non-text number does not change the order of statuses', () => {
  const a = e10.massToMolar(5, 'mg/mL', null, 'uM');
  assert.equal(a.status, 'incomplete');
  assert.deepEqual(a.missing, ['MW']);
  rej(e10.massToMolar(5, 'mg/ml', '1', 'uM'), 'E10-RC-01', ['unit']);
  rej(e10.massToMolar(5, 'nM', '1', 'uM'), 'E10-RC-02', ['unit']);
});

// ---- AT-E10C-09 / -10 ----
test('AT-E10C-09 negative and non-plain values name the field', () => {
  for (const bad of ['-1', '2e5', '1,5', 'NaN', '5 mg']) {
    rej(e10.scaleUnit(bad, 'g/L', 'g/L'), 'CCS-RF-03', ['value']);
    rej(e10.massToMolar(bad, 'mg/mL', '1', 'uM'), 'CCS-RF-03', ['c']);
    rej(e10.molarToMass(bad, 'nM', '1', 'ug/mL'), 'CCS-RF-03', ['c']);
    rej(e10.massToMoles(bad, 'ug', '1', 'pmol'), 'CCS-RF-03', ['m']);
    rej(e10.molesToMass(bad, 'nmol', '1', 'ug'), 'CCS-RF-03', ['n']);
    rej(e10.molesToCopies(bad, 'pmol', 'copies'), 'CCS-RF-03', ['n']);
    rej(e10.copiesToMoles(bad, 'pmol'), 'CCS-RF-03', ['N']);
    rej(e10.massToCopies(bad, 'ng', '1', 'copies'), 'CCS-RF-03', ['m']);
    rej(e10.copiesToMass(bad, '1', 'ug'), 'CCS-RF-03', ['N']);
    rej(e10.amountFromConcentration(bad, 'ng/uL', '1', 'uL', 'ng'), 'CCS-RF-03', ['c']);
  }
});

test('AT-E10C-10 amountFromConcentration V = 0 and V < 0', () => {
  rej(e10.amountFromConcentration('10', 'ng/uL', '0', 'uL', 'ng'), 'CCS-RF-03', ['V']);
  rej(e10.amountFromConcentration('10', 'ng/uL', '-2', 'uL', 'ng'), 'CCS-RF-03', ['V']);
});

// ---- AT-E10C-11 / -12: order of statuses ----
test('AT-E10C-11 bad c and MW = 0 together; null plus bad value', () => {
  rej(e10.massToMolar('-1', 'mg/mL', '0', 'uM'), 'CCS-RF-03', ['c', 'MW']);
  const r = e10.massToMolar(null, 'mg/mL', '0', 'uM');
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.missing, ['c']);
  const r2 = e10.massToMolar('', 'mg/mL', null, '  ');
  assert.deepEqual(r2.missing, ['c', 'MW', 'toUnit']);
  rej(e10.amountFromConcentration('-1', 'ng/uL', '0', 'uL', 'ng'), 'CCS-RF-03', ['c', 'V']);
});

test('AT-E10C-12 unit refusal beats value refusal; RC-01 beats RC-02', () => {
  rej(e10.massToMolar('-1', 'mg/ml', '0', 'uM'), 'E10-RC-01', ['unit']);
  rej(e10.massToMolar('2e5', 'nM', '150000', 'uM'), 'E10-RC-02', ['unit']);
  rej(e10.massToMolar('2e5', 'mg/mL', '150000', 'kDa'), 'E10-RC-01', ['toUnit']);
  rej(e10.massToMolar('1', 'nM', '150000', 'MM'), 'E10-RC-01', ['toUnit']);
});

// ---- ruling 4: amountFromConcentration fields ----
test('amountFromConcentration E10-RC-02 fields (ruling KAITO-2026-11-10-04)', () => {
  rej(e10.amountFromConcentration('10', 'ng', '2', 'uL', 'ng'), 'E10-RC-02', ['unit']);
  rej(e10.amountFromConcentration('10', 'ng', '2', 'g', 'ng'), 'E10-RC-02', ['unit', 'Vunit']);
  rej(e10.amountFromConcentration('10', 'ng/uL', '2', 'uL', 'pmol'), 'E10-RC-02', ['toUnit']);
  rej(e10.amountFromConcentration('10', 'ng/uL', '2', 'g', 'pmol'), 'E10-RC-02', ['Vunit', 'toUnit']);
  rej(e10.amountFromConcentration('10', 'ng', '2', 'uL', 'L'), 'E10-RC-02', ['unit']);
  rej(e10.amountFromConcentration('10', 'nM', '2', 'uL', 'ng'), 'E10-RC-02', ['toUnit']);
  // unknown units: RC-01 first
  rej(e10.amountFromConcentration('10', 'ng/ul', '2', 'g', 'xx'), 'E10-RC-01', ['unit', 'toUnit']);
});

// ---- AT-E10C-13: chain consistency and round trips on exact values ----
test('AT-E10C-13 massToCopies equals massToMoles then molesToCopies (exact rational)', () => {
  const m2m = e10.massToMoles('1', 'ng', '3250000', 'mol'); // 1e-9 / 3.25e6 mol
  const chain = e10.massToCopies('1', 'ng', '3250000', 'copies');
  // copies = mol x N_A, by cross-multiplication on the exact rationals
  assert.equal(BigInt(chain.exact.num) * BigInt(m2m.exact.den), BigInt(m2m.exact.num) * NA * BigInt(chain.exact.den));
});

test('AT-E10C-13 copiesToMass of a terminating copies input returns the input mass', () => {
  exactIs(e10.copiesToMass('602214076000000', '150000', 'ug'), 150n);
  exactIs(e10.massToCopies('150', 'ug', '150000', 'copies'), 602214076000000n);
});

// ---- AT-E10C-14: non-integer copies ----
test('AT-E10C-14 non-integer copies are returned as is', () => {
  const r = e10.copiesToMoles('1.5', 'pmol');
  assert.equal(r.status, 'result');
  exactIs(r, 15n * 10n ** 12n, 10n * NA);
  const s = e10.copiesToMass('0.5', '100', 'g');
  assert.equal(s.status, 'result');
  exactIs(s, 100n, 2n * NA);
});

// ---- AT-E10C-17: determinism, N_A ----
test('AT-E10C-17 deterministic; N_A = 602214076 x 10^15', () => {
  const a = e10.massToCopies('1', 'ng', '3250000', 'copies');
  const b = e10.massToCopies('1', 'ng', '3250000', 'copies');
  assert.deepEqual(a, b);
  exactIs(e10.molesToCopies('1', 'mol', 'copies'), NA);
});

// ---- incomplete (E10C-F03 to F12) and the engine block ----
test('incomplete lists every missing argument in argument order, nothing else evaluated', () => {
  let r = e10.scaleUnit(null, undefined, '');
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.missing, ['value', 'fromUnit', 'toUnit']);
  r = e10.amountFromConcentration(null, 'bogus', null, 'bogus', null);
  assert.deepEqual(r.missing, ['c', 'V', 'toUnit']);
  r = e10.copiesToMoles(null, null);
  assert.deepEqual(r.missing, ['N', 'toUnit']);
  r = e10.copiesToMass('1', null, null);
  assert.deepEqual(r.missing, ['MW', 'toUnit']);
});

test('every result and refusal carries the E10 engine block', () => {
  for (const r of [e10.scaleUnit('1', 'mL', 'L'), e10.scaleUnit('1', 'x', 'L'), e10.scaleUnit(null, 'mL', 'L'), e10.scaleUnit('-1', 'mL', 'L')]) {
    assert.equal(r.engine.module, 'E10');
    assert.equal(r.engine.package, '@ligant/bench-engines');
    assert.equal(r.engine.moduleVersion, e10.MODULE_VERSION);
  }
});

// ---- E10C-NF-01: existing functions unchanged ----
test('strengthFactor and splitVolumes behaviour unchanged', () => {
  const s = e10.strengthFactor('2');
  assert.equal(s.status, 'result');
  assert.equal(s.f, 2);
  const v = e10.splitVolumes('10', '4');
  assert.equal(v.Vtr, 2.5);
  assert.equal(v.Vmedium, 7.5);
});

// pending erratum (ADC-2026-11-10-01): AT-E10C-15, AT-E10C-16, E10C-NF-01/NF-05 version expectations. No test.
