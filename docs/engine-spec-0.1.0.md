# bench-engines 0.1.0: engine specification, E9 / E7 / E10 subset (DRAFT, T-0041, Atlas, 26 Oct 2026)

**Status:** DRAFT against C10 URS **v0.5, signed 26 Oct 2026 09:58, sha256 `0058fabdc71da39d94f1a68547ccb8fcab224bb481984f478286c6ca612f33ea`**. The engine specification was signed by Nadira (NAD-2026-10-26-27) and re-signed (NAD-2026-10-26-32) at sha256 `9f7ec4f47600b33a3139133d8b5c650634a4a1ce03312853c167dd9136c3c154`; the clarifications S-1 to S-7 added under T-0041 (change log, section 10) await her re-signature. The signed hash `9f7ec4f47600b33a3139133d8b5c650634a4a1ce03312853c167dd9136c3c154` stays the builder's base until then. Destination after signature: `bench-engines/docs/` (placed by the main session; Atlas writes only here).
**Read at:** benchtools-OS `a93c710`; bench-engines `28e4b03`; C10 `578572c`. Sources: URS v0.5 (`C10-Cell-Counting-and-Seeding/docs/urs/URS-C10-v0.5.md`), `questions.md`, `bench-engines/README.md`, `bench-engines/docs/README.md` (empty placeholder), C10 `TEAM.md`, B1 source pack, D-0008 sections 3-4.
**Marking.** Q-C10-16 to Q-C10-25 are closed (rulings NAD-2026-10-26-01, -04 to -12 in `.claude/reports/nadira/2026-10-26-c10-urs-v0_4-rulings.md`). "PROVISIONAL" marks a choice Atlas made where the URS gives no ID; each is also a question in section 9. No requirement is invented: every function and rule below traces to a URS ID cited exactly as in the URS, or is listed in section 9.
**History.** 26 Oct 2026: applied ADC-2026-10-26-18 (`indices` in refusal shape), -19 (refusal context members are not results), -22 (`Clive`, `Ctotal` required in 4.5); Nadira to re-sign.
**History.** 26 Oct 2026: applied NAD-2026-10-26-28 (4.5 `Clive` < 0 is CCS-RF-03, `Clive` = 0 is a result; `Ctotal` <= 0 is CCS-RF-03; both required, NAD-29) and -30 (null or blank list element is CCS-RF-01 `incomplete`, at section 2 and 4.2); Nadira to re-sign.
**History.** 26 Oct 2026: applied NAD-2026-10-26-85 (not ready) and ADC-2026-10-26-36: S-7 filled (`missingIndices`, zero-based) and its "pending" lines removed; `incomplete` names the lists in `missing`, the index is in `missingIndices`; status vocabulary (`rejected`, `fields`), full `CCS-RF-nn` IDs and the section 6 table repaired (Engineering Manager's wording points, T-0006). S-1 to S-7 await re-signature.
**No expected values** appear here except the URS's own worked examples (F-01 and the URS section 11 figures), quoted by reference.

## 1. What the engines are, and the rules that bind them

From `bench-engines/README.md`: one implementation in the suite (CCS-NF-01; a second copy in C10 is a defect, G8); deterministic, no random numbers, no network, no new dependency (CCS-NF-02); engine version in every export (CCS-OU-05, CCS-OU-10); independently verified by a fixture set and a clean room neither visible to the builder (CCS-NF-03, AT-09); research use only (CCS-OU-06).

**In bench-engines 0.1.0 for C10 1.0:** E9 (counting, viability, totals, seeding), E7 (the Poisson counting CV only), E10 (the dilution arithmetic C10 uses: strength factor and split).
**Not in 0.1.0 for C10 1.0:** E4 replicate statistics. The bench-engines README lists E4 among the first modules, but URS v0.5 defers E4 to 1.1 (section 0.3; D-0008 section 3). Raised with Kaito (Q-ES-02). E9 excludes E:T planning and step recovery (CCS-NF-01; R-40). No instrument-value function, no count-window function (CCS-IN-16).

## 2. Conventions common to every function

| Topic | Rule | Traces to |
|---|---|---|
| Arithmetic | Exact on decimal inputs; a binary float is acceptable only where every displayed value equals the decimal-exact value rounded by the section 6 rule. Method (decimal arithmetic or exact rational) is the builder's choice; the comparison classes and bound are ADC-2026-10-26-06 | CCS-NF-03; URS section 6 |
| Inputs | ADC-2026-10-26-07: the engine takes plain decimal text only, pattern sign optional, digits with at most one point. Anything else (`2e5`, `2x10^5`, `1,5`, `NaN`, `Infinity`, `0x10`, unit suffixes) at the engine is `rejected`, CCS-RF-03, not an exception. UN-02 parsing, including `2e5` and `2x10^5`, is the page's. The accepted suffix and spelling list is A.B.'s (Q-C10-28) | CCS-UN-02, CCS-NF-01 |
| Units | Concentration cells/mL; volumes mL (suspension, medium, transfer, seed); square volume µL; area mm²; depth mm; time min. Conversions printed by the page: 1 mm³ = 1 µL, 1 mL = 1000 µL | CCS-UN-01, CCS-UN-03, CCS-OU-12 |
| Outputs | Each computed value is returned **unrounded** (full precision). Display strings are produced by section 6 functions, once, from the unrounded value; no displayed value feeds a later step | URS section 6; CCS-NF-03 |
| Refusal | A refusal is a returned object, never a thrown exception: `{status: "rejected", code, fields, indices, ...}`, where `indices` is the ascending list of offending list indices (the index of the square for `meanPerSquare`), empty if none (ADC-2026-10-26-18). **S-7 (ADC-2026-10-26-36):** `indices` and `missingIndices` hold zero-based positions: the first square of a list is index 0; the page adds 1 when it names a square; codes are the URS IDs (CCS-RF-03 to -07). A refused call returns no numeric result for that function; refusal context members (for example `Vseed`, `Vfinal`, `Clive` on CCS-RF-05, 4.6) are not results (ADC-2026-10-26-19). What else on the page is blanked by a refusal: Q-ES-04 | URS section 5 |
| Missing declarations | An input of `null` means not declared. A function whose declared **required** input is `null` returns `{status: "incomplete", missing: [field names]}`. The page lists the fields (CCS-RF-01). **S-7 (ADC-2026-10-26-36, NAD-2026-10-26-51):** when a list element of `live[]` or `dead[]` is `null` or blank, the result is `incomplete` with `missing` naming the list(s) and `missingIndices` giving the ascending union of the zero-based positions of those elements across the lists named; `missingIndices` is `[]` in every other case (4.2). **S-5 (NAD-2026-10-26-53; wording only, no change of behaviour):** `incomplete` applies to required inputs only. An optional input that is `null` is not missing: `dyeNamed: null` means no dye was named, gives a result with `flags: []`, and is never `incomplete` (the dye name is an optional field, URS :116; CCS-RF-01 covers compelled entries only, URS :187) | CCS-RF-01 |
| Derived-refusal fields | **S-1 (NAD-2026-10-26-40, -43, -44):** Derived refusals name the inputs their condition is stated on, in argument order: CCS-RF-04 `[Vsusp, Valiquot]`; CCS-RF-05 `[rho, Clive]`; CCS-RF-06 `[sumLive, sumDead]`; CCS-RF-07 `[Clive]` at `seedingVolumes`, `[sumLive]` at `poissonCV`; `indices: []`. This applies to `viability`, `poissonCV` and `concentrations` for CCS-RF-06 (in the chained call the refusing function is `concentrations`) | CCS-RF-04 to -07; URS :183 |
| Order of statuses | ADC-2026-10-26-08. Per call: (1) any required arg `null` or blank gives `incomplete`, listing every missing field in argument order, and nothing else is evaluated (CCS-RF-01 blocks all). (2) Otherwise all CCS-RF-03 conditions found in that call are reported together as one `rejected` result with every offending field in `fields` in argument order and every offending list index in `indices` ascending. (3) Derived refusals (CCS-RF-04, CCS-RF-05, CCS-RF-06, CCS-RF-07) are evaluated only when the inputs they depend on passed step 2, so one function call never returns two codes, and a call returns at most one `rejected` result. (4) Page level: `rejections` is a list, one entry per active refusal per the URS section 5 table, ordered by the table's row order, each naming its field; an `incomplete` result suppresses all of them. A blocked output is listed with the refusal sentence in place of the number (URS section 5). A list element that is `null` or blank is `incomplete` (CCS-RF-01): `missing` names the list(s) and the index is carried in `missingIndices`, zero-based (NAD-2026-10-26-30; S-7, ADC-2026-10-26-36) | URS section 5 |
| Engine version field | Every result object carries `engine: {package: "@ligant/bench-engines", version: "0.1.0", module: "E9"/"E7"/"E10", moduleVersion: "<line>"}`. `version` is the package `version`; each module also carries its own version line (README rule 2). The page copies the package version into every export | CCS-OU-05, CCS-OU-08, CCS-OU-10, CCS-NF-01 |
| Rounding | Engines return unrounded values only. The display functions of section 6 implement the URS section 6 rule: half away from zero, applied once to the decimal-exact value | CCS-NF-03; URS section 6 |

## 3. E10: dilution arithmetic (the subset C10 uses)

### 3.1 `strengthFactor(P)`

| Item | Specification |
|---|---|
| Purpose | f = P, for "1 part cell suspension in P parts total" |
| Inputs | `P`: parts total, decimal text, dimensionless (integer or decimal). `dyeNamed`: boolean or `null` (the optional dye name field is non-empty), so the flag can be computed |
| Output | `{status: "result", f}`, f = P unrounded. `flags`: array containing `"CCS-FL-01"` when `dyeNamed` is true and P = 1 exactly (decimal comparison); else empty |
| Rounding | none in the engine; the page shows f as typed by the user (the worked line "1 part + 1 part dye = 2 parts total; factor 2" is page text) |
| Refusals | P `null`: `incomplete` (CCS-RF-01). P < 1, or not a number: `rejected`, code CCS-RF-03, `fields: ["P"]` |
| Version field | yes (section 2) |
| Serves | CCS-DT-01, CCS-IN-06, CCS-FL-01, CCS-RF-01, CCS-RF-03 |
| Note | The FL-01 wording is page text (byte for byte in the URS); the engine returns the code only. Whether the flag condition lives in the engine or the page: Q-ES-03 |

### 3.2 `splitVolumes(Vnew, N)`

| Item | Specification |
|---|---|
| Purpose | Split as a dilution of the cell suspension, "1 part in N parts total": V_tr = V_new / N; fresh medium = V_new - V_tr |
| Inputs | `Vnew`: new vessel total volume, mL. `N`: parts total, dimensionless |
| Output | `{status: "result", Vtr, Vmedium}` unrounded, mL. **No count, concentration or suspension volume is an input**: the split does not use the count |
| Rounding | volumes to 3 significant figures in mL at display (section 6) |
| Refusals | `Vnew` or `N` `null`: `incomplete`. N < 1, N non-numeric, `Vnew` <= 0: `rejected`, CCS-RF-03, `fields` naming each offending input (`Vnew`, `N`). N = 1 is allowed: V_tr = V_new, medium = 0 |
| Version field | yes |
| Serves | CCS-DT-09, CCS-IN-10, CCS-RF-01, CCS-RF-03; fixture F-15 and AT-14 (cited, not valued here) |
| Note | The two lines of CCS-DT-11 and the "uses volumes only" line are page text; the engine does not compute doublings or log2 (CCS-DT-11) |

## 4. E9: counting, viability, totals, seeding

PROVISIONAL placement. NF-01 defines E9 in 0.1.0 as "concentration from counts and square volume, viability from live and dead counts, total cells from concentration x volume, cells remaining after an aliquot", and B1 C-02 puts "counts, viability, total cells, seeding and split arithmetic" in E9. No ID says which module holds the square volume, seeding, or the x 10^4 comparison. Placement below is Atlas's proposal (Q-ES-01).

### 4.1 `squareVolume(A, d)`

| Item | Specification |
|---|---|
| Purpose | V_sq (µL) = A (mm²) x d (mm); 1 mm³ = 1 µL |
| Inputs | `A` mm², `d` mm (chamber preset values are constants of the page's sourced table, CCS-NF-07; the engine receives numbers only) |
| Output | `{status: "result", Vsq}` unrounded, µL. Display: exact decimal (URS section 6, e.g. 0.0125 µL) |
| Refusals | `null`: `incomplete`. A <= 0 or d <= 0 or non-numeric: `rejected`, CCS-RF-03, `fields` naming each offending input (`A`, `d`) |
| Serves | CCS-DT-02, CCS-IN-01, CCS-IN-02, CCS-RF-03 |

### 4.2 `meanPerSquare(live[], dead[])`

| Item | Specification |
|---|---|
| Purpose | n_sq = list length; sums; L_bar = sum L_i / n_sq; D_bar = sum D_i / n_sq, over the squares of one loading |
| Inputs | `live`: array of live counts, `dead`: array of dead counts, same length, each count a whole number >= 0 |
| Output | `{status: "result", nSq, sumLive, sumDead, Lbar, Dbar}` unrounded. **No SD, no %CV across squares** (CCS-DT-03; R-33) |
| Refusals | Empty list (n_sq < 1), a count negative or non-integer, lists of unequal length: `rejected`, CCS-RF-03, with `indices` as in S-3 below (zero-based). A `null` or blank element in `live[]` or `dead[]` is `incomplete` (CCS-RF-01), not CCS-RF-03 (NAD-2026-10-26-30): `missing` names the list(s) and the index is carried in `missingIndices` (S-7). Live sum + dead sum = 0: handled by 4.4 and 4.3 (CCS-RF-06). **S-3 (NAD-2026-10-26-49):** For an empty list or unequal lengths, `fields` names the lists (an empty list is named; for unequal lengths both `live` and `dead` are named) and `indices` is `[]`; `indices` names squares only for element faults (a negative or non-integer count). Where both lists have element faults, `indices` is the union of offending indices, ascending, each once, and `fields` names every list with a fault in argument order (NAD-2026-10-26-50) |
| S-7 | **S-7 (ADC-2026-10-26-36, NAD-2026-10-26-51):** `incomplete` stays a list of field names. When a list element of `live[]` or `dead[]` is `null` or blank, the result is `{status: "incomplete", missing: [list names, argument order], missingIndices: [ascending union of the null or blank positions across the lists named]}`. The union is taken across the lists, not per list (mirrors NAD-2026-10-26-50). `missingIndices` is `[]` for every other case, including a wholly `null` list. `indices` and `missingIndices` are zero-based: the first square is index 0; the page adds 1 when it names a square. The harness mapping is in PROTOCOL |
| Serves | CCS-DT-03, CCS-IN-04, CCS-RF-03 |
| Note | Whether a single square count of 0 is barred: ruled NAD-2026-10-26-08 (Q-C10-17), see URS v0.5 CCS-RF-03 and CCS-RF-06 as amended |

### 4.3 `concentrations(Lbar, Dbar, f, Vsq, sumLive, sumDead)`

| Item | Specification |
|---|---|
| Purpose | C_live = L_bar x f x 1000 / V_sq; C_dead = D_bar x f x 1000 / V_sq; C_total = C_live + C_dead (1 mL = 1000 µL) |
| Inputs | as listed; V_sq in µL; f from 3.1 |
| Output | `{status: "result", Clive, Cdead, Ctotal}` unrounded, cells/mL |
| Rounding | 3 significant figures, in x 10^n form, at display (section 6) |
| Refusals | `sumLive + sumDead = 0`: `rejected`, CCS-RF-06 ("no cells counted"); viability and concentration both refused. Other inputs as 4.1, 3.1 |
| Serves | CCS-DT-04, CCS-RF-06 |
| Ruled | The **dead cells/mL** relation C_dead: ruled NAD-2026-10-26-05 (Q-C10-23), by derivation, see URS v0.5 CCS-DT-04. C_live and C_total: ruled by R-43 in words (wording amended by NAD-2026-10-26-14) |

### 4.4 `viability(sumLive, sumDead)`

| Item | Specification |
|---|---|
| Purpose | Viability (%) = 100 x sumLive / (sumLive + sumDead), from the counts; equal to the ratio of the concentrations because f and V_sq cancel |
| Inputs | `{sumLive, sumDead}`: whole numbers >= 0; not lists (ADC-2026-10-26-09). Summing lists is `meanPerSquare`'s job |
| Output | `{status: "result", viabilityPercent}` unrounded. No CV for viability (CCS-DT-05) |
| Rounding | 1 decimal place, half away from zero (81.25 shows 81.3; URS F-13, cited only) |
| Refusals | `sumLive + sumDead = 0`: `rejected`, CCS-RF-06. Negative or non-integer: CCS-RF-03 |
| Serves | CCS-DT-05, CCS-RF-06, CCS-RF-03 |
| Ruled | Whether a live count or dead count of 0 in a square is barred: ruled NAD-2026-10-26-08 (Q-C10-17), see URS v0.5 CCS-RF-03, CCS-RF-06. The viability label, its method name, and the denominator wording are page text (CCS-IN-13): fixed statements ruled NAD-2026-10-26-07 (Q-C10-16), see URS v0.5 CCS-IN-13 |

### 4.5 `totalCells(Clive, Ctotal, Vsusp, timing, Valiquot)`

| Item | Specification |
|---|---|
| Purpose | live cells in V = C_live x V_susp; all cells = C_total x V_susp; if `timing` = "before": live cells remaining = C_live x (V_susp - V_aliquot) |
| Inputs | `Vsusp` mL; `timing`: "before" or "after" (no default); `Valiquot` mL, required only when "before" |
| Output | `{status: "result", liveCells, allCells, liveRemaining}`; `liveRemaining` is `null` when `timing` is "after" |
| Rounding | 3 significant figures in x 10^n form |
| Refusals | `Clive`, `Ctotal` (both required, ADC-2026-10-26-22), `Vsusp`, `timing` `null`, or `Valiquot` `null` when "before": `incomplete` (CCS-RF-01). `Clive` < 0 (`Clive` = 0 is a result, per URS CCS-RF-07), `Ctotal` <= 0, either malformed, `Vsusp` <= 0 or `Valiquot` <= 0: CCS-RF-03 (decimal-text rule, section 2). `Valiquot` >= `Vsusp` when "before": `rejected`, CCS-RF-04. **S-4 (NAD-2026-10-26-52):** A `timing` value other than "before" or "after" is not declared (`incomplete`, `["timing"]`); it never defaults to either value. With "after", `Valiquot` is not evaluated: no `incomplete`, CCS-RF-03 or CCS-RF-04 from it (a refusal blocks only results that depend on the refused input, URS :169). The `Valiquot` <= 0 and malformed `Valiquot` conditions above therefore apply when "before" only |
| Serves | CCS-DT-06, CCS-IN-08, CCS-FL-04, CCS-RF-01, CCS-RF-03, CCS-RF-04, CCS-UN-03 |

### 4.6 `seedingVolumes(rho, Vfinal, Clive)`

| Item | Specification |
|---|---|
| Purpose | cells needed = rho x V_final; V_seed = cells needed / C_live; V_med = V_final - V_seed; density per mL only |
| Inputs | `rho` cells/mL; `Vfinal` mL; `Clive` cells/mL (live cells, unrounded, from 4.3) |
| Output | `{status: "result", cellsNeeded, Vseed, Vmed, flags}`; `flags` has `"CCS-FL-06"` when V_seed = V_final exactly (V_med = 0; computed, not refused). The FL-06 condition (V_seed = V_final) is compared exactly, as in 4.7, never on a rounded or binary-float value. Because V_final > 0, it is equivalent to rho = C_live. C_live can be a non-terminating decimal (for example, a live sum not divisible by n_sq), so the comparison uses exact rationals or this equivalent form (NAD-2026-10-26-26) |
| Rounding | volumes 3 significant figures in mL (0.0125 mL shows 0.0125, not 0.01; URS F-14, cited only). **S-2 (NAD-2026-10-26-42 (a)):** `cellsNeeded` displays as `sci3` |
| Refusals | `rho` or `Vfinal` `null`: `incomplete`. `rho` <= 0, `Vfinal` <= 0: CCS-RF-03. **S-6 (NAD-2026-10-26-57):** `Clive` null: `incomplete`. `Clive` < 0 or malformed: CCS-RF-03, `fields: ["Clive"]`. (`Clive` = 0 stays CCS-RF-07, below.) V_seed > V_final: `rejected`, CCS-RF-05 (the CCS-RF-05 condition, V_seed > V_final, is compared exactly, never on a rounded or binary-float value; because V_final > 0 it is equivalent to rho > C_live, by exact rationals or this equivalent form; NAD-2026-10-26-26), returning `Vseed` and `Vfinal` and `Clive` for the page's ruled wording. No minimum pipetting-volume threshold (CCS-RF-05) |
| Serves | CCS-DT-08, CCS-IN-09, CCS-FL-06, CCS-RF-01, CCS-RF-03, CCS-RF-05 |
| Status | Seeding relation ruled (NAD-2026-10-26-06). The per-cm² path (target density per cm² x vessel area) is **not** in this function: per-area seeding is in 1.1 (NAD-2026-10-26-01); a call with a per-area input is out of scope (CCS-IN-14, CCS-IN-16) |
| CCS-RF-07 | `Clive` = 0: returns status `rejected`, code CCS-RF-07 (NAD-2026-10-26-02); no division is performed. `Clive` = 0 gives CCS-RF-07 at this function, always. CCS-RF-06 is never returned by `seedingVolumes`; when both sums are 0 the chained call stops earlier at `concentrations` (CCS-RF-06), so `seedingVolumes` is not reached (ADC-2026-10-26-17) |

### 4.7 `x10Comparison(Vsq)`

| Item | Specification |
|---|---|
| Purpose | Data for the teaching line: r = V_sq / 0.1 µL; direction and k. The engine always computes from volume; it has no "x 10^4" option or multiplier |
| Inputs | `Vsq` µL (from 4.1) |
| Output | `{status: "result", r, direction, k, near}`. `near` (boolean) is true when V_sq ≠ 0.1 µL (compared in decimal) and k shows as "1" after the `sig3trim` rounding. Equivalently, compared exactly: when r > 1 ("high"), k = r < 1.005; when r < 1 ("low"), 1.005 × r > 1 (use this form because 1/r need not terminate). `near` is false when the direction is "same". The page shows the URS DT-10 "less than 0.5 % <low\|high>" sentence when `near` is true. DT-10's own wording: "k = 1.005 shows 1.01" (NAD-2026-10-26-25; URS DT-10, F-03 (h), (j)). `direction` = "same" when V_sq = 0.1 µL exactly, compared in decimal (URS DT-10; NAD-2026-10-26-17) (k = 1); "high" with k = r when r > 1; "low" with k = 1/r when r < 1. k unrounded; display 3 significant figures, trailing zeros dropped (section 6) |
| Refusals | V_sq <= 0: CCS-RF-03 (as 4.1). No refusal exists for a "wrong" x 10^4 (CCS-RF-02 is a teaching line) |
| Serves | CCS-DT-10, CCS-RF-02, CCS-OU-03 (item 1), CCS-OU-12 |
| Note | The sentence text is page text with Marque's tone allowed (numbers and the direction word fixed). Module placement: Q-ES-01 |

## 5. E7: counting CV (the Poisson counting error only)

### 5.1 `poissonCV(sumLive, sumDead)`

| Item | Specification |
|---|---|
| Purpose | CV (%) = 100 / sqrt(N), N = sum of the live counts across all squares of the loading. One CV, attached to live cells/mL. Not per square, not live + dead |
| Inputs | `{sumLive, sumDead}`, both required (ADC-2026-10-26-17); null or blank is `incomplete`. `sumLive`: N, whole number. 0 is accepted and then refused (CCS-RF-07 or CCS-RF-06, per the condition in Refusals); negative or non-integer (either sum) is CCS-RF-03 (NAD-2026-10-26-02) |
| Output | `{status: "result", cvPercent}` unrounded |
| Rounding | 2 decimal places, half away from zero (URS F-04 values 14.14, 10.00, 7.07, 5.00; F-01 5.27; F-09 7.91, cited only) |
| Refusals | `sumLive` negative or non-integer: CCS-RF-03. `sumLive` = 0 with `sumDead` > 0: `rejected`, CCS-RF-07 (NAD-2026-10-26-02). When both are 0, CCS-RF-06 ("no cells counted"; URS section 5 table; ADC-2026-10-26-17) |
| Version field | yes |
| Serves | CCS-DT-07, CCS-FL-05 |
| Status | The relation is ruled (NAD-2026-10-26-04). R-48 rules N and the label. The FL-05 label wording ("if cell positions are random (Poisson)...") is page text. The engine must not return a published-rule claim. No count window, no accept/reject threshold exists in E7 (CCS-IN-16; R-37) |

## 6. Display functions (one implementation, so the page cannot differ)

PROVISIONAL placement in the engine package (Q-ES-01): CCS-NF-03 requires every displayed value to equal the decimal-exact value rounded half away from zero, so the rounding is easier to verify once than twice.

Six named modes (ADC-2026-10-26-10; URS section 6; CCS-DT-10): `sci3`, `sig3`, `sig3trim`, `fixed1`, `fixed2`, `exact`. Input `value` is decimal text; rounding is half away from zero on the decimal-exact value, once.

| Function | Rule | Traces to |
|---|---|---|
| `sci3` | Concentrations and cell totals: 3 significant figures, always the × 10^n form, including exponent 0 (`9.00 × 10^0`); carry gives `9.995e6 -> 1.00 × 10^7`. Multiplication sign U+00D7 with one U+0020 each side, then `10^`, exponent in plain ASCII, negative exponent with U+002D (`2.00 × 10^-3`); no superscript characters, no thousands separators, no unit in the engine string (the page appends units) | URS section 6 |
| `sig3` | Volumes: 3 significant figures, plain digits, trailing zeros kept (`8.00`, `0.0125`, `1.11`); no exponent form | URS section 6 |
| `sig3trim` | Fold factor k: 3 significant figures, trailing zeros dropped (`25`, `1.5`, `1.39`) | CCS-DT-10 |
| `fixed1`, `fixed2` | Viability one decimal (`90.0`); CV two decimals (`5.27`, `10.00`) | URS section 6 |
| `exact` | Square volume: exact decimal, minimal (`0.0125`, `0.1`) | URS section 6; CCS-DT-02 |
| Exact zero | engine string `0` for the significant-figure modes; viability `0.0`. CV has no zero string: CV = 100/sqrt(N) is above 0 for N >= 1; N = 0 is refused by CCS-RF-07 or CCS-RF-06. Fold factor and square volume have no zero (V_sq <= 0 is CCS-RF-03). A displayed zero is always +0; a minus sign on a zero is a defect (class X). Exact-zero cases: `splitVolumes` N = 1 (V_med `0`, not `0.00`); CCS-RF-07 case viability `0.0` | ADC-2026-10-26-10; NAD-2026-10-26-19 |
| Carry | Rounding is done once on the decimal-exact value, then the exponent or mantissa is normalised. Carry: `sci3` 9.995e6 -> `1.00 × 10^7`; `sig3` 9.995 -> `10.0`, 0.09995 -> `0.100`; `sig3trim` 9.995 -> `10`; `fixed1` 99.95 -> `100.0`; `fixed2` 9.995 -> `10.00`. Just below the tie (9.99499...e6) -> `9.99 × 10^6`. Rules; the fixture author derives the values | NAD-2026-10-26-20 |
| Carried value | JSON: unrounded value and display string; CSV: both columns; notebook text: display value plus the one rounding statement ("values rounded for display only; calculations use full precision") | URS section 6; CCS-OU-05 |

## 7. Engine version and evidence statements (what the engine supplies to exports)

| Item | Engine supplies | Page / other supplies | Traces to |
|---|---|---|---|
| Engine version | `engine` object of section 2 on every result; a `version()` function returning the package version and the module version lines | C10 copies it into every export; the statement that results from different versions are not comparable (CCS-OU-10) | CCS-OU-05, -08, -10, README rule 2 |
| JSON schema | none in 1.0. The JSON carries the engine version field only; the schema is 1.1 | | CCS-OU-05, CCS-OU-08 (COO answer) |
| Independent-verification statement | none | wording is Adacs's C8 release wording, reviewed by Vera (Q-C10-26) | CCS-OU-08 |
| "Read the code" link | none | page links the public source and the exact engine version | CCS-OU-03 |

## 8. Requirement-ID traceability (function to URS IDs)

| Function | URS requirement IDs |
|---|---|
| `strengthFactor` (E10) | CCS-DT-01, CCS-IN-06, CCS-FL-01, CCS-RF-01, CCS-RF-03 |
| `splitVolumes` (E10) | CCS-DT-09, CCS-IN-10, CCS-DT-11 (negative: no doublings), CCS-RF-01, CCS-RF-03 |
| `squareVolume` (E9) | CCS-DT-02, CCS-IN-01, CCS-IN-02, CCS-RF-03 |
| `meanPerSquare` (E9) | CCS-DT-03, CCS-IN-04, CCS-RF-03 |
| `concentrations` (E9) | CCS-DT-04, CCS-RF-06 (Q-C10-23 ruled NAD-2026-10-26-05) |
| `viability` (E9) | CCS-DT-05, CCS-RF-06, CCS-RF-03 (Q-C10-17 ruled NAD-2026-10-26-08; Q-C10-16 ruled NAD-2026-10-26-07) |
| `totalCells` (E9) | CCS-DT-06, CCS-IN-08, CCS-FL-04, CCS-RF-01, CCS-RF-03, CCS-RF-04 |
| `seedingVolumes` (E9) | CCS-DT-08, CCS-IN-09, CCS-FL-06, CCS-RF-05, CCS-RF-03 (Q-C10-24 ruled NAD-2026-10-26-06; Q-C10-25 per-cm² stays out of 1.0, NAD-2026-10-26-01) |
| `x10Comparison` (E9, provisional) | CCS-DT-10, CCS-RF-03 |
| `poissonCV` (E7) | CCS-DT-07, CCS-FL-05 (Q-C10-22 ruled NAD-2026-10-26-04) |
| display functions | CCS-NF-03, URS section 6 |
| engine version field (all) | CCS-OU-05, CCS-OU-08, CCS-OU-10, CCS-NF-01 |
| whole package | CCS-NF-01, CCS-NF-02, CCS-NF-03 |

Page-only, deliberately not in the engine: IN-03, IN-05, IN-07, IN-11, IN-12, IN-13, IN-15 (declarations and records); FL-02 (time flag: page compares two typed times; engine placement Q-ES-03); OU-*, ST-*, UN-02 parsing (Q-ES-05).

## 9. Open items and questions (for the URS owner, Kaito, Adacs, NADIRA)

Atlas has resolved no scientific question. IDs Q-ES-nn are new in this file (not in `questions.md`, which Atlas does not edit).

| ID | Owner | Question |
|---|---|---|
| Q-ES-01 | URS owner (A.B. for product, Kaito for package) | No ID places `squareVolume` (DT-02), `seedingVolumes` (DT-08), `x10Comparison` (DT-10) or the display functions in a module. NF-01 limits E9 0.1.0 to four capabilities; B1 C-02 adds seeding and split. Confirm the provisional placement in 4.1, 4.6, 4.7 and 6, or amend NF-01 |
| Q-ES-02 | Kaito | bench-engines README lists E4 among the first modules; URS v0.5 defers E4 to 1.1. Confirm 0.1.0 ships no E4 (this draft assumes none) |
| Q-ES-03 | URS owner | Do FL-01 (dye named, P = 1) and FL-02 (time greater than own limit) conditions live in the engine (current draft: FL-01 yes, FL-02 no) or both on the page? |
| Q-ES-04 | CLOSED | Closed by NAD-2026-10-26-16 (dependency table, URS section 5). |
| Q-ES-05 | URS owner, Adacs. Engine side answered ADC-2026-10-26-07; suffix and spelling list remains A.B.'s (Q-C10-28) | UN-02 accepts values typed with a unit suffix or in scientific notation (2e5, 2x10^5) but does not list the suffixes or the accepted "x10^" spellings, nor whether the engine or the page parses. Needed for the PROTOCOL input grammar |
| Q-ES-06 | CLOSED | Answered ADC-2026-10-26-08 (section 2, Order of statuses) |
| Q-ES-07 | CLOSED | Closed by CCS-RF-07 and NAD-2026-10-26-02 (live sum 0 with dead sum > 0; fixture F-18), with NAD-2026-10-26-17 for the exact-decimal "same" test in 4.7. |
| Q-C10-16, -17 | CLOSED | Ruled: NAD-2026-10-26-07 (declaration strings) and NAD-2026-10-26-02 (zero counts; CCS-RF-07). |
| Q-C10-22, -23, -24 | CLOSED | Ruled: NAD-2026-10-26-04 (Poisson CV), -05 (dead cells/mL), -06 (seeding). |
| Q-C10-25 | CLOSED | Ruled: NAD-2026-10-26-01 (per-cm² seeding in 1.1; restoring it in 1.0 is A.B.'s decision). |
| Q-C10-05 residual | CLOSED | Answered ADC-2026-10-26-06 (`protocol-bench-engines-draft.md` section 5) |
| Q-C10-26 | Adacs, Vera | Verification statement wording |

PARTIAL: none in this file. Sections 4.3, 4.4, 4.6 and 5.1 are written but follow the rulings NAD-2026-10-26-01, -04, -05, -06, -07, -08 and URS v0.5 (CCS-RF-07, F-18 for a live sum of 0).

## 10. Change log

| Date | Ticket | Change | Rulings |
|---|---|---|---|
| 2026-10-26 | T-0041 | S-1: derived-refusal field lists (section 2, new row) | NAD-2026-10-26-40, -43, -44 |
| 2026-10-26 | T-0041 | S-2: `cellsNeeded` displays as `sci3` (4.6 Rounding) | NAD-2026-10-26-42 (a) |
| 2026-10-26 | T-0041 | S-3: empty or unequal lists, fields and `indices: []` (4.2 Refusals) | NAD-2026-10-26-49 (index union: -50) |
| 2026-10-26 | T-0041 | S-4: unrecognised `timing`; `Valiquot` not evaluated with "after" (4.5 Refusals) | NAD-2026-10-26-52 |
| 2026-10-26 | T-0041 | S-5: `incomplete` limited to required inputs; `dyeNamed: null` (section 2, Missing declarations) | NAD-2026-10-26-53 |
| 2026-10-26 | T-0041 | S-6: `Clive` null / < 0 / malformed at `seedingVolumes` (4.6 Refusals) | NAD-2026-10-26-57 |
| 2026-10-26 | T-0041 | S-7: `incomplete` for a null or blank list element carries `missing` (list names) and `missingIndices` (zero-based, union); zero-based rule for `indices` (section 2 Refusal and Missing declarations rows; 4.2 Refusals and S-7 row) | ADC-2026-10-26-36; NAD-2026-10-26-51 |
| 2026-10-26 | T-0041 | Header status line updated (signed NAD-27, re-signed NAD-32; S-1 to S-7 await re-signature; builder's base stays `9f7ec4f4`) | NAD-2026-10-26-27, -32 |
| 2026-10-26 | T-0006 | Edit after NAD-2026-10-26-85: S-7 placed and "pending" wording removed (4.2 row, orphan row in section 9, this log); `incomplete` sentences at section 2 and 4.2 corrected; 4.2 CCS-RF-03 `indices`; vocabulary (`rejected` result, `fields`), full `CCS-RF-nn` IDs, section 6 table repaired (six-modes sentence moved above the table) | NAD-2026-10-26-85; ADC-2026-10-26-36 |
