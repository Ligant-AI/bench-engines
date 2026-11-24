// E20L-F07 screenDilutions: the screening computations per curve and channel (ELM-IE-02 to -08).
// A pure function of its arguments: no module state, no value of it enters any other function
// (E20L-NF-07). It selects, ranks and recommends none.
import { R, rat, mul, div, cmp, parse, done } from '../core.js';
import {
  MODULE, CLOSED_STRINGS, REASONS, isBlank, isKnown, isObject, readText, refusalFor,
} from './shared.js';
import { numeric } from './numeric.js';
import { inspectLimit, readPositive } from './limit.js';
import { readConcentration } from './mvd.js';
import { readDF, dilutionRelation } from './dilution.js';
import { readRangeMembers } from './suitability.js';
import { PRESET_R } from './presets.js';

const wrong = (name) => ({ fields: [name], reason: REASONS.wrongForm });
const absolute = (x) => (x.n < 0n ? rat(-x.n, x.d) : x);

// The |r| criterion (ELM-IE-04). Read only when an r is entered.
function readCriterion(criterion, out) {
  const got = { value: null };
  if (isBlank(criterion)) {
    out.missing.push('criterion');
    return got;
  }
  if (!isObject(criterion)) {
    out.faults.push(wrong('criterion'));
    return got;
  }
  const form = criterion.form;
  if (isBlank(form)) {
    out.missing.push('criterion.form');
    return got;
  }
  if (!isKnown(CLOSED_STRINGS.rangeForm, form)) {
    out.unknown.push('criterion.form');
    return got;
  }
  if (form === 'declared') {
    if (isBlank(criterion.value)) out.missing.push('criterion.value');
    else {
      const r = readText(criterion.value);
      if (!r.ok) out.faults.push({ fields: ['criterion.value'], reason: r.reason });
      else if (r.r.n < 0n || cmp(r.r, R(1)) > 0) {
        out.faults.push({ fields: ['criterion.value'], reason: REASONS.outsideZeroToOne });
      } else got.value = r.r;
    }
    if (isBlank(criterion.source)) out.missing.push('criterion.source');
    return got;
  }
  const id = criterion.presetId;
  if (isBlank(id)) out.missing.push('criterion.presetId');
  else if (!isKnown(CLOSED_STRINGS.presetId, id)) out.unknown.push('criterion.presetId');
  else if (id !== 'preset-5') out.notAllowed.push('criterion.presetId');
  else got.value = parse(PRESET_R);
  return got;
}

// One channel: DF and the instrument's reported recovery. Any decimal is a recovery (NAD-2026-11-24-56).
function readChannel(ch, path, out) {
  const got = { df: null, rec: null };
  if (isBlank(ch)) {
    out.missing.push(path);
    return got;
  }
  if (!isObject(ch)) {
    out.faults.push(wrong(path));
    return got;
  }
  if (isBlank(ch.DF)) out.missing.push(`${path}.DF`);
  else got.df = readDF(ch.DF, out.faults, `${path}.DF`);
  if (isBlank(ch.recovery)) out.missing.push(`${path}.recovery`);
  else {
    const r = readText(ch.recovery);
    if (!r.ok) out.faults.push({ fields: [`${path}.recovery`], reason: r.reason });
    else got.rec = r.r;
  }
  return got;
}

// One curve: lambda, the optional r, then its channels.
function readCurve(cv, path, out) {
  const got = { lam: null, r: null, channels: [] };
  if (isBlank(cv)) {
    out.missing.push(path);
    return got;
  }
  if (!isObject(cv)) {
    out.faults.push(wrong(path));
    return got;
  }
  if (isBlank(cv.lambda)) out.missing.push(`${path}.lambda`);
  else got.lam = readPositive(`${path}.lambda`, cv.lambda, out.faults);
  if (!isBlank(cv.r)) {
    const r = readText(cv.r);
    if (!r.ok) out.faults.push({ fields: [`${path}.r`], reason: r.reason });
    else if (cmp(r.r, R(-1)) < 0 || cmp(r.r, R(1)) > 0) {
      out.faults.push({ fields: [`${path}.r`], reason: REASONS.outsideMinusOneToOne });
    } else got.r = r.r;
  }
  const list = cv.channels;
  const at = `${path}.channels`;
  if (isBlank(list) || (Array.isArray(list) && list.length === 0)) out.missing.push(at);
  else if (!Array.isArray(list)) out.faults.push(wrong(at));
  else {
    // An index loop, not forEach: forEach skips the empty slots of a sparse array (E20L-IN-02).
    for (let j = 0; j < list.length; j += 1) got.channels.push(readChannel(list[j], `${at}[${j}]`, out));
  }
  return got;
}

// Distinct exact values, ascending. Works on a copy.
function distinctAscending(values) {
  const sorted = values.slice().sort(cmp);
  const out = [];
  for (const v of sorted) if (!out.length || cmp(out[out.length - 1], v) !== 0) out.push(v);
  return out;
}

export function screenDilutions(limit, c, cUnit, recoveryRange, criterion, curves) {
  const out = { missing: [], unknown: [], notAllowed: [], faults: [], entered: false };

  // The limit: null, absent and blank mean no limit declared (not a missing field).
  const declared = !isBlank(limit);
  let info = null;
  let readsC = false;
  let unitMismatch = false;
  let conc = null;
  if (declared) {
    info = inspectLimit(limit);
    out.missing.push(...info.missing);
    out.unknown.push(...info.unknown);
    out.notAllowed.push(...info.notAllowed);
    out.faults.push(...info.faults);
    ({ readsC, unitMismatch, conc } = readConcentration(info, c, cUnit, out.missing, out.faults));
  }

  let range = { low: null, high: null };
  if (isBlank(recoveryRange)) out.missing.push('recoveryRange');
  else if (!isObject(recoveryRange)) out.faults.push(wrong('recoveryRange'));
  else range = readRangeMembers(recoveryRange, 'recoveryRange', out);

  // The criterion is required and read only when some curve has an r present and not blank.
  const rEntered = Array.isArray(curves) && curves.some((cv) => isObject(cv) && !isBlank(cv.r));
  const crit = rEntered ? readCriterion(criterion, out) : { value: null };

  const read = [];
  if (isBlank(curves) || (Array.isArray(curves) && curves.length === 0)) out.missing.push('curves');
  else if (!Array.isArray(curves)) out.faults.push(wrong('curves'));
  else {
    // An index loop, not forEach: forEach skips the empty slots of a sparse array (E20L-IN-02).
    for (let i = 0; i < curves.length; i += 1) read.push(readCurve(curves[i], `curves[${i}]`, out));
  }

  const refusal = refusalFor({
    missing: out.missing, unknown: out.unknown, notAllowed: out.notAllowed, unitMismatch, faults: out.faults,
  });
  if (refusal) return refusal;

  const lc = declared ? mul(info.L, readsC ? conc : R(1)) : null;
  const shown = read.map((cv) => {
    const mvd = lc ? div(lc, cv.lam) : null;
    const channels = cv.channels.map((ch) => {
      const dilution = mvd ? dilutionRelation(ch.df, mvd) : null;
      const sensitivity = mul(cv.lam, ch.df);
      return {
        df: ch.df,
        rec: ch.rec,
        within: cmp(range.low, ch.rec) <= 0 && cmp(ch.rec, range.high) <= 0,
        sensitivity,
        ratio: lc ? div(sensitivity, lc) : null,
        above: dilution ? dilution.relation === 'above' : null,
        printExact: dilution ? dilution.printExact : null,
      };
    });
    let curveState = 'not-entered';
    if (cv.r) curveState = cmp(absolute(cv.r), crit.value) >= 0 ? 'within' : 'outside';
    for (const ch of channels) ch.listed = ch.within && ch.above !== true && curveState !== 'outside';

    const listedDF = distinctAscending(channels.filter((ch) => ch.listed).map((ch) => ch.df));
    let notConsecutive = null;
    if (listedDF.length >= 2) {
      const low = listedDF[0];
      const high = listedDF[listedDF.length - 1];
      const inside = channels
        .filter((ch) => cmp(ch.df, low) > 0 && cmp(ch.df, high) < 0)
        .filter((ch) => !listedDF.some((x) => cmp(x, ch.df) === 0))
        .map((ch) => ch.df);
      const between = distinctAscending(inside);
      if (between.length) {
        notConsecutive = {
          listed: listedDF.map((x) => numeric(x, null)),
          between: between.map((x) => numeric(x, null)),
        };
      }
    }
    return {
      lambda: numeric(cv.lam, 'EU/mL'),
      mvd: mvd ? numeric(mvd, null) : null,
      r: cv.r ? numeric(cv.r, null) : null,
      curveState,
      channels: channels.map((ch) => ({
        DF: numeric(ch.df, null),
        recovery: numeric(ch.rec, '%'),
        recoveryState: ch.within ? 'within' : 'outside',
        sensitivity: numeric(ch.sensitivity, 'EU/mL'),
        ratio: ch.ratio ? numeric(ch.ratio, null) : null,
        dfAboveMvd: ch.above,
        printExact: ch.printExact,
        listed: ch.listed,
      })),
      listed: channels.filter((ch) => ch.listed).map((ch) => numeric(ch.df, null)),
      notConsecutive,
    };
  });
  return done(MODULE, { mvdShown: declared, curves: shown });
}
