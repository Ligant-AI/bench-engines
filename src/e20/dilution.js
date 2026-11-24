// E20L-F04 checkDilution: DF against the maximum dilution (ELM-DT-05).
// The maximum dilution arrives as the `exact` object of an F03 result and nothing else (E20L-NF-02).
import { R, cmp, done } from '../core.js';
import { MODULE, REASONS, isBlank, readText, readExact, refusalFor } from './shared.js';
import { numeric } from './numeric.js';

export function checkDilution(DF, mvd) {
  const missing = [];
  if (isBlank(DF)) missing.push('DF');
  if (isBlank(mvd)) missing.push('mvd');

  const faults = [];
  let df = null;
  let limitValue = null;
  if (!isBlank(DF)) {
    const got = readText(DF);
    if (!got.ok) faults.push({ fields: ['DF'], reason: got.reason });
    else if (cmp(got.r, R(1)) < 0) faults.push({ fields: ['DF'], reason: REASONS.belowOne });
    else df = got.r;
  }
  if (!isBlank(mvd)) {
    const got = readExact(mvd, true);
    if (!got.ok) faults.push({ fields: ['mvd'], reason: got.reason });
    else limitValue = got.r;
  }

  const refusal = refusalFor({ missing, faults });
  if (refusal) return refusal;

  const order = cmp(df, limitValue);
  const relation = order < 0 ? 'below' : order === 0 ? 'equal' : 'above';
  const a = numeric(df, null);
  const b = numeric(limitValue, null);
  return done(MODULE, {
    DF: a,
    mvd: b,
    relation,
    permitted: relation !== 'above',
    withheldReason: relation === 'above' ? 'df-above-mvd' : null,
    printExact: a.display === b.display && order !== 0,
  });
}
