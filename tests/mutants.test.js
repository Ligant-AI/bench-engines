// Mutation check of the test suite. Each mutant is a seeded wrong version of a key relation
// (a source file with one text change). The suite (engines, version and harness tests) is run
// against a copy of the package carrying the mutant; the mutant is caught if that run fails,
// and `catchedBy` names the test that must be among the failures. The real src/ is never edited:
// copies live in tests/_mutants_work/ and are removed afterwards.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WORK = path.join(ROOT, 'tests', '_mutants_work');
const SUITE = ['engines.test.js', 'version.test.js', 'harness.test.js'];

export const MUTANTS = [
  // E9 relations
  { id: 'M01-square-volume-adds', file: 'src/e9/index.js', find: 'toNumber(mul(a, b))', replace: 'toNumber(add(a, b))', catchedBy: 'F-01 chain' },
  { id: 'M02-mean-live-n-plus-one', file: 'src/e9/index.js', find: 'Lbar: toNumber(div(sl, n))', replace: 'Lbar: toNumber(div(sl, add(n, R(1))))', catchedBy: 'F-01 chain' },
  { id: 'M03-mean-dead-not-divided', file: 'src/e9/index.js', find: 'Dbar: toNumber(div(sd, n))', replace: 'Dbar: toNumber(sd)', catchedBy: 'F-01 chain' },
  { id: 'M04-mean-allows-non-integer', file: 'src/e9/index.js', find: 'const count = (r) => isInt(r) && nonneg(r);', replace: 'const count = (r) => nonneg(r);', catchedBy: 'meanPerSquare: refusals' },
  { id: 'M05-conc-factor-100-not-1000', file: 'src/e9/index.js', find: 'mul(ff, R(1000))', replace: 'mul(ff, R(100))', catchedBy: 'F-01 chain' },
  { id: 'M06-conc-ignores-f', file: 'src/e9/index.js', find: 'mul(ff, R(1000))', replace: 'mul(R(1), R(1000))', catchedBy: 'F-01 chain' },
  { id: 'M07-cdead-uses-live-mean', file: 'src/e9/index.js', find: 'const cd = mul(d, k);', replace: 'const cd = mul(l, k);', catchedBy: 'F-01 chain' },
  { id: 'M08-ctotal-is-live-only', file: 'src/e9/index.js', find: 'Ctotal: toNumber(add(cl, cd))', replace: 'Ctotal: toNumber(cl)', catchedBy: 'F-01 chain' },
  { id: 'M09-conc-no-rf06', file: 'src/e9/index.js', find: 'sl.n === 0n && sd.n === 0n', replace: 'false', catchedBy: 'concentrations: RF-06' },
  { id: 'M10-viability-no-rf06', file: 'src/e9/index.js', find: 'sl.n === 0n && sd.n === 0n', replace: 'false', nth: 2, catchedBy: 'viability: ratio of sums' },
  { id: 'M11-viability-denominator-dead', file: 'src/e9/index.js', find: 'div(mul(R(100), sl), add(sl, sd))', replace: 'div(mul(R(100), sl), sd)', catchedBy: 'F-01 chain' },
  { id: 'M12-viability-factor-10', file: 'src/e9/index.js', find: 'div(mul(R(100), sl), add(sl, sd))', replace: 'div(mul(R(10), sl), add(sl, sd))', catchedBy: 'F-01 chain' },
  { id: 'M13-allcells-uses-clive', file: 'src/e9/index.js', find: 'allCells: toNumber(mul(ct, vs))', replace: 'allCells: toNumber(mul(cl, vs))', catchedBy: 'totalCells: before and after' },
  { id: 'M14-liveremaining-ignores-aliquot', file: 'src/e9/index.js', find: 'mul(cl, sub(vs, va))', replace: 'mul(cl, vs)', catchedBy: 'totalCells: before and after' },
  { id: 'M15-rf04-boundary-strict', file: 'src/e9/index.js', find: 'cmp(va, vs) >= 0', replace: 'cmp(va, vs) > 0', catchedBy: 'totalCells: before and after' },
  { id: 'M16-ctotal-zero-accepted', file: 'src/e9/index.js', find: 'num(Ctotal, pos)', replace: 'num(Ctotal, nonneg)', catchedBy: 'spec 4.5' },
  { id: 'M17-seed-forgets-vfinal', file: 'src/e9/index.js', find: 'const needed = mul(r, vf);', replace: 'const needed = r;', catchedBy: 'seedingVolumes: relation' },
  { id: 'M18-seed-vmed-sign', file: 'src/e9/index.js', find: 'Vmed: toNumber(sub(vf, vseed))', replace: 'Vmed: toNumber(sub(vseed, vf))', catchedBy: 'seedingVolumes: relation' },
  { id: 'M19-rf05-fires-on-equality', file: 'src/e9/index.js', find: 'if (cmp(r, c) > 0) {', replace: 'if (cmp(r, c) >= 0) {', catchedBy: 'seedingVolumes: relation' },
  { id: 'M20-fl06-never-raised', file: 'src/e9/index.js', find: "flags: cmp(r, c) === 0 ? ['CCS-FL-06'] : [],", replace: 'flags: [],', catchedBy: 'seedingVolumes: relation' },
  { id: 'M21-rf05-compared-in-binary-float', file: 'src/e9/index.js', find: 'if (cmp(r, c) > 0) {', replace: 'if (toNumber(r) > toNumber(c)) {', catchedBy: 'seedingVolumes: relation' },
  { id: 'M22-rf07-removed', file: 'src/e9/index.js', find: 'if (c.n === 0n) return rejected(M, \'CCS-RF-07\'', replace: 'if (false) return rejected(M, \'CCS-RF-07\'', catchedBy: 'seedingVolumes: relation' },
  { id: 'M23-blank-square-not-incomplete', file: 'src/e9/index.js', find: 'if (gaps.length)', replace: 'if (false)', catchedBy: 'spec 4.2' },
  // E10 relations
  { id: 'M24-split-medium-wrong', file: 'src/e10/index.js', find: 'Vmedium: toNumber(sub(v, tr))', replace: 'Vmedium: toNumber(sub(v, n))', catchedBy: 'splitVolumes' },
  { id: 'M25-split-n1-refused', file: 'src/e10/index.js', find: '!n || cmp(n, R(1)) < 0', replace: '!n || cmp(n, R(1)) <= 0', catchedBy: 'splitVolumes' },
  { id: 'M26-split-vtr-times-n', file: 'src/e10/index.js', find: 'const tr = div(v, n);', replace: 'const tr = mul(v, n);', catchedBy: 'splitVolumes' },
  { id: 'M27-fl01-without-dye', file: 'src/e10/index.js', find: "dyeNamed === true && cmp(p, R(1)) === 0", replace: 'cmp(p, R(1)) === 0', catchedBy: 'strengthFactor' },
  { id: 'M28-p1-refused', file: 'src/e10/index.js', find: '!p || cmp(p, R(1)) < 0', replace: '!p || cmp(p, R(1)) <= 0', catchedBy: 'strengthFactor' },
  // E7 relations
  { id: 'M29-cv-no-sqrt', file: 'src/e7/index.js', find: '100 / Math.sqrt(Number(l.n))', replace: '100 / Number(l.n)', catchedBy: 'poissonCV' },
  { id: 'M30-cv-counts-dead', file: 'src/e7/index.js', find: 'Math.sqrt(Number(l.n))', replace: 'Math.sqrt(Number(l.n) + Number(d.n))', catchedBy: 'poissonCV' },
  { id: 'M31-cv-rf06-rf07-swapped', file: 'src/e7/index.js', find: "d.n === 0n ? 'CCS-RF-06' : 'CCS-RF-07'", replace: "d.n === 0n ? 'CCS-RF-07' : 'CCS-RF-06'", catchedBy: 'poissonCV' },
  // display rule and engine version
  { id: 'M32-round-half-down', file: 'src/core.js', find: '(n % d) * 2n >= d', replace: '(n % d) * 2n > d', catchedBy: 'display: modes' },
  { id: 'M33-carry-keeps-exponent', file: 'src/core.js', find: 'm = m / 10n; e++;', replace: 'm = m / 10n;', catchedBy: 'display: modes' },
  { id: 'M34-negative-zero-shown', file: 'src/core.js', find: 'neg && !zero ?', replace: 'neg ?', catchedBy: 'display: modes' },
  { id: 'M35-sci3-plain-x-sign', file: 'src/core.js', find: "body = `${m[0]}.${m.slice(1)} × 10^${e}`", replace: "body = `${m[0]}.${m.slice(1)} x 10^${e}`", catchedBy: 'display: modes' },
  { id: 'M36-engine-version-drifts', file: 'src/version.js', find: "ENGINE_VERSION = '0.1.0'", replace: "ENGINE_VERSION = '0.1.1'", catchedBy: 'engine version' },
  // the harness mapping
  { id: 'H01-context-leaks-into-values', file: 'verification/run-engine.mjs', find: 'out.rejection.context = context;', replace: 'out.values = context;', catchedBy: 'RF-05 engine members' },
  { id: 'H02-chain-reports-first-stage-fields-only', file: 'verification/run-engine.mjs', find: 'bad.flatMap((s) => s.fields)', replace: 'first.fields', catchedBy: 'RF-03 once' },
  { id: 'H03-viability-wrong-display-mode', file: 'verification/run-engine.mjs', find: "viabilityPercent: 'fixed1'", replace: "viabilityPercent: 'fixed2'", catchedBy: 'viability and poissonCV displays' },
  { id: 'H04-flags-dropped', file: 'verification/run-engine.mjs', find: 'out.flags = r.flags ?? [];', replace: 'out.flags = [];', catchedBy: 'flags are codes' },
  { id: 'H05-incomplete-not-merged-across-stages', file: 'verification/run-engine.mjs', find: 'gaps.flatMap((s) => s.missing)', replace: 'gaps[0].missing', catchedBy: 'merges incomplete' },
];

function failedTests(dir) {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const p = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...SUITE.map((f) => path.join('tests', f))], { cwd: dir, env, encoding: 'utf8' });
  const names = [...p.stdout.matchAll(/^not ok \d+ - (.+)$/gm)].map((m) => m[1].replace(/\s+#.*$/, ''));
  return { status: p.status, names };
}

function stage(id) {
  const dir = path.join(WORK, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(path.join(dir, 'tests'), { recursive: true });
  mkdirSync(path.join(dir, 'verification'), { recursive: true });
  cpSync(path.join(ROOT, 'src'), path.join(dir, 'src'), { recursive: true });
  cpSync(path.join(ROOT, 'package.json'), path.join(dir, 'package.json'));
  cpSync(path.join(ROOT, 'verification', 'run-engine.mjs'), path.join(dir, 'verification', 'run-engine.mjs'));
  for (const f of SUITE) cpSync(path.join(ROOT, 'tests', f), path.join(dir, 'tests', f));
  return dir;
}

function applyMutant(dir, m) {
  const file = path.join(dir, m.file);
  const text = readFileSync(file, 'utf8');
  let at = -1;
  for (let i = 0; i < (m.nth ?? 1); i++) {
    at = text.indexOf(m.find, at + 1);
    assert.notEqual(at, -1, `${m.id}: text to mutate not found`);
  }
  writeFileSync(file, text.slice(0, at) + m.replace + text.slice(at + m.find.length));
}

after(() => rmSync(WORK, { recursive: true, force: true }));

test('mutation baseline: the unmutated copy passes the whole suite', () => {
  const r = failedTests(stage('baseline'));
  assert.deepEqual(r.names, []);
  assert.equal(r.status, 0);
});

for (const m of MUTANTS) {
  test(`mutant ${m.id} is caught by "${m.catchedBy}"`, () => {
    const dir = stage(m.id);
    applyMutant(dir, m);
    const r = failedTests(dir);
    assert.notEqual(r.status, 0, 'mutant survived: the suite still passes');
    assert.ok(r.names.some((n) => n.includes(m.catchedBy)), `failed instead: ${JSON.stringify(r.names)}`);
  });
}
