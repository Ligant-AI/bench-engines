// E20 slice C: F06 assessSuitability. Every expected value is worked by hand from section 6
// (E20L-F06), section 4.1 and section 4.2 of the specification.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessSuitability } from '../src/e20/index.js';

const S = 'suitability';
const base = (over = {}) => ({
  sampleCV: { value: '3', max: '5', source: 's' },
  spikeCV: { value: '4', max: '5', source: 's' },
  recovery: {
    B: '12', A: '2', added: '10', basis: 'as-measured',
    range: { form: 'declared', low: '50', high: '200', source: 's' },
  },
  ...over,
});
// A base whose recovery members are replaced in part.
const withRec = (rec) => { const b = base(); return { ...b, recovery: { ...b.recovery, ...rec } }; };
const withRange = (range) => withRec({ range });

const ALL_LEAVES = [
  `${S}.sampleCV.value`, `${S}.sampleCV.max`, `${S}.sampleCV.source`,
  `${S}.spikeCV.value`, `${S}.spikeCV.max`, `${S}.spikeCV.source`,
  `${S}.recovery.B`, `${S}.recovery.A`, `${S}.recovery.added`, `${S}.recovery.basis`,
  `${S}.recovery.range.form`,
];

const incomplete = (r, missing, notEntered) => {
  assert.equal(r.status, 'incomplete');
  assert.equal(r.code, 'CCS-RF-01');
  assert.deepEqual(r.missing, missing);
  assert.equal(r.notEntered, notEntered);
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

test('F06 recovery = ((B - A) / added) x 100 in one exact chain; all within', () => {
  const r = assessSuitability(base());
  assert.equal(r.status, 'result');
  assert.deepEqual(r.recovery.value.exact, { num: '100', den: '1' });
  assert.equal(r.recovery.value.decimal, '100');
  assert.equal(r.recovery.value.unit, '%');
  assert.equal(r.recovery.state, 'within');
  assert.equal(r.recovery.basis, 'as-measured');
  assert.deepEqual(r.recovery.B.exact, { num: '12', den: '1' });
  assert.equal(r.recovery.B.unit, 'EU/mL');
  assert.equal(r.recovery.added.unit, 'EU/mL');
  assert.deepEqual(r.recovery.low.exact, { num: '50', den: '1' });
  assert.deepEqual(r.recovery.high.exact, { num: '200', den: '1' });
  assert.equal(r.recovery.printExact, false);
  assert.equal(r.sampleCV.state, 'within');
  assert.equal(r.spikeCV.state, 'within');
  assert.deepEqual(r.sampleCV.value.exact, { num: '3', den: '1' });
  assert.equal(r.sampleCV.max.unit, '%');
  assert.equal(r.summary, 'all-within');
  assert.deepEqual(r.outside, []);
  assert.equal(r.engine.module, 'E20');
});

test('F06 a non-terminating recovery stays exact', () => {
  // (5 - 2) / 9 x 100 = 100/3
  const r = assessSuitability(withRec({ B: '5', A: '2', added: '9' }));
  assert.deepEqual(r.recovery.value.exact, { num: '100', den: '3' });
  assert.equal(r.recovery.value.decimal, null);
  assert.equal(r.recovery.value.fraction, '100/3');
});

test('F06 bounds are included; just beyond is outside', () => {
  // (7 - 2) / 10 x 100 = 50 ; (22 - 2) / 10 x 100 = 200
  for (const B of ['7', '22']) {
    const r = assessSuitability(withRec({ B }));
    assert.equal(r.recovery.state, 'within', B);
    assert.equal(r.summary, 'all-within');
  }
  // 22.01: 20.01 / 10 x 100 = 200.1 ; 6.99: 4.99 / 10 x 100 = 49.9
  for (const B of ['22.01', '6.99']) {
    const r = assessSuitability(withRec({ B }));
    assert.equal(r.recovery.state, 'outside', B);
    assert.equal(r.summary, 'outside');
    assert.deepEqual(r.outside, ['recovery']);
  }
});

test('F06 CV at most its maximum is within; above is outside; outside list order', () => {
  const equal = assessSuitability(base({ sampleCV: { value: '5', max: '5', source: 's' } }));
  assert.equal(equal.sampleCV.state, 'within');
  assert.equal(equal.summary, 'all-within');
  const all = assessSuitability({
    sampleCV: { value: '5.1', max: '5', source: 's' },
    spikeCV: { value: '6', max: '5', source: 's' },
    recovery: withRec({ B: '30' }).recovery,
  });
  assert.equal(all.sampleCV.state, 'outside');
  assert.equal(all.spikeCV.state, 'outside');
  assert.equal(all.recovery.state, 'outside');
  assert.equal(all.summary, 'outside');
  assert.deepEqual(all.outside, ['sample-cv', 'spike-cv', 'recovery']);
  const spike = assessSuitability(base({ spikeCV: { value: '5.0001', max: '5', source: 's' } }));
  assert.deepEqual(spike.outside, ['spike-cv']);
});

test('F06 a recovery below zero is accepted and compared like any number', () => {
  // (1 - 3) / 10 x 100 = -20
  const r = assessSuitability(withRec({ B: '1', A: '3' }));
  assert.equal(r.status, 'result');
  assert.deepEqual(r.recovery.value.exact, { num: '-20', den: '1' });
  assert.equal(r.recovery.state, 'outside');
  // a negative range bound is accepted: -30 <= -20 <= -10
  const inside = assessSuitability(withRec({ B: '1', A: '3', range: { form: 'declared', low: '-30', high: '-10', source: 's' } }));
  assert.equal(inside.recovery.state, 'within');
});

test('F06 the preset range is 50 to 200, bounds included', () => {
  const r = assessSuitability(withRange({ form: 'preset', presetId: 'preset-4' }));
  assert.equal(r.status, 'result');
  assert.deepEqual(r.recovery.low.exact, { num: '50', den: '1' });
  assert.deepEqual(r.recovery.high.exact, { num: '200', den: '1' });
  assert.equal(r.recovery.state, 'within');
  assert.equal(assessSuitability(withRec({ B: '22', range: { form: 'preset', presetId: 'preset-4' } })).recovery.state, 'within');
});

test('F06 the basis is returned and does not enter the arithmetic', () => {
  const a = assessSuitability(withRec({ basis: 'as-measured' }));
  const b = assessSuitability(withRec({ basis: 'times-df' }));
  assert.equal(b.recovery.basis, 'times-df');
  assert.deepEqual(b.recovery.value, a.recovery.value);
});

test('F06 printExact: looks equal to a bound at three figures without being equal', () => {
  // (22.004 - 2) / 10 x 100 = 200.04 ; shows 200 like the high bound
  const hi = assessSuitability(withRec({ B: '22.004' }));
  assert.equal(hi.recovery.value.display, hi.recovery.high.display);
  assert.equal(hi.recovery.printExact, true);
  assert.equal(hi.recovery.state, 'outside');
  // (7.004 - 2) / 10 x 100 = 50.04 ; shows 50.0 like the low bound
  const lo = assessSuitability(withRec({ B: '7.004' }));
  assert.equal(lo.recovery.value.display, lo.recovery.low.display);
  assert.equal(lo.recovery.printExact, true);
  // equal to the bound: same text and the same value, so no flag
  assert.equal(assessSuitability(withRec({ B: '22' })).recovery.printExact, false);
});

test('F06 source text is required but never returned', () => {
  const r = assessSuitability({
    sampleCV: { value: '3', max: '5', source: 'SECRET-ONE' },
    spikeCV: { value: '4', max: '5', source: 5 },
    recovery: { B: '12', A: '2', added: '10', basis: 'as-measured', range: { form: 'declared', low: '50', high: '200', source: { x: 'SECRET-TWO' } } },
  });
  assert.equal(r.status, 'result');
  assert.doesNotMatch(JSON.stringify(r), /SECRET/);
});

test('F06 step 1: a null suitability names every leaf and is not entered', () => {
  for (const v of [null, undefined, {}, '', '  ', { sampleCV: null, spikeCV: '', recovery: { range: null } }]) {
    incomplete(assessSuitability(v), ALL_LEAVES, true);
  }
});

test('F06 step 1: some leaves entered, the rest named in member order', () => {
  const r = assessSuitability({
    sampleCV: { value: '3' },
    recovery: { B: '12', range: { form: 'declared' } },
  });
  incomplete(r, [
    `${S}.sampleCV.max`, `${S}.sampleCV.source`,
    `${S}.spikeCV.value`, `${S}.spikeCV.max`, `${S}.spikeCV.source`,
    `${S}.recovery.A`, `${S}.recovery.added`, `${S}.recovery.basis`,
    `${S}.recovery.range.low`, `${S}.recovery.range.high`, `${S}.recovery.range.source`,
  ], false);
});

test('F06 step 1: null, absent and blank text are the same leaf', () => {
  for (const blank of [null, undefined, '', ' \t ']) {
    const r = assessSuitability(base({ sampleCV: { value: '3', max: blank, source: 's' } }));
    incomplete(r, [`${S}.sampleCV.max`], false);
  }
  incomplete(assessSuitability(withRec({ basis: '  ' })), [`${S}.recovery.basis`], false);
});

test('F06 step 1: a preset range needs its id; a missing form is named alone', () => {
  incomplete(assessSuitability(withRange({ form: 'preset' })), [`${S}.recovery.range.presetId`], false);
  incomplete(assessSuitability(withRange({ low: '50', high: '200', source: 's' })), [`${S}.recovery.range.form`], false);
  incomplete(assessSuitability(withRange(null)), [`${S}.recovery.range.form`], false);
});

test('F06 step 1: a null container names its leaves, not the container', () => {
  incomplete(assessSuitability(base({ spikeCV: null })), [`${S}.spikeCV.value`, `${S}.spikeCV.max`, `${S}.spikeCV.source`], false);
  const noRec = assessSuitability({ sampleCV: base().sampleCV, spikeCV: base().spikeCV, recovery: null });
  incomplete(noRec, [
    `${S}.recovery.B`, `${S}.recovery.A`, `${S}.recovery.added`, `${S}.recovery.basis`, `${S}.recovery.range.form`,
  ], false);
});

test('F06 a present value of the wrong form: not required inside, a fault of the slot', () => {
  faults(assessSuitability(base({ sampleCV: 'text' })), [[[`${S}.sampleCV`], 'wrong-form']]);
  faults(assessSuitability(base({ spikeCV: [] })), [[[`${S}.spikeCV`], 'wrong-form']]);
  faults(assessSuitability(base({ recovery: 5 })), [[[`${S}.recovery`], 'wrong-form']]);
  faults(assessSuitability(withRange('text')), [[[`${S}.recovery.range`], 'wrong-form']]);
  // its members are not required, and the call is not "not entered"
  incomplete(assessSuitability({ sampleCV: 'text' }), [
    `${S}.spikeCV.value`, `${S}.spikeCV.max`, `${S}.spikeCV.source`,
    `${S}.recovery.B`, `${S}.recovery.A`, `${S}.recovery.added`, `${S}.recovery.basis`, `${S}.recovery.range.form`,
  ], false);
});

test('F06 a suitability that is present but not an object is wrong-form', () => {
  for (const v of ['abc', 5, 5n, [], [1], true]) {
    faults(assessSuitability(v), [[[S], 'wrong-form']]);
  }
});

test('F06 step 2: unknown closed strings are E20-RC-01, even a non-text one', () => {
  rejected(assessSuitability(withRec({ basis: 'both' })), 'E20-RC-01', [`${S}.recovery.basis`]);
  rejected(assessSuitability(withRec({ basis: 5 })), 'E20-RC-01', [`${S}.recovery.basis`]);
  rejected(assessSuitability(withRange({ form: 'typed' })), 'E20-RC-01', [`${S}.recovery.range.form`]);
  rejected(assessSuitability(withRange({ form: 'preset', presetId: 'preset-9' })), 'E20-RC-01', [`${S}.recovery.range.presetId`]);
  rejected(assessSuitability(withRange({ form: 'preset', presetId: 4 })), 'E20-RC-01', [`${S}.recovery.range.presetId`]);
});

test('F06 step 2: a known preset id other than preset-4 is E20-RC-02; RC-01 comes first', () => {
  for (const id of ['preset-1', 'preset-3', 'preset-5']) {
    rejected(assessSuitability(withRange({ form: 'preset', presetId: id })), 'E20-RC-02', [`${S}.recovery.range.presetId`]);
  }
  const both = withRec({ basis: 'zz', range: { form: 'preset', presetId: 'preset-5' } });
  rejected(assessSuitability(both), 'E20-RC-01', [`${S}.recovery.basis`]);
});

test('F06 step 1 comes before steps 2 and 3', () => {
  incomplete(assessSuitability(withRec({ basis: 'zz', B: '-1', A: null })), [`${S}.recovery.A`], false);
  rejected(assessSuitability(withRec({ basis: 'zz', B: '-1' })), 'E20-RC-01', [`${S}.recovery.basis`]);
});

test('F06 step 3: negative is a fault for B, A, both CV values and both maxima; zero is accepted', () => {
  faults(assessSuitability(withRec({ B: '-1' })), [[[`${S}.recovery.B`], 'negative']]);
  faults(assessSuitability(withRec({ A: '-0.1' })), [[[`${S}.recovery.A`], 'negative']]);
  faults(assessSuitability(base({ sampleCV: { value: '-1', max: '5', source: 's' } })), [[[`${S}.sampleCV.value`], 'negative']]);
  faults(assessSuitability(base({ sampleCV: { value: '1', max: '-5', source: 's' } })), [[[`${S}.sampleCV.max`], 'negative']]);
  faults(assessSuitability(base({ spikeCV: { value: '-1', max: '5', source: 's' } })), [[[`${S}.spikeCV.value`], 'negative']]);
  faults(assessSuitability(base({ spikeCV: { value: '1', max: '-5', source: 's' } })), [[[`${S}.spikeCV.max`], 'negative']]);
  const zeros = assessSuitability({
    sampleCV: { value: '0', max: '0', source: 's' },
    spikeCV: { value: '0', max: '0', source: 's' },
    recovery: { B: '0', A: '0', added: '10', basis: 'as-measured', range: { form: 'declared', low: '0', high: '0', source: 's' } },
  });
  assert.equal(zeros.status, 'result');
  assert.deepEqual(zeros.recovery.value.exact, { num: '0', den: '1' });
  assert.equal(zeros.recovery.state, 'within');
  assert.equal(zeros.sampleCV.state, 'within');
});

test('F06 step 3: added must be above zero', () => {
  faults(assessSuitability(withRec({ added: '0' })), [[[`${S}.recovery.added`], 'not-above-zero']]);
  faults(assessSuitability(withRec({ added: '-2' })), [[[`${S}.recovery.added`], 'not-above-zero']]);
});

test('F06 step 3: text that is not plain decimal, and a non-text value', () => {
  for (const [v, reason] of [['1,5', 'not-plain-decimal'], ['2e5', 'not-plain-decimal'], ['+', 'not-plain-decimal'], [5, 'wrong-form'], [5n, 'wrong-form'], [{}, 'wrong-form']]) {
    faults(assessSuitability(withRec({ B: v })), [[[`${S}.recovery.B`], reason]]);
  }
  faults(assessSuitability(withRange({ form: 'declared', low: 'x', high: '200', source: 's' })), [[[`${S}.recovery.range.low`], 'not-plain-decimal']]);
  faults(assessSuitability(withRange({ form: 'declared', low: '50', high: 200, source: 's' })), [[[`${S}.recovery.range.high`], 'wrong-form']]);
});

test('F06 step 3: low above high names low then high; equal is accepted', () => {
  faults(assessSuitability(withRange({ form: 'declared', low: '200', high: '50', source: 's' })),
    [[[`${S}.recovery.range.low`, `${S}.recovery.range.high`], 'low-above-high']]);
  assert.equal(assessSuitability(withRange({ form: 'declared', low: '100', high: '100', source: 's' })).status, 'result');
  assert.equal(assessSuitability(withRange({ form: 'declared', low: '-5', high: '5', source: 's' })).status, 'result');
  // only when each end passes its own check
  faults(assessSuitability(withRange({ form: 'declared', low: 'x', high: '50', source: 's' })), [[[`${S}.recovery.range.low`], 'not-plain-decimal']]);
});

test('F06 step 3: all faults together, member order', () => {
  const r = assessSuitability({
    sampleCV: { value: '-1', max: '5', source: 's' },
    spikeCV: { value: '1', max: 'x', source: 's' },
    recovery: { B: '12', A: '2', added: '0', basis: 'as-measured', range: { form: 'declared', low: '9', high: '1', source: 's' } },
  });
  faults(r, [
    [[`${S}.sampleCV.value`], 'negative'],
    [[`${S}.spikeCV.max`], 'not-plain-decimal'],
    [[`${S}.recovery.added`], 'not-above-zero'],
    [[`${S}.recovery.range.low`, `${S}.recovery.range.high`], 'low-above-high'],
  ]);
});
