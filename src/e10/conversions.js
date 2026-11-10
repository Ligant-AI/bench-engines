// E10 molar and mass conversions: E10C-F03 to E10C-F12 (docs/engine-spec-e10-conversions.md).
// Every result is one exact rational chain (BigInt), scaled to toUnit, rounded nowhere.
import { R, rat, mul, div, cmp, parse, toNumber, isBlank, incomplete, rejected, done } from '../core.js';
import { isUnit, dimOf, factor, N_A } from './units.js';

const M = 'E10';
const ZERO = R(0);

// An arg descriptor is [name, value, kind]; kind: 'unit', 'nonneg' (>= 0) or 'pos' (> 0).
// wrongFn(dimOfArg) returns the wrong-dimension unit field names (argument order) and an
// optional message. The order of statuses is spec section 2 (ADC-2026-11-09-05).
function run(args, wrongFn, compute) {
  const missing = args.filter(([, v]) => isBlank(v)).map(([k]) => k);
  if (missing.length) return incomplete(M, missing);

  const unknown = args.filter(([, v, kind]) => kind === 'unit' && !isUnit(v)).map(([k]) => k);
  if (unknown.length) return rejected(M, 'E10-RC-01', unknown, []);

  const dims = {};
  for (const [k, v, kind] of args) if (kind === 'unit') dims[k] = dimOf(v);
  const wrong = wrongFn(dims);
  if (wrong.fields.length) {
    return rejected(M, 'E10-RC-02', wrong.fields, [], wrong.message ? { message: wrong.message } : {});
  }

  const nums = {};
  const bad = [];
  for (const [k, v, kind] of args) {
    if (kind === 'unit') continue;
    const r = parse(v);
    if (!r || (kind === 'nonneg' ? cmp(r, ZERO) < 0 : cmp(r, ZERO) <= 0)) bad.push(k);
    else nums[k] = r;
  }
  if (bad.length) return rejected(M, 'CCS-RF-03', bad, []);

  const units = Object.fromEntries(args.filter(([, , kind]) => kind === 'unit').map(([k, v]) => [k, v]));
  const r = compute(nums, units);
  const value = Number(toNumber(r));
  return done(M, {
    value,
    unit: units.toUnit,
    exact: { num: r.n.toString(), den: r.d.toString() },
  });
}

const fixedDims = (expect) => (dims) => ({
  fields: Object.keys(expect).filter((k) => dims[k] !== expect[k]),
});

// E10C-F03
export function scaleUnit(value, fromUnit, toUnit) {
  return run(
    [['value', value, 'nonneg'], ['fromUnit', fromUnit, 'unit'], ['toUnit', toUnit, 'unit']],
    (d) => {
      if (d.fromUnit === d.toUnit) return { fields: [] };
      const out = { fields: ['fromUnit', 'toUnit'] };
      if (d.fromUnit === 'massConc' && d.toUnit === 'molarConc') out.message = 'needs a molecular weight, use massToMolar';
      return out;
    },
    (n, u) => div(mul(n.value, factor(u.fromUnit)), factor(u.toUnit)),
  );
}

// Shared shape of F04 to F07: ((x f(unit)) op MW) / f(toUnit).
function withMW(first, fromDim, toDim, op) {
  return (x, unit, MW, toUnit) => run(
    [[first, x, 'nonneg'], ['unit', unit, 'unit'], ['MW', MW, 'pos'], ['toUnit', toUnit, 'unit']],
    fixedDims({ unit: fromDim, toUnit: toDim }),
    (n, u) => div(op(mul(n[first], factor(u.unit)), n.MW), factor(u.toUnit)),
  );
}
const times = (a, b) => mul(a, b);
const over = (a, b) => div(a, b);

// E10C-F04, F05, F06, F07
export const massToMolar = withMW('c', 'massConc', 'molarConc', over);
export const molarToMass = withMW('c', 'molarConc', 'massConc', times);
export const massToMoles = withMW('m', 'mass', 'amount', over);
export const molesToMass = withMW('n', 'amount', 'mass', times);

// E10C-F08
export function molesToCopies(n, unit, toUnit) {
  return run(
    [['n', n, 'nonneg'], ['unit', unit, 'unit'], ['toUnit', toUnit, 'unit']],
    fixedDims({ unit: 'amount', toUnit: 'copies' }),
    (x, u) => div(mul(mul(x.n, factor(u.unit)), N_A), factor(u.toUnit)),
  );
}

// E10C-F09
export function copiesToMoles(N, toUnit) {
  return run(
    [['N', N, 'nonneg'], ['toUnit', toUnit, 'unit']],
    fixedDims({ toUnit: 'amount' }),
    (x, u) => div(div(x.N, N_A), factor(u.toUnit)),
  );
}

// E10C-F10
export function massToCopies(m, unit, MW, toUnit) {
  return run(
    [['m', m, 'nonneg'], ['unit', unit, 'unit'], ['MW', MW, 'pos'], ['toUnit', toUnit, 'unit']],
    fixedDims({ unit: 'mass', toUnit: 'copies' }),
    (x, u) => div(mul(div(mul(x.m, factor(u.unit)), x.MW), N_A), factor(u.toUnit)),
  );
}

// E10C-F11
export function copiesToMass(N, MW, toUnit) {
  return run(
    [['N', N, 'nonneg'], ['MW', MW, 'pos'], ['toUnit', toUnit, 'unit']],
    fixedDims({ toUnit: 'mass' }),
    (x, u) => div(mul(div(x.N, N_A), x.MW), factor(u.toUnit)),
  );
}

// E10C-F12 (ruling KAITO-2026-11-10-04 / ADC-2026-11-10-03 on the fields of E10-RC-02)
export function amountFromConcentration(c, unit, V, Vunit, toUnit) {
  return run(
    [['c', c, 'nonneg'], ['unit', unit, 'unit'], ['V', V, 'pos'], ['Vunit', Vunit, 'unit'], ['toUnit', toUnit, 'unit']],
    (d) => {
      const fields = [];
      const unitOk = d.unit === 'massConc' || d.unit === 'molarConc';
      if (!unitOk) fields.push('unit');
      if (d.Vunit !== 'volume') fields.push('Vunit');
      if (unitOk && d.toUnit !== (d.unit === 'massConc' ? 'mass' : 'amount')) fields.push('toUnit');
      return { fields };
    },
    (x, u) => div(mul(mul(x.c, factor(u.unit)), mul(x.V, factor(u.Vunit))), factor(u.toUnit)),
  );
}
