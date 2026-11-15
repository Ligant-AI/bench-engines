// E10 scaling and activity, part 1: E10R-F13 to E10R-F16, E10R-F18, E10R-F19, E10R-F22
// (docs/engine-spec-e10-scaling-activity.md r3.1 with its errata and E10R-AMD-1, AMD-2-r2).
// Every result is one exact rational chain (BigInt), scaled to toUnit, rounded nowhere,
// except roundDeclared (F19), which rounds `exact` under the user's declared rule.
// Order of statuses (conversions spec section 2): incomplete, unknown (E10-RC-01),
// wrong dimension (E10-RC-02), then all value conditions together (CCS-RF-03).
import { R, rat, add, sub, mul, div, cmp, parse, toNumber, isBlank, incomplete, rejected, done } from '../core.js';
import { isUnit, dimOf, factor } from './units.js';

export const M = 'E10';
export const ZERO = R(0);
const HUNDRED = R(100);

// ---- shared helpers (also used by activity.js and fill.js) ----
export const val = (r) => Number(toNumber(r));
export const ex = (r) => ({ num: r.n.toString(), den: r.d.toString() });
export const quant = (r, unit) => ({ value: val(r), unit, exact: ex(r) });
export const unitDim = (u) => (isUnit(u) ? dimOf(u) : null);
// plain decimal text only (E10C-IN-01); a JS number, bigint or object is refused
export const text = (v) => (typeof v === 'string' ? parse(v) : null);
export const okNum = (r, kind) => r !== null && (kind === 'pos' ? cmp(r, ZERO) > 0 : kind === 'nonneg' ? cmp(r, ZERO) >= 0 : cmp(r, R(1)) >= 0);
export const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isBlank2 = (v) => v === undefined || isBlank(v);
export { isBlank2 as blank };

// Steps 1 to 3 for the scalar functions. args: [name, value, kind] with kind 'unit',
// 'closed' (array of allowed strings as 4th element) or a number kind ('nonneg', 'pos', 'ge1').
// wrongFn(dims, vals) returns {fields, message?}. Returns a refusal or null.
function gates(args, wrongFn) {
  const missing = args.filter(([, v]) => isBlank2(v)).map(([k]) => k);
  if (missing.length) return incomplete(M, missing);
  const unknown = args
    .filter(([, v, kind, allowed]) => (kind === 'unit' ? !isUnit(v) : kind === 'closed' ? !allowed.includes(v) : false))
    .map(([k]) => k);
  if (unknown.length) return rejected(M, 'E10-RC-01', unknown, []);
  const dims = {};
  const vals = {};
  for (const [k, v, kind] of args) {
    if (kind === 'unit') dims[k] = dimOf(v);
    else if (kind === 'closed') vals[k] = v;
  }
  const wrong = wrongFn(dims, vals);
  if (wrong.fields.length) return rejected(M, 'E10-RC-02', wrong.fields, [], wrong.message ? { message: wrong.message } : {});
  return null;
}

// Step 4 for the scalar numeric args; returns {nums} or {refusal}.
function numbers(args, extraBad = () => []) {
  const nums = {};
  const bad = [];
  for (const [k, v, kind] of args) {
    if (kind === 'unit' || kind === 'closed') continue;
    const r = text(v);
    if (!okNum(r, kind)) bad.push(k);
    else nums[k] = r;
  }
  const more = extraBad(nums);
  const fields = args.map(([k]) => k).filter((k) => bad.includes(k) || more.includes(k));
  return fields.length ? { refusal: rejected(M, 'CCS-RF-03', fields, []) } : { nums };
}

// ---- E10R-F13 scaleToVolume ----
const SCALABLE = new Set(['mass', 'volume', 'amount', 'actIU', 'actU']);
const CONCENTRATION = new Set(['massConc', 'molarConc', 'actConcIU', 'actConcU']);

export function scaleToVolume(q, unit, Vfrom, VfromUnit, Vto, VtoUnit, toUnit) {
  const args = [
    ['q', q, 'nonneg'], ['unit', unit, 'unit'], ['Vfrom', Vfrom, 'pos'], ['VfromUnit', VfromUnit, 'unit'],
    ['Vto', Vto, 'pos'], ['VtoUnit', VtoUnit, 'unit'], ['toUnit', toUnit, 'unit'],
  ];
  const stop = gates(args, (d) => {
    const fields = [];
    let message;
    const unitOk = SCALABLE.has(d.unit);
    if (!unitOk) {
      fields.push('unit');
      if (CONCENTRATION.has(d.unit)) message = 'a concentration does not scale with the final volume';
    }
    if (d.VfromUnit !== 'volume') fields.push('VfromUnit');
    if (d.VtoUnit !== 'volume') fields.push('VtoUnit');
    if (unitOk && d.toUnit !== d.unit) fields.push('toUnit');
    return { fields, message };
  });
  if (stop) return stop;
  const { nums, refusal } = numbers(args);
  if (refusal) return refusal;
  const factorV = div(mul(nums.Vto, factor(VtoUnit)), mul(nums.Vfrom, factor(VfromUnit)));
  const r = div(mul(mul(nums.q, factor(unit)), factorV), factor(toUnit));
  return done(M, quant(r, toUnit));
}

// ---- E10R-F14 volumeFromAmount ----
const PAIRS = { amount: 'molarConc', mass: 'massConc', actIU: 'actConcIU', actU: 'actConcU' };

export function volumeFromAmount(n, nUnit, c, cUnit, toUnit) {
  const args = [['n', n, 'nonneg'], ['nUnit', nUnit, 'unit'], ['c', c, 'pos'], ['cUnit', cUnit, 'unit'], ['toUnit', toUnit, 'unit']];
  const stop = gates(args, (d) => {
    const fields = [];
    if (PAIRS[d.nUnit] !== d.cUnit) fields.push('nUnit', 'cUnit');
    if (d.toUnit !== 'volume') fields.push('toUnit');
    return { fields };
  });
  if (stop) return stop;
  const { nums, refusal } = numbers(args);
  if (refusal) return refusal;
  const r = div(div(mul(nums.n, factor(nUnit)), mul(nums.c, factor(cUnit))), factor(toUnit));
  return done(M, quant(r, toUnit));
}

// ---- E10R-F22 activityAmountFromConcentration ----
const FAMILY_AMOUNT = { actConcIU: 'actIU', actConcU: 'actU' };

export function activityAmountFromConcentration(c, cUnit, V, Vunit, toUnit) {
  const args = [['c', c, 'nonneg'], ['cUnit', cUnit, 'unit'], ['V', V, 'pos'], ['Vunit', Vunit, 'unit'], ['toUnit', toUnit, 'unit']];
  const stop = gates(args, (d) => {
    const fields = [];
    const cOk = d.cUnit in FAMILY_AMOUNT;
    const toActivity = d.toUnit === 'actIU' || d.toUnit === 'actU';
    // a cross-family pair breaks it at both cUnit and toUnit (Example 26; Q-E10R-A5)
    const crossFamily = cOk && toActivity && d.toUnit !== FAMILY_AMOUNT[d.cUnit];
    if (!cOk || crossFamily) fields.push('cUnit');
    if (d.Vunit !== 'volume') fields.push('Vunit');
    if (!toActivity || crossFamily) fields.push('toUnit');
    return { fields };
  });
  if (stop) return stop;
  const { nums, refusal } = numbers(args);
  if (refusal) return refusal;
  const r = div(mul(mul(nums.c, factor(cUnit)), mul(nums.V, factor(Vunit))), factor(toUnit));
  return done(M, quant(r, toUnit));
}

// ---- E10R-F15 balanceVolume ----
const ASSUMES = 'additive volumes';

export function balanceVolume(Vtotal, Vunit, parts, toUnit) {
  // step 1: incomplete, in argument order; an element with a null member is named parts[i]
  const missing = [];
  if (isBlank2(Vtotal)) missing.push('Vtotal');
  if (isBlank2(Vunit)) missing.push('Vunit');
  if (isBlank2(parts) || (Array.isArray(parts) && parts.length === 0)) missing.push('parts');
  else if (Array.isArray(parts)) {
    parts.forEach((p, i) => {
      if (!isObj(p) ? isBlank2(p) : isBlank2(p.value) || isBlank2(p.unit)) missing.push(`parts[${i}]`);
    });
  }
  if (isBlank2(toUnit)) missing.push('toUnit');
  if (missing.length) return incomplete(M, missing);
  // step 2
  const unknown = [];
  if (!isUnit(Vunit)) unknown.push('Vunit');
  if (Array.isArray(parts)) parts.forEach((p, i) => { if (isObj(p) && !isUnit(p.unit)) unknown.push(`parts[${i}].unit`); });
  if (!isUnit(toUnit)) unknown.push('toUnit');
  if (unknown.length) return rejected(M, 'E10-RC-01', unknown, []);
  // step 3
  const wrong = [];
  if (dimOf(Vunit) !== 'volume') wrong.push('Vunit');
  if (Array.isArray(parts)) parts.forEach((p, i) => { if (isObj(p) && dimOf(p.unit) !== 'volume') wrong.push(`parts[${i}].unit`); });
  if (dimOf(toUnit) !== 'volume') wrong.push('toUnit');
  if (wrong.length) return rejected(M, 'E10-RC-02', wrong, []);
  // step 4
  const bad = [];
  const vt = text(Vtotal);
  if (!okNum(vt, 'pos')) bad.push('Vtotal');
  const vals = [];
  if (!Array.isArray(parts)) bad.push('parts');
  else {
    parts.forEach((p, i) => {
      const r = isObj(p) ? text(p.value) : null;
      if (!okNum(r, 'nonneg')) bad.push(`parts[${i}]`);
      else vals.push(mul(r, factor(p.unit)));
    });
  }
  if (bad.length) return rejected(M, 'CCS-RF-03', bad, []);
  const total = mul(vt, factor(Vunit));
  const sum = vals.reduce((a, b) => add(a, b), ZERO);
  const ft = factor(toUnit);
  if (cmp(sum, total) > 0) {
    return rejected(M, 'E10-RC-03', ['parts'], [], {
      message: 'the parts add up to more than the total',
      partsTotal: quant(div(sum, ft), toUnit),
      statedTotal: quant(div(total, ft), toUnit),
    });
  }
  return done(M, { ...quant(div(sub(total, sum), ft), toUnit), assumes: ASSUMES });
}

// ---- E10R-F16 percentSolution ----
export function percentSolution(pct, basis, reference, B, Bunit, toUnit) {
  const args = [
    ['pct', pct, 'nonneg'], ['basis', basis, 'closed', ['w/v', 'v/v', 'w/w']],
    ['reference', reference, 'closed', ['final', 'added', 'reach']],
    ['B', B, 'pos'], ['Bunit', Bunit, 'unit'], ['toUnit', toUnit, 'unit'],
  ];
  const stop = gates(args, (d, v) => {
    const fields = [];
    if (v.basis !== 'v/v' && v.reference !== 'final') fields.push('reference');
    if (d.Bunit !== (v.basis === 'w/w' ? 'mass' : 'volume')) fields.push('Bunit');
    if (d.toUnit !== (v.basis === 'v/v' ? 'volume' : 'mass')) fields.push('toUnit');
    return { fields };
  });
  if (stop) return stop;
  const { nums, refusal } = numbers(args, (n) => {
    if (!n.pct) return [];
    const p = n.pct;
    const over100 = cmp(p, HUNDRED) > 0;
    const reachBad = cmp(p, HUNDRED) >= 0;
    if (basis === 'w/v') return [];
    if (basis === 'w/w' || reference === 'final') return over100 ? ['pct'] : [];
    if (reference === 'reach') return reachBad ? ['pct'] : [];
    return [];
  });
  if (refusal) return refusal;
  const p = nums.pct;
  const base = mul(nums.B, factor(Bunit));
  const ft = factor(toUnit);
  const frac = div(p, HUNDRED);
  if (basis === 'w/v') return done(M, quant(div(mul(mul(frac, base), R(1000)), ft), toUnit));
  if (basis === 'w/w') {
    const solute = mul(frac, base);
    return done(M, { ...quant(div(solute, ft), toUnit), solvent: quant(div(sub(base, solute), ft), toUnit) });
  }
  if (reference === 'final') return done(M, quant(div(mul(frac, base), ft), toUnit));
  if (reference === 'added') {
    return done(M, {
      ...quant(div(mul(frac, base), ft), toUnit),
      finalVolume: quant(div(div(mul(base, add(HUNDRED, p)), HUNDRED), ft), toUnit),
      percentOfFinal: { value: val(div(mul(HUNDRED, p), add(HUNDRED, p))), exact: ex(div(mul(HUNDRED, p), add(HUNDRED, p))) },
      assumes: ASSUMES,
    });
  }
  return done(M, {
    ...quant(div(div(mul(base, p), sub(HUNDRED, p)), ft), toUnit),
    finalVolume: quant(div(div(mul(base, HUNDRED), sub(HUNDRED, p)), ft), toUnit),
    assumes: ASSUMES,
  });
}

// ---- E10R-F18 concentrateVolume ----
export function concentrateVolume(Vfinal, Vunit, fold, toUnit) {
  const args = [['Vfinal', Vfinal, 'pos'], ['Vunit', Vunit, 'unit'], ['fold', fold, 'ge1'], ['toUnit', toUnit, 'unit']];
  const stop = gates(args, (d) => ({ fields: ['Vunit', 'toUnit'].filter((k) => d[k] !== 'volume') }));
  if (stop) return stop;
  const { nums, refusal } = numbers(args);
  if (refusal) return refusal;
  const r = div(div(mul(nums.Vfinal, factor(Vunit)), nums.fold), factor(toUnit));
  return done(M, quant(r, toUnit));
}

// ---- E10R-F19 roundDeclared (display function) ----
const INT_TEXT = /^\d+$/;

export function roundDeclared(value, rule, places) {
  const missing = [['value', value], ['rule', rule], ['places', places]].filter(([, v]) => isBlank2(v)).map(([k]) => k);
  if (missing.length) return incomplete(M, missing);
  if (rule !== 'half-up' && rule !== 'half-even') return rejected(M, 'E10-RC-01', ['rule'], []);
  const bad = [];
  let r = null;
  if (typeof value === 'string') r = parse(value);
  else if (isObj(value) && typeof value.num === 'string' && typeof value.den === 'string' && INT_TEXT.test(value.num) && INT_TEXT.test(value.den) && BigInt(value.den) > 0n) {
    r = rat(BigInt(value.num), BigInt(value.den));
  }
  if (r === null || cmp(r, ZERO) < 0) bad.push('value');
  if (typeof places !== 'string' || !INT_TEXT.test(places)) bad.push('places');
  if (bad.length) return rejected(M, 'CCS-RF-03', bad, []);
  const k = BigInt(places);
  const scale = 10n ** k;
  const rn = r.n * scale;
  const q = rn / r.d; // floor (r >= 0)
  const twice = (rn - q * r.d) * 2n;
  let out = q;
  if (twice > r.d) out = q + 1n;
  else if (twice === r.d) out = rule === 'half-up' ? q + 1n : (q % 2n === 0n ? q : q + 1n);
  const digits = out.toString().padStart(Number(k) + 1, '0');
  const t = k === 0n ? digits : `${digits.slice(0, digits.length - Number(k))}.${digits.slice(digits.length - Number(k))}`;
  return done(M, { text: t, rule, places });
}
