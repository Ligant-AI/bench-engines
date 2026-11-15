// E10 conversions: the closed unit table (spec section 3, E10C-UN-01) and the constant N_A
// (section 4, E10C-UN-02). Factors are exact powers of ten, held as the exponent k: f = 10^k.
import { R, rat } from '../core.js';

export const DIMENSIONS = ['massConc', 'molarConc', 'mass', 'amount', 'copies', 'volume', 'actIU', 'actU', 'actConcIU', 'actConcU', 'saIU', 'saU'];

// unit -> [dimension, k]   (value in unit x 10^k = value in base unit)
const ROWS = {
  massConc: { 'g/L': 0, 'mg/mL': 0, 'ug/uL': 0, 'ug/mL': -3, 'ng/uL': -3, 'ng/mL': -6, 'pg/uL': -6 },
  molarConc: { M: 0, mM: -3, uM: -6, nM: -9, pM: -12, fM: -15 },
  mass: { g: 0, mg: -3, ug: -6, ng: -9, pg: -12, fg: -15 },
  amount: { mol: 0, mmol: -3, umol: -6, nmol: -9, pmol: -12, fmol: -15, amol: -18 },
  copies: { copies: 0 },
  volume: { L: 0, mL: -3, uL: -6 },
  // E10R-UN-01 (NAD-2026-11-14-254, -268): activity units; IU and U never meet
  actIU: { IU: 0 },
  actU: { U: 0 },
  actConcIU: { 'IU/mL': 3 },
  actConcU: { 'U/mL': 3 },
  saIU: { 'IU/mg': 3, 'IU/ug': 6 },
  saU: { 'U/mg': 3, 'U/ug': 6 },
};

const TABLE = new Map();
for (const [dim, units] of Object.entries(ROWS)) {
  for (const [u, k] of Object.entries(units)) TABLE.set(u, { dim, k });
}

export const UNITS = Object.freeze(Object.fromEntries(
  Object.entries(ROWS).map(([dim, units]) => [dim, Object.freeze(Object.keys(units))]),
));

export const isUnit = (u) => typeof u === 'string' && TABLE.has(u);
export const dimOf = (u) => TABLE.get(u).dim;

// f(unit) as an exact rational.
export function factor(u) {
  const { k } = TABLE.get(u);
  return k >= 0 ? R(10n ** BigInt(k)) : rat(1n, 10n ** BigInt(-k));
}

// N_A = 602214076 x 10^15 mol^-1 (exact; SI Brochure 9th ed.).
export const N_A = R(602214076n * 10n ** 15n);
