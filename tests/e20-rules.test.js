// E20 conventions and status machinery (spec sections 3, 4 and 5). Slice A.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENGINE_VERSION } from '../src/version.js';
import {
  MODULE, MODULE_VERSION, CODES, REASONS, CLOSED_STRINGS, PRESET_IDS, GREATER_QUALIFIER,
  isKnown, isObject, isBlank, incompleteResult, rejectValues, refusalFor, readText, readExact,
} from '../src/e20/shared.js';
import { engineBlock } from '../src/core.js';

test('module id, module version and the engine object (E20L-NF-05)', () => {
  assert.equal(MODULE, 'E20');
  assert.equal(MODULE_VERSION, '0.1.0');
  assert.deepEqual(engineBlock(MODULE), {
    package: '@ligant/bench-engines',
    version: ENGINE_VERSION,
    module: 'E20',
    moduleVersion: '0.1.0',
  });
  assert.deepEqual(incompleteResult(['a']).engine, engineBlock(MODULE));
});

test('the five codes and the ten reason tokens are exactly those of section 4.2', () => {
  assert.deepEqual(Object.values(CODES), ['CCS-RF-01', 'CCS-RF-03', 'E20-RC-01', 'E20-RC-02', 'E20-RC-03']);
  assert.deepEqual(Object.values(REASONS), [
    'not-plain-decimal', 'not-above-zero', 'below-one', 'negative', 'greater-than-not-a-quantity',
    'wrong-form', 'highest-not-above-lambda', 'low-above-high', 'outside-zero-to-one',
    'outside-minus-one-to-one',
  ]);
});

test('the closed strings are exactly the list of section 4.3', () => {
  assert.deepEqual(CLOSED_STRINGS.limitForm, ['typed', 'km', 'preset']);
  assert.deepEqual(CLOSED_STRINGS.limitUnit, ['EU/mL', 'EU/mg', 'EU/Unit', 'other']);
  assert.deepEqual(CLOSED_STRINGS.limitMunit, ['mL', 'mg', 'Unit', 'other']);
  assert.deepEqual(PRESET_IDS, ['preset-1', 'preset-2', 'preset-3', 'preset-4', 'preset-5']);
  assert.deepEqual(CLOSED_STRINGS.technique, ['gel-clot', 'turbidimetric', 'chromogenic', 'fluorimetric']);
  assert.deepEqual(CLOSED_STRINGS.resultQualifier, ['=', '<']);
  assert.equal(GREATER_QUALIFIER, '>');
  assert.deepEqual(CLOSED_STRINGS.reagentType, ['lal', 'rcr', 'rfc']);
  assert.deepEqual(CLOSED_STRINGS.recoveryBasis, ['as-measured', 'times-df']);
  assert.deepEqual(CLOSED_STRINGS.rangeForm, ['declared', 'preset']);
  assert.throws(() => { 'use strict'; CLOSED_STRINGS.technique.push('x'); });
});

test('closed strings are exact and case-sensitive; any non-text value is unknown (E20L-IN-03)', () => {
  const t = CLOSED_STRINGS.technique;
  assert.equal(isKnown(t, 'gel-clot'), true);
  for (const bad of ['Gel-clot', ' gel-clot', 'gel-clot ', '', 5, null, undefined, {}, ['gel-clot']]) {
    assert.equal(isKnown(t, bad), false);
  }
  assert.equal(isKnown(CLOSED_STRINGS.resultQualifier, '>'), false);
  assert.equal(isKnown(CLOSED_STRINGS.resultQualifier, '>='), false);
});

test('null, absent and blank are the same (E20L-IN-02); an object is not an array', () => {
  for (const v of [null, undefined, '', ' ', '\t\n ']) assert.equal(isBlank(v), true);
  for (const v of ['0', 0, {}, [], false]) assert.equal(isBlank(v), false);
  assert.equal(isObject({}), true);
  for (const v of [[], null, 'x', 5, undefined]) assert.equal(isObject(v), false);
});

test('CCS-RF-01 carries its code, in the order status, code, missing, engine', () => {
  const r = incompleteResult(['limit.value', 'lambda']);
  assert.deepEqual(Object.keys(r), ['status', 'code', 'missing', 'engine']);
  assert.equal(r.status, 'incomplete');
  assert.equal(r.code, 'CCS-RF-01');
  assert.deepEqual(r.missing, ['limit.value', 'lambda']);
});

test('CCS-RF-03: fields are the union in argument order, one reason entry per fault', () => {
  const r = rejectValues([
    { fields: ['c'], reason: REASONS.notAboveZero },
    { fields: ['lambda', 'highestStandard'], reason: REASONS.highestNotAboveLambda },
    { fields: ['DF'], reason: REASONS.belowOne },
  ]);
  assert.equal(r.status, 'rejected');
  assert.equal(r.code, 'CCS-RF-03');
  assert.deepEqual(r.fields, ['c', 'lambda', 'highestStandard', 'DF']);
  assert.deepEqual(r.indices, []);
  assert.deepEqual(r.reasons, [
    { fields: ['c'], reason: 'not-above-zero' },
    { fields: ['lambda', 'highestStandard'], reason: 'highest-not-above-lambda' },
    { fields: ['DF'], reason: 'below-one' },
  ]);
  assert.deepEqual(r.engine, engineBlock(MODULE));
});

test('order of statuses (E20L-RF-01): one result, the first step that applies', () => {
  const all = {
    missing: ['a', 'b'],
    unknown: ['limit.form'],
    notAllowed: ['limit.presetId'],
    unitMismatch: true,
    faults: [{ fields: ['c'], reason: REASONS.notAboveZero }],
  };
  assert.deepEqual(refusalFor(all).missing, ['a', 'b']);
  const noMissing = { ...all, missing: [] };
  let r = refusalFor(noMissing);
  assert.equal(r.code, 'E20-RC-01');
  assert.deepEqual(r.fields, ['limit.form']);
  r = refusalFor({ ...noMissing, unknown: [] });
  assert.equal(r.code, 'E20-RC-02');
  assert.deepEqual(r.fields, ['limit.presetId']);
  r = refusalFor({ ...noMissing, unknown: [], notAllowed: [] });
  assert.equal(r.code, 'E20-RC-03');
  assert.deepEqual(r.fields, ['cUnit']);
  r = refusalFor({ faults: all.faults });
  assert.equal(r.code, 'CCS-RF-03');
  assert.deepEqual(r.fields, ['c']);
  assert.equal(refusalFor({}), null);
});

test('decimal text (E20L-IN-01): the pattern of core parse, type test first', () => {
  for (const ok of ['5', '.5', '5.', '+5', '-5', ' 5 ', '0.980', '000', '-0', '12.50']) {
    assert.equal(readText(ok).ok, true, ok);
  }
  const r = readText('-2.5').r;
  assert.deepEqual([r.n, r.d], [-5n, 2n]);
  for (const bad of ['', '+', '-', '.', '1,5', '2e5', '2E5', 'NaN', 'Infinity', '0x10', '5 mg', '1 2', '--5', '5.5.5', '٥', '>5']) {
    const got = readText(bad);
    assert.deepEqual([got.ok, got.reason], [false, 'not-plain-decimal'], JSON.stringify(bad));
  }
  for (const wrong of [5, 0, 1.5, NaN, 5n, null, undefined, true, {}, [], ['5']]) {
    const got = readText(wrong);
    assert.deepEqual([got.ok, got.reason], [false, 'wrong-form'], String(typeof wrong));
  }
});

test('exact object (E20L-NF-02): integer strings, den above zero, not necessarily reduced', () => {
  let got = readExact({ num: '10', den: '4' });
  assert.equal(got.ok, true);
  assert.deepEqual([got.r.n, got.r.d], [5n, 2n]);
  got = readExact({ num: '-3', den: '9', extra: 'x' });
  assert.deepEqual([got.r.n, got.r.d], [-1n, 3n]);
  got = readExact({ num: '0', den: '5' });
  assert.deepEqual([got.r.n, got.r.d], [0n, 1n]);
  for (const bad of [
    null, undefined, 'x', 5, [], { num: '1' }, { den: '1' }, { num: 1, den: '1' }, { num: '1', den: 1 },
    { num: '1.5', den: '1' }, { num: '', den: '1' }, { num: '+1', den: '1' }, { num: '1', den: '0' },
    { num: '1', den: '-1' }, { num: '1', den: '1.0' }, { num: '1\n', den: '1' }, { num: '1', den: '1\n' },
    { num: 1n, den: 1n },
  ]) {
    const x = readExact(bad);
    assert.deepEqual([x.ok, x.reason], [false, 'wrong-form'], JSON.stringify(bad, (k, v) => (typeof v === 'bigint' ? 'big' : v)));
  }
});

test('exact object for a positive-only argument (the mvd of E20L-F04)', () => {
  assert.equal(readExact({ num: '1', den: '3' }, true).ok, true);
  for (const bad of [{ num: '0', den: '1' }, { num: '-0', den: '1' }, { num: '-1', den: '3' }]) {
    assert.equal(readExact(bad, true).ok, false);
    assert.equal(readExact(bad).ok, true); // zero and negative stay allowed elsewhere (F08)
  }
});
