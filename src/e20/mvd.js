// E20L-F03 mvdFromLimit: MVD = (L x c) / lambda in one exact computation (ELM-DT-04, -DT-12).
import { R, mul, div, done } from '../core.js';
import { MODULE, CLOSED_STRINGS, REASONS, isBlank, isKnown, refusalFor } from './shared.js';
import { numeric } from './numeric.js';
import { inspectLimit, limitParts, readPositive } from './limit.js';

// The concentration unit that cancels the limit's denominator (ELM-UN-02). Compared as exact text.
function expectedUnit(info) {
  if (info.kind === 'mg') return 'mg/mL';
  if (info.kind === 'Unit') return 'Units/mL';
  return `${info.label}/mL`;
}

export function mvdFromLimit(limit, technique, c, cUnit, lambda) {
  const info = inspectLimit(limit);
  const missing = info.missing.slice();
  const unknown = info.unknown.slice();
  const faults = info.faults.slice();

  // Step (1) and step (2): technique, then c and cUnit only when the denominator is known
  // and is not mL (E20L-IN-04), then lambda.
  if (isBlank(technique)) missing.push('technique');
  else if (!isKnown(CLOSED_STRINGS.technique, technique)) unknown.push('technique');
  const readsC = info.kind !== null && info.kind !== 'mL';
  if (readsC) {
    if (isBlank(c)) missing.push('c');
    if (isBlank(cUnit)) missing.push('cUnit');
  }
  if (isBlank(lambda)) missing.push('lambda');

  // E20-RC-03 is judged only when the denominator is known and the unit is text, and for
  // "other" only when its label is text.
  const unitIsText = typeof cUnit === 'string' && !isBlank(cUnit);
  const labelIsText = info.kind !== 'other' || info.label !== null;
  const unitMismatch = readsC && unitIsText && labelIsText && cUnit !== expectedUnit(info);

  // Step (3): value faults in argument order.
  let conc = null;
  if (readsC && !isBlank(c)) conc = readPositive('c', c, faults);
  if (readsC && !isBlank(cUnit) && typeof cUnit !== 'string') {
    faults.push({ fields: ['cUnit'], reason: REASONS.wrongForm });
  }
  let lam = null;
  if (!isBlank(lambda)) lam = readPositive('lambda', lambda, faults);

  const refusal = refusalFor({ missing, unknown, notAllowed: info.notAllowed, unitMismatch, faults });
  if (refusal) return refusal;

  const parts = limitParts(info);
  const cValue = readsC ? conc : R(1);
  const lc = mul(info.L, cValue);
  const mvd = div(lc, lam);
  return done(MODULE, {
    mvd: numeric(mvd, null),
    Lc: numeric(lc, 'EU/mL'),
    L: parts.L,
    c: numeric(cValue, readsC ? expectedUnit(info) : 'mL/mL'),
    cFixed: !readsC,
    lambda: numeric(lam, 'EU/mL'),
    technique,
    lambdaMeaning: technique === 'gel-clot' ? 'labelled-sensitivity' : 'lowest-standard',
    resultBlockOffered: technique !== 'gel-clot',
    denominator: parts.denominator,
    K: parts.K,
    M: parts.M,
    presetId: parts.presetId,
    kFromPreset: parts.kFromPreset,
  });
}
