// E7: the Poisson counting CV only. Spec section 5. No count window, no thresholds.
import { R, cmp, isInt, parse, incomplete, rejected, done, missingOf } from '../core.js';

export const MODULE = 'E7';
export const MODULE_VERSION = '0.0.0';
const M = MODULE;

// 5.1: CV% = 100 / sqrt(N), N = sum of live counts. CCS-DT-07, CCS-FL-05.
export function poissonCV({ sumLive, sumDead } = {}) {
  const miss = missingOf([['sumLive', sumLive], ['sumDead', sumDead]]);
  if (miss.length) return incomplete(M, miss);
  const l = parse(sumLive);
  const d = parse(sumDead);
  const bad = [];
  if (!l || !isInt(l) || cmp(l, R(0)) < 0) bad.push('sumLive');
  if (!d || !isInt(d) || cmp(d, R(0)) < 0) bad.push('sumDead');
  if (bad.length) return rejected(M, 'CCS-RF-03', bad);
  if (l.n === 0n) return rejected(M, d.n === 0n ? 'CCS-RF-06' : 'CCS-RF-07', d.n === 0n ? ['sumLive', 'sumDead'] : ['sumLive']);
  return done(M, { cvPercent: 100 / Math.sqrt(Number(l.n)) });
}
