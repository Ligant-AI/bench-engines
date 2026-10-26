# Black-box comparison protocol: bench-engines 0.1.0, E9 / E7 / E10 subset (Protocol DRAFT 0)

| Field | Value |
|---|---|
| Status | **DRAFT 0, T-0041, Atlas, 26 Oct 2026.** Bound to C10 URS **v0.5, signed 26 Oct 2026 09:58, sha256 `0058fabdc71da39d94f1a68547ccb8fcab224bb481984f478286c6ca612f33ea`**. The engine specification (`engine-spec-draft.md`) is still unsigned (Nadira to sign). Adacs confirms the bound and the conventions (G3); residuals ADC-2026-10-26-17 and NAD-2026-10-26-19, -20 applied |
| History | 26 Oct 2026: applied ADC-2026-10-26-18 (harness mapping sentence) and -19 (`rejection.context`, not compared). 26 Oct 2026: applied NAD-2026-10-26-30 (null or blank list element is RF-01 `incomplete`, P1). 26 Oct 2026: applied S-3 and S-7 (ADC-2026-10-26-105, -106, -107, NAD-2026-10-26-49, -50, -51). |
| Read at | benchtools-OS `a93c710`; bench-engines `28e4b03`; C10 `578572c` |
| Model | C8 `verification/PROTOCOL.md` Protocol 1.0 (frame only: running, ownership, statuses, conventions list). C8's numeric grammar and its 1e-15 bound are NOT copied (sections 3 and 5) |
| Destination | `bench-engines/verification/PROTOCOL.md`, placed by the main session after NADIRA signs the URS and the engine specification and before `c10-cleanroom` and `c10-fixture-author` are tasked. The builder does not edit it; Atlas does not edit it after placing |
| Contains no expected values | Except the URS's own worked examples (section 8). All other expected values are the fixture author's and are never shown here |

Requirement IDs (CCS-xx-nn) and question IDs (Q-...) are internal: they appear here, in the harness and in tests. They never appear on the page or in any user export (page content standard). Q-C10-16 to -25 are closed (NAD-2026-10-26-01, -04 to -12); case sets follow URS v0.5.

---

## 1. Running

An implementation is a command that reads a JSON array of cases on stdin and writes a JSON array of results on stdout, same order, same `id`s:

```
<command> < verification/cases.json > verification/cleanroom/results.json
node verification/compare.mjs --cmd "<command>"
```

`verification/cases.json` carries inputs only, never expected values. The shipped engine is wrapped by `verification/run-engine.mjs` (the builder writes it against this file). A clean room is a Python program, standard library only, run with `python3 -I`.

**Who owns which file** (as C8, ADC-2026-10-22-03; confirmed ADC-2026-10-26-12; nothing in the three protocols may mention an expected value except the URS's own F-01 figures):
- `verification/cases.json`: Adacs (acceptance owner); the main session executes. The builder reads it, never writes it. **How many cases and which: not decided here** (D-0008 sets a floor of at least 6 cases per function for the fixture sets; Adacs sets cases.json).
- `verification/fixtures/`: the fixture author (`c10-fixture-author`). Untracked; never committed, never copied to /tmp, never quoted in a builder task (TEAM.md section 7).
- `reimpl/`: the clean room (`c10-cleanroom`). Untracked.
- `verification/acceptance/`: Adacs's comparators. They hold no fixture value; the main session places and runs them with `python3 -I`. The builder never runs them (running them reads the fixtures).

**How the fixture author, the clean room and Adacs's comparators use this file**

| Party | Reads | Produces | Must not read |
|---|---|---|---|
| Fixture author | URS (signed), engine specification, this file | expected values with hand derivations, in the section 2 and 3 formats | engine src, tests, the clean room |
| Clean room | URS, engine specification, this file | a reimplementation answering section 1's command | engine src, tests, fixtures, harness |
| Adacs's comparators | all of the above | the three-way comparison (engine, clean room, fixtures) on every case (AT-09, G7) | n/a (they run in the main session) |

---

## 2. A case (input)

```jsonc
{
  "id": "BE-<fn>-<nn>",           // assigned by Adacs
  "fn": "strengthFactor" | "splitVolumes" | "squareVolume" | "meanPerSquare" |
        "concentrations" | "viability" | "totalCells" | "seedingVolumes" |
        "x10Comparison" | "poissonCV" | "display" | "version",
  "args": { ... }                  // per function, below; every numeric value is TEXT as typed
}
```

Absence: `null` means not declared (CCS-RF-01). It differs from every answer. Blank or whitespace-only text is not declared (convention P3).

| `fn` | `args` | Spec section | Serves |
|---|---|---|---|
| `strengthFactor` | `{P, dyeNamed}` | 3.1 | CCS-DT-01, IN-06, FL-01 |
| `splitVolumes` | `{Vnew, N}` | 3.2 | CCS-DT-09, IN-10 |
| `squareVolume` | `{A, d}` | 4.1 | CCS-DT-02 |
| `meanPerSquare` | `{live: [..], dead: [..]}` | 4.2 | CCS-DT-03, IN-04 |
| `concentrations` | `{live[], dead[], P, A, d}`, tested as the chained black-box call. The harness chains the exported functions in order `meanPerSquare -> strengthFactor -> squareVolume -> concentrations` and contains no arithmetic of its own; acceptance greps `run-engine.mjs` for operators on numbers at G8, any hit is a G8 FAIL (second engine copy). `strengthFactor`, `squareVolume`, `meanPerSquare` are also cases in their own right (ADC-2026-10-26-09). In the chained call the refusing function for CCS-RF-06 is `concentrations` (engine specification section 2, S-1; ADC-2026-10-26-33). | 4.3 (signature stays `(Lbar, Dbar, f, Vsq, sumLive, sumDead)`) | CCS-DT-04 (Q-C10-23 ruled NAD-2026-10-26-05) |
| `viability` | `{sumLive, sumDead}` (not lists; summing lists is `meanPerSquare`'s job; ADC-2026-10-26-09) | 4.4 | CCS-DT-05 (Q-C10-17 ruled NAD-2026-10-26-08) |
| `totalCells` | `{Clive, Ctotal, Vsusp, timing, Valiquot}` | 4.5 | CCS-DT-06, IN-08, FL-04 |
| `seedingVolumes` | `{rho, Vfinal, Clive}` | 4.6 | CCS-DT-08 (Q-C10-24 ruled NAD-2026-10-26-06; per-cm² out of 1.0, NAD-2026-10-26-01) |
| `x10Comparison` | `{Vsq}`; result members `r`, `direction`, `k`, `near` (boolean, true when V_sq ≠ 0.1 µL and k shows as "1"; compared exactly; NAD-2026-10-26-25) | 4.7 | CCS-DT-10 |
| `poissonCV` | `{sumLive, sumDead}`, both required (ADC-2026-10-26-17) | 5.1 | CCS-DT-07 (Q-C10-22 ruled NAD-2026-10-26-04) |
| `display` | `{mode: "sci3" \| "sig3" \| "sig3trim" \| "fixed1" \| "fixed2" \| "exact", value}`; `value` is decimal text, so exact ties are testable (ADC-2026-10-26-10) | 6 | URS section 6, CCS-NF-03 |
| `version` | `{}`; the result is the `engine` block only (package and version exact; `moduleVersion` presence), per Adacs's wording (`.claude/reports/adacs/2026-10-26-c10-g3-close-2.md`, "`version` row", addendum 2) | 3 (the `engine` block) | CCS-OU-05, CCS-OU-10 |

### 2.1 Numbers

Adacs ADC-2026-10-26-07 (Q-PR-02, Q-ES-05, Q-C10-28 engine side): P5 confirmed as written. The engine takes plain decimal text only, pattern sign optional, digits with at most one point. Anything else (`2e5`, `2x10^5`, `1,5`, `NaN`, `Infinity`, `0x10`, unit suffixes) at the engine is `rejected`, CCS-RF-03, not an exception. UN-02 parsing, including `2e5` and `2x10^5`, is the page's. Engine cases carry no padded or suffixed numbers. The accepted suffix and spelling list is A.B.'s (Q-C10-28); until it is answered, page cases use only plain decimals, `2e5` and `2x10^5`, and suffix cases are WAITING. Counts are whole when the decimal value is an integer ("20.0" is whole; "20.5" is not; convention P4). Volumes, areas, depths, parts and densities are decimal text.

### 2.2 Units

Fixed by the URS (CCS-UN-01): concentration cells/mL; volumes mL; square volume µL; area mm²; depth mm. No unit field, no unit selector, no conversion in the protocol (CCS-UN-02: no unit selector in 1.0).

---

## 3. A result (output)

```jsonc
{
  "id": "BE-...",
  "status": "result" | "incomplete" | "rejected" | "error",
  "incomplete": ["Vsusp"],               // field names; [] unless incomplete (CCS-RF-01)
  "incompleteIndices": [],  // zero-based, ascending; [] unless incomplete from a null or blank list element (S-7)
  "rejection":  { "code": "CCS-RF-03", "fields": ["P"], "indices": [] } | null,
  "flags":      ["CCS-FL-01"],           // codes only; [] if none
  "values":     { "<name>": <unrounded> },
  "display":    { "<name>": "<string>" },
  "engine":     { "package": "@ligant/bench-engines", "version": "0.1.0", "module": "E9", "moduleVersion": "..." }
}
```

- **`values`** carry the names of the engine specification (for example `Lbar`, `Clive`, `Vseed`). `unrounded`: JSON number, or a decimal string where the double cannot hold it. Which one: Adacs (Q-C10-05 residual).
- **`display`** carries the string per section 4 (URS section 6), computed once from the unrounded value. Not present on `incomplete`, `rejected` or `error`.
- **`rejection.code`** is a URS refusal ID: `CCS-RF-03`, `CCS-RF-04`, `CCS-RF-05`, `CCS-RF-06`, `CCS-RF-07`. `CCS-RF-01` appears only as `incomplete`. Messages are not compared (the wording is the page's; RF-05's ruled wording is tested at C10 page level).
- **`engine`** is compared exactly on `package` and `version` (CCS-OU-05, -10). `moduleVersion` is compared for presence only.
- **Absence of a numeric result** on `incomplete` or `rejected`: `values` is `{}`.
- **Harness mapping (ADC-2026-10-26-18).** This section is the harness mapping (`run-engine.mjs`) of the engine's flat result (spec section 2): rename/regroup only, flat numeric members into `values`, `code`/`fields`/`indices` into `rejection`, `missing` into `incomplete`; no arithmetic, rounding, defaulting or version text (G8). Also `missingIndices` into `incompleteIndices`, a top-level member beside `incomplete`. `incomplete` holds list or field names only (`live`, `dead`), never forms such as `live[1]`. `incompleteIndices` is the ascending union of the zero-based positions of the null or blank elements across the lists named in `missing`, and is `[]` in every other case, including a wholly `null` list (engine specification section 2 and 4.2, S-7; ADC-2026-10-26-36, NAD-2026-10-26-51). This is a rename only (G8).
- **`rejection.context` (ADC-2026-10-26-19).** On a refusal the engine may return extra members (for example `Vseed`, `Vfinal`, `Clive` on CCS-RF-05). The harness moves them to `rejection.context`, which is not compared and never in `values`.

### 3.1 Refusal triggers that the black box must reproduce

| Function | Trigger | Status / code | Serves |
|---|---|---|---|
| any | a required arg is `null` or blank | `incomplete` | CCS-RF-01 |
| `strengthFactor` | P < 1, or not a number | `rejected`, CCS-RF-03, field `P` | CCS-RF-03 |
| `splitVolumes` | N < 1, N not a number, Vnew <= 0 | `rejected`, CCS-RF-03 | CCS-RF-03 |
| `squareVolume` | A <= 0 or d <= 0 | `rejected`, CCS-RF-03 | CCS-RF-03 |
| `meanPerSquare` | empty list, negative or non-integer count, unequal lengths | `rejected`, CCS-RF-03. For an empty list or lists of unequal length, `fields` names the lists (for unequal lengths both `live` and `dead`) and `indices` is `[]`. `indices` names squares only for element faults (a negative or non-integer count): the union of the offending indices across the lists, ascending, each once, zero-based, with `fields` naming every list that has a fault in argument order (engine specification 4.2, S-3; NAD-2026-10-26-49, -50). | CCS-RF-03 |
| `viability` | `sumLive` or `sumDead` negative or non-integer (no list-based row; indices removed, ADC-2026-10-26-09) | `rejected`, CCS-RF-03, fields named | CCS-RF-03 |
| `concentrations`, `viability`, `poissonCV` | sum of live + sum of dead = 0 | `rejected`, CCS-RF-06 | CCS-RF-06 |
| `poissonCV` | `sumLive` = 0 with `sumDead` above 0 | `rejected`, CCS-RF-07 | CCS-RF-07 |
| `seedingVolumes` | `Clive` = 0 (always; this function never returns RF-06) | `rejected`, CCS-RF-07 | CCS-RF-07 |
| `totalCells` | `Valiquot` >= `Vsusp` when `timing` is "before" | `rejected`, CCS-RF-04 | CCS-RF-04 |
| `seedingVolumes` | V_seed > V_final | `rejected`, CCS-RF-05 | CCS-RF-05 |
| `seedingVolumes` | V_seed = V_final | `result`, flag `CCS-FL-06`, V_med = 0 | CCS-FL-06 |
| `strengthFactor` | `dyeNamed` true and P = 1 | `result`, flag `CCS-FL-01` | CCS-FL-01 |
| `x10Comparison` | Vsq at most 0 | `rejected`, CCS-RF-03 (the R1 refusal substitute for this function; CCS-RF-02 is no longer a refusal) | CCS-RF-03, DT-10 |

Live sum = 0 with dead sum > 0 for `poissonCV` and `seedingVolumes` is stated by URS v0.5 CCS-RF-07 and F-18 (Q-ES-07, NAD-2026-10-26-02); its cases are written from those, with no values added here. `seedingVolumes` gets RF-07 from `Clive` = 0 only, always; it never returns RF-06 (when both sums are 0 the chained call stops earlier at `concentrations`, RF-06) (ADC-2026-10-26-17). `poissonCV` takes `{sumLive, sumDead}`, both required (null or blank is `incomplete`; whole numbers >= 0, else RF-03): `sumLive` = 0 with `sumDead` > 0 is RF-07, both 0 is RF-06. A count of 0 in a single square is accepted (Q-C10-17, NAD-2026-10-26-08, URS v0.5 CCS-RF-03). Order and count of refusals per call: P1 (ADC-2026-10-26-08).

---

## 4. Display (the rounding rule)

The URS section 6 rule is the protocol's: compute at full precision, round only at display, half away from zero, applied once to the decimal-exact value; no displayed value feeds a later step.

Display strings and modes (ADC-2026-10-26-10, Q-PR-03):

- Multiplication sign: U+00D7 with one U+0020 each side, then `10^`, then the exponent in plain ASCII: `1.80 × 10^6`. Negative exponent uses ASCII U+002D: `2.00 × 10^-3`. No superscript characters, no thousands separators, no unit in the engine string (the page appends units).
- Concentrations and cell totals always use the × 10^n form, including exponent 0 (`9.00 × 10^0`); carry on rounding gives `9.995e6 -> 1.00 × 10^7` (see the carry line below).
- Volumes: 3 significant figures, plain digits, trailing zeros kept (`8.00`, `0.0125`, `1.11`); no exponent form. Fold factor k: 3 significant figures, trailing zeros dropped (`25`, `1.5`, `1.39`). Viability: one decimal (`90.0`). CV: two decimals (`5.27`, `10.00`). Square volume: exact decimal, minimal (`0.0125`, `0.1`).
- Exact zero (NAD-2026-10-26-19): engine string `0` for the significant-figure modes; viability `0.0`. CV has no zero string: CV = 100/sqrt(N) is above 0 for N >= 1; N = 0 is refused by RF-07 or RF-06. Fold factor and square volume have no zero (V_sq <= 0 is RF-03). A displayed zero is always +0; a minus sign on a zero is a defect (class X). Exact-zero cases: `splitVolumes` N = 1 (V_med `0`, not `0.00`); RF-07 case viability `0.0`.
- Carry (NAD-2026-10-26-20), every mode: rounding is done once on the decimal-exact value, then the exponent or mantissa is normalised. Carry: `sci3` 9.995e6 -> `1.00 × 10^7`; `sig3` 9.995 -> `10.0`, 0.09995 -> `0.100`; `sig3trim` 9.995 -> `10`; `fixed1` 99.95 -> `100.0`; `fixed2` 9.995 -> `10.00`. Just below the tie (9.99499...e6) -> `9.99 × 10^6`. These are rules; the fixture author derives the values.
- Six named modes replace the three-mode `display`: `sci3`, `sig3`, `sig3trim`, `fixed1`, `fixed2`, `exact`. `value` is decimal text, so exact ties are testable (F-13 `81.25`, F-14 `0.0125`, and ties such as `2.675`, `1.005`, `0.125`).
- Rounding is half away from zero on the decimal-exact value, once.

| Value class | Mode | Trace |
|---|---|---|
| concentrations, cell totals | `sci3` | URS section 6 |
| viability | `fixed1` | URS section 6 |
| counting CV | `fixed2` | URS section 6 |
| volumes (mL) | `sig3` | URS section 6 |
| fold factor k | `sig3trim` | URS section 6; CCS-DT-10 |
| square volume | `exact` | URS section 6 |

**Display strings are compared exactly** against the decimal-exact value rounded half away from zero. A half-even rule, or a binary float that rounds a half-way case the other way, is a disagreement (CCS-NF-03, AT-13).

---

## 5. Agreement (comparators; Adacs's)

ADC-2026-10-26-06 (Adacs, Q-C10-05 residual), verbatim.

Three classes only (R3). Basis: the engine returns doubles or strings; the clean room and fixtures compute with exact rationals; URS CCS-NF-03 requires displays equal to the decimal-exact value, so the display, not the unrounded value, is the strict test. C8's 1e-15 relative bound held for double arithmetic over chains of up to about 5 operations and is kept, now argued rather than copied: one operation is at most 1.1e-16 relative, the longest chain here (`concentrations`: mean, times f, times 1000, divide) is 4 operations, plus one sqrt and one division in the CV, all at most 5e-16, under 1e-15.
- **X (exact):** `status`, `incomplete`, `rejection` (code, fields in argument order, indices ascending), `flags` (as a set), every `display` string, `direction`, `nSq`, `sumLive`, `sumDead`, `f`, `engine.package`, `engine.version`; `moduleVersion` for presence only. Any expected zero must be +0.
- **N1:** every other `values` member, relative difference at most 1e-15 against the exact rational (the fixture value; the clean room's value emitted as a decimal string of at least 30 significant digits).
- **N2:** the subtractive members `Vmed`, `Vmedium`, `liveRemaining`: absolute difference at most 1e-15 times the minuend (`Vfinal`, `Vnew`, `liveCells`). Basis: a relative bound is meaningless when a difference cancels (V_seed close to V_final).
- **Representation:** `values` may be JSON numbers or decimal strings; the comparator parses both exactly (a double is read at its exact binary value). **Decimal-exact versus double:** double arithmetic is permitted only where every display equals the decimal-exact rounding (NF-03). Comparisons that decide a flag, a refusal or a direction (V_seed against V_final, P = 1, V_sq against 0.1 µL) are decimal-exact, never an epsilon (P5).
- **Sign of zero:** +0 against -0 is a disagreement (C8 precedent).
- Every difference is reported with absolute and relative size, in bound or not. A comparer that exits non-zero is a FAIL of the run. Self-consistency pairs (F-05 and F-11) must give identical `values` in the engine and in the clean room.
- **Three-way:** engine, clean room and fixtures agree on every case (G7, AT-09).
- **Against the fixtures:** the comparison covers each member a fixture states. A fixture gap is ruled by NADIRA (G5), not by Atlas, Adacs or the fixture author.

---

## 6. Conventions the URS leaves to the build (P-list; every item is a proposal for Adacs)

1. **P1, order and count of refusals** (ADC-2026-10-26-08, Q-ES-06). Per call: (1) any required arg `null` or blank gives `incomplete`, listing every missing field in argument order, and nothing else is evaluated (RF-01 blocks all). (2) Otherwise all RF-03 conditions found in that call are reported together as one `rejection` with every offending field in argument order and every offending list index ascending. (3) Derived refusals (RF-04, RF-05, RF-06, RF-07) are evaluated only when the inputs they depend on passed step 2, so one function call never returns two codes, and `rejection` stays a single object. (4) Page level (protocol-c10): `rejections` is a list, one entry per active refusal per the URS section 5 table, ordered by the table's row order, each naming its field; an `incomplete` result suppresses all of them. A blocked output is listed with the refusal sentence in place of the number (URS section 5). A list element that is `null` or blank is `incomplete` (CCS-RF-01): `incomplete` names the list (`live` or `dead`), and `incompleteIndices` carries the zero-based positions of those elements, as the ascending union across the lists named (engine specification section 2 and S-7, NAD-2026-10-26-51).
2. **P2, errors:** an implementation that fails on a case reports `error` for that case and returns every other result. A refusal is never an `error`; an exception is never mapped to a refusal.
3. **P3, blank is not declared:** null, empty or whitespace-only text.
4. **P4, whole counts:** a count is whole when its decimal value is an integer.
5. **P5, exact decimal comparisons** for V_seed against V_final (CCS-FL-06, CCS-RF-05), for P = 1 (CCS-FL-01), and for V_sq against 0.1 µL (CCS-DT-10): decimal-exact, never a float epsilon. Q-C10-05 residual.
6. **P6, one loading per call:** a call takes one pair of lists; the protocol has no pooling across loadings (CCS-IN-04, CCS-DT-03). No SD or CV across squares is ever returned.
7. **P7, independence of functions:** each function is a pure function of its args. The split (`splitVolumes`) takes no count (CCS-DT-09). Whether a refusal in one function blanks another is the page's decision (Q-ES-04), not tested here.
8. **P8, no sample source, border rule, viability method name, dye name or time limit as an engine input that changes a number.** Declarations are page records (CCS-IN-05, -07, -15; F-16). The only declaration the engine sees is `timing` and `dyeNamed`.
9. **P9, engine version:** read from the result's `engine.version`, never from the harness.

---

## 7. Unsupported

None defined. A function name or field outside section 2 is a malformed case, `error` (P2). Items held out of 1.0 (instrument inputs, count window, per-cm² density, vessel area, passage number, E4 statistics) have no function and no case (CCS-IN-14, -16; URS section 0.3). **If NADIRA restores per-cm² seeding (Q-C10-25), `seedingVolumes` gains `rhoPerArea` and `area` args and this table changes.**

## 8. Illustrative example (the URS's own worked example only; F-01, URS section 11)

Not a fixture and not an expected-value set. It shows the shape.

Case: `{"id":"BE-demo-01","fn":"concentrations","args":{"live":["86","94","90","90"],"dead":["8","12","10","10"],"P":"2","A":"1","d":"0.1"}}`

The URS states for this input C_live = 90 x 2 x 1000 / 0.1 = 1.8e6, displayed `1.80 × 10^6` cells/mL; C_dead displayed `2.00 × 10^5`; C_total displayed `2.00 × 10^6`; viability `90.0`; counting CV (N = 360) `5.27`. (URS F-01.) The result would be a `result` object with `values`, `display` and `engine` members as in section 3. All other expected values are the fixture author's.

## 9. Open items and questions

| ID | Owner | Question |
|---|---|---|
| Q-PR-01 | CLOSED | Answered ADC-2026-10-26-09: both (chained black-box call and separate cases) |
| Q-PR-02 | CLOSED (engine side) | Answered ADC-2026-10-26-07: engine takes plain decimals only; parsing is the page's. Suffix and spelling list remains A.B.'s (Q-C10-28) |
| Q-PR-03 | CLOSED | Answered ADC-2026-10-26-10 (section 4) |
| Q-ES-01, -02, -03, -05 | as in `engine-spec-draft.md` section 9 | Module placement (to be settled before the Tue 13:00 freeze so the export list is fixed for G8); E4; flags in engine or page; UN-02 parsing. Q-ES-06 closed by ADC-2026-10-26-08. Q-ES-04 (NAD-2026-10-26-16) and Q-ES-07 (CCS-RF-07, NAD-2026-10-26-02) are closed |
| Q-C10-05 residual | CLOSED | Answered ADC-2026-10-26-06 (section 5) |
| Q-C10-16, -17 | NADIRA | Declaration wording; zero counts in a square. Closed: NAD-2026-10-26-07, -08 |
| Q-C10-22, -23, -24 | cgt-analytics-lead, then NADIRA | Sources for CV, dead cells/mL, seeding. Closed: NAD-2026-10-26-04, -05, -06 |
| Q-C10-25 | NADIRA | Per-cm² seeding cut. Closed: NAD-2026-10-26-01 (stays out of 1.0) |

Open: Q-C10-28 (A.B.), Q-C10-26 (after G7), module placement Q-ES-01 (before the Tue 13:00 freeze). Version rule (ADC-2026-10-26-16): 0.1.0 is fixed at the Tue 13:00 milestone; after it, any change to a reported value, refusal, flag, display string or PROTOCOL output, or a new exported function, moves the version.
