// E20 name scan (AT-E20L-03), Mode B absence (AT-E20L-04), no JS number (AT-E20L-05),
// and the additive edge of the module (section 2.2). Slice A.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import * as e20 from '../src/e20/index.js';
import * as shared from '../src/e20/shared.js';
import * as pkg from '../src/index.js';
import {
  scanName, scanText, runControls, splitSource, identifiersOf, wordsOf, collect, holdsNumber,
  POSITIVE_NAMES, NEGATIVE_NAMES,
} from './e20-name-scanner.js';

const SRC = new URL('../src/e20/', import.meta.url);
const FILES = readdirSync(SRC).sort();
const textOf = (f) => readFileSync(new URL(f, SRC), 'utf8');

// The calls every slice extends: [label, function, argument list].
const CALLS = [
  ['listPresets', e20.listPresets, []],
  ['formatThreeFigures', e20.formatThreeFigures, ['2.5']],
  ['formatThreeFigures exact', e20.formatThreeFigures, [{ num: '1', den: '3' }]],
  ['formatThreeFigures blank', e20.formatThreeFigures, ['  ']],
  ['formatThreeFigures number', e20.formatThreeFigures, [5]],
  ['formatThreeFigures text', e20.formatThreeFigures, ['2e5']],
  // Slice B: F01, F03, F04. Each has a result, an incomplete and every refusal code it can give.
  ['resolveLimit typed', e20.resolveLimit, [{ form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' }]],
  ['resolveLimit typed other', e20.resolveLimit, [{ form: 'typed', value: '2', unit: 'other', otherLabel: 'jar', source: 's' }]],
  ['resolveLimit km', e20.resolveLimit, [{ form: 'km', K: '5', KSource: 's', M: '3', Munit: 'mg', MSource: 's' }]],
  ['resolveLimit preset-1', e20.resolveLimit, [{ form: 'preset', presetId: 'preset-1', M: '7', Munit: 'Unit', MSource: 's' }]],
  ['resolveLimit preset-3', e20.resolveLimit, [{ form: 'preset', presetId: 'preset-3' }]],
  ['resolveLimit incomplete', e20.resolveLimit, [null]],
  ['resolveLimit RC-01', e20.resolveLimit, [{ form: 'other' }]],
  ['resolveLimit RC-02', e20.resolveLimit, [{ form: 'preset', presetId: 'preset-4' }]],
  ['resolveLimit CCS-RF-03', e20.resolveLimit, [{ form: 'typed', value: '0', unit: 'EU/mL', source: 's' }]],
  ['resolveLimit wrong-form', e20.resolveLimit, ['text']],
  ['mvdFromLimit mL', e20.mvdFromLimit, [{ form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' }, 'chromogenic', null, null, '0.03']],
  ['mvdFromLimit mg', e20.mvdFromLimit, [{ form: 'km', K: '5', KSource: 's', M: '3', Munit: 'mg', MSource: 's' }, 'gel-clot', '2', 'mg/mL', '0.25']],
  ['mvdFromLimit other', e20.mvdFromLimit, [{ form: 'typed', value: '2', unit: 'other', otherLabel: 'jar', source: 's' }, 'turbidimetric', '2', 'jar/mL', '0.25']],
  ['mvdFromLimit incomplete', e20.mvdFromLimit, [null, null, null, null, null]],
  ['mvdFromLimit RC-01', e20.mvdFromLimit, [{ form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' }, 'other', null, null, '1']],
  ['mvdFromLimit RC-02', e20.mvdFromLimit, [{ form: 'preset', presetId: 'preset-5' }, 'chromogenic', null, null, '1']],
  ['mvdFromLimit RC-03', e20.mvdFromLimit, [{ form: 'typed', value: '1', unit: 'EU/mg', source: 's' }, 'chromogenic', '1', 'Units/mL', '1']],
  ['mvdFromLimit CCS-RF-03', e20.mvdFromLimit, [{ form: 'typed', value: '1', unit: 'EU/mL', source: 's' }, 'chromogenic', null, null, '0']],
  ['checkDilution below', e20.checkDilution, ['10', { num: '10001', den: '1000' }]],
  ['checkDilution above', e20.checkDilution, ['20', { num: '10', den: '1' }]],
  ['checkDilution incomplete', e20.checkDilution, [null, undefined]],
  ['checkDilution CCS-RF-03', e20.checkDilution, ['0.5', { num: '0', den: '1' }]],
];
const run = () => CALLS.map(([label, fn, args]) => [label, fn(...args)]);

const TEST_FILES = [
  'e20-names.test.js', 'e20-rules.test.js', 'e20-numeric.test.js', 'e20-name-scanner.js',
  'e20-limit.test.js', 'e20-dilution.test.js',
];

test('AT-E20L-03 controls: all ten positives reported, no negative reported', () => {
  assert.equal(POSITIVE_NAMES.length + 1, 10);
  assert.deepEqual(runControls(), []);
  for (const n of POSITIVE_NAMES) assert.ok(scanName(n).length, n);
  for (const n of NEGATIVE_NAMES) assert.deepEqual(scanName(n), [], n);
  assert.deepEqual(scanText('// map as string'), []);
  assert.ok(scanText('// the reading meets\n// specification here').length);
});

test('AT-E20L-03 scope 1: directory and file names', () => {
  assert.deepEqual(scanName('e20'), []);
  assert.deepEqual(FILES.filter((f) => scanName(f).length), []);
  assert.deepEqual(TEST_FILES.filter((f) => scanName(f).length), []);
});

test('AT-E20L-03 scope 2: exported names, and the index export line', () => {
  const names = [...Object.keys(e20), ...Object.keys(shared)];
  assert.deepEqual(names.filter((n) => scanName(n).length), []);
  const line = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('e20'));
  assert.deepEqual(line, ["export * as e20 from './e20/index.js';"]);
  assert.deepEqual(scanName(line[0]), []);
  assert.deepEqual(scanText(line[0]), []);
});

test('AT-E20L-03 scopes 3 to 5: identifiers, string constants, result keys and values', () => {
  for (const f of FILES) {
    const { code, strings } = splitSource(textOf(f));
    const idents = [...new Set(identifiersOf(code))];
    assert.deepEqual(idents.filter((n) => scanName(n).length), [], `identifiers of ${f}`);
    assert.deepEqual(strings.filter((s) => scanName(s).length), [], `strings of ${f}`);
  }
  for (const [label, r] of run()) {
    const { keys, strings } = collect(r);
    assert.deepEqual([...keys].filter((k) => scanName(k).length), [], `keys of ${label}`);
    assert.deepEqual([...strings].filter((s) => scanName(s).length), [], `values of ${label}`);
  }
  const { keys, strings } = collect(JSON.parse(JSON.stringify(shared.CODES)));
  const all = [shared.CODES, shared.REASONS, shared.CLOSED_STRINGS, shared.PRESET_IDS];
  for (const t of all) {
    const c = collect(JSON.parse(JSON.stringify(t)), keys, strings);
    assert.deepEqual([...c.keys, ...c.strings].filter((s) => scanName(s).length), []);
  }
});

test('AT-E20L-03 scope 6: whole source text including comments (form B)', () => {
  for (const f of FILES) assert.deepEqual(scanText(textOf(f)), [], f);
});

const BANNED_WORDS = ['weight', 'volume', 'time', 'duration', 'hour', 'hours', 'kg'];
const paramsOf = (fn) => {
  const src = fn.toString();
  const inner = src.slice(src.indexOf('(') + 1, src.indexOf(')'));
  return inner.split(',').map((s) => s.trim()).filter(Boolean);
};

test('AT-E20L-04 Mode B absence: names carry none of the Mode B words', () => {
  for (const [name, fn] of Object.entries(e20)) {
    if (typeof fn !== 'function') continue;
    for (const p of paramsOf(fn)) {
      assert.match(p, /^[A-Za-z_$][\w$]*$/, `${name}: plain parameter names only`);
      assert.deepEqual(wordsOf(p).filter((w) => BANNED_WORDS.includes(w)), [], `${name}(${p})`);
    }
  }
  for (const [label, r] of run()) {
    const { keys } = collect(r);
    for (const k of keys) assert.deepEqual(wordsOf(k).filter((w) => BANNED_WORDS.includes(w)), [], `${label}.${k}`);
  }
  for (const f of FILES) {
    const words = identifiersOf(splitSource(textOf(f)).code).flatMap(wordsOf);
    assert.deepEqual(words.filter((w) => BANNED_WORDS.includes(w)), [], f);
  }
});

test('AT-E20L-04 an extra member or argument of a Mode B name changes no result', () => {
  const base = e20.formatThreeFigures({ num: '12345', den: '1' });
  for (const extra of ['weight', 'volumeToGive', 'time', 'duration', 'hours', 'kg']) {
    assert.deepEqual(e20.formatThreeFigures({ num: '12345', den: '1', [extra]: '70' }), base, extra);
  }
  assert.deepEqual(e20.formatThreeFigures('12345', 70, '1'), e20.formatThreeFigures('12345'));
  assert.deepEqual(e20.listPresets(70, { weight: '70' }), e20.listPresets());
  const typed = { form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' };
  const baseLimit = e20.resolveLimit(typed);
  const baseMvd = e20.mvdFromLimit(typed, 'chromogenic', null, null, '0.03');
  for (const extra of ['weight', 'volumeToGive', 'time', 'duration', 'hours', 'kg']) {
    assert.deepEqual(e20.resolveLimit({ ...typed, [extra]: '70' }), baseLimit, extra);
    assert.deepEqual(e20.mvdFromLimit({ ...typed, [extra]: '70' }, 'chromogenic', null, null, '0.03', '70'), baseMvd, extra);
  }
  const mvd = { num: '10', den: '1' };
  assert.deepEqual(e20.checkDilution('2', mvd, '70', { weight: '70' }), e20.checkDilution('2', mvd));
});

test('AT-E20L-05 no member of any returned object, at any depth, is a JS number', () => {
  for (const [label, r] of run()) assert.equal(holdsNumber(r), false, label);
  assert.equal(holdsNumber({ a: [{ b: 1 }] }), true); // the walker does see a number
});

test('AT-E20L-05 the source holds no binary-float parse or arithmetic on an input', () => {
  for (const f of FILES) {
    const text = textOf(f);
    assert.doesNotMatch(text, /parseFloat|parseInt|Number\(|toNumber|Math\.|toFixed|toPrecision/, f);
    assert.doesNotMatch(text, /from\s+'[^']*e10/, `${f}: no import from the E10 directory`);
  }
});

test('section 2.2: the package exports e20 and version() does not list it', () => {
  assert.equal(pkg.e20.listPresets, e20.listPresets);
  assert.equal(pkg.e20.MODULE, 'E20');
  assert.equal(Object.keys(pkg.version().modules).some((k) => k === 'E20'), false);
});
