// E20L-F03 mvdFromLimit: MVD = (L x c) / lambda in one exact computation (ELM-DT-04, -DT-12).
// The reading of the five arguments and the build of the result are separate, so that the
// result function of E20L-F05 reads the same arguments and builds the same object.
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

// Reads c and cUnit, which are read only when the denominator is known and is not mL
// (E20L-IN-04). Pushes the missing names and the value faults onto the lists given. Returns
// whether they are read, the E20-RC-03 verdict and the value of c. F03 and F07 both use it.
export function readConcentration(info, c, cUnit, missing, faults) {
  const readsC = info.kind !== null && info.kind !== 'mL';
  if (readsC) {
    if (isBlank(c)) missing.push('c');
    if (isBlank(cUnit)) missing.push('cUnit');
  }
  // E20-RC-03 is judged only when the denominator is known and the unit is text, and for
  // "other" only when its label is text.
  const unitIsText = typeof cUnit === 'string' && !isBlank(cUnit);
  const labelIsText = info.kind !== 'other' || info.label !== null;
  const unitMismatch = readsC && unitIsText && labelIsText && cUnit !== expectedUnit(info);
  let conc = null;
  if (readsC && !isBlank(c)) conc = readPositive('c', c, faults);
  if (readsC && !isBlank(cUnit) && typeof cUnit !== 'string') {
    faults.push({ fields: ['cUnit'], reason: REASONS.wrongForm });
  }
  return { readsC, unitMismatch, conc };
}

// Reads limit, technique, c, cUnit and lambda in argument order. Returns the names that are
// missing (step 1), unknown or not allowed (step 2), the unit mismatch (step 2) and the value
// faults (step 3), with the values that were read.
export function inspectMvd(limit, technique, c, cUnit, lambda) {
  const info = inspectLimit(limit);
  const missing = info.missing.slice();
  const unknown = info.unknown.slice();
  const faults = info.faults.slice();

  // Technique, then c and cUnit, then lambda.
  if (isBlank(technique)) missing.push('technique');
  else if (!isKnown(CLOSED_STRINGS.technique, technique)) unknown.push('technique');
  const { readsC, unitMismatch, conc } = readConcentration(info, c, cUnit, missing, faults);
  if (isBlank(lambda)) missing.push('lambda');

  let lam = null;
  if (!isBlank(lambda)) lam = readPositive('lambda', lambda, faults);

  return { info, missing, unknown, notAllowed: info.notAllowed.slice(), unitMismatch, faults, readsC, conc, lam };
}

// Builds the F03 result from a clean reading (no refusal applies).
export function buildMvd(read, technique) {
  const { info, readsC, conc, lam } = read;
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

export function mvdFromLimit(limit, technique, c, cUnit, lambda) {
  const read = inspectMvd(limit, technique, c, cUnit, lambda);
  const refusal = refusalFor(read);
  if (refusal) return refusal;
  return buildMvd(read, technique);
}
