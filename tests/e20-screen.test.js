// E20 slice D: F07 screenDilutions. Every expected value is worked by hand from section 6
// (E20L-F07), section 4.1, section 4.2 and section 6's printed-exact rule of the specification.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { screenDilutions } from '../src/e20/index.js';

const LIM = { form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' }; // L = 1/2 per mL, c fixed at 1
const RANGE = { form: 'declared', low: '50', high: '200', source: 's' };
const CRIT = { form: 'preset', presetId: 'preset-5' };
const ch = (DF, recovery) => ({ DF, recovery });
const curve = (lambda, channels, r) => (r === undefined ? { lambda, channels } : { lambda, r, channels });
const screen = (curves, over = {}) => {
  const a = { limit: LIM, c: null, cUnit: null, range: RANGE, criterion: CRIT, ...over };
  return screenDilutions(a.limit, a.c, a.cUnit, a.range, a.criterion, curves);
};
const frac = (list) => list.map((x) => x.fraction);

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

test('F07 per channel: state, sensitivity, ratio, DF against MVD, listing (MVD = 0.5 / 0.05 = 10)', () => {
  const r = screen([curve('0.05', [ch('1', '100'), ch('5', '60'), ch('10', '40'), ch('20', '100')], '-0.99')]);
  assert.equal(r.status, 'result');
  assert.equal(r.mvdShown, true);
  const [c0] = r.curves;
  assert.deepEqual(c0.mvd.exact, { num: '10', den: '1' });
  assert.equal(c0.mvd.unit, null);
  assert.equal(c0.curveState, 'within'); // |-0.99| is 0.99, at least 0.980
  assert.deepEqual(c0.channels.map((x) => x.recoveryState), ['within', 'within', 'outside', 'within']);
  assert.deepEqual(c0.channels.map((x) => x.sensitivity.fraction), ['1/20', '1/4', '1/2', '1/1']);
  assert.equal(c0.channels[0].sensitivity.unit, 'EU/mL');
  assert.deepEqual(c0.channels.map((x) => x.ratio.fraction), ['1/10', '1/2', '1/1', '2/1']);
  assert.equal(c0.channels[0].ratio.unit, null);
  assert.deepEqual(c0.channels.map((x) => x.dfAboveMvd), [false, false, false, true]);
  assert.deepEqual(c0.channels.map((x) => x.listed), [true, true, false, false]);
  assert.deepEqual(frac(c0.listed), ['1/1', '5/1']);
  assert.equal(c0.notConsecutive, null);
  assert.equal(c0.channels[3].dfAboveMvd, true); // returned although the recovery is within the range
  assert.equal(r.engine.module, 'E20');
});

test('F07 ELM-IE-05: ratio equals DF divided by MVD, MVD formed from the same lambda', () => {
  // L x c = 5/2 x 2 = 5 per mL (mg); lambda 0.5 gives MVD 10; lambda 0.2 gives MVD 25.
  const limit = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  const r = screen(
    [curve('0.5', [ch('4', '100'), ch('10', '100')]), curve('0.2', [ch('5', '100'), ch('50', '100')])],
    { limit, c: '2', cUnit: 'mg/mL' },
  );
  assert.equal(r.status, 'result');
  assert.deepEqual(r.curves.map((x) => x.mvd.fraction), ['10/1', '25/1']);
  assert.deepEqual(r.curves[0].channels.map((x) => x.ratio.fraction), ['2/5', '1/1']); // 4/10 and 10/10
  assert.deepEqual(r.curves[1].channels.map((x) => x.ratio.fraction), ['1/5', '2/1']); // 5/25 and 50/25
  assert.deepEqual(r.curves[1].channels.map((x) => x.dfAboveMvd), [false, true]);
});

test('F07 no limit declared: no MVD, ratio, DF test or printed-exact flag; listing by recovery alone', () => {
  const r = screen([curve('0.05', [ch('1000', '100'), ch('2', '300')])], { limit: null, c: 'x', cUnit: 5 });
  assert.equal(r.status, 'result');
  assert.equal(r.mvdShown, false);
  const [c0] = r.curves;
  assert.equal(c0.mvd, null);
  for (const x of c0.channels) {
    assert.equal(x.ratio, null);
    assert.equal(x.dfAboveMvd, null);
    assert.equal(x.printExact, null);
  }
  assert.deepEqual(c0.channels.map((x) => x.listed), [true, false]);
  assert.deepEqual(frac(c0.listed), ['1000/1']);
  assert.equal(c0.channels[0].sensitivity.fraction, '50/1');
});

test('F07 a limit given as undefined or null is the same: no limit declared', () => {
  const a = screenDilutions(null, null, null, RANGE, CRIT, [curve('1', [ch('1', '100')])]);
  const b = screenDilutions(undefined, undefined, undefined, RANGE, CRIT, [curve('1', [ch('1', '100')])]);
  assert.deepEqual(a, b);
  assert.equal(a.mvdShown, false);
});

test('F07 D is mL: c and cUnit are not read, supplied or not', () => {
  const plain = screen([curve('0.05', [ch('5', '100')])]);
  const noise = screen([curve('0.05', [ch('5', '100')])], { c: '0', cUnit: 7 });
  assert.deepEqual(noise, plain);
});

test('F07 curveState: |r| against the criterion, bounds included, a rising curve is not outside', () => {
  const state = (r, criterion = CRIT) => screen([curve('1', [ch('1', '100')], r)], { criterion }).curves[0].curveState;
  assert.equal(state('0.98'), 'within'); // 0.98 equals 0.980
  assert.equal(state('0.979'), 'outside');
  assert.equal(state('0.99'), 'within'); // positive, rising
  assert.equal(state('-0.5', { form: 'declared', value: '0.5', source: 's' }), 'within');
  assert.equal(state('-0.4', { form: 'declared', value: '0.5', source: 's' }), 'outside');
  assert.equal(state('-1'), 'within');
  assert.equal(state('1', { form: 'declared', value: '1', source: 's' }), 'within');
  assert.equal(state('0', { form: 'declared', value: '0', source: 's' }), 'within');
  assert.equal(state('0.5'), 'outside');
});

test('F07 a curve whose r is not entered is not-entered and the criterion plays no part', () => {
  const r = screen([curve('1', [ch('1', '100')])], { criterion: { form: 'bogus' } });
  assert.equal(r.status, 'result');
  assert.equal(r.curves[0].curveState, 'not-entered');
  assert.equal(r.curves[0].r, null);
  const mixed = screen([curve('1', [ch('1', '100')]), curve('1', [ch('1', '100')], '0.1')]);
  assert.deepEqual(mixed.curves.map((x) => x.curveState), ['not-entered', 'outside']);
});

test('F07 a curve outside the criterion lists no channel', () => {
  const r = screen([curve('0.05', [ch('1', '100'), ch('2', '100')], '0.5')]);
  assert.deepEqual(r.curves[0].channels.map((x) => x.listed), [false, false]);
  assert.deepEqual(r.curves[0].listed, []);
  assert.equal(r.curves[0].notConsecutive, null);
});

test('F07 notConsecutive: unlisted DF strictly between two listed ones, per curve, exact equality', () => {
  const r = screen([
    curve('0.05', [ch('1', '100'), ch('2', '10'), ch('5', '100')]), // MVD 10
    curve('0.01', [ch('10', '100'), ch('10.0', '100'), ch('30', '100'), ch('20', '5')]), // MVD 50
    curve('0.01', [ch('10', '100'), ch('20', '100'), ch('20.0', '5'), ch('30', '100')]),
  ]);
  const [a, b, c] = r.curves;
  assert.deepEqual(frac(a.notConsecutive.listed), ['1/1', '5/1']);
  assert.deepEqual(frac(a.notConsecutive.between), ['2/1']);
  assert.deepEqual(frac(a.listed), ['1/1', '5/1']);
  // repeats kept in the curve's listing, distinct in the fact; 10 and 10.0 are one DF
  assert.deepEqual(frac(b.listed), ['10/1', '10/1', '30/1']);
  assert.deepEqual(frac(b.notConsecutive.listed), ['10/1', '30/1']);
  assert.deepEqual(frac(b.notConsecutive.between), ['20/1']);
  // the unlisted 20.0 equals a listed DF, so it is not between
  assert.deepEqual(frac(c.listed), ['10/1', '20/1', '30/1']);
  assert.equal(c.notConsecutive, null);
});

test('F07 notConsecutive is null with fewer than two distinct listed DF', () => {
  const r = screen([curve('0.01', [ch('10', '100'), ch('10.0', '100'), ch('20', '5')])]);
  assert.deepEqual(frac(r.curves[0].listed), ['10/1', '10/1']);
  assert.equal(r.curves[0].notConsecutive, null);
});

test('F07 the listing order is input order, not DF order', () => {
  const r = screen([curve('0.01', [ch('30', '100'), ch('10', '100')])]);
  assert.deepEqual(frac(r.curves[0].listed), ['30/1', '10/1']);
});

test('F07 recovery range bounds are included; a preset range reads 50 to 200; a negative recovery is accepted', () => {
  const states = (range) => screen([curve('1', [ch('1', '50'), ch('1', '200'), ch('1', '49.9'), ch('1', '-3')])], { range })
    .curves[0].channels.map((x) => x.recoveryState);
  assert.deepEqual(states(RANGE), ['within', 'within', 'outside', 'outside']);
  assert.deepEqual(states({ form: 'preset', presetId: 'preset-4' }), ['within', 'within', 'outside', 'outside']);
  assert.deepEqual(states({ form: 'declared', low: '-5', high: '-1', source: 's' }), ['outside', 'outside', 'outside', 'within']);
  assert.deepEqual(states({ form: 'declared', low: '50', high: '50', source: 's' }), ['within', 'outside', 'outside', 'outside']);
});

test('F07 printExact: identical display, different exact values, and with equal values', () => {
  // MVD is 10 and prints 10.0; DF 10.001 prints 10.0 too, so the page prints both exact values.
  const r = screen([curve('0.05', [ch('10.001', '100'), ch('10', '100'), ch('9', '100')])]);
  assert.deepEqual(r.curves[0].channels.map((x) => x.printExact), [true, false, false]);
  assert.deepEqual(r.curves[0].channels.map((x) => x.dfAboveMvd), [true, false, false]);
});

test('F07 the result has no member that selects, ranks or recommends', () => {
  const r = screen([curve('1', [ch('1', '100')], '0.99')]);
  assert.deepEqual(Object.keys(r).sort(), ['curves', 'engine', 'mvdShown', 'status']);
  assert.deepEqual(Object.keys(r.curves[0]).sort(),
    ['channels', 'curveState', 'lambda', 'listed', 'mvd', 'notConsecutive', 'r']);
  assert.deepEqual(Object.keys(r.curves[0].channels[0]).sort(),
    ['DF', 'dfAboveMvd', 'listed', 'printExact', 'ratio', 'recovery', 'recoveryState', 'sensitivity']);
});

test('F07 no cap on curves or channels', () => {
  const channels = Array.from({ length: 7 }, (_, i) => ch(String(i + 1), '100'));
  const r = screen(Array.from({ length: 6 }, () => curve('1', channels)), { limit: null });
  assert.equal(r.status, 'result');
  assert.equal(r.curves.length, 6);
  assert.equal(r.curves[5].channels.length, 7);
});

test('F07 step 1: the missing names, zero-based, in nested order', () => {
  incomplete(screen(null), ['curves']);
  incomplete(screen([]), ['curves']);
  incomplete(screen(undefined, { range: null }), ['recoveryRange', 'curves']);
  incomplete(screen([{}]), ['curves[0].lambda', 'curves[0].channels']);
  incomplete(screen([{ lambda: '1', channels: [] }]), ['curves[0].channels']);
  incomplete(screen([{ lambda: '1', channels: [{}] }]), ['curves[0].channels[0].DF', 'curves[0].channels[0].recovery']);
  incomplete(screen([curve('1', [ch('1', '1')]), { lambda: '1', channels: [ch('1', '1'), ch(' ', null)] }]),
    ['curves[1].channels[1].DF', 'curves[1].channels[1].recovery']);
  incomplete(screen([null]), ['curves[0]']);
  incomplete(screen([{ lambda: '1', channels: [ch('1', '1'), null] }]), ['curves[0].channels[1]']);
  incomplete(screen([curve('1', [ch('1', '1')])], { range: { form: 'declared' } }),
    ['recoveryRange.low', 'recoveryRange.high', 'recoveryRange.source']);
  incomplete(screen([curve('1', [ch('1', '1')])], { range: {} }), ['recoveryRange.form']);
  incomplete(screen([curve('1', [ch('1', '1')])], { range: { form: 'preset' } }), ['recoveryRange.presetId']);
});

test('F07 E20L-IN-02: an empty slot of a sparse array is not declared, named like a null element', () => {
  const good = curve('1', [ch('1', '1')]);
  const hole = (len, at, v) => { const a = new Array(len); if (at !== undefined) a[at] = v; return a; };
  // holes in curves: at start, in the middle, and all holes
  incomplete(screen(hole(2, 1, good)), ['curves[0]']);
  incomplete(screen(hole(2, 0, good)), ['curves[1]']);
  incomplete(screen([good, , good]), ['curves[1]']); // eslint-disable-line no-sparse-arrays
  incomplete(screen(new Array(2)), ['curves[0]', 'curves[1]']);
  incomplete(screen(new Array(1)), ['curves[0]']);
  // the same as a null element
  incomplete(screen([null, good]), ['curves[0]']);
  // holes in channels: at start, in the middle, and all holes
  const withChannels = (channels) => [{ lambda: '1', channels }];
  incomplete(screen(withChannels(hole(2, 1, ch('1', '1')))), ['curves[0].channels[0]']);
  incomplete(screen(withChannels(hole(2, 0, ch('1', '1')))), ['curves[0].channels[1]']);
  incomplete(screen(withChannels([ch('1', '1'), , ch('1', '1')])), ['curves[0].channels[1]']); // eslint-disable-line no-sparse-arrays
  incomplete(screen(withChannels(new Array(2))), ['curves[0].channels[0]', 'curves[0].channels[1]']);
  incomplete(screen(withChannels(new Array(1))), ['curves[0].channels[0]']);
  // a hole in the first curve with an r entered in a later one: the criterion is still read
  incomplete(screen([, curve('1', [ch('1', '1')], '0.5')], { criterion: null }), ['criterion', 'curves[0]']); // eslint-disable-line no-sparse-arrays
});

test('F07 step 1: the limit parts, then c and cUnit when D is not mL, then the range, then curves', () => {
  const km = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  incomplete(screen([curve('1', [ch('1', '1')])], { limit: km }), ['c', 'cUnit']);
  incomplete(screen(null, { limit: { form: 'km', K: '5' }, range: null }),
    ['limit.KSource', 'limit.M', 'limit.Munit', 'limit.MSource', 'recoveryRange', 'curves']);
  incomplete(screen([curve('1', [ch('1', '1')])], { limit: { form: 'preset' } }), ['limit.presetId']);
  incomplete(screen([curve('1', [ch('1', '1')])], { limit: { source: 's' } }), ['limit.form']);
});

test('F07 step 1: the criterion is named only when an r is entered, even a malformed one', () => {
  const one = [curve('1', [ch('1', '1')], '0.5')];
  incomplete(screen(one, { criterion: null }), ['criterion']);
  incomplete(screen(one, { criterion: { form: 'declared' } }), ['criterion.value', 'criterion.source']);
  incomplete(screen(one, { criterion: { form: 'preset' } }), ['criterion.presetId']);
  incomplete(screen(one, { criterion: {} }), ['criterion.form']);
  incomplete(screen([curve('1', [ch('1', '1')], 'abc')], { criterion: null }), ['criterion']);
  assert.equal(screen([curve('1', [ch('1', '1')])], { criterion: null }).status, 'result');
  assert.equal(screen([curve('1', [ch('1', '1')], '  ')], { criterion: null }).status, 'result');
});

test('F07 step 1 beats step 2 and step 3', () => {
  incomplete(screen([curve('0', [ch('0.5', 'x')], '9')], { range: { form: 'bogus' }, limit: { form: 'typed' } }),
    ['limit.value', 'limit.unit', 'limit.source']);
});

test('F07 step 2: unknown closed strings, then not-allowed ones, then the unit', () => {
  const ok = [curve('1', [ch('1', '1')])];
  rejected(screen(ok, { limit: { form: 'bogus' } }), 'E20-RC-01', ['limit.form']);
  rejected(screen(ok, { range: { form: 'bogus' } }), 'E20-RC-01', ['recoveryRange.form']);
  rejected(screen(ok, { range: { form: 'preset', presetId: 'preset-9' } }), 'E20-RC-01', ['recoveryRange.presetId']);
  rejected(screen([curve('1', [ch('1', '1')], '0.5')], { criterion: { form: 'bogus' } }), 'E20-RC-01', ['criterion.form']);
  rejected(screen([curve('1', [ch('1', '1')], '0.5')], { criterion: { form: 'preset', presetId: 'x' } }),
    'E20-RC-01', ['criterion.presetId']);
  rejected(screen(ok, { limit: { form: 'preset', presetId: 'preset-4' } }), 'E20-RC-02', ['limit.presetId']);
  rejected(screen(ok, { range: { form: 'preset', presetId: 'preset-1' } }), 'E20-RC-02', ['recoveryRange.presetId']);
  rejected(screen(ok, { range: { form: 'preset', presetId: 'preset-5' } }), 'E20-RC-02', ['recoveryRange.presetId']);
  rejected(screen([curve('1', [ch('1', '1')], '0.5')], { criterion: { form: 'preset', presetId: 'preset-4' } }),
    'E20-RC-02', ['criterion.presetId']);
  rejected(screen(ok, { range: { form: 'bogus' }, limit: { form: 'preset', presetId: 'preset-5' } }),
    'E20-RC-01', ['recoveryRange.form']);
  const km = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  rejected(screen(ok, { limit: km, c: '2', cUnit: 'Units/mL' }), 'E20-RC-03', ['cUnit']);
  rejected(screen(ok, { limit: km, c: '0', cUnit: 'Units/mL' }), 'E20-RC-03', ['cUnit']); // unit before value
  assert.equal(screen(ok, { limit: km, c: '2', cUnit: 'mg/mL' }).status, 'result');
});

test('F07 step 3: value faults of all arguments together, with reasons, in argument order', () => {
  const r = screen(
    [curve('0', [ch('0.5', '1,5')], '2'), curve('abc', [ch('x', '-5'), ch(7, '2e5')], '-1.5')],
    { criterion: { form: 'declared', value: '1.5', source: 's' }, range: { form: 'declared', low: '9', high: '1', source: 's' } },
  );
  faults(r, [
    [['recoveryRange.low', 'recoveryRange.high'], 'low-above-high'],
    [['criterion.value'], 'outside-zero-to-one'],
    [['curves[0].lambda'], 'not-above-zero'],
    [['curves[0].r'], 'outside-minus-one-to-one'],
    [['curves[0].channels[0].DF'], 'below-one'],
    [['curves[0].channels[0].recovery'], 'not-plain-decimal'],
    [['curves[1].lambda'], 'not-plain-decimal'],
    [['curves[1].r'], 'outside-minus-one-to-one'],
    [['curves[1].channels[0].DF'], 'not-plain-decimal'],
    [['curves[1].channels[1].DF'], 'wrong-form'],
    [['curves[1].channels[1].recovery'], 'not-plain-decimal'],
  ]);
});

test('F07 step 3: the bounds of the range, the criterion and r', () => {
  const run = (over, curves) => screen(curves ?? [curve('1', [ch('1', '1')], '0.5')], over).status;
  assert.equal(run({ range: { form: 'declared', low: '5', high: '5', source: 's' } }), 'result');
  assert.equal(run({ range: { form: 'declared', low: '-5', high: '-1', source: 's' } }), 'result');
  assert.equal(run({ range: { form: 'declared', low: '5.1', high: '5', source: 's' } }), 'rejected');
  for (const v of ['0', '1', '0.5']) assert.equal(run({ criterion: { form: 'declared', value: v, source: 's' } }), 'result', v);
  for (const v of ['1.001', '-0.001', '-1']) {
    const r = screen([curve('1', [ch('1', '1')], '0.5')], { criterion: { form: 'declared', value: v, source: 's' } });
    faults(r, [[['criterion.value'], 'outside-zero-to-one']]);
  }
  for (const v of ['-1', '1', '0', '-0.999']) assert.equal(run({}, [curve('1', [ch('1', '1')], v)]), 'result', v);
  for (const v of ['-1.001', '1.001']) {
    faults(screen([curve('1', [ch('1', '1')], v)]), [[['curves[0].r'], 'outside-minus-one-to-one']]);
  }
  // a criterion value that is not entered right is judged only when an r is entered
  assert.equal(screen([curve('1', [ch('1', '1')])], { criterion: { form: 'declared', value: '9', source: 's' } }).status, 'result');
});

test('F07 step 3: the low-above-high reason is judged only when both ends pass their own checks', () => {
  const r = screen([curve('1', [ch('1', '1')])], { range: { form: 'declared', low: 'x', high: '1', source: 's' } });
  faults(r, [[['recoveryRange.low'], 'not-plain-decimal']]);
});

test('F07 wrong form in each slot, never missing', () => {
  const ok = [curve('1', [ch('1', '1')])];
  faults(screen(ok, { limit: 'text' }), [[['limit'], 'wrong-form']]);
  faults(screen(ok, { limit: [] }), [[['limit'], 'wrong-form']]);
  faults(screen(ok, { range: 5 }), [[['recoveryRange'], 'wrong-form']]);
  faults(screen([curve('1', [ch('1', '1')], '0.5')], { criterion: ['x'] }), [[['criterion'], 'wrong-form']]);
  faults(screen({ lambda: '1' }), [[['curves'], 'wrong-form']]);
  faults(screen(['x']), [[['curves[0]'], 'wrong-form']]);
  faults(screen([{ lambda: '1', channels: { DF: '1' } }]), [[['curves[0].channels'], 'wrong-form']]);
  faults(screen([{ lambda: '1', channels: [5] }]), [[['curves[0].channels[0]'], 'wrong-form']]);
  faults(screen([{ lambda: 1, channels: [ch('1', '1')] }]), [[['curves[0].lambda'], 'wrong-form']]);
  faults(screen([{ lambda: '1', r: 0.5, channels: [ch('1', '1')] }]), [[['curves[0].r'], 'wrong-form']]);
  faults(screen([curve('1', [ch('1', 5n)])]), [[['curves[0].channels[0].recovery'], 'wrong-form']]);
  const km = { form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' };
  faults(screen(ok, { limit: km, c: '2', cUnit: 5 }), [[['cUnit'], 'wrong-form']]);
});

test('F07 E20L-NF-07: pure, no state between calls, arguments untouched', () => {
  const args = () => [LIM, null, null, RANGE, CRIT, [curve('0.05', [ch('20', '100'), ch('1', '100')], '0.99')]];
  const a = args();
  const before = structuredClone(a);
  const first = screenDilutions(...a);
  assert.deepEqual(a, before);
  const other = screenDilutions(null, null, null, { form: 'preset', presetId: 'preset-4' }, null, [curve('3', [ch('1', '5')])]);
  const again = screenDilutions(...args());
  assert.deepEqual(again, first);
  assert.notDeepEqual(other, first);
  assert.deepEqual(frac(first.curves[0].listed), ['1/1']); // input order kept in the result only
  assert.deepEqual(a[5][0].channels.map((x) => x.DF), ['20', '1']); // the caller's array is not sorted
});
