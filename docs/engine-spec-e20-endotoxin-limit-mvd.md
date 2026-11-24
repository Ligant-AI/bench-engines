**v0.3, for signature; rests on D-0132 r5 (signed by A.B.); do not build until this specification is signed**

# bench-engines E20: endotoxin limit and maximum valid dilution module, engine specification (T-0735, stage 3, Atlas) v0.3

| Field | Entry |
|---|---|
| Status | **For signature.** Revision of v0.2 (sha256 `5362ceba800c723869922d9b8d7ad8a78e1688a1d199054b3760b3390b62912a`, not edited) after Nadira's OLD/NEW check (changes V-01 to V-22; NAD-2026-11-24-71 to -77) and Theron's THR-2026-11-23-484. v0.2 was a revision of v0.1 after Nadira's review (NAD-2026-11-24-53 to -66, changes CH-01 to CH-22), Theron's name rulings (THR-2026-11-23-478 to -482, with two hand-back corrections noted in section 8) and Kaito's rulings KAITO-2026-11-24-17, -18, -20 to -25 and -28 (T-0735 dispatch brief, 24 Nov; -19 concerns drafting only, was not in that brief and is not used here; section 12's line on -19 is as written then). Requirement IDs (prefix `E20L-`) freeze only on A.B.'s signature (K1 as amended: A.B. signs C19 documents; this is not Nadira's recorded approval). Atlas has resolved no scientific question and made no product decision: every row that was a question now cites the ruling that closed it. Nothing was registered in records when this text was written, and nothing is built. v0.1 and the review files were not edited. Where this document says Kaito's file entry is owed, that entry was made on 24 Nov 2026 (`.claude/reports/kaito/2026-11-24-t0735-decisions.md`, KAITO-2026-11-24-17 to -30). |
| Only requirement source | `/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1-r5.md` (D-0132), sha256 `15099b7907d2d1f1a91cdfa9819508a71f91d33954d18fec099a5cdb818aeb1d`, checked with `shasum -a 256` before work: it matches. Not edited. r1 to r4, D-0131's file, the working notes, the source PDF, and every `verification/`, `reimpl/` and `runs/` path were not opened. Cited below as `ELM-xx-nn`. |
| Form patterns read (form only) | `bench-engines/docs/`: `engine-spec-0.1.0.md` (sections 2 and 6) with `engine-spec-0.1.0-erratum-2.md`; `engine-spec-e10-conversions.md` (sections 1 to 3 and the E10C-NF rows); `engine-spec-e10-scaling-activity.md` (r3.1) with AMD-3 and AMD-5 (their headers and the rules cited below). `bench-engines/package.json`: `version` is `0.2.0`. No `src`, test, fixture, verification or runs path was read. The `docs/` files are the working-tree files. Atlas did not run git in bench-engines. The base is **bench-engines `5ce4afc`**, verified in git by Kaito as the checkout HEAD (branch `t-0641-e10-scaling-activity`, package 0.2.0), KAITO-2026-11-24-17 (T-0735 dispatch brief, 24 Nov; file entry owed). The export list of `src/core.js` in section 2.5 is Kaito's (KAITO-2026-11-24-21, same form), not read by Atlas. |
| Checkout (suite) | branch `c11/preconditions`, HEAD `1b42bfe` as given at session start. |
| Location | `.claude/reports/atlas/ENGINE-SPEC-C19-endotoxin-limit-mvd-v0.3.md`. It moves to `bench-engines/docs/` only after signature. |
| Date | The session clock reads 23 Nov 2026; the dispatch brief, the review files and the file names are dated 24 Nov 2026. This draft uses **24 Nov 2026**, the date of the rulings it applies, as Nadira did for her review (she kept the caller's file-name date). |
| Guard blocks | **Four.** (1) Carried from the v0.1 run: a `sed -i` command was refused by the command guard (as Kaito's brief records it; Atlas holds no raw text of that refusal), not retried in any other form. (2) The v0.2 run: one `grep -nE` self-check over the v0.2 file was refused by cmd-guard with a message about Bram's identity files (full text in the v0.2 change list, section F); the command named no such path, not retried in any form, so the leftover-phrase check was made by reading and the mechanical check is left to the main session. (3) The v0.3 run: one command that held a cd and a cp of the v0.2 file was refused by cmd-guard (2026-11-24T02:30:10 in the command log); Atlas stopped, and v0.3 was then written by the route Cipher ruled (2026-11-24-t0735-c19-routes.md, Q1). (4) The signature-copy edits: one command that held a cd and a cp of this file to a backup was refused by cmd-guard (2026-11-24T03:17:42 in the command log); it was not retried and no backup exists. The final line of this file says the same. |
| Holds no expected output values | By Kaito's instruction this spec states **no** hand-worked number. The numbers it contains are of two kinds. **Values r5 itself states:** the preset values (5, 0.2, 0.5, 50 to 200, 0.980), `2.50` and `5/3` as printed forms in ELM-DP-01 and ELM-DP-02, and the r5 section 15 input values quoted by row ID. **Rule constants, which are rules and not outputs:** the 1000 threshold of F08; the 400-decimal-place limit of KAITO-2026-11-24-21; the bounds 0, 1 and -1 of NAD-2026-11-24-57; the year range 0001 to 9999 of NAD-2026-11-24-64. The `asWritten` strings of F02 are r5's own printed forms. Every expected value is derived by the fixture author from the signed documents (ELM section 15 rule). It holds no engine code. |
| Amendment route | The four page sentences of NAD-2026-11-24-65 and its correction to r5's F-30 inputs cell go into a **separate URS amendment before the page build**, not into this spec (KAITO-2026-11-24-28, route decision, T-0735 dispatch brief, 24 Nov; file entry owed). This spec states no page sentence of them. |

## 0. How to read the tables: the basis column

Every row has a **Basis** cell with one of three kinds, so that a design choice cannot pass for a ruling. A short citation `KAITO-2026-11-24-nn` anywhere in this file (nn from 17 to 28) means Kaito's ruling in the T-0735 dispatch brief, 24 Nov 2026; the file entry is owed (a guard refused the write of the decisions file).

| Mark | Meaning |
|---|---|
| `R5 <ID>` | The row is what r5 says (the cited `ELM-` ID). |
| `DES` | Interface design by Atlas (name, argument order, result shape, token, which function holds a rule). Kaito confirms or changes it. It makes no scientific statement. |
| `Q-AT-C19E-nn` | In v0.1 this marked a row that r5 does not settle. In v0.2 **every such question is closed**: the row carries the ruling ID (a `NAD-`, `THR-` or `KAITO-` ID) beside the question ID, and section 12 lists each question with its ruling. No row is left unspecified. |

## 1. Purpose and scope

**Pages served:** C19, "Endotoxin Limit and Maximum Valid Dilution" (ELM-OU-16 title rule; the page never shows an internal ID). The module is the engine the page builds on (ELM-NF-02). Requirements of this module are `E20L-*`.

**In this module (Mode A only; ELM section 0.2):**
- the limit from K and M, a typed limit, or a labelled preset (ELM-DT-01 to -03);
- the maximum valid dilution, MVD = L × c ÷ λ, in one exact computation, with the unit-cancel refusal (ELM-DT-04, -12, ELM-RF-06);
- the dilution check, the raw reading check, the result in the limit's own unit, the relation for `=` and for `<`, the floor check, λ × DF (ELM-DT-05 to -11);
- the ordered reasons that withhold a comparison (ELM-FL-02);
- suitability as user-declared ranges, recovery computed exactly (ELM-SU);
- the I/E screening computations (ELM-IE-03 to -08);
- exact, three-figure and reduced-fraction outputs (ELM-DP);
- the date comparisons of ELM-FL-05, an engine row (E20L-F09; KAITO-2026-11-24-24, T-0735 dispatch brief, 24 Nov; file entry owed).

**Not in this module:**
- **Mode B.** No argument for body weight, volume to give, or time exists anywhere in this module (ELM-IN-02, ELM-DT-14, ELM-RF-09, ELM section 11). The word-level absence is an acceptance row (AT-E20L-04).
- Every string the user reads (labels, sentences, help text, why-we-ask text, quotations): page. The engine returns closed tokens and numbers, never a sentence.
- Export files, "File created" line, version line, CSV cell guard, privacy, accessibility: page (ELM-OU, -ST, -NF-05 to -10).
- Any radiopharmaceutical, body-surface or pooled-unit form (ELM section 0.3); any molecular-weight, density, specific-activity or reagent table. The engine holds no table except the five preset entries of E20L-F02.

## 2. Base, engine number, version, reliance

### 2.1 Base commit (KAITO-2026-11-24-17 (T-0735 dispatch brief, 24 Nov; file entry owed))

The module is written against **bench-engines `5ce4afc`**, verified in git by Kaito as the checkout HEAD (branch `t-0641-e10-scaling-activity`, package 0.2.0; E10 module line 0.3.0), the engine live in C14 today. r5's ENG row ("`origin/main` at `230e20a`: `src` = core, E10, E7, E9") is **Nadira's 23 Nov reading** (ELM Sources, ENG), made without opening bench-engines; it is not the base. `origin/main 230e20a` is older. The module needs from the base only what section 2.5 lists.

### 2.2 Separate module (KAITO-2026-11-24-18 (T-0735 dispatch brief, 24 Nov; file entry owed))

A new, separate module in the directory **`src/e20/`**. Nothing in `src/core.js`, `src/e7`, `src/e9` or `src/e10` is edited. The edits allowed **outside** `src/e20/` are exactly these, and no others:

| File | Allowed edit |
|---|---|
| `src/index.js` | one export line: `export * as e20 from './e20/index.js';` (the `version()` function is not edited) |
| `src/version.js` | the version fields, in the version commit only (section 2.4) |
| `package.json` | the version field, in the version commit only; no dependency |
| `CHANGELOG` | an entry |
| `README` | an entry |
| tests | the new module's tests and fixtures; no existing test is changed except for the engine version fields of section 2.4 |

It adds no dependency (ELM-NF-04, E10C-NF-04). The `src/index.js` export line is an exported name of the module and so falls inside the section 8 scope, item (2).

### 2.3 Engine number: **E20**

**Assigned: E20** (KAITO-2026-11-24-06 gives Atlas the choice). Module id string `"E20"`; requirement prefix `E20L-`; refusal codes `E20-RC-nn`.

Alternatives weighed and the reason for the choice:

| Option | Reason against |
|---|---|
| A letter suffix on an existing number (for example `E10b`) | It reads as part of E10's family and invites an edit to E10, which KAITO-2026-11-24-18 forbids. The suffix also collides in speech with the tool "C10" and its sub-numbering (E10C, E10R). |
| E19 | The programme's engine numbers E1 to E19 are all taken ("no number free": Kaito's brief, KAITO-2026-11-24-06; `.claude/suite/tool-programme.md` line 5 gives only "94 pages, 19 engines, 10 release trains"). E19 would also be confused with the tool C19 (engine E19 is a different engine). |
| A named module with no E-number | Every result carries `engine.module` (0.1.0 section 2). A module with no id breaks that convention and the ledger of engines, and it leaves the clean-room and fixture folders without a stable name. |
| **E20** | Unique, unambiguous, sorts after the programme's range, and does not disturb any programme engine. |

**Ruled (Q-AT-C19E-01, NAD-2026-11-24-53):** E20 is accepted as number, module id and prefix. 20 engines: E1 to E19 and E20. It does not go inside an existing engine. Wording for any count: "20 engines: E1 to E19 of the programme, and E20 (3.10(a), added 23 Nov 2026)". The page count does not change.

### 2.4 Version (ruled)

| Item | Rule | Basis |
|---|---|---|
| Module line | `E20` `moduleVersion` `0.1.0` | DES |
| Package | additive minor bump, **0.2.0 to 0.3.0**. The version fields change **in the version commit only**, not in any other commit of the build | KAITO-2026-11-24-20 (T-0735 dispatch brief, 24 Nov; file entry owed); Q-AT-C19E-02 |
| Note | The package `version` is copied into every module's `engine` object (0.1.0 section 2; E10C-NF-05), so the version commit changes the `engine.version` string in the fixture expectations of every module, as E10C-NF-05 did for 0.1.1. That is the only change to existing tests (E20L-NF-06) | DES |

### 2.5 What the module relies on (existing spec rows and the exports of `src/core.js`)

**Exports of `src/core.js` (KAITO-2026-11-24-21, T-0735 dispatch brief, 24 Nov; file entry owed; Q-AT-C19E-03, Q-AT-C19E-04):** `rat`, `add`, `sub`, `mul`, `div`, `cmp`, `R`, `isInt`, `parse`, `isBlank`, `incomplete`, `rejected`, `done`, `missingOf`, `display`, `DISPLAY_MODES`, `registerModule`, `engineBlock`. Everything the module needs is exported: **no change to `src/core.js`**. One implementation of each is reused, never copied (CCS-NF-01). Points Kaito settled:

- `display` accepts `{num, den}`.
- The terminating test (the reduced denominator has no prime factor other than 2 and 5) is **new code in E20**, not in core.
- `display('exact')` **throws** when the value does not terminate and beyond 400 decimal places. E20 therefore tests first, and in both cases returns `decimal` `null` with the `fraction`. A refusal is a returned object and a thrown error from `display` never reaches a caller (E20L-NF-03).
- **No import from `src/e10/`.**
- `toNumber` is **not used** (E20L-NF-01).
- `isBlank` does not itself treat objects: E20 handles the object slots (E20L-IN-02, section 4.1).
- The rows below name the signed spec row each use rests on.

| Needed | Existing row | Used for |
|---|---|---|
| Plain decimal text input; anything else `rejected` | 0.1.0 section 2 "Inputs" (ADC-2026-10-26-07); E10C-IN-01; `parse` of core, pattern in E20L-IN-01 | every numeric argument |
| Exact rational arithmetic; `exact: {num, den}` as reduced decimal-integer strings, `den` positive, sign on `num`, zero as `0/1`; one unrounded chain | E10C-NF-02, E10C-NF-03; ADC-2026-11-09-04 | every computed value |
| Equality and order of two exact values by cross-multiplication | E10C section 5 (precision statement: equality of `exact` by cross-multiplication) | every comparison |
| Display modes `sig3`, `sci3`, `exact`, their carry rule and "exact zero prints `0`" | 0.1.0 section 6 (rows `sci3`, `sig3`, `exact`, "Exact zero", "Carry"); display functions take `exact` (E10C-NF-02) | E20L-F08 |
| Refusal is a returned object, never a throw; `incomplete` and `rejected`; `fields`, `indices: []` | 0.1.0 section 2 "Refusal", "Missing declarations" | every function |
| The `engine` object on every result | 0.1.0 section 2 "Engine version field" | every result |
| Order of statuses | 0.1.0 section 2; E10C section 2 (ADC-2026-11-09-05) | E20L-RF-01 |
| Absent equals null; malformed is not missing | E10R-AMD-3 item 2 (NAD-2026-11-14-352 (a)) and item 3; E10R-AMD-5 items 1 and 2 | adopted as this module's own rules (E20L-IN-02, E20L-RF-04); they are not imported from E10 |

**Not relied on, not imported:** nothing from `src/e10/`; `toNumber`. E10 functions (`strengthFactor`, `splitVolumes`, E10C-F03 to -F12, E10R-F13 to -F23), E7, E9, any E12. `roundDeclared` (E10R-F19) is not used: ELM-DP-01's rule is fixed, not user-declared. Mode A needs no other engine (ELM-NF-02).

## 3. Conventions

Everything in 0.1.0 section 2 and E10C section 2 applies unchanged unless a row below says otherwise. Requirement IDs are `E20L-<class>-<nn>`; classes IN (input), F (function), NF (non-functional), RF (refusal), AT (acceptance; written `AT-E20L-nn`), **X (engine-only fixture situation, written `E20L-X-nn`; section 9.2)**. An X row is a fixture-input description, not a requirement on the build; it is frozen with the document. IDs never appear in a result object.

| ID | Rule | Basis |
|---|---|---|
| E20L-IN-01 | **Decimal text, never binary floats.** Every numeric argument is plain decimal text (0.1.0 section 2, ADC-2026-10-26-07). **Type test first:** a value that is not a string, of any other type (a JS number, a bigint or anything else), is CCS-RF-03 with reason `wrong-form` in **every** numeric argument, because core's `parse` also accepts numbers and bigints and E20 must not (the precedent is E10R-F19, "A JS number is refused"). **Pattern (the pattern of core's `parse`, unchanged):** after trimming surrounding whitespace, `^[+-]?(\d+\.?\d*\|\.\d+)$`. So `.5`, `5.`, `+5` and surrounding spaces are accepted; a lone sign, `1,5`, `2e5`, `NaN`, unit suffixes and any other form are `rejected`, CCS-RF-03, reason `not-plain-decimal` (the sentence "Use digits and a decimal point only." is the page's). A sign is part of the pattern, so that a negative reads as `negative` or `not-above-zero` and not as malformed. For `resultValue` the leading `>` or `≥` test of E20L-F05 (NAD-2026-11-24-55) comes **before** this pattern. `\d` means ASCII `0` to `9`, the pattern matches the whole trimmed text, and whitespace (here, in E20L-IN-02 and in E20L-F05) is what JavaScript `String.prototype.trim` removes. The page parses nothing: it passes the typed text unchanged | R5 ELM-IN-13, ELM-NF-01; KAITO-2026-11-24-22 (T-0735 dispatch brief, 24 Nov; file entry owed); Q-AT-C19E-04 |
| E20L-IN-02 | **Null, absent and blank are the same.** A required argument, member or array element that is `null`, left out, or blank text (empty or whitespace-only) is not declared and gives `incomplete` with the same name in each case (adopts E10R-AMD-3 item 2 and AMD-5 item 1 as this module's own rule). "Required" means required by the declared `form` (E20L-IN-04) and by the dependency rule of section 4.1 step (1). Core's `isBlank` does not itself treat objects: E20 tests an object slot for `null` or absent, and a present value of the wrong form is `wrong-form` (E20L-RF-04) | DES (rule adopted by citation); NAD-2026-11-24-66 |
| E20L-IN-03 | **Closed strings** are exact and case-sensitive. The complete list is section 4.3; any other present value in a closed-string argument that is read, text or not, is E20-RC-01 (never `wrong-form`), except `resultQualifier` exactly `">"` (section 4.2). Blank is `incomplete` (E20L-IN-02) | DES; R5 ELM-IN-17, -IN-10 |
| E20L-IN-04 | **A member is read only when the declared form uses it.** A member the form does not use is not missing when absent and is not read when present (AMD-3 item 2, last sentence). The result echoes what was used (for example the concentration actually used, E20L-F03) so a page can print it. When D is mL, `c` and `cUnit` are not read even if supplied (E20L-F03) | DES; KAITO-2026-11-24-23 (T-0735 dispatch brief, 24 Nov; file entry owed); Q-AT-C19E-15 |
| E20L-IN-05 | **Free-text source members** (the "source string, required" of ELM-IN-03, -IN-04, -SU-05, -IE-03, -IE-04) are required to be non-blank. The **presence** is checked and named in `missing`; the engine never reads, interprets, trims for display, **stores or returns** their content (any present value that is not blank counts as declared, text or not) | R5 ELM-IN-03, -SU-05; DES; KAITO-2026-11-24-23 (same form); Q-AT-C19E-16 |
| E20L-IN-06 | **No Mode B argument.** No function of this module has an argument or member for body weight, volume to give, or time. There is no function that takes them, so ELM-RF-09 is true by construction | R5 ELM-IN-02, -DT-14, -RF-09 |
| E20L-NF-01 | **Exact rational arithmetic from input to output.** Inputs are parsed exactly; each call forms its whole chain as one exact rational and rounds nowhere inside the engine. Comparisons are by cross-multiplication on exact values, never on display strings and never on any rounded figure. **No result member is a JS number** (stricter than E10, which returns a convenience `value`): there is nothing a page could mistakenly compare or display. Core's `toNumber` is not used (KAITO-2026-11-24-21) | R5 ELM-NF-01, ELM-DT-12, ELM-DT-07 |
| E20L-NF-02 | **One chain per computed value.** MVD is formed from K, M (or L), c and λ in one exact computation (E20L-F03). A value that has passed through a division is never re-entered as decimal text. Where one call needs another call's value (E20L-F04 takes the MVD), it takes the `exact` object `{num, den}` of that result and nothing else (the E10R-AMD-2 precedent: only `exact` objects carry a computed value into a test). A function that takes `exact` and receives anything else (text, a number, an array, an object without integer-string `num` and positive integer-string `den`, **or, for the `mvd` argument of E20L-F04 only, with `num` zero or negative**) refuses it as a malformed value, CCS-RF-03, reason `wrong-form`, naming the argument. E20L-F08 accepts a zero or negative `num`. "Integer string" means the whole of `num` matches `-?[0-9]+`, and the whole of `den` matches `[0-9]+` and is above zero. `num` and `den` need not be in lowest terms (NAD-2026-11-24-66 item 5; CH-11) | R5 ELM-DT-12; DES |
| E20L-NF-03 | **Numeric object.** Every computed value is returned as the object of section 5.1. The three forms of ELM-DP-03 (exact decimal where it terminates, reduced numerator and denominator where it does not, three-figure string) are members of it. **No throw reaches a caller:** core's `display('exact')` throws on a non-terminating value and beyond 400 decimal places, so E20 tests termination first (section 2.5) and in either case returns `decimal` `null` with the `fraction` | R5 ELM-DP-02, -DP-03; DES; KAITO-2026-11-24-21 |
| E20L-NF-04 | **Deterministic.** Same inputs and same version, same outputs. No random numbers, no network, no dependency, no clock (E10C-NF-04). The module reads no date of its own: the date comparison of E20L-F09 takes the dates as arguments | R5 ELM-NF-04 |
| E20L-NF-05 | **Engine object.** Every result and refusal carries `engine: {package: "@ligant/bench-engines", version, module: "E20", moduleVersion}` (0.1.0 section 2). Versions as section 2.4 | R5 ELM-OU-06 |
| E20L-NF-06 | **Additive only.** No existing function, input, output, refusal, test or display mode in any module changes, except the engine version fields of section 2.4, which change in the version commit only. **No edit to `src/core.js`, `src/e7`, `src/e9` or `src/e10`.** The only edits outside `src/e20/` are those listed in section 2.2 (one export line in `src/index.js`, `src/version.js`, `package.json`, CHANGELOG, README, tests). Core exports everything the module needs (section 2.5), so no core change and no copy exist (CCS-NF-01) | KAITO-2026-11-24-18, -20, -21 (T-0735 dispatch brief, 24 Nov; file entry owed) |
| E20L-NF-07 | **Isolation of the I/E screen.** E20L-F07 is a pure function of its arguments and keeps no state between calls. No result of E20L-F07 is an argument of any other function of this module, and no E20L-F07 value enters E20L-F05 (the main comparison). The main limit enters the I/E screen as an input, never the reverse | R5 ELM-IE-10 |
| E20L-NF-08 | **Name rule (THR-2026-11-23-452, -470; ELM-OU-12).** No module, function, argument, member, result key, closed-string token, status or code string, reason token, preset id, directory or file name of this module contains any term of the scan list of section 8. The same rule binds the CSV headers and JSON keys the page derives from them (the page's rows are checked at AT-ELM-14). The rule is mechanical: AT-E20L-03. Zero hits **outside the exemptions of section 8** | R5 ELM-OU-12; THR-452, -470, -478 to -481 |

## 4. Statuses, refusals and tokens

### 4.1 Order of statuses (as E10C section 2 and ADC-2026-11-09-05, extended by AMD-3 and AMD-5)

| Step | Rule |
|---|---|
| (1) | Any required argument or member `null`, absent or blank: `incomplete`, `missing` lists **every** missing name in argument order (a member as `limit.value`, `suitability.recovery.range.low`, an array element as `curves[0].channels[1].DF`, zero-based). Nothing else is evaluated. A free-text source member counts here (E20L-IN-05). **Dependency rule (NAD-2026-11-24-66 item 1; CH-06):** a member whose need depends on a closed string is required only when that string is known and allowed in its role. So an unknown or wrong-role `limit.form`, `limit.unit`, `limit.Munit`, `limit.presetId`, `range.form` or `criterion.form` makes the members that depend on it not required, and likewise `c` and `cUnit` when they depend on D; an unknown `resultQualifier`, or `">"`, makes `highestStandard` not required; a present value of the wrong form in an object slot (a `limit`, `suitability`, `sampleCV`, `spikeCV`, `recovery`, `range`, `recoveryRange`, `criterion`, `curves` element or `channels` element that is not an object; an array is not an object) makes that object's members not required, and the slot itself is `wrong-form` at step (3). E20-RC-03 is judged only when D is known. With `"other"`, `c` and `cUnit` are required whatever the label; a non-text `otherLabel` or a non-text `cUnit` is `wrong-form` and E20-RC-03 is then not judged. A missing closed string (`limit.form`, `limit.presetId`, `range.form` and so on) is named alone, without the members that depend on it. **Names of null containers, where required:** `limit` (not in E20L-F07, where `null` means no limit declared), `recoveryRange`, `criterion`, `curves`, `curves[i]`, `curves[i].channels` and `curves[i].channels[j]` are named themselves. Inside `suitability` the leaves are named, never the container: `sampleCV.value`, `.max`, `.source`; `spikeCV.value`, `.max`, `.source`; `recovery.B`, `.A`, `.added`, `.basis`, `recovery.range.form`, each with `suitability.` in front (when `range.form` is known, its own members follow it) |
| (2) | Otherwise closed-string and unit refusals, **one** `rejected` result: E20-RC-01 if any closed string is unknown (`fields` names only the unknown ones); else E20-RC-02 if any closed string is known but not allowed in this call; else E20-RC-03 if the concentration unit does not match the limit's denominator. CCS-RF-03 is not evaluated at this step |
| (3) | Otherwise **all** CCS-RF-03 value conditions of the call together, one `rejected` result: `fields` in argument order, `reasons` as in section 4.2. A present value of the wrong form (an object where text is wanted, a non-array where an array is wanted, an `exact` that is not an object) is malformed, not missing: CCS-RF-03 naming the argument (AMD-3 item 3; AMD-5 items 1 and 2). It is evaluated here, after any `incomplete` and after any step (2) refusal |
| (4) | There are no derived refusals in this module. A call returns at most one `rejected` result |

A relation that the user's numbers make true (DF above MVD, a result above the limit, a recovery outside a range) is **never a refusal**. It is a returned value (ELM-DT-13: calculated values stay visible; "refusals cover only values that are impossible", ELM section 6).

**Refusal requirement rows (frozen on signature).**

| ID | Rule | Basis |
|---|---|---|
| E20L-RF-01 | **Order of statuses.** Every function applies the steps (1) to (3) of the table above in that order; step (4) is that there are no derived refusals. At most one `rejected` result per call | R5 ELM-RF-01 to -08; 0.1.0 section 2; E10C section 2; DES |
| E20L-RF-02 | **Codes.** The codes are exactly the **five** rows of the table of section 4.2 (CCS-RF-01, CCS-RF-03, E20-RC-01, E20-RC-02, E20-RC-03), module-wide, never renumbered or reused | DES (E10 rule, ADC-2026-11-09-06) |
| E20L-RF-03 | **Reasons.** A CCS-RF-03 result carries `reasons` as stated in section 4.2, one reason per field, tokens exactly those of the reason table | R5 ELM-RF-02 to -05, -07 |
| E20L-RF-04 | **Malformed is not missing.** A present value of the wrong form is CCS-RF-03 at step (3), naming the argument, with reason `wrong-form`; it is never `incomplete` | DES (AMD-3 item 3; AMD-5 items 1 and 2) |
| E20L-RF-05 | **Impossible only.** A relation the user's numbers make true is never a refusal (the paragraph above) | R5 ELM-DT-13, ELM section 6 |

### 4.2 Refusal codes and CCS-RF-03 reasons

| Code | Status | Meaning | `fields` | Basis |
|---|---|---|---|---|
| CCS-RF-01 | `incomplete` | Section 4.1 step (1). Result: `{status: "incomplete", code: "CCS-RF-01", missing, engine}` (the `code` is carried as E10 carries it) | n/a | R5 ELM-RF-01, -RF-08 |
| CCS-RF-03 | `rejected` | Section 4.1 step (3); carries `reasons` | the faulty arguments | R5 ELM-RF-02, -03, -04, -05, -07 |
| E20-RC-01 | `rejected` | A closed string that is not in the list of section 4.3 | the unknown ones, argument order | DES (E10-RC-01 pattern) |
| E20-RC-02 | `rejected` | A closed string in the list but not allowed in this call: `technique` `"gel-clot"` in E20L-F05 (ELM-IN-17: the result block is not offered); a preset id of the wrong kind for its role (for example `"preset-4"` as a limit) | the fields | DES; R5 ELM-IN-17; KAITO-2026-11-24-24 (Q-AT-C19E-19) |
| E20-RC-03 | `rejected` | The concentration unit is not `[D]` per mL for the limit's D (ELM-RF-06). The sentence is the page's | `["cUnit"]` | R5 ELM-RF-06, -UN-02, -UN-03 |

Codes are module-wide, never renumbered or reused (the E10 rule, ADC-2026-11-09-06). A code never contains a term of section 8.

**Reasons.** A CCS-RF-03 result carries `reasons`, a list of `{fields, reason}` in argument order (`fields` has one name, or two for `highest-not-above-lambda` and `low-above-high`). If both `resultQualifier` and `resultValue` carry the `>` fault, two entries, in argument order (NAD-2026-11-24-55). `fields` of the result is the union, argument order. One reason per field.

| Reason token | Condition | Page sentence it selects | Basis |
|---|---|---|---|
| `not-plain-decimal` | A string that does not match the pattern of E20L-IN-01 | "Use digits and a decimal point only." | R5 ELM-RF-07 |
| `not-above-zero` | A field that must be above zero is zero or less: K, M, the typed limit, λ, c, the highest standard, the added amount | "[field label] must be above zero." | R5 ELM-RF-02 |
| `below-one` | DF below 1 (DF is dimensionless, 1 or more) | "Parts total must be 1 or more (1 means undiluted)." | R5 ELM-RF-02, ELM-IN-08 |
| `negative` | The result value (whatever the qualifier; test (iii) of E20L-F05), a suitability B, A, sample CV value, spike CV value or CV maximum is below zero. Zero is accepted. Never together with `not-above-zero` on one field | "[field label] must be zero or more." | R5 ELM-RF-03; NAD-2026-11-24-56, -57 |
| `greater-than-not-a-quantity` | A qualifier that is exactly `">"`, or result text whose first character after leading whitespace is U+003E or U+2265 (E20L-F05) | the ELM-RF-04 sentence | R5 ELM-RF-04; NAD-2026-11-24-55 (Q-AT-C19E-05) |
| `wrong-form` | A present value of the wrong form: **any non-string (a JS number, a bigint, anything else) where decimal text is wanted (E20L-IN-01)**; text, a number or an array where an object is wanted; a non-array where an array is wanted; an `exact` that is not `{num, den}` of integer strings, or, for F04's `mvd` only, with `num` zero or negative (E20L-NF-02); a non-text `otherLabel`; a non-text `cUnit` where it is read; a non-text date (E20L-F09). Not `incomplete`, because something was declared (AMD-3 item 3, AMD-5) | no page sentence: it cannot arise from the page's own text fields; it is a programming fault the page shows as a general error | DES |
| `highest-not-above-lambda` | Both the highest standard and λ pass their own checks and the highest standard is not above λ. Names both fields (ELM-RF-05: "Both fields named") | "The highest standard must be above λ." | R5 ELM-RF-05 |
| `low-above-high` | Both ends of a range pass their own checks and the low end is above the high end. Names both fields, low first. Low equal to high is accepted; a negative bound is accepted. Applies to F06's range and F07's range | NAD-2026-11-24-65; in the URS amendment (KAITO-2026-11-24-28 route, header table) | NAD-2026-11-24-57 |
| `outside-zero-to-one` | An \|r\| criterion value below 0 or above 1 (0 and 1 accepted). Not judged when no `r` is entered, because the criterion is then not read | NAD-2026-11-24-65; in the URS amendment (KAITO-2026-11-24-28 route) | NAD-2026-11-24-57 |
| `outside-minus-one-to-one` | An `r` below -1 or above 1 (-1 and 1 accepted) | NAD-2026-11-24-65; in the URS amendment (KAITO-2026-11-24-28 route) | NAD-2026-11-24-57 |

The negative, range, maximum and `r` questions (Q-AT-C19E-06, -07) are closed by NAD-2026-11-24-56 and -57; the rows above and in F06 and F07 are the whole behaviour. Page sentences for the three new reasons are not stated in this spec (KAITO-2026-11-24-28).

### 4.3 Closed strings (complete list)

| Argument or member | Allowed strings | Source |
|---|---|---|
| `limit.form` | `"typed"`, `"km"`, `"preset"` | ELM-IN-02 |
| `limit.unit` (typed) | `"EU/mL"`, `"EU/mg"`, `"EU/Unit"`, `"other"` | ELM-IN-03 |
| `limit.Munit` (km, or preset 1 or 2) | `"mL"`, `"mg"`, `"Unit"`, `"other"` | ELM-IN-04 |
| `limit.presetId`, `range.presetId`, `criterion.presetId` | `"preset-1"` to `"preset-5"` (section F02) | ELM-IN-05, -SU-03, -IE-04 |
| `technique` | `"gel-clot"`, `"turbidimetric"`, `"chromogenic"`, `"fluorimetric"` | ELM-IN-17 |
| `resultQualifier` | `"="`, `"<"`. The string `">"` is not "unknown": it is the reason `greater-than-not-a-quantity`. Every other string, `">="` and `"≥"` included, is E20-RC-01 (NAD-2026-11-24-55) | ELM-IN-09, -RF-04 |
| `reagentType` | `"lal"`, `"rcr"`, `"rfc"` (the page maps them to the ELM-IN-10 labels). `null` is allowed and is not missing (section F05) | ELM-IN-10, -RF-08 |
| `suitability.recovery.basis` | `"as-measured"`, `"times-df"` (NAD-2026-11-24-54: they name ELM-IN-11 (a) "as measured in the tested dilution" and (b) "multiplied by the dilution factor") | ELM-IN-11 |
| `range.form`, `criterion.form` | `"declared"`, `"preset"` | ELM-SU-03, -IE-04 |
| `cUnit` | not a closed list: see E20L-F03 (a fixed pairing, or text equal to the typed label plus `/mL`, character for character) | ELM-UN-02 |

Any further closed string (a status, a relation, a reason) is output only.

## 5. Shapes

### 5.1 The numeric object

```
{ exact: {num, den}, decimal, fraction, display, unit }
```

| Member | Rule | Basis |
|---|---|---|
| `exact` | reduced decimal-integer strings, `den` positive, sign on `num`, zero as `0/1` (E10C-NF-02) | R5 ELM-DP-03 |
| `decimal` | the exact decimal string, minimal (the `exact` mode of 0.1.0 section 6: no trailing zeros, zero is `0`), when the value terminates **and its expansion has at most 400 decimal places**; otherwise `null`. A value terminates when the reduced `den` has no prime factor other than 2 and 5 (this test is new code in E20; section 2.5). Where `decimal` is `null` the page prints the `fraction` (ELM-DP-02) | R5 ELM-DP-02, -DP-03; KAITO-2026-11-24-21 |
| `fraction` | the string `num/den`, always present. The page prints it, with the unit, on screen when `decimal` is `null` (ELM-DP-02); exports carry it beside the three-figure string (ELM-DP-03) | R5 ELM-DP-02, -DP-03 |
| `display` | the three-figure string of E20L-F08, from `exact`, rounded once | R5 ELM-DP-01 |
| `unit` | a string built by the engine (for example `EU/mL`, `EU/` followed by the typed label for "other", `mg/mL`, `%`), or `null` for a dimensionless value (MVD, DF, the ratio of E20L-F07) | R5 ELM-UN-04, -UN-05 |

A zero value has `display` `0`, never `-0` (ELM-DP-05); the text `"-0"` is zero.

### 5.2 Denominator descriptor

`denominator: {kind, label}`. For `kind` `"mL"`, `"mg"`, `"Unit"` the `label` is the same string; for `"other"` the `label` is the user's typed text, **exactly as typed** (the page echoes it; the engine does not alter it). Blank or whitespace-only is `incomplete`; any other text is accepted as typed, with `/`, spaces and either case allowed, and with no trimming, case folding or Unicode normalisation; a non-text `otherLabel` is `wrong-form` (NAD-2026-11-24-63; Q-AT-C19E-14).

## 6. Functions

Every function: `incomplete` on a required argument that is null, absent or blank (E20L-IN-02); the `engine` object on every result and refusal; statuses ordered per section 4.1; a refusal is a returned object, never a throw. Function numbers are `E20L-F01` to `E20L-F09`. Argument order is the order of the signature and is the order of `missing` and `fields`.

**Printed-exact flag (used by F04, F05, F06, F07).** `printExact` is true when the two values being compared have **identical `display` strings (E20L-F08) and different exact values**. The page then prints both exact values (ELM-DP-02, CALC-03). The identity is tested by the engine so that the page compares nothing. Ruled (NAD-2026-11-24-62; Q-AT-C19E-13): "look equal" means identical `display` strings with different exact values. The pairs that carry the flag are:
- the four of ELM-DP-02: R against L, DF against MVD, raw against each bound it is compared with (λ and the highest standard), x against L;
- under DP-02's general sentence: the F06 recovery against low or high (one flag, true if either); the F05 floor against y (`null` for `=`); the F07 channel DF against MVD (`null` with no limit).

Not flagged: CV values, `r` and I/E recoveries. They print as typed (E20L-F05 note and section 7), so no rounding can hide the relation.

### E20L-F01 `resolveLimit(limit)`

| Item | Specification |
|---|---|
| Purpose | Turn the declared limit source into L in EU per [D], with its parts, for the working line "K ÷ M = ..." (ELM-DT-01 to -03) |
| `limit` | an object, member order as listed. **`form` `"typed"`:** `form`, `value`, `unit`, `otherLabel`, `source`. **`form` `"km"`:** `form`, `K`, `KSource`, `M`, `Munit`, `otherLabel`, `MSource`. **`form` `"preset"`:** `form`, `presetId`, `M`, `Munit`, `otherLabel`, `MSource` (the three M members are read only for `"preset-1"` and `"preset-2"`). `otherLabel` is read only when `unit` or `Munit` is `"other"`. `value`, `K`, `M` are decimal text. K has no unit member: it is fixed EU/kg (ELM-IN-04) |
| Relation | **Typed:** L = `value`, in the typed unit, no computation (ELM-DT-02). **K and M:** L = K ÷ M, K in EU/kg, M in [D]/kg, L in EU per [D], where D is the unit chosen for M (ELM-DT-01, ELM-IN-04). **Preset:** presets 1 and 2 supply K from the table of F02 and then the K and M relation applies with the typed M; preset 3 supplies L and D = mL and then the typed relation applies (ELM-DT-03). One exact chain; no rounded value |
| Result | `{status: "result", form, L, denominator, K, M, presetId, kFromPreset, engine}`. `L` is a numeric object with `unit` `EU/` plus the denominator label; `K` (unit `EU/kg`) and `M` (unit the label plus `/kg`) are numeric objects, `null` for a typed limit and for preset 3 (M `null` there too); `presetId` is the id or `null`; `kFromPreset` is true for presets 1 and 2, so the page can append "; FDA writes this as [K] EU/kg body weight/hour" (ELM-IN-04, ELM-UN-06) |
| Refusals | **Incomplete:** any required member of the declared form (names as `limit.value`, `limit.source`, `limit.Munit`, `limit.otherLabel`, and so on; a `null` `limit` is `["limit"]`; a `limit` without `form` is `["limit.form"]`; a blank or whitespace-only `otherLabel` where read). The source members count (E20L-IN-05). A `limit` that is present but not an object is `wrong-form` `["limit"]` and none of its members is required (section 4.1 step (1); NAD-2026-11-24-66 item 7). A non-text `otherLabel` is `wrong-form` (NAD-2026-11-24-63). **E20-RC-01:** unknown `limit.form`, `limit.unit`, `limit.Munit`, `limit.presetId`. **E20-RC-02:** `limit.presetId` of preset 4 or 5. **CCS-RF-03:** `limit.value`, `limit.K`, `limit.M` not plain decimal (`not-plain-decimal`) or zero or less (`not-above-zero`) |
| Basis | R5 ELM-DT-01, -02, -03, -IN-02 to -05, -UN-02; DES for names and shape |

### E20L-F02 `listPresets()`

| Item | Specification |
|---|---|
| Purpose | The closed table of the labelled preset values, so that no page holds a copy of a number (one implementation). The values are those of r5 and **no others** |
| Arguments | none |
| Result | `{status: "result", presets: [...], engine}`: five entries, each `{presetId, kind, ...}` with numeric objects, and beside each number a text member `asWritten` (for a range, `lowAsWritten` and `highAsWritten`) holding the digits exactly as r5 writes them. Members: presets 1 and 2 `{presetId, kind, value, asWritten}`; preset 3 `{presetId, kind, value, denominator, asWritten}`; preset 4 `{presetId, kind, low, high, lowAsWritten, highAsWritten}`; preset 5 `{presetId, kind, value, asWritten}`, its `value.unit` `null`; in order `"preset-1"` to `"preset-5"`. "Bounds included" and "absolute value" below describe use and are not members. The digits: `5`, `0.2`, `0.5`, `50`, `200`, `0.980`. The page prints that text, because `display` gives three figures and `decimal` drops trailing zeros, so neither prints r5's `5`, `50` or `0.980` (NAD-2026-11-24-66 item 3; CH-10) |
| Entries | `"preset-1"`: kind `"k"`, 5, unit EU/kg, `asWritten` (ELM-IN-05 (1)). `"preset-2"`: kind `"k"`, 0.2, unit EU/kg, `asWritten` (ELM-IN-05 (2)). `"preset-3"`: kind `"limit"`, 0.5, unit EU/mL, denominator mL, `asWritten` (ELM-IN-05 (3)). `"preset-4"`: kind `"range"`, low 50, high 200, unit `%`, bounds included, `lowAsWritten`, `highAsWritten` (ELM-SU-03, ELM-SU-07). `"preset-5"`: kind `"r-criterion"`, value 0.980, applied to the absolute value, `asWritten` (ELM-IE-04) |
| Not held | The label text, the "recommended" word, the source strings and the quotations (page: ELM-IN-05, ELM-OU-03). No preselection exists (ELM-IN-05); the engine has no default and never infers a route |
| Basis | R5 ELM-IN-05, -SU-03, -IE-04; DES for holding the table in the engine: ruled, the preset table is in the engine (KAITO-2026-11-24-24 (T-0735 dispatch brief, 24 Nov; file entry owed); Q-AT-C19E-18); NAD-2026-11-24-66 item 3 |

### E20L-F03 `mvdFromLimit(limit, technique, c, cUnit, lambda)`

| Item | Specification |
|---|---|
| Purpose | MVD = L × c ÷ λ in one exact computation, with the concentration term tied to the limit's denominator, and the technique's effect on what λ means and whether a result block exists (ELM-DT-04, -DT-12, ELM-IN-06, -IN-07, -IN-17) |
| Inputs | `limit` as F01; `technique` (section 4.3); `c` decimal text and `cUnit` text, **read only when D is not mL**; `lambda` decimal text, EU/mL |
| Concentration unit rule (D is the denominator kind) | D `"mL"`: `c` and `cUnit` are not read (the page does not offer them; c is 1 mL/mL, ELM-IN-06). D `"mg"`: `cUnit` must be `"mg/mL"`. D `"Unit"`: `cUnit` must be `"Units/mL"`. D `"other"`: `cUnit` must equal the label exactly as typed followed by `/mL`, compared as exact text, character for character, with no trimming, case folding or normalisation, so text that differs only by a space or case is E20-RC-03 (ELM-UN-02, J-6; NAD-2026-11-24-63). **Any other `cUnit` string, whether or not it names a real unit, is E20-RC-03.** There is no conversion between units: no factor table exists in this module (ELM-UN-03) |
| Relation | `MVD = (L × c) ÷ λ`, with L in EU per [D], c in [D] per mL (exactly 1 when D is mL), λ in EU/mL; L × c is in EU/mL and the quotient is a pure number (ELM-DT-04, ELM-UN-05). One exact chain from `limit` members, c and λ. For K and M this is `(K × c) ÷ (M × λ)` as one rational; the intermediate L is **not** a separate rounded or re-entered value (ELM-DT-12) |
| Result | `{status: "result", mvd, Lc, L, c, cFixed, lambda, technique, lambdaMeaning, resultBlockOffered, denominator, K, M, presetId, kFromPreset, engine}`. `mvd` is a numeric object with `unit` `null`. `Lc` is L × c (unit EU/mL). `c` is a numeric object (unit `mg/mL` for mg, `Units/mL` for Unit (ELM-UN-02), the label plus `/mL` for "other", and `mL/mL` with `cFixed` true when D is mL). `lambdaMeaning` is `"labelled-sensitivity"` for `"gel-clot"` and `"lowest-standard"` for the three curve techniques (ELM-IN-07's two labels); `resultBlockOffered` is false for `"gel-clot"` and true otherwise (ELM-IN-17) |
| Refusals | **Incomplete:** the missing members of `limit` (F01 names), `technique` (F-36 (a): compelled before MVD is shown), `c`, `cUnit` (only if D is not mL; F-11 (c)), `lambda`. **E20-RC-01 / -02:** as F01, plus unknown `technique`. **E20-RC-03:** `cUnit` not matching D. **CCS-RF-03:** the `limit` values (F01), `c` and `lambda` (`not-plain-decimal`, `not-above-zero`). Order is section 4.1: E20-RC-03 comes before value faults, so a bad unit and a zero concentration give E20-RC-03 alone |
| Basis | R5 ELM-DT-04, -DT-12, -IN-06, -IN-07, -IN-17, -UN-02, -UN-03, -RF-06. `c` and `cUnit` not read when D is mL, and never refused (KAITO-2026-11-24-23, T-0735 dispatch brief, 24 Nov; file entry owed; Q-AT-C19E-15); `"other"` text rules (NAD-2026-11-24-63; Q-AT-C19E-14) |

### E20L-F04 `checkDilution(DF, mvd)`

| Item | Specification |
|---|---|
| Purpose | The dilution check of ELM-DT-05 as a separate block, when a dilution is entered with or without a result |
| Inputs | `DF` decimal text, dimensionless, 1 or more (1 means undiluted); `mvd` the `exact` object `{num, den}` of an F03 result (E20L-NF-02) |
| Relation | Exact comparison of DF with MVD: DF below MVD, DF equal to MVD, or DF above MVD. Below and equal are permitted; above is not (ELM-DT-05) |
| Result | `{status: "result", DF, mvd, relation, permitted, withheldReason, printExact, engine}`. `DF` and `mvd` are numeric objects (unit `null`). `relation` is `"below"`, `"equal"` or `"above"`. `permitted` is false only for `"above"`, and then `withheldReason` is `"df-above-mvd"`, otherwise `null`. `printExact` as above |
| Refusals | Incomplete: `DF`, `mvd`. CCS-RF-03: `DF` not plain decimal (`not-plain-decimal`) or below 1 (`below-one`); `mvd` not an exact object, or with `num` zero or negative (`wrong-form`); `num` and `den` need not be in lowest terms (NAD-2026-11-24-66 item 5; CH-11) |
| Basis | R5 ELM-DP-02, ELM-DT-05, -RF-02; DES; NAD-2026-11-24-66 |

### E20L-F05 `assessResult(limit, technique, c, cUnit, lambda, highestStandard, DF, resultQualifier, resultValue, reagentType, suitability)`

| Item | Specification |
|---|---|
| Purpose | Everything the result block needs from the raw inputs, in one call: the dilution check, the raw reading, the result in the limit's own unit, the relation, the floor check, λ × DF, the suitability outcome, and the ordered reasons that withhold the comparison. It takes **raw inputs, not earlier results**, so that no hand-built object can stand for a computed one, and it re-evaluates the relations of F03, F04 and F06 by the same definitions |
| Inputs | `limit`, `technique`, `c`, `cUnit`, `lambda` as F03; `highestStandard` decimal text, EU/mL, **required only when `resultQualifier` is `"="`** (ELM-IN-07; the raw reading check never runs for `<`); `DF` as F04; `resultQualifier` `"="` or `"<"`, no default; `resultValue` decimal text, EU/mL, 0 or more, a number only and never an expression; `reagentType` (section 4.3, `null` allowed); `suitability` as F06 (`null` allowed) |
| **Gel-clot** | `technique` `"gel-clot"` is E20-RC-02 `["technique"]` at step (2): v1 gives the limit and the MVD only and does not compare a gel-clot result (ELM-IN-17). The page does not offer the call; the engine also refuses it so that the rule is not only a page rule. Both guards stay: `resultBlockOffered` false from F03 and E20-RC-02 from F05 (KAITO-2026-11-24-24, T-0735 dispatch brief, 24 Nov; file entry owed; Q-AT-C19E-19) |
| Result entered | `resultQualifier` and `resultValue` are both required: a result with no qualifier is `incomplete` naming `resultQualifier` (ELM-RF-08). The page calls this function only when it wants the result block; a missing reagent type or suitability is **not** `incomplete` (below) |
| `>` and the text of `resultValue` (NAD-2026-11-24-55; Q-AT-C19E-05) | For `resultValue` text, three tests **in this order, first match wins**, and **all before the pattern of E20L-IN-01**: (i) skip leading whitespace; if the first character left is U+003E (`>`) or U+2265 (`≥`), the reason is `greater-than-not-a-quantity`, so `>=`, `> ` and a leading space before `>` are all this reason; (ii) otherwise text that is not plain decimal text is `not-plain-decimal`, which includes a `<` in front, a `>` or `≥` anywhere else, words and expressions; (iii) otherwise below zero is `negative`. For `resultQualifier`: exactly `">"` is `greater-than-not-a-quantity` (step (3) of section 4.1), never E20-RC-01; every other string outside `"="` and `"<"`, `">="` and `"≥"` included, is E20-RC-01. If both arguments carry the `>` fault, two entries, in argument order. With qualifier `">"`, `highestStandard` is not required and not read (ELM-RF-04, ELM-IN-09) |
| Relations | Let D, c be as F03 (c is 1 when D is mL), L as F01, λ as F03. **(a) Dilution (ELM-DT-05):** as F04 with MVD formed as in F03 in one chain. **(b) Raw reading (ELM-DT-06), qualifier `=` only:** raw = C ÷ DF, C = `resultValue`; compared with λ and `highestStandard`, bounds included: `position` `"below-lowest"` if raw < λ, `"above-highest"` if raw > highest, else `"within"`. `belowLowestStandard` is true exactly when `position` is `"below-lowest"` (ELM-FL-15; zero is one case). The block is `{applies: true, raw, position, belowLowestStandard, printExact}`, `raw` a numeric object (EU/mL), `printExact` true when raw and a bound it is compared with have identical `display` and different exact values (ELM-DP-02). For `<` the block is `{applies: false}` and is not evaluated, and `highestStandard` is not read. **(c) Result in the limit's own unit (ELM-DT-10):** `R = C ÷ c` in EU per [D] for `=`; for `<`, `x = floor ÷ c`, the floor being `resultValue`. When D is mL, c is 1 and the value equals the typed value; `conversionShown` is false (no line prints) and true otherwise. **(d) Relation:** for `=`, R compared with L: `"below"`, `"equal"` or `"above"` (ELM-DT-07, ELM-FL-01); equality is its own value and never "within". For `<`, x compared with L: `"below"`, `"equal"` or `"above"` (ELM-DT-08, ELM-FL-03, three states). In both, exact values, never rounded figures. **(e) Sensitivity (ELM-DT-11):** `y = λ × DF`, EU/mL, always returned. **(f) Floor check (ELM-DT-09), qualifier `<`:** `floorDiffers` is true when the floor `resultValue` is not equal to `y` by exact comparison (ELM-FL-04); `null` for `=`. `floorPrintExact` is the printed-exact flag for the floor against y (identical `display`, different exact values); `null` for `=` (NAD-2026-11-24-62; CH-15) |
| Reasons | `withheld` is a list of tokens, **only those that apply, in r5's fixed order (ELM-FL-02)**: (1) `"df-above-mvd"` if (a) is `"above"`; (2) `"raw-reading-outside"` if qualifier `=` and (b) `position` is not `"within"`; (3) `"suitability-not-entered"` if F06 says `notEntered`, or `"suitability-incomplete"` if F06 is incomplete and not `notEntered` (`suitabilityMissing` = F06 `missing`) or F06 is `rejected` with any code, wrong form included (`suitabilityMissing` = F06 `fields`; the `suitability` member carries the F06 object unchanged; NAD-2026-11-24-58); (4) `"suitability-outside"` (with `suitabilityOutside`, the F06 `outside` list) if F06's summary is `"outside"`; (5) `"reagent-not-selected"` if `reagentType` is `null`. Reasons (3) and (4) exclude each other. The raw-reading reason never applies to `<` (ELM-FL-03). `relationLineShown` is true exactly when `withheld` is empty (renamed from v0.1's `comparisonShown`, because FL-03's third line is itself a "no comparison" line). The page prints "No comparison shown: [reason]" once per token, in list order. **When `withheld` is not empty the page prints none of the FL-01 or FL-03 lines, the third FL-03 line included. When it is empty, the page prints exactly one FL-03 line (for `<`) or one FL-01 line (for `=`).** The floor fact of FL-04 is independent and prints whenever `floorDiffers` is true (NAD-2026-11-24-59; Q-AT-C19E-09) |
| Result | `{status: "result", mvd, dilution, rawReading, inLimitUnit, relation, relationKind, sensitivity, floorDiffers, floorPrintExact, suitability, withheld, suitabilityMissing, suitabilityOutside, relationLineShown, reagentType, engine}`. `mvd` is the F03 result object; `dilution` is `{DF, mvd, relation, permitted, withheldReason, printExact}` as F04; `inLimitUnit` `{role: "result" or "floor", value, conversionShown}`; `relation` is `{state, printExact}`, `state` the token of (d) and `printExact` as defined above for R against L, or x against L; `relationKind` is `"measured"` for `=` and `"upper-bound"` for `<`; `sensitivity` the numeric object y; `suitability` the F06 result (or its incomplete form). **Calculated values are present whether or not the comparison is withheld** (ELM-DT-13, ELM-SU-08); `relation` is returned even when `relationLineShown` is false and the page must not print it then. `suitability` is the F06 result, or F06's incomplete or rejected object unchanged. `suitabilityMissing` is a list only when the token is `"suitability-incomplete"`, else `null`; `suitabilityOutside` is a list only when the token is `"suitability-outside"`, else `null`; `reagentType` is `null` when not selected |
| Refusals | **Incomplete:** members of `limit`, `technique`, `c`, `cUnit` (D not mL), `lambda`, `highestStandard` (only for `=`; not for `<` and not for `">"`), `DF`, `resultQualifier`, `resultValue`, in signature order. **E20-RC-01:** unknown closed strings anywhere in the arguments except `suitability`, including `reagentType`. **E20-RC-02:** gel-clot; preset of the wrong kind. **E20-RC-03:** `cUnit`. **CCS-RF-03:** every value fault of every argument excluding `suitability`, together: `not-plain-decimal`, `not-above-zero` (limit parts, `c`, `lambda`, `highestStandard`), `below-one` (`DF`), `negative` (`resultValue`), `greater-than-not-a-quantity`, `highest-not-above-lambda` (`fields` `["lambda", "highestStandard"]`, argument order; an entry of two names stands at the place of its first, ELM-RF-05, evaluated only when both pass their own checks), `wrong-form`. `negative` for `resultValue` as in the `>` row. **No `suitability` fault is a refusal of this call:** F05's own E20-RC-01, E20-RC-02 and CCS-RF-03 never include a `suitability` field, and F05's calculated values stay whatever F06 returns (NAD-2026-11-24-58; Q-AT-C19E-08; ELM-DT-13, -SU-08). A `suitability` that is present but not an object is F06's CCS-RF-03 `["suitability"]` `wrong-form`, handled the same way |
| Basis | R5 ELM-DT-05 to -11, -FL-01 to -04, -FL-15, -RF-01 to -08, -SU-08, -DP-02; DES for the call shape; NAD-2026-11-24-55, -58, -59 |

### E20L-F06 `assessSuitability(suitability)`

| Item | Specification |
|---|---|
| Purpose | Recovery computed exactly and the three user-declared ranges, with no verdict (ELM-SU-01 to -08, ELM-IN-11) |
| `suitability` | `null`, or an object, member order: `sampleCV: {value, max, source}`, `spikeCV: {value, max, source}`, `recovery: {B, A, added, basis, range}`, where `range` is `{form, low, high, source}` for `"declared"` or `{form, presetId}` for `"preset"` (a preset supplies its own label as the source, ELM-SU-05, and its bounds from F02, so `presetId` must be `"preset-4"`, else E20-RC-02). `value`, `max`, `B`, `A`, `added`, `low`, `high` are decimal text; the CV values are percent; B, A and added are EU/mL on the one declared `basis` (`"as-measured"` or `"times-df"`, no default, ELM-IN-11) |
| Relations | **Recovery:** `recovery % = ((B − A) ÷ added) × 100`, one exact chain (ELM-SU-02). The `basis` is recorded and returned; it does not enter the arithmetic, because for a common factor the quotient is unchanged (ELM-SU-02). The engine cannot detect a mixed basis (ELM-OU-10). **Within** the range when low ≤ recovery ≤ high, **bounds included** (ELM-SU-07). **CV:** sample and spike CV are each `"within"` when value ≤ max, `"outside"` when above ("at most", ELM-SU-04, -SU-07). **Summary:** `"all-within"` when all three are within, otherwise `"outside"` with `outside` listing, in this order, any of `"sample-cv"`, `"spike-cv"`, `"recovery"` (`outside` is `[]` when `summary` is `"all-within"`; ELM-SU-06). No other word is returned |
| Result | `{status: "result", sampleCV: {value, max, state}, spikeCV: {value, max, state}, recovery: {value, B, A, added, basis, low, high, state, printExact}, summary, outside, engine}`; all numbers are numeric objects (`%` for recovery and CV, EU/mL for B, A, added). `recovery.printExact` is one flag, true if the recovery looks equal to low or to high at three figures without being equal (section 6, printed-exact flag). The CV values carry no flag (NAD-2026-11-24-62). A computed recovery below zero (B below A) is accepted and compared with the range like any other number (NAD-2026-11-24-56) |
| Incomplete | `{status: "incomplete", code: "CCS-RF-01", missing, notEntered, engine}`. `missing` lists every missing leaf in the member order above (for example `suitability.recovery.basis`, `suitability.sampleCV.max`, `suitability.sampleCV.source`). `notEntered` is true when **every** leaf is null, absent or blank, including a `null` `suitability` (then `missing` lists every leaf named in section 4.1); a present value of the wrong form, or an unknown string, makes it false: the page prints "suitability values not entered"; otherwise "suitability values incomplete: [fields]" (ELM-FL-02 (3), F-22) |
| Refusals | E20-RC-01: unknown `basis`, `range.form`, `range.presetId`. E20-RC-02: a known `range.presetId` other than `"preset-4"`. CCS-RF-03: any numeric text not plain decimal (E20L-IN-01), any non-string numeric value (`wrong-form`); `added` zero or less (`not-above-zero`, ELM-SU-02); **B, A, sample CV value, spike CV value and each CV maximum below zero (`negative`; zero is accepted; NAD-2026-11-24-56, -57)**; `low` above `high` (`low-above-high`, naming low then high, only when each passes its own checks; low equal to high accepted; a negative bound accepted; NAD-2026-11-24-57); a `suitability` that is present but not an object (`["suitability"]`, `wrong-form`). **The block is all or nothing:** F06 computes nothing until every leaf is entered (ELM section 2; NAD-2026-11-24-58; Q-AT-C19E-06, -07, -08) |
| Basis | R5 ELM-SU-01 to -08, ELM-IN-11, ELM-FL-02; DES for shape; NAD-2026-11-24-54, -56, -57, -58, -62 |

### E20L-F07 `screenDilutions(limit, c, cUnit, recoveryRange, criterion, curves)`

| Item | Specification |
|---|---|
| Purpose | The I/E screening computations: per channel recovery state, effective sensitivity, ratio, DF against MVD, the listing and the not-consecutive fact (ELM-IE-02 to -08). It selects, ranks and recommends none (ELM-IE-07) and stands apart from the main calculation (E20L-NF-07, ELM-IE-10) |
| Inputs | `limit` as F01, or `null` for "no limit declared" (then no MVD or ratio is formed; not a missing field, ELM-IE-06); `c`, `cUnit` as F03, read only when a limit is declared and D is not mL; `recoveryRange` as the `range` of F06 (declared or preset-4; ELM-IE-03); `criterion` `{form, value, source}` for `"declared"` or `{form, presetId}` for `"preset"` (preset-5), **required and read only when at least one curve has an `r`**, that is, an `r` present and not blank, even a malformed one (ELM-IE-04); `curves` an array, each `{lambda, r, channels}`; `channels` an array of `{DF, recovery}`. `lambda` (EU/mL, above zero) and `DF` (1 or more) are decimal text; `recovery` is the instrument's reported spike recovery in percent; `r` is optional decimal text and may be negative |
| Not arguments | Lot, expiry, reagent, spike value, glucan blocker and every other record field of ELM-IE-02 are page record fields and are not engine arguments. The per-curve highest standard enters no computation named in r5 IE, so no ELM-RF-05 check runs in the screen; λ is compelled (NAD-2026-11-24-61; Q-AT-C19E-11). The engine sets no cap on channels or curves: "up to four" is the page's form (NAD-2026-11-24-60) |
| Relations, per channel | **Recovery state:** `"within"` when the declared range holds the recovery, bounds included, else `"outside"` (ELM-IE-03). **Sensitivity:** `λ × DF`, EU/mL, with that curve's λ (ELM-IE-05). **Ratio**, when a limit is declared: `(λ × DF) ÷ (L × c)`, both parts in EU/mL, one chain from the inputs (not from a passed MVD), `unit` `null`. The identity "ratio = DF ÷ MVD", with MVD formed from the same λ, holds exactly and is an acceptance property (AT-E20L-14), not a second computation (ELM-IE-05). **DF against MVD:** `dfAboveMvd` is true when DF is above `MVD = L × c ÷ λ` for that curve's λ by exact comparison, `null` when no limit is declared (ELM-IE-06); it is returned even when the recovery is within range. `printExact` per channel is the flag for the channel DF against MVD (`null` with no limit; NAD-2026-11-24-62). The recovery state is a comparison of the instrument's number with a range, and the reported recovery is not flagged. A reported recovery below zero is accepted (NAD-2026-11-24-56); there is no other bound on it (NAD-2026-11-24-61) |
| Relations, per curve | If `r` is entered: with a criterion `\|r\| ≥ value` on the absolute value, `curveState` is `"within"` or `"outside"` (a rising curve is not marked outside; ELM-IE-04). If `r` is not entered, `curveState` is `"not-entered"` and the criterion plays no part. `mvd` per curve, `null` when no limit is declared |
| Listing | A channel is `listed` when its recovery is within the range **and** (no limit is declared **or** its DF is not above MVD) **and** its curve is not `"outside"` (ELM-IE-07). **Per curve** (NAD-2026-11-24-60): each curve has its own λ, MVD, `listed` and `notConsecutive`, and "among the dilutions entered" means entered in that curve. The curve's `listed` holds the DF of each listed channel, in input order, repeats kept. Duplicate DF values are allowed and each channel is judged alone |
| Not consecutive | `notConsecutive` is `null`, or `{listed, between}` (NAD-2026-11-24-60; Q-AT-C19E-10). `listed` is the distinct listed DF values, ascending. `between` is the distinct DF values, ascending, of entered channels of that curve that are not listed, that lie strictly between the smallest and largest listed DF and equal no listed DF. It is `null` when fewer than two distinct DF are listed or `between` is empty. Equality and order are by exact value, so `10` and `10.0` are one DF (ELM-IE-08) |
| Result | `{status: "result", mvdShown, curves: [{lambda, mvd, r, curveState, channels: [{DF, recovery, recoveryState, sensitivity, ratio, dfAboveMvd, printExact, listed}], listed, notConsecutive}], engine}`. Channel and curve order is the input order. `mvdShown` is true exactly when a limit is declared. `r` is `null` when not entered. The entries of a curve's `listed` and of `notConsecutive.listed` and `.between` are numeric objects, `unit` `null`; a channel's `listed` is true or false. A curve with none listed has `listed` `[]`. The page prints the three ELM-IE-03 and ELM-IE-04 phrases from the tokens and never the words excluded by ELM-OU-12 |
| Refusals | Incomplete: `limit`'s parts when given, `recoveryRange` members, `criterion` members when an `r` is entered, `curves`, per curve `lambda` and `channels`, per channel `DF` and `recovery`, in nested order with zero-based indices (`curves[0].channels[1].DF`); an empty `curves` or `channels` array is `incomplete` naming the array (AMD-3 item 1 pattern; NAD-2026-11-24-60). The screen is one block: any missing member makes the whole call `incomplete`; the page does not pass a wholly blank row or curve. `c` and `cUnit` missing when a limit is declared and D is not mL: the whole call is `incomplete` naming them. It never reads "no limit declared" and never lists without the MVD check. The page passes `limit: null` only when no limit source is chosen on the main screen; a chosen but unfinished limit is passed as it is and is `incomplete` (NAD-2026-11-24-61; Q-AT-C19E-12). E20-RC-01/-02/-03 for `limit`, `c` and `cUnit` as F03; E20-RC-01 also for unknown `recoveryRange.form`, `recoveryRange.presetId`, and, when a criterion is read, `criterion.form`, `criterion.presetId`; E20-RC-02 also for a known `recoveryRange.presetId` other than `"preset-4"` or a known `criterion.presetId` other than `"preset-5"`. CCS-RF-03: `not-plain-decimal`, `not-above-zero` (`lambda`), `below-one` (`DF`), `wrong-form`; `low-above-high` for the range (low equal to high accepted; a negative bound accepted); `outside-zero-to-one` for an \|r\| criterion value below 0 or above 1, judged only when an `r` is entered (a `criterion` supplied when no `r` is entered is not read); `outside-minus-one-to-one` for an `r` below -1 or above 1 (NAD-2026-11-24-57). A reported recovery has no bound beyond plain decimal text and may be negative (NAD-2026-11-24-56, -61) |
| Basis | R5 ELM-IE-02 to -08, -IE-10, -DP-02; DES; NAD-2026-11-24-56, -57, -60, -61, -62 |

### E20L-F08 `formatThreeFigures(value)` (display function)

| Item | Specification |
|---|---|
| Purpose | The single display function for ELM-DP-01, so the page cannot differ. It is the source of every `display` member |
| Input | `value`: an `exact` object `{num, den}` or plain decimal text (0.1.0 section 6, E10C-NF-02). A JS number is refused (`wrong-form`) |
| Relation | **Non-negative values (KAITO-2026-11-24-25, T-0735 dispatch brief, 24 Nov; file entry owed):** form `display('sig3')` of the value. If the absolute value of that `sig3` result is 1000 or more, `text` is `display('sci3')` of the same exact value; otherwise `text` is the `sig3` result. Both come from the **same exact value**; F08 has **no rounding of its own**. The `sig3` string is plain digits with trailing zeros kept (ELM-DP-01 gives `2.50` as its form); the `sci3` string is the `d.dd × 10^n` form of 0.1.0 section 6 (U+00D7, one space each side, ASCII exponent). The test is on the once-rounded value, so a value that rounds up to 1000 takes the exponent form. **Negative values (NAD-2026-11-24-56; her rule wins for negatives):** round the magnitude by the same rule (half away from zero), then put U+002D in front. The below-1000 test is on the signed rounded value, so every negative prints plain digits and never the exponent form; plain-digit text of a magnitude of 1000 or more is the integer rounded to three figures with zeros filling the other places. Exact zero is `0`, never `-0` (0.1.0 section 6 "Exact zero"; ELM-DP-05). No rounding rule is added to those rows |
| Result | `{status: "result", text, engine}` |
| Refusals | Incomplete: `value`. CCS-RF-03 `["value"]`: text that does not match E20L-IN-01, `not-plain-decimal`; a value that is neither text nor an `exact` object, or a malformed `exact` object, `wrong-form` |
| Why a new function | The six modes of 0.1.0 section 6 do not contain this threshold form (`sig3` never uses the exponent; `sci3` always does). ELM-DP-01 says "display functions are those of the engine's display functions; the engine spec names them". This row names the composition. Core's `display` has the modes but not this threshold form, so F08 is new and composes them (KAITO-2026-11-24-25; Q-AT-C19E-21). The display of a negative value is ruled (NAD-2026-11-24-56; Q-AT-C19E-06) |
| Basis | R5 ELM-DP-01, -DP-05; DES; KAITO-2026-11-24-25 (Q-AT-C19E-21); NAD-2026-11-24-56 |

### E20L-F09 `checkRecordDates(testDate, expiryDate, calibrationDueDate)`

| Item | Specification |
|---|---|
| Purpose | The date flags of ELM-FL-05, as a computed part so that the page makes no comparison of its own. An **engine row** (KAITO-2026-11-24-24, T-0735 dispatch brief, 24 Nov; file entry owed; Q-AT-C19E-17) |
| Inputs | Three optional dates as `YYYY-MM-DD` text (ELM-IN-12). Absence is not `incomplete`: a flag needs both dates of its pair. `null`, absent and blank text (empty or whitespace-only) are "not entered" and are not named in `notDates` |
| Date rule (NAD-2026-11-24-64; Q-AT-C19E-22) | A date is text matching `^[0-9]{4}-[0-9]{2}-[0-9]{2}$`, year 0001 to 9999, that exists in the Gregorian calendar. No trimming and no other format. Text that is not such a date does **not** refuse the call, because that would hide the other pair's valid flag: it is named in `notDates`, and every flag that uses a named date is `null`. A value that is not text is CCS-RF-03 `wrong-form` (the one refusal of this function, a programming fault; a date's content never refuses). No date ever blocks a calculation |
| Relation | `testAfterExpiry` is true when the test date is later than the expiry date as calendar dates, false when it is the same day or earlier (F-24 (b): the same date gives no flag); `null` when either date is not entered or is named in `notDates`. `testAfterCalibrationDue` likewise with the calibration due date. Flags only; no effect on any calculation (ELM-FL-05) |
| Result | `{status: "result", testAfterExpiry, testAfterCalibrationDue, notDates, engine}`. `notDates` lists the argument names (`testDate`, `expiryDate`, `calibrationDueDate`) in argument order, `[]` when none |
| Page sentence | The sentence for `notDates` is in the URS amendment (KAITO-2026-11-24-28), not in this spec |
| Basis | R5 ELM-FL-05, -IN-12; NAD-2026-11-24-64; KAITO-2026-11-24-24 |

## 7. What is engine and what is page

**Engine (this module):** every parse of a number; every arithmetic step; every comparison of two values (relations, bounds, DF against MVD, recovery against a range, the listing, the "looks equal" test of ELM-DP-02, the date comparison of F09, KAITO-2026-11-24-24); the choice of token for each state; the order of the withheld reasons; the names of missing and faulty fields; every `display`, `decimal` and `fraction` string; the unit string of each number.

**Page:** every sentence, label, help text, why-we-ask text and quotation (the engine returns tokens, never sentences); echoing typed text exactly as typed; mapping a token or a name to a string or a field label; deciding which function to call from which fields are non-empty (no arithmetic); the worked example's loading as typed strings; exports, banners, print, privacy, accessibility, menu and catalog. **The page does no arithmetic and no comparison of its own** (ELM section 3, and Kaito's brief: no comparison either). The page never rounds, never parses a decimal and never reads `exact` for any purpose except to pass it on.

**Typed echo (NAD-2026-11-24-66 item 4; CH-21).** A value the user typed prints as typed wherever it appears in a line: a typed limit, K, M, c, λ, DF, the result when no conversion prints (D is mL), CV values and maxima, range ends, `r`, the \|r\| criterion, and I/E recoveries. The DF values of ELM-IE-08's line come from `notConsecutive.between` and print as `decimal` (`fraction` when `decimal` is `null`), never `display`, because the page cannot compare values to find which typed text they were. `display` strings are for computed values (ELM-DP-01). For a preset the page prints `asWritten` (E20L-F02).

### 7.1 Mapping: every ELM-DT, -UN, -FL, -RF, -SU, -IE, -DP row

("page only" means no engine row. "Engine" names the row of section 6. All 68 IDs of the classes DT, UN, FL, RF, SU, IE and DP are listed (Nadira checked the count at 68, NAD-2026-11-24-66 review); FL-06 and IE-09 are unused IDs in r5 and have no row. No row below remains unspecified: each ruled question is cited.)

| ELM ID | Engine row | Note |
|---|---|---|
| ELM-DT-01 | E20L-F01 | K ÷ M |
| ELM-DT-02 | E20L-F01 | typed limit, no computation |
| ELM-DT-03 | E20L-F01, E20L-F02 | preset supplies K or L |
| ELM-DT-04 | E20L-F03 (re-evaluated in F05) | one chain |
| ELM-DT-05 | E20L-F04; E20L-F05 (a) | |
| ELM-DT-06 | E20L-F05 (b) | `=` only; `<` gives `applies: false` |
| ELM-DT-07 | E20L-F05 (d) | `=` |
| ELM-DT-08 | E20L-F05 (d) | `<`, three states |
| ELM-DT-09 | E20L-F05 (f) | `floorDiffers` and y |
| ELM-DT-10 | E20L-F05 (c) | R and x; `conversionShown` |
| ELM-DT-11 | E20L-F05 (e); F07 per channel | λ × DF |
| ELM-DT-12 | E20L-NF-01, E20L-NF-02, F03 | no rounded value feeds on |
| ELM-DT-13 | E20L-F05 (calculated values returned when withheld); F03 and F04 independent of the result block | |
| ELM-DT-14 | none, by construction (E20L-IN-06) | no time or per-kg conversion exists |
| ELM-UN-01 | section 4.3 (closed strings); E20L-IN-06 | no weight value is accepted |
| ELM-UN-02 | E20L-F03 | fixed pairing; exact text for "other" |
| ELM-UN-03 | E20L-F03 | no factor table; E20-RC-03 |
| ELM-UN-04 | numeric object `unit` (E20L-NF-03) | printing is page |
| ELM-UN-05 | `unit: null` on MVD, DF, ratio | the statement is page |
| ELM-UN-06 | page only | K label; engine supplies `kFromPreset` |
| ELM-FL-01 | E20L-F05 (d) `relation.state`, `printExact`, `relationLineShown` | the line text is page |
| ELM-FL-02 | E20L-F05 `withheld` | order fixed in the row; text is page |
| ELM-FL-03 | E20L-F05 (d) with `relationKind` `"upper-bound"` | line texts page; none of the three lines prints when `withheld` is not empty (NAD-2026-11-24-59) |
| ELM-FL-04 | E20L-F05 (f) `floorDiffers`, `floorPrintExact` | fact line text is page; prints whenever `floorDiffers` is true |
| ELM-FL-05 | E20L-F09 | KAITO-2026-11-24-24; NAD-2026-11-24-64 |
| ELM-FL-06 | none (unused ID) | |
| ELM-FL-07 | page only | |
| ELM-FL-08 | page only | shown when `relation.state` is `"equal"`, `relationKind` is `"measured"` and `relationLineShown` is true (NAD-2026-11-24-66 item 2; CH-19) |
| ELM-FL-09 | page only | |
| ELM-FL-10 | E20L-F05 (c) supplies R and `conversionShown`; the line is page | |
| ELM-FL-11 | page only | |
| ELM-FL-12 | page only | |
| ELM-FL-13 | page only; the engine's arithmetic never branches on `reagentType` | AT-E20L-09 |
| ELM-FL-14 | page only; the engine echoes the members the page prints (`denominator`, `c`, `K`, `M`, `presetId`, `reagentType`, `technique`, `DF`) | |
| ELM-FL-15 | E20L-F05 (b) `belowLowestStandard` and (e) y | |
| ELM-RF-01 | CCS-RF-01 (section 4.1 step 1) | |
| ELM-RF-02 | CCS-RF-03 reasons `not-above-zero`, `below-one` | |
| ELM-RF-03 | CCS-RF-03 reason `negative` | also B, A, CV values and maxima (NAD-2026-11-24-56, -57) |
| ELM-RF-04 | CCS-RF-03 reason `greater-than-not-a-quantity` | NAD-2026-11-24-55 |
| ELM-RF-05 | CCS-RF-03 reason `highest-not-above-lambda` | |
| ELM-RF-06 | E20-RC-03 | |
| ELM-RF-07 | CCS-RF-03 reason `not-plain-decimal` | pattern of E20L-IN-01 (KAITO-2026-11-24-22) |
| ELM-RF-08 | CCS-RF-01 naming `limit` or `limit.form`, `technique`, `resultQualifier`; a missing reagent type is a withheld reason, not a refusal | |
| ELM-RF-09 | none, by construction (E20L-IN-06) | |
| ELM-SU-01 | E20L-F06 | three values |
| ELM-SU-02 | E20L-F06 | recovery computed; `added` above zero |
| ELM-SU-03 | E20L-F06; E20L-F02 preset-4 | |
| ELM-SU-04 | E20L-F06 | CV maxima, no default |
| ELM-SU-05 | E20L-F06 (source members required, E20L-IN-05) | |
| ELM-SU-06 | E20L-F06 `state`, `summary`, `outside` | sentences are page |
| ELM-SU-07 | E20L-F06 | bounds included |
| ELM-SU-08 | E20L-F05 `withheld` (3), (4) | |
| ELM-SU-09 | page only | optional text field |
| ELM-IE-01 | page only | heading |
| ELM-IE-02 | E20L-F07 arguments; record fields page only | NAD-2026-11-24-60, -61 |
| ELM-IE-03 | E20L-F07 `recoveryState` | |
| ELM-IE-04 | E20L-F07 `curveState`; E20L-F02 preset-5 | |
| ELM-IE-05 | E20L-F07 `sensitivity`, `ratio` | identity is AT-E20L-14 |
| ELM-IE-06 | E20L-F07 `dfAboveMvd`, `mvdShown` | |
| ELM-IE-07 | E20L-F07 `listed` | |
| ELM-IE-08 | E20L-F07 `notConsecutive` | per curve; `{listed, between}` or `null` (NAD-2026-11-24-60) |
| ELM-IE-09 | none (unused ID) | |
| ELM-IE-10 | E20L-NF-07; the exports are page | |
| ELM-DP-01 | E20L-F08 | |
| ELM-DP-02 | numeric object (`decimal` null and `fraction`); `printExact` flags | pairs as in section 6 (NAD-2026-11-24-62) |
| ELM-DP-03 | numeric object (E20L-NF-03) | |
| ELM-DP-04 | page only | |
| ELM-DP-05 | E20L-F08; numeric object | |

### 7.2 Other ELM rows this module touches

| ELM ID | Engine part |
|---|---|
| ELM-IN-02 to -05 | E20L-F01, F02 |
| ELM-IN-06, -07, -17 | E20L-F03 (c term, λ meaning, technique, gel-clot) |
| ELM-IN-08, -09 | E20L-F04, F05 (DF, result, `>`) |
| ELM-IN-10 | E20L-F05 (`reagentType` token; no arithmetic depends on it) |
| ELM-IN-11 | E20L-F06 (basis recorded, `basis` required) |
| ELM-IN-12 | E20L-F09 (dates); other record fields are page only |
| ELM-IN-13 | E20L-IN-01 |
| ELM-NF-01, -02, -04 | E20L-NF-01, -NF-02, -NF-04 |
| ELM-OU-06 | E20L-NF-05 (engine object) |
| ELM-OU-12 | E20L-NF-08, section 8 |

## 8. The name scan (ELM-OU-12; THR-2026-11-23-452, -470, -478 to -482)

**Rule.** Mechanical, case-insensitive **substring** match, **zero hits outside the exemptions below**, no word allow-list. The only exemptions, each listed by exact name in the acceptance record, are: (i) import paths, imported names and member names owned by an existing module of the package, and the built-ins `isSafeInteger`, `MAX_SAFE_INTEGER` and `MIN_SAFE_INTEGER`, none re-exported or returned and none containing `dose`, `dosing` or `dosage`; (ii) a licence notice and the line 'Research use only. Not qualified for GxP decision-making.', verbatim. Because it is a substring match, words such as `invalid`, `coarse`, `compass` and `suspension` are hits and are not used (THR-2026-11-23-479). `valid` binds this module's names and the keys and headers the page derives from them; it does not bind page text, title, slug or keywords.

Read against the term list below, none of the eighteen names exported by `src/core.js` (section 2.5) contains a term in either form, so exemption (i) is not needed for them; if the builder imports any other name from an existing module, it goes into the acceptance record's exemption list by exact name (THR-2026-11-23-479 follow-up, Kaito). The export line in `src/index.js` is a scope (2) name and is scanned (THR-2026-11-23-480 follow-up).

| Item | Rule |
|---|---|
| Terms | "`dose`, `dosing`, `dosage`, `patient`, `infus`, `bagvolume`, `coa`, `clinic`, `bedside`, `physician`, `pharmacist`, `nurse`, `apheresis`, `collectiontarget`, `mobilisation`, `mobilization`, `transplant`, `cds`, `ivd`, `gmpready`, `cellskg`, `cellsperkg`, `cd34`, `medicaldevice`, `fdaexempt`, `regulatedbyfda`, `valid`, `complian`, `complies`, `pass`, `fail`, `release`, `conform`, `meetsspecification`, `eligible`, `safe`, `qualified`, `certif`, `usp`, `aami`. Sources: THR-105 item 1; THR-104; r5 section 0.4 and ELM-OU-12 (2); THR-452; ELM-OU-04; THR-456; stricter forms cleared by THR-2026-11-23-478. `validated` is covered by `valid`, `release testing` and `lot release` by `release`, `certificate of analysis` by `certif`. Approved product names and supplier marks are checked by reading." (Theron's text, THR-2026-11-23-478, verbatim) |
| Forms scanned | "(A) Names, tokens, ids, directory and file names (scope items 1 to 5): each is tested alone, lower-cased as written and again with every `-`, `_`, `.`, `/` and space removed. (B) Source text and comments (scope item 6): lower-cased, with separators kept, so that letters of neighbouring words are never joined. In (B) each multi-word term (`bagvolume`, `collectiontarget`, `gmpready`, `cellskg`, `cellsperkg`, `medicaldevice`, `fdaexempt`, `regulatedbyfda`, `meetsspecification`) is matched with any run of spaces, line breaks, `*`, `/`, `-`, `_` or `.` allowed between its words (`bag volume`, `collection target`, `gmp ready`, `cells kg`, `cells per kg`, `medical device`, `fda exempt`, `regulated by fda`, `meets specification`)." (THR-2026-11-23-478, verbatim) |
| Scope (in) | (1) the module's directory name and every file name in it; (2) every exported name; (3) every parameter name and every object-member name in the module's source and in its returned objects; (4) every string constant the module returns as a status, code, reason, relation, state, kind or other closed token; (5) the preset ids; (6) the whole text of the module's source files **including comments** (the module needs no quotation, so no comment needs a banned word), including comments (THR-2026-11-23-480). The scanner, its term list and its controls live outside the module directory. The names, not the contents, of the module's published test and fixture files are also scanned. Scope (2) also covers E20's export names where they appear in the package's registry or index (the `src/index.js` line, `registerModule` call) |
| Scope (out) | Other modules of the package; the package README; this spec and r5; text a user types and the engine echoes (for example `denominator.label`, or the label inside a `unit` string), which is data, not vocabulary, provided it appears only as a value: never as a key, header, token, identifier or file name (THR-2026-11-23-481); the page's own files (the page has its own scan, AT-ELM-14). Test and fixture contents are outside the scan (THR-2026-11-23-480) |
| Positive control | "`dose_per_kg`, `dosageUnit`, `Release`, `bypass`, `isPass`, `isValid`, `clinicianName`, `meetsSpecification`, `meets-specification`, and a comment in which `meets` ends one line and `specification` begins the next: all ten must be reported. Negative control: `resultQualifier`, `rejected`, `incomplete` (form A), and a comment holding `map as string` (form B): none may be reported." (THR-2026-11-23-478, with the correction Theron made at hand-back: the negative control lists `resultQualifier`, `rejected`, `incomplete` as form A and a comment holding `map as string` as form B.) The scanner is run first on a control file inside the verifier's own folder; AT-E20L-03 fails if any positive is missed or any negative is reported |
| Words that stay allowed | `qualifier` (it does not contain `qualified`); `incomplete` and `complete` (not `complian`); `rejected` (here a status of an input, not a verdict on a material; THR-2026-11-23-478); `permitted`, `outside` (THR-2026-11-23-482), `closed` (THR-2026-11-23-484) |
| The existing package | The package may hold such words elsewhere (for example in other modules); that is outside the scope above |

## 9. Fixtures: input descriptions only

**This spec holds no expected value.** Every expected number, string and token is derived by the fixture author from the signed r5 and this signed spec (ELM section 15 rule). The rows below say which r5 section 15 row feeds which function and which engine-only situations also need a row. They do not restate any r5 expected value.

### 9.1 r5 section 15 rows to engine functions

| r5 row | Inputs (as in r5 section 15; common inputs as stated there) | Functions called |
|---|---|---|
| F-01 to F-04 | typed limit rows; result `=`; the pairs of limit and C | F01, F03, F05 |
| F-05, F-06 | K and M rows (F-06 is the binary-float trap) | F01, F05 |
| F-07 (a)(b)(c) | K and M terminating; three C values around the limit at three figures | F01, F05 (`printExact`) |
| F-08 (a)(b) | K and M non-terminating; the exact limit as the reduced fraction | F01, F03, F05, numeric object |
| F-09, F-10 | MVD with c fixed for mL; with a concentration term | F03 |
| F-11 (a)(b)(c) | units that do not cancel; a missing concentration | F03 (E20-RC-03; incomplete) |
| F-12, F-13 | DF equal to MVD; DF above MVD | F04, F05 |
| F-14 (a) to (d) | raw reading at and beyond both bounds | F05 (b) |
| F-15 (a) to (d), F-35 (a) to (c) | `<` rows in the limit's unit and the floor check | F05 (c), (d), (f) |
| F-16 | `>` qualifier and `>0.5` text | F05 (`greater-than-not-a-quantity`; the qualifier list itself is page) |
| F-17 | C equal to zero | F05 |
| F-18 | each impossible value; `1,5` and `2e5` | F01, F03, F05 (reasons) |
| F-19, F-21, F-22, F-37 | recovery at and beyond the bounds; CV; empty and partial; basis | F06, F05 |
| F-20 | page only (no typed recovery field) | none |
| F-23 | no reagent type; empty optional fields | F05 (`reagent-not-selected`); the "not entered" prints are page |
| F-24 (a)(b)(c) | expiry and calibration dates | F09 |
| F-25 | presets | F02, F01; the labels and preselection are page |
| F-26 | limit not per mL, with a result | F03, F05 (c) |
| F-27 | several reasons at once | F05 (`withheld` order) |
| F-28 | the worked example's values as typed text | F03, F05, F06 |
| F-29, F-30, F-31, F-32 | I/E datasets; the \|r\| sign rows (one curve per dataset at the engine, F-30 included; NAD-2026-11-24-60) | F07 (F-31's not-consecutive fact as ruled, NAD-2026-11-24-60) |
| F-33, F-34 | I/E isolation and export content | page only; E20L-NF-07 gives AT-E20L-15 |
| F-36 | technique not chosen; gel-clot; chromogenic | F03; F05 (gel-clot, E20-RC-02) |
| D-1 | deferred Mode B | none |

### 9.2 Engine-only fixture rows (inputs described; expected values derived by the fixture author)

The X class is defined in section 3. Rows are written `E20L-X-nn`.

| ID | Situation | Inputs |
|---|---|---|
| E20L-X-01 | Order of statuses | one call with a missing member, an unknown closed string, a unit mismatch and a bad number all at once; then the same with the first fault removed, in turn |
| E20L-X-02 | Null, absent and blank | the same call with a member as `null`, left out, empty text and whitespace-only text |
| E20L-X-03 | Malformed is not missing | a present value of the wrong form in each kind of slot (number for text, bigint for text, text for object, object for array, a non-`exact` for `mvd`, an `mvd` with zero or negative `num`, a zero and a negative exact object given to F08, a non-text value in a closed-string argument, a non-text `cUnit`, a non-text source, a non-text `otherLabel`) |
| E20L-X-04 | Missing names | `limit` null; `limit` without `form`; each form missing each member; nested `suitability` and `curves[i].channels[j]` names |
| E20L-X-05 | Closed strings | an unknown string in every closed slot of section 4.3, and each known string; `">="` and `"≥"` as a qualifier |
| E20L-X-06 | Presets | `listPresets()`; each of the five ids in the right and wrong role |
| E20L-X-07 | Display threshold | values on both sides of the 1000 test and at a carry, chosen by the fixture author from 0.1.0 section 6; zero and the text `"-0"`; negative values on both sides of the magnitude 1000 (plain digits, never the exponent form) |
| E20L-X-08 | Numeric object | a terminating value, a non-terminating value, and a terminating value whose expansion is beyond 400 decimal places: `decimal`, `fraction`, `display` agree with `exact`; `decimal` `null` for the last two; no throw reaches the caller |
| E20L-X-09 | No JS number | every returned object, recursively, holds no JS number |
| E20L-X-10 | Reasons, all five | inputs that raise each of the five withheld reasons alone and in every pair that can occur together; F06 incomplete, not entered, and rejected (`suitabilityMissing` from `missing` and from `fields`) |
| E20L-X-11 | Reagent never changes arithmetic | the same inputs with each of the three reagent tokens and with none: every number is the same |
| E20L-X-12 | I/E ratio identity | every channel of F-29 to F-31 with a limit declared: ratio against DF ÷ MVD from the same λ |
| E20L-X-13 | Purity | repeated and interleaved calls of F07 and F05 |
| E20L-X-14 | Gel-clot | F03 and F05 with `"gel-clot"` |
| E20L-X-15 | Text edges of `resultValue` and plain decimal text | leading space before `>`; `>=`; `≥`; `<5`; a `>` inside the text; `.5`, `5.`, `+5`, surrounding spaces; a lone sign; `1,5`; `2e5`; negative text; each in a numeric argument other than `resultValue` where the `>` test does not apply |
| E20L-X-16 | Dependent members | an unknown `limit.form` and every dependent member absent; an unknown or `">"` qualifier with `highestStandard` absent; a non-object `limit`, `suitability`, `range`, `criterion`; `c` and `cUnit` with D mL (supplied and absent) |
| E20L-X-17 | Suitability faults never refuse F05 | each F06 fault (incomplete, rejected, wrong form, negative reading, `low-above-high`) inside an otherwise valid F05 call |
| E20L-X-18 | Bounds of ranges, maxima, criterion and `r` | low equal to high, low above high, a negative bound, a maximum of zero and below zero, criterion at 0, 1 and either side, `r` at -1, 1 and either side, with and without an `r` entered |
| E20L-X-19 | I/E listing structure | duplicate DF values (`10` and `10.0`), listed channels with an unlisted one between, fewer than two distinct listed, empty `curves`, empty `channels`, a limit declared with D not mL and `c` or `cUnit` missing |
| E20L-X-20 | Dates | valid dates; 30 February; month 13; a wrong format; surrounding spaces; year 0000; a non-text value; blank and absent; the same date for test and expiry |
| E20L-X-21 | Printed-exact pairs | each pair of section 6 with identical `display` and different exact values, and with equal exact values |

## 10. Acceptance tests

Acceptance is Adacs, line by line, after the fixture author (from the signed documents only) and the clean room. No row rests on an open question: every question of v0.1 is ruled (section 12), and the rows that rested on them are in scope for the fixtures and the clean room (section 11.4).

| ID | Test | Requirements | Method |
|---|---|---|---|
| AT-E20L-01 | F-01 to F-08, F-12 to F-15, F-17, F-26, F-35, F-27: relations, withheld reasons and their order, from raw inputs; equality is its own state; exact comparison; the non-terminating limit gives `decimal` `null` and a `fraction` | F01, F03, F04, F05; ELM-DT-04 to -11, -FL-01 to -04, -15 | fixture (independent), unit |
| AT-E20L-02 | F-09 to F-11, F-36: MVD with and without the concentration term; unit refusal; technique compelled; gel-clot flags | F03; ELM-DT-04, -UN-02, -UN-03, -RF-06, -IN-17 | fixture |
| AT-E20L-03 | **Name scan** of section 8 over the module's scope: zero hits **outside the exemptions of section 8**, with the positive and negative controls run first (all ten positives reported, no negative reported). Also: no function, argument, member, result key, token, code or file name of this module contains any term of the list; a name exempt under section 8 (i) is not a name of this module. Each exemption used is listed by exact name in the acceptance record | E20L-NF-08; ELM-OU-12; THR-452, -470, -478 to -481 | scan (mechanical) |
| AT-E20L-04 | **Mode B absence.** Every argument and member name of every function of this module, split into words (camel case, `_`, `-`), contains none of `weight`, `volume`, `time`, `duration`, `hour`, `hours`, `kg`; no function takes such a value; calling any function with an extra member of such a name changes no result | E20L-IN-06; ELM-RF-09, -DT-14 | scan, fixture |
| AT-E20L-05 | **No binary floats.** No member of any returned object, at any depth, is a JS number; the module source contains no use of a binary-float parse or arithmetic on an input | E20L-NF-01; ELM-NF-01 | unit (E20L-X-09), review |
| AT-E20L-06 | Order of statuses, null equals absent equals blank, malformed is not missing, missing names | E20L-IN-02, E20L-RF-01, E20L-RF-04; section 4.1; E20L-X-01 to E20L-X-05, E20L-X-16 | fixture |
| AT-E20L-07 | F-18: each impossible value gives its reason token and field; `1,5`, `2e5` give `not-plain-decimal`; `>` gives its token, with the order of tests of NAD-2026-11-24-55; a non-string in any numeric argument gives `wrong-form`; negative readings, CV values and maxima give `negative`; `low-above-high`, `outside-zero-to-one`, `outside-minus-one-to-one` as ruled | section 4.2; ELM-RF-02 to -07; E20L-IN-01 | fixture (E20L-X-15, E20L-X-18) |
| AT-E20L-08 | F-19 to F-22, F-37: recovery exact; bounds included; basis recorded (`"as-measured"`, `"times-df"`) and does not change the quotient; `notEntered`; incomplete names; the block is all or nothing; a suitability fault never refuses F05 | F06, F05; ELM-SU-01 to -08 | fixture (E20L-X-10, E20L-X-17) |
| AT-E20L-09 | The reagent token never changes any number (E20L-X-11); no function branches arithmetic on `reagentType`; no statement about recombinant reagents exists in the module | F05; ELM-FL-13, -IN-10 | fixture (E20L-X-11), review |
| AT-E20L-10 | F08: threshold at 1000 on the once-rounded value, as `display('sci3')` when the absolute value of the `display('sig3')` result is 1000 or more and `display('sig3')` otherwise, both from the same exact value, no rounding of F08's own; `sig3` and `sci3` rows of 0.1.0 section 6 reproduced; carry; zero; no `-0`; negatives as NAD-2026-11-24-56 (plain digits, never the exponent form); `display` of every numeric object equals F08 of its `exact` | F08; ELM-DP-01, -DP-05 | fixture (E20L-X-07, E20L-X-08) |
| AT-E20L-11 | Numeric object: `decimal`, `fraction`, `display` and `exact` agree for terminating and non-terminating values and for a terminating value beyond 400 decimal places (`decimal` `null`, `fraction` present, no throw); `unit` present or `null` as stated | E20L-NF-03; ELM-DP-02, -DP-03, -UN-04, -UN-05 | fixture |
| AT-E20L-12 | F02 holds exactly the values 5, 0.2, 0.5, 50, 200 and 0.980 and no other value, each with its `asWritten` text as r5 writes it; no default and no preselection exists in any function; presets 4 and 5 are refused as a limit | F02; ELM-IN-05, -SU-03, -IE-04 | fixture, review |
| AT-E20L-13 | F-29 to F-32: I/E recovery states, sensitivity, ratio, DF against MVD, per-curve listing, `notConsecutive` as NAD-2026-11-24-60, \|r\| on the absolute value, no recommendation member exists | F07; ELM-IE-02 to -08 | fixture (E20L-X-18, E20L-X-19) |
| AT-E20L-14 | **Ratio identity.** For every channel with a declared limit, `ratio` equals DF ÷ MVD exactly, with MVD formed from the same curve's λ | F07, F03; ELM-IE-05 | fixture (E20L-X-12) |
| AT-E20L-15 | **Isolation.** F07 keeps no state, its result is accepted by no other function, repeated and interleaved calls give identical results, and no F07 value enters F05 | E20L-NF-07; ELM-IE-10 | fixture (E20L-X-13), review |
| AT-E20L-16 | F-24 (a)(b)(c): date flags, the same day gives no flag; `notDates` and the null flags as NAD-2026-11-24-64; a non-text date is `wrong-form` | F09; ELM-FL-05 | fixture (E20L-X-20) |
| AT-E20L-17 | **Additive.** No file of `src/core.js`, `src/e7`, `src/e9` or `src/e10` differs from the base commit `5ce4afc`, except the engine version fields, and those only in the version commit; all existing fixtures of those modules still pass unchanged except the `engine.version` string of section 2.4. The diff outside `src/e20/` contains only: one export line in `src/index.js`, `src/version.js`, `package.json`, CHANGELOG, README and tests (section 2.2); no dependency is added; no import from `src/e10/` and no use of `toNumber` | E20L-NF-06; KAITO-2026-11-24-18, -20, -21 | diff, regression |
| AT-E20L-18 | Deterministic and dependency-free: two runs give identical output; `package.json` dependencies unchanged; no network or clock use | E20L-NF-04; ELM-NF-04 | review, run |
| AT-E20L-19 | Engine object on every result and refusal: package version, module `E20`, module version; the versions of section 2.4 (package 0.3.0, module 0.1.0) | E20L-NF-05; ELM-OU-06 | fixture |
| AT-E20L-21 | **`relationLineShown` and the withheld lines.** `relationLineShown` is true exactly when `withheld` is empty; `floorDiffers` and `floorPrintExact` are independent of it; no member named `comparisonShown` exists | E20L-F05; NAD-2026-11-24-59 | fixture (E20L-X-10) |
| AT-E20L-20 | Clean-room coverage: every function F01 to F09 and every reason, code and token of section 4 has a clean-room reimplementation and a differential comparison on the fixture inputs | section 11 | verification |

## 11. Independence and clean-room coverage

1. **Who reads what.**
   - The **builder** reads this signed spec, signed r5, the base code and the named rows below. It never sees the fixtures, the clean-room code or any verification folder.
   - The **fixture author** reads **only** signed r5, this signed spec and the **named rows**: `engine-spec-0.1.0.md` sections 2 and 6 (with erratum-2 where it touches them), `engine-spec-e10-conversions.md` section 2 and its rows E10C-NF-02 and -03, E10R-AMD-3 items 1 to 3, E10R-AMD-5 items 1 and 2. Every expected value is derived by the fixture author, with the working shown to Adacs. The fixture author does not see the builder's code, the clean room, Atlas's working notes or any drafted hand check.
   - The **clean room** reimplements from signed r5, this signed spec and the same named rows only, with no sight of the builder's code or the fixtures.
   - **Adacs** compares the builder's output with the fixtures and the clean room line by line and decides acceptance. Engineering cannot override an acceptance FAIL.
2. **This spec cannot leak a value.** It states no expected output and no hand-worked number, so the fixture author has nothing to copy. The only numbers in it are of the two kinds listed in the header row "Holds no expected output values": values r5 itself states, and rule constants (1000, 400 places, the bounds -1, 0 and 1, the years 0001 to 9999).
3. **Clean-room coverage.** The clean room covers every engine row: F01 to F09, every status order step, every code and reason token of section 4, the numeric object and F08. It does **not** cover page strings, labels, exports or the I/E page heading: those are the page's checks (AT-ELM-12 to -16). A function or token with no clean-room counterpart is not accepted.
4. **Rows that rested on questions are in scope.** In v0.1 any row marked `Q-AT-C19E-nn` was unspecified and excluded from the fixtures and the clean room. All 22 questions are now ruled (section 12), so the behaviours they cover (negative inputs, range bounds, block granularity, not-consecutive scope, `>` edges, date text, pattern edges, `<` lines, printed-exact pairs, the "other" label, the gel-clot guards, the preset table, F09) are **in scope** for the fixtures and the clean room, as the rows state them. If a fixture or reimplementation finds a case the rows do not decide, that is a defect in the spec, reported to Atlas and not settled by the builder (A.B. signs this specification; NAD-2026-11-24-66, CH-22).
5. **No shared scratch.** No fixture, engine or clean-room data is staged in `/tmp` or any shared folder (C8, 23 Oct 2026).

## 12. Questions (by ID, with owner): all closed

All 22 questions of v0.1 are ruled. The **Ruling** column names the ruling that closes each; the question text is kept as asked in v0.1, for the record. `KAITO-2026-11-24-17` to `-25` and `-28` are cited as "T-0735 dispatch brief, 24 Nov; file entry owed" (a guard refused the write of the decisions file). No ruling is cited here that Atlas could not read or was not given. Kaito gave no ruling numbered -19.

| ID | Ruling | Owner | Rows | Question |
|---|---|---|---|---|
| Q-AT-C19E-01 | NAD-2026-11-24-53 (E20 accepted; 20 engines) | Nadira | section 2.3 | E20 is an engine outside the master list, and the master list says "19 engines". Do you rule that the suite now has 20 engines (this draft), or that C19's arithmetic belongs inside an existing engine (then the number, prefix and module id of this spec change)? |
| Q-AT-C19E-02 | KAITO-2026-11-24-20 (0.2.0 to 0.3.0, version commit only) | Kaito | section 2.4, NF-05 | Bump the package 0.2.0 to 0.3.0 (every C10 and C14 export line and every module's `engine.version` fixture expectation then changes, as E10C-NF-05 did for 0.1.1), or keep the package and carry a module line only? The number is set at build against main |
| Q-AT-C19E-03 | KAITO-2026-11-24-21 (core exports; no core change); -18 (files) | Kaito | section 2.5, NF-06 | Atlas read documents only. Which existing files export the exact-rational type and parser, the comparison, `sig3`, `sci3`, `exact` and the `engine` object? Is anything in section 2.5 not exported and in need of an additive export? (No copy is allowed: CCS-NF-01.) |
| Q-AT-C19E-04 | KAITO-2026-11-24-22 (pattern of core `parse`; non-string is `wrong-form`) | Kaito | IN-01; ELM-IN-13, -RF-07 | The decimal-text pattern at its edges: `.5`, `5.`, a leading plus sign, surrounding spaces, an empty sign. 0.1.0 section 2 says "sign optional, digits with at most one point". Which forms are plain decimal text? A JS number is `wrong-form` here (as E10R-F19): confirm for every argument |
| Q-AT-C19E-05 | NAD-2026-11-24-55 | Nadira | F05; ELM-RF-04, -IN-09 | Which texts take the `>` refusal: only text whose first character is `>`; text after leading spaces; `>=`, `≥`; a `>` inside the number text? Which take "Use digits and a decimal point only."? |
| Q-AT-C19E-06 | NAD-2026-11-24-56 | Nadira | F06, F07, F08; ELM-SU, -IE-02, -DP-01 | r5 does not say what happens for a negative B, A, sample CV, spike CV or I/E recovery, or for a computed recovery below zero (B less than A). Refused or accepted? If accepted, how is a negative value displayed (ELM-DP-01 is silent on sign and on a value below -1000)? |
| Q-AT-C19E-07 | NAD-2026-11-24-57 | Nadira | F06, F07; ELM-SU-03, -04, -IE-04 | A declared range with low above high; a negative bound; a CV maximum of zero or less; an \|r\| criterion value of zero, negative or above 1; an `r` outside the possible range. Impossible values to refuse (with which reason) or left to the user? |
| Q-AT-C19E-08 | NAD-2026-11-24-58 | Nadira | F05, F06; ELM-IN-11, -SU-08, -FL-02 | Is the suitability block all-or-nothing ("nothing is computed until every compelled field of a block is entered"), or does each of the three values compute when its own fields are complete? And when a suitability field holds a malformed value, does that refuse the result call (this draft's reading of "all faults together") or only withhold the comparison with a reason? |
| Q-AT-C19E-09 | NAD-2026-11-24-59 | Nadira | F05 (d); ELM-FL-03, -FL-02 | For a `<` result with x above L, the third FL-03 line is itself a "no comparison" line. Does it print together with the FL-02 withheld lines, instead of them, or only when no FL-02 reason applies? And do the withheld reasons also hide the first two FL-03 lines (x below L, x equal to L)? |
| Q-AT-C19E-10 | NAD-2026-11-24-60 | Nadira | F07; ELM-IE-02, -IE-07, -IE-08 | Is the listing and the "not consecutive" fact computed per curve or per screen? What if two channels share a DF? Is "up to four channels" enforced by the engine (a refusal) or only by the page? What is a curve with no channels or a screen with no curves? "Among the dilutions entered": entered in the same curve? |
| Q-AT-C19E-11 | NAD-2026-11-24-61 | Nadira | F07; ELM-IE-02 | The I/E curve has a highest standard. No relation in ELM-IE uses it. Is it a record field only (page, no engine argument; this draft), or compelled and checked against λ as in ELM-RF-05? |
| Q-AT-C19E-12 | NAD-2026-11-24-61 | Nadira | F07; ELM-IE-02, -IE-05 | Bounds on the instrument's reported spike recovery (negative, above any limit); and when a limit is declared and the concentration is missing for a per-mg or per-Unit limit: the screen reads "no limit declared", or reports the missing concentration? |
| Q-AT-C19E-13 | NAD-2026-11-24-62 | Nadira | printed-exact flag; ELM-DP-02 | Is "look equal at three figures" the identity of the `display` strings of E20L-F08 (this draft)? Is the test needed for suitability comparisons as well, or only for the four pairs ELM-DP-02 names? |
| Q-AT-C19E-14 | NAD-2026-11-24-63 | Nadira | F03, section 5.2; ELM-UN-02, -IN-03 | The typed "other" label: may it be blank, contain `/`, or have surrounding spaces? Is the concentration unit compared as exact text including case and spaces? |
| Q-AT-C19E-15 | KAITO-2026-11-24-23 (not read when D is mL) | Kaito | F03; ELM-IN-06 | When D is mL, `c` and `cUnit` are not read. If a caller supplies them, ignore (this draft, with the used c echoed and `cFixed` true) or refuse? |
| Q-AT-C19E-16 | KAITO-2026-11-24-23 (presence checked; content never stored or returned) | Kaito | E20L-IN-05; ELM-IN-03, -SU-05 | Is the "source string required" check (presence only, content never read) an engine row (this draft, so `missing` names it) or a page rule? |
| Q-AT-C19E-17 | KAITO-2026-11-24-24 (F09 is an engine row); NAD-2026-11-24-64 (rule) | Kaito | F09; ELM-FL-05 | Your brief says the page makes no comparison. The date flag is a comparison of two dates. Engine row F09 (this draft) or page-only? |
| Q-AT-C19E-18 | KAITO-2026-11-24-24 (preset table in the engine) | Kaito | F02; ELM-IN-05 | "Preset pass-through, values from r5 only": the engine holds the closed table of five entries (this draft) and the page reads it, or the page holds the typed text and the engine only receives a flag? |
| Q-AT-C19E-19 | KAITO-2026-11-24-24 (both gel-clot guards stay) | Kaito | F05, F03; ELM-IN-17 | The gel-clot branch: `resultBlockOffered` false from F03, and E20-RC-02 from F05 for `"gel-clot"`. Confirm both, or leave the refusal to the page |
| Q-AT-C19E-20 | THR-2026-11-23-478 to -482 (section 8 as replaced) | Theron | section 8; E20L-NF-08 | Confirm the scan term list for identifiers (the THR-105 list, the verdict words, `certificate`, `usp`, `aami`) and the substring rule. Is `valid` (added by Atlas) wanted? Are comments in scope? Are user-typed texts echoed by the engine outside the scan (this draft)? |
| Q-AT-C19E-21 | KAITO-2026-11-24-25 (F08 composition of `sig3` and `sci3`); NAD-2026-11-24-56 (negatives) | Kaito | F08; ELM-DP-01 | Does an existing display function already give the DP-01 form (plain digits below 1000, `d.dd × 10^n` from 1000)? If not, F08 as a composition of `sig3` and `sci3` is the new function. Confirm the name and placement |
| Q-AT-C19E-22 | NAD-2026-11-24-64 | Nadira | F09; ELM-FL-05, -IN-12 | Dates are typed `YYYY-MM-DD`. Refuse text that is not a calendar date (30 February, month 13)? With which reason and which sentence? Any other format? |

**Count by owner (all ruled):** Nadira 12 (01, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 22); Kaito 9 (02, 03, 04, 15, 16, 17, 18, 19, 21); Theron 1 (20). Total 22. **Open questions: none.** Open points for the owners, not questions on this spec: Kaito's file entry for KAITO-2026-11-24-17 to -25 and -28; the separate URS amendment (KAITO-2026-11-24-28) before the page build.

## 13. Register of values

| Value | Basis | Status |
|---|---|---|
| K = 5 EU/kg; K = 0.2 EU/kg; 0.5 EU/mL | ELM-IN-05; GTCMC as quoted in r5 | Presets in F02, "recommended" is page text; r5 register: "Presets; Solon dated check done" |
| Recovery range 50 to 200 %, bounds included | ELM-SU-03, -SU-07 | Preset-4 in F02, never preselected (page) |
| \|r\| criterion 0.980 | ELM-IE-04 | Preset-5 in F02, applied to the absolute value, never preselected (page) |
| Three significant figures; exponent form from 1000 | ELM-DP-01 (ruled, NAD-2026-11-23-09(f)); KAITO-2026-11-24-25 (composition); NAD-2026-11-24-56 (negatives) | F08 |
| Bounds 0 and 1 (\|r\| criterion), -1 and 1 (`r`); 400 decimal places; years 0001 to 9999 | NAD-2026-11-24-57; KAITO-2026-11-24-21; NAD-2026-11-24-64 | rule constants of F07, section 5.1, F09; none is an output |
| Package 0.3.0, module 0.1.0 | KAITO-2026-11-24-20 | section 2.4 |
| MVD = L × c ÷ λ; K ÷ M; recovery = (B − A) ÷ added × 100; R = C ÷ c; raw = C ÷ DF; λ × DF | ELM-DT-01, -04, -06, -10, -11, -SU-02 | exact relations of section 6 |
| Any other constant, plausibility limit, CV default or reagent value | none | **None in this module**; r5 invents none (ELM section 6, ELM-SU-04) |

## 14. Signature block

| Role | Name | Decision |
|---|---|---|
| Author | Atlas | DRAFT v0.3 written (T-0735), applying NAD-2026-11-24-71 to -77 (changes V-01 to V-22) and THR-2026-11-23-484 on top of v0.2, which applied NAD-2026-11-24-53 to -66, THR-2026-11-23-478 to -482 and KAITO-2026-11-24-17, -18, -20 to -25 and -28 |
| Scientific reviewer | Nadira | reviewed, not a signature: NAD-2026-11-24-71 to -77 and -88 to -90; A.B. signs this specification (K1 as amended) |
| Engineering | Kaito | confirms or changes the `DES` rows; file entry of KAITO-2026-11-24-17, -18, -20 to -25 and -28 owed |
| Legal | Theron | confirms section 8 as applied, including the two hand-back corrections |
| Acceptance | Adacs | not applicable until a build exists |

**v0.3, for signature. Not approved until signed by A.B.; do not build before then.** Guard blocks: four; the fourth is as item (4) of the Guard blocks row states. (1) Carried from the v0.1 run: a `sed -i` command was refused by the command guard (as the T-0735 brief records it; Atlas holds no raw text), not retried in any other form. (2) The v0.2 run: one `grep -nE` self-check over the v0.2 file was refused by cmd-guard (full text in the v0.2 change list, section F), not retried in any form; the leftover-phrase check was made by reading and the mechanical check is left to the main session. (3) The v0.3 run: one command that held a cd and a cp of the v0.2 file was refused by cmd-guard (2026-11-24T02:30:10 in the command log); Atlas stopped, and v0.3 was then written by the route Cipher ruled (2026-11-24-t0735-c19-routes.md, Q1).

