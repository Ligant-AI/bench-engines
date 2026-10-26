// Black-box harness for @ligant/bench-engines, written to verification/PROTOCOL.md.
// Reads a JSON array of cases on stdin, writes a JSON array of results on stdout,
// same order, same ids. This file only renames and regroups what the engine returns
// (PROTOCOL section 3, ADC-2026-10-26-18, -19). It does no arithmetic, no rounding,
// no defaulting and carries no version text: the engine's own values and strings are used.
import { readFileSync } from 'node:fs';
import { e9, e7, e10, version } from '../src/index.js';

// Members of the engine's flat result that are not numeric values.
const META = new Set(['status', 'code', 'fields', 'indices', 'missing', 'flags', 'engine']);

// Display mode per named value (PROTOCOL section 4 table). A lookup, not a computation.
const MODE = {
  Clive: 'sci3', Cdead: 'sci3', Ctotal: 'sci3',
  liveCells: 'sci3', allCells: 'sci3', liveRemaining: 'sci3', cellsNeeded: 'sci3',
  viabilityPercent: 'fixed1',
  cvPercent: 'fixed2',
  Vtr: 'sig3', Vmedium: 'sig3', Vseed: 'sig3', Vmed: 'sig3',
  Vsq: 'exact',
  k: 'sig3trim',
};

const bodyOf = (r) => Object.fromEntries(Object.entries(r).filter(([key]) => !META.has(key)));

function engineOfPackage() {
  const v = version();
  return { package: v.package, version: v.version, moduleVersion: v.modules };
}

function envelope(id, r) {
  const out = { id, status: r.status, incomplete: [], rejection: null, flags: [], values: {}, engine: r.engine };
  if (r.status === 'incomplete') {
    out.incomplete = r.missing;
    return out;
  }
  if (r.status === 'rejected') {
    out.rejection = { code: r.code, fields: r.fields, indices: r.indices };
    const context = bodyOf(r);
    if (Object.keys(context).length) out.rejection.context = context;
    return out;
  }
  out.flags = r.flags ?? [];
  out.values = bodyOf(r);
  out.display = {};
  for (const [name, value] of Object.entries(out.values)) {
    if (typeof value === 'number' && MODE[name]) out.display[name] = e9.display(MODE[name], value);
  }
  return out;
}

// The chained black-box call: meanPerSquare, strengthFactor, squareVolume, concentrations.
// The three input stages are independent, so they are all run and their statuses merged in
// argument order (live, dead, P, A, d) before concentrations is called (P1 of PROTOCOL).
function concentrationsChain(id, a) {
  const mean = e9.meanPerSquare(a.live, a.dead);
  const strength = e10.strengthFactor(a.P, null);
  const square = e9.squareVolume(a.A, a.d);
  const stages = [mean, strength, square];
  const gaps = stages.filter((s) => s.status === 'incomplete');
  if (gaps.length) {
    return { id, status: 'incomplete', incomplete: gaps.flatMap((s) => s.missing), rejection: null, flags: [], values: {}, engine: gaps[0].engine };
  }
  const bad = stages.filter((s) => s.status === 'rejected');
  if (bad.length) {
    const first = bad[0];
    return {
      id, status: 'rejected', incomplete: [], flags: [], values: {}, engine: first.engine,
      rejection: { code: first.code, fields: bad.flatMap((s) => s.fields), indices: mean.indices ?? [] },
    };
  }
  const conc = e9.concentrations(mean.Lbar, mean.Dbar, strength.f, square.Vsq, mean.sumLive, mean.sumDead);
  if (conc.status !== 'result') return envelope(id, conc);
  const out = envelope(id, { ...conc, ...bodyOf(mean), ...bodyOf(strength), ...bodyOf(square), flags: strength.flags });
  return out;
}

const RUN = {
  strengthFactor: (id, a) => envelope(id, e10.strengthFactor(a.P, a.dyeNamed)),
  splitVolumes: (id, a) => envelope(id, e10.splitVolumes(a.Vnew, a.N)),
  squareVolume: (id, a) => envelope(id, e9.squareVolume(a.A, a.d)),
  meanPerSquare: (id, a) => envelope(id, e9.meanPerSquare(a.live, a.dead)),
  concentrations: concentrationsChain,
  viability: (id, a) => envelope(id, e9.viability({ sumLive: a.sumLive, sumDead: a.sumDead })),
  totalCells: (id, a) => envelope(id, e9.totalCells(a.Clive, a.Ctotal, a.Vsusp, a.timing, a.Valiquot)),
  seedingVolumes: (id, a) => envelope(id, e9.seedingVolumes(a.rho, a.Vfinal, a.Clive)),
  x10Comparison: (id, a) => envelope(id, e9.x10Comparison(a.Vsq)),
  poissonCV: (id, a) => envelope(id, e7.poissonCV({ sumLive: a.sumLive, sumDead: a.sumDead })),
  display: (id, a) => ({
    id, status: 'result', incomplete: [], rejection: null, flags: [], values: {},
    display: { value: e9.display(a.mode, a.value) }, engine: engineOfPackage(),
  }),
  version: (id) => ({
    id, status: 'result', incomplete: [], rejection: null, flags: [], values: {}, engine: engineOfPackage(),
  }),
};

// P2: an implementation that fails on a case reports error for that case and returns the rest.
function runCase(c) {
  const id = c === null || typeof c !== 'object' ? null : c.id;
  try {
    const run = Object.hasOwn(RUN, c.fn) ? RUN[c.fn] : null;
    if (!run) throw new Error(`unknown fn: ${String(c.fn)}`);
    return run(id, c.args ?? {});
  } catch (e) {
    let engine = null;
    try { engine = engineOfPackage(); } catch { engine = null; }
    return { id, status: 'error', incomplete: [], rejection: null, flags: [], values: {}, engine, message: String(e && e.message) };
  }
}

const cases = JSON.parse(readFileSync(0, 'utf8'));
if (!Array.isArray(cases)) {
  process.stderr.write('run-engine: stdin must be a JSON array of cases\n');
  process.exit(2);
}
process.stdout.write(`${JSON.stringify(cases.map(runCase))}\n`);
