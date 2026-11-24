// E20 slice D: F09 checkRecordDates. Every expected value is worked by hand from section 6
// (E20L-F09) of the specification: the Gregorian calendar, years 0001 to 9999, text only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkRecordDates } from '../src/e20/index.js';

const flags = (r) => [r.testAfterExpiry, r.testAfterCalibrationDue, r.notDates];

test('F09 a test date later than the expiry or the calibration due date is flagged', () => {
  const r = checkRecordDates('2026-05-02', '2026-05-01', '2026-04-30');
  assert.equal(r.status, 'result');
  assert.deepEqual(flags(r), [true, true, []]);
  assert.equal(r.engine.module, 'E20');
});

test('F09 the same day gives no flag; an earlier test date gives no flag', () => {
  assert.deepEqual(flags(checkRecordDates('2026-05-01', '2026-05-01', '2026-05-01')), [false, false, []]);
  assert.deepEqual(flags(checkRecordDates('2026-04-30', '2026-05-01', '2027-01-01')), [false, false, []]);
});

test('F09 order is by calendar date across month, year and century boundaries', () => {
  assert.equal(checkRecordDates('2026-12-31', '2027-01-01').testAfterExpiry, false);
  assert.equal(checkRecordDates('2027-01-01', '2026-12-31').testAfterExpiry, true);
  assert.equal(checkRecordDates('2026-10-01', '2026-09-30').testAfterExpiry, true);
  assert.equal(checkRecordDates('0001-01-01', '9999-12-31').testAfterExpiry, false);
  assert.equal(checkRecordDates('9999-12-31', '0001-01-01').testAfterExpiry, true);
});

test('F09 a flag needs both dates of its pair; absent, null and blank are not entered and not named', () => {
  assert.deepEqual(flags(checkRecordDates()), [null, null, []]);
  assert.deepEqual(flags(checkRecordDates('2026-05-02', null, undefined)), [null, null, []]);
  assert.deepEqual(flags(checkRecordDates('2026-05-02', '', '   ')), [null, null, []]);
  assert.deepEqual(flags(checkRecordDates(null, '2026-05-01', '2026-05-01')), [null, null, []]);
  assert.deepEqual(flags(checkRecordDates('2026-05-02', '2026-05-01')), [true, null, []]);
  assert.deepEqual(flags(checkRecordDates('2026-05-02', undefined, '2026-05-01')), [null, true, []]);
});

test('F09 calendar rule: leap years by hand (2024 and 2000 leap; 2023 and 1900 are not)', () => {
  for (const d of ['2024-02-29', '2000-02-29', '2026-12-31', '2026-04-30', '0001-01-01', '9999-12-31']) {
    assert.deepEqual(checkRecordDates(d, d).notDates, [], d);
  }
  for (const d of ['2023-02-29', '1900-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '2026-00-10', '2026-01-00', '2026-01-32']) {
    assert.deepEqual(checkRecordDates(d, '2026-05-01').notDates, ['testDate'], d);
  }
});

test('F09 not a date: named, every flag that uses it is null, the other pair still works', () => {
  const r = checkRecordDates('2026-06-01', '2026-02-30', '2026-05-01');
  assert.deepEqual(flags(r), [null, true, ['expiryDate']]);
  const s = checkRecordDates('2026-06-01', '2026-05-01', 'soon');
  assert.deepEqual(flags(s), [true, null, ['calibrationDueDate']]);
  const t = checkRecordDates('x', 'y', 'z');
  assert.deepEqual(flags(t), [null, null, ['testDate', 'expiryDate', 'calibrationDueDate']]);
});

test('F09 the text rule: no trimming and no other format', () => {
  for (const d of ['0000-01-01', ' 2026-05-01', '2026-05-01 ', '2026-5-1', '26-05-01', '2026/05/01', '01-05-2026',
    '2026-05-01T00:00', '٢٠٢٦-٠٥-٠١', '+2026-05-01', '2026-05-01\n']) {
    const r = checkRecordDates(d, '2026-01-01');
    assert.deepEqual(r.notDates, ['testDate'], JSON.stringify(d));
    assert.equal(r.testAfterExpiry, null);
  }
});

test('F09 a value that is not text is the one refusal: CCS-RF-03 wrong-form, naming the arguments', () => {
  for (const bad of [20260501, 20260501n, {}, [], true, new Date(0)]) {
    const r = checkRecordDates(bad, '2026-05-01', '2026-05-01');
    assert.equal(r.status, 'rejected');
    assert.equal(r.code, 'CCS-RF-03');
    assert.deepEqual(r.fields, ['testDate']);
    assert.deepEqual(r.reasons, [{ fields: ['testDate'], reason: 'wrong-form' }]);
    assert.deepEqual(r.indices, []);
  }
  const two = checkRecordDates('2026-05-01', 5, 6);
  assert.deepEqual(two.fields, ['expiryDate', 'calibrationDueDate']);
  assert.deepEqual(two.reasons.map((x) => x.reason), ['wrong-form', 'wrong-form']);
  // the refusal for a non-text value is not softened by a text that is no date beside it
  assert.equal(checkRecordDates('nonsense', 5).status, 'rejected');
});

test('F09 the module reads no clock: a date far in the past or future still compares by its arguments only', () => {
  assert.equal(checkRecordDates('2001-01-02', '2001-01-01').testAfterExpiry, true);
  assert.equal(checkRecordDates('3000-01-01', '3000-01-02').testAfterExpiry, false);
});

test('F09 the result holds exactly the flags, the names and the engine block', () => {
  const r = checkRecordDates('2026-05-02', '2026-05-01', 'x');
  assert.deepEqual(Object.keys(r).sort(), ['engine', 'notDates', 'status', 'testAfterCalibrationDue', 'testAfterExpiry']);
});
