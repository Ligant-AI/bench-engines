# bench-engines E10: recipe scaling and activity conversion, engine specification (T-0637, Atlas) DRAFT r3

**Status:** r3.1 for Nadira. Unsigned. Requirement IDs freeze when she signs. Atlas has resolved no scientific question and made no product decision. No PROVISIONAL marker remains in the requirements: every question of sections 12 and 13 that r3 carries is ruled (NAD-2026-11-14-248 to -256 and -265 to -272) or settled (Q-E10R-A3, A8); the overage questions (N1, A6, A7) are not carried. The word PROVISIONAL appears only in the Marking line and in change-log rows that describe r2 or record its removal (and "provisional" in the title of section 7 means only that IDs are not frozen before signature).
**Revision (r3.1):** r3.1, derived from r3, `engine-spec-e10-scaling-activity-DRAFT-r3.md`, sha256 `dcaa7fcef0f4232984030aa55c28bdcf1af951b79c98008bc2c67dc2c4694f6c` (465 lines, not edited); and Nadira's record `nadira/2026-11-15-t0638-e10-scaling-activity-r3-signature.md`, sha256 `2f8f2f9d5fb987bbafcb3d557f8bc9a36acdf2e9e37901612285c30e763e8585` (NAD-2026-11-14-281; changes R1 to R7, and nothing else).
**Revision:** DRAFT r3, derived from r2, `engine-spec-e10-scaling-activity-DRAFT-r2.md`, sha256 `ad627b72b61cef158d09094cea0ac1c750ab9d326d7f689d03f4ffbd92be45e6` (402 lines, not edited); and Nadira's record `nadira/2026-11-15-t0637-e10-scaling-activity-r2-check.md`, sha256 `a3495f884260cdf9cd9832dac38c2832be78200fa36aeff873c480048bb8b7ac` (rulings NAD-2026-11-14-265 to -273; changes C1 to C11 of -273, and nothing else).
**Derived from (r2):** the original draft `engine-spec-e10-scaling-overage-DRAFT.md`, sha256 `7e139e0b86568b2ce073ebbd245ffc4e5292c33528128e69f54293b29c115a9b` (257 lines, not edited); and Nadira's rulings NAD-2026-11-14-248 to -256, `nadira/2026-11-15-t0636-e10-scaling-activity-rulings.md`, sha256 `890f92599ac06dc68c0bd1d18d32be854f7cad8e3bd2011db04706e10d0c40ba`.
**Split:** this file is the scaling and activity spec, for page 1.2 (KAITO-D174). The overage half stays in the original draft, for T-0484 and page 1.3 (KAITO-D170): E10R-F17, Q-E10R-N1, Q-E10R-A6 and A7, AT-E10R-15 and E10R-NF-07 are **not carried here**, and their numbers are reserved (never reused). They stay in the original draft on T-0484.
**Location:** `.claude/reports/atlas/engine-spec-e10-scaling-activity-DRAFT-r3.md`. Intended destination after signature: `bench-engines/docs/`.
**Builds on:** `engine-spec-e10-conversions.move-ready.md` (signed NAD-2026-11-09-26) and its errata ERR-1, ERR-2, ERR-3. Conventions it sets are carried by reference: its section 2 (decimal text, `exact: {num, den}`, order of statuses, `toUnit`), the closed unit table of its section 3, E10C-NF-02 to -07. Line numbers below are of that move-ready file and of `bench-engines/docs/engine-spec-0.1.0.md`.
**Sources read for this revision:** the original draft; the rulings file; the conversions spec (sections 2 and 3, the function list, E10C-NF-02 to -07, E10C-F03 to -F05, -F12, the AT-E10C regression grep); ERR-1 to ERR-3 (headers); `engine-spec-0.1.0.md` sections 3.1, 3.2 and 6. Checkout: branch `c11/preconditions`, HEAD `1b42bfe`. No fixture, verification, reimpl, snapshot or runs path was read. Master-list references are given as ML1 (the first master list and roadmap, `.claude/reports/nadira/2026-10-24-master-tool-list-and-roadmap.md`) and ML2 (the version 2 master list, `~/.claude/ligant-hq/nadira/reports/2026-11-14-master-tool-list-v2.md`).
**Marking:** none in r3. In r2, PROVISIONAL marked a choice Atlas made where the sources and rulings gave no rule; each is now ruled (sections 12 and 13).
**Checking:** every value in section 10 was derived by hand, working shown. No script verified them (a command guard refused the check; reported to Kaito). Examples 22 to 26 and the Example 21 table were derived by hand in r3 from the exact relations; they agree with the values in Nadira's record (9 g, 1.1915 g, 5 mL, 0.5 mL, and the rounding table). The fixture author derives independently.

## Change log (r2)

### A. Changes that apply a ruling (each cites its NAD id)

| # | NAD id | Where (original line) | Change |
|---|---|---|---|
| 1 | NAD-2026-11-14-248 | E10R-F15 (:98), AT-E10R-08 (:198), Q-E10R-N2 (:213) | "PROVISIONAL, Q-E10R-N2" removed; parts total exactly equal to the total is a result `0`, status `result`. Page words recorded in section 14. N2 shown as RULED |
| 2 | NAD-2026-11-14-249 | Section 1 (:17), E10R-F15 (:91-99), section 8 (:148), Example 6 (:179), Q-E10R-N3 (:214) | Function renamed `balanceVolume`; purpose rewritten as an additive balance of pipetted liquids, with the stated assumption. The words "make up", "final volume" and "diluent to add" are gone from its name, purpose and sections 1 and 8 (this log row and row 3 quote them). 1.2's make-up-to-volume route never calls it. Atlas's choices under 249(3): the name `balanceVolume`, the argument `Vtotal` for the stated total |
| 3 | NAD-2026-11-14-249 (4) | Section 7 Flags row (:134), result shape | Every F15 result carries `assumes: "additive volumes"`; "The engine raises no flag" amended: a stated assumption in the result is not a flag, and it is required. New requirement E10R-OU-02. Pages print "if volumes add" (section 14) |
| 4 | NAD-2026-11-14-249 (5) | E10-RC-03 (:47) | Refusal carries `partsTotal` and `statedTotal`, both exact. Message says "total", not "final volume". Component naming not required |
| 5 | NAD-2026-11-14-249 (6) | Example 6 (:179) | Restated as a pipetted balance (5 mL and 500 uL, 50 mL total if volumes add: 44.5 mL). The refusal case now shows both totals |
| 6 | NAD-2026-11-14-249 Conditions | Acceptance tests | AT rows added: the 1.2 make-up-to route makes no F15 call and prints no "water to add" (AT-E10R-19); an F15 result missing the assumption field fails (AT-E10R-18) |
| 7 | NAD-2026-11-14-250 (a),(b) | E10R-F16 (:101-110), Examples 7 and 8 | w/v and v/v confirmed. Example 7 and 8 stand; their call form gains the required `reference` argument (row 9) |
| 8 | NAD-2026-11-14-250 (c) | Section 1 (:18), E10R-F16 "Not offered" row (:109), E10R-DT-04 (:131), register (:158) | The "Not offered: w/w" row is removed. w/w is offered on a declared total mass of solution; inputs, solute and solvent masses, no density. A volume for the mass or for `toUnit` under w/w is E10-RC-02. New Example 9 |
| 9 | NAD-2026-11-14-251 | E10R-F16 | New closed argument `reference` (no default): `"final"` mode 1, `"added"` mode 2, `"reach"` mode 3, for v/v; w/v and w/w take only `"final"`, any other `reference` with them is E10-RC-02 naming `reference`. Mode 2 and 3 results carry the final volume, mode 2 the percent of final, and the assumption field. New Examples 10 and 11 |
| 10 | NAD-2026-11-14-250 (d) | E10R-F16 refusals (:108) | Bounds per case: w/v pct >= 0 no upper bound; v/v "final" and w/w 0 <= pct <= 100; v/v "added" pct >= 0; v/v "reach" 0 <= pct < 100; pct = 0 is `0` in every case; the basis has no default |
| 11 | NAD-2026-11-14-250 | AT-E10R-05 (:195) | `"w/w"` is now valid. `"W/V"` and an unknown string `"m/v"` are the E10-RC-01 cases |
| 12 | NAD-2026-11-14-252 (1) | Section 8 (:148) | "activity conversions (outside this spec)" removed. The engine also holds the -623 modes, w/w, the additive balance and the activity relations |
| 13 | NAD-2026-11-14-252 (2) | E10R-NF-02 (:36) | "No new display mode" amended for one function: `roundDeclared` (E10R-F19), rounding of `exact` under a user-declared rule. Never applied to the JS `value` |
| 14 | NAD-2026-11-14-252 (3) | New E10R-F18 | X-fold concentrate volume `concentrateVolume`, V_concentrate = V_final / fold. Neither `strengthFactor` nor `splitVolumes` (0.1.0 sections 3.1, 3.2) is reused: `splitVolumes` computes the same quotient but in mL only, with no `toUnit` and no `exact` (Q-E10R-N14). New Example 13 |
| 15 | NAD-2026-11-14-253 | E10R-F14 Boundary row (:88) | Rewritten: `molarToMass` (a product, terminating) passed on as exact plain decimal text, then `volumeFromAmount` with the mass pair. The `massToMoles` route is removed. New Example 12 (call 1 uses `mg/mL`, a table unit; Nadira's "500 mg/L" is the same value but `mg/L` is not a table unit) |
| 16 | NAD-2026-11-14-254 (1)-(5) | Section 1 (:22), section 3 (:54), E10R-UN-01, new functions | IU and U activity conversions are in scope. Six unit dimensions added; two functions `activityToMass` (E10R-F20) and `massToActivity` (E10R-F21); the specific activity (SA) as a single value, a one-sided bound or an interval; bound direction flips from activity to mass and is kept from mass to activity, strictness carried; bounded result has `lower` and `upper` and no top-level `value` or `exact`; IU and U never meet (E10-RC-02); no mass without a declared SA; refusals as ruled. Examples 15 to 20 |
| 17 | NAD-2026-11-14-254 (7) | E10R-NF-02 | Display modes: activity amount `sig3`; activity concentration and SA `sci3` |
| 18 | NAD-2026-11-14-254 (6), (8) | Section 14 | Carried to the tool as OI-1.2-5: no "amount to add" under any bounded SA; "U" is opaque; lot, source and CoA identifier, label, wording and X1 display are page and record |
| 19 | NAD-2026-11-14-254 | E10R-F13 (:78) | An activity amount (IU, U) may be a recipe `q` and scales linearly; activity concentrations are excluded like other concentrations. Example 14 |
| 20 | NAD-2026-11-14-255 | E10R-F13 (:78), section 8 | Stays as written (linear only, concentration `q` refused). The four 1.2 line kinds are named in section 8 as tool-level, kind 3 using engine functions (E10R-F18 and the existing stock-to-final dilution). **Corrected in r3 by NAD-2026-11-14-266 (C1):** no stock-to-final dilution function exists in E10 (0.1.0 has only `strengthFactor` and `splitVolumes`; the conversions spec has none); NAD-2026-11-14-255 (3) named one in error. Kind 3 is now computed through the routes (a) to (e) of section 8 and no other |
| 21 | NAD-2026-11-14-256 | Q-E10R-N4(e), kept items | N4(e) closed: 1.2 uses the -623 mode labels as ruled, each basis in the words -546(1) names; "volume of solvent added" is never the reference for w/v or w/w. Items Nadira confirmed right are unchanged: F13 formula, refusals and Examples 1 to 3; F14 and Examples 4 and 5; concentration `q` refused; zero amount a result; w/v "final" and Example 7; v/v mode 1 and Example 8; E10R-NF-03; no MW, density or table data |
| 22 | NAD-2026-11-14-248 to -256 | Section 12 | N2 to N8 kept in place, each marked RULED with its id |

### B. Changes not ruled by Nadira (each cites its brief)

| # | Source | Change |
|---|---|---|
| 23 | KAITO-D174, KAITO-D170 | Split. Overage content not carried (header, the original's BLOCKED paragraph, E10R-F17, E10R-DT-05, E10R-NF-06, E10R-NF-07, the N_eff register row, AT-E10R-15, AT-E10R-16, Q-E10R-N1, Q-E10R-A6, A7, OI-1.3-1, the overage sentences in sections 1 and 8, section 16 guard text). E10-RC-04 stays reserved for the overage module. Sections 1 and 8 keep the 1.3, X5, X7 and E13 lines only as far as they concern scaling |
| 24 | KAITO-D172 | Q-E10R-A3 settled: additive minor bump for the E10 module and the package; the number is set at build against main. E10R-NF-05 and AT-E10R-12 say so. Not reopened |
| 25 | KAITO-D171 | Q-E10R-A8 settled: IU and U activity conversions are in 1.2 scope. Not reopened |
| 26 | Brief (T-0637) | Q-E10R-A1, A2, A4, A5: a proposed answer for each, marked "PROPOSED, for Nadira's ruling" (section 13). PROVISIONAL markers that depend on them stay and point at the proposal (r2; ruled in r3, row 35) |
| 27 | Brief (T-0637) | No dates: the original's header date, source dates and the dated change-log row removed; master-list lines cited through the aliases ML1 and ML2. IDs and file names that contain a date are identifiers and are kept (completed in r3, row 39) |
| 28 | Consequences of rows 8 to 14, 16 | New requirement IDs, all after the reserved overage numbers: F18 to F21, E10R-DT-06 to -09, E10R-OU-02 and -03, E10R-RF-06, E10R-NF-08, AT-E10R-17 and on, Examples 9 to 21, Q-E10R-N9 to N16, OI-1.2-2 to -5. New PROVISIONAL choices are marked and asked, none resolved (r2; all ruled in r3, row 35) |

## Change log (r3)

Every row applies one change of NAD-2026-11-14-273, named by its C number, and cites the ruling that gives its text. Edits that follow mechanically from a row (a function number in a list, a range of examples) are named in that row. Rows 29 to 39 are the closed list C1 to C11; row 40 is the header.

| # | C | NAD id | Where (r2 line) | Change |
|---|---|---|---|---|
| 29 | C1 | NAD-2026-11-14-266 | Section 8 kind (3) (:255); row 20 (:37); new Examples 22 to 25; new AT-E10R-31 | Kind (3) now reads: "through the routes of NAD-2026-11-14-266: (a) a solid at a mass-concentration target, E10C-F12; (b) a solid at a molar target, `molarToMass` then E10C-F12; (c) a liquid stock in the same dimension, E10C-F12 then E10R-F14; (d) an activity stock, the -267 function (E10R-F22) then E10R-F14; (e) an X-fold stock, E10R-F18; each passed value a terminating product, passed as exact plain decimal text". The stock-to-final dilution is gone from the text (no such function exists). Row 20 gains the correction. Worked examples for (a) to (d) with the values 9 g, 1.1915 g, 5 mL, 0.5 mL (Examples 22 to 25) and one AT row (AT-E10R-31). Consequential: the "One example per function" line, AT-E10R-01's range of examples |
| 30 | C2 | NAD-2026-11-14-267 | E10R-F14 Purpose, Inputs, Refusals (:143-146); new E10R-F22; new E10R-DT-10; Examples 25, 26; AT-E10R-13 (:336); new AT-E10R-32; section 1 (:63); Q-E10R-N15 (:373) | E10R-F14 gains the pairs `IU` with `IU/mL` and `U` with `U/mL`; a cross-family pair is E10-RC-02. New function `activityAmountFromConcentration` as **E10R-F22** (next free number after F21; F17 stays reserved) with its DT (E10R-DT-10), Examples (25 call 1, 26) and AT row (AT-E10R-32). Section 1 lists it. AT-E10R-13 states that E10C-F12 now refuses activity units with E10-RC-02 instead of E10-RC-01. Q-E10R-N15 RULED. Consequential: the numbering sentence of section 6 (F18 to F22), the section 7 DT row and the traceability to AT-E10R-32, the engine list of section 8, the A1 text of section 13, the "One example per function" line, AT-E10R-01's range; the F22 `["cUnit","toUnit"]` fields in the A5 text of section 13; the register rows of section 9 ("Examples 1 to 26" and the illustrative MW of Example 23) |
| 31 | C3 | NAD-2026-11-14-267, -268 | AT-E10R-13 (:336) | Positive within-family checks of `scaleUnit` added: `IU/mg` to `IU/ug` gives 0.001 (exact 1/1000); `U/mL` to `U/mL` gives the identity |
| 32 | C4 | NAD-2026-11-14-268 | E10R-F20 Refusals (:207); AT-E10R-28 (:350); section 2 (:79, :96); A4 (:383); Q-E10R-N12 (:370); section 3 (:100); register (:268) | A wrong-way interval relation is E10-RC-02 `["SA.lower.relation"]` or `["SA.upper.relation"]` at step 2, not CCS-RF-03. An unknown relation is E10-RC-01 with the same naming. Section 2 and A4 use the nested member names. Q-E10R-N12 and the markers of section 3 and the register become RULED. Consequential: E10R-RF-02's list in section 7 names the wrong-way relation |
| 33 | C5 | NAD-2026-11-14-269 | E10R-F20 (:207), E10R-F21 (:218), E10R-OU-03 (:246), AT-E10R-02 (:325), AT-E10R-25 (:347); new AT-E10R-30; Q-E10R-N10 (:368) | A zero activity or mass under any valid SA gives the common shape `0`, with no `lower` and no `upper`. The SA is validated first. One AT row added: a zero activity with reversed SA limits is still CCS-RF-03 (AT-E10R-30). Q-E10R-N10 RULED |
| 34 | C6 | NAD-2026-11-14-271 | E10R-F19 (:193, :194, :196); Example 21 (:317); AT-E10R-23 (:345); Q-E10R-N13 (:371) | Input contract: a JS number refused (CCS-RF-03 `["value"]`); `places` digits-only text (`"2.0"`, `"-1"`, `"abc"`, a JS number are CCS-RF-03 `["places"]`); negative values refused; `"-0"` and 0/1 give zero; the output form at `places` 0 (placed in the Relation row, :194). Example 21: the last two sentences replaced by the -271 table with its "Catches" column; the heading cites -271 and a "Working:" paragraph shows my hand derivation of each table row; the section 9 rounding row cites -271. AT-E10R-23: rows replaced by the table; "a binary build gives 2.67 for 2.675" and "Atlas did not check ..." deleted. Q-E10R-N13: (b) corrected, RULED |
| 35 | C7 | NAD-2026-11-14-270, -272 | Section 12 (:367-374); section 13 (:380-384); every marker | Q-E10R-N9, N11, N14 and N16 RULED with -270; A1, A2, A4 and A5 RULED with -272; N10, N12, N13 and N15 RULED with -269, -268, -271 and -267 (rows 30, 32, 33, 34). Every PROVISIONAL marker that pointed at them is removed: r2 :79, :81, :93, :96, :100, :125, :137 (a "proposed in" pointer), :146, :168, :170, :196, :207, :268, :325, :327, :350, and in addition :9 (marking line), :3, :371 and :293 (a pointer to N16). Header :3 and :9 now say none remains. Rows 26 and 28 keep r2's words as history, with a parenthetical pointing to this row. Consequential wording: the F18 Note carries "(Q-E10R-N14, ruled)"; the section 13 column header reads "Status and answer"; the A2 text adds the wrong-way `relation` and -268 (with row 32); the section 12 rows N9 to N16 and N15 read as rulings |
| 36 | C8 | NAD-2026-11-14-270 (N11) | E10R-NF-02 (:81) | Reads "`percentOfFinal` displays `sig3`; the page labels it '% (v/v) of the final volume, if volumes add'" in place of the marked sentence |
| 37 | C9 | NAD-2026-11-14-270 (N14) | E10R-F18 Purpose (:181) | Adds: "`fold` is 1 part concentrate in `fold` parts total, the convention of 0.1.0 section 3.1 and OI-3.8-2" |
| 38 | C10 | NAD-2026-11-14-268 (OI-1.2-7); NAD-2026-11-14-273 (OI-1.2-8) | Section 14 | Added OI-1.2-7 (per-uL activity stocks; tokens only additively, returned to Nadira) and OI-1.2-8 (the "exact result" wording of OI-1.2-3 when the exact result does not terminate; not an engine change) |
| 39 | C11 | NAD-2026-11-14-265 (row 27 incomplete); NAD-2026-11-14-273 | Header (:8) | ML1 is now described as "the first master list and roadmap"; the month-named description is gone. No other date word was added |
| 40 | Header | NAD-2026-11-14-273; brief T-0637 | Title, status, Location, Checking, Provenance | DRAFT r3; derived from r2 sha and Nadira's record sha (new Revision line); the original-draft line is kept as "Derived from (r2)"; Location and Provenance name r3; Checking notes the hand derivation of the new values |

## Change log (r3.1)

Every row applies one item of NAD-2026-11-14-281 (Nadira's record `nadira/2026-11-15-t0638-e10-scaling-activity-r3-signature.md`), named by its R number, and cites the ruling that gives its text. "Where (r3 line)" gives the line of r3 (sha256 `dcaa7fce...94f6c`). Nothing else changed.

| # | R | NAD id | Where (r3 line) | Change |
|---|---|---|---|---|
| 41 | R1 | NAD-2026-11-14-277 (in NAD-2026-11-14-281) | E10R-F22 Refusals (:251) | "`c` <= 0 or non-numeric: CCS-RF-03 `["c"]`." becomes "`c` < 0 or non-numeric: CCS-RF-03 `["c"]`. `c` = 0 is a result, `0`, status `result`; the text `"-0"` is zero, never negative zero (as E10C-F12; NAD-2026-11-09-01; NAD-2026-11-14-277)." The `V` sentence is unchanged |
| 42 | R2 | NAD-2026-11-14-277 (in NAD-2026-11-14-281) | AT-E10R-32 (:411) | Test column: "E10R-F22 with `V` as `"0"` and with `c` as `"0"`" becomes "E10R-F22 with `V` as `"0"`; with `c` as `"0"` and as `"-0"`; with `c` as `"-1"`". Expected column: "CCS-RF-03 `["V"]` and CCS-RF-03 `["c"]`" becomes "CCS-RF-03 `["V"]`; `0` IU, status `result`, never negative zero, for `c` `"0"` and `"-0"`; CCS-RF-03 `["c"]` for `"-1"`" |
| 43 | R3 | NAD-2026-11-14-277 (in NAD-2026-11-14-281) | AT-E10R-02 (:382) | "Zero amount in E10R-F13, E10R-F14, E10R-F20, E10R-F21;" becomes "Zero amount in E10R-F13, E10R-F14, E10R-F20, E10R-F21; zero `c` in E10R-F22;" |
| 44 | R4 | NAD-2026-11-14-277 (in NAD-2026-11-14-281) | E10R-RF-04 (:275) | "(Vfrom, Vto, Vtotal, Vfinal, B, c, SA)" becomes "(Vfrom, Vto, Vtotal, Vfinal, B, `c` of E10R-F14, SA)" |
| 45 | R5 | NAD-2026-11-14-278 Q1 (in NAD-2026-11-14-281) | E10R-F20 Result (:227); E10R-F21 Result (:238) | F20: after "so a bounded result cannot be printed as one amount by mistake." inserted: "The one exception is a zero `a` under any valid SA, which is the common shape `0` (E10R-OU-03; NAD-2026-11-14-269)." F21: "...with no top-level `value` or `exact`" is followed by "; a zero `m` under any valid SA is the common shape `0` (E10R-OU-03; NAD-2026-11-14-269)" |
| 46 | R6 | NAD-2026-11-14-278 Q6 (in NAD-2026-11-14-281) | New AT-E10R-33 after AT-E10R-32 (:411); traceability (:283) | New row AT-E10R-33, the E10R-F19 input contract of NAD-2026-11-14-271 (`value` as `"-1"`, `{num: "-1", den: "1"}`, `"abc"`; `"-0"` and 0/1 with `places` `"2"` under each rule; bad `places`). Traceability: "E10R-RF-04 to CCS-RF-03 (AT-E10R-09, -10, -17)" becomes "E10R-RF-04 to CCS-RF-03 (AT-E10R-09, -10, -17, -32, -33)" |
| 47 | R7 | NAD-2026-11-14-281 | Header (:3, new Revision line) | Status line says r3.1; new "Revision (r3.1)" line names r3 and its sha256 and Nadira's record and its sha256; this change-log section. The r3 Revision line and the title are not changed |

## 1. Purpose and scope

Pages served: **1.2 Media and Buffer Prep** (recipe with target and actual columns, scaled recipe, percent solutions, activity conversions; ML2 :103, ML1 :97). The engine functions here are also used by X5 (scaling) and X7 (volume from an amount-of-substance content in nmol, molar targets; ML2 :111, :112; ML1 :105). 1.3 and the overage module are specified in the original draft. "1.2", "X5", "X7" always mean the tools. Engine requirements are `E10R-*`.

**In this spec:**
- Recipe scaling to a new final volume (E10R-F13), the arithmetic ML1 assigns to E10 ("recipe scaling lives here, not in E13", ML1 :227 and the E10 row :224).
- Volume from an amount and a concentration (E10R-F14), including X7's molar target from a mass content through two calls.
- The additive balance of pipetted liquids (E10R-F15, `balanceVolume`).
- Percent solution on three bases (w/v, v/v, w/w) and the three reference modes of NAD-2026-10-24-623 (E10R-F16).
- X-fold concentrate volume (E10R-F18).
- Rounding of an exact value under a user-declared rule (E10R-F19).
- Activity conversions, IU and U against mass through a declared specific activity (E10R-F20, E10R-F21), and their units.
- Activity amount from an activity concentration and a volume (E10R-F22), and volume from an activity amount at an activity concentration (the activity pairs of E10R-F14); IU with IU and U with U only (NAD-2026-11-14-267).

**Not in this spec:**
- The overage module and everything gated by it: in the original draft, on T-0484.
- The 1.2 make-up-to-volume route: the page prints "bring to <final volume> with <solvent>" and calls no subtraction (NAD-2026-11-14-249 (1)).
- The tool-level items of section 8.
- Ratio-to-recipe (molar or mass ratios, component order): E13's, which calls E10 (ML1 :227).
- Any molecular-weight, density, specific-activity or table data. None is added. IU and U are never equated (ML1 :224).

## 2. Conventions

Everything in the conversions spec section 2 applies unchanged. Additions:

| ID | Rule |
|---|---|
| E10R-IN-01 | Every numeric input (amount, volume, concentration, percent, specific activity, fold) is plain decimal text per E10C-IN-01. A component list (E10R-F15) is an array of `{value, unit}` pairs, each value plain decimal text. A specific activity (E10R-F20, -F21) is an object (those functions). The page parses; the engine does not |
| E10R-IN-02 | Units are the closed table of the conversions spec section 3 plus the activity units of section 3 here, exact and case-sensitive. Closed strings, each exact and case-sensitive: `basis` (`"w/v"`, `"v/v"`, `"w/w"`), `reference` (`"final"`, `"added"`, `"reach"`), the specific-activity `form` (`"single"`, `"bound"`, `"interval"`), a `relation` (`">"`, `">="`, `"<"`, `"<="`), and the rounding `rule` (`"half-up"`, `"half-even"`). Anything else is E10-RC-01 naming the field, a nested member as `SA.lower.relation` (Q-E10R-A2, ruled NAD-2026-11-14-272) |
| E10R-NF-01 | Additive only: E10C-F03 to E10C-F12, `strengthFactor` and `splitVolumes` are unchanged in behaviour, inputs, outputs and tests, except the engine version fields as the conversions spec and its errata state. One consequence is stated in AT-E10R-13: the tokens `IU`, `U` and the activity units were E10-RC-01 in the conversions spec and become table units |
| E10R-NF-02 | Full precision, `exact: {num, den}`, one unrounded rational chain per call, display through 0.1.0 section 6 with the mode per dimension: mass `sig3`, volume `sig3`, amount `sig3`, concentrations `sci3`; **added by NAD-2026-11-14-254 (7):** activity amount `sig3`, activity concentration `sci3`, specific activity `sci3`. `percentOfFinal` displays `sig3`; the page labels it "% (v/v) of the final volume, if volumes add". The page chooses its display unit through `toUnit`. **Amended by NAD-2026-11-14-252 (2):** one new display function, `roundDeclared` (E10R-F19), for a rounding under a rule the user declares; it is applied to `exact`, never to the JS `value`, and `sig3` and `sci3` are unchanged |
| E10R-NF-03 | The passing rule E10C-NF-07 holds: a value that has passed through a division is never re-entered. Every scaling chain here (a ratio of volumes, an amount divided by a concentration, an activity divided by a specific activity) is one call; terminating results may be passed on only as exact plain decimal text |
| E10R-NF-04 | No dependency, no random numbers, no network, no reference data beyond the prefix factors (E10C-NF-04) |
| E10R-NF-05 | Version: additive minor bump of the E10 module line and of the package; the number is set at build against main (KAITO-D172, settling Q-E10R-A3). Version fields on every result and refusal as E10C-NF-05 |
| E10R-NF-08 | No specific activity value, default or table is held by the engine. Every activity conversion takes the SA as a declared input of the call (NAD-2026-11-14-254 (4); NAD-2026-10-24-548 (3), (4)) |

Reserved, not carried: E10R-NF-06 and E10R-NF-07 (overage).

**Refusal codes.** Continue the module-wide series at `E10-RC-03` (ADC-2026-11-09-06); never renumbered.

| Code | Status | Meaning | `fields` |
|---|---|---|---|
| E10-RC-03 | rejected | The listed parts together exceed the stated total, so no non-negative balance exists (E10R-F15). Message: the parts add up to more than the total. The result also carries `partsTotal` and `statedTotal`, each `{value, unit: toUnit, exact: {num, den}}`, so the page can print "your parts total <x>, more than the <y> you set" (NAD-2026-11-14-249 (5)). Expressed in `toUnit`, both in the same unit (ruled, Q-E10R-N9, NAD-2026-11-14-270) | `["parts"]` |
| E10-RC-04 | reserved | Reserved for the overage module's refusals; stays with the original draft | n/a |

Codes reused: CCS-RF-01 (incomplete) and CCS-RF-03 (rejected) as in E10C; E10-RC-01 and E10-RC-02 as defined there. The order of statuses of the conversions spec section 2 is unchanged and now also covers every closed string above (they rank with the unit arguments at step 2) and the array and object fields (an element failure names the field as `parts[i]`, zero-based, and a member of the specific activity as `SA.<member>`, extended to nested members, for example `SA.lower` and `SA.lower.relation`; ruled, Q-E10R-A4, NAD-2026-11-14-272).

## 3. Units

The closed table of the conversions spec section 3 stands. `%` is not a unit; percent is a numeric argument with a `basis` (E10R-F16). **Added by NAD-2026-11-14-254** (E10R-UN-01), six dimensions, no factor between the IU family and the U family. The closed token list below is ruled (NAD-2026-11-14-268, Q-E10R-N12):

| Dimension (base) | Units and factor to base |
|---|---|
| Activity, IU (IU) | `IU` 1 |
| Activity, U (U) | `U` 1 |
| Activity concentration, IU (IU/L) | `IU/mL` 1e3 |
| Activity concentration, U (U/L) | `U/mL` 1e3 |
| Specific activity, IU (IU/g) | `IU/mg` 1e3; `IU/ug` 1e6 |
| Specific activity, U (U/g) | `U/mg` 1e3; `U/ug` 1e6 |

Atlas's check of the factors: 1 IU/mL = 1 IU / 1e-3 L = 1e3 IU/L. 1 IU/mg = 1 IU / 1e-3 g = 1e3 IU/g. 1 IU/ug = 1 IU / 1e-6 g = 1e6 IU/g. The U rows are identical in form. The bases `IU/L`, `U/L`, `IU/g`, `U/g` are nominal: they are not tokens. No prefix set is applied to `IU` or `U` (`kIU`, `mIU`, `uU`, `unit`, `units`, `IU/L` and every other string are E10-RC-01).

"U" is an opaque unit: it means only what the source of the specific activity defines (NAD-2026-11-14-254 (8)). The engine converts U only through an SA declared in the same call.

## 4. Constants

None. Percent uses the exact divisor 100; w/v uses the exact factor 1000 (g/mL to g/L). No N_A, no MW, no density, no specific-activity value.

## 5. Precision statement

As the conversions spec section 5: exact rational chain; `exact` equality by cross-multiplication; display strings once-rounded from `exact`. Ratios of volumes in E10R-F13, the quotient in E10R-F18 and the activity quotients in E10R-F20 are generally non-terminating (Example 3 is 1000/3; Example 16 is 100/21); what is exact is the rational.

## 6. Functions (continuing E10C-F12)

Every function: `incomplete` on a null required input; version field on every result and refusal; `toUnit` required in the dimension of the result; result `{status: "result", value, unit: toUnit, exact: {num, den}}` (exceptions stated per function). Function numbering F13 to F16 and F18 to F22 and the prefix `E10R` are ruled (Q-E10R-A1, NAD-2026-11-14-272). F17 is reserved for the overage module, which stays in the original draft.

### E10R-F13 `scaleToVolume(q, unit, Vfrom, VfromUnit, Vto, VtoUnit, toUnit)`

| Item | Specification |
|---|---|
| Purpose | A recipe quantity at a source final volume, re-expressed at a target final volume. One call per component |
| Inputs | `q` decimal text; `unit` a mass, volume, amount or **activity amount (`IU`, `U`)** unit (NAD-2026-11-14-254); `Vfrom`, `Vto` decimal text; `VfromUnit`, `VtoUnit` volume units; `toUnit` of the same dimension as `unit` |
| Formula | `value = ((q x f(unit)) x ((Vto x f(VtoUnit)) / (Vfrom x f(VfromUnit)))) / f(toUnit)`, one unrounded chain. The scale factor `Vto / Vfrom` is dimensionless |
| Refusals | Any null: `incomplete`. Unknown unit: E10-RC-01. `unit` a concentration (including `IU/mL`, `U/mL`), a specific activity or a copies unit, `VfromUnit` or `VtoUnit` not a volume unit, `toUnit` not of the dimension of `unit` (so IU to U is refused): E10-RC-02. `Vfrom` <= 0 or `Vto` <= 0 or non-numeric: CCS-RF-03 naming the field (a zero target volume would declare no recipe, so it is refused, as E10C-F12 refuses V = 0). `q` < 0 or non-numeric: CCS-RF-03 `["q"]`. `q` = 0 is a result, `0`; `"-0"` is zero |
| Serves | E10R-DT-01 |

Concentration units are excluded from `q`: a concentration does not scale with the final volume (ruled NAD-2026-11-14-255; the refusal carries a reason message, ruled in Q-E10R-A5's answer). Which recipe line scales is the tool's choice (section 8).

### E10R-F14 `volumeFromAmount(n, nUnit, c, cUnit, toUnit)`

| Item | Specification |
|---|---|
| Purpose | Volume that holds a given amount at a given concentration: V = n / c. X7's nmol mode ("volume from an amount-of-substance content") and molar targets; also volume for a mass in a given mass concentration; and, added by NAD-2026-11-14-267, volume for an activity amount at an activity concentration (`IU` at `IU/mL`, `U` at `U/mL`). No specific activity enters, and none may be passed |
| Inputs | `n` decimal text; `nUnit` an amount unit with `cUnit` a molar-concentration unit, or `nUnit` a mass unit with `cUnit` a mass-concentration unit, or `nUnit` an activity amount unit with `cUnit` the activity-concentration unit of the same family (`IU` with `IU/mL`, `U` with `U/mL`); `toUnit` a volume unit |
| Formula | `value = ((n x f(nUnit)) / (c x f(cUnit))) / f(toUnit)`, one unrounded chain |
| Refusals | Any null: `incomplete`. Unknown unit: E10-RC-01. `nUnit` and `cUnit` not a matching pair (amount with mass concentration, mass with molar concentration, `IU` with `U/mL`, `U` with `IU/mL`, an activity unit with a non-activity unit, anything else), or `toUnit` not a volume unit: E10-RC-02, `fields` naming the units that break the pairing in argument order (ruled, Q-E10R-A5). A cross-family pair is E10-RC-02. `c` <= 0 or non-numeric: CCS-RF-03 `["c"]` (a zero concentration has no volume). `n` < 0 or non-numeric: CCS-RF-03 `["n"]`. `n` = 0 is a result, `0` |
| Boundary (NAD-2026-11-14-253) | The engine never applies a molecular weight to cross from mass to amount (E10C-NF-06). A page that holds a mass and a molar target uses the route that never divides by MW across a call. **Call 1:** `molarToMass(c, cUnit, MW, toUnit)` (E10C-F05, `((c x f) x MW) / f(toUnit)`) with `toUnit` a mass-concentration unit of the table; this is a product of terminating decimals and always terminates, so its result is passed on as exact plain decimal text (E10C-NF-07). **Call 2:** `volumeFromAmount(m, mUnit, <call 1 text>, <its unit>, toUnit)`, the mass pair, with the mass `m` passed as the user typed it. The route through `massToMoles` is not used: it would refuse for most MW (74.55 g/mol, for example), so the tool would work or not depending on the number typed. No new function is needed. Example 12 |
| Serves | E10R-DT-02 |

### E10R-F15 `balanceVolume(Vtotal, Vunit, parts, toUnit)`

Renamed and repurposed by NAD-2026-11-14-249. It is not used by 1.2's make-up-to-volume route, which prints "bring to <final volume> with <solvent>" and shows no subtraction in the page, the working, the Learn text or any export.

| Item | Specification |
|---|---|
| Purpose | The volume of one more liquid that brings pipetted liquid parts to a stated total, **on the assumption that volumes add**. Allowed uses: the balance of a reaction mix, "reaction volume - sum of components - template volume" (NAD-2026-10-24-547 (3)); a liquid pipetted into a measured volume (NAD-2026-10-24-546 (3), last sentence) |
| Inputs | `Vtotal` decimal text (the stated total); `Vunit` a volume unit; `parts` an array of `{value, unit}` with volume units, at least one element; `toUnit` a volume unit |
| Formula | `value = ((Vtotal x f(Vunit)) - sum over i of (value_i x f(unit_i))) / f(toUnit)`, one unrounded chain. Volumes are taken as additive; the result says so in `assumes` (E10R-OU-02) |
| Result | `{status: "result", value, unit: toUnit, exact, assumes: "additive volumes"}`. The field is always present and the page cannot lose it |
| Refusals | Any null, or an empty `parts`: `incomplete`. Unknown unit: E10-RC-01. A non-volume unit in `Vunit`, `parts[i].unit` or `toUnit`: E10-RC-02 (an activity or other unit in a part is therefore E10-RC-02). `Vtotal` <= 0 or non-numeric: CCS-RF-03 `["Vtotal"]`. A part negative or non-numeric: CCS-RF-03 `["parts[i]"]`. Parts total more than `Vtotal`: E10-RC-03 with `partsTotal` and `statedTotal`. Parts total exactly `Vtotal`: **result `0`** (NAD-2026-11-14-248), with `assumes`; the page states "no diluent needed: the parts alone make <total>, if volumes add" |
| Serves | E10R-DT-03, E10R-OU-02 |

### E10R-F16 `percentSolution(pct, basis, reference, B, Bunit, toUnit)`

| Item | Specification |
|---|---|
| Purpose | Solute needed, or volume to add, for a percent solution, for 1.2. `basis` and `reference` are two compelled choices with no default, in the engine or on the page (NAD-2026-11-14-250, -251; NAD-2026-10-24-546 (1), -623) |
| Inputs | `pct` decimal text. `basis` `"w/v"`, `"v/v"` or `"w/w"`. `reference` `"final"` (mode 1, "of the final volume"), `"added"` (mode 2, "for every 100 mL I already have") or `"reach"` (mode 3, "add to reach p% of the final"); the token names are Atlas's, ruled under Q-E10R-A2 (NAD-2026-11-14-272). `B` decimal text with `Bunit`: the stated quantity, which is the final volume (`"final"` with w/v or v/v), the volume in hand (`"added"`, `"reach"`) or the total mass of solution (w/w, `"final"`). `toUnit`: a mass unit for w/v and w/w, a volume unit for v/v |
| Formulae | **w/v, `"final"`:** grams of solute per 100 mL of final solution: `value = ((pct / 100) x (B x f(Bunit)) x 1000) / f(toUnit)`; `Bunit` a volume unit; the factor 1000 converts g/mL to g/L (that is, `pct` g per 0.1 L). **v/v, `"final"` (mode 1):** `value = ((pct / 100) x (B x f(Bunit))) / f(toUnit)`. **v/v, `"added"` (mode 2):** `value = ((pct / 100) x (B x f(Bunit))) / f(toUnit)`, and also `finalVolume = (B x f(Bunit)) x (100 + pct) / 100 / f(toUnit)` and `percentOfFinal = 100 x pct / (100 + pct)`. **v/v, `"reach"` (mode 3):** `value = ((B x f(Bunit)) x pct / (100 - pct)) / f(toUnit)`, and also `finalVolume = ((B x f(Bunit)) x 100 / (100 - pct)) / f(toUnit)`. **w/w, `"final"`:** `B` is a mass; `value` is the solute mass `((pct / 100) x (B x f(Bunit))) / f(toUnit)`, and `solvent` is the solvent mass `((B x f(Bunit)) - (pct / 100) x (B x f(Bunit))) / f(toUnit)` (mass is conserved on mixing; no density is applied). One unrounded chain each |
| Result shape | Every output is `{value, unit, exact: {num, den}}` in `toUnit` (`percentOfFinal` has no unit). Mode 1, w/v: as the common shape. Modes 2 and 3: the common shape plus `finalVolume`, mode 2 also `percentOfFinal`, and `assumes: "additive volumes"` (as E10R-F15). w/w: the common shape for the solute plus `solvent`. Modes 1 (v/v), w/v and w/w assume no additivity and set no `assumes`. Shape choices for w/w: solute in `value` and `exact`, the solvent in a `solvent` object `{value, unit, exact}` (ruled, Q-E10R-N16) |
| Bounds | w/v: `pct` >= 0, no upper bound (above 100 is accepted; the engine does not judge solubility). v/v `"final"` and w/w: 0 <= `pct` <= 100 (100 is a result; above 100 is CCS-RF-03 `["pct"]`). v/v `"added"`: `pct` >= 0, no upper bound. v/v `"reach"`: 0 <= `pct` < 100 (100 or above is CCS-RF-03 `["pct"]`: no finite volume reaches it). `pct` = 0 is a result, `0`, in every case |
| Refusals | Any null: `incomplete`. Unknown unit, `basis` or `reference`: E10-RC-01 naming the unknown fields. `reference` other than `"final"` with w/v or w/w: E10-RC-02 `["reference"]` (modes 2 and 3 add volumes, and for a dissolved solid that volume is not known). `Bunit` not a volume unit for w/v and v/v, or not a mass unit for w/w; `toUnit` not of the dimension `basis` implies (mass for w/v and w/w, volume for v/v): E10-RC-02 naming the unit fields. `B` <= 0 or non-numeric: CCS-RF-03 `["B"]`. `pct` < 0, or outside the bounds above, or non-numeric: CCS-RF-03 `["pct"]` |
| Serves | E10R-DT-04, E10R-OU-02 |

The v/v modes 2 and 3 divide by (100 + pct) and (100 - pct), so each is one engine call (E10R-NF-03), not page arithmetic.

### E10R-F18 `concentrateVolume(Vfinal, Vunit, fold, toUnit)`

| Item | Specification |
|---|---|
| Purpose | Volume of an X-fold concentrate for a stated final volume (NAD-2026-10-24-546 (6), assigned to E10 by NAD-2026-11-14-252 (3)). The concentrate is declared as a fold ("10X" is `fold` 10), never as a percent. `fold` is 1 part concentrate in `fold` parts total, the convention of 0.1.0 section 3.1 and OI-3.8-2. The rest is "bring to <final volume>" on the page (NAD-2026-11-14-249 (1)) |
| Inputs | `Vfinal` decimal text; `Vunit` a volume unit; `fold` decimal text, dimensionless; `toUnit` a volume unit |
| Formula | `value = ((Vfinal x f(Vunit)) / fold) / f(toUnit)`, one unrounded chain |
| Refusals | Any null: `incomplete`. Unknown unit: E10-RC-01. A non-volume unit: E10-RC-02. `Vfinal` <= 0 or non-numeric: CCS-RF-03 `["Vfinal"]`. `fold` < 1 or non-numeric: CCS-RF-03 `["fold"]`. `fold` = 1 is a result: `Vfinal` |
| Note | `splitVolumes(Vnew, N)` (0.1.0 section 3.2) computes the same quotient `Vnew / N` for N >= 1, in mL only, with no `toUnit` and no `exact`; it is not reused (Q-E10R-N14, ruled) |
| Serves | E10R-DT-06 |

### E10R-F19 `roundDeclared(value, rule, places)` (display function)

| Item | Specification |
|---|---|
| Purpose | Display an exact result rounded under a rule the user declares, for example "rounded half-up to 2 decimal places from 111.825, the exact result of your entered values" (NAD-2026-11-14-252 (2); NAD-2026-10-24-625). One verified implementation, beside 0.1.0 section 6. 0.1.0 section 6's `sig3` and `sci3` cannot express it |
| Inputs | `value`: `{num, den}` (the `exact` of a result; integer strings) or plain decimal text per E10C-IN-01. **A JS number is refused**, CCS-RF-03 `["value"]`, so the function cannot be applied to the JS `value` by mistake. `rule` `"half-up"` or `"half-even"`. `places`: plain decimal text of a non-negative integer, digits only (`"2"`); no upper limit is set (NAD-2026-11-14-271) |
| Relation | `r = value x 10^places` as an exact rational; `q = floor(r)`; the fraction `r - q` is compared with 1/2. Above 1/2: `q + 1`. Below: `q`. Exactly 1/2: `"half-up"` gives `q + 1`; `"half-even"` gives `q` if `q` is even, else `q + 1`. The output is the decimal string of `q / 10^places` with exactly `places` digits after the point, trailing zeros kept; at `places` 0 there is no decimal point (4473/40 at `places` 0 gives `112` under both rules). It is applied to `exact`, never to a JS number, so no binary rounding enters |
| Result | `{status: "result", text, rule, places}`, with the version fields; no unit |
| Refusals | Any null: `incomplete`. Unknown `rule`: E10-RC-01 `["rule"]`. `value` a JS number, negative or non-numeric: CCS-RF-03 `["value"]`. `places` not plain decimal text of a non-negative integer (`"2.0"`, `"-1"`, `"abc"`, a JS number): CCS-RF-03 `["places"]`. A negative `value` is refused because no E10R result is negative and "half-up" on a negative tie is a convention not ruled; the text `"-0"` and 0/1 give zero, never `-0` (NAD-2026-11-14-271) |
| Serves | E10R-DT-07 |

### E10R-F20 `activityToMass(a, aUnit, SA, toUnit)`

| Item | Specification |
|---|---|
| Purpose | Mass (or mass concentration) that carries a given activity at a declared specific activity: mass = activity / SA. For 1.2's "IU to ng" |
| Inputs | `a` decimal text; `aUnit` an activity amount (`IU`, `U`) or an activity concentration (`IU/mL`, `U/mL`); `SA` an object, one of: `{form: "single", value, unit}`; `{form: "bound", relation, value, unit}` (a one-sided bound as the certificate states it); `{form: "interval", unit, lower: {value, relation}, upper: {value, relation}}`; `unit` a specific-activity unit; `toUnit` a mass unit when `aUnit` is an amount, a mass-concentration unit when it is a concentration (amount pairs with amount, concentration with concentration) |
| Relation | For each SA limit `s`: `m = ((a x f(aUnit)) / (s x f(SAunit))) / f(toUnit)`, one unrounded chain. **A bound flips going from activity to mass:** SA `> s` gives mass `< a / s`; `>= s` gives `<=`; SA `< s` gives mass `> a / s`; `<= s` gives `>=`. In an interval, the SA's upper limit gives the mass lower end (`< ` gives `>`, `<=` gives `>=`) and the SA's lower limit gives the mass upper end (`>` gives `<`, `>=` gives `<=`). Strictness is carried |
| Result | **Single:** the common shape `{value, unit: toUnit, exact}`. **Bounded (bound or interval):** `{status: "result", form: "bounded", unit: toUnit, lower, upper}`, each of `lower` and `upper` either `{value, exact, relation}` or `null`, **and no top-level `value` or `exact`**, so a bounded result cannot be printed as one amount by mistake. The one exception is a zero `a` under any valid SA, which is the common shape `0` (E10R-OU-03; NAD-2026-11-14-269). A one-sided SA gives one end only: a minimum SA gives only an upper mass ("at most"), a maximum SA gives only a lower mass; never a range from zero. An interval gives both ends |
| Refusals | `SA` null, or a member of it null: `incomplete` (`["SA"]` or `["SA.<member>"]`); there is no mass without a declared SA. Unknown unit, `form` or `relation`: E10-RC-01 naming the field, a nested member as `SA.lower.relation` or `SA.upper.relation` (`SA.relation` for a bound). `aUnit` not an activity unit, `SA.unit` not a specific-activity unit, an IU unit paired with a U unit anywhere (`aUnit` with `SA.unit`), or `toUnit` not of the dimension the pairing implies: E10-RC-02 naming the units that break the pairing in argument order (`aUnit`, `SA.unit`, `toUnit`; ruled, Q-E10R-A5). **A relation given the wrong way round, a lower limit given with `<` or `<=`, or an upper limit given with `>` or `>=`, is a valid closed string used where it does not apply: E10-RC-02 `["SA.lower.relation"]` or `["SA.upper.relation"]`, at step 2 of the order of statuses, not CCS-RF-03 (NAD-2026-11-14-268).** `a` < 0 or non-numeric: CCS-RF-03 `["a"]`. A specific activity <= 0 or non-numeric: CCS-RF-03 (`["SA.value"]`, `["SA.lower"]` or `["SA.upper"]`). An interval lower limit above the upper: CCS-RF-03 `["SA.lower","SA.upper"]`. Equal limits: CCS-RF-03 `["SA.lower","SA.upper"]` with the message "the two limits are equal; enter it as a single value"; the engine does not turn an interval into a point. `a` = 0 under any valid SA (single, bound or interval) is a result: the common shape `{status: "result", value: "0", unit: toUnit, exact: 0/1}`, with no `lower` and no `upper` (NAD-2026-11-14-269). The SA is validated first: a zero `a` with an SA that is null, <= 0, reversed, equal-limited, wrong-way or of the other family is still refused, in the order of statuses |
| Serves | E10R-DT-08, E10R-OU-03, E10R-RF-06 |

### E10R-F21 `massToActivity(m, mUnit, SA, toUnit)`

| Item | Specification |
|---|---|
| Purpose | Activity (or activity concentration) that a given mass carries at a declared specific activity: activity = mass x SA |
| Inputs | `m` decimal text; `mUnit` a mass unit or a mass-concentration unit; `SA` as in E10R-F20; `toUnit` an activity amount unit when `mUnit` is a mass, an activity concentration unit when it is a mass concentration, in the same family (IU or U) as `SA.unit` |
| Relation | For each SA limit `s`: `a = ((m x f(mUnit)) x (s x f(SAunit))) / f(toUnit)`, one unrounded chain. **The direction of a bound is kept going from mass to activity:** SA `> s` gives activity `> m x s`; `>= s` gives `>=`; `< s` gives `<`; `<= s` gives `<=`. In an interval, the lower SA limit gives the activity lower end and the upper SA limit the upper end, each with its own relation |
| Result | As E10R-F20: single gives the common shape; a bounded SA gives `lower` and `upper` (either may be `null`) with no top-level `value` or `exact`; a zero `m` under any valid SA is the common shape `0` (E10R-OU-03; NAD-2026-11-14-269) |
| Refusals | As E10R-F20, with `m` in place of `a` (`m` < 0 or non-numeric: CCS-RF-03 `["m"]`). E10-RC-02 fields in argument order (`mUnit`, `SA.unit`, `toUnit`): `mUnit` not a mass or mass-concentration unit; `toUnit` not an activity unit of the dimension the pairing implies; `toUnit` in the IU family with a U `SA.unit`, or the reverse. `m` = 0 under any valid SA (single, bound or interval) is a result: the common shape `0`, with no `lower` and no `upper`; the SA is validated first, as in E10R-F20 (NAD-2026-11-14-269) |
| Serves | E10R-DT-09, E10R-OU-03, E10R-RF-06 |

### E10R-F22 `activityAmountFromConcentration(c, cUnit, V, Vunit, toUnit)`

Added by NAD-2026-11-14-267 (C2); named and numbered by Atlas (the next free number; F17 is reserved). `amountFromConcentration` (E10C-F12) is not changed: it keeps refusing activity units.

| Item | Specification |
|---|---|
| Purpose | Activity amount in a volume at a given activity concentration: amount = c x V (IU/mL x mL = IU). For 1.2's activity-defined lines, the first call of route (d) of section 8. No specific activity enters, and none may be passed |
| Inputs | `c` decimal text; `cUnit` `IU/mL` or `U/mL`; `V` decimal text; `Vunit` a volume unit; `toUnit` `IU` when `cUnit` is `IU/mL`, `U` when `cUnit` is `U/mL` (the same family; IU and U never meet) |
| Formula | `value = ((c x f(cUnit)) x (V x f(Vunit))) / f(toUnit)`, one unrounded chain. Result `{status: "result", value, unit: toUnit, exact: {num, den}}` |
| Refusals | Any null: `incomplete`. Unknown unit: E10-RC-01. `cUnit` not an activity-concentration unit, `Vunit` not a volume unit, or `toUnit` not an activity amount unit of the same family as `cUnit` (an IU unit with a U unit): E10-RC-02 naming the units that break the pairing in argument order (`cUnit`, `Vunit`, `toUnit`). `c` < 0 or non-numeric: CCS-RF-03 `["c"]`. `c` = 0 is a result, `0`, status `result`; the text `"-0"` is zero, never negative zero (as E10C-F12; NAD-2026-11-09-01; NAD-2026-11-14-277). `V` < 0 or non-numeric: CCS-RF-03 `["V"]`; `V` = 0 follows E10C-F12's rule (a zero volume declares no aliquot, so it is refused: CCS-RF-03 `["V"]`) |
| Serves | E10R-DT-10 |

## 7. Requirement IDs (provisional; frozen on Nadira's signature)

| Area | ID | Requirement |
|---|---|---|
| Input | E10R-IN-01 | Decimal-text inputs, `{value, unit}` arrays and the specific-activity object; the page parses |
| Input | E10R-IN-02 | Closed unit table of E10C plus the activity units; closed strings `basis`, `reference`, `form`, `relation`, `rule` |
| Determination | E10R-DT-01 | `scaleToVolume` (E10R-F13): `((q x f) x ((Vto x f) / (Vfrom x f))) / f(toUnit)` |
| Determination | E10R-DT-02 | `volumeFromAmount` (E10R-F14): `((n x f) / (c x f)) / f(toUnit)` |
| Determination | E10R-DT-03 | `balanceVolume` (E10R-F15): `((Vtotal x f) - sum(v_i x f)) / f(toUnit)`, with `assumes` |
| Determination | E10R-DT-04 | `percentSolution` (E10R-F16): per basis and reference as the F16 table |
| Determination | E10R-DT-05 | Reserved (overage, original draft) |
| Determination | E10R-DT-06 | `concentrateVolume` (E10R-F18): `((Vfinal x f) / fold) / f(toUnit)` |
| Determination | E10R-DT-07 | `roundDeclared` (E10R-F19): half-up or half-even on `exact` |
| Determination | E10R-DT-08 | `activityToMass` (E10R-F20): `((a x f) / (s x f)) / f(toUnit)` per SA limit |
| Determination | E10R-DT-09 | `massToActivity` (E10R-F21): `((m x f) x (s x f)) / f(toUnit)` per SA limit |
| Determination | E10R-DT-10 | `activityAmountFromConcentration` (E10R-F22): `((c x f) x (V x f)) / f(toUnit)` |
| Units | E10R-UN-01 | Six activity dimensions added (section 3); IU and U never meet; percent is an argument |
| Flags | none | The engine raises no flag. A stated assumption in a result (E10R-OU-02) is not a flag |
| Refusals | E10R-RF-01 | Unknown unit or closed string: E10-RC-01 |
| Refusals | E10R-RF-02 | Wrong dimension, broken pairing, IU with U, `reference` other than `"final"` for w/v and w/w, a relation limit given the wrong way round: E10-RC-02 |
| Refusals | E10R-RF-03 | Parts exceed the stated total: E10-RC-03 with both totals |
| Refusals | E10R-RF-04 | Zero or negative divisor (Vfrom, Vto, Vtotal, Vfinal, B, `c` of E10R-F14, SA): CCS-RF-03; negative or non-numeric value: CCS-RF-03; zero amount is a result |
| Refusals | E10R-RF-05 | Order of statuses of the conversions spec section 2; at most one `rejected` per call |
| Refusals | E10R-RF-06 | Specific activity: no SA is `incomplete`; SA <= 0 or non-number, activity < 0, interval limits reversed or equal: CCS-RF-03 |
| Output | E10R-OU-01 | Unrounded `value` in `toUnit`, `unit`, `exact: {num, den}`, version field |
| Output | E10R-OU-02 | `assumes: "additive volumes"` on every F15 result and every F16 mode 2 or 3 result; absent where additivity is not assumed |
| Output | E10R-OU-03 | A bounded activity result carries `lower` and `upper` (each `{value, exact, relation}` or `null`) and no top-level `value` or `exact`. The one exception: a zero activity or a zero mass under any valid SA, single, bound or interval, is the common shape `0` with no `lower` and no `upper` (NAD-2026-11-14-269) |
| Non-functional | E10R-NF-01 to -05, -08 | As section 2 (-06 and -07 reserved, overage) |

Traceability, requirement to code: E10R-RF-01 to E10-RC-01 (AT-E10R-05, -06); E10R-RF-02 to E10-RC-02 (AT-E10R-07, -26, -28, -32); E10R-RF-03 to E10-RC-03 (AT-E10R-08); E10R-RF-04 to CCS-RF-03 (AT-E10R-09, -10, -17, -32, -33); E10R-RF-05 to the order of statuses (AT-E10R-11); E10R-RF-06 to AT-E10R-27, -28, -30.

## 8. Engine and tool boundary (Q-E10R-N5 ruled, NAD-2026-11-14-252)

Engine: E10R-F13 to E10R-F16 and E10R-F18 to E10R-F22 with `toUnit`, the -623 modes, w/w, the additive balance, the activity relations and the declared-rounding display function. Tool-level, not engine:
- **1.2:** the recipe table with target and actual columns; which lines scale; the pipetting and percent-solution wording; the hydrate form and its source (NAD-2026-10-24-546 (4)); the make-up-to-volume route ("bring to <final volume> with <solvent>", no subtraction); the lot, the source with the CoA identifier, the label "mass computed from your lot's specific activity (<value, unit, lot>)", the wording "at least" and "at most", and X1's both-direction display (NAD-2026-11-14-254 (7)).
- **The four 1.2 recipe line kinds (NAD-2026-11-14-255), each declared per line and shown on the line:** (1) "amount for this volume": scales by Vto/Vfrom through E10R-F13, the default for an amount line, with the factor shown beside it ("x 4"); (2) "fixed per batch": not scaled, printed as entered with "not scaled: you set this line as fixed per batch"; (3) "final concentration": recomputed from the target concentration at the new volume through the routes of NAD-2026-11-14-266: (a) a solid at a mass-concentration target, E10C-F12; (b) a solid at a molar target, `molarToMass` then E10C-F12; (c) a liquid stock in the same dimension, E10C-F12 then E10R-F14; (d) an activity stock, the -267 function (E10R-F22) then E10R-F14; (e) an X-fold stock, E10R-F18; each passed value a terminating product, passed as exact plain decimal text; never through E10R-F13; (4) "adjust to" (pH, osmolality, q.s., bring to volume): carries no amount, never scaled, and the tool computes no titrant amount.
- **X5:** CSV export, viability-dye and Fc-block component types, lot and clone fields (ML1 :104). Its scientific limit is the master-list status: RC for (a), (c) and fixable viability dyes; H for DNA-binding dyes and Fc block. No engine function is added for them.
- **X7:** the export, the aliquot plan (BB-23, unsourced, held; ML1 :105), the link from X1. The engine supplies E10R-F14 and the two-call route of its Boundary row.
- **E13:** ratio and component order; calls E10R-F13.
- **1.3:** the pipetting list, per-component presentation, plate or tube layout, rounding for pipetting. Its overage inputs are specified in the original draft.

## 9. Register of values (basis and status)

| Value | Basis | Status |
|---|---|---|
| Divisor 100 in percent | Definition of percent | Exact; the w/v, v/v and w/w conventions and the three reference modes are ruled (NAD-2026-11-14-250, -251) |
| Factor 1000 (g/mL to g/L) | Exact SI prefix relation | Exact; shown in Example 7 |
| Prefix factors | E10C section 3 | Signed (NAD-2026-11-09-26) |
| Activity factors 1e3 (per mL, per mg) and 1e6 (per ug) | Exact prefix relations, checked in section 3 | The token list is ruled (NAD-2026-11-14-268) |
| Specific activity, any value | Declared per call from the user's lot | Never held by the engine (E10R-NF-08). Example values are typed illustrations, not published values (NAD-2026-10-24-548 (4)) |
| Examples 1 to 26 | Atlas | Hand-derived, working shown in section 10. The fixture author derives independently. The molecular weight 238.3 in Example 23 is a typed illustration, not a published value |
| Rounding examples (4473/40 and the Example 21 table) | NAD-2026-11-14-252 (2); NAD-2026-11-14-271 | Nadira's; re-derived in Example 21 |

## 10. Worked examples (exact arithmetic)

Display uses 0.1.0 section 6 with the mode of the result dimension (E10R-NF-02). Hand-derived; no script was run. "Display" strings use the 0.1.0 section 6 forms (`sci3` is `d.dd × 10^n`).

**Example 1, `scaleToVolume("2.5", "g", "500", "mL", "2", "L", "g")`.** q = 2.5 g; Vfrom = 500 x 1e-3 = 0.5 L; Vto = 2 x 1 = 2 L. Factor 2 / 0.5 = 4. value = 2.5 x 4 / 1 = 10 g. `exact` 10/1. `sig3`: 10.0 g.

**Example 2, `scaleToVolume("15", "mL", "100", "mL", "30", "mL", "mL")`.** q = 15 x 1e-3 = 0.015 L; Vfrom = 0.1 L; Vto = 0.03 L; factor 0.3. 0.015 x 0.3 = 0.0045 L; / 1e-3 = 4.5 mL. `exact` 9/2. `sig3`: 4.50 mL.

**Example 3, a non-terminating ratio, `scaleToVolume("1", "g", "3", "mL", "1", "mL", "mg")`.** q = 1 g; factor (1 x 1e-3) / (3 x 1e-3) = 1/3. 1 x 1/3 = 1/3 g; / 1e-3 = 1000/3 mg = 333.333... mg. `exact` 1000/3. `sig3`: 333 mg.

**Example 4, `volumeFromAmount("10", "nmol", "50", "uM", "uL")`.** n = 10 x 1e-9 = 1e-8 mol; c = 50 x 1e-6 = 5e-5 mol/L; V = 1e-8 / 5e-5 = 2e-4 L; / 1e-6 = 200 uL. `exact` 200/1. `sig3`: 200 uL.

**Example 5, `volumeFromAmount("5", "ug", "2", "mg/mL", "uL")`.** n = 5 x 1e-6 = 5e-6 g; c = 2 x 1 = 2 g/L; V = 5e-6 / 2 = 2.5e-6 L; / 1e-6 = 2.5 uL. `exact` 5/2. `sig3`: 2.50 uL.

**Example 6 (restated, NAD-2026-11-14-249 (6)), `balanceVolume("50", "mL", [{"5","mL"},{"500","uL"}], "mL")`.** A pipetted balance: parts 5 mL and 500 uL, total 50 mL if volumes add. Vtotal = 0.05 L; parts = 5e-3 + 500 x 1e-6 = 5e-3 + 5e-4 = 5.5e-3 L; 0.05 - 0.0055 = 0.0445 L; / 1e-3 = 44.5 mL. `exact` 89/2. `sig3`: 44.5 mL. `assumes`: "additive volumes". Refusal: `balanceVolume("50", "mL", [{"30","mL"},{"25","mL"}], "mL")`: parts 0.055 L > 0.05 L, E10-RC-03, no balance; `partsTotal` 55 mL (55/1) and `statedTotal` 50 mL (50/1), so the page can print "your parts total 55 mL, more than the 50 mL you set". Equal-total case: `balanceVolume("55", "mL", [{"30","mL"},{"25","mL"}], "mL")` is `0` mL, with `assumes`.

**Example 7, `percentSolution("0.9", "w/v", "final", "500", "mL", "g")`.** 0.9 g per 100 mL = 0.9 g per 0.1 L = 9 g/L. B = 500 x 1e-3 = 0.5 L. 9 x 0.5 = 4.5 g. By the formula: (0.9 / 100) x 0.5 x 1000 = 0.009 x 500 = 4.5. `exact` 9/2. `sig3`: 4.50 g. No `assumes`.

**Example 8, `percentSolution("70", "v/v", "final", "250", "mL", "mL")`.** (70 / 100) x (250 x 1e-3 L) = 0.7 x 0.25 = 0.175 L; / 1e-3 = 175 mL. `exact` 175/1. `sig3`: 175 mL. No `assumes`.

**Example 9 (NAD-2026-11-14-250), `percentSolution("20", "w/w", "final", "100", "g", "g")`.** B = 100 g of solution. Solute = (20 / 100) x 100 = 20 g; solvent = 100 - 20 = 80 g (mass is conserved on mixing; no density). `value` `exact` 20/1; `solvent` `exact` 80/1. `sig3`: 20.0 g solute, 80.0 g solvent. Nadira's example omits `reference`; the argument is required, so it appears here as `"final"` (ruled, Q-E10R-N16, NAD-2026-11-14-270).

**Example 10 (NAD-2026-11-14-251), mode 2, `percentSolution("10", "v/v", "added", "500", "mL", "mL")`.** V_have = 500 mL = 0.5 L. V_supp = (10 / 100) x 0.5 = 0.05 L; / 1e-3 = 50 mL. `value` `exact` 50/1; `sig3` 50.0 mL. `finalVolume` = 0.5 x 110 / 100 = 0.55 L = 550 mL, `exact` 550/1, `sig3` 550 mL. `percentOfFinal` = 100 x 10 / 110 = 100/11 = 9.0909...; `sig3` 9.09. `assumes`: "additive volumes".

**Example 11 (NAD-2026-11-14-251), mode 3, `percentSolution("10", "v/v", "reach", "500", "mL", "mL")`.** V_have = 0.5 L. V_add = 0.5 x 10 / (100 - 10) = 5/90 = 1/18 L; / 1e-3 = 500/9 mL = 55.555... mL. `exact` 500/9; `sig3` 55.6 mL (Nadira's "55.56" is a four-figure rendering of the same value). `finalVolume` = 0.5 x 100 / 90 = 5/9 L; / 1e-3 = 5000/9 mL = 555.555... mL; `sig3` 556 mL. Check: V_add / finalVolume = (500/9) / (5000/9) = 1/10 = 10%. `assumes`: "additive volumes". Mode 1 for the same numbers is `percentSolution("10", "v/v", "final", "500", "mL", "mL")` = 50 mL (0.1 x 0.5 L = 0.05 L), no `assumes`.

**Example 12 (NAD-2026-11-14-253), X7 from a mass to a molar target through two calls.** 1 mg at 1 mM, MW 500 g/mol, volume in mL. Call 1, `molarToMass("1", "mM", "500", "mg/mL")`: (1 x 1e-3 mol/L) x 500 g/mol = 0.5 g/L; / f(mg/mL) = / 1 = 0.5 mg/mL. `exact` 1/2. It terminates, so it is passed on as the exact plain decimal text `"0.5"`. Call 2, `volumeFromAmount("1", "mg", "0.5", "mg/mL", "mL")`: n = 1 x 1e-3 = 1e-3 g (the user's "1" mg as typed); c = 0.5 x 1 = 0.5 g/L; V = 1e-3 / 0.5 = 2e-3 L; / 1e-3 = 2 mL. `exact` 2/1; `sig3` 2.00 mL. Nadira's "500 mg/L" is the same concentration; `mg/L` is not a table unit, so `mg/mL` is used.

**Example 13 (E10R-F18), `concentrateVolume("500", "mL", "10", "mL")`.** 0.5 L / 10 = 0.05 L; / 1e-3 = 50 mL. `exact` 50/1; `sig3` 50.0 mL. Non-terminating case, `concentrateVolume("1", "L", "3", "mL")`: 1 / 3 L; / 1e-3 = 1000/3 mL, `sig3` 333 mL. `fold` 1: `concentrateVolume("500", "mL", "1", "mL")` is 500 mL.

**Example 14 (activity amount as a recipe quantity), `scaleToVolume("100", "IU", "100", "mL", "250", "mL", "IU")`.** q = 100 x 1 = 100 IU; factor (250 x 1e-3) / (100 x 1e-3) = 2.5; 100 x 2.5 = 250 IU; / 1 = 250 IU. `exact` 250/1; `sig3` 250 IU. `scaleToVolume("100", "IU", "100", "mL", "250", "mL", "U")` is E10-RC-02 `["toUnit"]`.

**Example 15 (activity, single SA), `activityToMass("250", "IU", {form: "single", value: "10000000", unit: "IU/mg"}, "ug")`.** a = 250 IU. s = 1e7 x 1e3 = 1e10 IU/g. m = 250 / 1e10 = 2.5e-8 g; / 1e-6 = 0.025 ug. `exact` 1/40; `sig3` 0.0250 ug. Inverse, an independent call on the terminating text "0.025": `massToActivity("0.025", "ug", {form: "single", value: "10000000", unit: "IU/mg"}, "IU")`: m = 0.025 x 1e-6 = 2.5e-8 g; x 1e10 = 250 IU; `exact` 250/1; `sig3` 250 IU.

**Example 16 (Nadira's first fixture), `activityToMass("100", "IU/mL", {form: "single", value: "21000", unit: "IU/ug"}, "ng/mL")`.** a = 100 x 1e3 = 1e5 IU/L. s = 21000 x 1e6 = 2.1e10 IU/g. m = 1e5 / 2.1e10 = 1 / 2.1e5 g/L; / f(ng/mL) = / 1e-6: 1e5 / (2.1e10 x 1e-6) = 1e5 / 2.1e4 = 100/21 = 4.7619... ng/mL. `exact` 100/21; `sci3` 4.76 × 10^0 ng/mL.

**Example 17 (one-sided SA, to mass), `activityToMass("100", "IU/mL", {form: "bound", relation: ">", value: "10000000", unit: "IU/mg"}, "ng/mL")`.** a = 1e5 IU/L; s = 1e10 IU/g; m = 1e5 / 1e10 = 1e-5 g/L; / 1e-6 = 10 ng/mL. SA `>` flips: `upper` = {10/1, `<`}; `lower` = `null`; no top-level `value`. Display: `sci3` 1.00 × 10^1 ng/mL, "at most". With relation `>=`: `upper` relation `<=`.

**Example 18 (interval), `activityToMass("100", "IU/mL", {form: "interval", unit: "IU/mg", lower: {value: "10000000", relation: ">="}, upper: {value: "20000000", relation: "<="}}, "ng/mL")`.** a = 1e5 IU/L. Lower mass end from the SA upper limit: s = 2e7 x 1e3 = 2e10; m = 1e5 / 2e10 = 5e-6 g/L = 5 ng/mL, relation `<=` flips to `>=`. Upper mass end from the SA lower limit: s = 1e10; m = 1e-5 g/L = 10 ng/mL, relation `>=` flips to `<=`. Result: `lower` {5/1, `>=`}, `upper` {10/1, `<=`}. `sci3`: 5.00 × 10^0 and 1.00 × 10^1 ng/mL. Why a range of masses does not deliver an activity target (NAD-2026-11-14-254 (6)): 7.5 ng/mL = 7.5e-6 g/L; at 1e10 IU/g that is 7.5e4 IU/L = 75 IU/mL; at 2e10 IU/g it is 1.5e5 IU/L = 150 IU/mL.

**Example 19 (one-sided SA, to activity), `massToActivity("10", "ng/mL", {form: "bound", relation: ">", value: "10000000", unit: "IU/mg"}, "IU/mL")`.** m = 10 x 1e-6 = 1e-5 g/L; s = 1e10 IU/g; a = 1e-5 x 1e10 = 1e5 IU/L; / f(IU/mL) = / 1e3 = 100 IU/mL. The direction is kept: `lower` = {100/1, `>`}, `upper` = `null`. `sci3` 1.00 × 10^2 IU/mL.

**Example 20 (IU and U never meet), `activityToMass("100", "IU/mL", {form: "single", value: "10000", unit: "U/mg"}, "ng/mL")`.** IU concentration with a U-per-mass SA: E10-RC-02 `["aUnit","SA.unit"]`, no number. Also E10-RC-02: `massToActivity("1", "ng", {form: "single", value: "10000", unit: "U/mg"}, "IU")` with `["SA.unit","toUnit"]`; `scaleUnit("1", "IU", "U")`; `balanceVolume` with a part `{"1","IU"}`.

**Example 21 (E10R-F19, NAD-2026-11-14-252 (2), -271).** The exact result 4473/40 = 111.825 (check: 40 x 111 = 4440, 33/40 = 0.825). `roundDeclared({num: "4473", den: "40"}, "half-up", "2")`: r = 11182.5, q = 11182, fraction exactly 1/2, half-up gives 11183: text `111.83`. `roundDeclared(..., "half-even", "2")`: q = 11182 is even: text `111.82`. The guard set, each input given as text and as `{num, den}`, derived by hand from the Relation of E10R-F19 (r = value x 10^2, q = floor(r), the fraction compared with 1/2):

| Input | half-up | half-even | Catches |
|---|---|---|---|
| 4473/40 (text `111.825`; the -625 case, kept) | 111.83 | 111.82 | stored-double route under half-even |
| 2.675 (107/40) | 2.68 | 2.68 | stored-double route |
| 1.005 (201/200) | 1.01 | 1.00 | both float routes under half-up |
| 1.015 (203/200) | 1.02 | 1.02 | both float routes under both rules |
| 2.345 (469/200) | 2.35 | 2.34 | both float routes under half-even |
| a JS number 111.825 | CCS-RF-03 `["value"]` | same | the "applied to `value`" route |
| 4473/40 at places 0 | 112 | 112 | output form |

Working: 2.675 = 107/40 (40 x 2 = 80, 27/40 = 0.675); r = 267.5, q = 267 (odd): half-up 268, half-even 268, text `2.68`. 1.005 = 201/200; r = 100.5, q = 100 (even): half-up 101 gives `1.01`, half-even 100 gives `1.00`. 1.015 = 203/200; r = 101.5, q = 101 (odd): both 102, `1.02`. 2.345 = 469/200 (200 x 2 = 400, 69/200 = 0.345); r = 234.5, q = 234 (even): half-up 235 gives `2.35`, half-even 234 gives `2.34`. 4473/40 at `places` 0: r = 111.825, q = 111, fraction 0.825 above 1/2, so 112 under both rules, written with no decimal point.

**Example 22 (kind (3) route (a), a solid at a mass-concentration target, NAD-2026-11-14-266), `amountFromConcentration("4.5", "g/L", "2", "L", "g")`.** c = 4.5 x 1 = 4.5 g/L; V = 2 x 1 = 2 L; 4.5 x 2 = 9 g; / 1 = 9 g. `exact` 9/1; `sig3` 9.00 g. One call.

**Example 23 (route (b), a solid at a molar target; the molecular weight 238.3 is a typed illustration).** Call 1, `molarToMass("10", "mM", "238.3", "g/L")`: (10 x 1e-3 mol/L) x 238.3 g/mol = 0.01 x 238.3 = 2.383 g/L; / f(g/L) = / 1 = 2.383. `exact` 2383/1000; `sci3` 2.38 × 10^0 g/L. It terminates (a product of decimals), so it is passed on as the exact plain decimal text `"2.383"`. Call 2, `amountFromConcentration("2.383", "g/L", "500", "mL", "g")`: c = 2.383 g/L; V = 500 x 1e-3 = 0.5 L; 2.383 x 0.5 = 1.1915 g; / 1 = 1.1915 g. `exact` 2383/2000 (check: 2383/2000 = 1.1915); `sig3` 1.19 g. The hydrate form and its source stay the page's (NAD-2026-10-24-546 (4)).

**Example 24 (route (c), a liquid stock in the same dimension).** 2 mM from a 200 mM stock in 500 mL. Call 1, `amountFromConcentration("2", "mM", "500", "mL", "umol")`: c = 2 x 1e-3 = 2e-3 mol/L; V = 0.5 L; 2e-3 x 0.5 = 1e-3 mol; / 1e-6 = 1000 umol. `exact` 1000/1. It terminates, so it is passed on as the text `"1000"`. Call 2, `volumeFromAmount("1000", "umol", "200", "mM", "mL")`: n = 1000 x 1e-6 = 1e-3 mol; c = 200 x 1e-3 = 0.2 mol/L; V = 1e-3 / 0.2 = 5e-3 L; / 1e-3 = 5 mL. `exact` 5/1; `sig3` 5.00 mL of stock, to be brought to 500 mL on the page.

**Example 25 (route (d), an activity stock, E10R-F22 then E10R-F14, NAD-2026-11-14-267).** 100 IU/mL from a 100000 IU/mL stock (1 × 10^5) in 500 mL. Call 1, `activityAmountFromConcentration("100", "IU/mL", "500", "mL", "IU")`: c = 100 x 1e3 = 1e5 IU/L; V = 500 x 1e-3 = 0.5 L; 1e5 x 0.5 = 5e4; / f(IU) = / 1 = 50000 IU. `exact` 50000/1; `sig3` 50000 IU. It terminates, so it is passed on as the text `"50000"`. Call 2, `volumeFromAmount("50000", "IU", "100000", "IU/mL", "mL")`: n = 50000 IU; c = 100000 x 1e3 = 1e8 IU/L; V = 5e4 / 1e8 = 5e-4 L; / 1e-3 = 0.5 mL. `exact` 1/2; `sig3` 0.500 mL of stock. No specific activity enters.

**Example 26 (E10R-F22 in the U family, and the cross-family refusals, NAD-2026-11-14-267), `activityAmountFromConcentration("2", "U/mL", "250", "mL", "U")`.** c = 2 x 1e3 = 2e3 U/L; V = 250 x 1e-3 = 0.25 L; 2e3 x 0.25 = 500 U; / 1 = 500 U. `exact` 500/1; `sig3` 500 U. Refusals, no number: `activityAmountFromConcentration("2", "U/mL", "250", "mL", "IU")` is E10-RC-02 `["cUnit","toUnit"]`; `volumeFromAmount("500", "IU", "2", "U/mL", "mL")` is E10-RC-02 `["nUnit","cUnit"]`; `amountFromConcentration("2", "U/mL", "250", "mL", "U")` (E10C-F12) is E10-RC-02 (it was E10-RC-01 in the conversions spec, where `U/mL` was not a table unit). A U pair that is a result: `volumeFromAmount("500", "U", "2", "U/mL", "mL")`: n = 500 U; c = 2 x 1e3 = 2e3 U/L; V = 500 / 2e3 = 0.25 L; / 1e-3 = 250 mL; `exact` 250/1; `sig3` 250 mL.

**One example per function:** E10R-F13: Examples 1 to 3 and 14. E10R-F14: Examples 4, 5, 12, 25 (call 2) and 26. E10R-F15: Example 6. E10R-F16: Examples 7 to 11. E10R-F18: Example 13. E10R-F19: Example 21. E10R-F20: Examples 15 to 18 and 20. E10R-F21: Examples 15 (inverse), 19 and 20. E10R-F22: Examples 25 (call 1) and 26. The kind (3) routes of section 8: Examples 22 to 25.

## 11. Acceptance tests (Adacs builds fixtures; the independent fixture author derives the values)

| ID | Test | Expected |
|---|---|---|
| AT-E10R-01 | Examples 1 to 26 as single calls (Examples 12, 23, 24 and 25 are two single calls each; Example 22 is one call) | `exact` equals the section 10 rational by cross-multiplication; display strings once-rounded for the stated mode; bounded results shaped as E10R-OU-03 |
| AT-E10R-02 | Zero amount in E10R-F13, E10R-F14, E10R-F20, E10R-F21; zero `c` in E10R-F22; zero `pct` in E10R-F16 (every basis); the text `"-0"` in each | `0`, status `result`, never negative zero. A zero under any valid SA, single, bound or interval, is the common shape `0` with no `lower` and no `upper` (NAD-2026-11-14-269) |
| AT-E10R-03 | E10R-F13 with a concentration unit as `unit` (`mg/mL`, `IU/mL`) | E10-RC-02, `fields` `["unit"]` |
| AT-E10R-04 | E10R-F14 with the mismatched pairs `nmol` with `mg/mL`, and `ug` with `uM` | E10-RC-02, `fields` `["nUnit","cUnit"]` (ruled, Q-E10R-A5) |
| AT-E10R-05 | E10R-F16 with `basis` `"w/w"` (valid, Example 9); `"W/V"` and `"m/v"`; `reference` unknown (`"Final"`); w/v or w/w with `"added"` or `"reach"` | `"w/w"` a result; `"W/V"` and `"m/v"` E10-RC-01 `["basis"]`; unknown `reference` E10-RC-01 `["reference"]`; w/v or w/w with `"added"` or `"reach"` E10-RC-02 `["reference"]` |
| AT-E10R-06 | Unknown units, including as `toUnit`, inside `parts[i].unit` and as `SA.unit`; unknown `form`, `relation`, `rule` | E10-RC-01 naming only the unknown fields |
| AT-E10R-07 | Wrong-dimension units and `toUnit` in each function; w/w with a volume `Bunit` or a volume `toUnit`; w/v or v/v with a mass `Bunit` | E10-RC-02 naming only the wrong fields |
| AT-E10R-08 | E10R-F15 with parts over the stated total; with parts equal to it | E10-RC-03 with `partsTotal` and `statedTotal`, both exact (Example 6: 55/1 and 50/1); a result `0` with `assumes` (NAD-2026-11-14-248) |
| AT-E10R-09 | `Vfrom`, `Vto`, `Vtotal`, `Vfinal`, `B`, `c` each as `"0"`, `"-5"`, `"abc"`, `"2e5"`, `"1,5"` | CCS-RF-03 naming the field |
| AT-E10R-10 | Several bad fields in one call | One `rejected`, `fields` in argument order |
| AT-E10R-11 | Null plus a bad value; unit refusal plus a bad value | Order of statuses of the conversions spec section 2 |
| AT-E10R-12 | Version field on every result and refusal | As E10C AT-E10C-15; additive minor bump, number set at build against main (KAITO-D172) |
| AT-E10R-13 | C10 and E10C regression: the whole existing E10 test set | Pass; existing results unchanged except the version fields. Declared changes: (1) the tokens `IU`, `U`, `IU/mL`, `U/mL`, `IU/mg`, `IU/ug`, `U/mg`, `U/ug` are table units now. (2) **E10C-F12 (`amountFromConcentration`) keeps refusing activity units, but with E10-RC-02 instead of E10-RC-01**, because the tokens are now table units of the wrong dimension for that function (NAD-2026-11-14-267). (3) Positive within-family checks of `scaleUnit` (NAD-2026-11-14-267, -268): `scaleUnit("1", "IU/mg", "IU/ug")` gives 0.001, `exact` 1/1000 (1 IU/mg = 1e3 IU/g; / 1e6 = 1e-3); `scaleUnit("1", "U/mL", "U/mL")` gives the identity, 1, `exact` 1/1. Atlas's grep of the conversions spec for `IU` and `U/` found no AT-E10C row that uses them as an unknown unit; `AT-E10C-06`'s own text and a bare `"U"` were not searched, so Adacs to confirm |
| AT-E10R-14 | Determinism; no network; no new dependency | Pass |
| AT-E10R-15, -16 | Reserved (overage, original draft) | Not carried |
| AT-E10R-17 | `pct` bounds (E10R-F16): w/v 0, 100, 250 (all results); v/v `"final"` and w/w 0, 100 (results), 100.5 and -1 (CCS-RF-03 `["pct"]`); v/v `"added"` 0, 100, 250 (results); v/v `"reach"` 0, 99.5 (results), 100 and 150 (CCS-RF-03 `["pct"]`) | As stated |
| AT-E10R-18 | `assumes: "additive volumes"` on every E10R-F15 result and every E10R-F16 mode 2 and mode 3 result; absent on w/v, w/w and v/v mode 1. A result missing the field where required | The field is present where required and absent elsewhere; a missing field FAILS (NAD-2026-11-14-249 Conditions, -251 Conditions) |
| AT-E10R-19 | The -624 (4) absence fixture, extended to 1.2's use of E10R-F15: the make-up-to-volume route makes no E10R-F15 call, prints no subtraction, and no output field named "water to add" exists; the page's "if volumes add" line is present in the fixture text, the Learn text and the export | Pass. This is a tool-level test (Adacs; NAD-2026-11-14-249 Conditions) |
| AT-E10R-20 | The three reference modes with Nadira's fixtures (Examples 8, 10, 11) | 50 mL; 50 mL, final 550 mL, 100/11 % (9.09); 500/9 mL (55.6), final 5000/9 mL (556) |
| AT-E10R-21 | X7 two-call route (Example 12), with the mass `"1"` passed as typed and call 1's result passed as the text `"0.5"`; also MW 74.55 as call 1 input | 2 mL; call 1 terminates for MW 74.55 and call 2 is a result (no refusal that depends on the MW typed) |
| AT-E10R-22 | E10R-F18: `fold` 1, 0.5, `"abc"`, 10; `Vfinal` 0 | `Vfinal`; CCS-RF-03 `["fold"]` for 0.5 and `"abc"`; 50 mL for 10; CCS-RF-03 `["Vfinal"]` |
| AT-E10R-23 | E10R-F19 guard fixtures (NAD-2026-11-14-271): the rows of the Example 21 table, each as text and as `{num, den}`, with the "Catches" column | 4473/40: `111.83` half-up, `111.82` half-even; 2.675 (107/40): `2.68`, `2.68`; 1.005 (201/200): `1.01`, `1.00`; 1.015 (203/200): `1.02`, `1.02`; 2.345 (469/200): `2.35`, `2.34`; a JS number 111.825: CCS-RF-03 `["value"]`; 4473/40 at `places` 0: `112`, `112` |
| AT-E10R-24 | Activity fixtures (NAD-2026-11-14-254): Examples 15 to 19 | As section 10 |
| AT-E10R-25 | Bounded result shape: a bound or interval result has `lower` and `upper` and no top-level `value` or `exact`; a single SA result has `value` and `exact` and no `lower` or `upper`; a one-sided SA gives exactly one non-null end, in the direction of the flip table. The exception: a zero activity or mass under a valid bound or interval is the common shape `0` with no `lower` and no `upper` (NAD-2026-11-14-269) | Pass |
| AT-E10R-26 | IU and U never meet: IU with a U-per-mass SA; U with an IU-per-mass SA; IU in `toUnit` from U; `scaleUnit` IU to U and `IU/mL` to `U/mL`; F13 IU to U; an IU part in E10R-F15 | E10-RC-02 naming the unit fields in argument order |
| AT-E10R-27 | No SA: `SA` null; a member null; SA <= 0 and non-numeric; activity < 0 | `incomplete` naming `SA` or `SA.<member>`; CCS-RF-03 naming `SA.value` (or `SA.lower`, `SA.upper`); CCS-RF-03 `["a"]` |
| AT-E10R-28 | Interval refusals: lower above upper; lower equal to upper; a lower limit with `<`; an upper limit with `>`; an unknown relation string in a limit | CCS-RF-03 `["SA.lower","SA.upper"]` for reversed limits; equal limits carry the message "the two limits are equal; enter it as a single value", no point result; the wrong-way relation is E10-RC-02 `["SA.lower.relation"]` or `["SA.upper.relation"]` at step 2, not CCS-RF-03 (NAD-2026-11-14-268); an unknown relation is E10-RC-01 with the same naming |
| AT-E10R-29 | F13 with an activity amount; 100 IU from 100 mL to 250 mL | 250 IU (Example 14) |
| AT-E10R-30 | A zero activity with reversed SA limits (NAD-2026-11-14-269): `activityToMass("0", "IU/mL", {form: "interval", unit: "IU/mg", lower: {value: "20000000", relation: ">="}, upper: {value: "10000000", relation: "<="}}, "ng/mL")` | CCS-RF-03 `["SA.lower","SA.upper"]`: the SA is validated first, so the zero is not returned |
| AT-E10R-31 | The kind (3) routes (NAD-2026-11-14-266): Examples 22 to 25, each passed value as exact plain decimal text: (a) 4.5 g/L in 2 L; (b) call 1 text `"2.383"`, call 2; (c) call 1 text `"1000"`, call 2; (d) call 1 text `"50000"`, call 2 | (a) 9 g; (b) 2383/1000 g/L then 2383/2000 g (1.1915 g); (c) 1000 umol then 5 mL; (d) 50000 IU then 1/2 mL (0.5 mL) |
| AT-E10R-32 | The activity pairs (NAD-2026-11-14-267): E10R-F22 and the E10R-F14 pairs `IU` with `IU/mL` and `U` with `U/mL` (Examples 25 and 26); each cross-family refusal (E10R-F22 `IU/mL` to `U`; E10R-F14 `IU` with `U/mL` and `U` with `IU/mL`); E10R-F22 with `V` as `"0"`; with `c` as `"0"` and as `"-0"`; with `c` as `"-1"` | Results as Examples 25 and 26 (50000 IU, 0.5 mL, 500 U, 250 mL); E10-RC-02 with `["cUnit","toUnit"]` and `["nUnit","cUnit"]`; CCS-RF-03 `["V"]`; `0` IU, status `result`, never negative zero, for `c` `"0"` and `"-0"`; CCS-RF-03 `["c"]` for `"-1"` |
| AT-E10R-33 | E10R-F19 input contract (NAD-2026-11-14-271): `value` as `"-1"`, as `{num: "-1", den: "1"}` and as `"abc"`; `value` as `"-0"` and as `{num: "0", den: "1"}` with `places` `"2"` under each rule; `places` as `"2.0"`, `"-1"`, `"abc"` and a JS number 2, with `value` `{num: "4473", den: "40"}` | CCS-RF-03 `["value"]` for the negative and non-numeric values; text `0.00` for `"-0"` and 0/1 under both rules, never `-0.00`; CCS-RF-03 `["places"]` for each bad `places` |

## 12. Questions for Nadira

N2 to N8 are kept from the original, each marked with its ruling. N1 stays in the original draft (overage). N9 onward are new, arising from the rulings; Atlas has resolved none of them.

| ID | Requirement | Question or ruling |
|---|---|---|
| Q-E10R-N1 | Overage | Not carried; stays in the original draft |
| Q-E10R-N2 | E10R-F15 | RULED, NAD-2026-11-14-248: result `0` |
| Q-E10R-N3 | E10R-F15 | RULED WITH CONDITIONS, NAD-2026-11-14-249: balance of pipetted liquids, assumption travels in the result, make-up-to route never calls it |
| Q-E10R-N4 | E10R-F16 | RULED WITH CONDITIONS, NAD-2026-11-14-250 (a) to (d), -251; (e) closed by NAD-2026-11-14-256 |
| Q-E10R-N5 | Section 8 | RULED WITH CONDITIONS, NAD-2026-11-14-252 |
| Q-E10R-N6 | E10R-F14 | RULED, NAD-2026-11-14-253: `molarToMass` then `volumeFromAmount` |
| Q-E10R-N7 | Section 1 | RULED WITH CONDITIONS, NAD-2026-11-14-254: activity is in scope |
| Q-E10R-N8 | E10R-F13 | RULED, NAD-2026-11-14-255: linear only; the four line kinds are the tool's |
| Q-E10R-N9 | E10-RC-03 | RULED, NAD-2026-11-14-270: `partsTotal` and `statedTotal` are expressed in `toUnit`, both `{value, unit, exact}`, in the same unit. Confirmed |
| Q-E10R-N10 | E10R-F20, -F21 | RULED, NAD-2026-11-14-269: a zero activity or mass under any valid SA (single, bound or interval) gives the common shape `0`, with no `lower` and no `upper`; the SA is validated first |
| Q-E10R-N11 | E10R-F16 | RULED, NAD-2026-11-14-270: `percentOfFinal` displays `sig3` (100/11 shows as 9.09); the page labels it "% (v/v) of the final volume, if volumes add" |
| Q-E10R-N12 | Section 3, E10R-F20, -F21 | RULED, NAD-2026-11-14-268: the eight tokens, no prefix set; the `form` tokens; the relation tokens `">"`, `">="`, `"<"`, `"<="` and no `"="`; an interval's lower limit takes only `>` or `>=`, its upper limit only `<` or `<=`; a wrong-way relation is E10-RC-02 and an unknown relation E10-RC-01, both naming `SA.lower.relation` or `SA.upper.relation`; reversed or equal limits stay CCS-RF-03 |
| Q-E10R-N13 | E10R-F19 | RULED WITH CONDITIONS, NAD-2026-11-14-271: (a) a JS number is refused; `places` is digits-only text with no upper limit; a negative value is refused; `"-0"` and 0/1 give zero. (b) Corrected: rounding the stored double gives 2.67 for 2.675 under both rules and 111.83 for 111.825 under both rules, so 4473/40 discriminates only under half-even; scaling by 10^places in float gets 2.675 and 111.825 right under both rules, so the guard set of Example 21 adds 1.005, 1.015 and 2.345, which catch both float routes |
| Q-E10R-N14 | E10R-F18 | RULED, NAD-2026-11-14-270: `concentrateVolume` confirmed; `splitVolumes` unchanged (E10R-NF-01); `fold` is 1 part concentrate in `fold` parts total |
| Q-E10R-N15 | E10C-F12, E10R-F14 | RULED WITH CONDITIONS, NAD-2026-11-14-267: 1.2 needs both relations; E10R-F14 gains the pairs `IU` with `IU/mL` and `U` with `U/mL`, and the new E10R-F22 computes an activity concentration times a volume; same family only; E10C-F12 keeps refusing activity units (now E10-RC-02) |
| Q-E10R-N16 | E10R-F16 | RULED, NAD-2026-11-14-270: (a) w/w result shape, solute in `value` and `exact`, solvent in a `solvent` object; (b) w/w requires `reference: "final"`, Example 9 is right as written; (c) mode 3 returns the final volume and no `percentOfFinal` |

## 13. Questions for Kaito, Adacs, A.B. (not science)

| ID | Owner | Status and answer |
|---|---|---|
| Q-E10R-A1 | Adacs | **RULED, NAD-2026-11-14-272** (engineering, accepted). Keep the prefix `E10R` and the requirement classes (IN, DT, UN, RF, OU, NF). Functions: F13 to F16 kept; F17 stays reserved for the overage module (original draft); new functions are numbered from F18 (F18 `concentrateVolume`, F19 `roundDeclared`, F20 `activityToMass`, F21 `massToActivity`, and F22 `activityAmountFromConcentration`, the new -267 function at the next free number); other reserved numbers E10R-DT-05, E10R-NF-06, -07, AT-E10R-15, -16, E10-RC-04. Reason: numbers already cited by the original draft, Nadira's rulings and the overage work on T-0484 must not change meaning, so nothing is renumbered and nothing reused. Refusal codes continue at E10-RC-03 (settled, ADC-2026-11-09-06); no new code is needed (the activity refusals use CCS-RF-03 and E10-RC-01, -02) |
| Q-E10R-A2 | Adacs | **RULED, NAD-2026-11-14-272.** Every closed string is exact, case-sensitive, and E10-RC-01 naming the field when unknown, ranked at step 2 with the unit arguments: `basis` (`"w/v"`, `"v/v"`, `"w/w"`), `reference` (`"final"`, `"added"`, `"reach"`), the SA `form` (`"single"`, `"bound"`, `"interval"`), a `relation` (`">"`, `">="`, `"<"`, `"<="`) and the rounding `rule` (`"half-up"`, `"half-even"`). Reason: one rule for every closed argument is the simplest to test and to explain, and it matches how a unit not in the table is refused (E10-RC-01). A valid string used where it does not apply (`reference` `"added"` with w/v, a wrong-way `relation`) is E10-RC-02, as NAD-2026-11-14-251 (4) and -268 rule. The token names are Atlas's choice |
| Q-E10R-A3 | Kaito, Adacs | SETTLED by KAITO-D172: additive minor bump for the E10 module and the package; the number is set at build against main. Not reopened |
| Q-E10R-A4 | Adacs | **RULED, NAD-2026-11-14-272.** A failing array element is named `parts[i]` with `i` zero-based; a member of the specific-activity object is named `SA.<member>` (`SA.value`, `SA.lower`, `SA.upper`, `SA.unit`, `SA.form`, `SA.relation`), extended to nested members (`SA.lower.relation`, `SA.upper.relation`). Reason: the engine is JavaScript, where arrays are zero-based, so `parts[0]` is the first element in the code and in the fixture; the page shows its own wording ("part 1") and maps the index. No fixture would otherwise have to say which counting it means |
| Q-E10R-A5 | Adacs | **RULED, NAD-2026-11-14-272.** For E10-RC-02 when two or more units break a pairing, `fields` lists every unit field that breaks it, in argument order (as ADC-2026-11-09-05 does for E10-RC-01 and -02): E10R-F14 `["nUnit","cUnit"]`; E10R-F20 `["aUnit","SA.unit"]` or `["toUnit"]`; E10R-F21 `["SA.unit","toUnit"]`; E10R-F22 `["cUnit","toUnit"]`. And E10R-F13's refusal of a concentration `unit` carries a message naming the reason ("a concentration does not scale with the final volume"), following `scaleUnit`'s "needs a molecular weight" message (E10-RC-02, conversions spec :40). Reason: the page must say why, and a reason in the refusal stops each tool writing its own |
| Q-E10R-A6 | Adacs | Overage extraction invariance: not carried; stays in the original draft |
| Q-E10R-A7 | Kaito, A.B. | Where C5's signed URS is filed: not carried; stays in the original draft |
| Q-E10R-A8 | Kaito | SETTLED by KAITO-D171: IU and U activity conversions are in 1.2 scope. Not reopened |

## 14. Items carried into the tool URSs (not engine requirements)

| ID | For | Item |
|---|---|---|
| OI-1.2-1 | 1.2 | Percent wording: the -623 mode labels as ruled (NAD-2026-10-24-623), each basis in the words NAD-2026-10-24-546 (1) names; "volume of solvent added" is never the reference for w/v or w/w; the basis is picked by the user with no default; the page shows the formula with the user's numbers (NAD-2026-11-14-256) |
| OI-1.2-2 | 1.2 | Every page that shows an E10R-F15 number, or an E10R-F16 mode 2 or 3 number, prints "if volumes add" beside it. A parts total equal to the total reads "no diluent needed: the parts alone make <total>, if volumes add". An E10-RC-03 refusal reads "your parts total <x>, more than the <y> you set" (NAD-2026-11-14-248, -249) |
| OI-1.2-3 | 1.2 | The make-up-to-volume route prints the amounts and "bring to <final volume> with <solvent>", never a "water to add" figure, in the page, working, Learn text or any export. Rounding under a declared rule (E10R-F19) is shown as "rounded half-up to 2 decimal places from 111.825, the exact result of your entered values" |
| OI-1.2-4 | 1.2 | The four recipe line kinds of section 8, each shown on its line |
| OI-1.2-5 | 1.2 | Activity (NAD-2026-11-14-254 (6) to (8)): under a bounded SA, one-sided or interval, no "amount to add" for an activity target; the bound or range is printed and the two routes of NAD-2026-10-24-622 (3) are offered (a single value from the certificate, or a mass target); wording "at least" and "at most", no "meets" or "within"; the bounded result reads as a sentence ("at most 10 ng/mL (your lot states only a minimum specific activity)"); the lot and the source with the CoA identifier; the label "mass computed from your lot's specific activity (<value, unit, lot>)"; "U" is opaque and a different lot's figure is flagged by 1.5; X1's both-direction display |
| OI-1.2-6 | 1.2 | Learn: the three flasks of NAD-2026-10-24-623 for the reference modes, and w/w as a weighed bottle on a balance captioned "mass adds; volume may not" (Nadira's learnability notes) |
| OI-1.2-7 | 1.2 | Whether 1.2 needs per-uL activity stocks (for example a nuclease in U/uL). If it does, the tokens are added additively under a version bump, each with its factor shown, and returned to Nadira (NAD-2026-11-14-268) |
| OI-1.2-8 | 1.2 | OI-1.2-3's "from 111.825, the exact result" must be true when the exact result does not terminate (100/21, 1000/3). The 1.2 URS proposes wording, and Nadira rules on it there. This is not an engine change (NAD-2026-11-14-273 C10) |
| OI-X5-1 | X5 | The H part (DNA-binding dyes, Fc block) stays held as the master list states; the extension adds no engine function |
| OI-X7-1 | X7 | Aliquot plan held (BB-23 unsourced). Page labels every amount unit; the engine refuses `nmol` with a mass concentration (the nmol / uM unit error); a molar target from a mass uses the two-call route of E10R-F14 |

Provenance: r1 is the original draft named in the header; r2 is the file named in the Revision line; this file is r3. The overage half has no revision here.
