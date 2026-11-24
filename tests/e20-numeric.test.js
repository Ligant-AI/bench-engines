// E20 numeric object (5.1), E20L-F08 formatThreeFigures and E20L-F02 listPresets. Slice A.
// Expected values come from the rules of 0.1.0 section 6 and the E20 specification only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENGINE_VERSION } from '../src/version.js';
import { formatThreeFigures, listPresets } from '../src/e20/index.js';
import { numeric } from '../src/e20/numeric.js';
import { rat, parse } from '../src/core.js';
import { collect } from './e20-name-scanner.js';

const text = (v) => {
  const r = formatThreeFigures(v);
  assert.equal(r.status, 'result', JSON.stringify(v));
  return r.text;
};
const engine = { package: '@ligant/bench-engines', version: ENGINE_VERSION, module: 'E20', moduleVersion: '0.1.0' };

test('F08: below 1000 on the once-rounded value, plain digits with trailing zeros kept', () => {
  const rows = [
    ['2.5', '2.50'], ['8', '8.00'], ['0.0125', '0.0125'], ['9.995', '10.0'], ['0.09995', '0.100'],
    ['999', '999'], ['999.4', '999'], ['1.11111', '1.11'], ['2.345', '2.35'], ['0.00001234', '0.0000123'],
    ['.5', '0.500'], ['5.', '5.00'], ['+5', '5.00'], [' 5 ', '5.00'],
  ];
  for (const [input, want] of rows) assert.equal(text(input), want, input);
});

test('F08: from 1000 on the once-rounded value, the sci3 form of the same exact value', () => {
  const rows = [
    ['1000', '1.00 × 10^3'], ['1234', '1.23 × 10^3'], ['999.5', '1.00 × 10^3'], ['999.49', '999'],
    ['9995000', '1.00 × 10^7'], ['9994990', '9.99 × 10^6'], ['2000000', '2.00 × 10^6'],
    ['12345678', '1.23 × 10^7'],
  ];
  for (const [input, want] of rows) assert.equal(text(input), want, input);
  assert.ok(text('1234').includes('×'));
});

test('F08: exact zero is 0, never -0', () => {
  for (const z of ['0', '0.0', '-0', '-0.000', '+0', '.0', { num: '0', den: '7' }, { num: '-0', den: '1' }]) {
    assert.equal(text(z), '0', JSON.stringify(z));
  }
});

test('F08: negative values round the magnitude half away from zero and never take the exponent form', () => {
  const rows = [
    ['-2.5', '-2.50'], ['-2.345', '-2.35'], ['-0.0125', '-0.0125'], ['-999', '-999'],
    ['-999.5', '-1000'], ['-1234', '-1230'], ['-12345678', '-12300000'], ['-1000', '-1000'],
  ];
  for (const [input, want] of rows) assert.equal(text(input), want, input);
});

test('F08: an exact object is accepted, in lowest terms or not, with zero or negative num', () => {
  assert.equal(text({ num: '10', den: '4' }), '2.50');
  assert.equal(text({ num: '5', den: '2' }), '2.50');
  assert.equal(text({ num: '1', den: '3' }), '0.333');
  assert.equal(text({ num: '2', den: '3' }), '0.667');
  assert.equal(text({ num: '-10', den: '4' }), '-2.50');
  assert.equal(text({ num: '1000', den: '1' }), '1.00 × 10^3');
  assert.equal(text({ num: '-5000', den: '1' }), '-5000');
});

test('F08: the result shape is { status, text, engine }', () => {
  const r = formatThreeFigures('2.5');
  assert.deepEqual(Object.keys(r), ['status', 'text', 'engine']);
  assert.deepEqual(r.engine, engine);
});

test('F08 refusals: blank is incomplete, text and form faults are CCS-RF-03 naming value', () => {
  for (const blank of [null, undefined, '', '   ', '\t']) {
    const r = formatThreeFigures(blank);
    assert.deepEqual(r, { status: 'incomplete', code: 'CCS-RF-01', missing: ['value'], engine });
  }
  const reject = (v, reason) => {
    const r = formatThreeFigures(v);
    assert.deepEqual(r, {
      status: 'rejected', code: 'CCS-RF-03', fields: ['value'], indices: [],
      reasons: [{ fields: ['value'], reason }], engine,
    }, String(v));
  };
  for (const bad of ['2e5', '1,5', 'NaN', '5 mg', '+', '>5', '1 2']) reject(bad, 'not-plain-decimal');
  for (const bad of [5, 0, NaN, 5n, true, [], ['5'], {}, { num: '1' }, { num: 1, den: 1 }, { num: '1', den: '0' }, { num: '1', den: '-2' }, { num: '1.5', den: '1' }]) {
    reject(bad, 'wrong-form');
  }
});

test('numeric object: a terminating value has exact, decimal, fraction, display and unit that agree', () => {
  const n = numeric(parse('2.5'), 'EU/mL');
  assert.deepEqual(n, { exact: { num: '5', den: '2' }, decimal: '2.5', fraction: '5/2', display: '2.50', unit: 'EU/mL' });
  assert.deepEqual(Object.keys(n), ['exact', 'decimal', 'fraction', 'display', 'unit']);
  const rows = [
    ['5', '5', '5/1', '5.00'], ['0.125', '0.125', '1/8', '0.125'], ['0.2', '0.2', '1/5', '0.200'],
    ['-2.5', '-2.5', '-5/2', '-2.50'], ['0', '0', '0/1', '0'], ['1234', '1234', '1234/1', '1.23 × 10^3'],
    ['0.35', '0.35', '7/20', '0.350'],
  ];
  for (const [input, decimal, fraction, display] of rows) {
    const x = numeric(parse(input));
    assert.equal(x.decimal, decimal, input);
    assert.equal(x.fraction, fraction, input);
    assert.equal(x.display, display, input);
    assert.equal(x.unit, null);
    assert.equal(`${x.exact.num}/${x.exact.den}`, fraction);
  }
});

test('numeric object: a non-terminating value gives decimal null and the reduced fraction', () => {
  const x = numeric(rat(1n, 3n), null);
  assert.deepEqual(x, { exact: { num: '1', den: '3' }, decimal: null, fraction: '1/3', display: '0.333', unit: null });
  const y = numeric(rat(-10n, 6n));
  assert.deepEqual([y.exact.num, y.exact.den, y.decimal, y.fraction, y.display], ['-5', '3', null, '-5/3', '-1.67']);
  assert.equal(numeric(rat(1n, 7n)).decimal, null);
  assert.equal(numeric(rat(1n, 6n)).decimal, null);
});

test('numeric object: a terminating value beyond 400 decimal places gives decimal null, with no throw', () => {
  const at400 = numeric(rat(1n, 2n ** 400n));
  assert.equal(typeof at400.decimal, 'string');
  assert.equal(at400.decimal.length, 402); // 0. and 400 places
  assert.ok(at400.decimal.endsWith('5'));
  assert.equal(at400.fraction, `1/${2n ** 400n}`);
  const at401 = numeric(rat(1n, 2n ** 401n));
  assert.equal(at401.decimal, null);
  assert.equal(at401.fraction, `1/${2n ** 401n}`);
  assert.equal(numeric(rat(1n, 5n ** 401n)).decimal, null);
  assert.equal(typeof numeric(rat(3n, 5n ** 400n)).decimal, 'string');
  assert.equal(at401.display, formatThreeFigures(at401.exact).text);
});

test('numeric object: the display member is F08 of the exact member', () => {
  for (const s of ['0.0125', '1234', '-1234', '999.5', '1', '0', '-0.5', '0.333', '123456789.123']) {
    const x = numeric(parse(s));
    assert.equal(x.display, formatThreeFigures(x.exact).text, s);
  }
  const third = numeric(rat(1n, 3n));
  assert.equal(third.display, formatThreeFigures(third.exact).text);
});

test('F02: five entries in order, members as the specification lists them', () => {
  const r = listPresets();
  assert.equal(r.status, 'result');
  assert.deepEqual(Object.keys(r), ['status', 'presets', 'engine']);
  assert.deepEqual(r.engine, engine);
  assert.deepEqual(r.presets.map((p) => p.presetId), ['preset-1', 'preset-2', 'preset-3', 'preset-4', 'preset-5']);
  assert.deepEqual(r.presets.map((p) => p.kind), ['k', 'k', 'limit', 'range', 'r-criterion']);
  assert.deepEqual(Object.keys(r.presets[0]), ['presetId', 'kind', 'value', 'asWritten']);
  assert.deepEqual(Object.keys(r.presets[1]), ['presetId', 'kind', 'value', 'asWritten']);
  assert.deepEqual(Object.keys(r.presets[2]), ['presetId', 'kind', 'value', 'denominator', 'asWritten']);
  assert.deepEqual(Object.keys(r.presets[3]), ['presetId', 'kind', 'low', 'high', 'lowAsWritten', 'highAsWritten']);
  assert.deepEqual(Object.keys(r.presets[4]), ['presetId', 'kind', 'value', 'asWritten']);
});

test('F02: the values 5, 0.2, 0.5, 50, 200 and 0.980, their units and their asWritten text', () => {
  const [p1, p2, p3, p4, p5] = listPresets().presets;
  assert.deepEqual(p1.value, { exact: { num: '5', den: '1' }, decimal: '5', fraction: '5/1', display: '5.00', unit: 'EU/kg' });
  assert.equal(p1.asWritten, '5');
  assert.deepEqual(p2.value, { exact: { num: '1', den: '5' }, decimal: '0.2', fraction: '1/5', display: '0.200', unit: 'EU/kg' });
  assert.equal(p2.asWritten, '0.2');
  assert.deepEqual(p3.value, { exact: { num: '1', den: '2' }, decimal: '0.5', fraction: '1/2', display: '0.500', unit: 'EU/mL' });
  assert.deepEqual(p3.denominator, { kind: 'mL', label: 'mL' });
  assert.equal(p3.asWritten, '0.5');
  assert.deepEqual(p4.low, { exact: { num: '50', den: '1' }, decimal: '50', fraction: '50/1', display: '50.0', unit: '%' });
  assert.deepEqual(p4.high, { exact: { num: '200', den: '1' }, decimal: '200', fraction: '200/1', display: '200', unit: '%' });
  assert.deepEqual([p4.lowAsWritten, p4.highAsWritten], ['50', '200']);
  assert.deepEqual(p5.value, { exact: { num: '49', den: '50' }, decimal: '0.98', fraction: '49/50', display: '0.980', unit: null });
  assert.equal(p5.asWritten, '0.980');
});

test('F02: no value other than the six, no default or selection member, fresh objects each call', () => {
  const decimals = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      if ('decimal' in v) decimals.push(v.decimal);
      Object.values(v).forEach(walk);
    }
  };
  walk(listPresets());
  assert.deepEqual(decimals.sort(), ['0.2', '0.5', '0.98', '200', '5', '50']);
  const { keys } = collect(listPresets());
  for (const k of keys) assert.doesNotMatch(k, /default|select|recommend/i);
  const a = listPresets();
  a.presets[0].value.exact.num = '999';
  a.presets.pop();
  assert.equal(listPresets().presets.length, 5);
  assert.equal(listPresets().presets[0].value.exact.num, '5');
});
