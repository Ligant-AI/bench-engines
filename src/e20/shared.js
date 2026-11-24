// E20 shared conventions: module id, codes, reason tokens, closed strings, the order of
// statuses and the readers every function uses. Spec sections 3, 4 and 5.
import { engineBlock, registerModule, rejected, isBlank, parse, rat } from '../core.js';

export const MODULE = 'E20';
export const MODULE_VERSION = '0.1.0';
registerModule(MODULE, MODULE_VERSION);

// E20L-RF-02: the five codes, module-wide.
export const CODES = Object.freeze({
  incomplete: 'CCS-RF-01',
  values: 'CCS-RF-03',
  unknownString: 'E20-RC-01',
  notAllowed: 'E20-RC-02',
  unitMismatch: 'E20-RC-03',
});

// Section 4.2: the CCS-RF-03 reason tokens.
export const REASONS = Object.freeze({
  notPlainDecimal: 'not-plain-decimal',
  notAboveZero: 'not-above-zero',
  belowOne: 'below-one',
  negative: 'negative',
  greaterThanNotAQuantity: 'greater-than-not-a-quantity',
  wrongForm: 'wrong-form',
  highestNotAboveLambda: 'highest-not-above-lambda',
  lowAboveHigh: 'low-above-high',
  outsideZeroToOne: 'outside-zero-to-one',
  outsideMinusOneToOne: 'outside-minus-one-to-one',
});

export const PRESET_IDS = Object.freeze(['preset-1', 'preset-2', 'preset-3', 'preset-4', 'preset-5']);

// Section 4.3: the complete list of closed strings. Exact and case-sensitive (E20L-IN-03).
export const CLOSED_STRINGS = Object.freeze({
  limitForm: Object.freeze(['typed', 'km', 'preset']),
  limitUnit: Object.freeze(['EU/mL', 'EU/mg', 'EU/Unit', 'other']),
  limitMunit: Object.freeze(['mL', 'mg', 'Unit', 'other']),
  presetId: PRESET_IDS,
  technique: Object.freeze(['gel-clot', 'turbidimetric', 'chromogenic', 'fluorimetric']),
  resultQualifier: Object.freeze(['=', '<']),
  reagentType: Object.freeze(['lal', 'rcr', 'rfc']),
  recoveryBasis: Object.freeze(['as-measured', 'times-df']),
  rangeForm: Object.freeze(['declared', 'preset']),
});

// The qualifier text that is a reason of its own and not an unknown string (section 4.3).
export const GREATER_QUALIFIER = '>';

export const isKnown = (list, v) => typeof v === 'string' && list.includes(v);
export const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// E20L-IN-02: null, absent and blank text are the same.
export { isBlank };

// Step (1): CCS-RF-01 with its code (spec section 4.2).
export function incompleteResult(missing) {
  return { status: 'incomplete', code: CODES.incomplete, missing, engine: engineBlock(MODULE) };
}

// Step (3): all value faults of the call together. Each fault is {fields: [names], reason}.
// `fields` of the result is the union in the order the faults are given.
export function rejectValues(faults) {
  const fields = [];
  for (const f of faults) for (const name of f.fields) if (!fields.includes(name)) fields.push(name);
  const reasons = faults.map((f) => ({ fields: f.fields.slice(), reason: f.reason }));
  return rejected(MODULE, CODES.values, fields, [], { reasons });
}

// E20L-RF-01: the order of statuses. The first applicable step returns, else null.
//   missing: names (step 1); unknown, notAllowed: names (step 2, RC-01 before RC-02);
//   unitMismatch: true when the concentration unit does not match (step 2, RC-03);
//   faults: value faults (step 3).
export function refusalFor({ missing = [], unknown = [], notAllowed = [], unitMismatch = false, faults = [] }) {
  if (missing.length) return incompleteResult(missing);
  if (unknown.length) return rejected(MODULE, CODES.unknownString, unknown);
  if (notAllowed.length) return rejected(MODULE, CODES.notAllowed, notAllowed);
  if (unitMismatch) return rejected(MODULE, CODES.unitMismatch, ['cUnit']);
  if (faults.length) return rejectValues(faults);
  return null;
}

// E20L-IN-01: decimal text. The type test comes first, because core's parse also reads
// numbers and bigints. Blank text is the caller's step (1) and is not judged here.
export function readText(v) {
  if (typeof v !== 'string') return { ok: false, reason: REASONS.wrongForm };
  const r = parse(v);
  return r ? { ok: true, r } : { ok: false, reason: REASONS.notPlainDecimal };
}

// E20L-NF-02: an `exact` object {num, den} of integer strings, den above zero. With
// positiveNum, num must be above zero as well (the mvd argument of E20L-F04).
export function readExact(v, positiveNum = false) {
  const bad = { ok: false, reason: REASONS.wrongForm };
  if (!isObject(v)) return bad;
  const { num, den } = v;
  if (typeof num !== 'string' || typeof den !== 'string') return bad;
  if (!/^-?[0-9]+$/.test(num) || !/^[0-9]+$/.test(den)) return bad;
  const n = BigInt(num);
  const d = BigInt(den);
  if (d <= 0n) return bad;
  if (positiveNum && n <= 0n) return bad;
  return { ok: true, r: rat(n, d) };
}
