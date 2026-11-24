// E20 slice D: purity, determinism, isolation, the numeric object everywhere, the withheld
// reasons together, and the printed-exact pairs (AT-E20L-05, -09, -10, -11, -14, -15, -17,
// -18, -19, -21). Expected values are worked by hand from the specification text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import * as e20 from '../src/e20/index.js';
import { holdsNumber } from './e20-name-scanner.js';

const TYPED = { form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' };
const KM_MG = { form: 'km', K: '5', KSource: 's', M: '3', Munit: 'mg', MSource: 's' };
const RANGE = { form: 'declared', low: '50', high: '200', source: 's' };
const SUIT = {
  sampleCV: { value: '3', max: '5', source: 's' },
  spikeCV: { value: '4', max: '5', source: 's' },
  recovery: { B: '12', A: '2', added: '10', basis: 'as-measured', range: RANGE },
};
const f05 = (over = {}) => {
  const a = {
    limit: TYPED, technique: 'chromogenic', c: null, cUnit: null, lambda: '0.05', highest: '5', DF: '4',
    q: '=', value: '0.8', reagent: 'lal', suit: SUIT, ...over,
  };
  return e20.assessResult(a.limit, a.technique, a.c, a.cUnit, a.lambda, a.highest, a.DF, a.q, a.value, a.reagent, a.suit);
};
const curves = () => [
  { lambda: '0.05', r: '-0.99', channels: [{ DF: '1', recovery: '100' }, { DF: '5', recovery: '40' }, { DF: '20', recovery: '100' }] },
  { lambda: '0.02', channels: [{ DF: '2', recovery: '90' }, { DF: '2.0', recovery: '9' }, { DF: '30', recovery: '90' }] },
];

// A broad set of argument lists, each with a result or a refusal, for the walks below.
const CALLS = () => [
  [e20.listPresets, []],
  [e20.formatThreeFigures, ['1234.5']],
  [e20.formatThreeFigures, [{ num: '-1', den: '3' }]],
  [e20.formatThreeFigures, [7]],
  [e20.resolveLimit, [KM_MG]],
  [e20.resolveLimit, [{ form: 'km', K: '1', KSource: 's', M: '3', Munit: 'mL', MSource: 's' }]],
  [e20.resolveLimit, [{ form: 'preset', presetId: 'preset-2', M: '7', Munit: 'Unit', MSource: 's' }]],
  [e20.resolveLimit, [null]],
  [e20.mvdFromLimit, [KM_MG, 'turbidimetric', '2', 'mg/mL', '0.03']],
  [e20.mvdFromLimit, [KM_MG, 'gel-clot', '2', 'Units/mL', '0.03']],
  [e20.checkDilution, ['10.001', { num: '10', den: '1' }]],
  [e20.checkDilution, ['2', { num: '1', den: '3' }]],
  [e20.assessSuitability, [SUIT]],
  [e20.assessSuitability, [null]],
  [e20.assessSuitability, [{ ...SUIT, recovery: { ...SUIT.recovery, B: '5001', A: '0', added: '10000' } }]],
  [f05, []],
  [f05, [{ q: '<', value: '0.5001', highest: null, reagent: null, suit: null }]],
  [f05, [{ limit: KM_MG, c: '2', cUnit: 'mg/mL', DF: '30' }]],
  [e20.screenDilutions, [TYPED, null, null, RANGE, { form: 'preset', presetId: 'preset-5' }, curves()]],
  [e20.screenDilutions, [null, null, null, { form: 'preset', presetId: 'preset-4' }, null, curves().slice(1)]],
  [e20.screenDilutions, [KM_MG, '2', 'mg/mL', RANGE, { form: 'declared', value: '0.5', source: 's' }, curves()]],
  [e20.screenDilutions, [TYPED, null, null, null, null, []]],
  [e20.checkRecordDates, ['2026-05-02', '2026-05-01', '2026-02-30']],
  [e20.checkRecordDates, [3]],
].map(([fn, args]) => (fn === f05 ? [fn, args, true] : [fn, args, false]));

const callOf = ([fn, args, viaHelper]) => (viaHelper ? f05(...args) : fn(...args));

test('E20L-NF-04 same call twice gives deeply equal, separate results; the arguments are not changed', () => {
  for (const entry of CALLS()) {
    const before = structuredClone(entry[1]);
    const first = callOf(entry);
    assert.deepEqual(entry[1], before, entry[0].name);
    const second = callOf(entry);
    assert.deepEqual(second, first, entry[0].name);
    assert.notEqual(second, first);
    assert.deepEqual(entry[1], before, entry[0].name);
  }
});

test('E20L-NF-04 changing a returned object changes no later result', () => {
  const entry = CALLS().find((e) => e[0] === e20.screenDilutions);
  const first = callOf(entry);
  const copy = structuredClone(first);
  first.curves[0].channels[0].listed = 'changed';
  first.curves.length = 0;
  first.engine.module = 'x';
  assert.deepEqual(callOf(entry), copy);
  const pre = e20.listPresets();
  pre.presets[0].value.exact.num = '999';
  pre.presets.pop();
  assert.equal(e20.listPresets().presets.length, 5);
  assert.equal(e20.listPresets().presets[0].value.exact.num, '5');
});

test('E20L-NF-07 F07 keeps no state: calls of F07 and F05 interleaved give the same results as alone', () => {
  const args = () => [TYPED, null, null, RANGE, { form: 'preset', presetId: 'preset-5' }, curves()];
  const alone = e20.screenDilutions(...args());
  const aloneF05 = f05();
  const other = e20.screenDilutions(null, null, null, { form: 'preset', presetId: 'preset-4' }, null, curves().slice(1));
  const mid = f05({ DF: '20' });
  assert.deepEqual(e20.screenDilutions(...args()), alone);
  assert.deepEqual(f05(), aloneF05);
  assert.deepEqual(e20.screenDilutions(null, null, null, { form: 'preset', presetId: 'preset-4' }, null, curves().slice(1)), other);
  assert.deepEqual(f05({ DF: '20' }), mid);
  assert.notDeepEqual(other, alone);
  assert.notDeepEqual(mid, aloneF05);
  // one curve screened alone equals the same curve inside a longer list: each curve is judged alone
  const solo = e20.screenDilutions(TYPED, null, null, RANGE, { form: 'preset', presetId: 'preset-5' }, [curves()[1]]);
  assert.deepEqual(solo.curves[0], alone.curves[1]);
});

test('E20L-NF-07 no value of F07 is accepted by another function, and F05 holds no reference to F07', () => {
  const screened = e20.screenDilutions(TYPED, null, null, RANGE, { form: 'preset', presetId: 'preset-5' }, curves());
  const first = screened.curves[0];
  assert.equal(e20.checkDilution('1', screened).status, 'rejected');
  assert.equal(e20.checkDilution('1', first.mvd).status, 'rejected'); // a numeric object is not an exact object
  assert.equal(e20.assessSuitability(screened).status, 'incomplete');
  assert.equal(e20.resolveLimit(screened).status, 'incomplete');
  assert.equal(e20.formatThreeFigures(first.mvd).status, 'rejected');
  assert.equal(e20.formatThreeFigures(screened).status, 'rejected');
  // changing what F07 would say changes nothing F05 says
  const before = f05();
  e20.screenDilutions(TYPED, null, null, RANGE, null, [{ lambda: '9', channels: [{ DF: '9', recovery: '9' }] }]);
  assert.deepEqual(f05(), before);
  const dir = new URL('../src/e20/', import.meta.url);
  for (const f of ['result.js', 'dilution.js', 'mvd.js', 'limit.js', 'suitability.js']) {
    assert.doesNotMatch(readFileSync(new URL(f, dir), 'utf8'), /from '\.\/screen\.js'|screenDilutions/, f);
  }
  assert.doesNotMatch(readFileSync(new URL('screen.js', dir), 'utf8'), /from '\.\/result\.js'|assessResult/);
});

test('E20L-NF-01 no result member, at any depth, is a JS number; every numeric object agrees with itself', () => {
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a < 0n ? -a : a; };
  const numericObjects = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      const keys = Object.keys(v);
      if (keys.join() === 'exact,decimal,fraction,display,unit') numericObjects.push(v);
      keys.forEach((k) => walk(v[k]));
    }
  };
  for (const entry of CALLS()) {
    const r = callOf(entry);
    assert.equal(holdsNumber(r), false, entry[0].name);
    assert.equal(r.engine.module, 'E20');
    walk(r);
  }
  assert.ok(numericObjects.length > 80);
  for (const n of numericObjects) {
    const num = BigInt(n.exact.num);
    const den = BigInt(n.exact.den);
    assert.ok(den > 0n);
    assert.equal(gcd(num < 0n ? -num : num, den) === 1n || num === 0n, true, n.fraction);
    if (num === 0n) assert.deepEqual(n.exact, { num: '0', den: '1' });
    assert.equal(n.fraction, `${n.exact.num}/${n.exact.den}`);
    assert.equal(n.display, e20.formatThreeFigures(n.exact).text, n.fraction);
    if (num === 0n) assert.equal(n.display, '0'); // exact zero prints 0, never -0
    assert.ok(n.unit === null || typeof n.unit === 'string');
    if (n.decimal !== null) {
      const [whole, part = ''] = n.decimal.split('.');
      const scaled = BigInt(whole + part);
      assert.equal(scaled * den, num * 10n ** BigInt(part.length), n.fraction);
      assert.equal(part.endsWith('0'), false);
    } else {
      assert.notEqual(den, 1n);
    }
  }
});

test('E20L-NF-03 non-terminating and long terminating values: decimal is null, fraction is present, nothing throws', () => {
  const third = e20.resolveLimit({ form: 'km', K: '1', KSource: 's', M: '3', Munit: 'mL', MSource: 's' });
  assert.equal(third.L.decimal, null);
  assert.equal(third.L.fraction, '1/3');
  assert.equal(third.L.display, '0.333');
  assert.deepEqual(third.L.exact, { num: '1', den: '3' });
  const half = e20.resolveLimit({ form: 'km', K: '1', KSource: 's', M: '8', Munit: 'mL', MSource: 's' });
  assert.equal(half.L.decimal, '0.125');
  const place = (k) => e20.resolveLimit({ form: 'km', K: '1', KSource: 's', M: (2n ** k).toString(), Munit: 'mL', MSource: 's' }).L;
  const at400 = place(400n);
  assert.equal(at400.decimal.length, 402); // "0." and 400 places
  assert.equal(at400.decimal.endsWith('5'), true);
  const at401 = place(401n);
  assert.equal(at401.decimal, null);
  assert.equal(at401.fraction, `1/${(2n ** 401n).toString()}`);
  assert.equal(place(1000n).decimal, null);
  assert.equal(e20.formatThreeFigures({ num: '1', den: (2n ** 401n).toString() }).status, 'result');
});

test('E20L-F08 the threshold at 1000 on the once-rounded value; negatives never take the exponent form', () => {
  const t = (v) => e20.formatThreeFigures(v).text;
  assert.equal(t('2.5'), '2.50');
  assert.equal(t('999'), '999');
  assert.equal(t('999.4'), '999');
  assert.equal(t('1000'), '1.00 × 10^3');
  assert.equal(t('999.5'), '1.00 × 10^3'); // rounds up to 1000 first
  assert.equal(t('12345'), '1.23 × 10^4');
  assert.equal(t('0'), '0');
  assert.equal(t('-0'), '0');
  assert.equal(t('0.000'), '0');
  assert.equal(t({ num: '-0', den: '5' }), '0');
  assert.equal(t('-999'), '-999');
  assert.equal(t('-1234'), '-1230');
  assert.equal(t('-12345'), '-12300');
  assert.equal(t('-0.5'), '-0.500');
  assert.equal(t('-0.0004'), '-0.000400');
});

test('E20L-F08 display of a numeric object is the F08 text of its exact value', () => {
  const l = e20.resolveLimit({ form: 'typed', value: '1234.5', unit: 'EU/mL', source: 's' }).L;
  assert.equal(l.display, '1.23 × 10^3');
  assert.equal(l.decimal, '1234.5');
  assert.equal(l.display, e20.formatThreeFigures('1234.5').text);
});

test('E20L-F05 the five withheld reasons: alone and together, in the fixed order', () => {
  const suits = [
    ['ok', SUIT, null],
    ['empty', null, 'suitability-not-entered'],
    ['partial', { sampleCV: { value: '3' } }, 'suitability-incomplete'],
    ['rejected', 'text', 'suitability-incomplete'],
    ['outside', { ...SUIT, sampleCV: { value: '6', max: '5', source: 's' } }, 'suitability-outside'],
  ];
  let count = 0;
  for (const above of [false, true]) {
    for (const rawOut of [false, true]) {
      for (const [, suit, token] of suits) {
        for (const reagent of ['rcr', null]) {
          const DF = above ? '20' : '4';
          const value = rawOut ? '0.1' : above ? '2' : '0.4'; // raw is 0.1 at both DF unless it is meant to be outside
          const r = f05({ DF, value, suit, reagent });
          const expected = [];
          if (above) expected.push('df-above-mvd');
          if (rawOut) expected.push('raw-reading-outside');
          if (token) expected.push(token);
          if (reagent === null) expected.push('reagent-not-selected');
          assert.equal(r.status, 'result');
          assert.deepEqual(r.withheld, expected, `${DF} ${value} ${token} ${reagent}`);
          assert.equal(r.relationLineShown, expected.length === 0);
          assert.equal('comparisonShown' in r, false);
          assert.equal(r.reagentType, reagent);
          // calculated values are present whether or not the comparison is withheld
          assert.equal(r.mvd.status, 'result');
          assert.ok(['below', 'equal', 'above'].includes(r.relation.state));
          assert.equal(r.sensitivity.unit, 'EU/mL');
          assert.deepEqual(r.suitability, e20.assessSuitability(suit));
          assert.deepEqual(r.suitabilityMissing,
            token === 'suitability-incomplete' ? (suit === 'text' ? ['suitability'] : ['suitability.sampleCV.max', 'suitability.sampleCV.source',
              'suitability.spikeCV.value', 'suitability.spikeCV.max', 'suitability.spikeCV.source', 'suitability.recovery.B',
              'suitability.recovery.A', 'suitability.recovery.added', 'suitability.recovery.basis', 'suitability.recovery.range.form']) : null);
          assert.deepEqual(r.suitabilityOutside, token === 'suitability-outside' ? ['sample-cv'] : null);
          count++;
        }
      }
    }
  }
  assert.equal(count, 40);
  // the raw reading reason never applies to the qualifier <
  const less = f05({ q: '<', highest: null, DF: '20', value: '0.001' });
  assert.equal(less.rawReading.applies, false);
  assert.deepEqual(less.withheld, ['df-above-mvd']);
});

test('E20L-F05 a suitability fault of any kind never refuses F05; the F06 object is returned unchanged', () => {
  const faulty = [
    { ...SUIT, recovery: { ...SUIT.recovery, B: '-1' } }, // negative reading
    { ...SUIT, recovery: { ...SUIT.recovery, range: { form: 'declared', low: '9', high: '1', source: 's' } } },
    { ...SUIT, recovery: { ...SUIT.recovery, basis: 'zzz' } }, // unknown string inside F06
    { ...SUIT, recovery: { ...SUIT.recovery, range: { form: 'preset', presetId: 'preset-5' } } },
    { ...SUIT, recovery: { ...SUIT.recovery, added: '0' } },
    { ...SUIT, spikeCV: 'x' },
    'text', 5, [], {},
  ];
  for (const suit of faulty) {
    const r = f05({ suit });
    assert.equal(r.status, 'result', JSON.stringify(suit));
    assert.deepEqual(r.suitability, e20.assessSuitability(suit));
    assert.equal(r.withheld.length > 0, true);
    assert.ok(r.withheld.includes('suitability-incomplete') || r.withheld.includes('suitability-not-entered'), JSON.stringify(suit));
    assert.equal(r.relationLineShown, false);
    assert.equal(r.mvd.status, 'result');
  }
  assert.deepEqual(f05({ suit: faulty[0] }).suitabilityMissing, ['suitability.recovery.B']);
  assert.deepEqual(f05({ suit: faulty[1] }).suitabilityMissing,
    ['suitability.recovery.range.low', 'suitability.recovery.range.high']);
  // a fault in F05's own arguments still refuses, and names no suitability field
  const own = f05({ DF: '0', suit: faulty[0] });
  assert.equal(own.status, 'rejected');
  assert.deepEqual(own.fields, ['DF']);
});

test('E20L-F05 the floor facts are independent of the withheld reasons (AT-E20L-21)', () => {
  const r = f05({ q: '<', value: '0.1', highest: null, reagent: null, suit: null }); // y = 0.05 x 4 = 0.2
  assert.equal(r.relationKind, 'upper-bound');
  assert.equal(r.floorDiffers, true);
  assert.equal(r.floorPrintExact, false);
  assert.equal(r.relationLineShown, false);
  assert.deepEqual(r.withheld, ['suitability-not-entered', 'reagent-not-selected']);
  assert.equal(r.inLimitUnit.role, 'floor');
  const same = f05({ q: '<', value: '0.2', highest: null });
  assert.equal(same.floorDiffers, false);
  assert.equal(same.floorPrintExact, false);
  const eq = f05();
  assert.equal(eq.floorDiffers, null);
  assert.equal(eq.floorPrintExact, null);
  assert.equal(eq.relationKind, 'measured');
});

test('E20L-F05 the reagent token never changes a number (AT-E20L-09)', () => {
  const strip = (r) => { const { withheld, relationLineShown, reagentType, ...rest } = r; return rest; };
  const base = strip(f05({ reagent: 'lal' }));
  for (const t of ['rcr', 'rfc', null, undefined, '']) assert.deepEqual(strip(f05({ reagent: t })), base, String(t));
  const lessBase = strip(f05({ q: '<', highest: null, reagent: 'lal' }));
  for (const t of ['rcr', 'rfc', null]) assert.deepEqual(strip(f05({ q: '<', highest: null, reagent: t })), lessBase, String(t));
});

test('E20L-F03 gel-clot: the limit and the MVD are given; no result block; F05 refuses it before any value fault', () => {
  const g = e20.mvdFromLimit(TYPED, 'gel-clot', null, null, '0.25'); // MVD = 0.5 / 0.25 = 2
  assert.equal(g.status, 'result');
  assert.deepEqual(g.mvd.exact, { num: '2', den: '1' });
  assert.equal(g.resultBlockOffered, false);
  assert.equal(g.lambdaMeaning, 'labelled-sensitivity');
  for (const t of ['turbidimetric', 'chromogenic', 'fluorimetric']) {
    const r = e20.mvdFromLimit(TYPED, t, null, null, '0.25');
    assert.equal(r.resultBlockOffered, true);
    assert.equal(r.lambdaMeaning, 'lowest-standard');
    assert.deepEqual(r.mvd, g.mvd);
  }
  const refused = f05({ technique: 'gel-clot' });
  assert.equal(refused.status, 'rejected');
  assert.equal(refused.code, 'E20-RC-02');
  assert.deepEqual(refused.fields, ['technique']);
  assert.equal(f05({ technique: 'gel-clot', DF: '0' }).code, 'E20-RC-02');
  assert.equal(f05({ technique: 'gel-clot', DF: null }).code, 'CCS-RF-01');
});

test('E20L-F03 and F04 the dilution is judged by exact value: below, equal, above (MVD = 0.5 / 0.05 = 10)', () => {
  const mvd = e20.mvdFromLimit(TYPED, 'chromogenic', null, null, '0.05').mvd;
  assert.deepEqual(mvd.exact, { num: '10', den: '1' });
  for (const [df, relation, permitted] of [['9.999', 'below', true], ['10', 'equal', true], ['10.0', 'equal', true], ['10.001', 'above', false]]) {
    const r = e20.checkDilution(df, mvd.exact);
    assert.equal(r.relation, relation, df);
    assert.equal(r.permitted, permitted, df);
    assert.equal(r.withheldReason, permitted ? null : 'df-above-mvd');
    assert.equal(f05({ DF: df, value: '1' }).dilution.relation, relation);
  }
});

test('E20L-F07 the ratio equals DF divided by MVD exactly, MVD formed from the same lambda (AT-E20L-14)', () => {
  const limits = [
    [TYPED, null, null],
    [KM_MG, '2', 'mg/mL'],
    [{ form: 'km', K: '1', KSource: 's', M: '7', Munit: 'Unit', MSource: 's' }, '3', 'Units/mL'],
    [{ form: 'preset', presetId: 'preset-1', M: '70', Munit: 'mL', MSource: 's' }, null, null],
    [{ form: 'typed', value: '0.3', unit: 'other', otherLabel: 'jar', source: 's' }, '1.7', 'jar/mL'],
  ];
  for (const [limit, c, cUnit] of limits) {
    const cs = [
      { lambda: '0.03', channels: [{ DF: '1', recovery: '100' }, { DF: '7', recovery: '100' }, { DF: '123.4', recovery: '1' }] },
      { lambda: '0.125', channels: [{ DF: '3', recovery: '100' }, { DF: '1000', recovery: '100' }] },
    ];
    const s = e20.screenDilutions(limit, c, cUnit, RANGE, null, cs);
    assert.equal(s.status, 'result', JSON.stringify(limit));
    s.curves.forEach((cv, i) => {
      const f03 = e20.mvdFromLimit(limit, 'chromogenic', c, cUnit, cs[i].lambda);
      assert.deepEqual(cv.mvd, f03.mvd);
      cv.channels.forEach((x, j) => {
        const df = e20.checkDilution(cs[i].channels[j].DF, f03.mvd.exact);
        assert.equal(x.dfAboveMvd, df.relation === 'above');
        assert.equal(x.printExact, df.printExact);
        // ratio = DF / MVD by cross-multiplication of the exact values
        const dn = BigInt(df.DF.exact.num);
        const dd = BigInt(df.DF.exact.den);
        const mn = BigInt(f03.mvd.exact.num);
        const md = BigInt(f03.mvd.exact.den);
        assert.equal(BigInt(x.ratio.exact.num) * dd * mn, dn * md * BigInt(x.ratio.exact.den));
      });
    });
  }
});

test('section 6 printed-exact pairs: identical display with different exact values, and with equal values', () => {
  // R against L: L is 0.5 and prints 0.500
  assert.equal(f05({ value: '0.5001' }).relation.printExact, true);
  assert.equal(f05({ value: '0.5001' }).relation.state, 'above');
  assert.equal(f05({ value: '0.5' }).relation.printExact, false);
  assert.equal(f05({ value: '0.5' }).relation.state, 'equal');
  assert.equal(f05({ value: '0.4' }).relation.printExact, false);
  // x against L, for the qualifier <
  assert.equal(f05({ q: '<', highest: null, value: '0.4999' }).relation.printExact, true);
  assert.equal(f05({ q: '<', highest: null, value: '0.4999' }).relation.state, 'below');
  // DF against MVD (10, printing 10.0)
  assert.equal(e20.checkDilution('10.001', { num: '10', den: '1' }).printExact, true);
  assert.equal(e20.checkDilution('10', { num: '10', den: '1' }).printExact, false);
  assert.equal(e20.checkDilution('9.999', { num: '10', den: '1' }).printExact, true);
  assert.equal(f05({ DF: '10.001', value: '1' }).dilution.printExact, true);
  // raw against each bound: lowest standard 0.05 (prints 0.0500), highest standard 5 (prints 5.00)
  const low = f05({ DF: '1', value: '0.05001' });
  assert.equal(low.rawReading.position, 'within');
  assert.equal(low.rawReading.printExact, true);
  const high = f05({ DF: '1', value: '5.001' });
  assert.equal(high.rawReading.position, 'above-highest');
  assert.equal(high.rawReading.printExact, true);
  assert.equal(f05({ DF: '1', value: '0.05' }).rawReading.printExact, false);
  assert.equal(f05({ DF: '1', value: '5' }).rawReading.printExact, false);
  assert.equal(f05({ DF: '1', value: '2' }).rawReading.printExact, false);
  // floor against y (0.05 x 1 = 0.05)
  const floor = f05({ q: '<', highest: null, DF: '1', value: '0.05001' });
  assert.equal(floor.floorDiffers, true);
  assert.equal(floor.floorPrintExact, true);
  // the recovery against low or high: 5001 / 10000 x 100 = 50.01; 20001 / 10000 x 100 = 200.01
  const rec = (B) => e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, B, A: '0', added: '10000' } }).recovery;
  assert.equal(rec('5001').printExact, true);
  assert.equal(rec('5001').state, 'within');
  assert.equal(rec('5000').printExact, false);
  assert.equal(rec('20001').printExact, true);
  assert.equal(rec('20001').state, 'outside');
  assert.equal(rec('20000').printExact, false);
  assert.equal(rec('10000').printExact, false);
  // not flagged: CV values and the screen's recoveries and r
  const cv = e20.assessSuitability(SUIT).sampleCV;
  assert.equal('printExact' in cv, false);
  const screened = e20.screenDilutions(TYPED, null, null, RANGE, { form: 'preset', presetId: 'preset-5' }, curves());
  assert.equal('printExact' in screened.curves[0], false);
  assert.equal('printExact' in screened.curves[0].channels[0].recovery, false);
});

test('E20L-F02 each preset id in the right and the wrong role', () => {
  const ids = ['preset-1', 'preset-2', 'preset-3', 'preset-4', 'preset-5'];
  const asLimit = (id) => e20.resolveLimit({ form: 'preset', presetId: id, M: '2', Munit: 'mL', MSource: 's' });
  const asRange = (id) => e20.assessSuitability({ ...SUIT, recovery: { ...SUIT.recovery, range: { form: 'preset', presetId: id } } });
  const asCriterion = (id) => e20.screenDilutions(null, null, null, RANGE, { form: 'preset', presetId: id },
    [{ lambda: '1', r: '0.5', channels: [{ DF: '1', recovery: '1' }] }]);
  for (const id of ids) {
    assert.equal(asLimit(id).status, ['preset-4', 'preset-5'].includes(id) ? 'rejected' : 'result', id);
    assert.equal(asRange(id).status, id === 'preset-4' ? 'result' : 'rejected', id);
    assert.equal(asCriterion(id).status, id === 'preset-5' ? 'result' : 'rejected', id);
    if (id !== 'preset-4' && asRange(id).status === 'rejected') assert.equal(asRange(id).code, 'E20-RC-02');
  }
  assert.equal(asLimit('preset-6').code, 'E20-RC-01');
  assert.equal(asRange('preset-6').code, 'E20-RC-01');
  assert.equal(asCriterion('preset-6').code, 'E20-RC-01');
  const list = e20.listPresets();
  assert.deepEqual(list.presets.map((p) => p.presetId), ids);
  // the preset range and the preset criterion in use are the table's digits
  assert.deepEqual(asRange('preset-4').recovery.low.exact, list.presets[3].low.exact);
  assert.deepEqual(asRange('preset-4').recovery.high.exact, list.presets[3].high.exact);
  assert.equal(asCriterion('preset-5').curves[0].curveState, 'outside'); // |0.5| is under 0.980
  assert.deepEqual(asLimit('preset-1').L.exact, { num: '5', den: '2' }); // 5 / 2
  assert.deepEqual(asLimit('preset-2').L.exact, { num: '1', den: '10' }); // 0.2 / 2
  assert.deepEqual(e20.resolveLimit({ form: 'preset', presetId: 'preset-3' }).L.exact, { num: '1', den: '2' });
});

test('E20L-NF-05 every result and refusal carries the engine object of module E20, module line 0.1.0', () => {
  for (const entry of CALLS()) {
    const r = callOf(entry);
    assert.equal(r.engine.package, '@ligant/bench-engines');
    assert.equal(r.engine.module, 'E20');
    assert.equal(r.engine.moduleVersion, '0.1.0');
    assert.equal(typeof r.engine.version, 'string');
  }
});

test('E20L-NF-04 no clock, network, random or dependency in the module source; no dependency in the package', () => {
  const dir = new URL('../src/e20/', import.meta.url);
  for (const f of readdirSync(dir)) {
    const text = readFileSync(new URL(f, dir), 'utf8');
    assert.doesNotMatch(text, /\bDate\b|performance|fetch\(|XMLHttp|require\(|import\(|process\.|globalThis|Math\.|crypto/, f);
    for (const m of text.matchAll(/from\s+'([^']+)'/g)) assert.match(m[1], /^\.\.?\/(core\.js|[a-z-]+\.js)$/, `${f}: ${m[1]}`);
  }
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  for (const k of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) assert.equal(k in pkg, false, k);
});
