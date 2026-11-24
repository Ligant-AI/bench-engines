// E20L-F01 resolveLimit, and the limit reader that F03 and later functions share.
// One reader follows the order of statuses of section 4.1: it collects the names that are
// missing (step 1), the unknown and not-allowed closed strings (step 2) and the value faults
// (step 3) in member order, and the caller decides which step applies.
import { div, parse, done } from '../core.js';
import {
  MODULE, CLOSED_STRINGS, REASONS, PRESET_IDS, isBlank, isKnown, isObject, readText, refusalFor,
} from './shared.js';
import { numeric } from './numeric.js';
import { PRESET_DIGITS } from './presets.js';

const KIND_OF_UNIT = { 'EU/mL': 'mL', 'EU/mg': 'mg', 'EU/Unit': 'Unit', other: 'other' };

// A decimal text that must be above zero. Pushes its fault and returns null when it is not.
export function readPositive(name, v, faults) {
  const got = readText(v);
  if (!got.ok) {
    faults.push({ fields: [name], reason: got.reason });
    return null;
  }
  if (got.r.n <= 0n) {
    faults.push({ fields: [name], reason: REASONS.notAboveZero });
    return null;
  }
  return got.r;
}

// The typed "other" label. Blank is missing; a present non-text value is the wrong form.
// The text is kept exactly as typed (section 5.2).
function readLabel(limit, out) {
  const v = limit.otherLabel;
  if (isBlank(v)) {
    out.missing.push('limit.otherLabel');
  } else if (typeof v !== 'string') {
    out.faults.push({ fields: ['limit.otherLabel'], reason: REASONS.wrongForm });
  } else {
    out.label = v;
  }
}

// The unit of M: closed string, then the label when it is "other".
function readMunit(limit, out) {
  const u = limit.Munit;
  if (isBlank(u)) {
    out.missing.push('limit.Munit');
  } else if (!isKnown(CLOSED_STRINGS.limitMunit, u)) {
    out.unknown.push('limit.Munit');
  } else {
    out.kind = u;
    out.label = u === 'other' ? null : u;
    if (u === 'other') readLabel(limit, out);
  }
}

function readMember(limit, name, out) {
  const v = limit[name];
  if (isBlank(v)) {
    out.missing.push(`limit.${name}`);
    return null;
  }
  return readPositive(`limit.${name}`, v, out.faults);
}

function needSource(limit, name, out) {
  if (isBlank(limit[name])) out.missing.push(`limit.${name}`);
}

function typedLimit(limit, out) {
  out.L = readMember(limit, 'value', out);
  const u = limit.unit;
  if (isBlank(u)) {
    out.missing.push('limit.unit');
  } else if (!isKnown(CLOSED_STRINGS.limitUnit, u)) {
    out.unknown.push('limit.unit');
  } else {
    out.kind = KIND_OF_UNIT[u];
    out.label = out.kind === 'other' ? null : out.kind;
    if (out.kind === 'other') readLabel(limit, out);
  }
  needSource(limit, 'source', out);
}

function kmLimit(limit, out) {
  out.K = readMember(limit, 'K', out);
  needSource(limit, 'KSource', out);
  out.M = readMember(limit, 'M', out);
  readMunit(limit, out);
  needSource(limit, 'MSource', out);
  if (out.K && out.M) out.L = div(out.K, out.M);
}

function presetLimit(limit, out) {
  const id = limit.presetId;
  if (isBlank(id)) {
    out.missing.push('limit.presetId');
    return;
  }
  if (!isKnown(PRESET_IDS, id)) {
    out.unknown.push('limit.presetId');
    return;
  }
  if (id === 'preset-4' || id === 'preset-5') {
    out.notAllowed.push('limit.presetId');
    return;
  }
  out.presetId = id;
  if (id === 'preset-3') {
    out.kind = 'mL';
    out.label = 'mL';
    out.L = parse(PRESET_DIGITS[id]);
    return;
  }
  out.kFromPreset = true;
  out.K = parse(PRESET_DIGITS[id]);
  out.M = readMember(limit, 'M', out);
  readMunit(limit, out);
  needSource(limit, 'MSource', out);
  if (out.M) out.L = div(out.K, out.M);
}

// Reads one `limit` argument. `kind` is the denominator kind once it is known, else null.
export function inspectLimit(limit) {
  const out = {
    missing: [], unknown: [], notAllowed: [], faults: [],
    form: null, kind: null, label: null, presetId: null, kFromPreset: false, L: null, K: null, M: null,
  };
  if (isBlank(limit)) {
    out.missing.push('limit');
    return out;
  }
  if (!isObject(limit)) {
    out.faults.push({ fields: ['limit'], reason: REASONS.wrongForm });
    return out;
  }
  const form = limit.form;
  if (isBlank(form)) {
    out.missing.push('limit.form');
    return out;
  }
  if (!isKnown(CLOSED_STRINGS.limitForm, form)) {
    out.unknown.push('limit.form');
    return out;
  }
  out.form = form;
  if (form === 'typed') typedLimit(limit, out);
  else if (form === 'km') kmLimit(limit, out);
  else presetLimit(limit, out);
  return out;
}

// The result members every limit-based result shares, built member by member (no member of
// the argument is copied across, so no source text can be returned: E20L-IN-05).
export function limitParts(info) {
  const label = info.label;
  return {
    form: info.form,
    L: numeric(info.L, `EU/${label}`),
    denominator: { kind: info.kind, label },
    K: info.K ? numeric(info.K, 'EU/kg') : null,
    M: info.M ? numeric(info.M, `${label}/kg`) : null,
    presetId: info.presetId,
    kFromPreset: info.kFromPreset,
  };
}

export function resolveLimit(limit) {
  const info = inspectLimit(limit);
  const refusal = refusalFor(info);
  if (refusal) return refusal;
  return done(MODULE, limitParts(info));
}
