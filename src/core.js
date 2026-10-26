// Shared internals for E9 / E7 / E10: exact decimal (BigInt rational) arithmetic, input
// parsing, refusal objects, display rounding. Spec sections 2 and 6. No dependencies.
import { ENGINE_VERSION } from './version.js';

const PLAIN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

export function engineBlock(module) {
  return { package: '@ligant/bench-engines', version: ENGINE_VERSION, module, moduleVersion: '0.1.0' };
}

function bgcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

export function rat(n, d = 1n) {
  if (d < 0n) { n = -n; d = -d; }
  const g = bgcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}
export const add = (a, b) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a, b) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a, b) => rat(a.n * b.n, a.d * b.d);
export const div = (a, b) => rat(a.n * b.d, a.d * b.n);
export const cmp = (a, b) => { const x = a.n * b.d, y = b.n * a.d; return x < y ? -1 : x > y ? 1 : 0; };
export const R = (n) => rat(BigInt(n));
export const isInt = (a) => a.d === 1n;

function fromPlain(s) {
  let sign = 1n;
  if (s[0] === '+' || s[0] === '-') { if (s[0] === '-') sign = -1n; s = s.slice(1); }
  const [i, f = ''] = s.split('.');
  return rat(sign * BigInt((i || '0') + f), 10n ** BigInt(f.length));
}

function fromNumber(x) {
  // A JS number from an earlier engine result: read its shortest decimal repr exactly.
  const m = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]\d+))?$/.exec(String(x));
  if (!m) return null;
  const frac = m[3] || '';
  let n = BigInt(m[2] + frac) * (m[1] ? -1n : 1n);
  let e = Number(m[4] || 0) - frac.length;
  return e >= 0 ? rat(n * 10n ** BigInt(e)) : rat(n, 10n ** BigInt(-e));
}

export const isBlank = (v) => v === null || v === undefined || (typeof v === 'string' && v.trim() === '');

// Returns a rational, or null when the value is not plain decimal text (CCS-RF-03 at the engine).
export function parse(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? fromNumber(v) : null;
  if (typeof v === 'bigint') return rat(v);
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return PLAIN.test(s) ? fromPlain(s) : null;
}

export function toNumber(r) {
  if (r.n === 0n) return 0;
  const neg = r.n < 0n;
  const n = neg ? -r.n : r.n;
  const k = 40 - (n.toString().length - r.d.toString().length);
  const q = k >= 0 ? (n * 10n ** BigInt(k)) / r.d : n / (r.d * 10n ** BigInt(-k));
  const x = Number(`${q}e${-k}`);
  return neg ? -x : x;
}

export const incomplete = (module, missing) => ({ status: 'incomplete', missing, engine: engineBlock(module) });
export function rejected(module, code, fields, indices = [], extra = {}) {
  return { status: 'rejected', code, fields, indices, ...extra, engine: engineBlock(module) };
}
export const done = (module, body) => ({ status: 'result', ...body, engine: engineBlock(module) });

// Step 1 of the order of statuses: names (in argument order) of blank required args.
export const missingOf = (pairs) => pairs.filter(([, v]) => isBlank(v)).map(([k]) => k);

// ---- display (spec section 6) ----

function roundDiv(n, d) { // half away from zero for n >= 0
  const q = n / d;
  return (n % d) * 2n >= d ? q + 1n : q;
}

function digitsLen(r) { // floor(log10(r)) for r > 0
  let e = r.n.toString().length - r.d.toString().length;
  const p = (x) => (x >= 0 ? 10n ** BigInt(x) : null);
  const ge = (ex) => (ex >= 0 ? r.n >= p(ex) * r.d : r.n * 10n ** BigInt(-ex) >= r.d);
  while (ge(e + 1)) e++;
  while (!ge(e)) e--;
  return e;
}

// Round |r| to 3 significant figures: returns {m: 3-digit BigInt string, e: exponent of leading digit}.
function sig3Parts(a) {
  let e = digitsLen(a);
  const sh = 2 - e; // scale so that value*10^sh has 3 integer digits
  const sc = sh >= 0 ? rat(a.n * 10n ** BigInt(sh), a.d) : rat(a.n, a.d * 10n ** BigInt(-sh));
  let m = roundDiv(sc.n, sc.d);
  if (m >= 1000n) { m = m / 10n; e++; }
  return { m: m.toString(), e };
}

function placeDigits(m, e) { // m = 3 digits, value = m x 10^(e-2), plain digits
  const p = 2 - e;
  if (p <= 0) return m + '0'.repeat(-p);
  const s = m.padStart(p + 1, '0');
  return `${s.slice(0, s.length - p)}.${s.slice(s.length - p)}`;
}

function fixed(a, places) {
  const sc = rat(a.n * 10n ** BigInt(places), a.d);
  const s = roundDiv(sc.n, sc.d).toString().padStart(places + 1, '0');
  return places ? `${s.slice(0, s.length - places)}.${s.slice(s.length - places)}` : s;
}

function exactText(a) {
  let k = 0;
  while ((a.n * 10n ** BigInt(k)) % a.d !== 0n) { k++; if (k > 400) throw new Error('non-terminating'); }
  const s = (a.n * 10n ** BigInt(k) / a.d).toString().padStart(k + 1, '0');
  return k ? `${s.slice(0, s.length - k)}.${s.slice(s.length - k)}` : s;
}

export const DISPLAY_MODES = ['sci3', 'sig3', 'sig3trim', 'fixed1', 'fixed2', 'exact'];

// display(mode, value): value is decimal text (or an engine number). Throws on a bad mode
// or on text that is not a plain decimal: a programming error, not a user refusal.
export function display(mode, value) {
  if (!DISPLAY_MODES.includes(mode)) throw new Error(`unknown display mode: ${mode}`);
  const r = parse(value);
  if (!r) throw new Error('display value is not plain decimal text');
  const neg = r.n < 0n;
  const a = neg ? rat(-r.n, r.d) : r;
  let body;
  let zero = false;
  if (mode === 'fixed1' || mode === 'fixed2') {
    body = fixed(a, mode === 'fixed1' ? 1 : 2);
    zero = /^0(\.0+)?$/.test(body);
  } else if (mode === 'exact') {
    body = exactText(a);
    zero = a.n === 0n;
  } else if (a.n === 0n) {
    return '0';
  } else {
    const { m, e } = sig3Parts(a);
    if (mode === 'sci3') body = `${m[0]}.${m.slice(1)} × 10^${e}`;
    else {
      body = placeDigits(m, e);
      if (mode === 'sig3trim' && body.includes('.')) body = body.replace(/0+$/, '').replace(/\.$/, '');
    }
  }
  return neg && !zero ? `-${body}` : body;
}
