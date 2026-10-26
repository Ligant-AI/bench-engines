// E9: counting, viability, totals, seeding, display. Spec section 4 and 6.
import {
  R, isBlank, add, sub, mul, div, cmp, isInt, parse, toNumber,
  incomplete, rejected, done, missingOf, display as displayValue, DISPLAY_MODES,
} from '../core.js';

export const MODULE = 'E9';
export const MODULE_VERSION = '0.1.0';
const M = MODULE;
const ZERO = R(0);
const num = (v, test) => { const r = parse(v); return r && test(r) ? r : null; };
const pos = (r) => cmp(r, ZERO) > 0;
const nonneg = (r) => cmp(r, ZERO) >= 0;
const count = (r) => isInt(r) && nonneg(r);

export { DISPLAY_MODES };
export const display = displayValue;

// 4.1: V_sq (uL) = A (mm2) x d (mm). CCS-DT-02.
export function squareVolume(A, d) {
  const miss = missingOf([['A', A], ['d', d]]);
  if (miss.length) return incomplete(M, miss);
  const a = num(A, pos);
  const b = num(d, pos);
  const bad = [!a && 'A', !b && 'd'].filter(Boolean);
  if (bad.length) return rejected(M, 'CCS-RF-03', bad);
  return done(M, { Vsq: toNumber(mul(a, b)) });
}

// 4.2: one loading; no SD or CV across squares. CCS-DT-03.
export function meanPerSquare(live, dead) {
  const miss = missingOf([['live', Array.isArray(live) ? 'x' : live], ['dead', Array.isArray(dead) ? 'x' : dead]]);
  if (miss.length) return incomplete(M, miss);
  if (!Array.isArray(live) || !Array.isArray(dead)) {
    return rejected(M, 'CCS-RF-03', [!Array.isArray(live) && 'live', !Array.isArray(dead) && 'dead'].filter(Boolean));
  }
  // Step 1 (spec 2, 4.2; NAD-2026-10-26-30): a null or blank square entry is incomplete (RF-01).
  const gaps = [];
  const gapIdx = new Set();
  [['live', live], ['dead', dead]].forEach(([name, list]) => list.forEach((v, i) => {
    if (isBlank(v)) { gaps.push(`${name}[${i}]`); gapIdx.add(i); }
  }));
  if (gaps.length) return { ...incomplete(M, gaps), indices: [...gapIdx].sort((x, y) => x - y) };
  if (live.length === 0 || dead.length === 0 || live.length !== dead.length) {
    const fields = [];
    if (live.length === 0 || live.length !== dead.length) fields.push('live');
    if (dead.length === 0 || live.length !== dead.length) fields.push('dead');
    return rejected(M, 'CCS-RF-03', fields);
  }
  const fields = [];
  const idx = new Set();
  const pl = live.map((v, i) => { const r = num(v, count); if (!r) { idx.add(i); if (!fields.includes('live')) fields.push('live'); } return r; });
  const pd = dead.map((v, i) => { const r = num(v, count); if (!r) { idx.add(i); if (!fields.includes('dead')) fields.push('dead'); } return r; });
  if (fields.length) return rejected(M, 'CCS-RF-03', fields, [...idx].sort((x, y) => x - y));
  const n = R(live.length);
  const sl = pl.reduce(add, ZERO);
  const sd = pd.reduce(add, ZERO);
  return done(M, {
    nSq: live.length, sumLive: toNumber(sl), sumDead: toNumber(sd),
    Lbar: toNumber(div(sl, n)), Dbar: toNumber(div(sd, n)),
  });
}

// 4.3: C = mean x f x 1000 / V_sq. CCS-DT-04, CCS-RF-06.
export function concentrations(Lbar, Dbar, f, Vsq, sumLive, sumDead) {
  const miss = missingOf([['Lbar', Lbar], ['Dbar', Dbar], ['f', f], ['Vsq', Vsq], ['sumLive', sumLive], ['sumDead', sumDead]]);
  if (miss.length) return incomplete(M, miss);
  const l = num(Lbar, nonneg);
  const d = num(Dbar, nonneg);
  const ff = num(f, (r) => cmp(r, R(1)) >= 0);
  const v = num(Vsq, pos);
  const sl = num(sumLive, count);
  const sd = num(sumDead, count);
  const bad = [!l && 'Lbar', !d && 'Dbar', !ff && 'f', !v && 'Vsq', !sl && 'sumLive', !sd && 'sumDead'].filter(Boolean);
  if (bad.length) return rejected(M, 'CCS-RF-03', bad);
  if (sl.n === 0n && sd.n === 0n) return rejected(M, 'CCS-RF-06', ['sumLive', 'sumDead']);
  const k = div(mul(ff, R(1000)), v);
  const cl = mul(l, k);
  const cd = mul(d, k);
  return done(M, { Clive: toNumber(cl), Cdead: toNumber(cd), Ctotal: toNumber(add(cl, cd)) });
}

// 4.4: viability % = 100 x sumLive / (sumLive + sumDead). CCS-DT-05. No CV.
export function viability({ sumLive, sumDead } = {}) {
  const miss = missingOf([['sumLive', sumLive], ['sumDead', sumDead]]);
  if (miss.length) return incomplete(M, miss);
  const sl = num(sumLive, count);
  const sd = num(sumDead, count);
  const bad = [!sl && 'sumLive', !sd && 'sumDead'].filter(Boolean);
  if (bad.length) return rejected(M, 'CCS-RF-03', bad);
  if (sl.n === 0n && sd.n === 0n) return rejected(M, 'CCS-RF-06', ['sumLive', 'sumDead']);
  return done(M, { viabilityPercent: toNumber(div(mul(R(100), sl), add(sl, sd))) });
}

// 4.5: cells in the suspension, and live cells left after an aliquot taken "before". CCS-DT-06.
export function totalCells(Clive, Ctotal, Vsusp, timing, Valiquot) {
  const before = timing === 'before';
  const miss = missingOf([['Clive', Clive], ['Ctotal', Ctotal], ['Vsusp', Vsusp], ['timing', timing], ...(before ? [['Valiquot', Valiquot]] : [])]);
  if (miss.length) return incomplete(M, miss);
  const cl = num(Clive, nonneg);
  const ct = num(Ctotal, pos); // Ctotal <= 0 is RF-03; Clive = 0 is a result (RF-07 is seedingVolumes' only)
  const vs = num(Vsusp, pos);
  const va = before ? num(Valiquot, pos) : ZERO;
  const bad = [!cl && 'Clive', !ct && 'Ctotal', !vs && 'Vsusp', timing !== 'before' && timing !== 'after' && 'timing', before && !va && 'Valiquot'].filter(Boolean);
  if (bad.length) return rejected(M, 'CCS-RF-03', bad);
  if (before && cmp(va, vs) >= 0) return rejected(M, 'CCS-RF-04', ['Valiquot', 'Vsusp']);
  return done(M, {
    liveCells: toNumber(mul(cl, vs)),
    allCells: toNumber(mul(ct, vs)),
    liveRemaining: before ? toNumber(mul(cl, sub(vs, va))) : null,
  });
}

// 4.6: density per mL only. Comparisons are exact (NAD-2026-10-26-26). CCS-DT-08.
export function seedingVolumes(rho, Vfinal, Clive) {
  const miss = missingOf([['rho', rho], ['Vfinal', Vfinal], ['Clive', Clive]]);
  if (miss.length) return incomplete(M, miss);
  const r = num(rho, pos);
  const vf = num(Vfinal, pos);
  const c = num(Clive, nonneg);
  const bad = [!r && 'rho', !vf && 'Vfinal', !c && 'Clive'].filter(Boolean);
  if (bad.length) return rejected(M, 'CCS-RF-03', bad);
  if (c.n === 0n) return rejected(M, 'CCS-RF-07', ['Clive']);
  const needed = mul(r, vf);
  const vseed = div(needed, c);
  if (cmp(r, c) > 0) {
    return rejected(M, 'CCS-RF-05', ['rho'], [], { Vseed: toNumber(vseed), Vfinal: toNumber(vf), Clive: toNumber(c) });
  }
  return done(M, {
    cellsNeeded: toNumber(needed), Vseed: toNumber(vseed), Vmed: toNumber(sub(vf, vseed)),
    flags: cmp(r, c) === 0 ? ['CCS-FL-06'] : [],
  });
}

// 4.7 HELD for G2 (scope record not signed). Not built.
export function x10Comparison() {
  throw new Error('not built: held for G2');
}

