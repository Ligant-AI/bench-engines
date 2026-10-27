// x10Comparison, from the signed spec section 4.7 and section 2 only [T-0006].
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e9 } from '../src/index.js';

const shown = (r) => e9.display('sig3trim', r.k);

test('x10Comparison: V_sq = 0.1 exactly (decimal) is same, k = 1, near false', () => {
  for (const v of ['0.1', '0.10', '.1', '0.1000000000000000000001'.slice(0, 5)]) {
    const r = e9.x10Comparison(v);
    assert.equal(r.status, 'result');
    assert.equal(r.direction, 'same');
    assert.equal(r.k, 1);
    assert.equal(r.near, false);
  }
});

test('x10Comparison: Vsq "0.1005" gives r 1.005, high, k 1.005 unrounded, shows 1.01, near false (exact decimal)', () => {
  const r = e9.x10Comparison('0.1005');
  assert.equal(r.direction, 'high');
  assert.equal(r.r, '1.005');
  assert.equal(r.k, '1.005');
  assert.equal(shown(r), '1.01');
  assert.equal(r.near, false);
  assert.equal(r.engine.module, 'E9');
  assert.equal(r.engine.version, '0.1.0');
});

test('x10Comparison: high side just below 1.005 is near (shows 1)', () => {
  const r = e9.x10Comparison('0.10049999');
  assert.equal(r.direction, 'high');
  assert.equal(r.k, '1.0049999');
  assert.equal(shown(r), '1');
  assert.equal(r.near, true);
  assert.equal(e9.x10Comparison('0.1001').near, true);
  assert.equal(e9.x10Comparison('0.10051').near, false);
});

test('x10Comparison: low side, k = 1/r, near when 1.005 x r > 1', () => {
  const a = e9.x10Comparison('0.0996'); // r 0.996; 1.005 x 0.996 = 1.00098 > 1
  assert.equal(a.direction, 'low');
  assert.equal(a.r, '0.996');
  assert.equal(shown(a), '1');
  assert.equal(a.near, true);
  const b = e9.x10Comparison('0.0995'); // r 0.995; 1.005 x 0.995 = 0.999975 < 1; k = 1.00502..
  assert.equal(b.direction, 'low');
  assert.equal(shown(b), '1.01');
  assert.equal(b.near, false);
  const c = e9.x10Comparison('0.09951'); // 1.005 x 0.9951 = 1.0000755 > 1
  assert.equal(c.near, true);
  assert.equal(shown(c), '1');
});

test('x10Comparison: far values, k as 1/r when low and r when high', () => {
  const lo = e9.x10Comparison('0.0125');
  assert.equal(lo.direction, 'low');
  assert.equal(lo.r, 0.125);
  assert.equal(lo.k, 8);
  assert.equal(lo.near, false);
  const hi = e9.x10Comparison('1000');
  assert.equal(hi.direction, 'high');
  assert.equal(hi.r, 10000);
  assert.equal(hi.k, 10000);
  assert.equal(hi.near, false);
  assert.equal(e9.x10Comparison('0.0001').k, 1000);
});

test('x10Comparison: V_sq <= 0 and non-decimal text are rejected CCS-RF-03, fields [Vsq]', () => {
  for (const bad of ['0', '-0.1', '-1', '2e5', '1e-1', '2x10^5', '1,5', 'NaN', 'Infinity', '0x10', '0.1 uL', 'abc', '1.2.3']) {
    const r = e9.x10Comparison(bad);
    assert.equal(r.status, 'rejected', bad);
    assert.equal(r.code, 'CCS-RF-03');
    assert.deepEqual(r.fields, ['Vsq']);
    assert.deepEqual(r.indices, []);
    assert.equal('k' in r, false);
  }
});

test('x10Comparison: null or blank is incomplete (CCS-RF-01)', () => {
  for (const v of [null, undefined, '', '   ']) {
    const r = e9.x10Comparison(v);
    assert.equal(r.status, 'incomplete');
    assert.deepEqual(r.missing, ['Vsq']);
  }
});

test('x10Comparison: a JS number is rejected CCS-RF-03 (text only), also non-string types', () => {
  for (const bad of [0.1, 0.1005, 5, NaN, Infinity, 10n, true, {}, []]) {
    const r = e9.x10Comparison(bad);
    assert.equal(r.status, 'rejected');
    assert.equal(r.code, 'CCS-RF-03');
    assert.deepEqual(r.fields, ['Vsq']);
  }
});

test('chain: squareVolume text output goes to x10Comparison unchanged', () => {
  const sv = e9.squareVolume('0.335', '0.3'); // 0.1005 uL
  assert.equal(sv.status, 'result');
  assert.equal(sv.Vsq, '0.1005');
  assert.equal(typeof sv.Vsq, 'string');
  const r = e9.x10Comparison(sv.Vsq);
  assert.equal(r.status, 'result');
  assert.equal(r.direction, 'high');
  assert.equal(r.k, '1.005');
  assert.equal(shown(r), '1.01');
  assert.equal(r.near, false);
  const one = e9.squareVolume('1', '0.1'); // 0.1 uL
  const same = e9.x10Comparison(one.Vsq);
  assert.equal(same.direction, 'same');
  assert.equal(same.near, false);
  const lo = e9.x10Comparison(e9.squareVolume('0.9', '0.1').Vsq); // 0.09 uL
  assert.equal(lo.direction, 'low');
  assert.equal(lo.r, '0.9');
});

test('chain: squareVolume number output (binary-exact) goes to x10Comparison as String(Vsq)', () => {
  const sv = e9.squareVolume('1', '0.5'); // 0.5 uL, a JS number; r = 5 > 1 so high (spec 4.7)
  assert.equal(sv.status, 'result');
  assert.equal(typeof sv.Vsq, 'number');
  const r = e9.x10Comparison(String(sv.Vsq));
  assert.equal(r.status, 'result');
  assert.equal(r.direction, 'high');
  assert.equal(String(r.r), '5');
  assert.equal(String(r.k), '5');
  assert.equal(r.near, false);
});
