import test from 'node:test';
import assert from 'node:assert/strict';
import { e9, e7, e10 } from '../src/index.js';

// T-0491 ruling 2: engine.moduleVersion is read from the module's own MODULE_VERSION constant.
test('E10 results carry E10 MODULE_VERSION', () => {
  assert.equal(e10.strengthFactor('2').engine.moduleVersion, e10.MODULE_VERSION);
  assert.equal(e10.strengthFactor(null).engine.moduleVersion, e10.MODULE_VERSION);
  assert.equal(e10.strengthFactor('0').engine.moduleVersion, e10.MODULE_VERSION);
  assert.equal(e10.splitVolumes('10', '2').engine.moduleVersion, e10.MODULE_VERSION);
});

test('E9 results carry E9 MODULE_VERSION', () => {
  for (const r of [e9.squareVolume('1', '0.1'), e9.squareVolume(null, null), e9.viability({ sumLive: '8', sumDead: '2' })]) {
    assert.equal(r.engine.module, 'E9');
    assert.equal(r.engine.moduleVersion, e9.MODULE_VERSION);
  }
});

test('E7 results carry E7 MODULE_VERSION', () => {
  for (const r of [e7.poissonCV({ sumLive: '100', sumDead: '0' }), e7.poissonCV({})]) {
    assert.equal(r.engine.module, 'E7');
    assert.equal(r.engine.moduleVersion, e7.MODULE_VERSION);
  }
});

// pending erratum (ADC-2026-11-10-01): AT-E10C-15, AT-E10C-16 and the E10C-NF-01/NF-05
// version expectations (engine 0.1.1, E10 module 0.2.0). No test here.
