// E10 activity conversions: E10R-F20 activityToMass and E10R-F21 massToActivity
// (docs/engine-spec-e10-scaling-activity.md r3.1, section 6). The specific activity (SA) is a
// declared input of every call; the engine holds none (E10R-NF-08).
import { cmp, mul, div, incomplete, rejected, done } from '../core.js';
import { isUnit, dimOf, factor } from './units.js';
import { M, ZERO, quant, text, okNum, isObj, blank } from './scaling.js';

const FORMS = ['single', 'bound', 'interval'];
const RELATIONS = ['>', '>=', '<', '<='];
const LOWER_OK = ['>', '>='];
const UPPER_OK = ['<', '<='];
const SA_DIMS = new Set(['saIU', 'saU']);
const FAMILY = { saIU: 'IU', saU: 'U', actIU: 'IU', actU: 'U', actConcIU: 'IU', actConcU: 'U' };
const FLIP = { '>': '<', '>=': '<=', '<': '>', '<=': '>=' };

// SA limits in the order the spec lists the members; each is {path, value, relation?, role}.
function limitsOf(SA) {
  if (SA.form === 'single') return [{ path: 'SA', node: SA, role: 'single', valueField: 'SA.value' }];
  if (SA.form === 'bound') return [{ path: 'SA', node: SA, role: 'bound', valueField: 'SA.value', relField: 'SA.relation' }];
  return [
    { path: 'SA.lower', node: SA.lower, role: 'lower', valueField: 'SA.lower', relField: 'SA.lower.relation' },
    { path: 'SA.upper', node: SA.upper, role: 'upper', valueField: 'SA.upper', relField: 'SA.upper.relation' },
  ];
}

// Returns {refusal} or {limits: [{role, s, relation}], unit}. `side` describes the other args:
// other = [name, value] pairs before SA, after = [name, value] pairs after SA (toUnit).
function convert(kind, first, firstUnit, SA, toUnit, firstName, firstUnitName) {
  const A = firstName;
  const AU = firstUnitName;
  // ---- step 1: incomplete, in argument order ----
  const missing = [];
  if (blank(first)) missing.push(A);
  if (blank(firstUnit)) missing.push(AU);
  if (blank(SA)) missing.push('SA');
  else if (isObj(SA)) {
    if (blank(SA.form)) missing.push('SA.form');
    else if (FORMS.includes(SA.form)) {
      if (SA.form === 'interval') {
        if (blank(SA.unit)) missing.push('SA.unit');
        for (const side of ['lower', 'upper']) {
          if (blank(SA[side])) missing.push(`SA.${side}`);
          else if (isObj(SA[side])) {
            if (blank(SA[side].value)) missing.push(`SA.${side}.value`);
            if (blank(SA[side].relation)) missing.push(`SA.${side}.relation`);
          }
        }
      } else {
        if (SA.form === 'bound' && blank(SA.relation)) missing.push('SA.relation');
        if (blank(SA.value)) missing.push('SA.value');
        if (blank(SA.unit)) missing.push('SA.unit');
      }
    } else if (blank(SA.unit)) missing.push('SA.unit');
  }
  if (blank(toUnit)) missing.push('toUnit');
  if (missing.length) return { refusal: incomplete(M, missing) };

  // a non-object SA cannot be examined further; it is refused with the value conditions
  const saObj = isObj(SA);
  const lims = saObj && FORMS.includes(SA.form) ? limitsOf(SA).filter((l) => isObj(l.node)) : [];

  // ---- step 2: unknown units and closed strings (E10-RC-01) ----
  const unknown = [];
  if (!isUnit(firstUnit)) unknown.push(AU);
  if (saObj) {
    if (!FORMS.includes(SA.form)) unknown.push('SA.form');
    if (SA.form === 'interval') {
      if (!isUnit(SA.unit)) unknown.push('SA.unit');
      for (const l of lims) if (!RELATIONS.includes(l.node.relation)) unknown.push(l.relField);
    } else {
      if (SA.form === 'bound' && !RELATIONS.includes(SA.relation)) unknown.push('SA.relation');
      if (!isUnit(SA.unit)) unknown.push('SA.unit');
    }
  }
  if (!isUnit(toUnit)) unknown.push('toUnit');
  if (unknown.length) return { refusal: rejected(M, 'E10-RC-01', unknown, []) };

  // ---- step 3: wrong dimension, pairing, wrong-way relation (E10-RC-02) ----
  const wrong = [];
  const fd = dimOf(firstUnit);
  const sd = saObj ? dimOf(SA.unit) : null;
  const td = dimOf(toUnit);
  const saOk = SA_DIMS.has(sd);
  const wrongWay = [];
  for (const l of lims) {
    if (l.role === 'lower' && !LOWER_OK.includes(l.node.relation)) wrongWay.push(l.relField);
    if (l.role === 'upper' && !UPPER_OK.includes(l.node.relation)) wrongWay.push(l.relField);
  }
  if (kind === 'toMass') {
    const fOk = fd === 'actIU' || fd === 'actU' || fd === 'actConcIU' || fd === 'actConcU';
    if (!fOk) wrong.push(AU);
    if (saObj && !saOk) wrong.push('SA.unit');
    if (fOk && saOk && FAMILY[fd] !== FAMILY[sd]) wrong.push(AU, 'SA.unit');
    wrong.push(...wrongWay);
    const wantTo = fOk ? (fd === 'actIU' || fd === 'actU' ? 'mass' : 'massConc') : null;
    if (wantTo ? td !== wantTo : td !== 'mass' && td !== 'massConc') wrong.push('toUnit');
  } else {
    const fOk = fd === 'mass' || fd === 'massConc';
    if (!fOk) wrong.push(AU);
    if (saObj && !saOk) wrong.push('SA.unit');
    wrong.push(...wrongWay);
    const toActivity = td === 'actIU' || td === 'actU' || td === 'actConcIU' || td === 'actConcU';
    const wantTo = fOk ? (fd === 'mass' ? ['actIU', 'actU'] : ['actConcIU', 'actConcU']) : null;
    if (!toActivity || (wantTo && !wantTo.includes(td))) wrong.push('toUnit');
    else if (saOk && FAMILY[td] !== FAMILY[sd]) wrong.push('SA.unit', 'toUnit');
  }
  if (wrong.length) {
    const order = [AU, 'SA.unit', 'SA.relation', 'SA.lower.relation', 'SA.upper.relation', 'toUnit'];
    const fields = order.filter((k) => wrong.includes(k));
    return { refusal: rejected(M, 'E10-RC-02', fields, []) };
  }

  // ---- step 4: value conditions together (CCS-RF-03) ----
  const bad = [];
  const x = text(first);
  if (!okNum(x, 'nonneg')) bad.push(A);
  if (!saObj) bad.push('SA');
  const limits = [];
  for (const l of lims) {
    const s = text(l.node.value);
    if (!okNum(s, 'pos')) bad.push(l.valueField);
    else limits.push({ role: l.role, s, relation: l.role === 'single' ? null : l.node.relation });
  }
  let message;
  if (SA.form === 'interval' && limits.length === 2) {
    const c = cmp(limits[0].s, limits[1].s);
    if (c >= 0) {
      bad.push('SA.lower', 'SA.upper');
      if (c === 0) message = 'the two limits are equal; enter it as a single value';
    }
  }
  if (bad.length) return { refusal: rejected(M, 'CCS-RF-03', bad, [], message ? { message } : {}) };
  return { x, limits };
}

// Result shape: single or zero gives the common shape; a bound or interval gives lower/upper.
function shape(x, limits, toUnit, SAform, compute, direction) {
  if (x.n === 0n) return done(M, quant(ZERO, toUnit));
  if (SAform === 'single') return done(M, quant(compute(limits[0].s), toUnit));
  let lower = null;
  let upper = null;
  for (const l of limits) {
    const v = compute(l.s);
    const rel = direction === 'flip' ? FLIP[l.relation] : l.relation;
    const end = { value: quant(v, toUnit).value, exact: quant(v, toUnit).exact, relation: rel };
    // to mass the direction flips: a SA lower limit gives the mass upper end. To activity it is kept.
    const isUpper = direction === 'flip' ? (l.role === 'lower' || l.relation === '>' || l.relation === '>=') : (l.role === 'upper' || l.relation === '<' || l.relation === '<=');
    if (isUpper) upper = end; else lower = end;
  }
  return done(M, { form: 'bounded', unit: toUnit, lower, upper });
}

// E10R-F20: mass = activity / SA, one chain per limit.
export function activityToMass(a, aUnit, SA, toUnit) {
  const got = convert('toMass', a, aUnit, SA, toUnit, 'a', 'aUnit');
  if (got.refusal) return got.refusal;
  const { x, limits } = got;
  const compute = (s) => div(div(mul(x, factor(aUnit)), mul(s, factor(SA.unit))), factor(toUnit));
  return shape(x, limits, toUnit, SA.form, compute, 'flip');
}

// E10R-F21: activity = mass x SA, one chain per limit.
export function massToActivity(m, mUnit, SA, toUnit) {
  const got = convert('toActivity', m, mUnit, SA, toUnit, 'm', 'mUnit');
  if (got.refusal) return got.refusal;
  const { x, limits } = got;
  const compute = (s) => div(mul(mul(x, factor(mUnit)), mul(s, factor(SA.unit))), factor(toUnit));
  return shape(x, limits, toUnit, SA.form, compute, 'keep');
}
