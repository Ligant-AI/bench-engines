// E20 slice B: F04 checkDilution. Expected values are worked by hand from section 6.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDilution } from '../src/e20/index.js';

const ten = { num: '10', den: '1' };
const reasons = (r) => r.reasons.map((x) => [x.fields, x.reason]);

test('F04 DF below MVD is permitted', () => {
  const r = checkDilution('5', ten);
  assert.equal(r.status, 'result');
  assert.equal(r.relation, 'below');
  assert.equal(r.permitted, true);
  assert.equal(r.withheldReason, null);
  assert.equal(r.printExact, false);
  assert.deepEqual(r.DF.exact, { num: '5', den: '1' });
  assert.equal(r.DF.unit, null);
  assert.deepEqual(r.mvd.exact, { num: '10', den: '1' });
  assert.equal(r.mvd.unit, null);
  assert.equal(r.engine.module, 'E20');
});

test('F04 DF equal to MVD is permitted; 10 and 10.0 are the same value', () => {
  for (const df of ['10', '10.0', ' 10 ']) {
    const r = checkDilution(df, ten);
    assert.equal(r.relation, 'equal');
    assert.equal(r.permitted, true);
    assert.equal(r.withheldReason, null);
    assert.equal(r.printExact, false);
  }
});

test('F04 DF above MVD is not permitted and says why', () => {
  const r = checkDilution('20', ten);
  assert.equal(r.relation, 'above');
  assert.equal(r.permitted, false);
  assert.equal(r.withheldReason, 'df-above-mvd');
  assert.equal(checkDilution('1', { num: '1', den: '3' }).relation, 'above');
});

test('F04 DF of 1 (undiluted) is accepted', () => {
  assert.equal(checkDilution('1', ten).relation, 'below');
});

test('F04 mvd need not be in lowest terms; the result holds it reduced', () => {
  const r = checkDilution('10', { num: '20', den: '2' });
  assert.deepEqual(r.mvd.exact, { num: '10', den: '1' });
  assert.equal(r.relation, 'equal');
});

test('F04 printExact: same three-figure text, different exact values', () => {
  const near = { num: '10001', den: '1000' };
  const a = checkDilution('10', near);
  assert.equal(a.relation, 'below');
  assert.equal(a.DF.display, a.mvd.display);
  assert.equal(a.printExact, true);
  const b = checkDilution('10.1', near);
  assert.equal(b.relation, 'above');
  assert.equal(b.printExact, false);
  assert.equal(checkDilution('10', ten).printExact, false);
});

test('F04 step 1: missing names, null equals absent equals blank', () => {
  for (const v of [null, undefined, '', ' \t ']) {
    const r = checkDilution(v, v);
    assert.equal(r.status, 'incomplete');
    assert.equal(r.code, 'CCS-RF-01');
    assert.deepEqual(r.missing, ['DF', 'mvd']);
  }
  assert.deepEqual(checkDilution('5', null).missing, ['mvd']);
  assert.deepEqual(checkDilution(null, ten).missing, ['DF']);
  assert.deepEqual(checkDilution(null, 'abc').missing, ['DF']);
});

test('F04 step 3: DF faults', () => {
  for (const [df, reason] of [
    ['0.5', 'below-one'], ['0', 'below-one'], ['-3', 'below-one'], ['1,5', 'not-plain-decimal'],
    ['2e5', 'not-plain-decimal'], ['+', 'not-plain-decimal'], [5, 'wrong-form'], [5n, 'wrong-form'], [{}, 'wrong-form'],
  ]) {
    const r = checkDilution(df, ten);
    assert.equal(r.status, 'rejected', String(df));
    assert.equal(r.code, 'CCS-RF-03');
    assert.deepEqual(r.fields, ['DF']);
    assert.deepEqual(reasons(r), [[['DF'], reason]], String(df));
    assert.deepEqual(r.indices, []);
  }
});

test('F04 step 3: mvd is malformed, not missing', () => {
  for (const m of [
    { num: '0', den: '1' }, { num: '-1', den: '1' }, { num: '1', den: '0' }, { num: '1', den: '-2' },
    { num: 1, den: 1 }, { num: '1.5', den: '1' }, { num: '1' }, 'abc', 5, 5n, [], [1, 2], true,
  ]) {
    const r = checkDilution('5', m);
    assert.equal(r.status, 'rejected', String(m));
    assert.deepEqual(r.fields, ['mvd']);
    assert.deepEqual(reasons(r), [[['mvd'], 'wrong-form']]);
  }
});

test('F04 both faults together, argument order', () => {
  const r = checkDilution('0.5', { num: '0', den: '1' });
  assert.deepEqual(r.fields, ['DF', 'mvd']);
  assert.deepEqual(reasons(r), [[['DF'], 'below-one'], [['mvd'], 'wrong-form']]);
});

test('F04 a missing argument comes before a fault of the other', () => {
  const r = checkDilution('0.5', null);
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.missing, ['mvd']);
});
