# bench-engines E10: molar and mass conversions, engine specification (T-0483, T-0489, Atlas, 9 Nov 2026)

**Status:** Scientific content signed by Nadira (NAD-2026-11-09-26) on the draft at sha256 e50773d4…6fd1. Requirement IDs are frozen. Revised 9 Nov 2026 for Nadira's corrections 1 to 9 (NAD-2026-11-09-13); every change is a row in section 15.
**Location:** the path-fence refused `bench-engines/docs/` for Atlas, so this draft is in `.claude/reports/atlas/`. Intended destination, if the owner accepts it: `bench-engines/docs/engine-spec-e10-conversions-DRAFT.md` (no D-id covers it yet).
**Where it sits:** a new file; `engine-spec-0.1.0.md` and its erratum are not edited. **Additive:** section 3 of 0.1.0 (`strengthFactor` 3.1, `splitVolumes` 3.2) is unchanged; C10 is undisturbed. The new functions continue that section as E10C-F03 to E10C-F12. (They carry the typed prefix E10C-F so that they cannot be confused with tools 3.8 and 1.6.)
**Sources read:** D-0064 section 2.6 (K2: the shared chart piece ships as 0.2.0; engines accepted by Adacs the Thursday before go-live) and addendum D-0065 section 2 (new row "E10 molar and mass conversions", for 3.8 on 19 Nov and 1.6 on 26 Nov, spec signed by Nadira on or before Thu 12 Nov, accepted Thu 12 Nov); NAD-2026-11-06-16, -22, -26, -27; NAD-2026-10-24-1000 (veritas-response-category-3.md :40-60); Petra Lindqvist's input `.claude/reports/committee/cgt-analytics-lead/2026-11-09-t0483-e10-conversions-input.md` (main source; "proposals only; Nadira rules"); `bench-engines/docs/engine-spec-0.1.0.md` sections 2, 3, 6, 7; `bench-engines/src/e10/index.js` and `src/version.js` (today E10 holds only `strengthFactor` and `splitVolumes`; package version `0.1.0`); Nadira's first reading `.claude/reports/nadira/2026-11-09-t0483-e10-conversions-first-reading.md` (NAD-2026-11-09-01 to -13). Checkout: branch `c11/preconditions`, HEAD `a265607`. No verification, reimpl, adacs/runs or snapshot path was read.
**Marking:** "PROVISIONAL" is a choice Atlas made where the sources give no rule; each is a question in sections 12 to 14. Atlas has resolved no scientific question. The one constant, N_A, is ruled from the SI Brochure, 9th edition (NAD-2026-11-09-14; section 4 and the section 9 register).

## 1. Purpose and scope

One closed, tested set of unit conversions for the suite: mass concentration, molar concentration, mass, amount (moles), copies, and amount from concentration and volume. Needed first by 3.8 (A280 and degree of labelling; one reading per wavelength, NAD-2026-11-06-22) and 1.6 (nucleic acid mass, copies and concentration); later by 1.2 and X1. ("3.8" and "1.6" always mean the tools. The engine functions are E10C-F03 to E10C-F12.)

**In this spec (ten functions):** `scaleUnit`, `massToMolar`, `molarToMass`, `massToMoles`, `molesToMass`, `molesToCopies`, `copiesToMoles`, `massToCopies`, `copiesToMass`, `amountFromConcentration`.
**Not in this spec:** specific activity (IU, U) and recipe scaling (the later row for 1.2, Thu 26 Nov; NAD-2026-11-06-27; master :224 says IU and U are never equated); the overage extraction from C5; new display functions (0.1.0 section 6 is reused; no new mode); any table of molecular weights or masses per base; copy concentration (`copies/uL`, `copies/mL`), which is not in the 12 Nov engine (section 14A).

Petra's labels C1 to C10 map to E10C-F03 to E10C-F12 in order.

## 2. Conventions

All of 0.1.0 section 2 applies unchanged (decimal-text inputs, `null` is not declared, outputs unrounded, a refusal is a returned object never a throw, order of statuses ADC-2026-10-26-08, engine version field). Additions:

| ID | Rule |
|---|---|
| E10C-IN-01 | Every numeric input (value, MW, volume, copies) is plain decimal text per 0.1.0 section 2 (ADC-2026-10-26-07). `2e5`, `NaN`, `1,5`, unit suffixes are `rejected`, CCS-RF-03, naming the field. The page parses; the engine does not |
| E10C-IN-02 | A unit is a string from the closed table of section 3, matched exactly and case-sensitively (`mM` is not `MM`; `ug/mL` is not `ug/ml`). PROVISIONAL (Q-E10C-09) |
| E10C-IN-03 | The engine uses ASCII `u` for micro. The page maps the micro sign to `u` before the call (same style question as Q-C10-28) |
| E10C-NF-01 | Additive only: `strengthFactor` and `splitVolumes` are unchanged in behaviour, inputs, outputs and tests |
| E10C-NF-02 | Full precision returned; no rounding in the engine. Display rounding is the page's, through 0.1.0 section 6, one named mode per result dimension: mass concentration `sci3`; molar concentration `sci3`; copies `sci3` always (NAD-2026-11-09-03); mass `sig3`; amount (mol) `sig3` (Atlas's choice, stated once and followed by every example; Nadira accepts either mode for amounts if stated once and followed, NAD-2026-11-09-12); volume `sig3`. No new display mode. The page chooses its display unit through the `toUnit` argument (a `sig3` mass shown in base unit would print `0.00000000100 g`). Representation (ADC-2026-11-09-04, confirmed): inputs are plain decimal text parsed exactly; each call computes the whole chain as an exact rational (integer numerator and denominator, for example BigInt) and rounds nowhere inside the engine. Every conversion result carries `exact: {num, den}`, both reduced decimal-integer strings, `den` positive, sign on `num`, zero as `0/1`. The display functions of 0.1.0 section 6 take `exact` (or decimal text) as input: one rounding, half away from zero, on the exact value, ties included. A JS number `value` may also be returned for convenience; it is never used for display or for acceptance |
| E10C-NF-03 | No intermediate is rounded anywhere in a chain (NAD-2026-10-24-1000 clause 1). Every function scales to its `toUnit` inside the same unrounded chain; `massToCopies` and `copiesToMass` are one unrounded chain; a displayed value never feeds a later step |
| E10C-NF-04 | No dependency, no random numbers, no network (CCS-NF-02 carried). The only reference data are the prefix factors and N_A |
| E10C-NF-05 | Every result carries the `engine` object of 0.1.0 section 2 with `module: "E10"`. Version, as conditions (ADC-2026-11-09-03, confirmed; KAITO-2026-11-09-03): E10 `MODULE_VERSION` moves 0.1.0 to 0.2.0; the package `version` moves 0.1.0 to 0.1.1 at the conversions gate, and the shared chart piece then ships as 0.2.0 with nothing else released under 0.1.1; E9 and E7 module lines do not move. The package version, `MODULE_VERSION`, README, PROTOCOL version line and the fixture expectation of `engine.version` change together in one commit. C10's version line states the engine change (CCS-OU-10): the package `version` is copied into `engine.version` of every result, so every C10 export changes its version string |
| E10C-NF-06 | Mixing dimensions is always a refusal; the engine never applies a molecular weight, a mass per base, an extinction coefficient or N_A implicitly. N_A is applied only by the functions whose names say "copies" (NAD-2026-11-09-10) |
| E10C-NF-07 | Passing rule (NAD-2026-11-09-04). No value that has passed through a division by MW or by N_A is ever re-entered as an input to another engine call. Every chain the tools need that contains such a division is one engine call: mass to copies and copies to mass; concentration to molar in a chosen unit and molar to mass concentration in a chosen unit; copies to amount in a chosen unit. Values that terminate (products of decimal inputs and powers of ten, for example E10C-F12's c x V) may be passed on only as exact plain decimal text that the page writes without loss. `scaleUnit` is for values the user typed |

**Refusal codes.** Reuse CCS-RF-01 (incomplete) and CCS-RF-03 (rejected, `fields`, `indices: []`) for parity. Two new codes, set by Adacs (ADC-2026-11-09-06, which closes Q-E10C-14). The `code` string in a result is `E10-RC-<nn>`: module-wide for E10, never renumbered or reused; the T-0484 recipe spec continues from `E10-RC-03`. Requirement IDs are `E10C-<class>-<nn>` (class IN, NF, DT, OU, AT, and RF for a requirement that states a refusal) and never appear in a result object. The reused codes keep their strings, `CCS-RF-01` and `CCS-RF-03`, with no alias. Section 7 carries a traceability row from each requirement to its code:

| Code | Status | Meaning | `fields` |
|---|---|---|---|
| E10-RC-01 | rejected | Unit not in the closed table of section 3 | only the unit field(s) that are unknown, argument order (ADC-2026-11-09-05) |
| E10-RC-02 | rejected | Unit in the table but of the wrong dimension for the call (`scaleUnit` across dimensions; `massToMolar` given a molar unit; `toUnit` of a dimension that is not the result's; and so on). For `scaleUnit` from mass concentration to molar the message is "needs a molecular weight, use `massToMolar`" (once `toUnit` exists, the page names the function in words, not by its code name) | only the unit field(s) that have the wrong dimension, argument order (ADC-2026-11-09-05) |

MW `null` is `incomplete` (CCS-RF-01, `missing: ["MW"]`); MW <= 0, or MW not a number, is `rejected`, CCS-RF-03, `fields: ["MW"]` (Petra's split; ruled NAD-2026-11-09-02, Q-E10C-02). A zero value (concentration, mass, amount, copies) is a result, `0`, in every one of E10C-F03 to E10C-F12; zero is never a refusal (ruled NAD-2026-11-09-01, Q-E10C-01N). The typed text `"-0"` is zero, returns `0` (never negative zero), status `result`.

**Order of statuses (confirmed by Adacs, ADC-2026-11-09-05; closes Q-E10C-10).** (1) Any required argument (including `toUnit`) `null` or blank: `incomplete`, all missing fields in argument order; nothing else evaluated. (2) Otherwise unit refusals (any unit argument, including `toUnit`): E10-RC-01 if any unit is unknown, else E10-RC-02 if any unit has the wrong dimension; one `rejected` result, CCS-RF-03 not evaluated. `fields` lists only the unit fields that caused that code (the unknown units for E10-RC-01; the wrong-dimension units for E10-RC-02), in argument order. (3) Otherwise all CCS-RF-03 conditions together (value, MW, volume), one `rejected` result, `fields` in argument order. A value that is not plain decimal text (`2e5`, `NaN`) is a value refusal, so it belongs to step 3, after any unit refusal. A call returns at most one `rejected` result. In words, the order is: incomplete, then unknown unit, then wrong dimension, then all CCS-RF-03 together.

## 3. The unit table (closed; exact decimal factors to SI base)

Base units: g/L, mol/L, g, mol, copies, L. "f" is the factor: value in unit x f = value in base. Prefix factors are data, not per-function code.

| Dimension | Units and factor to base |
|---|---|
| Mass concentration (g/L) | `g/L` 1; `mg/mL` 1; `ug/uL` 1; `ug/mL` 1e-3; `ng/uL` 1e-3; `ng/mL` 1e-6; `pg/uL` 1e-6 |
| Molar concentration (mol/L) | `M` 1; `mM` 1e-3; `uM` 1e-6; `nM` 1e-9; `pM` 1e-12; `fM` 1e-15 |
| Mass (g) | `g` 1; `mg` 1e-3; `ug` 1e-6; `ng` 1e-9; `pg` 1e-12; `fg` 1e-15 |
| Amount (mol) | `mol` 1; `mmol` 1e-3; `umol` 1e-6; `nmol` 1e-9; `pmol` 1e-12; `fmol` 1e-15; `amol` 1e-18 |
| Copies | `copies` 1 (the only copies unit; it is the `toUnit` of E10C-F08 and E10C-F10). The prefix set is not applied to `copies`: there are no prefixed or alias copies units (`kcopies`, `Mcopies`, `molecules`, `entities`, `cp`, `vg`, `GC` are E10-RC-01; NAD-2026-11-09-16 (a)). Copies per volume (`copies/uL`, `copies/mL`) is E10-RC-01 in this version (OI-1.6-2; NAD-2026-11-09-16 (c)) |
| Volume (L) | `L` 1; `mL` 1e-3; `uL` 1e-6 |

Atlas's check of the mass-concentration factors: 1 mg/mL = 1e-3 g / 1e-3 L = 1 g/L; 1 ug/uL = 1e-6 g / 1e-6 L = 1 g/L; 1 ug/mL = 1e-6 g / 1e-3 L = 1e-3 g/L; 1 ng/uL = 1e-9 g / 1e-6 L = 1e-3 g/L; 1 ng/mL = 1e-9 / 1e-3 = 1e-6 g/L; 1 pg/uL = 1e-12 / 1e-6 = 1e-6 g/L. All as listed (Nadira re-derived each: NAD-2026-11-09-05). Whether this is the right first list was Q-E10C-05; ruled sufficient, with later units added only additively under a version bump, each new factor shown as here.

**Molecular weight has no unit argument.** MW is in g/mol (numerically equal to Da). `kg` and `kDa` are not table units. Every page field that takes MW is labelled "g/mol". If a page offers kDa entry, it shows the line "150 kDa = 150000 g/mol" in its working: typing 150 for a 150 kDa IgG is a silent 1000-fold error the engine cannot detect (NAD-2026-11-09-05; E10C-UN-03).

## 4. Constant

| Name | Value | Basis | Status |
|---|---|---|---|
| N_A | 6.02214076 x 10^23 mol^-1, written as the exact integer 602214076 x 10^15 | Avogadro constant N_A = 6.022 140 76 × 10^23 mol^−1, exact (a defining constant of the SI; no uncertainty). Source: BIPM, The International System of Units (SI Brochure), 9th edition (2019), section 2.2 and Table 1 (version 4.01, June 2026, pp. 123-124), https://doi.org/10.59161/AUEZ1291; retrieved 9 November 2026 (NAD-2026-11-09-14). `Fraction(602214076)*10**15 == Fraction("6.02214076e23")` is True | ruled NAD-2026-11-09-14 |

No other constant is in the engine. The 650 g/mol per base pair in the examples is an illustrative typed value; 1.6's table values are not yet ruled.

## 5. Precision statement

Results are returned at full precision, no rounding. **Correction to Petra's note** (her section 3: with N_A an exact integer "the copies chain is exactly decimal-representable"): this holds only when the division by MW terminates, which it does not in general. Example 3 gives N = 2408856304 / 13 copies = 185296638.769230769..., non-terminating. What is exact is the rational value (confirmed, NAD-2026-11-09-12). So the method is fixed by ADC-2026-11-09-04 (confirmed; closes Q-E10C-03): the whole chain is an exact rational and every result carries `exact: {num, den}` (reduced decimal-integer strings, sign on `num`, zero as `0/1`; E10C-NF-02). Display functions take `exact`; a JS number is never used for display or acceptance. Acceptance checks equality of `exact` with the fixture rational by cross-multiplication and equality of each display string with the fixture's once-rounded string for the stated mode, with no tolerance and no numeric bound (the ADC-2026-10-26-06 bound is not needed for these functions). Not accepted: returning only a JS number, or only a decimal string cut to N digits. Nadira's science condition on any representation (met by this one): it meets 0.1.0 :22 on every displayed value, including the tie of Example 10, and it keeps the single-call chains of E10C-NF-07 unrounded.

## 6. Functions (section 3 of 0.1.0 continues)

Every function: `incomplete` on a `null` required input; version field on every result and refusal; statuses ordered per section 2. **Every conversion function takes a required output unit `toUnit` in the dimension of its result and scales to it inside the same unrounded chain** (NAD-2026-11-09-04, E10C-NF-03, E10C-NF-07). The result is `{status: "result", value, unit: toUnit, exact: {num, den}}` with `value` (a convenience number, never used for display or acceptance) and `exact` expressed in `toUnit` and unrounded (E10C-NF-02, ADC-2026-11-09-04). Where a function below writes `{status: "result", value, unit: toUnit}`, `exact` is also returned. `toUnit` of the wrong dimension, or the same-dimension requirement broken: E10-RC-02; not in the table: E10-RC-01.

### E10C-F03 `scaleUnit(value, fromUnit, toUnit)` (C1)

| Item | Specification |
|---|---|
| Purpose | Re-express a value between two units of one dimension. For values the user typed (E10C-NF-07) |
| Inputs | `value` decimal text; `fromUnit`, `toUnit` from the table, same dimension |
| Formula | `v_out = value x f(fromUnit) / f(toUnit)`; factors are exact powers of ten, so the result always terminates. `scaleUnit("x", "copies", "copies")` is the identity and returns x: it is a same-dimension call like any other, and refusing it would make copies the only dimension `scaleUnit` refuses (NAD-2026-11-09-16 (b), KAITO-2026-11-09-07; AT-E10C-19) |
| Output | `{status: "result", value: v_out, unit: toUnit}` |
| Refusals | Any null: `incomplete`. Unit not in table: E10-RC-01. Different dimensions (`g/L` to `M`): E10-RC-02 with the "needs a molecular weight" message. `value` non-numeric or negative: CCS-RF-03 `["value"]`. `value` = 0 (including the text `"-0"`) is a result, `0` |
| Serves | E10C-DT-01, E10C-UN-01, E10C-RF-01 to -05 |

### E10C-F04 `massToMolar(c, unit, MW, toUnit)` (C2)

| Item | Specification |
|---|---|
| Inputs | `c` decimal text; `unit` a mass-concentration unit; `MW` g/mol decimal text; `toUnit` a molar-concentration unit |
| Formula | `value = ((c x f(unit)) / MW) / f(toUnit)`, one unrounded chain |
| Output | `{status: "result", value, unit: toUnit}` |
| Refusals | `c`, `unit`, `MW` or `toUnit` null: `incomplete`. Unit unknown: E10-RC-01; `unit` not a mass-concentration unit or `toUnit` not a molar-concentration unit: E10-RC-02. `MW` <= 0 or non-numeric: CCS-RF-03 `["MW"]`. `c` < 0 or non-numeric: CCS-RF-03 `["c"]`. `c` = 0 returns 0 |
| Serves | E10C-DT-02 |

### E10C-F05 `molarToMass(c, unit, MW, toUnit)` (C3)
`value = ((c x f(unit)) x MW) / f(toUnit)`; `unit` a molar-concentration unit; `toUnit` a mass-concentration unit; result `unit: toUnit`. Inputs, refusals, order as E10C-F04. Serves E10C-DT-03.

### E10C-F06 `massToMoles(m, unit, MW, toUnit)` (C4)
`value = ((m x f(unit)) / MW) / f(toUnit)`; `unit` a mass unit; `toUnit` an amount unit; result `unit: toUnit`. Refusals as E10C-F04. Serves E10C-DT-04.

### E10C-F07 `molesToMass(n, unit, MW, toUnit)` (C5)
`value = ((n x f(unit)) x MW) / f(toUnit)`; `unit` an amount unit; `toUnit` a mass unit; result `unit: toUnit`. Refusals as E10C-F04. Serves E10C-DT-05.

### E10C-F08 `molesToCopies(n, unit, toUnit)` (C6)
`N = ((n x f(unit)) x N_A) / f(toUnit)`; `unit` an amount unit; `toUnit` must be `copies` (the only copies unit; Q-E10C-16); result `unit: "copies"`. No MW. Refusals: null: `incomplete`; unit unknown or wrong dimension: E10-RC-01/-02; `n` < 0 or non-numeric: CCS-RF-03 `["n"]`. Serves E10C-DT-06.

### E10C-F09 `copiesToMoles(N, toUnit)` (C7)
`value = (N / N_A) / f(toUnit)`; `toUnit` an amount unit; result `unit: toUnit`. `N` or `toUnit` null: `incomplete`; `N` < 0 or non-numeric: CCS-RF-03 `["N"]`. A non-integer `N` is returned as is: no refusal, no rounding to a whole count (Q-E10C-03N). Serves E10C-DT-07.

### E10C-F10 `massToCopies(m, unit, MW, toUnit)` (C8)
`N = (((m x f(unit)) / MW) x N_A) / f(toUnit)`, one unrounded chain; `toUnit` must be `copies` (Q-E10C-16); result `unit: "copies"`. Refusals as E10C-F06. Serves E10C-DT-08. The copy number is an average expected count, not a counted integer; the page shows `sci3` only (NAD-2026-11-09-03; section 14A).

### E10C-F11 `copiesToMass(N, MW, toUnit)` (C9)
`value = ((N / N_A) x MW) / f(toUnit)`, one unrounded chain; `toUnit` a mass unit; result `unit: toUnit`. `N`, `MW` or `toUnit` null: `incomplete`; `MW` <= 0, or `N` < 0 or non-numeric: CCS-RF-03 naming each offending field. Serves E10C-DT-09.

### E10C-F12 `amountFromConcentration(c, unit, V, Vunit, toUnit)` (C10)

| Item | Specification |
|---|---|
| Purpose | Amount in an aliquot: concentration x volume, in the dimension of `c` (mass for mass concentration, mol for molar). Gives "ng/uL in a 2 uL aliquot" before E10C-F06 to E10C-F10 |
| Formula | `value = ((c x f(unit)) x (V x f(Vunit))) / f(toUnit)`; `toUnit` a mass unit when `unit` is a mass-concentration unit, an amount unit when `unit` is a molar-concentration unit |
| Output | `{status: "result", value, unit: toUnit}` |
| Refusals | Any null: `incomplete`. Unit unknown: E10-RC-01; `unit` neither mass nor molar concentration, or `Vunit` not a volume unit, or `toUnit` not of the dimension that `unit` implies: E10-RC-02. `V` <= 0 or non-numeric: CCS-RF-03 `["V"]` (a zero volume declares no aliquot, so it is refused); `c` < 0 or non-numeric: CCS-RF-03 `["c"]`; `c` = 0 returns 0 |
| Status | In the 12 Nov engine (ruled NAD-2026-11-09-06, Q-E10C-06). If Kaito must cut the 12 Nov scope for time, it may move to an additive acceptance by Thu 19 Nov, not later |
| Serves | E10C-DT-10 |

## 7. Requirement IDs (provisional; frozen on Nadira's signature)

| Area | ID | Requirement |
|---|---|---|
| Input | E10C-IN-01 | Decimal-text inputs only; the page parses |
| Input | E10C-IN-02 | Units exact, case-sensitive, closed table |
| Input | E10C-IN-03 | ASCII `u` for micro at the engine |
| Determination | E10C-DT-01 | `scaleUnit` (E10C-F03): `value x f(from) / f(to)`, same dimension only |
| Determination | E10C-DT-02 | `massToMolar` (E10C-F04): `((c x f) / MW) / f(toUnit)` |
| Determination | E10C-DT-03 | `molarToMass` (E10C-F05): `((c x f) x MW) / f(toUnit)` |
| Determination | E10C-DT-04 | `massToMoles` (E10C-F06): `((m x f) / MW) / f(toUnit)` |
| Determination | E10C-DT-05 | `molesToMass` (E10C-F07): `((n x f) x MW) / f(toUnit)` |
| Determination | E10C-DT-06 | `molesToCopies` (E10C-F08): `((n x f) x N_A) / f(toUnit)` |
| Determination | E10C-DT-07 | `copiesToMoles` (E10C-F09): `(N / N_A) / f(toUnit)` |
| Determination | E10C-DT-08 | `massToCopies` (E10C-F10): `(((m x f) / MW) x N_A) / f(toUnit)`, one unrounded chain |
| Determination | E10C-DT-09 | `copiesToMass` (E10C-F11): `((N / N_A) x MW) / f(toUnit)`, one unrounded chain |
| Determination | E10C-DT-10 | `amountFromConcentration` (E10C-F12): `((c x f) x (V x f)) / f(toUnit)` |
| Units | E10C-UN-01 | The closed unit table of section 3 with its exact factors |
| Units | E10C-UN-02 | N_A = 602214076 x 10^15 mol^-1 |
| Units | E10C-UN-03 | MW is in g/mol, numerically Da, with no unit argument; `kg` and `kDa` are not table units; every page field taking MW is labelled "g/mol"; a page offering kDa entry shows "150 kDa = 150000 g/mol" in its working (NAD-2026-11-09-05) |
| Flags | none | The engine raises no flag (free-dye statement and above-2.0 flag are 3.8's) |
| Refusals | E10C-RF-01 | The engine refuses an unknown unit with code E10-RC-01 |
| Refusals | E10C-RF-02 | The engine refuses a wrong or mixed dimension, including a `toUnit` of the wrong dimension, with code E10-RC-02 |
| Refusals | E10C-RF-03 | MW `null` is `incomplete` (CCS-RF-01); MW <= 0 or not a number is CCS-RF-03 `["MW"]` |
| Refusals | E10C-RF-04 | Negative or non-numeric value is CCS-RF-03; zero is a result; the text `"-0"` is zero and returns `0` |
| Refusals | E10C-RF-05 | Order of statuses of section 2; at most one `rejected` per call |
| Output | E10C-OU-01 | Unrounded `value` expressed in `toUnit`, plus that `unit` string, plus `exact: {num, den}` (reduced decimal-integer strings, sign on `num`, zero as `0/1`; ADC-2026-11-09-04); version field on every result |
| Non-functional | E10C-NF-01 to -07 | As section 2 |

Traceability, requirement to code (naming set by ADC-2026-11-09-06; a requirement ID never appears in a result, a code is what a result and an export store):

| Requirement | Code in the result | Acceptance tests |
|---|---|---|
| E10C-RF-01 | E10-RC-01 | AT-E10C-06 |
| E10C-RF-02 | E10-RC-02 | AT-E10C-05, AT-E10C-07 |
| E10C-RF-03, E10C-RF-04 | CCS-RF-01 (MW `null`), CCS-RF-03 | AT-E10C-08, AT-E10C-09 |
| E10C-RF-05 | order of statuses, ADC-2026-11-09-05 | AT-E10C-11, AT-E10C-12 |

## 8. Engine and tool boundary (ruled, NAD-2026-11-09-09; text corrected NAD-2026-11-09-11)

Petra's proposal, ruled by Nadira. Engine: the ten functions E10C-F03 to E10C-F12 with `toUnit`, the prefix table and N_A; no other reference data. Tool-specific, not engine:

- **3.8:** A280 concentration `c = A_corr / (epsilon x path)`; corrected A280 = A280_neat - Amax_neat x CF; DOL = (Amax_neat / epsilon_dye) / protein molarity, with protein molarity = A_corr / (epsilon_protein x path); the six clauses of NAD-2026-10-24-1000; the refusal at corrected A280 of zero or below (clause 4); the epsilon and CF constants table with source strings (clause 5); the free-dye statement and above-2.0 flag (clause 6); one reading per wavelength (NAD-2026-11-06-22). Epsilon, CF and path are therefore not engine constants. 3.8 reports the protein in molar, always; it reports mg/mL also when the user declares the protein MW in g/mol, and the one step 3.8 shares with the engine is `molarToMass` (M x MW) in one call with `toUnit: "mg/mL"` (NAD-2026-11-09-11).
- **1.6:** its own versioned route-2 mass table (mass per bp and per nucleotide, end terms, genome mass, pg per diploid genome, compelled choice, single-strand refusal; NAD-2026-10-24-1202 item 4), the A260 factors, length to MW. The engine receives a finished MW and never knows what a base pair weighs ("no other Category 1 tool hard-codes a mass per base pair").
- **Dilution rescale:** `A_neat = A_obs x factor` (clause 2) and its refusals stay in 3.8; the engine has no absorbance concept (NAD-2026-11-09-07; convention in section 14A).
- **Outside this spec:** specific activity (IU, U), the 1.2 row (NAD-2026-11-06-27).

## 9. Register of values (basis and status)

| Value | Basis | Status |
|---|---|---|
| N_A = 6.02214076 x 10^23 mol^-1, exact (602214076 x 10^15 mol^-1) | Avogadro constant N_A = 6.022 140 76 × 10^23 mol^−1, exact (a defining constant of the SI; no uncertainty). Source: BIPM, The International System of Units (SI Brochure), 9th edition (2019), section 2.2 and Table 1 (version 4.01, June 2026, pp. 123-124), https://doi.org/10.59161/AUEZ1291; retrieved 9 November 2026 (NAD-2026-11-09-14) | ruled NAD-2026-11-09-14 |
| Prefix factors, section 3 | Exact powers of ten (SI) | Atlas check shown in section 3; Nadira re-derived the seven mass-concentration factors (NAD-2026-11-09-05) |
| Unit list, section 3 | Petra input section 1 | Ruled sufficient as the first list (NAD-2026-11-09-05); additive growth only |
| Examples 1 to 5 | Petra's, each re-derived by Atlas | Hand-derived, working shown; the fixture author derives independently. Rewritten as single calls with `toUnit` (E10C-NF-07) |
| Examples 6 to 9 | Atlas | Hand-derived, working shown. Examples 7 and 8 rewritten as single calls |
| Examples 10 to 14 | Example 10 given exactly by Nadira (NAD-2026-11-09-12 (a)); 11 to 14 Atlas | Derived with python3 `fractions` and `decimal`, working shown in section 10 |
| 3.8 chain values of NAD-2026-10-24-1000 (DOL 5.8728639 and 0.4502700; corrected A280 2.8169764; protein 1.3414173e-5 M; -0.4412360 and -2.1011238e-6 M; 0.2159764) | Clauses 1, 3, 4, as printed | Tool-level (3.8 URS), not engine fixtures; not recomputed here or by Petra |

## 10. Worked examples (exact arithmetic, step by step)

Display strings use 0.1.0 section 6 (half away from zero, once) with the mode of the result dimension, E10C-NF-02: mass concentration, molar concentration and copies `sci3`; mass, amount and volume `sig3`. Unbackticked working writes "x" for multiplication; every display string, and every expected string in section 11, is the 0.1.0 section 6 form, with U+00D7 and one space each side (`engine-spec-0.1.0.md:169`). Every example is one engine call with `toUnit`. Atlas re-checked every figure in Examples 1 to 5 against Petra's; one correction is in Example 3. All values below were re-derived with python3 `fractions.Fraction` (exact) and `decimal` (40 digits); the output is in section 15.2 (change-log row 40).

**Example 1, `massToMolar("1", "mg/mL", "150000", "uM")`.** 1 mg/mL IgG, MW 150000 g/mol, result in uM. One chain: (1 x 1 / 150000) / 1e-6 = 20/3 = 6.666... uM (the base-unit value is exactly 1/150000 M = 6.666...e-6). `sci3`: 6.67 x 10^0 uM. Check: (1/150000 M) x 150000 = 1 g/L exactly.

**Example 2, `molarToMass("50", "nM", "25000", "ug/mL")`.** 50 nM, MW 25000, result in ug/mL. One chain: (50 x 1e-9 x 25000) / 1e-3 = 1.25e-3 / 1e-3 = 1.25 ug/mL (= 1.25e-3 g/L = 1.25e-3 mg/mL). `sci3`: 1.25 x 10^0 ug/mL.

**Example 3, `massToCopies("1", "ng", "3250000", "copies")`.** 1 ng dsDNA, MW 3,250,000 g/mol (5000 bp x 650; 650 g/mol per bp is an illustrative typed value; 1.6's table values are not yet ruled). One chain: m = 1e-9 g; n = 1e-9 / 3.25e6 = 3.0769230769...e-16 mol (4/13 fmol, `sig3` 0.308 fmol); N = n x 602214076e15 = 602214076e6 / 3.25e6 = 602214076 / 3.25 = 2408856304 / 13 = 185296638.769230769... copies, which is 1.8529664e8 (check: 6.02214076 / 3.25 = 1.8529664). `sci3`: 1.85 x 10^8 copies. Correction: the exact value is the fraction 2408856304/13, not a terminating decimal. Inverse check, by the fixture author's exact rational arithmetic and not by re-entering the output (E10C-NF-07): (2408856304/13 x 3250000) / 602214076e15 = 1e-9 g = 1 ng exactly; Example 13 is the terminating single-call copies-to-mass case.

**Example 4, `scaleUnit`.** `scaleUnit("2.5", "ug/uL", "g/L")`: 2.5 x 1 / 1 = 2.5 g/L (`sci3` 2.50 x 10^0). `scaleUnit("2.5", "ug/uL", "mg/mL")`: 2.5 mg/mL. `scaleUnit("2", "uM", "nM")`: 2 x 1e-6 / 1e-9 = 2000 nM (`sci3` 2.00 x 10^3). Refusal: `scaleUnit("1", "g/L", "M")` returns E10-RC-02, no number.

**Example 5, `amountFromConcentration` then `massToCopies`.** 2 uL of 10 ng/uL, MW 3,250,000. Call 1: `amountFromConcentration("10", "ng/uL", "2", "uL", "ng")`: ((10 x 1e-3) x (2 x 1e-6)) / 1e-9 = 2e-8 / 1e-9 = 20 ng exactly (`sig3` 20.0 ng). The value terminates, so it is passed on as the exact plain decimal text `"20"` (E10C-NF-07). Call 2: `massToCopies("20", "ng", "3250000", "copies")`: N = 20 x (2408856304/13) = 48177126080 / 13 = 3705932775.3846... = 3.7059e9; matches 20 x 1.85296639e8 = 3.70593278e9. `sci3`: 3.71 x 10^9 copies. Call 2 is one unrounded chain.

**Example 6 (Atlas), `molesToCopies("1", "pmol", "copies")`.** n = 1 x 1e-12 = 1e-12 mol; N = 1e-12 x 602214076e15 = 602214076e3 = 6.02214076e11 copies, exact (602214076000). `sci3`: 6.02 x 10^11 copies.

**Example 7 (Atlas), `copiesToMoles("1000000000000", "pmol")`.** N = 1e12 copies, result in pmol. One chain: (1e12 / 602214076e15) / 1e-12 = (1e12 / 6.02214076e23) x 1e12 = 1e24 / 6.02214076e23 = 10 / 6.02214076 = 1e9 / 602214076 = 250000000/150553519 = 1.66053906717384666379... pmol (non-terminating; the base-unit value is 1.66053906717384666379e-12 mol). `sig3`: 1.66 pmol. Check: 1.66053906717e-12 x 6.02214076e23 = 1.0000e12.

**Example 8 (Atlas), `massToMoles` and `molesToMass`.** `massToMoles("5", "ug", "25000", "pmol")`: ((5 x 1e-6) / 25000) / 1e-12 = 2e-10 / 1e-12 = 200 pmol (`sig3` 200 pmol). `molesToMass("2", "nmol", "25000", "ug")`: ((2 x 1e-9) x 25000) / 1e-6 = 5e-5 / 1e-6 = 50 ug (`sig3` 50.0 ug).

**Example 9 (Atlas), `amountFromConcentration("50", "nM", "100", "uL", "pmol")`, molar.** ((50 x 1e-9) x (100 x 1e-6)) / 1e-12 = 5e-12 / 1e-12 = 5 pmol (`sig3` 5.00 pmol).

**Example 10, an exact tie (given by Nadira, NAD-2026-11-09-12 (a)).** `scaleUnit("1.005", "ug/mL", "mg/mL")` = 1.005 x 1e-3 / 1 = 0.001005 exactly. `sig3`: `0.00101`. `sci3`: `1.01 × 10^-3`, half away from zero. In binary, 1.005 is stored below the tie (`'%.2f' % 1.005` gives `1.00`; 1.005 x 1e-3 in binary floating point is 0.0010049999999999998), so a binary build that rounds the stored value shows 0.00100 and fails. Verified with `decimal`.

**Example 11 (Atlas), a non-terminating near-tie through MW (Nadira's (b)).** Two calls whose fourth significant digit is 4 or 5 followed by a repeating tail, in `mM`, mode `sci3`:
- `massToMolar("221", "mg/mL", "220000", "mM")` = (221 x 1) / 220000 / 1e-3 = 221/220 = 1.00454545... mM. The tail 4545... lies below the tie, so correct `sci3` is `1.00 × 10^0`. A build that first cuts to four figures (1.005) and then rounds again (double rounding) shows `1.01 × 10^0`, which is wrong.
- `massToMolar("199", "mg/mL", "198000", "mM")` = 199/198 = 1.00505050... mM. The tail lies above the tie, so correct `sci3` is `1.01 × 10^0`. A build that truncates to 1.005 and then rounds half to even shows `1.00 × 10^0`, which is wrong. (A binary build passes this row; Example 10 is the row it fails.)

**Example 12 (Atlas), the smallest units (Nadira's (c)).** `molesToCopies("1", "amol", "copies")` = 1e-18 x 602214076e15 = 602214.076 copies exactly (150553519/250); `sci3` 6.02 x 10^5 copies. `scaleUnit("1", "fM", "M")` = 1e-15 (`sci3` 1.00 x 10^-15); `scaleUnit("1", "fM", "pM")` = 1e-15 / 1e-12 = 1e-3 (`sci3` 1.00 x 10^-3); `scaleUnit("1", "amol", "mol")` = 1e-18.

**Example 13 (Atlas), `copiesToMass("602214076000000", "150000", "ug")`.** N = 602214076e6 copies, MW 150000. One chain: (602214076e6 / 602214076e15 x 150000) / 1e-6 = (1e-9 mol x 150000) / 1e-6 = 1.5e-4 g / 1e-6 = 150 ug exactly (`sig3` 150 ug). With Example 14 this completes the one-call-per-function set (Nadira's (d)).

**Example 14, the `"-0"` text (Nadira's (e)).** `scaleUnit("-0", "mg/mL", "g/L")` returns status `result`, `value` `0` (never negative zero), display `0`.

**One example per function, single call with `toUnit` (Nadira's (d)).** E10C-F03: Examples 4, 10, 12, 14. E10C-F04: Examples 1 and 11. E10C-F05: Example 2. E10C-F06: Example 8. E10C-F07: Example 8. E10C-F08: Examples 6 and 12. E10C-F09: Example 7. E10C-F10: Examples 3 and 5 (call 2). E10C-F11: Example 13. E10C-F12: Examples 5 (call 1) and 9.

## 11. Acceptance tests (Adacs builds fixtures from these; the independent fixture author derives the values)

| ID | Test | Expected |
|---|---|---|
| AT-E10C-01 | Examples 1 to 14, each with the stated inputs, as single calls with `toUnit`; the ties of Examples 10 and 11 shown with display mode | `exact` equals the section 10 rational by cross-multiplication (no tolerance, no float) and each display string equals the once-rounded string for the stated mode (ADC-2026-11-09-04); display strings by 0.1.0 section 6 |
| AT-E10C-02 | Every unit of section 3 through `scaleUnit` to its dimension's base and back | Each factor reproduced; round trip returns the input exactly |
| AT-E10C-03 | `g/L`, `mg/mL`, `ug/uL` against each other | Identical values, exactly |
| AT-E10C-04 | Zero value in each of E10C-F03 to E10C-F12; and the text `"-0"` in each | `0`, status `result`, never negative zero |
| AT-E10C-05 | `scaleUnit` across dimensions (`g/L` to `M`; `mol` to `g`); same-dimension control (`mL` to `L`) | E10-RC-02 for the crossing cases; the control is a result |
| AT-E10C-06 | Unknown units (`mg/ml`, `MM`, `mg / mL`, micro sign `µM`, `kg`), including as `toUnit` | E10-RC-01 each, `fields` naming only the unknown unit field(s) |
| AT-E10C-07 | Wrong-dimension unit for the function (`massToMolar` with `nM`; `massToMoles` with `mol`); wrong-dimension `toUnit` (`massToMolar` with `toUnit` `mg/mL`) | E10-RC-02, `fields` naming only the wrong-dimension unit field(s) |
| AT-E10C-08 | MW `null`, `"0"`, `"-5"`, `"abc"` in E10C-F04, E10C-F05, E10C-F06, E10C-F07, E10C-F10 and E10C-F11 (the six functions that take MW; E10C-F08 and E10C-F09 take no MW) | `incomplete` `["MW"]`; then CCS-RF-03 `["MW"]` for the other three |
| AT-E10C-09 | Negative value; `"2e5"`; `"1,5"`; `"NaN"` | CCS-RF-03 naming the field |
| AT-E10C-10 | E10C-F12 with `V` = 0 and with `V` < 0 | CCS-RF-03 `["V"]` |
| AT-E10C-11 | Bad `c` and MW = 0 in one call; and `null` plus a bad value in one call | One `rejected`, `fields` in argument order; `incomplete` only for the second |
| AT-E10C-12 | Unit refusal plus a bad value in one call, including a unit refusal plus the text `"2e5"` (a value refusal, step 3); an unknown unit together with a wrong-dimension unit in one call | The unit refusal alone, per the order of ADC-2026-11-09-05; the second case returns E10-RC-01 only, with `fields` listing only the unknown unit field(s) |
| AT-E10C-13 | `massToCopies` equals `massToMoles` then `molesToCopies` on unrounded values; the round trip `copiesToMass` of `massToCopies` returns the input. Both checks are made on the fixture author's exact values, not by feeding an engine output back in as an input (E10C-NF-07; Q-E10C-17). The engine is still exercised in both directions: `massToCopies` on its own call, and `copiesToMass` on its own engine call with an exact, terminating copies input derived by the fixture author (as in Example 13: 602214076 x 10^6 copies, MW 150000 gives 150 ug exactly). The non-terminating round trip (Example 3) is checked only in the fixture author's rational arithmetic, by exact equality of rationals, with no tolerance and no bound (section 5; ADC-2026-11-09-04) (from NAD-2026-11-09-17 (a), (b), as qualified by NAD-2026-11-09-21) | Exactly equal: `exact` by cross-multiplication, no tolerance |
| AT-E10C-14 | Non-integer copies input to E10C-F09 and E10C-F11 | A result; no rounding, no refusal |
| AT-E10C-15 | Version field on every result and refusal | `engine.module == "E10"`; `engine.version` is the new package string `0.1.1` (ADC-2026-11-09-03) |
| AT-E10C-16 | C10 regression: the whole existing `strengthFactor` and `splitVolumes` test set unchanged | Pass; existing results unchanged except `engine.version`, which the fixtures expect as the new string `0.1.1` (ADC-2026-11-09-03) |
| AT-E10C-17 | Determinism; no network; no new dependency | Pass |
| AT-E10C-18 | Representation rows required by ADC-2026-11-09-04, each checked twice: (1) `exact` equals the fixture rational by cross-multiplication; (2) each display string equals the fixture's once-rounded string for the stated mode. Rows: the tie `scaleUnit("1.005","ug/mL","mg/mL")` (Example 10) giving `0.00101` (`sig3`) and `1.01 × 10^-3` (`sci3`); the non-terminating near-ties through MW (Example 11, both calls); Example 3 (`exact` 2408856304/13); the smallest units (Example 12); `"-0"` (Example 14: `exact` 0/1, never negative zero); carry rows (a value whose rounding carries into the next digit, for example 9.995 to `1.00 × 10^1`, section 15.2). The fixture author derives both from exact rationals independently of the engine | Equality of `exact` and of strings, no tolerance; a binary-float build fails the tie row by construction; the page shows the display string and never re-rounds `value` |
| AT-E10C-19 | `scaleUnit("x", "copies", "copies")` with a typed x (for example `"602214076"`), as an identity row of E10C-F03 (KAITO-2026-11-09-07; added as its own row, not folded into AT-E10C-02) | A result: `value` x, `unit` `copies`, `exact` equal to x; no refusal |
| AT-E10C-20 | `massToCopies` (E10C-F10) with `toUnit` = `"mol"` (from NAD-2026-11-09-16; Adacs to confirm) | E10-RC-02 (wrong-dimension `toUnit`), `fields` naming `toUnit` only |
| AT-E10C-21 | `massToCopies` (E10C-F10) with `toUnit` = `"kcopies"` (from NAD-2026-11-09-16; Adacs to confirm) | E10-RC-01 (not in the table), `fields` naming `toUnit` only |

## 12. Open items for Kaito and Adacs (not decided by Atlas)

| ID | Owner | Item |
|---|---|---|
| Q-E10C-01 | Kaito, Adacs | ANSWERED, CONFIRMED WITH CONDITIONS (ADC-2026-11-09-03; KAITO-2026-11-09-03): package 0.1.0 to 0.1.1, E10 module 0.1.0 to 0.2.0, chart piece ships as 0.2.0, one commit, C10 version line states the change (E10C-NF-05). Adacs's stated preference (package 0.2.0 now, chart 0.3.0) is noted; Kaito decided the numbering as an engineering call (KAITO-2026-11-09-03: package 0.1.1, chart 0.2.0 as already planned in D-0064 2.6 K2), so it does not go to A.B. Nadira's science note kept: any change to `engine.version` in C10's exports must be stated in C10's version line |
| Q-E10C-03 | Kaito, Adacs | ANSWERED, CONFIRMED WITH A RETURN SHAPE (ADC-2026-11-09-04): exact rational chain, `exact: {num, den}` on every result, display from `exact`, acceptance by cross-multiplication plus once-rounded strings (section 5, E10C-NF-02, AT-E10C-18). Nadira's condition (0.1.0 :22 on every displayed value, including the tie of Example 10; single-call chains unrounded) is met |

## 13. Questions for Nadira (Petra's numbers in brackets)

Q-E10C-01N, -02, -03N, -04, -05, -06, -07, -08, -11, -12 and -13 were ruled in NAD-2026-11-09-01 to -11 (rows kept for the record). Rows are not otherwise altered except where marked.

| ID | Question |
|---|---|
| Q-E10C-01N | [Q1] Zero: E10C-F04 to E10C-F12 return `0` for zero concentration, mass, amount or copies and refuse only MW <= 0 (and V <= 0). Right, or is zero a refusal? The 3.8 rule "a corrected A280 of zero or below is a refusal" is on a different object and is not carried here |
| Q-E10C-02 | [Q2] MW `null` is `incomplete`; MW <= 0 is `rejected`. Confirm the split |
| Q-E10C-03N | [Q3] Copies come back unrounded and possibly non-integer. Should 1.6 show `sci3` only, never an integer count? (A display matter for 1.6; the engine does not round) |
| Q-E10C-04 | RULED (NAD-2026-11-09-04): every function takes a required output unit `toUnit` and scales to it inside the same unrounded chain; base units plus a later `scaleUnit` is not accepted. See section 6 and E10C-NF-07 |
| Q-E10C-05 | [Q5] Is the closed unit list of section 3 right for 3.8, 1.6, later 1.2 and X1, or a smaller first list extended by a version bump? It has no `kg`, `kDa` or `copies/mL` |
| Q-E10C-06 | [Q8] Is `amountFromConcentration` (E10C-F12) in the 12 Nov engine, or does it wait for 1.2's recipe scaling? |
| Q-E10C-07 | [Q4] Dilution rescale `A_neat = A_obs x factor`: engine or 3.8? Petra and Atlas assume 3.8. Sentence concerned: "The tool converts both to the undiluted sample (A_neat = A_obs x factor)" (NAD-2026-10-24-1000 clause 2) |
| Q-E10C-08 | RULED (NAD-2026-11-09-14): source is the SI Brochure alone; see section 4 |
| Q-E10C-11 | [Q7, Q9] Boundary: confirm that 1.6's mass table, per-bp and per-nucleotide values and end terms are 1.6's alone; that A280 epsilon, CF, path and DOL are 3.8's alone; and that specific-activity (IU, U) conversions are outside this spec |
| Q-E10C-12 | [Q6] Confirm that mixing dimensions is always a refusal and the engine never applies a MW implicitly |
| Q-E10C-13 | Does 3.8 report protein concentration in mg/mL, in molar, or both? This decides whether 3.8 uses the engine for its numbers at all (`molarToMass`, M x MW, one call with `toUnit: "mg/mL"`; corrected from `massToMolar`, NAD-2026-11-09-11) |
| Q-E10C-16 | RULED WITH CONDITIONS (NAD-2026-11-09-16): accepted. `toUnit` is required in E10C-F08 and E10C-F10 and accepts only `copies`; `toUnit` null is `incomplete`; a `toUnit` of another dimension (`mol`, `ng`) is E10-RC-02; anything not in the table is E10-RC-01. Conditions: no prefixed or alias copies units (section 3); `scaleUnit("x", "copies", "copies")` is the identity (E10C-F03); copies per volume is E10-RC-01 in this version (OI-1.6-2); two AT rows, AT-E10C-20 and AT-E10C-21 |
| Q-E10C-17 | CONFIRMED WITH CONDITIONS (NAD-2026-11-09-17): AT-E10C-13 is stated on the fixture author's exact values, not by re-entering an engine output; conditions (engine exercised in both directions; the non-terminating round trip checked only in rational arithmetic) are in AT-E10C-13 |

## 14. Questions for Adacs, A.B., Kaito (non-scientific)

| ID | Owner | Question |
|---|---|---|
| Q-E10C-09 | Adacs, A.B. | Unit matching is exact and case-sensitive (E10C-IN-02). Confirm, or should the engine also accept `ug/ml`? (PROVISIONAL: exact only; Nadira: exact matching is right from the science side) |
| Q-E10C-10 | Adacs | ANSWERED, CONFIRMED (ADC-2026-11-09-05): unit refusals before CCS-RF-03 (section 2), with the `fields` clarification; AT-E10C-11 and -12 depend on it (Nadira: no science objection) |
| Q-E10C-14 | Adacs | ANSWERED, CORRECTED (ADC-2026-11-09-06): refusal codes are `E10-RC-01` and `E10-RC-02`, module-wide, never reused (T-0484 continues from `E10-RC-03`); requirement IDs are `E10C-<class>-<nn>` and never appear in a result; `E10C-F03` to `E10C-F12` and the `E10C-` prefix stand as a requirement series outside C10's CCS- series. Section 7 has the traceability row |
| Q-E10C-15 | Kaito | Timing: Nadira signs by Thu 12 Nov and Adacs accepts the same day; the builder cannot start before signature. D-0065 section 3: if not accepted by 12 Nov, 3.8's 19 Nov slot runs the standby item |

## 14A. Open items carried into the 3.8 and 1.6 URSs (not engine requirements)

| ID | Owner | For | Item |
|---|---|---|---|
| OI-3.8-1 | Atlas (3.8 URS), Nadira rules | 3.8 | **Declare the epsilon form.** 3.8's URS declares which epsilon form it takes: molar, M^-1 cm^-1, as in clause 5's table (NAD-2026-11-09-11). If it ever offers E1%, the form is a compelled choice; using an E1% value as a molar epsilon, or the reverse, is an error the size of the MW. Whether the dye's added mass is declared for the mg/mL value is also a 3.8 URS item, ruled there |
| OI-3.8-2 | Atlas (3.8 URS), Nadira rules | 3.8 | **Carry the dilution convention** (NAD-2026-11-09-07): "read at 1 part sample in N parts total; factor N", N >= 1; an undiluted reading has factor 1; N < 1 is refused. It is C10's convention (`engine-spec-0.1.0.md:35-43`, f = P, P >= 1). 3.8 does not call `strengthFactor`, but no two tools may define "factor" differently |
| OI-1.6-1 | Atlas (1.6 URS), Nadira rules | 1.6 | Every page field taking MW is labelled "g/mol"; any kDa entry shows "150 kDa = 150000 g/mol" (E10C-UN-03) |
| OI-1.6-2 | Kaito (scheduling), Nadira rules | 1.6 | **Copy concentration** (`copies/uL`, `copies/mL`) is not in the 12 Nov engine. If 1.6's URS adds copies per volume, the engine gains it additively (a copies-per-volume dimension; mass concentration to copy concentration as single calls under E10C-NF-07). It must be accepted by Thu 19 Nov (1.6's Thursday before go-live, NAD-2026-11-06-26). Kaito makes the scheduling call if 1.6 needs it. The page must never treat "ng/uL" as "ng in 1 uL" to reuse `massToCopies`: that is a hidden volume |
| OI-1.6-3 | Atlas (1.6 URS), Nadira rules wording | 1.6 | Copies are shown in `sci3` only, never rounded to an integer and never as a full integer with digits or separators; the URS carries a plain sentence that the copy number is calculated from mass and molecular weight and is an average (NAD-2026-11-09-03) |
| OI-1.6-4 | Nadira | 1.6 | 1.6's table values (mass per bp and per nucleotide, end terms) are not yet ruled; the 650 g/mol per bp used here is an illustrative typed value |

## 15. Change log

| Date | Ticket | Change |
|---|---|---|
| 2026-11-09 | T-0483, T-0489 | First draft by Atlas from Petra Lindqvist's input; unsigned (sha256 ec808dcd508f4001537a5485fb556a3af57e78c3409335a7fbdb4d5cf6935bd0, 257 lines) |
| 2026-11-09 | T-0483, T-0489, T-0490 | Nadira's corrections 1 to 9 (NAD-2026-11-09-13) made by Atlas, one row each below. Line numbers in "Location" are those of the first draft (257 lines); the section is the stable pointer |

### 15.1 Correction rows

| Row | Corr. | NAD id | Location (section, first-draft line) | OLD -> NEW |
|---|---|---|---|---|
| 1 | 1 | -13 (1) | Header, :5 | OLD: "continues that section as 3.3 to 3.12." NEW: "continues that section as E10C-F03 to E10C-F12. (They carry the typed prefix E10C-F so that they cannot be confused with tools 3.8 and 1.6.)" |
| 2 | 1 | -13 (1) | Section 1, :11 | OLD: "...and 1.6 (nucleic acid mass, copies and concentration); later by 1.2 and X1." NEW: same, plus "("3.8" and "1.6" always mean the tools. The engine functions are E10C-F03 to E10C-F12.)" |
| 3 | 1 | -13 (1) | Section 1, :16 | OLD: "Petra's labels C1 to C10 map to 3.3 to 3.12 in order." NEW: "...map to E10C-F03 to E10C-F12 in order." |
| 4 | 1 | -13 (1) | Section 6 headings, :75, :86, :96, :99, :102, :105, :108, :111, :114, :117 | OLD: "### 3.3 `scaleUnit(...)`" and likewise 3.4 `massToMolar`, 3.5 `molarToMass`, 3.6 `massToMoles`, 3.7 `molesToMass`, 3.8 `molesToCopies`, 3.9 `copiesToMoles`, 3.10 `massToCopies`, 3.11 `copiesToMass`, 3.12 `amountFromConcentration`. NEW: "### E10C-F03" to "### E10C-F12", same names (signatures in row 14) |
| 5 | 1 | -13 (1) | Section 6, :97-115 cross-references | OLD: "Inputs, refusals, order as 3.4", "Refusals as 3.4", "Refusals as 3.6" and "Serves E10C-DT-xx" unchanged. NEW: "as E10C-F04", "as E10C-F04", "as E10C-F06" |
| 6 | 1 | -13 (1) | Section 6 E10C-F12 purpose, :121 | OLD: "Gives "ng/uL in a 2 uL aliquot" before 3.6 to 3.10". NEW: "...before E10C-F06 to E10C-F10" |
| 7 | 1 | -13 (1) | Section 7, :135-144 | OLD: DT rows without function IDs, e.g. "`massToMolar`: `(c x f) / MW`, mol/L". NEW: each DT row names its function ID, e.g. "`massToMolar` (E10C-F04): ..." (formulas also changed by row 15) |
| 8 | 1 | -13 (1) | AT-E10C-04, :204 | OLD: "Zero value in each of 3.3 to 3.12" NEW: "Zero value in each of E10C-F03 to E10C-F12; and the text `"-0"` in each" (the `"-0"` part is row 33) |
| 9 | 1 | -13 (1) | AT-E10C-08, :208 | OLD: "MW `null`, `"0"`, `"-5"`, `"abc"` in 3.4 to 3.11" NEW: "...in E10C-F04 to E10C-F11" |
| 10 | 1 | -13 (1) | AT-E10C-10, :210; AT-E10C-14, :214 | OLD: "3.12 with `V` = 0 and with `V` < 0"; "Non-integer copies input to 3.9 and 3.11". NEW: "E10C-F12 with..."; "...to E10C-F09 and E10C-F11" |
| 11 | 1 | -13 (1) | Section 2, :41; Q-E10C-01N, :230; Q-E10C-06, :235 | OLD: ":230 "3.4 to 3.12 return `0`..."; :235 "`amountFromConcentration` (3.12)". NEW: "E10C-F04 to E10C-F12 return `0`..."; "(E10C-F12)". Tool references "3.8" and "1.6" (:11, :160-162, :173, :230, :232, :234, :236, :240) are unchanged: they are tools |
| 12 | 2 | -13 (2) | Section 2 refusal codes, :34-39 | OLD: "Two new codes, numbered by Atlas, PROVISIONAL (Q-E10C-14)" with codes "E10C-RF-01", "E10C-RF-02". NEW: "...named by Atlas, PROVISIONAL; **naming subject to Adacs (Q-E10C-14)**. Proposal: the codes are `E10C-RC-01` and `E10C-RC-02` ("refusal code"), so that the requirement rows E10C-RF-01 to -05 of section 7 keep their IDs..." Table rows renamed E10C-RC-01 and E10C-RC-02 |
| 13 | 2 | -13 (2) | Every use of the code, :43, :83, :93, :106, :124, :205-207, :212 | OLD: "E10C-RF-01" / "E10C-RF-02" used as codes (order of statuses; E10C-F03 to E10C-F12 refusals; AT-E10C-05, -06, -07, -12). NEW: "E10C-RC-01" / "E10C-RC-02". The requirement uses at :84 (Serves ... E10C-RF-01 to -05) and :148-152 (section 7 rows) keep E10C-RF; section 7 rows now cite "(refusal code E10C-RC-0x)". Q-E10C-14 (:248) reworded to cover the new series, the F-IDs and the prefix, marked "naming subject to Adacs" |
| 14 | 3 | -13 (3), -04 | Section 6 intro, :73 and functions :75-126 | OLD: ":73 "Results carry an unrounded `value` and the base `unit` string (PROVISIONAL, Q-E10C-04: the engine returns base units; the page uses `scaleUnit` to show another unit)." Signatures `massToMolar(c, unit, MW)`, `molarToMass(c, unit, MW)`, `massToMoles(m, unit, MW)`, `molesToMass(n, unit, MW)`, `molesToCopies(n, unit)`, `copiesToMoles(N)`, `massToCopies(m, unit, MW)`, `copiesToMass(N, MW)`, `amountFromConcentration(c, unit, V, Vunit)`; outputs "unit: "M"", "unit: "g/L"", "unit: "mol"", "unit: "g"", "unit: "copies"", base `g` or `mol`. NEW: "Every conversion function takes a required output unit `toUnit` in the dimension of its result and scales to it inside the same unrounded chain... The result is `{status: "result", value, unit: toUnit}`". Each signature gains a final `toUnit` argument (copies functions: `copies` only, Q-E10C-16); each formula gains "/ f(toUnit)"; each refusal list gains `toUnit` null (`incomplete`) and `toUnit` wrong dimension (E10C-RC-02) |
| 15 | 3 | -13 (3), -04 | Section 7, :136-144, :153 | OLD: "E10C-DT-02 `(c x f) / MW`, mol/L" ... "E10C-DT-10 `(c x f) x (V x f)`"; "E10C-OU-01 Unrounded `value` plus base `unit`". NEW: formulas with "/ f(toUnit)" (see section 7); "E10C-OU-01 Unrounded `value` expressed in `toUnit`, plus that `unit` string". E10C-RF-02 row adds "including a `toUnit` of the wrong dimension" |
| 16 | 3 | -13 (3), -04 | Section 2, :29 E10C-NF-03 | OLD: "No intermediate is rounded anywhere in a chain (NAD-2026-10-24-1000 clause 1). `massToCopies` and `copiesToMass` are one unrounded chain; a displayed value never feeds a later step". NEW: "...Every function scales to its `toUnit` inside the same unrounded chain; `massToCopies` and `copiesToMass` are one unrounded chain; a displayed value never feeds a later step" |
| 17 | 3 | -13 (3), -04 | Section 2, new row after :32 | OLD: none (NF-06 was the last NF row). NEW: row E10C-NF-07, the passing rule (full text in section 2). Section 7 NF line: OLD "E10C-NF-01 to -06" NEW "E10C-NF-01 to -07" |
| 18 | 3 | -13 (3) | Section 2 order of statuses, :43 | OLD: "(1) Any required argument `null` or blank..." and "(2) ...unit refusals". NEW: "(1) Any required argument (including `toUnit`)..."; "(2) ...unit refusals (any unit argument, including `toUnit`)" |
| 19 | 3 | -13 (3) | Section 3 table, :49-55 | OLD: no copies row. NEW: row "Copies: `copies` 1 (the only copies unit; it is the `toUnit` of E10C-F08 and E10C-F10)". Needed because `toUnit` must be a table unit; `copies` was already a base unit in :47. Raised as Q-E10C-16 |
| 20 | 3 | -13 (3), -04 | Section 13, Q-E10C-04, :233 | OLD: "The engine returns base units plus a `unit` string and the page uses `scaleUnit` for display units; or each function takes an output unit? (PROVISIONAL: base units)". NEW: "RULED (NAD-2026-11-09-04): every function takes a required output unit `toUnit`... See section 6 and E10C-NF-07" |
| 21 | 3 | -13 (3), -04 | Section 10, Example 1, :179 | OLD: "Step 1: 1 mg/mL x 1 = 1 g/L. Step 2: M = 1 / 150000 = 6.666...e-6 mol/L (exactly 1/150000). `sci3`: 6.67 x 10^-6 M. Via `scaleUnit` to uM: 6.666...e-6 x 1 / 1e-6 = 6.666... uM, which the page shows as 6.67 uM." NEW: "`massToMolar("1", "mg/mL", "150000", "uM")`... One chain: (1 x 1 / 150000) / 1e-6 = 20/3 = 6.666... uM... `sci3`: 6.67 x 10^0 uM." Derivation: section "Derivation output" row 40, "Ex1" |
| 22 | 3 | -13 (3), -04 | Example 2, :181 | OLD: "Step 1: 50 x 1e-9 = 5e-8 M. Step 2: 5e-8 x 25000 = 1.25e-3 g/L. Step 3 (`scaleUnit` to ug/mL): 1.25e-3 x 1 / 1e-3 = 1.25 ug/mL (= 1.25e-3 mg/mL). `sci3` of the g/L value: 1.25 x 10^-3." NEW: "`molarToMass("50", "nM", "25000", "ug/mL")`... One chain: (50 x 1e-9 x 25000) / 1e-3 = 1.25 ug/mL... `sci3`: 1.25 x 10^0 ug/mL." |
| 23 | 3 | -13 (3), -04 | Example 7, :191 | OLD: "N = 1e12 copies: mol = 1e12 / 602214076e15 = 1 / 6.02214076e11 = 1.66053906717...e-12 mol (non-terminating). Via `scaleUnit` to pmol: 1.66053906717 pmol, `sig3` 1.66." NEW: "`copiesToMoles("1000000000000", "pmol")`... One chain: (1e12 / 602214076e15) / 1e-12 = 250000000/150553519 = 1.66053906717384666379... pmol...; `sig3`: 1.66 pmol." The NEW working is also shown as 1e24 / 6.02214076e23 = 1e9 / 602214076 = 250000000/150553519 (checked: equal as `Fraction`s) |
| 24 | 3 | -13 (3), -04 | Example 8, :193 | OLD: "5 ug, MW 25000: m = 5 x 1e-6 = 5e-6 g; n = 5e-6 / 25000 = 2e-10 mol; `scaleUnit` to pmol: 2e-10 / 1e-12 = 200 pmol. Inverse, 2 nmol x 25000: n = 2e-9 mol; g = 2e-9 x 25000 = 5e-5 g; to ug: 5e-5 / 1e-6 = 50 ug." NEW: "`massToMoles("5", "ug", "25000", "pmol")`... = 200 pmol (`sig3` 200 pmol). `molesToMass("2", "nmol", "25000", "ug")`... = 50 ug (`sig3` 50.0 ug)." |
| 25 | 3 | -13 (3), -04 | Examples 3, 5, 6, 9, :183, :187, :189, :195 | OLD: calls without `toUnit` (e.g. "Example 6 ... `molesToCopies`. 1 pmol"; Example 5 "Step 1: ... amount = 0.01 x 2e-6 = 2e-8 g (20 ng). Step 2: n = ... Step 3: N = ..."; Example 3 "Inverse (`copiesToMass`): (2408856304/13 x 3250000) / 602214076e15 = 1e-9 g exactly in rational arithmetic; with N cut to 1.85296638769e8 the round trip gives 1.0000e-9 only to the digits kept"). NEW: each is written as a call with `toUnit` (`massToCopies("1","ng","3250000","copies")`; `molesToCopies("1","pmol","copies")`; `amountFromConcentration("10","ng/uL","2","uL","ng")` then `massToCopies("20","ng","3250000","copies")`, passing the terminating "20" as exact text; `amountFromConcentration("50","nM","100","uL","pmol")` = 5 pmol). Example 3's inverse is restated as the fixture author's exact check, not a re-entry of the output (E10C-NF-07) |
| 26 | 3 | -13 (3), -04 | Section 11 AT-E10C-01 and -13, :201, :213 | OLD: AT-01 "Examples 1 to 9, each with the stated inputs"; AT-13 "`massToCopies` equals `massToMoles` then `molesToCopies` on unrounded values; `copiesToMass(massToCopies(x))` returns x". NEW: AT-01 "Examples 1 to 14, each ... as single calls with `toUnit`..."; AT-13 adds "Both checks are made on the fixture author's exact values, not by feeding an engine output back in as an input (E10C-NF-07; Q-E10C-17)". AT-06 and AT-07 add `toUnit` cases. New questions Q-E10C-16 and Q-E10C-17 (section 13) are for Nadira |
| 27 | 4 | -13 (4), -11 | Section 8, :160 | OLD: "The one step 3.8 shares with the engine is `massToMolar`, if it reports both mg/mL and molar." NEW: "3.8 reports the protein in molar, always; it reports mg/mL also when the user declares the protein MW in g/mol, and the one step 3.8 shares with the engine is `molarToMass` (M x MW) in one call with `toUnit: "mg/mL"` (NAD-2026-11-09-11)." Section 8 heading changed from "flagged, not decided; Nadira's call" to "ruled, NAD-2026-11-09-09; text corrected NAD-2026-11-09-11", and the three boundary bullets restated as ruled (content unchanged apart from the above) |
| 28 | 4 | -13 (4), -11 | Section 13, Q-E10C-13, :240 | OLD: "This decides whether 3.8 uses the engine for its numbers at all (`massToMolar`)". NEW: "(`molarToMass`, M x MW, one call with `toUnit: "mg/mL"`; corrected from `massToMolar`, NAD-2026-11-09-11)" |
| 29 | 4 | -13 (4), -11 | Section 14A, new row OI-3.8-1 (and :162 region) | OLD: none. NEW: open item for the 3.8 URS: declare the epsilon form (molar, M^-1 cm^-1; E1% would be a compelled choice) and whether the dye's added mass is declared for the mg/mL value |
| 30 | 5 | -13 (5), -07 | Section 14A, new row OI-3.8-2 (and section 8 dilution bullet, :162) | OLD: ":162 "**Borderline:** the dilution rescale `A_neat = A_obs x factor` (clause 2) and its refusals. Petra leans to the tool, so the engine has no absorbance concept (Q-E10C-07)."" NEW: section 8 bullet "**Dilution rescale:** ... stay in 3.8; the engine has no absorbance concept (NAD-2026-11-09-07; convention in section 14A)." plus open item OI-3.8-2: the convention "read at 1 part sample in N parts total; factor N", N >= 1, N < 1 refused, C10's convention |
| 31 | 6 | -13 (6), -12 | Section 10, new Examples 10 to 12 | OLD: none (examples ended at 9). NEW: Example 10 (a) tie, Example 11 (b) two near-ties, Example 12 (c) smallest units; derivations in row 40 |
| 32 | 6 | -13 (6), -12 (d) | Section 10, new Example 13 and the coverage paragraph | OLD: none. NEW: Example 13 `copiesToMass` as a single call (the one function with no example), and the paragraph "One example per function, single call with `toUnit`" mapping each of E10C-F03 to E10C-F12 to its examples |
| 33 | 6 | -13 (6), -01, -12 (e) | Section 10 Example 14; AT-E10C-04, :204; E10C-RF-04, :151; section 2, :41 | OLD: AT-04 "Zero value in each of 3.3 to 3.12 | `0`, status `result`, never negative zero"; RF-04 "Negative or non-numeric value is CCS-RF-03; zero is a result"; :41 "A zero value (concentration, mass, amount, copies) is a result, `0` (Q-E10C-01N)." NEW: AT-04 "...and the text `"-0"` in each" (the "-0" row is KEPT in AT-E10C-04, as instructed); RF-04 "...zero is a result; the text `"-0"` is zero and returns `0`"; :41 "...is a result, `0`, in every one of E10C-F03 to E10C-F12; zero is never a refusal (ruled NAD-2026-11-09-01...). The typed text `"-0"` is zero, returns `0` (never negative zero), status `result`."; E10C-F03 refusals "`value` = 0 (including the text `"-0"`) is a result"; new Example 14 `scaleUnit("-0", "mg/mL", "g/L")` = 0 |
| 34 | 6 | -13 (6), -12 | Section 2, E10C-NF-02, :28 | OLD: "Display rounding is the page's, through 0.1.0 section 6 (`sci3` for concentrations and copies, `sig3` for masses and volumes). No new display mode". NEW: "...one named mode per result dimension: mass concentration `sci3`; molar concentration `sci3`; copies `sci3` always (NAD-2026-11-09-03); mass `sig3`; amount (mol) `sig3` (Atlas's choice, stated once and followed by every example; Nadira accepts either mode for amounts if stated once and followed, NAD-2026-11-09-12); volume `sig3`. No new display mode. The page chooses its display unit through the `toUnit` argument (a `sig3` mass shown in base unit would print `0.00000000100 g`)". The amount mode is Atlas's pick, not a ruling |
| 35 | 6 | -13 (6), -12 | Section 9, :171-172 | OLD: "Examples 1 to 5 | Petra's...; Examples 6 to 9 | Atlas | Hand-derived". NEW: same two rows with "Rewritten as single calls with `toUnit`" notes, and a new row "Examples 10 to 14 | Example 10 given exactly by Nadira; 11 to 14 Atlas | Derived with python3 `fractions` and `decimal`" |
| 36 | 7 | -13 (7) | Section 4, :65 | OLD: "No other constant is in the engine. The 650 g/mol per base pair in the examples is 1.6's table item: here it is a typed MW." NEW: "No other constant is in the engine. The 650 g/mol per base pair in the examples is an illustrative typed value; 1.6's table values are not yet ruled." (Nadira's exact words used.) |
| 37 | 7 | -13 (7) | Example 3, :183 | OLD: "(5000 bp x 650; the 650 is typed)". NEW: "(5000 bp x 650; 650 g/mol per bp is an illustrative typed value; 1.6's table values are not yet ruled)". Also new open item OI-1.6-4 (section 14A) |
| 38 | 8 | -13 (8), -05 | Section 3 (new paragraph after the factor check, after :57); section 7 new row E10C-UN-03; section 14A rows OI-1.6-1 to -3 | OLD: none; section 3 :57 ended "Whether this is the right first list is Q-E10C-05." NEW: ":57 ... All as listed (Nadira re-derived each...). ...ruled sufficient, with later units added only additively under a version bump"; new paragraph "**Molecular weight has no unit argument.** MW is in g/mol... Every page field that takes MW is labelled "g/mol". If a page offers kDa entry, it shows the line "150 kDa = 150000 g/mol" in its working..."; E10C-UN-03; OI-1.6-1 (the label, for 1.6), OI-1.6-2 (copy concentration for 1.6, deferred, Kaito's scheduling call, by Thu 19 Nov; "ng/uL" never "ng in 1 uL"), OI-1.6-3 (copies shown in `sci3` only, with the "average" sentence, NAD-2026-11-09-03). Section 1 "Not in this spec" gains "copy concentration...". |
| 39 | 9 | -13 (9), -08 | Section 4 table, :63; section 9, :168; Q-E10C-08, :237 | OLD: ":63 Basis "Exact by definition since the 2019 SI revision (SI Brochure 9th ed.; CODATA 2018 adopts the same value)" Status "From Petra, from memory; source string for Nadira (Q-E10C-08). The page carries it as a dated source string""; ":168 Basis "SI Brochure 9th ed.; CODATA 2018 (Petra, from memory)" Status "Source string unconfirmed (Q-E10C-08)""; ":237 "Source string for N_A: SI Brochure 9th ed., CODATA 2018, or both? Please also confirm the value, cited from memory"". NEW: value kept as ruled, 6.02214076 x 10^23 mol^-1, exact (NAD-2026-11-09-08); Basis "Value as ruled, exact by definition (NAD-2026-11-09-08, domain judgment)"; Status exactly "source quote pending (Nadira, item 2)" in both section 4 and section 9; Q-E10C-08: "Value ruled (NAD-2026-11-09-08); source quote pending (Nadira, item 2)". Atlas wrote **no source string**; the earlier named sources were removed from the register and from section 4 |
| 40 | 3, 6 | -12 | Section 10 derivations | Derivation output, python3 -I (`fractions.Fraction`, `decimal` at 40 digits; engine function written as the formula of section 6): see 15.2 |
| 41 | 3, 6 | -13 | Sections 5, 12 (Q-E10C-01, Q-E10C-03) | OLD: ":69 "...is open (Q-E10C-03)"; ":223 Q-E10C-01 ...(CCS-OU-10...). Also whether the E10 `moduleVersion` line moves from `0.1.0`"; ":224 Q-E10C-03 How a non-terminating result is represented and compared..."." NEW: each marked "**Kaito/Adacs answer pending**"; Nadira's science notes appended (version line statement in C10's exports; the 0.1.0 :22 condition including the tie of Example 10 and the unrounded single-call chains). Not decided by Atlas. Q-E10C-09, -10, -14 receive Nadira's one-line science notes and Q-E10C-14 the "naming subject to Adacs" marker (see row 13) |
| 42 | 3 | -13 (3) | Section 11 AT-E10C-06 and -07 | OLD: "Unknown units (`mg/ml`, `MM`, `mg / mL`, micro sign `µM`, `kg`)"; "Wrong-dimension unit for the function (`massToMolar` with `nM`; `massToMoles` with `mol`)". NEW: AT-06 adds "including as `toUnit`"; AT-07 adds "wrong-dimension `toUnit` (`massToMolar` with `toUnit` `mg/mL`)" |
| 43 | 1-9 | -13 | Header, :3, :6 | OLD: ":3 "...Requirement IDs are provisional until Nadira signs, then frozen."" and ":6 sources list ending "...package version `0.1.0`)". Checkout: ..."". NEW: :3 adds "Revised 9 Nov 2026 for Nadira's corrections 1 to 9 (NAD-2026-11-09-13); every change is a row in section 15."; :6 adds "Nadira's first reading `.claude/reports/nadira/2026-11-09-t0483-e10-conversions-first-reading.md` (NAD-2026-11-09-01 to -13)" |
| 44 | 6, 8 | -10, -01, -02, -09 | Section 2 E10C-NF-06 (:32), MW sentence (:41), section 5 (:69), section 13 intro | These follow from rulings that Nadira stated but are outside the nine corrections; each is logged so nothing changes without a row. NF-06 OLD: "Mixing dimensions is always a refusal; the engine never applies a molecular weight implicitly". NEW: "...never applies a molecular weight, a mass per base, an extinction coefficient or N_A implicitly. N_A is applied only by the functions whose names say "copies" (NAD-2026-11-09-10)". :41 OLD: "MW <= 0 is `rejected`..." NEW: adds "or MW not a number" and "ruled NAD-2026-11-09-02". Section 5 NEW adds "(confirmed, NAD-2026-11-09-12)" after "the rational value". Section 13 NEW intro sentence: "Q-E10C-01N, ... were ruled in NAD-2026-11-09-01 to -11 (rows kept for the record)". Section 6 E10C-F12 Status row OLD: "In the 12 Nov engine, or waits for 1.2's recipe scaling: Q-E10C-06. Specified here so Nadira can rule" NEW: "In the 12 Nov engine (ruled NAD-2026-11-09-06...). If Kaito must cut the 12 Nov scope for time, it may move to an additive acceptance by Thu 19 Nov, not later". Section 8 body (the three bullets restated as ruled) is in row 27 |
| 45 | D-0068 1 | ADC-2026-11-09-06 | Section 2, refusal-codes paragraph (:35 at the 374-line state) | OLD: "Two new codes, named by Atlas, PROVISIONAL; **naming subject to Adacs (Q-E10C-14)**. Proposal: the codes are `E10C-RC-01` and `E10C-RC-02` ("refusal code"), so that the requirement rows E10C-RF-01 to -05 of section 7 keep their IDs and no ID names both a code and a requirement:" NEW: "Two new codes, set by Adacs (ADC-2026-11-09-06, which closes Q-E10C-14). The `code` string in a result is `E10-RC-<nn>`: module-wide for E10, never renumbered or reused; the T-0484 recipe spec continues from `E10-RC-03`. Requirement IDs are `E10C-<class>-<nn>` ... and never appear in a result object. The reused codes keep their strings ... Section 7 carries a traceability row..." The PROVISIONAL and "subject to Adacs" wording is resolved by citation, not by string swap. Rows 1 to 44 are history and are not rewritten (KAITO-2026-11-09-04) |
| 46 | D-0068 1 | ADC-2026-11-09-06, -05 | Section 2, refusal table, row 1 | OLD: "E10C-RC-01 ... `fields`: the unit field(s), argument order". NEW: "E10-RC-01 ... only the unit field(s) that are unknown, argument order (ADC-2026-11-09-05)" |
| 47 | D-0068 1 | ADC-2026-11-09-06 | Section 2, refusal table, row 2, code cell | OLD: "E10C-RC-02". NEW: "E10-RC-02" |
| 48 | D-0068 1 | ADC-2026-11-09-05 | Section 2, refusal table, row 2, `fields` cell | OLD: "the unit field(s)". NEW: "only the unit field(s) that have the wrong dimension, argument order (ADC-2026-11-09-05)" |
| 49 | D-0068 1 | ADC-2026-11-09-05, -06 | Section 2, "Order of statuses" paragraph | OLD: "**Order of statuses (PROVISIONAL, Q-E10C-10).**" with "E10C-RC-01 if any unit is unknown, else E10C-RC-02 ..." and no statement on `fields` of a unit refusal or on `2e5`. NEW: "(confirmed by Adacs, ADC-2026-11-09-05; closes Q-E10C-10)"; codes E10-RC-01 and E10-RC-02; `fields` lists only the unit fields that caused the code; `2e5` and `NaN` are value refusals (step 3, after any unit refusal); the order in words: incomplete, unknown unit, wrong dimension, all CCS-RF-03 together. The PROVISIONAL marker is removed |
| 50 | D-0068 1 | ADC-2026-11-09-06 | Section 6 intro | OLD: "...broken: E10C-RC-02; not in the table: E10C-RC-01." NEW: "...E10-RC-02; ...E10-RC-01." |
| 51 | D-0068 1 | ADC-2026-11-09-06 | Section 6, E10C-F03 Refusals | OLD: "Unit not in table: E10C-RC-01. Different dimensions (`g/L` to `M`): E10C-RC-02 with ..." NEW: "E10-RC-01 ... E10-RC-02" |
| 52 | D-0068 1 | ADC-2026-11-09-06 | Section 6, E10C-F04 Refusals | OLD: "Unit unknown: E10C-RC-01; ... E10C-RC-02." NEW: "E10-RC-01 ... E10-RC-02" |
| 53 | D-0068 1 | ADC-2026-11-09-06 | Section 6, E10C-F08 | OLD: "E10C-RC-01/-02". NEW: "E10-RC-01/-02" |
| 54 | D-0068 1 | ADC-2026-11-09-06 | Section 6, E10C-F12 Refusals | OLD: "Unit unknown: E10C-RC-01; ... E10C-RC-02." NEW: "E10-RC-01 ... E10-RC-02" |
| 55 | D-0068 1 | ADC-2026-11-09-06 | Section 7, E10C-RF-01 and -02 | OLD: "Unknown unit (refusal code E10C-RC-01)"; "Wrong or mixed dimension, including a `toUnit` of the wrong dimension (refusal code E10C-RC-02)". NEW: "The engine refuses an unknown unit with code E10-RC-01"; "The engine refuses a wrong or mixed dimension, including a `toUnit` of the wrong dimension, with code E10-RC-02" (ADC-06 wording: requirements name the codes they require) |
| 56 | D-0068 1 | ADC-2026-11-09-06 | Section 7, closing line | OLD: "(Naming of the E10C-RF and E10C-RC series is subject to Adacs, Q-E10C-14.)" NEW: a traceability table, requirement to code in the result to acceptance tests (RF-01 to E10-RC-01; RF-02 to E10-RC-02; RF-03 and -04 to CCS-RF-01 and CCS-RF-03; RF-05 to the order of ADC-2026-11-09-05) |
| 57 | D-0068 1 | ADC-2026-11-09-06 | Section 10, Example 4 (refusal) | OLD: "returns E10C-RC-02, no number". NEW: "returns E10-RC-02, no number" |
| 58 | D-0068 1 | ADC-2026-11-09-06 | Section 11, AT-E10C-05 | OLD: "E10C-RC-02 for the crossing cases". NEW: "E10-RC-02 for the crossing cases" |
| 59 | D-0068 1 | ADC-2026-11-09-06, -05 | Section 11, AT-E10C-06 | OLD: "E10C-RC-01 each". NEW: "E10-RC-01 each, `fields` naming only the unknown unit field(s)" |
| 60 | D-0068 1 | ADC-2026-11-09-06, -05 | Section 11, AT-E10C-07 | OLD: "E10C-RC-02". NEW: "E10-RC-02, `fields` naming only the wrong-dimension unit field(s)" |
| 61 | D-0068 1 | ADC-2026-11-09-05 | Section 11, AT-E10C-12 | OLD: "Unit refusal plus a bad value in one call | The unit refusal alone, per the provisional order (Q-E10C-10)". NEW: adds a unit refusal plus the text `"2e5"` (a value refusal, step 3) and an unknown unit together with a wrong-dimension unit (E10-RC-01 only, `fields` the unknown unit field(s)); expected "per the order of ADC-2026-11-09-05". PROVISIONAL wording removed |
| 62 | D-0068 1 | ADC-2026-11-09-05 | Section 14, Q-E10C-10 | OLD: "Order of statuses: unit refusals before CCS-RF-03 (section 2). Confirm or reverse; ..." NEW: "ANSWERED, CONFIRMED (ADC-2026-11-09-05): ..." |
| 63 | D-0068 1 | ADC-2026-11-09-06 | Section 14, Q-E10C-14 | OLD: "Naming: the refusal-code series (proposed `E10C-RC-01`, `-02`, ...) ... (PROVISIONAL) ... **Naming subject to Adacs**". NEW: "ANSWERED, CORRECTED (ADC-2026-11-09-06): refusal codes are `E10-RC-01` and `E10-RC-02`, module-wide, never reused (T-0484 continues from `E10-RC-03`) ..." Resolved by citation |
| 64 | D-0068 1 | ADC-2026-11-09-04 | Section 2, E10C-NF-02 | OLD: ends "...would print `0.00000000100 g`)". NEW: appends the representation text: exact rational chain; `exact: {num, den}` (reduced decimal-integer strings, `den` positive, sign on `num`, zero as `0/1`); display functions take `exact`; one rounding, half away from zero; a JS number `value` is never used for display or acceptance |
| 65 | D-0068 1 | ADC-2026-11-09-03, KAITO-2026-11-09-03 | Section 2, E10C-NF-05 | OLD: "Which `version` it holds is an OPEN ITEM (Q-E10C-01)". NEW: conditions only: E10 `MODULE_VERSION` 0.1.0 to 0.2.0; package 0.1.0 to 0.1.1 (chart piece then 0.2.0, nothing else under 0.1.1); E9 and E7 lines do not move; package, `MODULE_VERSION`, README, PROTOCOL version line and fixture expectation of `engine.version` change together in one commit; C10's version line states the change (CCS-OU-10). No other file touched |
| 66 | D-0068 1 | ADC-2026-11-09-04 | Section 5 | OLD: "So the builder's method (decimal arithmetic at a stated precision, or exact rational) must be stated and the comparison class and bound follow ADC-2026-10-26-06 ... is open (Q-E10C-03; Kaito/Adacs answer pending): ... Nadira's science condition on any representation:". NEW: method fixed by ADC-2026-11-09-04 (exact rational, `exact: {num, den}`, display from `exact`, acceptance by cross-multiplication plus once-rounded strings, no tolerance, no ADC-2026-10-26-06 bound for these functions; a bare JS number or a digit-cut decimal string is not accepted); "Nadira's science condition on any representation (met by this one):" |
| 67 | D-0068 1 | ADC-2026-11-09-04 | Section 6 intro, result shape | OLD: "The result is `{status: "result", value, unit: toUnit}` with `value` unrounded and expressed in `toUnit`." NEW: "`{status: "result", value, unit: toUnit, exact: {num, den}}`" with `value` a convenience number never used for display or acceptance, plus a sentence that each function's own Output line also returns `exact` |
| 68 | D-0068 1 | ADC-2026-11-09-04 | Section 7, E10C-OU-01 | OLD: "Unrounded `value` expressed in `toUnit`, plus that `unit` string; version field on every result". NEW: adds "plus `exact: {num, den}` (reduced decimal-integer strings, sign on `num`, zero as `0/1`)" |
| 69 | D-0068 1 | ADC-2026-11-09-04 | Section 11, AT-E10C-01 Expected | OLD: "The section 10 values to the ADC-2026-10-26-06 class; display strings by 0.1.0 section 6". NEW: "`exact` equals the section 10 rational by cross-multiplication (no tolerance, no float) and each display string equals the once-rounded string for the stated mode" |
| 70 | D-0068 1 | Kaito D | Section 11, AT-E10C-08 | OLD: "MW `null`, `"0"`, `"-5"`, `"abc"` in E10C-F04 to E10C-F11". NEW: "...in E10C-F04, E10C-F05, E10C-F06, E10C-F07, E10C-F10 and E10C-F11 (the six functions that take MW; E10C-F08 and E10C-F09 take no MW)". F08 and F09 are removed from the range |
| 71 | D-0068 1 | ADC-2026-11-09-03 | Section 11, AT-E10C-15 | OLD: "version string per Q-E10C-01". NEW: "`engine.version` is the new package string `0.1.1`" |
| 72 | D-0068 1 | ADC-2026-11-09-03 | Section 11, AT-E10C-16 | OLD: "Pass; result objects unchanged except `engine.version` if Q-E10C-01 changes it". NEW: "Pass; existing results unchanged except `engine.version`, which the fixtures expect as the new string `0.1.1`" |
| 73 | D-0068 1 | ADC-2026-11-09-04 | Section 11, new AT-E10C-18 | OLD: none (tests ended at AT-E10C-17). NEW: the required representation rows (tie, near-tie through MW, Example 3, smallest units, `"-0"`, carry rows), each checked by `exact` cross-multiplication and by once-rounded display string |
| 74 | D-0068 1 | ADC-2026-11-09-03 | Section 12, Q-E10C-01 | OLD: options text ending "**Kaito/Adacs answer pending**". NEW: "ANSWERED, CONFIRMED WITH CONDITIONS (ADC-2026-11-09-03; KAITO-2026-11-09-03)" with the 0.1.1 and 0.2.0 numbers; Adacs's preference (package 0.2.0, chart 0.3.0) recorded as a D-0064 K2 matter for A.B. Nadira's science note kept |
| 75 | D-0068 1 | ADC-2026-11-09-04 | Section 12, Q-E10C-03 | OLD: "...Nadira's condition: ... **Kaito/Adacs answer pending**". NEW: "ANSWERED, CONFIRMED WITH A RETURN SHAPE (ADC-2026-11-09-04)", pointing to section 5, E10C-NF-02 and AT-E10C-18 |
| 76 | D-0068 1 | Kaito K-E (KAITO-2026-11-09-03) | Section 12, Q-E10C-01 | OLD: "...is a D-0064 K2 matter for A.B., not an acceptance one." NEW: "...is noted; Kaito decided the numbering as an engineering call (KAITO-2026-11-09-03 ...), so it does not go to A.B." |
| 77 | D-0068 2 | NAD-2026-11-09-14 | Section 4, N_A row (Basis, Status) | OLD: Basis "Exact by definition (value ruled by Nadira, domain judgment, NAD-2026-11-09-08; `Fraction(602214076)*10**15 == Fraction("6.02214076e23")` is True)"; Status "source quote pending (Nadira, item 2)". NEW: Basis is Nadira's source string verbatim ("Avogadro constant N_A = 6.022 140 76 × 10^23 mol^−1, exact (a defining constant of the SI; no uncertainty). Source: BIPM, The International System of Units (SI Brochure), 9th edition (2019), section 2.2 and Table 1 (version 4.01, June 2026, pp. 123-124), https://doi.org/10.59161/AUEZ1291; retrieved 9 November 2026 (NAD-2026-11-09-14).") followed by the kept Fraction check; Status "ruled NAD-2026-11-09-14". Exact-integer representation 602214076 x 10^15 unchanged |
| 78 | D-0068 2 | NAD-2026-11-09-14 | Section 9, N_A register row | OLD: Basis "Value as ruled, exact by definition (NAD-2026-11-09-08, domain judgment)"; Status "source quote pending (Nadira, item 2)". NEW: Basis the same verbatim source string as row 77 (without the Fraction check, which stays in section 4); Status "ruled NAD-2026-11-09-14". NAD-2026-11-09-15: the optional NIST/CODATA 2022 second line is not used (KAITO-2026-11-09-06) and "CODATA 2018" appears nowhere outside this section 15; no change was needed for it, so it has no row of its own |
| 79 | D-0068 2 | NAD-2026-11-09-14 | Section 13, Q-E10C-08 | OLD: "[Q10] Source string for N_A: SI Brochure 9th ed., CODATA 2018, or both? Value ruled (NAD-2026-11-09-08); source quote pending (Nadira, item 2)". NEW: "RULED (NAD-2026-11-09-14): source is the SI Brochure alone; see section 4" |
| 80 | D-0068 2 | NAD-2026-11-09-16 | Section 13, Q-E10C-16 | OLD: "New, from the `toUnit` rule: for E10C-F08 and E10C-F10 (result in copies) `toUnit` is required and accepts only `copies`, the one copies unit, so that every conversion function has the same shape. Right, or should these two take no `toUnit`?" NEW: "RULED WITH CONDITIONS (NAD-2026-11-09-16)" with a short summary of the ruling and its conditions (section 3 copies row, E10C-F03, OI-1.6-2, AT-E10C-19 to -21). Normalisation: Nadira's file writes the codes as E10C-RC-01 and E10C-RC-02; this draft writes E10-RC-01 and E10-RC-02 (ADC-2026-11-09-06) |
| 81 | D-0068 2 | NAD-2026-11-09-16 (a) | Section 3, Copies row of the unit table | OLD: "`copies` 1 (the only copies unit; it is the `toUnit` of E10C-F08 and E10C-F10)". NEW: adds "The prefix set is not applied to `copies`: there are no prefixed or alias copies units (`kcopies`, `Mcopies`, `molecules`, `entities`, `cp`, `vg`, `GC` are E10-RC-01...)". Made in the same Edit as row 82's copies-per-volume sentence (one table cell) |
| 82 | D-0068 2 | NAD-2026-11-09-16 (c) | Section 3, Copies row of the unit table | OLD: no statement on copies per volume in section 3 (section 1 and OI-1.6-2 only). NEW: "Copies per volume (`copies/uL`, `copies/mL`) is E10-RC-01 in this version (OI-1.6-2; NAD-2026-11-09-16 (c))", in the same cell as row 81 |
| 83 | D-0068 2 | NAD-2026-11-09-16 (b), KAITO-2026-11-09-07 | Section 6, E10C-F03 Formula row; section 11, new AT-E10C-19 | OLD: Formula row ended "...so the result always terminates"; no row for `scaleUnit` with copies. NEW: adds "`scaleUnit("x", "copies", "copies")` is the identity and returns x: a same-dimension call like any other, and refusing it would make copies the only dimension `scaleUnit` refuses". Chosen test row: a new AT-E10C-19 (an identity row with a typed x), appended rather than folded into AT-E10C-02 |
| 84 | D-0068 2 | NAD-2026-11-09-16 | Section 11, new AT-E10C-20 and AT-E10C-21 | OLD: none (tests ended at AT-E10C-19 after row 83). NEW: AT-E10C-20, `toUnit` = `"mol"` in E10C-F10 gives E10-RC-02; AT-E10C-21, `toUnit` = `"kcopies"` gives E10-RC-01. Both marked "(from NAD-2026-11-09-16; Adacs to confirm)": Adacs owns acceptance, Atlas drafted from Nadira's wording. The `fields` entry (`toUnit` only) follows the order-of-statuses paragraph of section 2 |
| 85 | D-0068 2 | NAD-2026-11-09-17 | Section 13, Q-E10C-17 | OLD: "New, from E10C-NF-07: AT-E10C-13 (round trip `copiesToMass` of `massToCopies`; two-step against one-step) is now stated on the fixture author's exact values, not by re-entering an engine output. Confirm that this is the right reading of the passing rule for a test". NEW: "CONFIRMED WITH CONDITIONS (NAD-2026-11-09-17)" with a pointer to the conditions now in AT-E10C-13 |
| 86 | D-0068 2 | NAD-2026-11-09-17 (a), (b) | Section 11, AT-E10C-13 | OLD: Test text ended "...not by feeding an engine output back in as an input (E10C-NF-07; Q-E10C-17)". NEW: adds that the engine is exercised in both directions (`copiesToMass` gets its own engine call on an exact, terminating copies input derived by the fixture author, as in Example 13: 602214076 x 10^6 copies, MW 150000 gives 150 ug exactly), and that the non-terminating round trip (Example 3) is checked only in the fixture author's rational arithmetic, with the comparison class and bound of ADC-2026-10-26-06; "Adacs to confirm" |
| 87 | D-0068 2 | NAD-2026-11-09-19 (C2) | Section 10, Example 5 (Call 2 check) | OLD: "matches 20 x 1.85297e8 = 3.70593e9". NEW: "matches 20 x 1.85296639e8 = 3.70593278e9". The OLD product did not follow from its rounded operand (20 x 1.85297e8 = 3.70594e9); the exact value 48177126080/13 and the `sci3` string are unchanged |
| 88 | D-0068 2 | NAD-2026-11-09-20 (C3) | Section 10, Example 11, second bullet | OLD: "A build that truncates to 1.005 and then rounds half to even, or in binary, may show `1.00 x 10^0`, which is wrong." NEW: "A build that truncates to 1.005 and then rounds half to even shows `1.00 × 10^0`, which is wrong. (A binary build passes this row; Example 10 is the row it fails.)" The binary case was false (199/198 gives 1.01 in binary); literal in the × form per NAD-2026-11-09-22 |
| 89 | D-0068 2 | NAD-2026-11-09-21 (C4) | Section 11, AT-E10C-13 (Test and Expected cells) | Test cell OLD: ", with the comparison class and bound of ADC-2026-10-26-06 (from NAD-2026-11-09-17 (a), (b); Adacs to confirm)". NEW: ", by exact equality of rationals, with no tolerance and no bound (section 5; ADC-2026-11-09-04) (from NAD-2026-11-09-17 (a), (b), as qualified by NAD-2026-11-09-21; Adacs to confirm)". Expected cell OLD: "Equal within the ADC-06 class (exactly, if rational)". NEW: "Exactly equal: `exact` by cross-multiplication, no tolerance". Supersedes the bound wording of row 86; "Adacs to confirm" kept |
| 90 | D-0068 2 | NAD-2026-11-09-22 (C5) | Section 10 intro (line 193); Example 10; Example 11 (both bullets); AT-E10C-18 | OLD: seven backticked display literals with an ASCII "x": `1.01 x 10^-3` (Example 10), `1.00 x 10^0` and `1.01 x 10^0` (Example 11 first bullet), `1.01 x 10^0` and `1.00 x 10^0` (Example 11 second bullet; the `1.00 x 10^0` of this bullet was written under C3, row 88), `1.01 x 10^-3` and `1.00 x 10^1` (AT-E10C-18). NEW: the same seven in the form " × 10^" (U+00D7, one space each side), per `engine-spec-0.1.0.md:169`: six by their own Edits and one by row 88. Added after "mass, amount and volume `sig3`." in the section 10 intro: "Unbackticked working writes "x" for multiplication; every display string, and every expected string in section 11, is the 0.1.0 section 6 form, with U+00D7 and one space each side (`engine-spec-0.1.0.md:169`)." Unbackticked prose stays ASCII |
| 91 | D-0068 2 | NAD-2026-11-09-23 (C1) | Header, "Marking" line (line 7) | OLD: "Constants are Petra's, cited from memory with no web lookup, so they are "to confirm" in the register (section 9)." NEW: "The one constant, N_A, is ruled from the SI Brochure, 9th edition (NAD-2026-11-09-14; section 4 and the section 9 register)." The old sentence was stale after rows 77 and 78 |
| 92 | D-0068 2 | NAD-2026-11-09-23 (C6) | Section 6, E10C-F12, Refusals row | OLD: "`V` <= 0 or non-numeric: CCS-RF-03 `["V"]`; `c` < 0 or non-numeric: CCS-RF-03 `["c"]`; `c` = 0 returns 0 (a zero volume declares no aliquot, so it is refused)". NEW: "`V` <= 0 or non-numeric: CCS-RF-03 `["V"]` (a zero volume declares no aliquot, so it is refused); `c` < 0 or non-numeric: CCS-RF-03 `["c"]`; `c` = 0 returns 0". The parenthesis now follows the V case it explains; no rule changed |

### 15.2 Derivation output (python3 -I, run 9 Nov 2026; exact `Fraction`, `decimal` at 40 digits; display by half-away-from-zero on the decimal-exact value)

```
Ex1   massToMolar 1 mg/mL MW 150000 -> uM : exact 20/3 = 6.6666666666666666666666667 ; sci3 6.67 x 10^0 uM
      base M : exact 1/150000 = 6.6666...E-6 ; sci3 6.67 x 10^-6 M ; x 150000 = 1 (g/L)
Ex2   molarToMass 50 nM MW 25000 -> ug/mL : exact 5/4 = 1.25 ; sci3 1.25 x 10^0 ug/mL ; in g/L 1/800 = 1.25e-3
Ex3   massToCopies 1 ng MW 3250000 : exact 2408856304/13 = 1.8529663876923076923076923E+8 ; sci3 1.85 x 10^8 copies
      inverse copiesToMass of that N (exact) = 1/1000000000 g = 1 ng
      n = 4/13 fmol = 0.30769...; sig3 0.308 fmol
Ex4   scaleUnit 2.5 ug/uL -> g/L = 5/2 ; -> mg/mL = 5/2 ; 2 uM -> nM = 2000
Ex5   amountFromConcentration 10 ng/uL, 2 uL -> ng : 20 (in g: 1/50000000 = 2e-8)
      massToCopies 20 ng MW 3250000 : exact 48177126080/13 = 3.7059327753846153846153846E+9 ; sci3 3.71 x 10^9 copies
      = 20 x Ex3 value : True
Ex6   molesToCopies 1 pmol : exact 602214076000 = 6.02214076E+11 ; sci3 6.02 x 10^11 copies
Ex7   copiesToMoles 1e12 -> pmol : exact 250000000/150553519 = 1.660539067173846663790037348778277311472 ; sig3 1.66 pmol
      decimal check 1/6.02214076e11 = 1.660539067173846663790037348778277311472E-12 mol ; x N_A / 1e12 = 1 (exact)
Ex8   massToMoles 5 ug MW 25000 -> pmol = 200 ; molesToMass 2 nmol MW 25000 -> ug = 50
Ex9   amountFromConcentration 50 nM, 100 uL -> pmol = 5
Ex10  decimal 1.005 x 1e-3 = 0.001005 ; sig3 0.00101 ; sci3 1.01 x 10^-3 ; binary: '%.2f' % 1.005 = 1.00 ; 1.005*1e-3 = 0.0010049999999999998
Ex11a massToMolar 221 mg/mL MW 220000 -> mM : exact 221/220 = 1.004545454545454545454545454545454545455 ; correct sci3 1.00 x 10^0 ;
      double rounding via 1.005 would give 1.01 x 10^0 (wrong)
Ex11b massToMolar 199 mg/mL MW 198000 -> mM : exact 199/198 = 1.005050505050505050505050505050505050505 ; sci3 1.01 x 10^0
Ex12  molesToCopies 1 amol : exact 150553519/250 = 602214.076 ; sci3 6.02 x 10^5
      scaleUnit 1 fM -> M = 1/10^15 ; fM -> pM = 1/1000 ; amol -> mol = 1/10^18
Ex13  copiesToMass 602214076000000 copies MW 150000 -> ug : exact 150 ; (as nmol : 1)
Ex14  "-0" : 0
Carry check: sci3 of 9.995 = 1.00 x 10^1
```
