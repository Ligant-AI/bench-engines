export { ENGINE_VERSION, engineVersionLine } from './version.js';
export * as e9 from './e9/index.js';
export * as e7 from './e7/index.js';
export * as e10 from './e10/index.js';
import { ENGINE_VERSION as V } from './version.js';
import * as _e9 from './e9/index.js';
import * as _e7 from './e7/index.js';
import * as _e10 from './e10/index.js';

// Spec section 7: the package version and the module version lines.
export function version() {
  return {
    package: '@ligant/bench-engines',
    version: V,
    modules: { E9: _e9.MODULE_VERSION, E7: _e7.MODULE_VERSION, E10: _e10.MODULE_VERSION },
  };
}
