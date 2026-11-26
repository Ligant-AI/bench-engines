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

const LIM = { form: 'typed', value: '0.5', unit: 'EU/mL', source: 's' };
const SUIT = {
  sampleCV: { value: '3', max: '5', source: 's' },
  spikeCV: { value: '4', max: '5', source: 's' },
  recovery: {
    B: '12', A: '2', added: '10', basis: 'as-measured',
    range: { form: 'declared', low: '50', high: '200', source: 's' },
  },
};

const RANGE = { form: 'declared', low: '50', high: '200', source: 's' };
const CRIT5 = { form: 'preset', presetId: 'preset-5' };
const CURVE = { lambda: '0.05', r: '-0.99', channels: [{ DF: '1', recovery: '100' }, { DF: '20', recovery: '60' }] };

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
  // Slice C: F06 and F05. Each has a result, an incomplete and every refusal code it can give.
  ['assessSuitability result', e20.assessSuitability, [SUIT]],
  ['assessSuitability preset range', e20.assessSuitability, [{ ...SUIT, recovery: { ...SUIT.recovery, range: { form: 'preset', presetId: 'preset-4' } } }]],
  ['assessSuitability outside', e20.assessSuitability, [{ ...SUIT, sampleCV: { value: '6', max: '5', source: 's' } }]],
  ['assessSuitability notEntered', e20.assessSuitability, [null]],
  ['assessSuitability incomplete', e20.assessSuitability, [{ sampleCV: { value: '3' } }]],
  ['assessSuitability RC-01', e20.assessSuitability, [{ ...SUIT, recovery: { ...SUIT.recovery, basis: 'x' } }]],
  ['assessSuitability RC-02', e20.assessSuitability, [{ ...SUIT, recovery: { ...SUIT.recovery, range: { form: 'preset', presetId: 'preset-5' } } }]],
  ['assessSuitability CCS-RF-03', e20.assessSuitability, [{ ...SUIT, recovery: { ...SUIT.recovery, range: { form: 'declared', low: '9', high: '1', source: 's' } } }]],
  ['assessSuitability wrong-form', e20.assessSuitability, ['text']],
  ['assessResult equals', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '5', '4', '=', '0.8', 'lal', SUIT]],
  ['assessResult less-than', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', null, '4', '<', '0.25', 'rfc', SUIT]],
  ['assessResult mg', e20.assessResult, [{ form: 'km', K: '5', KSource: 's', M: '2', Munit: 'mg', MSource: 's' }, 'fluorimetric', '2', 'mg/mL', '0.05', '5', '4', '=', '10', 'lal', SUIT]],
  ['assessResult all withheld', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '5', '20', '=', '0.8', null, null]],
  ['assessResult suitability incomplete', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '5', '4', '=', '0.2', 'lal', { sampleCV: { value: '3' } }]],
  ['assessResult suitability outside', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '5', '4', '=', '0.2', 'lal', { ...SUIT, spikeCV: { value: '9', max: '5', source: 's' } }]],
  ['assessResult suitability rejected', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '5', '4', '=', '0.2', 'lal', 'text']],
  ['assessResult incomplete', e20.assessResult, [null, null, null, null, null, null, null, null, null, null, null]],
  ['assessResult RC-01', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '5', '4', '>=', '1', 'lal', SUIT]],
  ['assessResult RC-02', e20.assessResult, [LIM, 'gel-clot', null, null, '0.05', '5', '4', '=', '1', 'lal', SUIT]],
  ['assessResult RC-03', e20.assessResult, [{ form: 'typed', value: '1', unit: 'EU/mg', source: 's' }, 'chromogenic', '1', 'Units/mL', '0.05', '5', '4', '=', '1', 'lal', SUIT]],
  ['assessResult CCS-RF-03 greater twice', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', null, '4', '>', '>5', 'lal', SUIT]],
  ['assessResult CCS-RF-03 highest', e20.assessResult, [LIM, 'chromogenic', null, null, '0.05', '0.01', '0.5', '=', '-1', 'lal', SUIT]],
  // Slice D: F07 and F09. Each has a result, an incomplete and every refusal code it can give.
  ['screenDilutions result', e20.screenDilutions, [LIM, null, null, RANGE, CRIT5, [CURVE]]],
  ['screenDilutions no limit', e20.screenDilutions, [null, null, null, RANGE, null, [{ lambda: '0.05', channels: [{ DF: '3', recovery: '90' }] }]]],
  ['screenDilutions mg', e20.screenDilutions, [{ form: 'km', K: '5', KSource: 's', M: '3', Munit: 'mg', MSource: 's' }, '2', 'mg/mL', { form: 'preset', presetId: 'preset-4' }, { form: 'declared', value: '0.9', source: 's' }, [CURVE]]],
  ['screenDilutions incomplete', e20.screenDilutions, [LIM, null, null, null, null, []]],
  ['screenDilutions RC-01', e20.screenDilutions, [LIM, null, null, { form: 'x' }, null, [CURVE]]],
  ['screenDilutions RC-02', e20.screenDilutions, [LIM, null, null, { form: 'preset', presetId: 'preset-1' }, null, [CURVE]]],
  ['screenDilutions RC-03', e20.screenDilutions, [{ form: 'typed', value: '1', unit: 'EU/mg', source: 's' }, '1', 'Units/mL', RANGE, null, [CURVE]]],
  ['screenDilutions CCS-RF-03', e20.screenDilutions, [LIM, null, null, { form: 'declared', low: '9', high: '1', source: 's' }, CRIT5, [{ lambda: '0', r: '2', channels: [{ DF: '0.5', recovery: 'x' }] }]]],
  ['checkRecordDates result', e20.checkRecordDates, ['2026-05-02', '2026-05-01', 'nonsense']],
  ['checkRecordDates wrong-form', e20.checkRecordDates, [5, '2026-05-01', null]],
];
const run = () => CALLS.map(([label, fn, args]) => [label, fn(...args)]);

const TEST_FILES = [
  'e20-names.test.js', 'e20-rules.test.js', 'e20-numeric.test.js', 'e20-name-scanner.js',
  'e20-limit.test.js', 'e20-dilution.test.js', 'e20-suitability.test.js', 'e20-result.test.js',
  'e20-screen.test.js', 'e20-dates.test.js', 'e20-order.test.js', 'e20-purity.test.js',
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
