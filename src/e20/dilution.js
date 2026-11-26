// E20L-F04 checkDilution: DF against the maximum dilution (ELM-DT-05).
// The maximum dilution arrives as the `exact` object of an F03 result and nothing else (E20L-NF-02).
import { R, cmp, done } from '../core.js';
import { MODULE, REASONS, isBlank, readText, readExact, refusalFor } from './shared.js';
import { numeric } from './numeric.js';

// Reads a DF argument (not blank). Returns the exact value, or null with its fault pushed.
// `name` is the field the fault names; F07 gives the path of a channel member.
export function readDF(DF, faults, name = 'DF') {
  const got = readText(DF);
  if (!got.ok) {
    faults.push({ fields: [name], reason: got.reason });
    return null;
  }
  if (cmp(got.r, R(1)) < 0) {
    faults.push({ fields: [name], reason: REASONS.belowOne });
    return null;
  }
  return got.r;
}

// The relation of two exact values and the members F04 and F05 both return.
export function dilutionRelation(df, limitValue) {
  const order = cmp(df, limitValue);
  const relation = order < 0 ? 'below' : order === 0 ? 'equal' : 'above';
  const a = numeric(df, null);
  const b = numeric(limitValue, null);
  return {
    DF: a,
    mvd: b,
    relation,
    permitted: relation !== 'above',
    withheldReason: relation === 'above' ? 'df-above-mvd' : null,
    printExact: a.display === b.display && order !== 0,
  };
}

export function checkDilution(DF, mvd) {
  const missing = [];
  if (isBlank(DF)) missing.push('DF');
  if (isBlank(mvd)) missing.push('mvd');

  const faults = [];
  let df = null;
  let limitValue = null;
  if (!isBlank(DF)) df = readDF(DF, faults);
  if (!isBlank(mvd)) {
    const got = readExact(mvd, true);
    if (!got.ok) faults.push({ fields: ['mvd'], reason: got.reason });
    else limitValue = got.r;
  }

  const refusal = refusalFor({ missing, faults });
  if (refusal) return refusal;
  return done(MODULE, dilutionRelation(df, limitValue));
}
