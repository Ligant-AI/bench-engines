// E20L-F06 assessSuitability: recovery computed exactly against three ranges the user declared,
// with no verdict (ELM-SU-01 to -08, ELM-IN-11). The block is all or nothing: nothing is computed
// until every leaf is entered.
import { R, sub, mul, div, cmp, parse, done, engineBlock } from '../core.js';
import {
  MODULE, CODES, CLOSED_STRINGS, REASONS, PRESET_IDS, isBlank, isKnown, isObject, readText,
  refusalFor, rejectValues,
} from './shared.js';
import { numeric } from './numeric.js';
import { PRESET_RANGE } from './presets.js';

const P = 'suitability';

// A decimal text that must be zero or more. Pushes its fault and returns null when it is not.
function readNonNegative(name, v, faults) {
  const got = readText(v);
  if (!got.ok) {
    faults.push({ fields: [name], reason: got.reason });
    return null;
  }
  if (got.r.n < 0n) {
    faults.push({ fields: [name], reason: REASONS.negative });
    return null;
  }
  return got.r;
}

// Notes that a value was entered, so that `notEntered` can say whether any leaf was.
const see = (out, v) => { if (!isBlank(v)) out.entered = true; };

// An object slot. Blank gives an empty object (its leaves are then named missing); a present
// value of the wrong form is a fault of the slot and none of its members is required.
function slotOf(parent, key, path, out) {
  const v = parent[key];
  if (isBlank(v)) return {};
  if (!isObject(v)) {
    out.entered = true;
    out.faults.push({ fields: [path], reason: REASONS.wrongForm });
    return null;
  }
  return v;
}

function readCV(root, key, out) {
  const path = `${P}.${key}`;
  const o = slotOf(root, key, path, out);
  const got = { value: null, max: null };
  if (!o) return got;
  for (const m of ['value', 'max']) {
    if (isBlank(o[m])) out.missing.push(`${path}.${m}`);
    else {
      out.entered = true;
      got[m] = readNonNegative(`${path}.${m}`, o[m], out.faults);
    }
  }
  if (isBlank(o.source)) out.missing.push(`${path}.source`);
  else out.entered = true;
  return got;
}

function readRange(rec, out) {
  const path = `${P}.recovery.range`;
  const o = slotOf(rec, 'range', path, out);
  if (!o) return { low: null, high: null };
  return readRangeMembers(o, path, out);
}

// The members of a range object, named under `path`. F06 and F07 both read a range by this code.
export function readRangeMembers(o, path, out) {
  const got = { low: null, high: null };
  for (const m of ['form', 'low', 'high', 'source', 'presetId']) see(out, o[m]);
  const form = o.form;
  if (isBlank(form)) {
    out.missing.push(`${path}.form`);
    return got;
  }
  if (!isKnown(CLOSED_STRINGS.rangeForm, form)) {
    out.unknown.push(`${path}.form`);
    return got;
  }
  if (form === 'declared') {
    for (const m of ['low', 'high']) {
      if (isBlank(o[m])) out.missing.push(`${path}.${m}`);
      else {
        const r = readText(o[m]);
        if (r.ok) got[m] = r.r;
        else out.faults.push({ fields: [`${path}.${m}`], reason: r.reason });
      }
    }
    if (isBlank(o.source)) out.missing.push(`${path}.source`);
    if (got.low && got.high && cmp(got.low, got.high) > 0) {
      out.faults.push({ fields: [`${path}.low`, `${path}.high`], reason: REASONS.lowAboveHigh });
    }
    return got;
  }
  const id = o.presetId;
  if (isBlank(id)) out.missing.push(`${path}.presetId`);
  else if (!isKnown(PRESET_IDS, id)) out.unknown.push(`${path}.presetId`);
  else if (id !== 'preset-4') out.notAllowed.push(`${path}.presetId`);
  else {
    got.low = parse(PRESET_RANGE.low);
    got.high = parse(PRESET_RANGE.high);
  }
  return got;
}

export function assessSuitability(suitability) {
  const out = { missing: [], unknown: [], notAllowed: [], faults: [], entered: false };
  if (!isBlank(suitability) && !isObject(suitability)) {
    return rejectValues([{ fields: [P], reason: REASONS.wrongForm }]);
  }
  const root = isBlank(suitability) ? {} : suitability;

  const sample = readCV(root, 'sampleCV', out);
  const spike = readCV(root, 'spikeCV', out);

  const recPath = `${P}.recovery`;
  const rec = slotOf(root, 'recovery', recPath, out);
  let B = null;
  let A = null;
  let added = null;
  let basis = null;
  let range = { low: null, high: null };
  if (rec) {
    for (const m of ['B', 'A']) {
      let got = null;
      if (isBlank(rec[m])) out.missing.push(`${recPath}.${m}`);
      else {
        out.entered = true;
        got = readNonNegative(`${recPath}.${m}`, rec[m], out.faults);
      }
      if (m === 'B') B = got;
      else A = got;
    }
    if (isBlank(rec.added)) out.missing.push(`${recPath}.added`);
    else {
      out.entered = true;
      const got = readText(rec.added);
      if (!got.ok) out.faults.push({ fields: [`${recPath}.added`], reason: got.reason });
      else if (got.r.n <= 0n) out.faults.push({ fields: [`${recPath}.added`], reason: REASONS.notAboveZero });
      else added = got.r;
    }
    if (isBlank(rec.basis)) out.missing.push(`${recPath}.basis`);
    else {
      out.entered = true;
      if (isKnown(CLOSED_STRINGS.recoveryBasis, rec.basis)) basis = rec.basis;
      else out.unknown.push(`${recPath}.basis`);
    }
    range = readRange(rec, out);
  }

  if (out.missing.length) {
    return {
      status: 'incomplete', code: CODES.incomplete, missing: out.missing, notEntered: !out.entered,
      engine: engineBlock(MODULE),
    };
  }
  const refusal = refusalFor(out);
  if (refusal) return refusal;

  const value = mul(div(sub(B, A), added), R(100));
  const recoveryWithin = cmp(range.low, value) <= 0 && cmp(value, range.high) <= 0;
  const sampleWithin = cmp(sample.value, sample.max) <= 0;
  const spikeWithin = cmp(spike.value, spike.max) <= 0;
  const outside = [];
  if (!sampleWithin) outside.push('sample-cv');
  if (!spikeWithin) outside.push('spike-cv');
  if (!recoveryWithin) outside.push('recovery');

  const v = numeric(value, '%');
  const lowN = numeric(range.low, '%');
  const highN = numeric(range.high, '%');
  const looksEqual = (bound, order) => v.display === bound.display && order !== 0;
  const cv = (x) => ({
    value: numeric(x.value, '%'),
    max: numeric(x.max, '%'),
    state: cmp(x.value, x.max) <= 0 ? 'within' : 'outside',
  });
  return done(MODULE, {
    sampleCV: cv(sample),
    spikeCV: cv(spike),
    recovery: {
      value: v,
      B: numeric(B, 'EU/mL'),
      A: numeric(A, 'EU/mL'),
      added: numeric(added, 'EU/mL'),
      basis,
      low: lowN,
      high: highN,
      state: recoveryWithin ? 'within' : 'outside',
      printExact: looksEqual(lowN, cmp(value, range.low)) || looksEqual(highN, cmp(value, range.high)),
    },
    summary: outside.length === 0 ? 'all-within' : 'outside',
    outside,
  });
}
