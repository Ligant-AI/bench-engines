// E20L-F08 formatThreeFigures: the single display function (ELM-DP-01).
// It composes the sig3 and sci3 modes of core and has no rounding of its own.
import { R, cmp, display, parse, done } from '../core.js';
import { MODULE, isBlank, isObject, incompleteResult, rejectValues, readText, readExact, REASONS } from './shared.js';

const THOUSAND = R(1000);

// The text for one exact value (a core rational). Rounded once, from the same exact value.
export function threeFigures(r) {
  const exact = { num: r.n.toString(), den: r.d.toString() };
  const plain = display('sig3', exact);
  if (r.n < 0n) return plain; // a negative never takes the exponent form (NAD-2026-11-24-56)
  const rounded = parse(plain);
  return cmp(rounded, THOUSAND) >= 0 ? display('sci3', exact) : plain;
}

export function formatThreeFigures(value) {
  if (isBlank(value)) return incompleteResult(['value']);
  let got;
  if (typeof value === 'string') got = readText(value);
  else if (isObject(value)) got = readExact(value);
  else got = { ok: false, reason: REASONS.wrongForm };
  if (!got.ok) return rejectValues([{ fields: ['value'], reason: got.reason }]);
  return done(MODULE, { text: threeFigures(got.r) });
}
