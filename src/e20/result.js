// E20L-F05 assessResult: everything the result block needs from the raw inputs, in one call
// (ELM-DT-05 to -11, ELM-FL-01 to -04, ELM-FL-15, ELM-SU-08). It takes raw inputs, never an
// earlier result, and it builds the dilution and MVD objects by the same code as F03 and F04.
// No value of the screening function (F07) enters this call (E20L-NF-07).
import { R, mul, div, cmp, done } from '../core.js';
import {
  MODULE, CLOSED_STRINGS, REASONS, GREATER_QUALIFIER, isBlank, isKnown, readText, refusalFor,
} from './shared.js';
import { numeric } from './numeric.js';
import { readPositive } from './limit.js';
import { inspectMvd, buildMvd } from './mvd.js';
import { readDF, dilutionRelation } from './dilution.js';
import { assessSuitability } from './suitability.js';

const GREATER_OR_EQUAL = '≥';

// The result text (E20L-F05, NAD-2026-11-24-55): three tests in this order, the first match wins,
// all before the plain-decimal pattern. Pushes its fault and returns null when it is not a quantity.
function readResultValue(v, faults) {
  const field = ['resultValue'];
  if (typeof v === 'string') {
    const first = v.trimStart()[0];
    if (first === GREATER_QUALIFIER || first === GREATER_OR_EQUAL) {
      faults.push({ fields: field, reason: REASONS.greaterThanNotAQuantity });
      return null;
    }
  }
  const got = readText(v);
  if (!got.ok) {
    faults.push({ fields: field, reason: got.reason });
    return null;
  }
  if (got.r.n < 0n) {
    faults.push({ fields: field, reason: REASONS.negative });
    return null;
  }
  return got.r;
}

const stateOf = (order) => (order < 0 ? 'below' : order === 0 ? 'equal' : 'above');

// True when two numeric objects print alike and are not the same exact value.
const looksEqual = (a, b, order) => a.display === b.display && order !== 0;

export function assessResult(
  limit, technique, c, cUnit, lambda, highestStandard, DF, resultQualifier, resultValue, reagentType, suitability,
) {
  const read = inspectMvd(limit, technique, c, cUnit, lambda);
  const reading = resultQualifier === '=';

  // Step (1): signature order. highestStandard is required only for the qualifier "=".
  const missing = read.missing.slice();
  if (reading && isBlank(highestStandard)) missing.push('highestStandard');
  if (isBlank(DF)) missing.push('DF');
  if (isBlank(resultQualifier)) missing.push('resultQualifier');
  if (isBlank(resultValue)) missing.push('resultValue');

  // Step (2): closed strings. The qualifier ">" is a value fault and not an unknown string.
  const unknown = read.unknown.slice();
  if (!isBlank(resultQualifier) && !isKnown(CLOSED_STRINGS.resultQualifier, resultQualifier)
    && resultQualifier !== GREATER_QUALIFIER) unknown.push('resultQualifier');
  if (!isBlank(reagentType) && !isKnown(CLOSED_STRINGS.reagentType, reagentType)) unknown.push('reagentType');
  const notAllowed = read.notAllowed.slice();
  if (technique === 'gel-clot') notAllowed.push('technique');

  // Step (3): every value fault of the call together, argument order.
  const faults = read.faults.slice();
  let highest = null;
  if (reading && !isBlank(highestStandard)) {
    highest = readPositive('highestStandard', highestStandard, faults);
    if (highest && read.lam && cmp(highest, read.lam) <= 0) {
      faults.push({ fields: ['lambda', 'highestStandard'], reason: REASONS.highestNotAboveLambda });
    }
  }
  let df = null;
  if (!isBlank(DF)) df = readDF(DF, faults);
  if (resultQualifier === GREATER_QUALIFIER) {
    faults.push({ fields: ['resultQualifier'], reason: REASONS.greaterThanNotAQuantity });
  }
  let C = null;
  if (!isBlank(resultValue)) C = readResultValue(resultValue, faults);

  const refusal = refusalFor({ missing, unknown, notAllowed, unitMismatch: read.unitMismatch, faults });
  if (refusal) return refusal;

  // Suitability is judged here, and none of its faults is a refusal of this call (NAD-2026-11-24-58).
  const suit = assessSuitability(suitability);

  const { info, lam } = read;
  const cValue = read.readsC ? read.conc : R(1);
  const L = info.L;
  const mvd = buildMvd(read, technique);
  const dilution = dilutionRelation(df, div(mul(L, cValue), lam));

  let rawReading = { applies: false };
  if (reading) {
    const raw = div(C, df);
    const rawN = numeric(raw, 'EU/mL');
    const orderLow = cmp(raw, lam);
    const orderHigh = cmp(raw, highest);
    const position = orderLow < 0 ? 'below-lowest' : orderHigh > 0 ? 'above-highest' : 'within';
    rawReading = {
      applies: true,
      raw: rawN,
      position,
      belowLowestStandard: position === 'below-lowest',
      printExact: looksEqual(rawN, mvd.lambda, orderLow) || looksEqual(rawN, numeric(highest, 'EU/mL'), orderHigh),
    };
  }

  const valueInUnit = div(C, cValue);
  const inLimitUnit = {
    role: reading ? 'result' : 'floor',
    value: numeric(valueInUnit, mvd.L.unit),
    conversionShown: read.readsC,
  };
  const order = cmp(valueInUnit, L);
  const relation = { state: stateOf(order), printExact: looksEqual(inLimitUnit.value, mvd.L, order) };

  const y = mul(lam, df);
  const sensitivity = numeric(y, 'EU/mL');
  let floorDiffers = null;
  let floorPrintExact = null;
  if (!reading) {
    const floorOrder = cmp(C, y);
    floorDiffers = floorOrder !== 0;
    floorPrintExact = looksEqual(numeric(C, 'EU/mL'), sensitivity, floorOrder);
  }

  // The reasons that withhold the comparison, in the fixed order.
  const withheld = [];
  let suitabilityMissing = null;
  let suitabilityOutside = null;
  if (dilution.relation === 'above') withheld.push('df-above-mvd');
  if (reading && rawReading.position !== 'within') withheld.push('raw-reading-outside');
  if (suit.status === 'incomplete' && suit.notEntered) {
    withheld.push('suitability-not-entered');
  } else if (suit.status === 'incomplete') {
    withheld.push('suitability-incomplete');
    suitabilityMissing = suit.missing;
  } else if (suit.status === 'rejected') {
    withheld.push('suitability-incomplete');
    suitabilityMissing = suit.fields;
  } else if (suit.summary === 'outside') {
    withheld.push('suitability-outside');
    suitabilityOutside = suit.outside;
  }
  if (isBlank(reagentType)) withheld.push('reagent-not-selected');

  return done(MODULE, {
    mvd,
    dilution,
    rawReading,
    inLimitUnit,
    relation,
    relationKind: reading ? 'measured' : 'upper-bound',
    sensitivity,
    floorDiffers,
    floorPrintExact,
    suitability: suit,
    withheld,
    suitabilityMissing,
    suitabilityOutside,
    relationLineShown: withheld.length === 0,
    reagentType: isBlank(reagentType) ? null : reagentType,
  });
}
