import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENGINE_VERSION, engineVersionLine, e9, e7, e10 } from '../src/index.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('engine version equals package version', () => {
  assert.equal(ENGINE_VERSION, pkg.version);
  assert.equal(engineVersionLine(), `@ligant/bench-engines ${pkg.version}`);
});

test('modules E9, E7, E10 exist and carry a version line', () => {
  assert.equal(e9.MODULE, 'E9');
  assert.equal(e7.MODULE, 'E7');
  assert.equal(e10.MODULE, 'E10');
  for (const m of [e9, e7, e10]) assert.equal(typeof m.MODULE_VERSION, 'string');
});

test('no E4 module in 1.0', async () => {
  const index = await import('../src/index.js');
  assert.equal('e4' in index, false);
});
