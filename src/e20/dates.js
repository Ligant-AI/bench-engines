// E20L-F09 checkRecordDates: the date flags of ELM-FL-05. The dates are arguments; the module reads
// no clock. A date is YYYY-MM-DD text that exists in the Gregorian calendar, years 0001 to 9999
// (NAD-2026-11-24-64). Text that is not such a date never refuses the call: it is named and every
// flag that uses it is null. Only a value that is not text is refused.
import { done } from '../core.js';
import { MODULE, REASONS, isBlank, rejectValues } from './shared.js';

const SHAPE = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
const DAYS = [31n, 28n, 31n, 30n, 31n, 30n, 31n, 31n, 30n, 31n, 30n, 31n];

const isLeapYear = (y) => (y % 4n === 0n && y % 100n !== 0n) || y % 400n === 0n;

// True when the text is a calendar date. The digits are read as big integers for the calendar test only.
function isCalendarDate(text) {
  const m = SHAPE.exec(text);
  if (!m) return false;
  const year = BigInt(m[1]);
  const month = BigInt(m[2]);
  const day = BigInt(m[3]);
  if (year < 1n || month < 1n || month > 12n || day < 1n) return false;
  const last = month === 2n && isLeapYear(year) ? 29n : DAYS[month - 1n];
  return day <= last;
}

export function checkRecordDates(testDate, expiryDate, calibrationDueDate) {
  const given = [['testDate', testDate], ['expiryDate', expiryDate], ['calibrationDueDate', calibrationDueDate]];
  const notText = given.filter(([, v]) => !isBlank(v) && typeof v !== 'string').map(([name]) => name);
  if (notText.length) return rejectValues(notText.map((name) => ({ fields: [name], reason: REASONS.wrongForm })));

  const entered = given.filter(([, v]) => !isBlank(v));
  const notDates = entered.filter(([, v]) => !isCalendarDate(v)).map(([name]) => name);
  // Four-digit years, two-digit months and days: the text order is the calendar order.
  const later = (a, b) => (isBlank(a) || isBlank(b) || !isCalendarDate(a) || !isCalendarDate(b) ? null : a > b);
  return done(MODULE, {
    testAfterExpiry: later(testDate, expiryDate),
    testAfterCalibrationDue: later(testDate, calibrationDueDate),
    notDates,
  });
}
