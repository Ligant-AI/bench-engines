// Engine package version. Must equal "version" in package.json (tests/version.test.js checks it).
export const ENGINE_VERSION = '0.0.0';

export function engineVersionLine() {
  return `@ligant/bench-engines ${ENGINE_VERSION}`;
}
