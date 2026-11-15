# Black-box comparison protocol: bench-engines 0.1.0, E9 / E7 / E10 subset (Protocol DRAFT 0)

| Field | Value |
|---|---|
| Status | **DRAFT 0, T-0041, Atlas, 26 Oct 2026.** Bound to C10 URS **v0.5, signed 26 Oct 2026 09:58, sha256 `0058fabdc71da39d94f1a68547ccb8fcab224bb481984f478286c6ca612f33ea`**. The engine specification (`engine-spec-draft.md`) is still unsigned (Nadira to sign). Adacs confirms the bound and the conventions (G3); residuals ADC-2026-10-26-17 and NAD-2026-10-26-19, -20 applied |
| History | 26 Oct 2026: applied ADC-2026-10-26-18 (harness mapping sentence) and -19 (`rejection.context`, not compared). 26 Oct 2026: applied NAD-2026-10-26-30 (null or blank list element is RF-01 `incomplete`, P1). 26 Oct 2026: applied S-3 and S-7 (ADC-2026-10-26-105, -106, -107, NAD-2026-10-26-49, -50, -51). 15 Nov 2026: added section 10 (E10R functions), applying Adacs's rulings ADC-2026-11-15-122 to -134 and -140 to -148. |
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
  "engine":     { "package": "@ligant/bench-engines", "version": "0.1.1", "module": "E9", "moduleVersion": "0.1.0" }
}
```

- **`values`** carry the names of the engine specification (for example `Lbar`, `Clive`, `Vseed`). `unrounded`: JSON number, or a decimal string where the double cannot hold it. Which one: Adacs (Q-C10-05 residual).
- **`display`** carries the string per section 4 (URS section 6), computed once from the unrounded value. Not present on `incomplete`, `rejected` or `error`.
- **`rejection.code`** is a URS refusal ID: `CCS-RF-03`, `CCS-RF-04`, `CCS-RF-05`, `CCS-RF-06`, `CCS-RF-07`. `CCS-RF-01` appears only as `incomplete`. Messages are not compared (the wording is the page's; RF-05's ruled wording is tested at C10 page level). For E10R functions see section 10.
- **`engine`** is compared exactly on `package` and `version` (CCS-OU-05, -10). `moduleVersion` is compared for presence only.
- **Absence of a numeric result** on `incomplete` or `rejected`: `values` is `{}`.
- **Harness mapping (ADC-2026-10-26-18).** This section is the harness mapping (`run-engine.mjs`) of the engine's flat result (spec section 2): rename/regroup only, flat numeric members into `values`, `code`/`fields`/`indices` into `rejection`, `missing` into `incomplete`; no arithmetic, rounding, defaulting or version text (G8). Also `missingIndices` into `incompleteIndices`, a top-level member beside `incomplete`. `incomplete` holds list or field names only (`live`, `dead`), never forms such as `live[1]`. `incompleteIndices` is the ascending union of the zero-based positions of the null or blank elements across the lists named in `missing`, and is `[]` in every other case, including a wholly `null` list (engine specification section 2 and 4.2, S-7; ADC-2026-10-26-36, NAD-2026-10-26-51). This is a rename only (G8).
- **`rejection.context` (ADC-2026-10-26-19).** On a refusal the engine may return extra members (for example `Vseed`, `Vfinal`, `Clive` on CCS-RF-05). The harness moves them to `rejection.context`, which is not compared and never in `values`. For E10R functions see section 10.

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

---

## 10. E10R functions: carriage to the comparator

Citations: `spec:N` = `engine-spec-e10-scaling-activity.md` line N; `conv:N` = `engine-spec-e10-conversions.md`; `0.1.0:N` = `engine-spec-0.1.0.md`; `AMD-n:N` = `engine-spec-e10-scaling-activity-AMD-n.md` (AMD-2 is the `-r2` file); all in `bench-engines/docs/`. Requirement and rule IDs are internal and never reach a page or export.

### 10.1 Scope and rule of carriage

This section covers the exported functions of E10R (recipe scaling and activity conversion), the E10C functions that E10R rows call, and the E9 `display` function as E10R rows use it (CR-17). It says how each named member of the engine's result reaches the comparator. **The runner passes through only** (RU-2, `.claude/reports/adacs/2026-11-15-t0651-round8-disclosure-runner.md` :36): no row id, no fixture literal, no per-row branch, no arithmetic, no rounding, no defaults. A member the engine does not return is not emitted by the runner. The ordering of statuses, closed strings and refusal triggers are the signed spec's (conv:44; spec:132; AMD-3:37) and are not restated.

For E10R rows this section governs where it differs from section 3. It overrides section 3 only for the message (CR-07, CR-08) and for `partsTotal` and `statedTotal` (CR-14). Section 3 :104 stays in force for every other extra member of a refusal (CR-15). Section 5's 1e-15 bounds do not apply: the signed E10 representation is an exact rational with no tolerance (conv:73).

### 10.2 The rules

**Function names (CR-01).** The runner resolves each of these `fn` strings to the engine export of the same name and calls it with the arguments in the signature order of the spec. No alias and no other name; any other `fn` is a malformed case, `error` (P2). Signed names:

| Function | Source |
|---|---|
| `scaleToVolume` (E10R-F13) | spec:163 |
| `volumeFromAmount` (E10R-F14) | spec:175 |
| `balanceVolume` (E10R-F15) | spec:186 |
| `percentSolution` (E10R-F16) | spec:199 |
| `concentrateVolume` (E10R-F18) | spec:213 |
| `roundDeclared` (E10R-F19) | spec:224 |
| `activityToMass` (E10R-F20) | spec:235 |
| `massToActivity` (E10R-F21) | spec:246 |
| `activityAmountFromConcentration` (E10R-F22) | spec:257 |
| `volumeFill` (E10R-F23) | AMD-2:34 |
| `scaleUnit` (E10C-F03), `amountFromConcentration` (E10C-F12), called by E10R rows | conv:77-128; spec:259, :388 |
| `display` (E9, `display(mode, value)`) | CR-17 |

**Pass-through (CR-02).** No arithmetic, rounding or defaults in the runner (RU-2). Every member named below is copied from the engine's result unchanged, as the same string, list or object.

**`status` (CR-03).** Carried as the engine's string. Closed set `"result"`, `"incomplete"`, `"rejected"`; `"error"` is the harness's, for a thrown exception or a malformed case, and never maps to a refusal (P2). Compared exactly (string equality). Basis: conv:35, :44; spec:161; PROTOCOL section 6 P2.

**`rejection.code` (CR-04).** Present only when `status` is `"rejected"`. The engine's code string, unchanged. Compared exactly. Possible values: `CCS-RF-03`, `E10-RC-01`, `E10-RC-02`, `E10-RC-03`; `E10-RC-04` is reserved and never returned; `CCS-RF-01` appears only as `incomplete`, never as a `rejection.code`. Basis: conv:35, :39-40; spec:125-131.

**`rejection.fields` (CR-05).** The engine's list of field-name strings, unchanged, in the engine's order. Compared exactly: same length, same strings, same order (argument order is signed). Names include nested and element forms as signed: `SA.lower.relation`, `SA.value`, `parts[i]`, `lines[i]`, `lines[i].unit`, `final.unit`. The runner never splits, reorders, sorts or de-duplicates. Basis: conv:44; spec:132, :243, :460; AMD-2:44; AMD-3:37.

**`rejection.indices` (CR-06).** Every E10 refusal carries `indices` (NAD-2026-11-14-394 (a): 0.1.0:26, conv:20, spec:110). The runner carries `indices` unchanged when the engine returns it and emits none when it does not (RU-2: no default `[]`). What a row may state:
- **A row may assert `indices: []`** for (NAD-394 (b)): every `CCS-RF-03` refusal (conv:35); every `E10-RC-03` refusal (`fields` is `["parts"]`, spec:129); every `E10-RC-01` or `E10-RC-02` refusal in which **every** named field is a non-element name: a scalar argument (`unit`, `toUnit`, `Vunit`, `fromUnit`, `cUnit`, ...), a closed-string argument (`rule`, `form`, `reference`), or a member of an object (`SA.unit`, `SA.lower.relation`, `final.unit`). `indices` is compared exactly as a list. An E10 refusal under this bullet that lacks `indices` fails a row that states `indices: []` (NAD-394, "For Atlas's CR-06 text": the intended test).
- **A row states no `indices`** for an `E10-RC-01` or `E10-RC-02` refusal naming **any** element-form field (`parts[i].unit`, `lines[i].unit`, or `parts[i]`, `lines[i]` forms), alone or with other fields. The row still asserts `status`, `code` and `fields`. NAD-394 (c) HOLDS this case until a signed line chooses between `[i]` and `[]`; the amendment sentence that would release it is open item A-1 and is **not rule text**.
- Quote NAD-2026-11-14-394 beside this rule in the placed text (NAD-394, Adacs condition).

**`rejection.message`, carriage (CR-07).** The runner copies `message` to `rejection.message` on a `rejected` result **only when the engine's result has `message` as an own member and its value is not `undefined`** (`undefined` cannot be written to JSON, so it counts as absent). Any other value is passed through unchanged: `""`, `null`, a non-string, or a string. The runner does not turn `null` or `""` into absent; passing them through is what lets `notPresent` catch them (RU-2, no defaults). It is never put into `rejection.context`. On a status other than `rejected` a `message` is not mapped to `rejection` and falls under CR-15. Basis: ADC-2026-11-15-123; ADC-2026-11-15-95 (i), -96 (2); ADC-2026-11-15-116.

**`rejection.message`, comparison (CR-08).** Three forms of row. `notPresent` names are members of `rejection`; the fixture key is `expect.notPresent: ["message"]`, path base `rejection`.
- `expect.rejection.message` present: the runner's `rejection.message` must be present and a string, and equal to the expected text by `===` (code-point equality; case, spacing and punctuation matter; no trimming). **If the runner's output has no `message`, the row fails** (it does not pass as "not compared"). A non-string message fails.
- `expect.notPresent: ["message"]`: the row passes only when `rejection` has no `message` member. Any present `message`, even `""` or `null`, fails the row. Only the absent case passes.
- A row that states **neither** `expect.rejection.message` nor `expect.notPresent` **passes whatever `message` member the runner returns**: absent, `""`, `null`, a string or a non-string. The comparator must not read, coerce or throw on `rejection.message` for such a row (NAD-2026-11-14-392 as carried by ADC-2026-11-15-123, -130). RU-3 mutants vary the runner's message over five cases (absent, `""`, `null`, a string, a number) and must show: neither-stated passes in all five; `notPresent` passes only on absent; stated message passes only on the exact string (ADC-130).

A row may assert absence only where signed text says there is no message (CR-10).

**Signed message strings (CR-09).** Only these strings are signed as engine messages; a row asserting any other message text has no basis here.

| Refusal | Exact string | Basis |
|---|---|---|
| E10-RC-03 (`balanceVolume`, parts over total) | `the parts add up to more than the total` (lowercase, no closing full stop, no quotation marks) | AMD-5:25 (NAD-2026-11-14-371); spec:129 |
| E10-RC-02, `scaleToVolume` with a concentration `unit` (`mg/mL`, `IU/mL`, `U/mL`) | `a concentration does not scale with the final volume` | spec:173, :460 (Q-E10R-A5). Word-for-word status is Nadira's NAD-2026-11-14-379, quoted in ADC-2026-11-15-115 item 1; I read the quote, not her record |
| CCS-RF-03 `["SA.lower","SA.upper"]`, equal limits (`activityToMass`, `massToActivity`) | `the two limits are equal; enter it as a single value` | spec:243, :422 (AT-E10R-28) |
| E10-RC-02, `scaleUnit` from a mass-concentration unit to a molar-concentration unit (conv:40; `g/L` to `M`, conv:87) | **Signed (NAD-2026-11-14-395).** Exact, 41 ASCII characters, lowercase start, no closing full stop, no quotation marks, **no backticks**, byte-exact: `needs a molecular weight, use massToMolar` (the backticks around `massToMolar` in conv:40 are Markdown). The fixture author and clean room take the string from this fence and NAD-395, never from the Markdown of conv:40 | conv:40, :87; spec:460; NAD-395 |

Scope of the `scaleUnit` string: only `fromUnit` a mass-concentration unit and `toUnit` a molar-concentration unit. For every other cross-dimension `scaleUnit` call, signed text gives no message, and no row asserts a message or its absence (NAD-395 Scope). `fields` there is `["fromUnit","toUnit"]` (conversions erratum-1 row 5, :81, as cited by NAD-395).

**Where a row may assert "no message" (CR-10).** `expect.notPresent: ["message"]` is allowed **only where signed text says "no message"**. Today that is `E10-RC-02` `["unit","toUnit"]` for IU meeting U in `scaleToVolume`, in either direction, "with no message" (AMD-4:30; NAD-2026-11-14-365). By the same signed limit, the `scaleToVolume` A5 message belongs to a concentration `unit` only (spec:460); a `scaleToVolume` refusal for a specific-activity or `copies` `unit` is therefore outside the A5 message, as AMD-3 item (4) with spec:460 and ADC-2026-11-15-114 (i) record. For every other refusal whose signed text is silent on a message, **silence is not "none"**: no row asserts `notPresent` and no row asserts a message.

The E10-RC-01 rows (`copies/mL` to `copies/mL`, `copies/uL` to `copies/uL`, `mg/L` to `mg/L`, and the mixed `copies/mL` to `mg/mL`) assert **neither** `notPresent` **nor** a message. They state `status`, `code` and `fields` only. This closes N-3. Quotation, so that a fixture author does not read "no message" as "none": NAD-2026-11-14-392, as put by Nadira at NAD-394 "How this squares with my -392": "-392 ruled that rows may not assert that a message is absent. The message is not a named member of the shape, and silence there is not 'none'." Citation for the E10-RC-01 rows: ADC-2026-11-15-124; ADC-130 (with -388 part (2)).

**`unit` of a result (CR-11).** On a `result` the engine's `unit` string is carried as the output object's top-level `unit`, unchanged (not inside `values`). It is `toUnit` as the caller typed it. Compared exactly. A result with no `unit` in the engine (`percentOfFinal` of E10R-F16; `roundDeclared`, `volumeFill`) gets none. Basis: spec:161, :206, :231, :293 (E10R-OU-01); conv:28.

**`exact` of a result (CR-12).** The engine's `exact` is carried as the top-level `exact`: `{num, den}`, passed unchanged. The comparator checks, on the runner's `exact`, **before** comparing:
1. **Wire form** (ADC-2026-11-15-125): `num` and `den` are decimal-integer **strings**, not JS numbers; `num` matches `^-?(0|[1-9][0-9]*)$`; `den` matches `^[1-9][0-9]*$`; zero is exactly `"0"` over `"1"`. A runner `exact` that fails this fails the row.
2. **Equality:** by integer cross-multiplication in **BigInt** (`num_a x den_b == num_b x den_a`), with **no numeric tolerance**. The cross-multiplication is the comparator's, never the runner's.

Lowest terms (`gcd(|num|, den) = 1`, conv:28 "reduced", NAD-2026-11-14-401) is the engine's signed output form and is **not checked by the comparator** (ADC-2026-11-15-140): equality does not depend on it and it catches no wrong number. Negative zero does not exist (the text `"-0"` returns `0`). Basis: conv:28, :42, :73; spec:157, :293; ADC-125.

**`value` of a result (CR-13).** The JS number (or string) `value` is carried unchanged beside `exact` and is **not compared and never used for display or acceptance**. A bare JS number is never compared. Basis: conv:28, :73.

**`partsTotal` and `statedTotal` (CR-14).** Present on `E10-RC-03` only. Each is the engine's `{value, unit, exact: {num, den}}`, both expressed in `toUnit`, in the same unit. The runner copies each object unchanged to the output object's top level, beside `rejection` (spec:129: "the result also carries"; position confirmed by Adacs, ADC-2026-11-15-127, with one schema-only check of fixture key names under RU-1), and never into `rejection.context` or `values`. Comparison per sub-member: `unit` exact string, which must be the same string for both; `exact` as CR-12; `value` not compared (CR-13). Signed figures: `balanceVolume("50","mL",[{"30","mL"},{"25","mL"}],"mL")` gives `partsTotal` 55/1 and `statedTotal` 50/1, mL (spec:336). Basis: spec:129, :403, :443 (Q-E10R-N9, NAD-2026-11-14-270).

**Members not listed (CR-15).** A member of an engine result that is not named in CR-03 to CR-14 and CR-17 is handled by this rule (ADC-2026-11-15-126):
- **Carriage.** On a **refusal**, an unlisted extra member goes to `rejection.context` as in section 3 :104, and is **not compared**. On a **result**, it is passed through unchanged at the top level.
- **Comparison (type rule).** When a row states an expected value for a top-level result member, it is compared by the shape of the expected value:

| Shape of the expected member | Compared as |
|---|---|
| S-1 a string | exact equality (`===`) |
| S-2 a list of strings, or of integers | exact ordered list: same length, element-wise `===` |
| S-3 an object `{num, den}` | CR-12 |
| S-4 an object whose members are among `value`, `unit`, `relation`, `exact` | each member the row states: `unit` and `relation` exact string; `exact` per CR-12; `value` not compared (CR-13). A member the row states and the runner's object lacks fails the row |
| S-5 a bare JS number | never compared (CR-13) |
| S-6 `null` | equals `null` only; a carried object against an expected `null`, or the reverse, fails |

- **A member a row states but the runner does not carry fails the row.**
- The table below gives each unlisted member its signed shape and line before any such row runs. A member with no signed shape is marked NEEDS NADIRA.

| Member (function) | Signed shape | Compared as | Signed line | Status |
|---|---|---|---|---|
| `assumes` (`balanceVolume`; `percentSolution` v/v modes 2 and 3; `volumeFill`) | the string `"additive volumes"`; on every such result; absent where additivity is not assumed; on no refusal | S-1 | spec:195, :206, :294 (E10R-OU-02); AMD-2:43 | Signed |
| `finalVolume` (`percentSolution` v/v modes 2 and 3) | `{value, unit, exact}` in `toUnit` | S-4 | spec:206 | Signed |
| `percentOfFinal` (`percentSolution` v/v mode 2) | `{value, exact}`, no unit | S-4 | spec:206 ("Every output is `{value, unit, exact: {num, den}}` ... (`percentOfFinal` has no unit)") | Signed; `{value, exact}` read from spec:206 and compared by S-4 |
| `solvent` (`percentSolution` w/w) | `{value, unit, exact}`, the solvent mass | S-4 | spec:206 (Q-E10R-N16) | Signed |
| `form` (`activityToMass`, `massToActivity`, bounded result) | the string `"bounded"` | S-1 | spec:242 | Signed |
| `lower`, `upper` (bounded result) | each `{value, exact, relation}` or `null`; no top-level `value` or `exact` on a bounded result; `relation` one of `">"`, `">="`, `"<"`, `"<="` | S-4 when an object; S-6 when `null` | spec:242, :253 (E10R-OU-03); relation strings spec:115 | Signed |
| `fill` (`volumeFill`) | one of the strings `"under"`, `"full"`, `"over"` | S-1 | AMD-2:43 | Signed |
| `text` (`roundDeclared`) | a decimal string with exactly `places` digits after the point; no point at `places` 0 | S-1 | spec:231 (Result), :230 (Relation) | Signed |
| `rule` (`roundDeclared`) | the string `"half-up"` or `"half-even"` | S-1 | spec:231; relation strings spec:115 | Signed |
| `places` (`roundDeclared`) | listed in the result shape at spec:231; its type is not stated by signed text (NAD-2026-11-14-400) | **no row states `places`; the comparator never reads it.** The runner carries it unchanged as the engine returns it | spec:231; NAD-400 | Closed: not compared until an amendment |
| `engine` (every result) | object `{package, version, module, moduleVersion}`, strings | no row states engine; the runner carries it unchanged at the top level and the comparator never reads it | 0.1.0:30; conv:31 (E10C-NF-05) | Signed shape; ADC-2026-11-15-144 |
| `missing`, `missingIndices` (an `incomplete` result) | top-level members beside `status`, not inside `rejection`. `missing`: list of field-name strings. `missingIndices`: list of zero-based integers, ascending, only where the engine returns it | S-2 | 0.1.0:27 (S-7) | Signed; position ADC-2026-11-15-143 |

**No tolerance (CR-16).** E10R comparisons are strings, string lists and exact rational equality only. No relative or absolute bound is used. Basis: conv:73 ("no tolerance and no numeric bound").

**`display` (CR-17).** `display` is the E9 export `display(mode, value)` (`src/core.js:152`; read as an export line only, per ADC-2026-11-15-128), signed in 0.1.0 section 6 with six modes `sci3`, `sig3`, `sig3trim`, `fixed1`, `fixed2`, `exact`. Rules (ADC-2026-11-15-128):
- The runner passes each member of the row's `args` **exactly as the case gives it**, in signature order. It does **not** convert an `{num, den}` pair into decimal text: a conversion is arithmetic and RU-2 forbids it.
- If a row gives only `exact` and the engine's `display` accepts only text, the case is malformed and the runner returns `error` (P2). The fixture author then supplies the text. This is a fixture change, not a runner workaround. (An engine that accepts an `{num, den}` object receives it as given.)
- A thrown exception (an unknown mode, or text that is not plain decimal) is `error` (P2), never a refusal.
- The displayed string is compared as **exact text** (`===`, code-point equality; the `×` of `sci3` is U+00D7).
- The runner puts the returned string in the output object as the top-level member `display`, unchanged, and nothing else beside it. An exception is `error` (P2). The fixture key `expect.display` is compared by the rule above. The key name is checked once, schema-only, against the fixture key set when the runner is written (RU-1, as ADC-2026-11-15-127); no expected value is read. If the fixture's key differs, the name is changed in this bullet by a new ruling of mine, not by a runner workaround (ADC-2026-11-15-146).

### 10.3 Basis table

| Rule | Member | Compared as | Basis (signed doc line) | Status |
|---|---|---|---|---|
| CR-01 | `fn` names | exact name resolves | spec:163, :175, :186, :199, :213, :224, :235, :246, :257; AMD-2:34; conv:77 | Signed |
| CR-02 | all | pass-through, no arithmetic, rounding or defaults | RU-2 (Adacs); conv:28, :73 | Adacs's |
| CR-03 | `status` | exact string | conv:35, :44; spec:161 | Signed |
| CR-04 | `rejection.code` | exact string | conv:35, :39-40; spec:125-131 | Signed |
| CR-05 | `rejection.fields` | exact ordered list | conv:44; spec:132, :243, :460; AMD-2:44; AMD-3:37 | Signed |
| CR-06 | `rejection.indices` | exact list; `[]` assertable per NAD-394 (b); none stated for element-field RC-01/-02 rows | 0.1.0:26; conv:20, :35; spec:110, :129, :132; NAD-394 | Ruled (NAD-394); element-field case HELD, no row states it |
| CR-07 | `rejection.message` carriage | own member; absent only when engine has none or `undefined`; `""`, `null`, non-strings passed through | ADC-123, -95 (i), -96 (2), -116 | Adacs's |
| CR-08 | `rejection.message` comparison | stated: exact `===`, absent fails; `notPresent`: absent only; neither stated: passes whatever is returned | ADC-123, -130; NAD-392 | Adacs's; NAD-392 |
| CR-09 | message strings | exact text | AMD-5:25; spec:129, :173, :243, :422, :460; conv:40, :87; NAD-395 | Signed (all four) |
| CR-10 | rows that may assert no message | `notPresent` only where signed text says none; RC-01 rows assert neither | AMD-4:30; AMD-3 (4); spec:460; NAD-392; ADC-124 | Signed for IU-meets-U; RC-01 closed by NAD-392 |
| CR-11 | `unit` | exact string | spec:161, :206, :293; conv:28 | Signed |
| CR-12 | `exact` | wire-form check, then BigInt cross-multiplication, no tolerance; lowest terms not checked (ADC-140, NAD-401) | conv:28, :42, :73; spec:157; ADC-125 | Signed |
| CR-13 | `value` | not compared | conv:28, :73 | Signed |
| CR-14 | `partsTotal`, `statedTotal` | `unit` exact; `exact` per CR-12; `value` not compared | spec:129, :336, :403, :443 | Signed; position confirmed ADC-127 |
| CR-15 | other members | refusal: to `rejection.context`, not compared; result: top level, type rule S-1 to S-6, table above | ADC-126; spec lines in table | Signed shapes; `places` not compared (ADC-142) |
| CR-16 | tolerance | none | conv:73 | Signed |
| CR-17 | `display` | args as given; exact text | 0.1.0 section 6; `src/core.js:152` export; ADC-128 | Adacs's; output position ADC-146 |

### 10.4 Open items

| ID | Owner | Item |
|---|---|---|
| A-1 | Atlas, Kaito (ticket) | **For a future E10R amendment, not rule text.** Nadira's sentence (NAD-394, "For Atlas"): "Every E10 refusal carries `indices: []`; the position of a failing list element is carried in the field name (`parts[i]`, `lines[i]`, `parts[i].unit`, `lines[i].unit`) and nowhere else." Signed and placed, it releases the held element-field case of CR-06. It returns to Nadira by sha. Also from NAD-395: at the next conversions version, quote the `scaleUnit` message in a fence or without inner backticks. Also from NAD-400, for the E10R-F19 Result row: `rule` and `places` in the result are the `rule` and `places` arguments returned unchanged, as the same strings the caller passed (`places` `"2"` in, `"2"` out); they are never converted to a number. The amendment returns to Nadira by sha. |

Closed since r1: N-1 (NAD-394), N-2 (NAD-395), N-3 (NAD-392 via ADC-124), O-1 (ADC-127), O-2 (CR-17), O-3 (CR-15 and the table), O-4 (placement block), N-4 (NAD-400), O-5 to O-9 (ADC-143, -144, -146, -140, -141).

**Count: 17 rules (CR-01 to CR-17). NEEDS NADIRA: none.**
