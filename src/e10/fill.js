// E10R-F23 volumeFill (docs/engine-spec-e10-scaling-activity-AMD-2-r2.md, with its errata).
// A classification of the sum of drawn volume lines against a final volume, by integer
// cross-multiplication on `exact` {num, den} objects. It returns no value, no exact, no
// difference, no balance and no total (NAD-2026-11-14-313), and makes no balanceVolume call.
import { incomplete, rejected, done } from '../core.js';
import { isUnit, dimOf } from './units.js';
import { M, isObj, blank } from './scaling.js';

const INT = /^\d+$/;

// Missing members of one volume item {exact: {num, den}, unit}.
const hasGap = (it) => !isObj(it) ? blank(it) : blank(it.unit) || blank(it.exact) || (isObj(it.exact) && (blank(it.exact.num) || blank(it.exact.den)));
// A value condition: exact is not an object, or num/den are not integer strings, den zero, final num zero.
function badExact(it, isFinal) {
  if (!isObj(it) || !isObj(it.exact)) return true;
  const { num, den } = it.exact;
  if (typeof num !== 'string' || typeof den !== 'string' || !INT.test(num) || !INT.test(den)) return true;
  if (BigInt(den) === 0n) return true;
  return isFinal && BigInt(num) === 0n;
}

export function volumeFill(lines, final) {
  // step 1: incomplete; `missing` names the arguments in argument order (AMD2-E-3)
  const missing = [];
  const noLines = blank(lines) || (Array.isArray(lines) && lines.length === 0);
  if (noLines) missing.push('lines');
  else if (Array.isArray(lines)) lines.forEach((it, i) => { if (hasGap(it)) missing.push(`lines[${i}]`); });
  if (blank(final) || hasGap(final)) missing.push('final');
  if (missing.length) return incomplete(M, missing);
  const items = Array.isArray(lines) ? lines : [];
  const idx = (i) => `lines[${i}]`;

  // step 2: unknown unit (E10-RC-01)
  const unknown = [];
  items.forEach((it, i) => { if (isObj(it) && !isUnit(it.unit)) unknown.push(`${idx(i)}.unit`); });
  if (isObj(final) && !isUnit(final.unit)) unknown.push('final.unit');
  if (unknown.length) return rejected(M, 'E10-RC-01', unknown, []);

  // step 3: non-volume unit, or a line whose unit is not the unit of final (E10-RC-02)
  const wrong = [];
  const finalVol = isObj(final) && dimOf(final.unit) === 'volume';
  items.forEach((it, i) => {
    if (!isObj(it)) return;
    if (dimOf(it.unit) !== 'volume' || (finalVol && it.unit !== final.unit)) wrong.push(`${idx(i)}.unit`);
  });
  if (isObj(final) && !finalVol) wrong.push('final.unit');
  if (wrong.length) return rejected(M, 'E10-RC-02', wrong, []);

  // step 4: value conditions together (CCS-RF-03)
  const bad = [];
  if (!Array.isArray(lines)) bad.push('lines');
  else items.forEach((it, i) => { if (badExact(it, false)) bad.push(idx(i)); });
  if (badExact(final, true)) bad.push('final');
  if (bad.length) return rejected(M, 'CCS-RF-03', bad, []);

  // S/L = sum of n_i/d_i; compare S x D with N x L (integers, no division, no rounding)
  let L = 1n;
  for (const it of items) L *= BigInt(it.exact.den);
  let S = 0n;
  for (const it of items) S += BigInt(it.exact.num) * (L / BigInt(it.exact.den));
  const lhs = S * BigInt(final.exact.den);
  const rhs = BigInt(final.exact.num) * L;
  const fill = lhs < rhs ? 'under' : lhs === rhs ? 'full' : 'over';
  return done(M, { fill, assumes: 'additive volumes' });
}
