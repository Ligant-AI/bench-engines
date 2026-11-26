// Section 5.1: the numeric object { exact, decimal, fraction, display, unit }.
// Built from an exact core rational; nothing in it is a JS number.
import { rat, display as coreDisplay } from '../core.js';
import { threeFigures } from './format.js';

const MAX_PLACES = 400;

// A value terminates when the reduced denominator has no prime factor but 2 and 5; its
// expansion then has max(power of 2, power of 5) decimal places. New code in E20 (section 2.5).
function decimalPlaces(den) {
  let d = den;
  let twos = 0;
  let fives = 0;
  while (d % 2n === 0n) { d /= 2n; twos++; }
  while (d % 5n === 0n) { d /= 5n; fives++; }
  if (d !== 1n) return null;
  return twos > fives ? twos : fives;
}

export function numeric(r, unit = null) {
  const x = rat(r.n, r.d);
  const exact = { num: x.n.toString(), den: x.d.toString() };
  const places = decimalPlaces(x.d);
  const decimal = places !== null && places <= MAX_PLACES ? coreDisplay('exact', exact) : null;
  return {
    exact,
    decimal,
    fraction: `${exact.num}/${exact.den}`,
    display: threeFigures(x),
    unit,
  };
}
