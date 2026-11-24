# Changelog

## Unreleased
- E20 module 0.1.0 added in `src/e20/` (T-0735; docs/engine-spec-e20-endotoxin-limit-mvd.md): `resolveLimit`, `listPresets`, `mvdFromLimit`, `checkDilution`, `assessResult`, `assessSuitability`, `screenDilutions`, `formatThreeFigures`, `checkRecordDates` (E20L-F01..F09). Exported from `src/index.js` as `e20`.
- Additive only: no change to `src/core.js`, E7, E9 or E10, and no dependency. The package version and `src/version.js` are not changed here; the minor bump to 0.3.0 is made in the version commit (E20L-NF-06, section 2.4).

## 0.2.0
- Package version 0.2.0 (KAITO-D187; additive minor bump, E10R-NF-05).
- E10 module 0.3.0: scaling and activity E10R-F13..F16, F18..F23 added (`scaleToVolume`, `volumeFromAmount`, `balanceVolume`, `percentSolution`, `concentrateVolume`, `roundDeclared`, `activityToMass`, `massToActivity`, `activityAmountFromConcentration`, `volumeFill`), from docs/engine-spec-e10-scaling-activity.md r3.1 with its errata, E10R-AMD-1 and E10R-AMD-2-r2 with their errata. Engine.moduleVersion 0.3.0 on every E10 result and refusal.
- Declared change (AT-E10R-13): the activity tokens IU, U, IU/mL, U/mL, IU/mg, IU/ug, U/mg, U/ug are table units now; amountFromConcentration (E10C-F12) refuses them with E10-RC-02 instead of E10-RC-01.
- E9 and E7 modules unchanged at 0.1.0.

## 0.1.1
- Package version 0.1.1.
- E10 module 0.2.0: E10 conversions E10C-F03..F12 added; engine.moduleVersion 0.2.0 on every E10 result and refusal (E10C-ERR-1, NAD-2026-11-10-02).
- E9 and E7 modules unchanged at 0.1.0.

## 0.1.0 dev build: freeze record
- Frozen head: 0fc0e1e0ee2b9f7883edc4670ea5b9b61f9cd687 (95/95 tests)
- Independent G7: Adacs ADC-2026-10-27-18..22, MET; clerk run b RESULT: cases=313 held=0 problems=0 disagreements=0 info=133
- Version stays 0.1.0 (ADC-2026-10-27-07, -13).
- This 0.1.0 dev build was never released: no tag, no publish, and the earlier local vendored tarball (10bc3fb8…, C10 27d176e) never left this machine. If it ever did, the version reverts to 0.1.1 and Adacs is told (ADC-2026-10-27-13).
- Run method for read-only agents: literal-path redirection under .claude/reports (Cipher ruling 2026-10-27; adopted by the COO).
