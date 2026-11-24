# User Requirements Specification: Endotoxin Limit and Maximum Valid Dilution (suite ID C19), v0.1 (for signature; r5; drafts r1-r4 superseded; earlier labels 'v0.2 DRAFT' in r2/r3 were drafting labels only)

| Field | Value |
|---|---|
| Title | Endotoxin Limit and Maximum Valid Dilution (internal ID 3.10(a); never shown) (THR-2026-11-23-451). Marque may shorten it, never to a form where "valid" stands alone. |
| Suite ID | C19 (repository to be scaffolded at the benchtools-OS root, stage 4) |
| Version | **v0.1 (for signature; r5; drafts r1-r4 superseded; earlier labels 'v0.2 DRAFT' in r2/r3 were drafting labels only)**. It supersedes the drafts r1 (sha256 `7264d7a890570d7b2cf3b0d54631f3a453b43ecd543eab272e1bbb90a1e61aed`, not edited), r2 (sha256 `d600980db80e5f423f57c6ccb0066ea6afc468be6eb759aaf1690cfa893030cd`, not edited), r3 (sha256 `2bbb5bbf6c64880bbd6f6f6cad8959fc46fe14c822dc978773219836ad2d96aa`, not edited) and r4 (sha256 `3798d8957ce6c45a2dccb7d4a323a3a5060b0e0386cb9889457911f68eddc0c8`, registered as D-0131, not edited). Not signed. Requirement IDs (prefix `ELM-`) are frozen only on signature, and none is signed. |
| Device-status tier (THR-106) | Mode A: Tier 1 (THR-2026-11-23-450). Mode B: not tiered; to Theron before any Mode B URS. |
| GxP impact | none. Research use only. Not qualified for GxP decision-making. |
| Drafted by | Atlas, for T-0735 stage 1 (drafts r1 to r4; this file is r5, the next revision) |
| Science | to be signed by Nadira (route K1 of the run brief: `records.mjs request <D> --approver nadira`). Atlas has resolved no scientific question and made no product decision. |
| Product | No product-signature row. Science is signed by Nadira through `records.mjs request <D> --approver nadira` (KAITO-2026-11-24-01). |
| Acceptance | Adacs line by line, after the fixture author (from the signed URS only) and the clean room. |
| Checkout read | branch `c11/preconditions`, HEAD `1b42bfe` (as given at session start). Nothing under any tool repository, `runs/`, `verification/` or `reimpl/` was read. bench-engines was not opened; its state is quoted from Nadira's ruling (`origin/main` at `230e20a`). |
| Guard blocks | Per run, from Atlas's own run records: r1 none; r2 none; r3 none; r4 none; r5 (this run) none. (Blocks recorded by other agents in their own reports: Theron two, Vera one; not repeated here.) |
| Location | `/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1-r5.md`. It moves to the tool's `docs/` only after signature. |
| Single-file delivery | One file. The release cut is section 0, the questions are section 19, the change map is section 22. |
| How the drafts were made | r1 was read in full and left untouched. r2 was retyped from r1 as one integrated text (in four writes), with the change lists applied by requirement. r3 was made from r2 by one `cp` and then edits only (Edit tool); r4 (D-0131) was made from r3 the same way (one `cp`, then edits only); r5, this file, was made from r4 the same way (one `cp`, then edits only). The OLD/NEW check is section 22 (every change ID with the requirement IDs it touched; r2 → r3, r3 → r4 and r4 → r5 are exact strings). The sha256 of each draft is given in Atlas's reply: a file cannot contain its own hash (C-67). Atlas's hand check of the fixture relations is kept apart from this document, in `/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-v0.1-working-notes-NOT-FOR-FIXTURE-AUTHOR.md`, for Nadira and Adacs only and never for the fixture author. |
| Marks used | No P marks remain (NAD-2026-11-24-34). |

Research use only. Not qualified for GxP decision-making.

## Sources of the changes, r2 onward (what the changes rest on)

| Key | Item | Identity |
|---|---|---|
| R1 | Atlas v0.1 DRAFT (r1, the first draft) | sha256 `7264d7a890570d7b2cf3b0d54631f3a453b43ecd543eab272e1bbb90a1e61aed` |
| REV | Nadira, pre-signature science review, NAD-2026-11-24-01 to -24, change list C-01 to C-67: `.claude/reports/nadira/2026-11-24-t0735-c19-urs-draft-review.md` | sha256 `4b7dc25c0f3cc645f6a6465464ceff4ddf782eda66e8aa407629b1933ce6f53e` |
| THR | Theron, legal review, THR-2026-11-23-450 to -458, change list 1-21: `.claude/reports/theron/2026-11-24-t0735-c19-legal-review.md` | sha256 `dfc3c87cd5e137b46a7ec82a8e48b4318ab7d9db662e7bcf4cd95b8af4b50971` |
| VERA | Vera, GxP-claim check, VERA-2026-11-24-01 to -07 (and -08, her own), change list 1-10: `~/.claude/ligant-hq/vera/reports/2026-11-24-t0735-c19-gxp-claim-check.md` | sha256 `3e9e0653f631278bc2042679f7db8b3b8dc2f930ff6243f6ca3ea8c30eb77ecd` |
| WARDEN | Warden, data class and privacy line, change list 1-8: `.claude/reports/warden/2026-11-24-t0735-c19-privacy-class.md` | sha256 `d5c59250d7dc9096e2398fea8eae20c929f54e1178ca56ee1a4a7ecb6ddceaaa` |
| KAITO | Kaito, decisions KAITO-2026-11-24-01 to -08: `.claude/reports/kaito/2026-11-24-t0735-decisions.md`; and KAITO-2026-11-24-09 given in the r2 task (dropping the export gate also drops J-10 and Q-AT-C19-27; Q-AT-C19-24 to -30 are answered by KAITO-01 to -07) | sha256 `6f3b8aee8e23f6832c696be4d74f129459b451ac55b6dd91782002ddab071f93` (file; -09 is from the task message, not the file) |
| SOLON | Solon, dated citation check: `~/.claude/ligant-hq/solon/reports/2026-11-24-t0735-endotoxin-citation-check.md`: GT CMC, FDA Q&A Ed. 2, FDA page, 312.23 (words), 600.3(r), PDG VERIFIED, with the corrections in NAD-2026-11-24-19 to -21 | sha256 `a7453a3a3d1d8e60d4cb0470bb2746082fab1620f845c3da8988c9793362652c` (Atlas read this hash with `shasum`; Atlas did not read the report's text, only Nadira's and Theron's quotes of it) |
| THR3 | Theron, r3 clearance of the final strings, THR-2026-11-23-465 to -471, change list T4-01 to T4-10: `.claude/reports/theron/2026-11-24-t0735-c19-r3-clearance.md` | sha256 `64a4e4effc367cb2f9cbc63d400c1c50954b2eb85defe09e2ffddee651415a79` |
| VERA3 | Vera, r3 confirmation of W-7, the section 12.1 and 12.2 role words and her change list 1, 3-6, 8-10, VERA-2026-11-24-09 to -11, change list V4-01 and V4-02: `~/.claude/ligant-hq/vera/reports/2026-11-24-t0735-c19-r3-confirm.md` | sha256 `b5f2ead19814eb110ccc8bc34d31b7a0a48a17f4117b9901b6747df4b925673c` |

Nadira opened the texts below on **23 Nov 2026** (her 23 Nov report). Atlas did not open them; Atlas works from her quotes and her ruling IDs. Citation form is file plus ID (programme rule).

| Key | Item | Identity |
|---|---|---|
| RUL | `.claude/reports/nadira/2026-11-23-t0734-bet-calc-urs-ruling.md` (NAD-2026-11-23-01 to -13) | sha256 `cd5899338e16afdee9e322d3ce4c076b49801d90ab8f76ec41c0be1e964830a4` |
| BRIEF | `.claude/reports/kaito/2026-11-23-t0735-endotoxin-run-brief.md` (rules K1 to K6) | sha256 `283d9b717d6f94175cca71ed17727fcd05d01827c2828574bcfcd09dfa1f2923` |
| PDG | "Pharmacopoeial Discussion Group, Q-06 Bacterial Endotoxins Test, Rev. 2 (signed off June 2011; sign-off cover sheet version 2, 2026)" (NAD-2026-11-24-19, amended by NAD-2026-11-24-30), https://www.pmda.go.jp/files/000280573.pdf, 11 pp.; line numbers are the text's own margin numbers | sha256 `5751806406721a0dbd27867b25503e948aa3d9fb4b5dab13ef11d42d56e3bfe2` |
| FDAQA | FDA, Pyrogen and Endotoxins Testing: Questions and Answers (Edition 2), March 2026, https://www.fda.gov/media/83477/download | sha256 `6e897c21f81341f49d3fa8c07ac4bdc1a16d217a21a8b1293b4737f4637128e1` |
| FDAPAGE | FDA web page "FDA clarifies current thinking on pyrogen and endotoxins testing", content current as of 03/18/2026, read by WebFetch; an FDA web page, cited with its date; not guidance text (Solon §3) | no file hash |
| GTCMC | FDA, CMC Information for Human Gene Therapy INDs, January 2020, https://www.fda.gov/media/113760/download | sha256 `8bfad57bf0044fa38e1b5d0b3d6f195105e7decc6b689fda74a4403885570d5f` |
| CFR | 21 CFR 312.23, https://www.law.cornell.edu/cfr/text/21/312.23 (the page shows an amendment at 91 FR 60003, 22 Sep 2026, **not read**; nothing from 312.23 is quoted word for word, KAITO-2026-11-24-08, NAD-2026-11-24-20) | LII page, no file hash |
| CHK | IND assay report checklist v1.0 (`Ligant-AgentCloud/research/2026-11-16-ind-assay-report-checklist.md`); internal; rows l.60, l.73, l.142, l.170 | sha256 `52b5ec423ddf07f3bce3c39dd1edd3900fae2e4148352bcb59b1a75d92e66dfd` |
| D0126 | `/Users/moszart/Ligant-Agents/ops/plans/2026-11-19-ind-tie-public-copy-approval.md` (D-0126 v1) | signed 19 Nov (Nadira's record -32) |
| ENG | bench-engines `origin/main` at `230e20a`: `src` = core, E10, E7, E9. No E12, no 1.7 module. | as quoted by Nadira |

**Input only, not a source:** the customer scoping document `.claude/reports/nadira/inputs/URS-BET-CALC-001-v0.2.pdf` (sha256 `92433796f1d23bb45b2b5727452cf0727c917acfe2b23084c0722848b430f5d6`). It is an input for the requirement structure and the arithmetic. Nothing from it is quoted on any page, and its author is not credited (A.B., Q3, as recorded in BRIEF). No string in this URS is carried from it (THR-2026-11-23-457). The file stays out of every public run-only export and out of any backup that is not private (Theron, to Kaito). Its USP figures came from unopened third-party copies, so it is not an opened source for any relation (NAD-2026-11-23-05(d)).

**Not read (unverified, so no relation rests on it):** USP chapters <85>, <86>, <1225>; Ph. Eur. 2.6.14 and 2.6.32; supplier product pages and inserts; the 2012 FDA Q&A (superseded by Edition 2). No sentence anywhere says the tool follows, implements or is consistent with any USP chapter (NAD-2026-11-23-03, -05(e)).

---

## 0. Purpose, scope and the release cut

### 0.1 Purpose
Page sentence for v1 (ruled, NAD-2026-11-24-17): **"The tool takes the endotoxin limit you declare, works out the maximum valid dilution, and, when you enter a result you have already measured, shows how it relates to your limit in the limit's own unit. Every step shows its formula with your numbers, so you or a colleague can check it by hand."**

The NAD-2026-11-23-03 sentence ("... shows it in EU/mL and, when you choose, in EU/kg and EU/kg/h, ...") is recorded here as **returning with Mode B**; it is not shown in v1.

Who uses it: a scientist, and anyone checking the arithmetic by hand. (ruled, NAD-2026-11-23-03)

The tool exists because the endotoxin calculation goes wrong at the bench in recurring ways: a limit read in the wrong basis, a limit per mg or per Unit compared with an EU/mL figure, a maximum valid dilution worked out without the concentration of the sample solution, a result entered that was not multiplied by its dilution factor, a spike recovery computed on a binary-float difference, and a figure at the limit labelled as inside it.

Mandatory requirements must be met and accepted before the tool is released (suite acceptance). (ruled, NAD-2026-11-23-03)

### 0.2 In v1: Mode A, "specification"
- The limit, from one of: a typed limit in its own unit with its source (ELM-IN-03); K and M (ELM-IN-04); a labelled preset (ELM-IN-05).
- The technique (ELM-IN-17) and the concentration of the sample solution, tied to the limit's unit (ELM-IN-06).
- The maximum valid dilution (MVD) (ELM-DT-04), with λ labelled as ruled (ELM-IN-07).
- An optional measured result with its qualifier, the dilution check, the raw reading check, the comparison with the declared limit as a relation in the limit's own unit (ELM-DT-05 to -10). Not offered for gel-clot (ELM-IN-17).
- Suitability as user-declared ranges, with no verdict (ELM-SU).
- The I/E screening module, kept in v1 as a separate, optional screen (ELM-IE; judgment call J-2, confirmed by KAITO-2026-11-24-07).
- The facts-and-evidence export pack (ELM-OU). There is no export gate (ELM-OU-11).

### 0.3 Not in v1
- **Mode B** (from volume, body weight and time): deferred. Section 11. No Mode B requirement is frozen.
- Radiopharmaceutical limits (175/V, 14/V) and the 100 EU/m² body-surface form: out (NAD-2026-11-23-06(d)). The m² form is never built (do-not-build list, -1232).
- Adjusted MVD for pooled units (FDAQA Q4): a candidate for v1.1 (NAD-2026-11-23-06(e)).
- Any statement that the relations apply to recombinant reagents (NAD-2026-11-23-07(f)). The tool computes the same arithmetic on the method the user declares.
- A standard-curve acceptance check, a main-flow standard-curve |r| check (NAD-2026-11-24-07), a comparison of two reagents, a judgment of reagent or instrument performance, gel-clot endpoint reading and any comparison of a gel-clot result (ELM-IN-17), import from an instrument or LIMS, a batch or disposition workflow.
- A GxP edition (A.B., Q2 as recorded in BRIEF).
- Saving and resuming a project file: confirmed (KAITO-2026-11-24-02).
- Any unit conversion between limit-denominator units (ELM-UN-03; NAD-2026-11-24-11).
- The intraocular "2.0 EU per dose per eye" preset (J-5; accepted, NAD-2026-11-24-09). The typed-limit route with unit "other" covers that limit. (internal; if a 'not in v1' list reaches a page, it reads 'the intraocular injection preset', with no unit)
- A closed list of test-article types: a v1.1 candidate for the committee (NAD-2026-11-24-16).

### 0.4 Not claimed
The tool does arithmetic on the numbers you typed. It does not know whether your limit, route, reagent, curve or dilution is right. It makes no decision about any material, and no verdict word is used anywhere (pass, fail, release, conforms, meets specification, eligible, safe, compliant, validated, qualified). **The parenthetical verdict-word list is internal; it is never printed on the page or in the About panel** (THR-455(b)); the page carries ELM-FL-07 instead. **The fixed line "Research use only. Not qualified for GxP decision-making." is the one permitted use of "qualified", and it is never reworded** (VERA-2026-11-24-06).

### 0.5 Definitions
- **Limit (L):** the endotoxin limit, a number with a unit "EU per [D]", where D is the limit's denominator unit: mL, mg, Unit, or another unit you type.
- **K:** a threshold amount of endotoxin per kg, in EU/kg. PDG's words: "a threshold pyrogenic dose of endotoxin per kg of body weight" (PDG Q-06 Rev. 2, l.66). This quotation may reach a page only inside quotation marks, attributed, in help, About or the Published values panel, never in a label, heading, title, meta field, JSON key, CSV header or schema (THR-452).
- **M:** the largest amount of product per kg given in any single hour period, in [D]/kg. PDG's words: "M is equal to the maximum recommended bolus dose of product per kg of body weight. When the product is to be injected at frequent intervals or infused continuously, M is the maximum total dose administered in a single hour period" (PDG Q-06 Rev. 2, l.66-69), same placement rule as K. The tool counts both cases the same way: the largest amount per kg given in any one hour. The single hour is the counting window for both K and M, so K/M is in EU per [D] (NAD-2026-11-23-06(a)).
- **Concentration of sample solution (c):** the quantity PDG §6 names, with unit [D] per mL ("ml/ml when the endotoxin limit is specified by volume (EU/ml)"; "mg/ml" for EU/mg; "Units/ml" for EU/Unit).
- **λ:** the label in ELM-IN-07.
- **DF:** the dilution factor of the tested sample, dimensionless, 1 meaning neat. The input field is labelled as in ELM-IN-08.
- **C:** the measured result in EU/mL, already multiplied by DF as the instrument reports it (ELM-IN-09).
- **R:** the result in the limit's own unit, R = C ÷ c, in EU per [D] (ELM-DT-10). R = C when D is mL.
- **Raw reading:** C ÷ DF.
- **Equal / below / above:** exact comparison of two exact decimal (rational) values, never of rounded figures.
- **Declared range:** a range you type (or select from a labelled preset) with its source; the tool reports whether a value is within or outside it and nothing more. Bounds are included (ELM-SU-07).

---

## 1. The whole workflow (design standard, section 1)

| Bench step | What a spreadsheet leaves to memory | In C19 v1 |
|---|---|---|
| 1. Decide the limit | Which K for which route; which M window; whether the limit is per mL, per mg or per Unit | Limit typed with source, or K/M, or a labelled "recommended" preset; the route is chosen by you, never inferred; the unit travels with the number |
| 2. Turn the limit into the greatest dilution | MVD written as limit ÷ λ, which is right only for a limit in EU/mL; what λ means for the technique | Technique declared first (it fixes what λ means); MVD = L × c ÷ λ with the concentration term shown; refused when the units do not cancel |
| 3. Enter the result | Whether the instrument number is already multiplied by the dilution | Field label says so; the raw reading C ÷ DF is checked against your curve range |
| 4. Check the dilution | DF against MVD | DF line with its inputs and outcome |
| 5. Check suitability | Spike recovery arithmetic done on a float difference; criteria remembered; the basis of B, A and the spike | Recovery computed from B, A and the amount added, exactly, on a basis you declare; ranges are yours (a 50-200% preset may be selected, never preselected) |
| 6. Compare with the limit | "Within limit" for a value that equals the limit; a per-mg limit set against an EU/mL figure | Result brought into the limit's own unit (R = C ÷ c); relation: below, equal to, above; or "No comparison shown: [reason]" |
| 7. Choose a dilution to screen (optional) | Effective sensitivity λ × DF worked out by hand | I/E screen lists dilutions; it selects, ranks and recommends none |
| 8. Record and share | Which basis, which limit source, which reagent | Evidence export (ELM-OU), notebook text, CSV, JSON, one-page print; no gate, file stays local |

**Not covered, said on the page:** body-weight arithmetic (Mode B), the standard curve, instrument import, a gel-clot result comparison, a decision about a material. Arrival with data: typed. The shared JSON record of other Ligant tools is not read in v1; the tool writes a JSON record and reads none (ELM-ST-02).

---

## 2. Requirements: input (IN)

All numeric fields take plain decimal text with a point. Nothing is computed until every compelled field of a block is entered. No field has a default; after Clear every field is empty. Every field carries a mark: **E** (entered by you) or **C** (computed by the tool) (-1217). No field is removed in v1, so no X mark is shown.

| ID | Requirement | Basis |
|---|---|---|
| ELM-IN-01 | **The page opens empty.** The worked example loads only by its own button (ELM-IN-15). | STD; RUL -02 |
| ELM-IN-02 | **Limit source, chosen with no default:** (a) a limit you type; (b) K and M you type; (c) a preset. The chosen source prints on every output line the limit governs. The page offers no field for body weight, volume to give or time. | RUL -02; -06(b); THR-450(a) |
| ELM-IN-03 | **Typed limit.** Two declarations (-1217): the value (greater than zero) and its unit, chosen from `EU/mL`, `EU/mg`, `EU/Unit`, or "other: you type the unit it is per" (for example `10^6 cells`); plus a **source string, required** ("where this limit comes from", text). Echoed as typed. | RUL -04, -05(b); -1217 |
| ELM-IN-04 | **K and M.** K: value greater than zero, unit fixed as EU/kg, source string required. **K label (ruled, NAD-2026-11-24-23(a), amending NAD-2026-11-23-06(a)): "K = [K] EU/kg (per single hour period)"**, [K] being your typed number. **When K comes from a preset,** append **"; FDA writes this as [K] EU/kg body weight/hour"** (true for 5 and 0.2, GTCMC pp.48-49). "body weight" appears only in this attributed unit form and in attributed quotations (THR-450(b)). M: value greater than zero, with a unit you choose from `mL`, `mg`, `Unit`, or other typed, shown as [unit]/kg, source string required. M label (cleared as is, THR-452): **"M: the largest amount of product per kg given in any single hour period, in [unit]/kg, from your specification"**; "from your specification" carries THR-450 and stays. The limit's denominator D is the unit chosen for M. | RUL -02, -06(a); NAD-2026-11-24-23(a); THR-450, -452 |
| ELM-IN-05 | **Presets** (ruled, NAD-2026-11-23-06(b)), each labelled "recommended", never "required", each carrying its source string, none preselected; **the route is chosen by you, never inferred** (LIM-06 kept). (1) K = 5 EU/kg: "any parenteral drug, except those administered intrathecally or intraocularly"; (2) K = 0.2 EU/kg: intrathecal; (3) typed-limit preset 0.5 EU/mL: ophthalmic irrigation products. **Visible preset label (THR-455(e)): "[value] (FDA recommended upper limit, gene therapy CMC guidance, January 2020)"**, so the recommendation is never read as Ligant's. Source string for each: **"FDA, CMC Information for Human Gene Therapy INDs (January 2020), section V.B.5.b.iii, recommended upper limit"**. A preset fills K (you still type M) or the limit; the filled value is editable only by switching to source (a) or (b), and the value used prints. The quotes are in the Published values panel (ELM-OU-03). Intrathecal help text is ELM-FL-12. | RUL -03, -06(b); THR-455(e) |
| ELM-IN-06 | **Concentration of the sample solution (c).** If D is mL: not typed; printed as **"concentration of sample solution = 1 mL/mL (limit in EU/mL)"**. If D is not mL: required, value greater than zero, with a unit that is D per mL (`mg/mL` for EU/mg, `Units/mL` for EU/Unit, "[typed unit]/mL" for other). The term is compelled whenever the limit is not per mL. For "other", c is the number of those units per mL of sample solution (NAD-2026-11-24-09). | RUL -05(b) |
| ELM-IN-07 | **λ and the highest standard.** λ (greater than zero). Label, branching on the technique (ELM-IN-17; both are halves of the ruled -05(c) label): for **Gel-clot**, **"λ: labelled lysate sensitivity, in EU/mL"**; for Turbidimetric, Chromogenic and Fluorimetric, **"λ: lowest standard on your curve, in EU/mL"**. **Highest standard**, label **"Highest standard on your curve, in EU/mL"** (ruled, NAD-2026-11-24-12): compelled only when a result with qualifier `=` is entered (the raw-reading check never runs for `<`, ELM-DT-06); it must be greater than λ. Ranges are typed from your method documentation; none is hard-coded and no plausibility range is invented. | RUL -05(c), -09(c); NAD-2026-11-24-12, -15, -23(i) |
| ELM-IN-08 | **Dilution tested (DF, dimensionless, 1 or more, 1 meaning undiluted).** Field label (ruled, NAD-2026-11-24-04): **"Dilution tested: 1 part sample in [ ] parts total"**, with the note **"(this number is the dilution factor, DF; 1 = undiluted)"** beside it. Compelled when a measured result is entered or an MVD comparison is wanted. The tool never multiplies the result by DF. The ruled reason and status strings that contain "dilution factor" stay unchanged, because they are not field labels (FL-02, IE-06, IN-09, W-4, W-8). | RUL -09(g); NAD-2026-11-24-04; -1217 item 7 |
| ELM-IN-09 | **Measured result (optional).** Qualifier selector `=` or `<` (no default), and the value (0 or more). Field label, ruled: **"result in EU/mL, already multiplied by the dilution factor (as your instrument reports it)"**. For `<`, the number is the reported floor and **only a number is taken, never an expression** such as "<0.005 × DF". Help text: **"for a diluted sample, the reported floor is the smallest dilution factor × λ"** (NAD-2026-11-23-09(a); PDG l.197-199). A ">" qualifier is not offered; text beginning ">" is refused (ELM-RF-04). Not offered for gel-clot (ELM-IN-17). | RUL -09 |
| ELM-IN-10 | **Reagent type (no default; compelled for any comparison, not for the limit and MVD).** Options, ruled: **"Amoebocyte lysate (LAL)"**, **"Recombinant cascade reagent (rCR)"**, **"Recombinant factor C (rFC)"**. An MVD-only export prints "reagent type: not selected". Optional free text **"method reference, as in your procedure"**, placeholder **"for example, your procedure number and revision"**; no picklist, autocomplete, suggestion or example names a supplier or product, here or in the I/E screen; the text is echoed exactly as typed, only in the user's own screen and export (no styling, logo lookup or link) (THR-456). Optional free text **"your suitability verification reference for this reagent"** (prints "not entered" if empty; no flag; help text quotes the **FDA web page "FDA clarifies current thinking on pyrogen and endotoxins testing" (content current as of 18 March 2026)**: **"Sponsors using recombinant reagents should verify that the assay method is suitable for its intended purpose."** The page's next sentence, which names USP <86>, is not quoted.) The tool never compares, converts between or ranks results from different reagents. | RUL -03, -07(f), -10 (OI-14, OI-17); NAD-2026-11-24-15; THR-455, -456 |
| ELM-IN-11 | **Suitability block** (section 7 for rules). Sample CV (%), spike CV (%); spiked-sample reading B, unspiked-sample reading A and the added endotoxin amount, all in EU/mL **on one basis that you declare** (below); for each of the three criteria, a **declared range** and a **source string** (the owner of the criterion, -1217). There is no typed "recovery %" field in the main flow (ELM-SU-02). **Basis declaration, compelled, no default (ruled, NAD-2026-11-24-06): "B, A and the added amount are: (a) as measured in the tested dilution; (b) multiplied by the dilution factor, like your result"**. It prints with the recovery line. Missing: **"suitability values incomplete: basis of B, A and the added amount"**. Help text: **"Recovery is the same on either basis, as long as all three use the same one. A spike stated as added to the test well, set against sample values multiplied by the dilution factor, gives a recovery wrong by that factor."** | RUL -07; NAD-2026-11-24-05, -06 |
| ELM-IN-12 | **Optional record fields** (print only, never enter a calculation, "not entered" when empty): reagent lot; reagent expiry date; instrument calibration due date (as you record it); test date; equipment ID; **name (as you type it; not a signature)** (VERA-2026-11-24-02); notebook or run reference; diluent; **spike concentration stated by your reagent supplier for this lot (EU/mL), where the spike comes with your reagent** (help text: **"This field is recorded, not calculated: recovery uses the added amount you enter with B and A."**; the export line, CSV header and JSON key are `spike_conc_supplier_stated`, with no "certificate" or "CoA"); standard curve mean reaction times; spike channel value (EU/mL); glucan blocker use (Yes / No / N/A) and a β-glucan test reference. **Two fields move to the export header** (NAD-2026-11-24-16, ELM-OU-04), still optional, "not entered" when empty: **sample or product identification** (help text: **"the product, intermediate or material you tested"**, THR-450(e); the tool is never described as testing a human specimen) and **sample stage and matrix**. All free-text record fields carry `autocomplete="off"` (advisory, Warden). Dates are typed `YYYY-MM-DD` and compared as calendar dates (ELM-FL-05). | RUL -03, -09(d); NAD-2026-11-24-16; THR-450, -453; VERA-02; WARDEN 5 |
| ELM-IN-13 | **Numeric entry rule.** Plain decimal text only; other forms (`2e5`, `1,5`, unit suffixes) are refused with the suite sentence **"Use digits and a decimal point only."** (as ruled for C14, NAD-2026-11-14-316; reused unchanged, KAITO-2026-11-24-03; NAD-2026-11-24-24). Inputs are held as exact decimals, never binary floating point, and echoed exactly as typed. | STD; core; KAITO-03 |
| ELM-IN-14 | **Why-we-ask strings** (STD), each naming the bench mistake it prevents; ruled (NAD-2026-11-24-12); Marque may simplify without weakening. **W-1** beside the limit source: "Why we ask: the same product can have different limits by route and by specification. The tool works out the limit you give it; choosing the route stays with you." **W-2** beside M: "Why we ask: M is the largest amount per kg given in any one hour period. An amount given in 30 minutes still counts as one hour's amount." **W-3** beside the concentration term: "Why we ask: a limit per mg or per Unit must be turned into a per-mL figure by the concentration of your sample solution before it can be set against λ. A limit in EU/mL needs no conversion: 1 mL/mL." **W-4** beside the result: "Why we ask: this tool assumes the number you enter is already multiplied by the dilution factor. If you enter the raw reading instead, the result is understated by that factor." **W-5** beside λ: "Why we ask: λ is the lowest standard on your curve, not the detection limit of your sample." **W-6** beside the suitability ranges: "Why we ask: the ranges are the ones your procedure or your reagent supplier gives. The tool reports whether each value is within or outside the range you declare, and nothing more." **W-7** beside the reagent type: "Why we ask: a number without its reagent type can be read later as if it came from a different reagent. The reagent type travels with the number everywhere it is shown." **W-8** beside the "<" floor: "Why we ask: a result reported as "less than" is an upper bound, not a measured value. For a diluted sample, the floor is the smallest dilution factor × λ." Theron cleared W-1 to W-8 as they stand (THR-2026-11-23-455, -459, -469). | STD; RUL -09; NAD-2026-11-24-12 |
| ELM-IN-15 | **Worked example** ("illustration, not a published value", one button, every example field marked "example", a banner while any example value is in use, noted in the export, Clear empties it). Mode A with a typed specification M; **no body weight appears** (NAD-2026-11-23-12; THR-450(d)); no supplier or product name appears (THR-456). Every example value (NAD-2026-11-24-23(b)): technique "Chromogenic"; reagent "Amoebocyte lysate (LAL)"; K = 1 EU/kg, source "example value: type the K your specification gives"; M = 4 mL/kg, source "example value: type the M your specification gives"; λ = 0.005 EU/mL; highest standard 0.5 EU/mL; dilution tested DF = 10; result `=` 0.15 EU/mL; sample CV 4, spike CV 6, each with declared maximum 10, source "example value only: use the maximum your procedure gives"; basis "as measured in the tested dilution"; A = 0.015, B = 0.060, added = 0.05 (EU/mL); recovery range: the 50-200% choice, selected by the example and marked "example". Optional record fields stay empty, to show "not entered". Hand-derived in section 15, F-28. The example walks each step with a one- or two-sentence concept note. The page does not say that K = 5 EU/kg applies to any species. | STD; RUL -12; NAD-2026-11-24-23(b) |
| ELM-IN-16 | **Clear all** resets every field. | STD |
| ELM-IN-17 | **Technique** (new, ruled NAD-2026-11-24-15): compelled declaration, no default, options named as the sources name them: **"Gel-clot"**, **"Turbidimetric"**, **"Chromogenic"**, **"Fluorimetric"**. It is compelled before MVD is shown, because it fixes what λ means (the two λ labels of ELM-IN-07). **Gel-clot:** v1 gives the limit and the MVD only; the result block is not offered and the page says **"For gel-clot, this tool gives the limit and the maximum valid dilution. It does not compare a gel-clot result."** **Turbidimetric, chromogenic and fluorimetric** enable the result block. "Fluorimetric" carries the -07(f) rule: no statement that the relations apply to it; the tool computes the same arithmetic on the method the user declares. The technique prints in the declared strip and in every export. | NAD-2026-11-24-15; -1217 item 10; RUL -07(f) |

---

## 3. Requirements: determination (DT)

Every relation is exact decimal (rational) arithmetic with no rounded intermediate. The page does no arithmetic of its own: it passes typed text to the engine and prints strings. The engine module is "K/M + MVD module, engine number assigned in the engine spec (stage 3)" (KAITO-2026-11-24-06), on `core` exact decimals and E10 (on origin at `230e20a`). Engine function names are given in the engine spec, not here, and carry no "dose" or "dosing" (ELM-OU-12).

| ID | Requirement and exact relation | Basis |
|---|---|---|
| ELM-DT-01 | **K/M.** L = K ÷ M, K in EU/kg, M in [D]/kg, L in EU per [D]. Both K and M sit on the single-hour window. Printed with the user's numbers and units, for example "K ÷ M = [K] EU/kg ÷ [M] mL/kg = [L] EU/mL". | RUL -02, -06(a) |
| ELM-DT-02 | **Typed limit.** L is the typed value, in the typed unit; no computation. | RUL -02 |
| ELM-DT-03 | **Preset.** A preset supplies K (then ELM-DT-01 applies) or L (then ELM-DT-02 applies). | RUL -06(b) |
| ELM-DT-04 | **MVD.** MVD = L × c ÷ λ, with L in EU per [D], c in [D] per mL, λ in EU/mL; the product L × c is in EU/mL and the quotient is a pure number. When D is mL, c = 1 mL/mL, printed. **MVD is refused when the units do not cancel to a pure number** (ELM-RF-06). The formula is printed with the user's numbers. | RUL -05(a), (b) |
| ELM-DT-05 | **Dilution check.** Compare DF with MVD by exact value. DF below MVD and DF equal to MVD are both permitted. DF above MVD: the comparison is withheld with the reason "dilution factor is above the maximum valid dilution" (ELM-FL-02). The check is a separate line with its inputs, formula and outcome. | RUL -04(c), -09; URS structure |
| ELM-DT-06 | **Raw reading.** Raw reading = C ÷ DF, for qualifier `=` only. Compare with [λ, highest standard], bounds inclusive. Outside: the comparison is withheld with "raw reading is outside the range you entered". When the raw reading is below λ, the line of ELM-FL-15 also prints. The check does not apply to a `<` result. A separate line with inputs, formula and outcome. | RUL -04(c), -09(g); NAD-2026-11-24-13 |
| ELM-DT-07 | **Comparison, qualifier `=`.** Exactly one of the three relation lines of ELM-FL-01, by exact comparison of R (ELM-DT-10) and L. The comparison is made on unrounded exact values (CALC-02 kept). **Equality is its own state, never folded into "within".** | RUL -04(a), (d); NAD-2026-11-24-01 |
| ELM-DT-08 | **Comparison, qualifier `<`.** The reported floor x, expressed in the limit's unit (x = floor ÷ c; the floor itself when D is mL), is an upper bound. Exactly one of the three lines of ELM-FL-03: x below L, x equal to L, x above L, by exact comparison. (Amends NAD-2026-11-23-04(b); at x = L the result is strictly below L.) | NAD-2026-11-24-18 |
| ELM-DT-09 | **Floor check.** Print DF × λ beside the reported floor. If the floor differs from DF × λ by exact comparison, print the fact line of ELM-FL-04, with [y] and its unit. [y] = DF × λ, in EU/mL. | RUL -09(a) |
| ELM-DT-10 | **Result in the limit's own unit.** R = C ÷ c, in EU per [D], printed as **"result per [D] = C ÷ c = [C] EU/mL ÷ [c] [D]/mL = [R] EU/[D]"**. When D is mL, c = 1 mL/mL, R = C and no line prints. For `<`, the floor is converted the same way, under the heading **"floor in your limit's unit"**. The comparison of ELM-DT-07 and ELM-DT-08 is made on R and x. The draft's withheld reason "limit is not in EU/mL" and judgment call J-7 are withdrawn. | RUL -05(b); NAD-2026-11-24-01; PDG l.298-300 |
| ELM-DT-11 | **λ × DF.** Print λ × DF in EU/mL with the label (ruled): **"λ × DF = [y] EU/mL: the lowest endotoxin concentration in your sample solution, before this dilution, that this dilution can measure."** It is the reported floor for a `<` result (PDG l.197-199) and shows why dilution costs sensitivity. | NAD-2026-11-24-12; PDG |
| ELM-DT-12 | **No rounded value feeds a calculation, and no decimal text written from a non-terminating value is re-entered.** The module forms MVD from K, M (or L), c and λ in one exact computation. | core exact decimals |
| ELM-DT-13 | **The calculated values stay visible** in every withheld case (TS-04 kept). | RUL -04(c) |
| ELM-DT-14 | **Time basis and per-kg conversions:** not computed in Mode A. | RUL -02 |

---

## 4. Requirements: units (UN)

| ID | Requirement | Basis |
|---|---|---|
| ELM-UN-01 | Units offered: EU, EU/kg, EU/mL, EU/mg, EU/Unit, kg (as the "per kg" in K and M only, never a weight), mL, mg, Unit, "other typed" for D, and `mg/mL`, `Units/mL`, "[typed]/mL" for c. Case and spelling exact. No weight value is accepted in Mode A. | RUL -02, -05(b) |
| ELM-UN-02 | **The concentration unit is tied to the limit's denominator.** For the fixed options the tie is a fixed pairing: EU/mL with mL/mL (= 1), EU/mg with mg/mL, EU/Unit with Units/mL. Exact text comparison applies only to "other", where the concentration unit is built as "[typed]/mL". | RUL -05(b); NAD-2026-11-24-11 |
| ELM-UN-03 | **No conversion between denominator units in v1** (no mg to ug, no g to mg). A concentration in a different unit from the limit's denominator is refused (ELM-RF-06). Any conversion that is ever added is printed (-1223 item 6). | RUL -09(e) pattern; NAD-2026-11-24-11 |
| ELM-UN-04 | Every value prints with its unit. Units are never dropped in a result line, an export or a copy. | RUL -09(c) |
| ELM-UN-05 | MVD, DF and the raw-reading ratio are dimensionless; the page says so. | RUL -05(b) |
| ELM-UN-06 | The K label prints the single-hour basis, and FDA's unit form when K comes from a preset (ELM-IN-04). The tool uses one convention throughout: K in EU/kg per single hour period, M in [D]/kg per single hour period. | RUL -06(a); NAD-2026-11-24-23(a) |

---

## 5. Requirements: flags and statements (FL), in words

| ID | Requirement | Basis |
|---|---|---|
| ELM-FL-01 | **The comparison line (ruled, exact).** Exactly one of: **"below your declared limit of [L] [unit] ([source])"**; **"equal to your declared limit of [L] [unit] ([source])"**; **"above your declared limit of [L] [unit] ([source])"**. When the shown (rounded) figures look equal but the values differ, **both unrounded values print** (CALC-03 kept). | RUL -04(a) |
| ELM-FL-02 | **"No comparison shown: [reason]"** (ruled). Reasons, in this fixed order, only those that apply: (1) "dilution factor is above the maximum valid dilution"; (2) "raw reading is outside the range you entered"; (3) "suitability values not entered" or "suitability values incomplete: [fields]"; (4) "one or more suitability values outside your declared criteria: [which]"; (5) "reagent type not selected". One line per reason, each starting "No comparison shown: ". | RUL -04(c); NAD-2026-11-24-02 |
| ELM-FL-03 | **`<` result lines.** [x] is the floor in the limit's unit (ELM-DT-08), printed with its unit. x below L: **"upper bound [x] is below your declared limit of [L] [unit] ([source])"**. x equal to L: **"upper bound [x] is equal to your declared limit of [L] [unit] ([source]); a result reported as less than [x] is below it"**. x above L: **"no comparison: the reported floor [x] is above your declared limit of [L] [unit] ([source])"**. The raw-reading reason does not apply to `<`; the other withheld reasons of ELM-FL-02 do. | NAD-2026-11-24-18 (supersedes NAD-2026-11-23-04(b)) |
| ELM-FL-04 | **Floor fact line (ruled).** **"your reported floor differs from DF × λ = [y] EU/mL"**, [y] as defined in ELM-DT-09. A fact line, never a block. | RUL -09(a) |
| ELM-FL-05 | **Date flag (ruled).** **"test date is after the expiry date you entered"**; the same form for the calibration due date: **"test date is after the calibration due date you entered"** (ruled, NAD-2026-11-24-12). A flag only, never a block; it appears on screen, in the print and in every export. Whether a result from an expired lot is usable is the lab procedure's decision. | RUL -09(d), -10 (OI-07) |
| ELM-FL-06 | **Cut** (NAD-2026-11-24-13). The special zero flag is replaced by ELM-FL-15. The ID is unused. Theron's alternative string (THR-2026-11-23-457) is moot (NAD-2026-11-24-27). | NAD-2026-11-24-13, -27 |
| ELM-FL-07 | **"This is arithmetic on the numbers you entered. It is not a decision about any material."** on every result screen and every export. | RUL -03 (HO-02) |
| ELM-FL-08 | **Equality note** (help text on the "equal to" state): **"The harmonised test text reads "less than the endotoxin limit" (PDG Q-06 Rev. 2, l.298-300). Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's."** | RUL -04(d); NAD-2026-11-24-23(d), -25 |
| ELM-FL-09 | **The central assumption** is stated in the result field itself (ELM-IN-09) and again in "What the tool cannot detect" (ELM-OU-10). | RUL -09(g) |
| ELM-FL-10 | **Unit conversion lines.** If any unit conversion is ever printed, its factor and both values show. In v1 the only conversion is R = C ÷ c (ELM-DT-10), printed; no unit-to-unit conversion occurs (ELM-UN-03). | RUL -09(c); NAD-2026-11-24-01 |
| ELM-FL-11 | **MVD help text** (quote, FDAQA Q12): **"The calculated MVD is the dilution of a sample at which the endotoxins limit would be detected, but it should not be the regular testing dilution"**. Plain words beside it: "the greatest dilution at which you could still see your limit. It is not the dilution you should test at." Concept sentence (ruled, NAD-2026-11-24-08): **"At the maximum valid dilution, your lowest standard stands for your limit: any result you can read there is at or above the limit."** | RUL -06(e); NAD-2026-11-24-08 |
| ELM-FL-12 | **Intrathecal preset help text** (FDAQA Q7, the two sentences beginning "Intrathecally-administered products" and "FDA encourages firms"; no other Q7 sentence is printed): **"Intrathecally-administered products, ophthalmics, or devices … may have endotoxins limits that are not based on the calculation for parenterally administered products. FDA encourages firms to check with the appropriate office or review division about these products."** with the attribution **"(FDA, Pyrogen and Endotoxins Testing: Questions and Answers, Edition 2, March 2026, question 7)"**. **No other sentence of FDAQA Q7 is printed anywhere** (page, help, export, public copy). In particular, Q7's second sentence ("The appropriate way to establish the endotoxins limit is to use the calculation methods provided in the USP or AAMI standards") is never printed, nor is the sentence naming USP <85>, because each would read as the tool following USP (THR-2026-11-23-458, as corrected by THR-2026-11-23-461). It may stay in the internal IND map (section 12.1). Optional neutral pointer, if a pointer on how limits are set is wanted: **"FDA's Pyrogen and Endotoxins Testing Q&A (Edition 2, March 2026), question 7, discusses how endotoxin limits are set: [link to https://www.fda.gov/media/83477/download]."** | RUL -06(e); NAD-2026-11-24-21, -36; THR-458, -461 |
| ELM-FL-13 | **No statement that the relations apply to recombinant reagents.** The tool computes the same arithmetic on the method you declare. | RUL -07(f) |
| ELM-FL-14 | The caveat travels with the number: the limit source, the K/M basis, the concentration term, DF and the reagent type print in the result line and in every export. | -1223 |
| ELM-FL-15 | **Raw reading below your lowest standard** (new, ruled NAD-2026-11-24-13). For qualifier `=`, whenever the raw reading is below λ (zero is one case), the line **"the raw reading is below your lowest standard; a result below the curve is reported as less than DF × λ = [y] EU/mL"** prints beside the withheld reason "raw reading is outside the range you entered". A raw reading above the highest standard shows only the withheld reason. | NAD-2026-11-24-13; PDG l.197-199 |

---

## 6. Requirements: refusals and incomplete states (RF), in words

A refused or incomplete block keeps its place and shows its reason, never a figure. Refusals cover only values that are impossible (NAD-2026-11-23-09(c)); no plausibility limit is invented. Message templates are ruled as stated (NAD-2026-11-24-12).

| ID | State | Words | Basis |
|---|---|---|---|
| ELM-RF-01 | A compelled field empty | "Not calculated yet. Still needed: [field labels]." | -1218; STD; NAD-2026-11-24-12 |
| ELM-RF-02 | A value of zero or less where a positive value is needed (K, M, limit, λ, c, highest standard) | "[field label] must be above zero." For the dilution tested (DF below 1): **"Parts total must be 1 or more (1 means undiluted)."** | RUL -09(c); NAD-2026-11-24-04, -12 |
| ELM-RF-03 | A negative result | "[field label] must be zero or more." | RUL -09(c) |
| ELM-RF-04 | A ">" qualifier or text such as ">0.5" in the result field | **"A result reported as greater than a value is not a quantity, so the tool does not take it. Do not enter the top of your standard curve in its place: enter only a result read within your curve."** (PDG l.199-201: a result reported as "equal to or greater than the largest dilution factor multiplied by λ" is not a quantity.) No sentence of the input document is carried. | RUL -09(b); NAD-2026-11-24-23(c), -26 |
| ELM-RF-05 | Highest standard not above λ (low greater than or equal to high) | "The highest standard must be above λ." Both fields named. | RUL -09(c); NAD-2026-11-24-12 |
| ELM-RF-06 | Units do not cancel: the concentration unit is not [D] per mL for the limit's D | "MVD not calculated: the concentration of the sample solution is in [unit], but your limit is per [D]. Enter it in [D]/mL." | RUL -05(b); NAD-2026-11-24-11 |
| ELM-RF-07 | Not plain decimal | "Use digits and a decimal point only." | ELM-IN-13 |
| ELM-RF-08 | Limit source or technique not chosen; or a result entered with no qualifier chosen | "Not calculated yet. Still needed: [label]." A missing reagent type is not a refusal. The calculated values show, and only the comparison is withheld, with the ELM-FL-02 reason "reagent type not selected" (F-23, F-27). | RUL -04(c); NAD-2026-11-24-15 |
| ELM-RF-09 | A body weight, volume or time typed anywhere | Not reachable: no such field exists in Mode A. | RUL -02 |

The input document's plausibility refusals (weight over 500 kg, volume over 5000 mL, 72 h) are **cut**, with their warnings (ERR-04, ERR-05) (NAD-2026-11-23-09(c)).

---

## 7. Suitability: user-declared ranges, no verdict (SU)

| ID | Requirement | Basis |
|---|---|---|
| ELM-SU-01 | **Three values:** sample CV (%), spike CV (%), spike recovery (%). | RUL -07 |
| ELM-SU-02 | **Recovery is computed**, not typed: recovery % = (B − A) ÷ added × 100, with B, A and the added amount in EU/mL on one declared basis (ELM-IN-11) (the numerator is "after subtraction of any endotoxin detected in the solution without added endotoxin", PDG l.270-273 and l.291-293). The formula prints with your numbers, and the declared basis prints with the recovery line. **No typed "recovery %" field exists in the main flow in v1** (NAD-2026-11-24-05). The added amount must be above zero. The basis does not change the recovery, because (k·B − k·A) ÷ (k·added) = (B − A) ÷ added for any common factor k; a mixed basis does. | RUL -07(a); NAD-2026-11-24-05, -06 |
| ELM-SU-03 | **Recovery range:** a declared range, typed, or a selectable preset **"50-200% (PDG Q-06 Rev. 2, §8(3)(ii))"**, never preselected, never silent. Prints as **"[low]% to [high]%, bounds included"**. | RUL -07(a); NAD-2026-11-24-03 |
| ELM-SU-04 | **CV criteria:** each is a declared maximum **with no default**, printed as **"at most [value]%"**. You declare the value from your procedure or from the reagent supplier's instructions. A preset exists only if Scout opens and quotes a supplier document (Q-S1; none in v1). | RUL -07(b); NAD-2026-11-24-03 |
| ELM-SU-05 | **Every declared criterion carries a source string**, required, that names its owner ("your procedure", "your reagent supplier's instructions", the preset's label): each CV maximum, the recovery range and the |r| value. A preset fills its own label as the source. | -1217 item 11; NAD-2026-11-24-14 |
| ELM-SU-06 | **Value lines (ruled form):** **"[value] is within / outside your declared range [range] ([source])"**. **Summary:** **"all three suitability values within your declared criteria"** or **"outside your declared criteria: [which]"**. The words pass, met, not met, fails and valid are not used. | RUL -07(c) |
| ELM-SU-07 | **Range bounds are included** (ruled, NAD-2026-11-24-03). A range prints as "[low]% to [high]%, bounds included", a maximum as "at most [value]%", the |r| criterion as "|r| ≥ [value]". A value exactly at a bound reads "within your declared range". This is not the limit comparison, which keeps its own "equal to" state. | NAD-2026-11-24-03; PDG l.242-243, l.262-263, l.270-273 |
| ELM-SU-08 | **Effect on the comparison:** values missing, incomplete or outside the declared ranges withhold the comparison (ELM-FL-02) and the calculated values stay visible. Nothing else changes. | RUL -04(c), -07(c) |
| ELM-SU-09 | **Optional field** on the reagent: "your suitability verification reference for this reagent" (ELM-IN-10). No flag. | RUL -03 |

---

## 8. The I/E screening module (IE), a separate optional screen

Kept in v1 (judgment call J-2; confirmed, KAITO-2026-11-24-07). It is self-contained so that Kaito can defer it by removing this section and ELM-OU-13's I/E reference without renumbering anything else. IE-09 is cut and its ID is unused.

| ID | Requirement | Basis |
|---|---|---|
| ELM-IE-01 | A separate screen headed **"I/E screening: development record. Research use only."** (ruled; kept byte-exact, Vera's four-point check, point 4). It is not a step of the main calculation. | RUL -03 |
| ELM-IE-02 | Up to four channels per screening curve, and more than one curve per screen. Per channel: DF (1 or more), spike recovery % with the label **"spike recovery %, as reported by your instrument for this channel"** (NAD-2026-11-24-05), optional spike value (EU/mL). Per curve: lot, expiry, λ, highest standard, and an optional correlation coefficient r. The reagent is not named by the tool; you enter what you used (ELM-IN-10 list, no default). Terms in the screen avoid supplier product names. | RUL -03, -10 (OI-13); NAD-2026-11-24-05 |
| ELM-IE-03 | **Recovery range:** declared by you, or the selectable preset of ELM-SU-03, never preselected; source string required. Each channel reads **"recovery within your declared range"** or **"recovery outside your declared range"** (ruled). | RUL -07(e) |
| ELM-IE-04 | **Curve criterion:** if r is entered, the criterion is |r| ≥ [value], on the absolute value. The value is **declared by you**; the labelled choice is **"0.980 (PDG Q-06 Rev. 2)"**, never preselected, editable, source string required. Status wording: **"within / outside your declared criterion |r| ≥ [value]"**, the value printed being the one declared. A rising curve with r = +0.995 is within a declared 0.980. With no r entered the channel line reads **"curve criterion: r not entered"** and the curve criterion plays no part in the listing. Channels of a curve outside the criterion are left out of the listing (ELM-IE-07) and the value used prints. There is no main-flow standard-curve |r| check in v1. | RUL -07(d); NAD-2026-11-24-07 |
| ELM-IE-05 | For each channel print **effective sensitivity = λ × DF** (EU/mL of sample solution) and, if a limit is declared on the main screen (and c, when the limit is not per mL), the ratio = (λ × DF) ÷ (L × c), both in EU/mL, printed with its formula. The ratio equals DF ÷ MVD exactly (MVD = L·c/λ); the page may say so as a concept note. | RUL -08; NAD-2026-11-24-23(e) |
| ELM-IE-06 | If a limit is declared, check each DF against MVD. A DF above MVD reads **"dilution factor above the maximum valid dilution"** (ruled), shown even when the recovery is within range. If no limit is declared, MVD is not formed and the screen says "no limit declared: MVD not shown". | RUL -07(e) |
| ELM-IE-07 | **List the dilutions** whose recovery is within your declared range and whose DF is not above MVD, and whose curve is within the criterion (when r is entered). The screen selects, ranks and recommends none. The listing is headed "Dilutions within your declared range" (the words "passing list" and "pass" are not used). | RUL -07(e) |
| ELM-IE-08 | If the dilutions in the listing are not consecutive, print the fact line **"the listed dilutions are not consecutive: [DF values] lie between them and are not listed"**. "Lie between" is by DF order, among the dilutions entered. The line is a fact, not a judgment. | NAD-2026-11-24-10 |
| ELM-IE-09 | **Cut** (NAD-2026-11-24-10). No reagent-mismatch statement appears in v1. The ID is unused. | NAD-2026-11-24-10 |
| ELM-IE-10 | **I/E data never enters the main calculation, the main export or the comparison.** The I/E print and every I/E export carry the heading of ELM-IE-01 on every page and the two lines of ELM-OU-05. | RUL -03; VERA-2026-11-24-04 |

---

## 9. Display precision and the rounding rule (DP)

| ID | Requirement | Basis |
|---|---|---|
| ELM-DP-01 | **Display rule (ruled, NAD-2026-11-23-09(f)).** Three significant figures. Round the exact value once. If the rounded value is below 1000, print plain digits with zeros kept (for example `2.50`). If it is 1000 or more, print `d.dd × 10^n` (U+00D7, one space each side, ASCII exponent, no superscript), the form used by the suite's other tools. Display functions are those of the engine's display functions; the engine spec (stage 3) names them (KAITO-2026-11-24-06). Typed values are echoed exactly as typed. | RUL -09(f) |
| ELM-DP-02 | **Where rounding could hide a relation, the unrounded values print.** When R and L, DF and MVD, the raw reading and a bound, or x and L look equal at three figures but differ, both exact values print (CALC-03 kept). **A non-terminating exact value prints on screen as its reduced fraction with its unit (for example "5/3 EU/mL"),** as in exports (DP-03). | RUL -04(a); NAD-2026-11-24-23(f) |
| ELM-DP-03 | **Exports carry the exact values:** a decimal string where it terminates, and the exact reduced numerator and denominator where it does not (for example `5/3`), beside the three-figure string (CALC-02 kept). | RUL -09(f) |
| ELM-DP-04 | What a lab prints on any downstream document is its own procedure's choice; the page says so in one line. | RUL -09(f), -10 (OI-12) |
| ELM-DP-05 | Zero prints `0` with its unit, never `-0`. | suite |

---

## 10. Requirements: output (OU)

| ID | Requirement | Basis |
|---|---|---|
| ELM-OU-01 | **Order on screen:** the declared strip (limit source, K/M, c, technique, λ, DF, reagent type, ranges), the MVD block, the result block (relation or "No comparison shown"; not offered for gel-clot), the suitability lines, the working. | STD; NAD-2026-11-24-15 |
| ELM-OU-02 | **Show the working:** every computed value expands to its formula with the user's numbers substituted, units printed. | STD |
| ELM-OU-03 | **Relations in real HTML text, never an image; each with its source quoted.** The page links "Read the code" and shows the exact engine version used for the result. **Published values panel:** the three presets and the 50-200% preset with their quotes, never as a default or a verdict. Quotes: the GTCMC sentences "For any parenteral drug, except those administered intrathecally or intraocularly, we recommend that the upper limit of acceptance criterion for endotoxin be 5 Endotoxin Unit (EU)/kg body weight/hour"; intrathecal "0.2 EU/kg body weight/hour"; and, for the irrigation preset only, **"For intraocularly-administered drugs, we recommend acceptance criterion of … NMT 0.5 EU/mL for ophthalmic irrigation products" (FDA, CMC Information for Human Gene Therapy INDs, January 2020, p.49)** (the ellipsis drops the recommendation v1 does not offer; THR-2026-11-23-452). The PDG relation: "MVD = Endotoxin Limit × Concentration of sample solution / λ" (PDG Q-06 Rev. 2, l.57-77). Any PDG quotation carrying "dose" (the K and M quotations of section 0.5, l.66 and l.66-69) appears only in quotation marks with its attribution, in help, About or this panel (ELM-OU-12). | RUL -05(a), -06; -1236(2); STD; THR-452 |
| ELM-OU-04 | **Facts-and-evidence export pack.** Every export and the copy text carry, in this order: the two lines of ELM-OU-05; the **export header**: sample or product identification, sample stage and matrix (each "not entered" when empty), and the exact line **"File created: [YYYY-MM-DD hh:mm] (this device's clock, not verified; not the test date)"**; then every input exactly as typed, with units; the limit type and value as two declarations, with source; K, M and the single-hour basis where used; the concentration of the sample solution and its unit; the technique; λ and the highest standard; DF; the qualifier and the result; the reagent type and the method reference "as you typed it, or 'not entered'"; the basis declaration of B, A and the added amount; every declared range with its source; every flag in words; the relation line or the "No comparison shown" lines; the exact values beside the three-figure strings; the published values used, with their quotes; the tool version and the engine line (version and commit); the citation for the tool. Optional fields print "not entered" when empty. The spike concentration travels as the key `spike_conc_supplier_stated`; no export line, CSV header or JSON key contains "certificate" or "CoA". **No export contains analytics, consent, visitor, device or locale data, other than the "File created" line.** Formats: notebook text, CSV (declared decimal convention), JSON with a published schema, and a one-page black-and-white print. | STD; RUL -03; NAD-2026-11-24-16; VERA-03; THR-453; WARDEN 6 |
| ELM-OU-05 | **Every export and print carries, exactly:** **"Research use only. Not qualified for GxP decision-making."** and **"This record has no electronic-signature or audit-trail controls."** **On the print and in the notebook text, both lines stand at the top of the first page, above the record fields. In CSV and JSON they are the first two values written.** No export presents itself as a certificate of analysis, batch record, validation report, method qualification report or study report. There are no blank signature lines. Both lines are byte-exact and are never reworded. | RUL -03; VERA-02 |
| ELM-OU-06 | **Every screen and export shows the tool version and the engine line (version and commit), as every Bench Tool does.** **"Results from different tool or engine versions are not comparable."** | RUL -03; -1217 item 12; NAD-2026-11-24-23(g) |
| ELM-OU-07 | **"What every record shows"** list: inputs as typed, formulas with substituted values, every declaration, version line. | RUL -03 |
| ELM-OU-08 | The method reference line reads **"[reagent type]; method reference: [as you typed it, or 'not entered']"**. | RUL -03 |
| ELM-OU-09 | **CSV cell guard.** The suite's existing CSV cell guard applies to every free-text cell, reused unchanged (KAITO-2026-11-24-03), cited by reference as in C14 (MBP-OU-06); Cipher confirms at build. JSON and notebook text carry values exactly. | suite; KAITO-03 |
| ELM-OU-10 | **What the tool cannot detect** (visible list; carried from the input document's failure-mode table, reworded, patient and certificate items cut): a result typed incorrectly but within range; a DF that does not match the dilution actually used; an instrument figure that is not already multiplied by DF (the result is then understated); a wrong K, route or M for the product; a typed unit that does not match the instrument's; a standard curve that is not acceptable (not assessed); inhibition or enhancement beyond the recovery you entered; sample endotoxin high relative to the spike; that the selected reagent is the one used; that the device clock is right; **that an exported file has not been changed after download (the files carry no integrity protection, and the tool keeps no copy)**. | URS structure; RUL -03; VERA-07 |
| ELM-OU-11 | **No export gate in v1** (KAITO-2026-11-24-04). Downloads start from one button per format; the file is built in the browser and saved locally; no email field, no request. Inputs and results never leave the browser. | KAITO-04; WARDEN 1 |
| ELM-OU-12 | **Banned words, both scopes as ruled (NAD-2026-11-24-23(h); THR-105).** (1) **The THR-105 list** `dose`, `patient`, `infusion`, `CoA`, `release testing`, `lot release`, `clinical`, `validated`, `compliant`, `pass` binds the title, meta tags, Open Graph fields, slug, keywords, ads, hashtags and headlines (NAD-2026-10-24-1220 item 4). By this URS's design choice it also binds JSON keys and schema, CSV headers, HTML/CSS ids and engine function names (the "dose"/"dosing" rule for these is THR-2026-11-23-452; the rest of the list is cleared by THR-2026-11-23-470), and image alt text, with no quotation exception (THR-2026-11-23-470). Body text and labels may use whatever scientific terms the content needs, within THR-105's permitted uses: a banned word only inside an attributed source quotation that Nadira ruled on and Theron cleared (the PDG K and M fragments, THR-452). (2) **The verdict words of -1220 item 1** (pass, fail, compliant, validated, qualified, and the others of section 0.4) are banned everywhere, with one exception: the fixed line of ELM-OU-05 (VERA-06). **No "dose" or "dosing" in any engine function name, JSON key or schema, CSV header, or HTML/CSS id** (for example `m_per_kg_hour`, not `dose_per_kg`); the same line goes into the engine spec (stage 3). **No supplier or product name in the worked example or any screenshot; no "USP", "AAMI" or supplier mark in any title, meta field, keyword or ad** (THR-456); a reagent supplier's name appears only as text the user types. Label choices that touch a banned word are flagged to Theron, not decided here. | THR-105; RUL -03, -11(c); NAD-2026-11-24-23(h); THR-452, -456; VERA-06 |
| ELM-OU-13 | **No USP chapter is named as the basis, and no sentence says the tool follows, implements or is consistent with any USP chapter.** The basis line reads: PDG Q-06 Rev. 2 (MVD, K/M, recovery, |r|); GTCMC V.B.5.b.iii (preset values); FDAQA Q7 (the two sentences quoted in ELM-FL-12 only) and Q12; FDAQA Q4 is not in v1. The page may cite **"Pharmacopoeial Discussion Group, Q-06 Bacterial Endotoxins Test, Rev. 2 (signed off June 2011; sign-off cover sheet version 2, 2026)"** (NAD-2026-11-24-19, amended by NAD-2026-11-24-30). | RUL -03, -05(e); NAD-2026-11-24-19; THR-455 |
| ELM-OU-14 | **Page frame and structure:** the suite's `.app` / `.layout` / `.panel-head` frame as C7; the shared header and footer; the About panel with the five `h3` sections of the page content standard; the research-use line once in the footer; no requirement ID, ruling, spec path or open item anywhere a user sees or copies. Tool names, not IDs. No visible em dashes. | page content standard |
| ELM-OU-15 | **Public copy limits (-11(c); D-0126):** allowed sentences are those of section 12.3. Not allowed: that FDA requires the tool; that the tool follows or is consistent with USP; "validated", "release", "CoA", "pass", "compliant"; any figure presented as a disposition. **No sentence of section 12.1 or 12.2 appears on any page.** (r1 said "12.2" for the allowed sentences and "section 12" for the ban: corrected by Atlas to the intended 12.3 and 12.1/12.2.) | RUL -11(c) |
| ELM-OU-16 | **Menu and catalog entry:** deferred to stage 4; Marque proposes after Theron's scan; Nadira rules the words (KAITO-2026-11-24-05). This URS states the rule, not the strings: title "Endotoxin Limit and Maximum Valid Dilution", short menu form "Endotoxin Limit and MVD", slug `endotoxin-limit-maximum-valid-dilution` (THR-451); "Maximum Valid Dilution" or "MVD" allowed in title, H1, menu, meta, slug and keywords, and "valid" never stands alone. Keywords allowed: "endotoxin limit calculator", "maximum valid dilution", "MVD calculator", "K/M endotoxin limit", "LAL dilution", "endotoxin spike recovery". Not allowed: "endotoxin dose", "EU/kg dose", "release testing", "lot release endotoxin", "CoA", "validated", "USP 85", "USP <85>", "USP <86>", "AAMI", "Endosafe", or any supplier or product name (THR-455(d), -456). | KAITO-05; THR-451, -455(d), -456 |
| ELM-OU-17 | **Findability** (standard, section 7), owned by Lyra and Marque: first lines state what is calculated and for whom; relations and the worked example in HTML text; `SoftwareApplication` with the suite's existing non-medical `applicationCategory`, never `MedicalApplication`, `HealthApplication`, `MedicalWebPage` or a medical category (THR-455(c)), and `FAQPage` structured data (the FAQ being the why-we-ask questions); no gap claim against any other tool and no "replaces your spreadsheet" (programme rule until -1216 tasks 29 and 30). | STD 7; programme; THR-455(c) |

---

## 11. Mode B (from volume, body weight and time): deferred

**Named, not specified.** Mode B stays out of v1 until the amount-per-basis module of 1.7 (GC12) and engine E12 exist on `origin/main` (ENG at `230e20a` has neither). One implementation per shared calculation (-1214); no second copy of per-kg arithmetic is written for this tool (NAD-2026-11-23-01, -02). **No Mode B requirement is frozen.** The tier for Mode B, separately for "declared specification weight" and "weight of one individual", goes to Theron before a Mode B URS is drafted (-1222 item 4; THR-2026-11-23-450).

Science carried forward for the future Mode B URS (recorded only; none is a requirement of this document):
- M = V ÷ (W × T), so L (EU/mL) = K × W × T ÷ V; result shown as EU, EU/kg and EU/kg/h. The EU/kg/h line is compared with K under the same single-hour window (NAD-2026-11-23-02, -06(a)). The NAD-2026-11-23-03 purpose sentence returns with Mode B (section 0.1).
- T = D for D of 1 h or more; T = 1 h for 0 < D < 1 h; when D > 1 h the line "assumes the volume is given at a constant rate over [D] h; if not, enter the largest volume given in any one hour with T = 1 h" (NAD-2026-11-23-06(c)).
- Weight units: kilograms, plus grams for animals; any other unit only if E12's table offers it, with the conversion printed (NAD-2026-11-23-09(e)).
- The page's example uses a typed specification or a declared animal weight (for example a 20 g mouse); no human weight (NAD-2026-11-23-12).
- Held out: the "volume to infuse" label of the input document (patient and infusion words); the 100 EU/m² form (never).
- Deferred fixture: **D-1 = TD-5** (duration 0.5 h; the T = 1 h rule), result equal to the limit; relabelled "equal to your declared limit" (NAD-2026-11-23-04). Its Mode A part is covered by F-03.

---

## 12. Internal IND map (-143; internal only; no part of this section appears on any page)

Source: NAD-2026-11-23-11(a) and (b), with the corrections of NAD-2026-11-24-20; texts read by Nadira on 23 Nov 2026. Modality: all (checklist row l.73 "All"). Status: GTCMC parts read; the cell therapy guidance was **not** read for endotoxin.

**This map is internal context. It shows where a lab's own endotoxin limit and result appear in an IND; it does not give this tool a GxP use. The tool's output is not a GxP record, and it is not an input to one as produced. A lab that carries a figure from this tool into a GxP record or a CMC document checks and records that figure under its own GxP system. GxP impact stays "none" (header).** (VERA-2026-11-24-01(a), verbatim.)

The role words in the Link and Role columns are Vera's (VERA-2026-11-24-01(b)), as ruled in NAD-2026-11-24-31.

### 12.1 Where the user's limit and result appear

| FDA requirement (as read) | Where | Link to the tool |
|---|---|---|
| A section on the composition, manufacture and control of the drug substance and drug product; for the drug product, the acceptable limits and analytical methods (paraphrase, not a quotation) | 21 CFR 312.23(a)(7)(i) and (a)(7)(iv)(b) (LII, read 23 Nov 2026; paraphrased, not quoted: the amendment at 91 FR 60003, 22 Sep 2026, is not read; KAITO-2026-11-24-08, NAD-2026-11-24-20) | The user's declared limit, when it is the drug product's endotoxin limit, is a limit of this kind |
| "Purity testing includes assays for pyrogenicity or endotoxin" (the guidance's own sentence) | GTCMC p.48, V.B.5.b.iii. 21 CFR 600.3(r) defines purity and names "pyrogenic substances"; it does not use the word "endotoxin". | The user's endotoxin result on the drug product belongs under Purity |
| Recommended upper limits (the presets) | GTCMC V.B.5.b.iii (3.2.P.5.2), pp.48-49 | ELM-IN-05 |
| "sterility, endotoxin, and identity testing are recommended on the final container product" | GTCMC p.45, V.B.5.a Specifications (3.2.P.5.1), pdftotext -layout l.2445-2446 | Direct context (the user's own result on the final container product) |
| Justification of Specifications | GTCMC V.B.5.f (3.2.P.5.6), p.50 (pdftotext -layout l.2688-2692), pointing to V.A.4.e (3.2.S.4.5) | The K/M derivation and its printed inputs are the arithmetic behind an endotoxin specification's justification (supporting) |
| Plasmid starting material tests include endotoxin | GTCMC p.27 (pdftotext -layout l.1469-1474); plasmid COA in 3.2.A.2 | The same arithmetic on a plasmid lot (supporting) |
| Limit by the compendial calculation; MVD meaning | FDAQA Q7 (the USP or AAMI sentence, internal only), Q12 | ELM-FL-11, -12 |

### 12.2 IND reports and sections (checklist v1.0, sha `52b5ec423ddf07f3bce3c39dd1edd3900fae2e4148352bcb59b1a75d92e66dfd` as in CHK)

| Checklist row / section | Role | Notes |
|---|---|---|
| l.73, **Lot Release Safety Test Report** (3.2.S.4.1 / 3.2.P.5.1), category 2, every lot from the first IND | **Direct context (the user's own limit and result)** | The limit per route and the result's relation to it; also the candidate named at l.170 ("endotoxin limit per dose and route") |
| Tag 5 (measurement trust) | Supporting | MVD, the raw reading range, the suitability values |
| l.142, Lot Release Report roll-up | Indirect only | |
| l.60, Plasmid/Cell Bank certificates (3.2.A.2) | Supporting | The same arithmetic on a plasmid lot |
| 3.2.P.5.6 justification | Supporting | Stated as a CTD section only; outside the checklist rows |

(The checklist row names above are internal vocabulary. They do not appear on any page, in any title, tag or keyword.)

### 12.3 Public copy allowed under D-0126 (Solon checks the citations, dated, first; Maya, Lyra and Marque simplify; A.B. publishes)
1. "FDA's guidance on CMC information for human gene therapy INDs (January 2020) recommends an upper limit for endotoxin of 5 EU/kg body weight/hour for parenteral products other than intrathecal and intraocular ones, and 0.2 EU/kg body weight/hour for intrathecal ones." (NAD-2026-11-24-29, amending NAD-2026-11-24-21.) Marque, Lyra and Maya may simplify it provided they keep the issuer, "recommends", the scope (including the intraocular exclusion), and both values with their units. **Body copy only; never in a title, headline, meta field, keyword, ad or hashtag** (THR-2026-11-23-454). Tier 1 stands (THR-454); Marque may change the voice but not drop the issuer, "recommends", the scope or either unit.
2. "This tool shows how a limit like that becomes an EU/mL figure for your product, and the greatest dilution at which you could still see it, step by step with your numbers, so a colleague can check it by hand." (allowed as is, THR-454)
3. "Research use only. Not qualified for GxP decision-making." (allowed as is)

Not allowed: that FDA requires the tool; that the tool follows or is consistent with USP <85>/<86>; "validated", "release", "CoA", "pass", "compliant"; any figure presented as a lot's disposition.

---

## 13. Requirements: storage and privacy (ST)

Data class L (local only), confirmed by Warden: no lookup of any kind exists; no class S or X. A later S or X feature needs a new URS row and a Warden review before the privacy line is touched.

| ID | Requirement | Basis |
|---|---|---|
| ELM-ST-01 | **Nothing you enter, and no result, leaves your browser.** No request depends on anything entered, pasted or selected, or on anything derived from it (class L; -1221). The page shows the shared privacy statement and the Privacy Policy link in its footer; nothing in this tool contradicts it. Nothing you enter, and no result, is sent to Ligant or to any analytics service. (No per-tool short privacy sentence is promised.) Basis added: class L, no third-party lookup (no S or X). | -1221; WARDEN 2, 8 |
| ELM-ST-02 | The saved record is the export file you download. The page stores no entry, result, setting or record in the browser (no localStorage, sessionStorage, IndexedDB, cookie or cache of entries). The only browser storage is the suite's consent choice (`ligant_privacy_choice`) and, after the visitor allows it, the analytics cookies the suite banner manages. The page has no file input and writes records only as downloads. No project-file save or resume in v1 (confirmed, KAITO-2026-11-24-02). | -1221; WARDEN 2; KAITO-02 |
| ELM-ST-03 | **No entry, result or state is placed in the page address (query string or hash), the title, or any link the page builds.** (Analytics sees the URL.) | WARDEN 4 |

---

## 14. Requirements: non-functional (NF)

| ID | Requirement | Basis |
|---|---|---|
| ELM-NF-01 | Exact decimal (rational) arithmetic from input to display; no binary floating point; comparisons are exact (cross-multiplication), not on display strings. | core; RUL -04 |
| ELM-NF-02 | The page builds on the engine module "K/M + MVD module, engine number assigned in the engine spec (stage 3)" and on `core` / E10, at the version set at build; it shows that version and links the exact engine source. Mode A needs no other engine. | RUL -01; BRIEF; KAITO-06 |
| ELM-NF-03 | Every change runs the suite acceptance before release. | RUL -03 |
| ELM-NF-04 | Deterministic: the same inputs and version always give the same outputs; no random numbers, no machine learning; no network request at run time that carries anything entered, pasted, selected or derived from it; the only requests are the suite's disclosed analytics and the newsletter signup if the visitor submits an email; no external script, font or resource other than the disclosed analytics scripts; no added dependency. | -1218; STD; WARDEN 3 |
| ELM-NF-05 | Runs in current desktop browsers with no installation and no network connection after load (for the calculation). | STD |
| ELM-NF-06 | The input form shows the limit source, technique, reagent type, concentration term, λ, DF and qualifier on one screen with the results, so no condition is hidden from the outcome. | STD |
| ELM-NF-07 | Results update as the user types; inputs in bench order; immediate, specific feedback in the place it applies; usable on a tablet; prints on one page (desirable). | STD |
| ELM-NF-08 | Accessibility: native tables with captions and `scope`; keyboard flow; targets 44 px; contrast 4.5:1 text and 3:1 marks, measured on the built page. | suite |
| ELM-NF-09 | Page frame and the five-section About panel per ELM-OU-14; screenshots compared with a live tool before any preview. | STD |
| ELM-NF-10 | The page's CSP meta, `public/_headers` and bench-chrome vendor are those of the current suite standard, unchanged (C14's explicit connect-src list); any difference goes through Warden. | WARDEN 7 |

---

## 15. Fixtures (inputs and expected relation; numbers derived by the fixture author)

**Rule for this section.** Each row states the inputs and the expected relation or wording state. **Every expected number (limit, MVD, raw reading, recovery, ratio, R, x) is "derived by the fixture author from the signed URS"**, never taken from this draft or from Nadira's table (NAD-2026-11-23-08). Atlas's hand check of each relation is kept in a separate file, the working notes (`/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-v0.1-working-notes-NOT-FOR-FIXTURE-AUTHOR.md`), **for Nadira and Adacs only and never handed to the fixture author**.

**How the TD rows were converted.** The source rows TD-1 to TD-7 need a body weight (Mode B). A typed M cannot reproduce them: every one has a 7 in the denominator of V ÷ (W × T), so no typed decimal M gives the exact limit and the equality rows would turn into "below" or "above" (accepted, NAD-2026-11-24-22). Atlas therefore did two things. (1) **Typed-limit rows (F-01, F-02, F-03(a), F-04):** the limit is typed in EU/mL with a source string and carries the TD result and limit pairs, relabelled per NAD-2026-11-23-04. (2) **K/M rows (F-03(b), F-05 to F-08):** a typed K and an M that terminates carry the K/M arithmetic. **TD-5 (the 1-hour rule) and the time-basis part of TD-4 are Mode B deferred (D-1).** TD-7's binary-float purpose is carried by F-06.

**Common inputs** unless a row says otherwise: technique "Chromogenic"; reagent type "Amoebocyte lysate (LAL)"; λ = 0.005 EU/mL; highest standard = 10 EU/mL (confirmed, NAD-2026-11-24-08); DF = 1; qualifier `=`; sample CV 10 and spike CV 10 with declared maxima of 25 (source string "typed for the fixture"); recovery basis "as measured in the tested dilution"; B = 0.3, A = 0.1, added = 0.2 EU/mL; recovery range 50-200 selected from the preset. All suitability values are within.

| # | Source row | Inputs | Expected |
|---|---|---|---|
| F-01 | TD-1 (typed-limit form) | limit typed 3.5 EU/mL, source "typed"; C = 0.5 | relation **below**; MVD, raw reading: derived by the fixture author |
| F-02 | TD-2 (typed-limit form) | limit 3.5 EU/mL; C = 3.6 | relation **above** |
| F-03 | TD-3, **equality** | (a) limit 3.5 EU/mL typed; C = 3.5. (b) K = 7 EU/kg, M = 2 mL/kg; C = 3.5 | both **equal to your declared limit**; the word "within" appears nowhere |
| F-04 | TD-4 (typed-limit form) | limit 7.0 EU/mL typed (echoed as `7.0`); C = 1.0 | **below** (its 4-hour time basis is Mode B, D-1) |
| F-05 | TD-6 (K/M form) | K = 0.7 EU/kg, M = 0.5 mL/kg; C = 1.5 | **above** |
| F-06 | TD-7 (equality, float trap) | K = 0.7 EU/kg, M = 10 mL/kg; C = 0.07 | **equal**; exact decimal gives equality. The two typed numbers are expected to differ in binary floating point (Atlas's expectation, to be confirmed by the fixture author; the row stands either way) |
| F-07 | K/M, terminating, with rounding display | K = 5, M = 2 mL/kg. (a) C = 2.5. (b) C = 2.504. (c) C = 2.496 | (a) **equal**. (b) **above**, with both unrounded values printed because both show as the same three-figure string. (c) **below**, both unrounded values printed |
| F-08 | K/M, non-terminating | K = 5, M = 3 mL/kg. (a) C = 1.667. (b) C = 1.666 | (a) **above**. (b) **below**. Both rows show the limit and C as the same three-figure string, so both rows print the unrounded pair, the limit as the reduced fraction with its unit ("5/3 EU/mL"). A page that rounds the limit to three figures first gets (a) wrong. The export carries the exact value `5/3` and MVD is formed exactly (no re-entered decimal) |
| F-09 | MVD, limit per mL | limit 2.5 EU/mL typed; λ = 0.005 | MVD derived by the fixture author; the line "concentration of sample solution = 1 mL/mL (limit in EU/mL)" is printed; no "result per [D]" line |
| F-10 | **MVD, concentration term, non-EU/mL** (NAD-2026-11-23-05(b)) | limit 5 EU/mg typed; concentration of sample solution 2 mg/mL; λ = 0.005; no result | MVD derived by the fixture author, with the unit cancellation printed; the "1 mL/mL" line is **not** printed |
| F-11 | Units do not cancel | (a) limit 5 EU/mg with concentration typed as 2 `Units/mL`. (b) limit 5 EU/Unit with 2 `mg/mL`. (c) limit 5 EU/mg with concentration omitted | (a), (b): MVD refused, ELM-RF-06 sentence, no figure. (c) incomplete, ELM-RF-01 |
| F-12 | DF equals MVD | limit 2.5 EU/mL; λ = 0.005; DF equal to the MVD of F-09; C equal to the limit | DF permitted; raw reading is at the lower bound (inclusive, in range); relation **equal** |
| F-13 | DF above MVD | as F-12 with DF = MVD + 1; C = 3 | DF line reads above; "No comparison shown: dilution factor is above the maximum valid dilution"; the calculated values stay visible |
| F-14 | Raw reading bounds | limit 2.5 EU/mL; λ = 0.01; highest standard 1.0; DF = 50. C = (a) 0.5, (b) 50, (c) 0.4, (d) 60 | (a) raw reading at λ: in range, **below**. (b) raw reading at the highest standard: in range, **above**. (c) the ELM-FL-15 line and "No comparison shown: raw reading is outside the range you entered". (d) "No comparison shown: raw reading is outside the range you entered" only |
| F-15 | `<` floor rows | limit 2.5 EU/mL (F-15c: limit 5); λ = 0.005. (a) `<` 0.005, DF 1. (b) `<` 2.5, DF equal to MVD. (c) `<` 6, DF 1. (d) `<` 0.25, DF 100 | (a) "upper bound 0.005 EU/mL is below your declared limit of 2.5 EU/mL ([source])"; no floor line. (b) the x = L line of ELM-FL-03 ("upper bound 2.5 EU/mL is equal to your declared limit of 2.5 EU/mL ([source]); a result reported as less than 2.5 EU/mL is below it"); no floor line. (c) the x above L line ("no comparison: the reported floor 6 EU/mL is above your declared limit of 5 EU/mL ([source])"); plus "your reported floor differs from DF × λ = [y] EU/mL". (d) the x below L line; plus the floor line. [x] and [y] print with their units. The raw reading check is not run for any `<` row |
| F-16 | `>` | qualifier list; typed `>0.5` in the result field | no ">" option; typed text refused with the ELM-RF-04 sentence; no figure |
| F-17 | Result of zero | C = 0, `=`, limit 2.5 | accepted; the ELM-FL-15 line shows; "No comparison shown: raw reading is outside the range you entered" (raw reading 0 is below λ); `0` never `-0` |
| F-18 | Impossible values | K = 0; M = -1; limit 0; λ = 0; DF = 0.5; C = -1; highest standard 0.001 with λ 0.005; `1,5`; `2e5` | each refused with its sentence naming the field (DF: "Parts total must be 1 or more (1 means undiluted)."); no figure |
| F-19 | **Recovery, computed, exact** | added = 0.2; (a) B = 0.35, A = 0.25; (b) B = 0.65, A = 0.25; (c) B = 0.34, A = 0.25; (d) B = 0.66, A = 0.25 | recovery by (B − A) ÷ added × 100 on exact decimals: (a) and (b) at the bounds of "50% to 200%, bounds included", **within**; (c) and (d) **outside**, comparison withheld ("one or more suitability values outside your declared criteria: recovery"). Numbers derived by the fixture author. The binary-float difference B − A is the trap in (a) |
| F-20 | No typed recovery % | open the suitability block with B, A and added entered | no field takes a recovery percentage in the main flow |
| F-21 | CV criteria | declared maxima 25 ("at most 25%"); sample CV (a) 25, (b) 25.1 | (a) within; (b) outside, comparison withheld. With no declared maximum: "suitability values incomplete: [fields]" |
| F-22 | Suitability empty / partial | (a) nothing entered. (b) only sample CV | (a) "suitability values not entered". (b) "suitability values incomplete: [fields]" naming the missing fields; calculated values visible |
| F-23 | Reagent not selected; optional fields | F-01 with no reagent type; all optional fields empty | "No comparison shown: reagent type not selected"; MVD still shown; the export prints "reagent type: not selected"; export prints "not entered" for every empty optional field |
| F-24 | Date flags | expiry 2026-11-01, test date 2026-11-20 (a); the same date (b); calibration due before test date (c) | (a) flag "test date is after the expiry date you entered", calculation unaffected, flag on screen, print, CSV, JSON; (b) no flag; (c) "test date is after the calibration due date you entered" |
| F-25 | Presets | open the page; choose K = 5 preset; choose K = 0.2; choose 0.5 EU/mL | on opening no preset is selected and no route inferred; each preset shows "recommended", "FDA recommended upper limit, gene therapy CMC guidance, January 2020" and its source string; K presets still need a typed M; the value used prints. On choosing a K preset, the K label carries FDA's unit form ("; FDA writes this as [K] EU/kg body weight/hour"); a typed K does not |
| F-26 | Limit not per mL, with a result | limit 5 EU/mg; c = 2 mg/mL; λ = 0.005; C = 3 | the "result per mg" line (R derived by the fixture author); relation **below** your declared limit of 5 EU/mg; MVD shown |
| F-27 | Several reasons at once | F-13 inputs with no reagent and empty suitability | three lines in this order: "No comparison shown: dilution factor is above the maximum valid dilution"; "No comparison shown: suitability values not entered"; "No comparison shown: reagent type not selected". The raw reading lies within the range, so no raw-reading line |
| F-28 | Worked example (ELM-IN-15) | the example button | every example value of ELM-IN-15 and every derived value (limit, MVD, raw reading, recovery, relation, λ × DF) derived by the fixture author; banner; export notes "example values in use"; optional record fields show "not entered"; no body weight and no supplier name appear |
| F-29 | I/E, Nadira's IE-1 inputs | limit 3.5 EU/mL, λ = 0.005; DF 10, 50, 100, 1000 with recoveries 35, 48, 85, 120; range 50-200 | statuses, effective sensitivities, ratios, MVD check and listing derived by the fixture author; the three ruled status phrases; no "pass" wording; no dilution selected |
| F-30 | I/E, Atlas dataset | limit 2.5 EU/mL, λ = 0.01; DF 5, 25, 100, 250, 500 with recoveries 40, 50, 110, 200, 90; range 50-200 | statuses and listing derived by the fixture author; recovery bounds included (NAD-2026-11-24-03) |
| F-31 | I/E non-contiguous | same limit and λ; DF 10, 20, 40 with recoveries 100, 30, 100 | the ELM-IE-08 line "the listed dilutions are not consecutive: [DF values] lie between them and are not listed" |
| F-32 | **\|r\| sign** | declared criterion \|r\| ≥ 0.980 (source string entered); r = (a) +0.995, (b) -0.975, (c) -0.980, (d) +0.980, (e) +0.979, (f) not entered | (a) **within** your declared criterion \|r\| ≥ 0.980 (a rising curve is not marked outside); (b) outside; (c), (d) within; (e) outside; (f) "curve criterion: r not entered", curve criterion plays no part; channels of an outside curve are left out of the listing |
| F-33 | I/E isolation | complete an I/E screen, then open the main record and export it | no I/E value in the main export or comparison; the I/E print carries the heading on every page and the two ELM-OU-05 lines; the I/E exports carry both too |
| F-34 | Export content | any F row, all four formats | every item of ELM-OU-04, the two exact lines of ELM-OU-05 at the top of the print and notebook text and first in CSV and JSON, the "File created" line byte for byte, the version and engine line, the export header first, "not entered" for empty optionals, exact values beside display strings, the key `spike_conc_supplier_stated`, and no analytics, consent, visitor or locale data |
| F-35 | `<` with a limit not per mL | limit 5 EU/mg typed; c = 2 mg/mL; λ 0.005. (a) `<` 0.005, DF 1. (b) `<` 10, DF equal to the MVD of this limit. (c) `<` 0.02, DF 1 | (a) the "floor in your limit's unit" line; the x below L line in EU/mg. (b) the x = L line in EU/mg; no floor line. (c) the "floor in your limit's unit" line, the x below L line in EU/mg, and the ELM-FL-04 floor line in EU/mL; this is the only row where [x] and [y] carry different units. Numbers derived by the fixture author |
| F-36 | Technique | (a) technique not chosen, limit 2.5 EU/mL, λ 0.03. (b) Gel-clot, same inputs. (c) Chromogenic, same inputs | (a) "Not calculated yet. Still needed: Technique". (b) MVD shown (derived by the fixture author); λ labelled "labelled lysate sensitivity"; no result block; the gel-clot sentence shows. (c) the result block is offered |
| F-37 | Recovery basis | (a) common B, A and added with no basis chosen. (b) each basis chosen in turn | (a) "No comparison shown: suitability values incomplete: basis of B, A and the added amount". (b) the same recovery both times, with the basis printed |

Fixture rows: 37 (F-01 to F-37) plus 1 deferred Mode B row (D-1). Sub-cases inside a row are not counted separately.

---

## 16. Acceptance tests

Acceptance is Adacs, line by line, after the fixture author (from this signed document only) and the clean room. Each test names its method: unit test (engine), fixture (independent), page check.

| ID | Test | Requirements | Method |
|---|---|---|---|
| AT-ELM-01 | F-01 to F-08: relation lines byte for byte; equality rows show "equal to", never "within"; exact comparison; non-terminating limit (reduced fraction on screen) | DT-01, -02, -07, FL-01, DP-02, NF-01 | fixture, unit |
| AT-ELM-02 | F-09 to F-11, F-36: MVD with the concentration term; the "1 mL/mL" line; the unit refusals; technique compelled, λ label by technique, gel-clot has no result block | DT-04, UN-02, RF-06, IN-06, IN-17 | fixture, page |
| AT-ELM-03 | F-12, F-13: DF = MVD permitted; DF above MVD withholds | DT-05, FL-02 | fixture |
| AT-ELM-04 | F-14, F-17: raw reading inclusive bounds; zero result; the FL-15 line | DT-06, FL-15 | fixture |
| AT-ELM-05 | F-15, F-16, F-35: `<` rows in the limit's unit (three lines incl. x = L) and the floor line; ">" refused | DT-08, DT-09, DT-10, FL-03, FL-04, RF-04 | fixture |
| AT-ELM-06 | F-19 to F-22, F-37: recovery computed exactly; declared basis; criteria; empty and partial suitability; no typed recovery field | SU-01 to -08, IN-11 | fixture, page |
| AT-ELM-07 | F-23, F-24: reagent not selected; "not entered"; date flags | IN-10, IN-12, FL-05 | page |
| AT-ELM-08 | F-25: presets labelled "recommended" with FDA named, none preselected, sources printed, K label by source | IN-04, IN-05, OU-03 | page |
| AT-ELM-09 | F-18: impossible-value refusals; plain decimal rule | RF-01 to -08, IN-13 | page |
| AT-ELM-10 | F-26, F-27: limit not per mL (result per [D], comparison in the limit's unit); several reasons in order | DT-10, FL-02 | fixture |
| AT-ELM-11 | F-28 reproduces; no body weight and no supplier name appear | IN-15 | page |
| AT-ELM-12 | F-29 to F-33: I/E module, including the two ELM-OU-05 lines on I/E print and exports | IE-01 to -10, OU-05 | fixture, page |
| AT-ELM-13 | Export contents, formats, lines and their placement, the "File created" line byte for byte, the export header first, the integrity item, no blank signature lines, CSV guard, no gate (one button per format, no email field, no request) | OU-04 to -11 | page, file |
| AT-ELM-14 | Ban list and USP/vendor scan of title, labels, meta, keywords, slug, image alt text, JSON keys, identifiers, About text; no ruling ID or IND-map sentence on any page; "qualified" appears only in the fixed ELM-OU-05 line (VERA-06); Theron's conditions THR-450 (a)-(e); the identifier rule (no "dose" or "dosing", THR-452); the THR-105 list in alt text, with no quotation exception (THR-470); no supplier name in any placeholder or screenshot (THR-456); that no sentence of FDAQA Q7 other than the two quoted in ELM-FL-12 appears (THR-458 as corrected by THR-461) | OU-12, -13, -15, -16, -17, IN-12 | scan |
| AT-ELM-15 | The wording of every ruled string present byte for byte, including the strings of NAD-2026-11-24-12, -13, -18 and -23 | FL, RF, IN | page |
| AT-ELM-16 | No request depends on entries; no entry, result or state in storage or the page address; privacy line; sentinel values typed into every field, an export, a print and a copy appear in no request body, URL or storage key; CSP and headers unchanged | ST-01 to -03, NF-04, NF-10 | page |
| AT-ELM-17 | Engine: the module named in NF-02 only; no page arithmetic; no rounded value fed on | DT-12, NF-02 | review |
| AT-ELM-18 | Accessibility and contrast on the built page; frame; screenshots vs a live tool | NF-08, -09, OU-14 | page |
| AT-ELM-19 | Nadira's page review for accuracy and learnability; usability target (under three minutes, after launch) | STD | review |

---

## 17. Register of values (basis and status)

| Value | Basis | Status |
|---|---|---|
| MVD = L × c ÷ λ | PDG §6, l.57-77 (quoted) | Ruled (NAD-2026-11-23-05); read by Nadira |
| R = C ÷ c (limit not per mL) | PDG l.298-300 | Ruled (NAD-2026-11-24-01) |
| K/M, single-hour window | PDG l.65-69 | Ruled (-02, -06(a)) |
| K = 5 EU/kg; 0.2 EU/kg; 0.5 EU/mL (irrigation) | GTCMC V.B.5.b.iii, pp.48-49 | Presets, "recommended"; Solon dated check done: verified (Solon, 24 Nov report) |
| 2.0 EU/dose/eye | GTCMC p.49 | Not offered in v1 (J-5, accepted NAD-2026-11-24-09) |
| Recovery 50-200% | PDG l.270-273, l.291-293; §8(3)(ii) | Selectable preset, never preselected |
| \|r\| ≥ 0.980 | PDG l.242-243, l.262-263 | A declared value; "0.980 (PDG Q-06 Rev. 2)" is a labelled choice, never preselected (NAD-2026-11-24-07) |
| CV maximum (25) | none opened | **No default**; Q-S1 |
| Bounds included for declared ranges | PDG for r and recovery | Ruled (NAD-2026-11-24-03) |
| Technique declaration | PDG §6; cover sheet | Ruled (NAD-2026-11-24-15) |
| Raw reading range | the user's curve | Typed, none hard-coded |
| Plausibility limits | none | None invented (-09(c)) |
| Radiopharmaceutical 175/V, 14/V; 100 EU/m² | none opened | Out |
| Rounding | -09(f) | Ruled |
| Fixtures F-01 to F-37 | Atlas inputs; numbers by the fixture author | Hand check in the working notes; Nadira re-derives |

---

## 18. Open items (carried from NAD-2026-11-23-10) and judgment calls

| OI | Disposition | Where it lives in this URS | Owner |
|---|---|---|---|
| OI-01 equality at the limit | Ruled: "equal to"; inclusivity is the lab procedure's. The `<` case at equality: NAD-2026-11-24-18 | ELM-DT-07, DT-08, FL-01, FL-03, FL-08 | Nadira; lab |
| OI-02 suitability not met or not entered blocks the comparison | Ruled: withheld with a reason | ELM-SU-08, FL-02 | Nadira |
| OI-03 T = 1 h below one hour | Ruled; **Mode B only** | Section 11 | Nadira |
| OI-04 "<" floor forms | Ruled; amended NAD-2026-11-24-18 | ELM-IN-09, DT-09, FL-03, FL-04 | Nadira |
| OI-05 radiopharmaceutical and m² | Out of v1; m² never | Section 0.3 | Nadira |
| OI-06 plausibility limits | None invented | Section 6 | Nadira |
| OI-07 expired reagent | Flag, never block | ELM-FL-05 | Nadira; lab |
| OI-08 weight basis per specification | Lab / specification; Mode B tier is Theron's | Section 11 | lab; Theron |
| OI-09 distribution, version control, checksum | Cut; replaced by the version and engine line | ELM-OU-06 | Nadira; Kaito |
| OI-10 pounds | Kilograms; grams for animals in Mode B; no silent conversion | Section 11 | Nadira |
| OI-11 GAMP category | Cut; a GxP edition is not offered (A.B., Q2) | none | A.B. |
| OI-12 display rounding | Ruled | ELM-DP-01 to -04 | Nadira; lab |
| OI-19 K/M, MVD, 50-200% under a recombinant chapter | **Not ruled**: needs a licensed read; A.B. Q4 answered "no" for v1 (BRIEF). The tool makes no recombinant-specific claim | ELM-FL-13 | A.B.; then Nadira |
| OI-13 I/E module LAL-only | Accepted as the user's declaration; supplier facts not printed as fact; IE-09 cut | ELM-IE-02 | none |
| OI-14 missing recombinant reference | Superseded: no flag, "not entered" | ELM-IN-10 | Nadira |
| OI-15 highest possible volume for split doses | Accepted (Mode B) | Section 11 | none |
| OI-16 no spike vs sample check | Accepted (recorded only) | ELM-OU-10 | none |
| OI-17 both reagents acceptable, no comparison | Accepted | ELM-IN-10 | none |
| OI-18 USP chapters as the compendial basis | Superseded: PDG and FDA sources, no USP labels | ELM-OU-13 | Nadira |

Other open items: **T-0595** (source task iii, -171) moves to done on NAD-2026-11-23-05 (Kaito; Archivist records). **Scout Q-S1** (a supplier source for a CV preset) is optional. **Solon:** dated check done (NAD-2026-11-24-19 to -21). Open: the 91 FR 60003 amendment to 312.23 is not read (Kaito, optional).

**Judgment calls made by Atlas** (none is a scientific ruling or product decision; each is reversible by the named owner):
- **J-1 Single file.** One file, as Kaito instructed, instead of the three in Atlas's standing profile.
- **J-2 I/E module kept in v1** as a self-contained section (ELM-IE), generic (no supplier names), using the -07(e) statuses. Confirmed (KAITO-2026-11-24-07). Reason: the required |r| = +0.995 row, and the |r| criterion of -07(d), exist only there.
- **J-3 TD conversion.** TD rows became typed-limit rows (F-01, F-02, F-03(a), F-04) and K/M rows (F-03(b), F-05 to F-08); TD-5 and TD-4's time basis are Mode B deferred (D-1). Reason: no typed decimal M reproduces a limit with a factor of 7 in V ÷ (W × T). Accepted (NAD-2026-11-24-22).
- **J-4 Fixture number policy.** Expected relations are stated; every expected number is "derived by the fixture author". Hand checks stay in the working notes.
- **J-5 Intraocular "2.0 EU/dose/eye" preset not offered** in v1. Accepted (NAD-2026-11-24-09; THR-2026-11-23-452 agrees). The irrigation preset (0.5 EU/mL) is offered.
- **J-6 Concentration unit tie** for "other" is by exact typed text, with no conversion between mass units in v1; for the fixed options it is a fixed pairing (NAD-2026-11-24-11).
- **J-7 withdrawn:** superseded by NAD-2026-11-24-01.
- **J-8 Highest standard** is an input only when a result with qualifier `=` is entered; with no result the tool gives the limit and MVD alone. The gel-clot lysate sensitivity is handled by ELM-IN-17.
- **J-9 No percent-of-limit line in Mode A** (accepted, NAD-2026-11-24-23(k)). The two-bases identity it served belongs to Mode B.
- **J-10 deleted** with the export gate (KAITO-2026-11-24-09).

---

## 19. Questions (by owner; each cites requirement IDs)

### Answered in r2

| Question | Answer | Where applied |
|---|---|---|
| Q-AT-C19-01 | ruled: NAD-2026-11-24-01 | ELM-DT-07, -08, -10 |
| Q-AT-C19-02 | ruled: NAD-2026-11-24-02 | ELM-FL-02 |
| Q-AT-C19-03 | ruled: NAD-2026-11-24-03 | ELM-SU-03, -04, -07 |
| Q-AT-C19-04 | ruled: NAD-2026-11-24-04 | ELM-IN-08, RF-02 |
| Q-AT-C19-05 | ruled: NAD-2026-11-24-05 | ELM-SU-02, IE-02 |
| Q-AT-C19-06 | ruled: NAD-2026-11-24-06 | ELM-IN-11 |
| Q-AT-C19-07 | ruled: NAD-2026-11-24-07 | ELM-IE-04 |
| Q-AT-C19-08 | ruled: NAD-2026-11-24-08 | section 15 common inputs, ELM-FL-11 |
| Q-AT-C19-09 | ruled: NAD-2026-11-24-09 | J-5, ELM-IN-05 |
| Q-AT-C19-10 | ruled: NAD-2026-11-24-10 | ELM-IE-08; IE-09 cut |
| Q-AT-C19-11 | ruled: NAD-2026-11-24-11 | ELM-UN-02, -03 |
| Q-AT-C19-12 | parts 1-7 ruled: THR-2026-11-23-450 to -458 (zero flag replaced by Nadira's wording, NAD-2026-11-24-13; ">" message replaced by Nadira's wording, NAD-2026-11-24-23(c), -26; "Maximum Valid Dilution" term of art, NAD-2026-11-24-23(l)); **part 8 (Mode B tiers) stays open until the Mode B URS** | ELM-OU-12, -16; header |
| Q-AT-C19-13 | ruled: NAD-2026-11-24-12 | ELM-IN-07, -14, DT-11 |
| Q-AT-C19-14 | ruled: NAD-2026-11-24-13 | ELM-FL-15 |
| Q-AT-C19-15 | ruled: NAD-2026-11-24-14 | ELM-SU-05 |
| Q-AT-C19-16 | ruled: NAD-2026-11-24-15 | ELM-IN-17 |
| Q-AT-C19-17 | ruled: NAD-2026-11-24-16 | ELM-IN-12, OU-04 |
| Q-AT-C19-18 (Vera) | answered: VERA-2026-11-24-01 to -07 applied; the four points: no finding on "procedure", the no-e-signature line and the I/E heading; the date label added (VERA-03). VERA-01(b) role words ruled by NAD-2026-11-24-31 and W-7 by NAD-2026-11-24-28; Vera confirmed both (`~/.claude/ligant-hq/vera/reports/2026-11-24-t0735-c19-r3-confirm.md`) | section 12; ELM-OU-04, -05, -10; IE-10 |
| Q-AT-C19-23 | ruled: NAD-2026-11-24-17 | section 0.1 |
| Q-AT-C19-24 | answered: KAITO-2026-11-24-01 | header Product row |
| Q-AT-C19-25 | answered: KAITO-2026-11-24-02 | section 0.3, ELM-ST-02 |
| Q-AT-C19-26 | answered: KAITO-2026-11-24-03 | ELM-IN-13, OU-09 |
| Q-AT-C19-27 | answered: KAITO-2026-11-24-04; withdrawn with the gate, with J-10 (KAITO-2026-11-24-09) | ELM-OU-11 |
| Q-AT-C19-28 | answered: KAITO-2026-11-24-05 (stage 4) | ELM-OU-16 |
| Q-AT-C19-29 | answered: KAITO-2026-11-24-06 (stage 3 engine spec) | ELM-DP-01, NF-02 |
| Q-AT-C19-30 | answered: KAITO-2026-11-24-07 (keep ELM-IE) | section 8, J-2 |

### Conflicts for Nadira

All eight rows are ruled (NAD-2026-11-24-34). Atlas has applied each final string in the body, removed the losing texts and removed every pending mark. The legal notes are Theron's (THR-2026-11-23-463). No clearance named here is still owed: Theron cleared the final strings (THR-2026-11-23-465 to -471) and Vera confirmed rows 4 and 7 (VERA3).

| # | Where | Ruled | Final string | Legal and other notes | IDs |
|---|---|---|---|---|---|
| 1 | ELM-FL-08 equality note | ruled: NAD-2026-11-24-25 | "The harmonised test text reads "less than the endotoxin limit" (PDG Q-06 Rev. 2, l.298-300). Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's." | Legal: cleared either way (THR-2026-11-23-463); the attribution is Theron's and is applied (THR T3-08). Final string cleared (THR-2026-11-23-465). | NAD-2026-11-24-25; THR-2026-11-23-455(a), -463; THR change 8 |
| 2 | ELM-RF-04 ">" refusal; F-16 | ruled: NAD-2026-11-24-26 | "A result reported as greater than a value is not a quantity, so the tool does not take it. Do not enter the top of your standard curve in its place: enter only a result read within your curve." | Legal: THR-463 cleared the r2 string; the final string departs from it and from Theron's wording. Final string cleared (THR-2026-11-23-466). F-16 expects this string. | NAD-2026-11-24-26; THR-2026-11-23-457, -463; THR change 17 |
| 3 | ELM-FL-06 zero result; F-17 | ruled: NAD-2026-11-24-27 | No string: ELM-FL-06 stays unused and ELM-FL-15 covers a zero result. | Legal: a cut string carries no risk; Theron's FL-06 string is withdrawn (THR-463). | NAD-2026-11-24-13, -27; THR-457, THR change 18 |
| 4 | ELM-IN-14 W-7 | ruled: NAD-2026-11-24-28 | "Why we ask: a number without its reagent type can be read later as if it came from a different reagent. The reagent type travels with the number everywhere it is shown." | Legal: no point (THR-463). Vera confirmed the GxP-word point (VERA3). Cleared (THR-2026-11-23-469). | NAD-2026-11-24-28; VERA-2026-11-24-05, VERA change 7; THR-455 |
| 5 | §12.3 public sentence 1 | ruled: NAD-2026-11-24-29 | "FDA's guidance on CMC information for human gene therapy INDs (January 2020) recommends an upper limit for endotoxin of 5 EU/kg body weight/hour for parenteral products other than intrathecal and intraocular ones, and 0.2 EU/kg body weight/hour for intrathecal ones." | Theron's sentence, adopted verbatim; no clearance owed. Solon's dated check and A.B.'s publication (D-0126) still apply before any public use. | NAD-2026-11-24-29; THR-2026-11-23-454, -463; THR change 20 |
| 6 | PDG citation (Sources, ELM-OU-13) | ruled: NAD-2026-11-24-30 | "Pharmacopoeial Discussion Group, Q-06 Bacterial Endotoxins Test, Rev. 2 (signed off June 2011; sign-off cover sheet version 2, 2026)" | The form is Theron's (THR-455); the withdrawal of "2026" in THR-463 row 6 is moot after this ruling; Theron concurs (THR-2026-11-23-471). | NAD-2026-11-24-19, -30; THR-455, THR change 14; KAITO-2026-11-24-08 |
| 7 | §12.1 and §12.2 role words | ruled with conditions: NAD-2026-11-24-31 | §12.1: "The user's declared limit, when it is the drug product's endotoxin limit, is a limit of this kind"; "The user's endotoxin result on the drug product belongs under Purity"; "Direct context (the user's own result on the final container product)". §12.2 l.73 row: "Direct context (the user's own limit and result)". | Legal: none (internal, never shown; THR-463). Vera confirmed that the three scope edits keep her GxP point (VERA3). | NAD-2026-11-24-31; VERA-2026-11-24-01(b), VERA change 2 |
| 8 | ELM-IN-12 spike label | ruled with conditions: NAD-2026-11-24-32 | Label: "spike concentration stated by your reagent supplier for this lot (EU/mL), where the spike comes with your reagent". Help text: "This field is recorded, not calculated: recovery uses the added amount you enter with B and A." The key stays `spike_conc_supplier_stated`. | Cleared (THR-2026-11-23-467). | NAD-2026-11-24-32; THR-2026-11-23-453, THR change 4; RUL -03 |

Note, not a conflict: Theron cleared W-1, W-4 and W-8 as drafted in v0.1; Nadira has since reworded them (NAD-2026-11-24-12). Her words are in the body; Theron cleared them (THR-2026-11-23-459; W-7, THR-2026-11-23-469).

### For Nadira (new in r2)
- **Q-AT-C19-31** (section 0.5, ELM-OU-12; THR-2026-11-23-452). The M quotation on a page: the l.68-69 fragment ("the maximum total dose administered in a single hour period") or the whole l.66-69 sentence (with the "bolus dose" and "infused continuously" clauses; the same quotation-only rule covers "infused")? **Ruled: NAD-2026-11-24-33.** The page quotes the whole M definition (l.66-69; line corrected by THR-2026-11-23-468), never the l.68-69 fragment alone; section 0.5 M carries it.
- **Q-AT-C19-32** Confirm or replace the conflicts rows above (items 1 to 8). **Ruled: NAD-2026-11-24-34.** Rows 1 to 8 are ruled by NAD-2026-11-24-25 to -32 and applied.

### For Theron (new in r2)
- **Q-AT-C19-33** (ELM-IN-07, -08, -14, -17, FL-03, FL-08, FL-11, FL-15, RF-04, DT-11, IE-04, IE-08, section 0.1). Scan of the strings Nadira ruled or reworded after your review: the purpose sentence; the "Dilution tested: 1 part sample in [ ] parts total" label; the Technique options (including "Fluorimetric") and the gel-clot sentence; the three `<` lines; FL-15; W-1, W-4, W-8; the λ × DF line; the FL-11 concept sentence; the IE-08 and IE-04 strings; the K label with and without "body weight". Added by Nadira (R3-24): W-7 (NAD-2026-11-24-28), the ELM-FL-08 string (-25), the ELM-RF-04 string (-26), the spike label and help text (-32) and the whole M quotation (-33). **Answered** for the r2 strings: THR-2026-11-23-459 to -464, file `.claude/reports/theron/2026-11-24-t0735-c19-r2-scan.md`. The strings added by R3-24 are cleared: THR-2026-11-23-465 to -469, file `.claude/reports/theron/2026-11-24-t0735-c19-r3-clearance.md`.

### For Kaito (new in r2)
- **Q-AT-C19-34** (from Theron, THR-2026-11-23-457, "for other owners"). One factual question to A.B., put by you, not by Atlas: "Is there any written term (NDA, engagement letter, email condition) attached to the customer scoping document behind C19 (NAD-2026-11-23 Q3)?" If yes, that term governs use and the point is STUCK until a human lawyer reads it. Keep `nadira/inputs/URS-BET-CALC-001-v0.2.pdf` out of every public export and any non-private backup. Also from Theron: judge the non-recursive grep disclosed in his guard block 1; ask Archivist to confirm that THR IDs 450-458 are free. Optional, from Nadira and Solon: a Federal Register read of 91 FR 59988's amendatory text. Kaito: Q3 written-terms question put to A.B. in the T-0735 report; Theron's grep accepted (KAITO-2026-11-24-10).

---

## 20. Signature block

| Role | Name | Decision |
|---|---|---|
| Author | Atlas | DRAFT v0.2 (r2) written |
| Author | Atlas | DRAFT (r3) written (from r2, by edits) |
| Author | Atlas | v0.1 (r4, D-0131) written (from r3, by edits); the working notes are held apart |
| Author | Atlas | v0.1 (r5, the signature copy) written (from r4, by edits; record-only changes N-01 to N-07 and Kaito's housekeeping) |
| Scientific reviewer | Nadira | to be signed (route K1), after the conflicts table is ruled |
| Product | none | no product row (KAITO-2026-11-24-01) |
| Acceptance | Adacs | not applicable until a build exists |

**For signature (supersedes D-0131 once approved). Not yet approved.**

## 21. Change log

| Version | Change | Basis |
|---|---|---|
| v0.1 DRAFT | First draft from NAD-2026-11-23-01 to -13, the run brief and the input document | T-0735 stage 1 |
| v0.2 DRAFT (r2) | Applies NAD-2026-11-24-01 to -24 (C-01 to C-67), THR-2026-11-23-450 to -458 (change list 1-21), VERA-2026-11-24-01 to -07 (change list 1-10), the Warden change list 1-8, KAITO-2026-11-24-01 to -09, and Solon's dated check. Conflicts carried, not chosen, in section 19. | T-0735 stage 1, r2 |
| v0.2 DRAFT (r3) | Applies Nadira's R3-01 to R3-25 (NAD-2026-11-24-25 to -38) and Theron's T3-01 to T3-11 (THR-2026-11-23-459 to -464); all eight conflicts ruled, every P mark removed. The r2 → r3 table of section 22 records each change. | T-0735 stage 1, r3 |
| v0.1 (for signature; drafts r1-r3 superseded) (r4) | Applies Theron's T4-01 to T4-10 (THR-2026-11-23-465 to -471), Vera's V4-01 and V4-02 (VERA-2026-11-24-09, -10), Kaito's housekeeping (KAITO-2026-11-24-11: title, version, location, the how-made row, the section 20 and 21 rows, the Q-AT-C19-12 and -34 cells, the header source list and the pointer to the working notes), and the F-15(c) wording made equal to ELM-FL-04. The working notes are held in a separate file. The r3 → r4 table of section 22 records each change. | T-0735 stage 1, r4 |
| v0.1 (for signature; r5; drafts r1-r4 superseded) (r5) | Record-only. Applies Nadira's N-01 to N-07 (NAD-2026-11-24-39 to -48): the stale "still owed" and "Vera to confirm" cells in section 19, the r2 header labels (Drafted by, Guard blocks), the Sources heading and the R1 row. Kaito's housekeeping (KAITO-2026-11-24-12): version label, title, location, the how-made row, the section 20 status line and rows, and this row. No requirement, fixture, acceptance test or page string changes. The r4 → r5 table of section 22 records each change. | T-0735 stage 1, r5 |

---

## 22. Change map (every change ID, the requirement IDs touched, and whether applied)

"Applied" means the text is in the body above.

### Nadira, C-01 to C-67 (NAD-2026-11-24-01 to -24)

| Change | Requirement IDs / sections touched | Result |
|---|---|---|
| C-01 | header Product row; section 20; Q-AT-C19-24 | applied |
| C-02 | Sources, PDG row | applied as ruled in NAD-2026-11-24-30 |
| C-03 | ELM-OU-13 | applied as ruled in NAD-2026-11-24-30 |
| C-04 | Sources (SOLON, REV rows) | applied |
| C-05 | Sources, FDAPAGE row | applied |
| C-06 | section 12.1 row 1 | applied |
| C-07 | section 12.1 row 2 | applied |
| C-08 | section 12.1 row 4 | applied |
| C-09 | section 12.1 row 5 | applied |
| C-10 | section 12.1 row 6 | applied |
| C-11 | section 12.3 sentence 1 | applied as ruled in NAD-2026-11-24-29 |
| C-12 | section 17 register, K = 5 row | applied |
| C-13 | section 18 other open items | applied |
| C-14 | ELM-FL-12 | applied (with Theron's attribution, THR-458) |
| C-15 | ELM-IN-04 | applied |
| C-16 | ELM-UN-06 | applied |
| C-17 | ELM-DT-10 | applied |
| C-18 | ELM-DT-07 | applied |
| C-19 | ELM-DT-08, ELM-FL-03 | applied |
| C-20 | ELM-FL-02 | applied |
| C-21 | section 18 J-7 | applied (withdrawn) |
| C-22 | ELM-IN-08, ELM-RF-02 | applied |
| C-23 | ELM-SU-07, section 17 bounds row | applied |
| C-24 | ELM-IN-11, ELM-SU-02, ELM-IE-02 | applied |
| C-25 | ELM-IE-04 | applied |
| C-26 | ELM-IE-08, ELM-IE-09 | applied (IE-09 cut) |
| C-27 | ELM-IN-07 | applied |
| C-28 | ELM-IN-17 (new), ELM-IN-10, section 1 step 2, ELM-OU-01, J-8 | applied with a text defect, corrected by NAD-2026-11-24-35 |
| C-29 | ELM-DT-11 | applied |
| C-30 | ELM-IN-14 | applied as ruled in NAD-2026-11-24-28 |
| C-31 | ELM-FL-06 (cut), ELM-FL-15 (new) | applied |
| C-32 | ELM-RF-04 | applied as ruled in NAD-2026-11-24-26 |
| C-33 | section 6 intro, ELM-RF-01, -03, -05, -06 | applied |
| C-34 | ELM-FL-05 | applied |
| C-35 | ELM-FL-08 | applied as ruled in NAD-2026-11-24-25 |
| C-36 | ELM-OU-06 | applied |
| C-37 | ELM-OU-12 | applied |
| C-38 | ELM-OU-11, J-10, section 0.2, AT-ELM-13 | applied |
| C-39 | ELM-IN-13 | applied |
| C-40 | section 0.1 | applied |
| C-41 | ELM-IN-15 | applied |
| C-42 | ELM-IE-05 | applied |
| C-43 | ELM-DP-02 | applied |
| C-44 | ELM-UN-02, ELM-UN-03 | applied |
| C-45 | section 15 intro, J-3 | applied |
| C-46 | section 15 common inputs | applied |
| C-47 | F-15 | applied |
| C-48 | F-14, F-17 | applied |
| C-49 | F-19, F-21 | applied |
| C-50 | F-25 | applied |
| C-51 | F-26 | applied |
| C-52 | F-27 | applied |
| C-53 | F-31, F-32 | applied |
| C-54 | F-36 (new) | applied |
| C-55 | F-37 (new) | applied |
| C-56 | F-35 (new) | applied |
| C-57 | fixture count line | applied (37 rows plus D-1) |
| C-58 | AT-ELM-02, -04, -05, -06, -10, -15 | applied |
| C-59 | section 19 (Nadira questions) | applied |
| C-60 | section 19 (Q-AT-C19-12) | applied |
| C-61 | ELM-IN-12, ELM-OU-04 | applied |
| C-62 | ELM-FL-11 | applied |
| C-63 | section 19 (Kaito), ELM-OU-16, J-2, section 0.3, ELM-ST-02 | applied |
| C-64 | section 18 OI-01, OI-03 | applied |
| C-65 | section 17 register rows | applied |
| C-66 | working notes (F-15, F-17, F-26, F-27, F-28; F-35 to F-37) | applied |
| C-67 | section 21 change log; r2 sha in the header | change log applied; **sha not in the file** (a file cannot contain its own hash); sha is in Atlas's reply |

### Theron, change list 1-21 (THR-2026-11-23-450 to -458)

| Change | Requirement IDs / sections touched | Result |
|---|---|---|
| THR 1 | title, header Title row, document title | applied |
| THR 2 | header Device-status tier row | applied |
| THR 3 | ELM-IN-12 help text | applied |
| THR 4 | ELM-IN-12, ELM-OU-04 (spike label, key) | applied as ruled in NAD-2026-11-24-32; cleared (THR-2026-11-23-467) |
| THR 5 | ELM-OU-03 intraocular quote | applied |
| THR 6 | section 0.5 K and M quotations | applied |
| THR 7 | ELM-OU-12 (no "dose"/"dosing" in identifiers) | applied |
| THR 8 | ELM-FL-08 | applied as ruled in NAD-2026-11-24-25; legally cleared either way (THR-2026-11-23-463); final string cleared (THR-2026-11-23-465) |
| THR 9 | section 0.4 | applied |
| THR 10 | ELM-OU-17 | applied |
| THR 11 | ELM-OU-16 | applied |
| THR 12 | ELM-IN-05 | applied |
| THR 13 | ELM-IN-10 | applied |
| THR 14 | ELM-OU-13 | applied as ruled in NAD-2026-11-24-30 (Theron's form); legally cleared either way (THR-2026-11-23-463); Theron concurs (THR-2026-11-23-471) |
| THR 15 | ELM-IN-10 | applied |
| THR 16 | ELM-OU-12 | applied |
| THR 17 | ELM-RF-04, F-16 | applied as ruled in NAD-2026-11-24-26; legally cleared on the r2 wording (THR-2026-11-23-463), final string cleared (THR-2026-11-23-466); "no input-document wording in the Basis column" applied |
| THR 18 | ELM-FL-06, F-17 | not applied: ELM-FL-06 is cut by NAD-2026-11-24-13 and the zero string is moot (NAD-2026-11-24-27); legally cleared either way (THR-2026-11-23-463); "drop 'carried from the input document'" applied by the cut |
| THR 19 | ELM-FL-12 | applied |
| THR 20 | section 12.3 sentence 1 | applied as ruled in NAD-2026-11-24-29 (Theron's wording); legally cleared (THR-2026-11-23-463); "body copy only" clause applied |
| THR 21 | section 19 Q-AT-C19-12 | applied (part 8 open) |

### Vera, change list 1-10 (VERA-2026-11-24-01 to -07)

| Change | Requirement IDs / sections touched | Result |
|---|---|---|
| VERA 1 (-01a) | section 12 paragraph | applied, verbatim |
| VERA 2 (-01b) | sections 12.1, 12.2 role words | applied as ruled in NAD-2026-11-24-31 (with three accuracy edits) |
| VERA 3 (-02) | ELM-IN-12 "name (as you type it; not a signature)" | applied |
| VERA 4 (-02) | ELM-OU-05 placement; F-34 | applied |
| VERA 5 (-03) | ELM-OU-04 "File created" line; F-34 | applied |
| VERA 6 (-04) | ELM-IE-10, AT-ELM-12, F-33 | applied |
| VERA 7 (-05) | ELM-IN-14 W-7 | applied as ruled in NAD-2026-11-24-28 (Vera's first clause not taken) |
| VERA 8 (-06) | section 0.4, AT-ELM-14, ELM-OU-12 | applied |
| VERA 9 (-07) | ELM-OU-10 | applied |
| VERA 10 | keep byte-exact: ELM-OU-05 lines, ELM-IE-01 heading, "procedure", header GxP impact line | applied (all unchanged) |

### Warden, change list 1-8

| Change | Requirement IDs / sections touched | Result |
|---|---|---|
| WARDEN 1 | ELM-OU-11, J-10, Q-AT-C19-27, AT-ELM-13, section 0.2 | applied |
| WARDEN 2 | ELM-ST-01, ELM-ST-02 | applied |
| WARDEN 3 | ELM-NF-04 | applied |
| WARDEN 4 | ELM-ST-03 (new) | applied |
| WARDEN 5 | ELM-IN-12 (`autocomplete="off"`) | applied |
| WARDEN 6 | ELM-OU-04 clause (the "device-clock date" exception becomes the "File created" line, VERA-03) | applied |
| WARDEN 7 | ELM-NF-10 (new), AT-ELM-16 sentinel test | applied |
| WARDEN 8 | ELM-ST-01 basis (class L, no S or X) | applied |

### Kaito

| Change | Requirement IDs / sections touched | Result |
|---|---|---|
| KAITO-01 | header Product row, section 20 | applied |
| KAITO-02 | section 0.3, ELM-ST-02 | applied |
| KAITO-03 | ELM-IN-13, ELM-OU-09 | applied |
| KAITO-04 and -09 | ELM-OU-11, section 0.2, AT-ELM-13, J-10 and Q-AT-C19-27 dropped | applied |
| KAITO-05 | ELM-OU-16 | applied |
| KAITO-06 | ELM-DP-01, ELM-NF-02, section 3 intro | applied |
| KAITO-07 | section 8, J-2 | applied |
| KAITO-08 | Sources PDG, section 12.1 rows, CFR row | applied (PDG form as ruled in NAD-2026-11-24-30) |

### Atlas corrections (not in any list)
- ELM-OU-15: r1 pointed to "section 12.2" for the allowed public sentences; they are in section 12.3. Corrected.
- Section 13 heading renamed "storage and privacy" because ELM-ST-03 is about the page address.
- ELM-IE-08 intro and section 8 intro: IE-09 cut, ID unused (as C-26 asks).

### r2 → r3 (Nadira R3-01 to R3-25, NAD-2026-11-24-25 to -38; Theron T3-01 to T3-11, THR-2026-11-23-459 to -464)

OLD is the exact r2 string and NEW the exact r3 string, as bytes in the two files. Only the changed span of a cell is quoted. Overlaps: T3-01 and T3-02 are applied inside R3-11 and R3-03; T3-08 inside R3-07; T3-09 inside R3-21; T3-10 inside R3-23. Where Nadira's -36 and Theron's T3-01 to T3-04 differ, Nadira's wording is used for ELM-FL-12 (lead-in) and ELM-OU-13, Theron's for ELM-FL-12 (the bar sentence, which -36 does not touch), section 12.1 and AT-ELM-14.

| Change | Requirement ID or place | OLD (r2) | NEW (r3) |
|---|---|---|---|
| R3-01 | header, Marks used | **P (pending Nadira)** = a string that carries science and was reworded by Theron or Vera, or a string on which two reviews give different wording; Nadira has not yet seen it. See section 19, "Conflicts for Nadira". | No P marks remain (NAD-2026-11-24-34). |
| R3-01 (P-mark removal, -34) | section 6 intro | (NAD-2026-11-24-12) except where marked P. | (NAD-2026-11-24-12). |
| R3-01 (P-mark removal, -34) | section 22 intro | "Applied" means the text is in the body above. "P" means applied with the P mark of section 19. | "Applied" means the text is in the body above. |
| R3-01 (P-mark removal, -34) | section 22, KAITO-08 row | applied (PDG form P, conflicts item 6) | applied (PDG form as ruled in NAD-2026-11-24-30) |
| R3-02 | Sources, PDG row | (signed off June 2011; sign-off cover sheet version 2, April-May 2026)" (NAD-2026-11-24-19; **P**, conflicts table item 6) | (signed off June 2011; sign-off cover sheet version 2, 2026)" (NAD-2026-11-24-19, amended by NAD-2026-11-24-30) |
| R3-03 a (with T3-02) | ELM-OU-13, basis line | FDAQA Q7 (second and third sentences only) and Q12 | FDAQA Q7 (the two sentences quoted in ELM-FL-12 only) and Q12 |
| R3-03 b | ELM-OU-13, citation | sign-off cover sheet version 2, April-May 2026)"** (NAD-2026-11-24-19; **P**: Theron's form ends "version 2, 2026" and Kaito's differs again, conflicts table item 6). | sign-off cover sheet version 2, 2026)"** (NAD-2026-11-24-19, amended by NAD-2026-11-24-30). |
| R3-04 | section 0.5, M | PDG's words: "the maximum total dose administered in a single hour period" (PDG Q-06 Rev. 2, l.68-69), same placement rule as K. The single hour is the counting window for both K and M, so K/M is in EU per [D] (NAD-2026-11-23-06(a)). Whether the page quotes the l.68-69 fragment or the whole l.66-69 sentence: Q-AT-C19-31. | PDG's words: "M is equal to the maximum recommended bolus dose of product per kg of body weight. When the product is to be injected at frequent intervals or infused continuously, M is the maximum total dose administered in a single hour period" (PDG Q-06 Rev. 2, l.65-69), same placement rule as K. The tool counts both cases the same way: the largest amount per kg given in any one hour. The single hour is the counting window for both K and M, so K/M is in EU per [D] (NAD-2026-11-23-06(a)). |
| R3-05 | ELM-IN-12, spike field (ELM-OU-04: no P note and no fallback text there; no change) | **spike concentration stated by your reagent supplier for this lot (EU/mL)** (**P (pending Nadira)**: Theron's reword, THR-2026-11-23-453, of the ruled string "spike concentration printed on the cartridge lot certificate"; fallback if Nadira rules the meaning changes is the ruled string, as a label only; the export line, CSV header and JSON key are `spike_conc_supplier_stated` either way, with no "certificate" or "CoA"); | **spike concentration stated by your reagent supplier for this lot (EU/mL), where the spike comes with your reagent** (help text: **"This field is recorded, not calculated: recovery uses the added amount you enter with B and A."**; the export line, CSV header and JSON key are `spike_conc_supplier_stated`, with no "certificate" or "CoA"); |
| R3-06 | ELM-IN-14, W-7 | **W-7** beside the reagent type (**P (pending Nadira)**: Nadira ruled it as drafted; Vera proposes a replacement, conflicts table item 4): "Why we ask: a record that does not say which reagent produced the number cannot be traced." | **W-7** beside the reagent type: "Why we ask: a number without its reagent type can be read later as if it came from a different reagent. The reagent type travels with the number everywhere it is shown." |
| R3-07 a (with T3-08) | ELM-FL-08, string | **"The harmonised text's test reads "less than the endotoxin limit". Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's."** **P (pending Nadira)**: Theron (THR-2026-11-23-455(a)) gives a different wording; conflicts table item 1. | **"The harmonised test text reads "less than the endotoxin limit" (PDG Q-06 Rev. 2, l.298-300). Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's."** |
| R3-07 b | ELM-FL-08, basis | RUL -04(d); NAD-2026-11-24-23(d) | RUL -04(d); NAD-2026-11-24-23(d), -25 |
| R3-08 a | ELM-RF-04, string | so the tool does not take it. Enter a value read within your standard curve."** **P (pending Nadira)**: Theron (THR-2026-11-23-457) gives a different wording; conflicts table item 2. (PDG l.199-201 | so the tool does not take it. Do not enter the top of your standard curve in its place: enter only a result read within your curve."** (PDG l.199-201 |
| R3-08 b | ELM-RF-04, basis | RUL -09(b); NAD-2026-11-24-23(c) | RUL -09(b); NAD-2026-11-24-23(c), -26 |
| R3-09 | F-16 | refused with the ELM-RF-04 sentence (**P**); no figure | refused with the ELM-RF-04 sentence; no figure |
| R3-10 a | ELM-FL-06, text | is moot; see section 19, conflicts table item 3. | is moot (NAD-2026-11-24-27). |
| R3-10 b | ELM-FL-06, basis | NAD-2026-11-24-13 | NAD-2026-11-24-13, -27 |
| R3-11 a (T3-01, with -36) | ELM-FL-12, lead-in | (FDAQA Q7, the sentences after the first, as FDA prints them) | (FDAQA Q7, the two sentences beginning "Intrathecally-administered products" and "FDA encourages firms"; no other Q7 sentence is printed) |
| R3-11 b (T3-01) | ELM-FL-12, bar sentence | **Q7's first sentence ("The appropriate way to establish the endotoxins limit is to use the calculation methods provided in the USP or AAMI standards") is not printed anywhere** (page, help, export, public copy), because it names a USP chapter family as the way to set a limit and would read as the tool following USP (NAD-2026-11-23-03; ruled THR-2026-11-23-458). | **No other sentence of FDAQA Q7 is printed anywhere** (page, help, export, public copy). In particular, Q7's second sentence ("The appropriate way to establish the endotoxins limit is to use the calculation methods provided in the USP or AAMI standards") is never printed, nor is the sentence naming USP <85>, because each would read as the tool following USP (THR-2026-11-23-458, as corrected by THR-2026-11-23-461). |
| R3-11 c (T3-01) | ELM-FL-12, basis | RUL -06(e); NAD-2026-11-24-21; THR-458 | RUL -06(e); NAD-2026-11-24-21, -36; THR-458, -461 |
| R3-12 | ELM-RF-08 (state and words cells) | Limit source, technique, qualifier chosen, or (for any comparison) reagent type not chosen / "Not calculated yet. Still needed: [label]." Reagent type is compelled only for a comparison (ELM-IN-10). | Limit source or technique not chosen; or a result entered with no qualifier chosen / "Not calculated yet. Still needed: [label]." A missing reagent type is not a refusal. The calculated values show, and only the comparison is withheld, with the ELM-FL-02 reason "reagent type not selected" (F-23, F-27). |
| R3-13 a | ELM-DT-09 (defines [y]) | print the fact line of ELM-FL-04, with [x] and its unit. | print the fact line of ELM-FL-04, with [y] and its unit. [y] = DF × λ, in EU/mL. |
| R3-13 b | ELM-DT-11 | **"λ × DF = [x] EU/mL: the lowest | **"λ × DF = [y] EU/mL: the lowest |
| R3-13 c | ELM-FL-04 | **"your reported floor differs from DF × λ = [x]"**, [x] with its unit. | **"your reported floor differs from DF × λ = [y] EU/mL"**, [y] as defined in ELM-DT-09. |
| R3-13 d | ELM-FL-15 | less than DF × λ = [x] EU/mL"** prints | less than DF × λ = [y] EU/mL"** prints |
| R3-14 | ELM-DP-02 | the raw reading and a bound, or the floor and L look equal | the raw reading and a bound, or x and L look equal |
| R3-15 | F-15, expected cell | plus "your reported floor differs from DF × λ = [x]". (d) the x below L line; plus the floor line. [x] prints with its unit. | plus "your reported floor differs from DF × λ = [y]". (d) the x below L line; plus the floor line. [x] and [y] print with their units. |
| R3-16 | F-35, inputs cell | (a) `<` 0.005, DF 1. (b) `<` 10, DF equal to the MVD of this limit | (a) `<` 0.005, DF 1. (b) `<` 10, DF equal to the MVD of this limit. (c) `<` 0.02, DF 1 |
| R3-16 | F-35, expected cell | (b) the x = L line in EU/mg; no floor line. Numbers derived by the fixture author | (b) the x = L line in EU/mg; no floor line. (c) the "floor in your limit's unit" line, the x below L line in EU/mg, and the ELM-FL-04 floor line in EU/mL; this is the only row where [x] and [y] carry different units. Numbers derived by the fixture author |
| R3-17 | F-23 | MVD still shown; the MVD-only export prints "reagent type: not selected" | MVD still shown; the export prints "reagent type: not selected" |
| R3-18 a | section 12.1, 312.23 row, Link | **P:** The user's declared limit is a testing limit of this kind | The user's declared limit, when it is the drug product's endotoxin limit, is a limit of this kind |
| R3-18 b | section 12.1, Purity row, Link | **P:** The user's endotoxin result belongs under Purity | The user's endotoxin result on the drug product belongs under Purity |
| R3-18 c | section 12.1, final container row, Link | **P:** Direct context (the user's own result) | Direct context (the user's own result on the final container product) |
| R3-19 a | section 12.2, l.73 row, Role | **P:** **Direct context (the user's own limit and result)** | **Direct context (the user's own limit and result)** |
| R3-19 b | section 12 intro | The role words in the "Link" column and the Role column below are Vera's proposal (VERA-2026-11-24-01(b)), marked **P (pending Nadira)**; her NAD-2026-11-23-11 labels are in conflicts table item 7. | The role words in the Link and Role columns are Vera's (VERA-2026-11-24-01(b)), as ruled in NAD-2026-11-24-31. |
| R3-20 (T3 sentence per -29) | section 12.3, sentence 1 | 1. **P (pending Nadira; conflicts table item 5).** Nadira's wording (NAD-2026-11-24-21): "FDA's gene therapy CMC guidance (January 2020) recommends an upper limit of acceptance for endotoxin of 5 EU per kg of body weight per hour for parenteral drugs other than those given intrathecally or intraocularly, and 0.2 EU per kg of body weight per hour for intrathecal ones; intraocular products have their own limits." Marque, Lyra and Maya may simplify it provided they keep the unit after 0.2 and the intraocular carve-out. | 1. "FDA's guidance on CMC information for human gene therapy INDs (January 2020) recommends an upper limit for endotoxin of 5 EU/kg body weight/hour for parenteral products other than intrathecal and intraocular ones, and 0.2 EU/kg body weight/hour for intrathecal ones." (NAD-2026-11-24-29, amending NAD-2026-11-24-21.) Marque, Lyra and Maya may simplify it provided they keep the issuer, "recommends", the scope (including the intraocular exclusion), and both values with their units. |
| R3-21 (T3-09, T3-08) | section 19, Conflicts for Nadira (intro, header and rows 1 to 8) | see the OLD block below | see the NEW block below |
| R3-22 a | section 19, Q-AT-C19-31 | the same quotation-only rule covers "infused")? | the same quotation-only rule covers "infused")? **Ruled: NAD-2026-11-24-33.** The page quotes the whole M definition (l.65-69), never the l.68-69 fragment alone; section 0.5 M carries it. |
| R3-22 b | section 19, Q-AT-C19-32 | Atlas applies the result and removes every P mark. | **Ruled: NAD-2026-11-24-34.** Rows 1 to 8 are ruled by NAD-2026-11-24-25 to -32 and applied. |
| R3-22 c | section 18, open items | not changed: section 18 contains no text on Q-AT-C19-31 or -32 | not changed |
| R3-23 | C-02 | applied (P: conflicts item 6) | applied as ruled in NAD-2026-11-24-30 |
| R3-23 | C-03 | applied (P: conflicts item 6) | applied as ruled in NAD-2026-11-24-30 |
| R3-23 | C-11 | applied as Nadira's wording, P (conflicts item 5) | applied as ruled in NAD-2026-11-24-29 |
| R3-23 | C-28 | applied | applied with a text defect, corrected by NAD-2026-11-24-35 |
| R3-23 | C-30 | applied; W-7 is P (conflicts item 4) | applied as ruled in NAD-2026-11-24-28 |
| R3-23 | C-32 | applied, P (conflicts item 2) | applied as ruled in NAD-2026-11-24-26 |
| R3-23 | C-35 | applied, P (conflicts item 1) | applied as ruled in NAD-2026-11-24-25 |
| R3-23 | THR 4 | applied, P (conflicts item 8) | applied as ruled in NAD-2026-11-24-32 |
| R3-23 (T3-10) | THR 8 | not applied: Nadira's wording kept in the body (P); both in conflicts item 1 | applied as ruled in NAD-2026-11-24-25; legally cleared either way (THR-2026-11-23-463); Theron to clear the final string |
| T3-10 (adjusted: -30 adopted Theron's own "2026", so THR-463's "Nadira's form adopted" would be untrue) | THR 14 | not applied: Nadira's citation form kept (conflicts item 6) | applied as ruled in NAD-2026-11-24-30 (Theron's form); legally cleared either way (THR-2026-11-23-463) |
| R3-23 (T3-10, adjusted: THR-463 cleared the r2 wording, not the -26 string) | THR 17 | not applied as to the wording: Nadira's wording kept, P (conflicts item 2); "no input-document wording in the Basis column" applied | applied as ruled in NAD-2026-11-24-26; legally cleared on the r2 wording (THR-2026-11-23-463), Theron to clear the final string; "no input-document wording in the Basis column" applied |
| T3-10 | THR 18 | not applied: ELM-FL-06 is cut by NAD-2026-11-24-13 (conflicts item 3); "drop 'carried from the input document'" applied by the cut | not applied: ELM-FL-06 is cut by NAD-2026-11-24-13 and the zero string is moot (NAD-2026-11-24-27); legally cleared either way (THR-2026-11-23-463); "drop 'carried from the input document'" applied by the cut |
| R3-23 (T3-10) | THR 20 | not applied as to the wording: Nadira's wording kept, P (conflicts item 5); "body copy only" clause applied | applied as ruled in NAD-2026-11-24-29 (Theron's wording); legally cleared (THR-2026-11-23-463); "body copy only" clause applied |
| R3-23 | VERA 2 | applied, P (conflicts item 7) | applied as ruled in NAD-2026-11-24-31 (with three accuracy edits) |
| R3-23 | VERA 7 | not applied: Nadira's W-7 kept in the body (P); both in conflicts item 4 | applied as ruled in NAD-2026-11-24-28 (Vera's first clause not taken) |
| R3-24 (with T3-11) | section 19, Q-AT-C19-33 | the K label with and without "body weight". | the K label with and without "body weight". Added by Nadira (R3-24): W-7 (NAD-2026-11-24-28), the ELM-FL-08 string (-25), the ELM-RF-04 string (-26), the spike label and help text (-32) and the whole M quotation (-33). **Answered** for the r2 strings: THR-2026-11-23-459 to -464, file `.claude/reports/theron/2026-11-24-t0735-c19-r2-scan.md`. The strings added by R3-24 await Theron's clearance. |
| R3-25 | ELM-OU-12 | not applied: no change by Nadira; Theron's scan (THR-459 to -464) does not answer whether THR-452 covers alt text | unchanged |
| T3-03 | section 12.1, last row | FDAQA Q7 (first sentence internal only), Q12 | FDAQA Q7 (the USP or AAMI sentence, internal only), Q12 |
| T3-04 | AT-ELM-14 | the absence of Q7's first sentence (THR-458) | that no sentence of FDAQA Q7 other than the two quoted in ELM-FL-12 appears (THR-458 as corrected by THR-461) |
| T3-05 | section 0.5, K | a threshold of endotoxin per kg of body weight, in EU/kg: "a threshold | a threshold amount of endotoxin per kg, in EU/kg. PDG's words: "a threshold |
| T3-06 | section 0.3, intraocular preset | The typed-limit route with unit "other" covers that limit. | The typed-limit route with unit "other" covers that limit. (internal; if a 'not in v1' list reaches a page, it reads 'the intraocular injection preset', with no unit) |
| T3-07 | section 1, step 8 | 8. Record and pass on | 8. Record and share |

T3-01 to T3-04 are applied by R3-11 a to c, R3-03 a, T3-03 and T3-04 above; T3-08 by R3-07 a; T3-09 by R3-21; T3-10 by the R3-23 and T3-10 rows; T3-11 by R3-24.

**R3-21, OLD (r2, section 19, "Conflicts for Nadira", from the intro paragraph to row 8):**

~~~~
Where two reviews give different wording for the same string, Atlas has not chosen. The body carries the Nadira version marked **P**; both are listed here. Nadira rules; Atlas then removes the losing text and the P mark.

| # | Where | Nadira (in the body, P) | Other list | IDs |
|---|---|---|---|---|
| 1 | ELM-FL-08 equality note | "The harmonised text's test reads "less than the endotoxin limit". Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's." | Theron: "In the harmonised test text, the result must be less than the limit (PDG Q-06 Rev. 2, l.298-300). Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's." Theron asks Nadira to confirm it keeps her -04(d) meaning. Theron's concern: "compliance" in help text; Nadira's form has no "compliance". | NAD-2026-11-24-23(d), C-35; THR-2026-11-23-455(a), THR change 8 |
| 2 | ELM-RF-04 ">" refusal; F-16 | "A result reported as greater than a value is not a quantity, so the tool does not take it. Enter a value read within your standard curve." (reason: "dilute and retest" is not possible at DF = MVD) | Theron: "Not calculated: the result is above the top of your curve, so it is not a value. Test the sample again at a higher dilution." (pending Nadira). Theron's text recommends a higher dilution, which Nadira's -23(c) reasoning says is not always possible. | NAD-2026-11-24-23(c), C-32; THR-2026-11-23-457, THR change 17 |
| 3 | ELM-FL-06 zero result; F-17 | Nadira cuts the string; the general ELM-FL-15 line replaces it | Theron: "The result is 0. Check that this is the figure your instrument reported." (pending Nadira). Moot if the cut stands; Nadira to confirm. | NAD-2026-11-24-13, C-31; THR-457, THR change 18 |
| 4 | ELM-IN-14 W-7 | Ruled as drafted: "Why we ask: a record that does not say which reagent produced the number cannot be traced." | Vera: "Why we ask: the same number can mean different things from different reagents, so the reagent type travels with the number everywhere it is shown." Vera's concern: "traced" is ALCOA+ vocabulary. Theron cleared W-7 as drafted. | NAD-2026-11-24-12, C-30; VERA-2026-11-24-05, VERA change 7; THR-455 |
| 5 | §12.3 public sentence 1 (internal map; public copy later) | "FDA's gene therapy CMC guidance (January 2020) recommends an upper limit of acceptance for endotoxin of 5 EU per kg of body weight per hour for parenteral drugs other than those given intrathecally or intraocularly, and 0.2 EU per kg of body weight per hour for intrathecal ones; intraocular products have their own limits." | Theron (legal minimum, "legal wording of public copy"): "FDA's guidance on CMC information for human gene therapy INDs (January 2020) recommends an upper limit for endotoxin of 5 EU/kg body weight/hour for parenteral products other than intrathecal and intraocular ones, and 0.2 EU/kg body weight/hour for intrathecal ones." The two differ in the title of the guidance, "upper limit" against "upper limit of acceptance", the unit form, and the intraocular carve-out sentence. Both name the issuer, "recommends", the scope and both units. | NAD-2026-11-24-21, C-11; THR-2026-11-23-454, THR change 20 |
| 6 | PDG citation (Sources, ELM-OU-13) | "Pharmacopoeial Discussion Group, Q-06 Bacterial Endotoxins Test, Rev. 2 (signed off June 2011; sign-off cover sheet version 2, April-May 2026)" | Theron: "... (signed off June 2011; sign-off cover sheet version 2, 2026)", "subject to Nadira". Kaito: "harmonised text signed off June 2011; cover sheet version 2, 2026". The difference is only "April-May 2026" against "2026". | NAD-2026-11-24-19, C-02, C-03; THR-455, THR change 14; KAITO-2026-11-24-08 |
| 7 | §12.1 and §12.2 role words | Nadira accepted §12.2 as drafted ("Direct input", etc.) without having seen Vera (NAD-2026-11-24-23(k)) | Vera: "Direct context (the user's own limit and result)"; "Direct context (the user's own result)"; "The user's endotoxin result belongs under Purity"; "The user's declared limit is a testing limit of this kind". **The body carries Vera's words, marked P**, because Vera asked Nadira to rule and Nadira's acceptance was not a ruling on these words. | NAD-2026-11-24-23(k); VERA-2026-11-24-01(b), VERA change 2 |
| 8 | ELM-IN-12 spike label | Nadira's ruled string (NAD-2026-11-23-03): "spike concentration printed on the cartridge lot certificate". Her review does not address it. | Theron: "spike concentration stated by your reagent supplier for this lot (EU/mL)". **The body carries Theron's, marked P**; the ruled string is the fallback if Nadira finds the meaning changes. The key is `spike_conc_supplier_stated` either way. | THR-2026-11-23-453, THR change 4; RUL -03 |
~~~~

**R3-21, NEW (r3, same place):**

~~~~
All eight rows are ruled (NAD-2026-11-24-34). Atlas has applied each final string in the body, removed the losing texts and removed every pending mark. The legal notes are Theron's (THR-2026-11-23-463); a clearance named here is still owed before the signature request.

| # | Where | Ruled | Final string | Legal and other notes | IDs |
|---|---|---|---|---|---|
| 1 | ELM-FL-08 equality note | ruled: NAD-2026-11-24-25 | "The harmonised test text reads "less than the endotoxin limit" (PDG Q-06 Rev. 2, l.298-300). Whether a value equal to the limit is acceptable is your procedure's decision, not the tool's." | Legal: cleared either way (THR-2026-11-23-463); the attribution is Theron's and is applied (THR T3-08). Theron to clear the final string. | NAD-2026-11-24-25; THR-2026-11-23-455(a), -463; THR change 8 |
| 2 | ELM-RF-04 ">" refusal; F-16 | ruled: NAD-2026-11-24-26 | "A result reported as greater than a value is not a quantity, so the tool does not take it. Do not enter the top of your standard curve in its place: enter only a result read within your curve." | Legal: THR-463 cleared the r2 string; the final string departs from it and from Theron's wording, so Theron clears it. F-16 expects this string. | NAD-2026-11-24-26; THR-2026-11-23-457, -463; THR change 17 |
| 3 | ELM-FL-06 zero result; F-17 | ruled: NAD-2026-11-24-27 | No string: ELM-FL-06 stays unused and ELM-FL-15 covers a zero result. | Legal: a cut string carries no risk; Theron's FL-06 string is withdrawn (THR-463). | NAD-2026-11-24-13, -27; THR-457, THR change 18 |
| 4 | ELM-IN-14 W-7 | ruled: NAD-2026-11-24-28 | "Why we ask: a number without its reagent type can be read later as if it came from a different reagent. The reagent type travels with the number everywhere it is shown." | Legal: no point (THR-463). Vera to confirm the GxP-word point; Theron scans it in Q-AT-C19-33. | NAD-2026-11-24-28; VERA-2026-11-24-05, VERA change 7; THR-455 |
| 5 | §12.3 public sentence 1 | ruled: NAD-2026-11-24-29 | "FDA's guidance on CMC information for human gene therapy INDs (January 2020) recommends an upper limit for endotoxin of 5 EU/kg body weight/hour for parenteral products other than intrathecal and intraocular ones, and 0.2 EU/kg body weight/hour for intrathecal ones." | Theron's sentence, adopted verbatim; no clearance owed. Solon's dated check and A.B.'s publication (D-0126) still apply before any public use. | NAD-2026-11-24-29; THR-2026-11-23-454, -463; THR change 20 |
| 6 | PDG citation (Sources, ELM-OU-13) | ruled: NAD-2026-11-24-30 | "Pharmacopoeial Discussion Group, Q-06 Bacterial Endotoxins Test, Rev. 2 (signed off June 2011; sign-off cover sheet version 2, 2026)" | The form is Theron's (THR-455); the withdrawal of "2026" in THR-463 row 6 is moot after this ruling. | NAD-2026-11-24-19, -30; THR-455, THR change 14; KAITO-2026-11-24-08 |
| 7 | §12.1 and §12.2 role words | ruled with conditions: NAD-2026-11-24-31 | §12.1: "The user's declared limit, when it is the drug product's endotoxin limit, is a limit of this kind"; "The user's endotoxin result on the drug product belongs under Purity"; "Direct context (the user's own result on the final container product)". §12.2 l.73 row: "Direct context (the user's own limit and result)". | Legal: none (internal, never shown; THR-463). Vera to confirm the three scope edits keep her GxP point. | NAD-2026-11-24-31; VERA-2026-11-24-01(b), VERA change 2 |
| 8 | ELM-IN-12 spike label | ruled with conditions: NAD-2026-11-24-32 | Label: "spike concentration stated by your reagent supplier for this lot (EU/mL), where the spike comes with your reagent". Help text: "This field is recorded, not calculated: recovery uses the added amount you enter with B and A." The key stays `spike_conc_supplier_stated`. | Theron clears the added clause and the help text. | NAD-2026-11-24-32; THR-2026-11-23-453, THR change 4; RUL -03 |
~~~~

### r3 → r4 (Theron T4-01 to T4-10, THR-2026-11-23-465 to -471; Vera V4-01 and V4-02, VERA-2026-11-24-09 and -10; Kaito's housekeeping, KAITO-2026-11-24-11; Kaito's F-15(c) consistency fix; the working-notes removal)

OLD is the exact r3 string and NEW the exact r4 string (this file), as bytes in the two files. Only the changed span of a cell is quoted, except in the header rows, where the whole cell is quoted. Nothing outside this table changed between r3 and r4.

**Where the changes were made.** Theron's T4-07 and T4-09 name r3 lines in the r2 → r3 table and its R3-21 NEW block (r3 l.851-858 and l.809-812). The rows of section 19 (the Conflicts table) and the Theron rows of section 22 carry the same strings in the live text, and the changes were made there. **The r2 → r3 table above, with its OLD and NEW blocks, was not edited:** its heading says that NEW is the exact r3 string, and an edit would make that false. The same applies to the r3 strings that carry "l.65-69" (R3-04 and R3-22 a) and to the R3-24 sentence "await Theron's clearance". Where two clauses would otherwise join with a stray semicolon and a capital letter (T4-07 rows 2 and 4), the punctuation was set as a full stop; it changes no word.

| Change | Requirement ID or place | OLD (r3) | NEW (r4) |
|---|---|---|---|
| T4-01 | section 0.5, M | (PDG Q-06 Rev. 2, l.65-69) | (PDG Q-06 Rev. 2, l.66-69) |
| T4-02 | section 19, Q-AT-C19-31, ruled text | The page quotes the whole M definition (l.65-69), never the l.68-69 fragment alone | The page quotes the whole M definition (l.66-69; line corrected by THR-2026-11-23-468), never the l.68-69 fragment alone |
| T4-03 | ELM-OU-03 | Any PDG fragment carrying "dose" (l.66, l.68-69) appears only | Any PDG quotation carrying "dose" (the K and M quotations of section 0.5, l.66 and l.66-69) appears only |
| T4-04 | ELM-OU-12, item (1) | (NAD-2026-10-24-1220 item 4); it also binds alt text, JSON keys and schema, CSV headers, HTML/CSS ids and engine function names by this URS's design choice, which Theron cleared (THR-2026-11-23-452). Body text | (NAD-2026-10-24-1220 item 4). By this URS's design choice it also binds JSON keys and schema, CSV headers, HTML/CSS ids and engine function names (the "dose"/"dosing" rule for these is THR-2026-11-23-452; the rest of the list is cleared by THR-2026-11-23-470), and image alt text, with no quotation exception (THR-2026-11-23-470). Body text |
| T4-05 a | AT-ELM-14, test cell | scan of title, labels, meta, keywords, slug, JSON keys, identifiers, About text; | scan of title, labels, meta, keywords, slug, image alt text, JSON keys, identifiers, About text; |
| T4-05 b | AT-ELM-14, test cell | the identifier rule (no "dose" or "dosing", THR-452); no supplier name in any placeholder | the identifier rule (no "dose" or "dosing", THR-452); the THR-105 list in alt text, with no quotation exception (THR-470); no supplier name in any placeholder |
| T4-06 | ELM-RF-04, words cell | (PDG l.199-201: "≥ largest dilution factor × λ" is not a quantity.) | (PDG l.199-201: a result reported as "equal to or greater than the largest dilution factor multiplied by λ" is not a quantity.) |
| T4-07 a | section 19, Conflicts table, row 1, notes | Theron to clear the final string. | Final string cleared (THR-2026-11-23-465). |
| T4-07 b | section 19, Conflicts table, row 2, notes | the final string departs from it and from Theron's wording, so Theron clears it. F-16 expects | the final string departs from it and from Theron's wording. Final string cleared (THR-2026-11-23-466). F-16 expects |
| T4-07 c | section 19, Conflicts table, row 4, notes | Vera to confirm the GxP-word point; Theron scans it in Q-AT-C19-33. | Vera to confirm the GxP-word point. Cleared (THR-2026-11-23-469). |
| T4-07 d | section 19, Conflicts table, row 6, notes | THR-463 row 6 is moot after this ruling. | THR-463 row 6 is moot after this ruling; Theron concurs (THR-2026-11-23-471). |
| T4-07 e | section 19, Conflicts table, row 8, notes | Theron clears the added clause and the help text. | Cleared (THR-2026-11-23-467). |
| T4-08 | section 19, Q-AT-C19-33, last sentence | The strings added by R3-24 await Theron's clearance. | The strings added by R3-24 are cleared: THR-2026-11-23-465 to -469, file `.claude/reports/theron/2026-11-24-t0735-c19-r3-clearance.md`. |
| T4-09 a | section 22, Theron rows, THR 4 | applied as ruled in NAD-2026-11-24-32 | applied as ruled in NAD-2026-11-24-32; cleared (THR-2026-11-23-467) |
| T4-09 b | section 22, Theron rows, THR 8 | Theron to clear the final string | final string cleared (THR-2026-11-23-465) |
| T4-09 c | section 22, Theron rows, THR 14 | legally cleared either way (THR-2026-11-23-463) | legally cleared either way (THR-2026-11-23-463); Theron concurs (THR-2026-11-23-471) |
| T4-09 d | section 22, Theron rows, THR 17 | Theron to clear the final string | final string cleared (THR-2026-11-23-466) |
| T4-10 a | ELM-IN-14, last sentence | Theron cleared the v0.1 W-strings; the reworded W-1, W-4 and W-8 are for his scan (Q-AT-C19-33). | Theron cleared W-1 to W-8 as they stand (THR-2026-11-23-455, -459, -469). |
| T4-10 b | section 19, note after the Conflicts table | Her words are in the body; Theron scans them (Q-AT-C19-33). | Her words are in the body; Theron cleared them (THR-2026-11-23-459; W-7, THR-2026-11-23-469). |
| V4-01 | section 12.1, heading (alters meaning: for Nadira's final check) | ### 12.1 What the output feeds | ### 12.1 Where the user's limit and result appear |
| V4-02 | section 19, Q-AT-C19-18 (Vera), answer cell | VERA-01(b) role words and W-7 await Nadira (conflicts table items 4 and 7) | VERA-01(b) role words ruled by NAD-2026-11-24-31 and W-7 by NAD-2026-11-24-28; Vera confirmed both (`~/.claude/ligant-hq/vera/reports/2026-11-24-t0735-c19-r3-confirm.md`) |
| K-01 | document title (line 1) | (suite ID C19), v0.2 DRAFT (r2) | (suite ID C19), v0.1 (for signature; drafts r1-r3 superseded) |
| K-02 | header, Version row | **v0.2 DRAFT (r2)**, supersedes v0.1 DRAFT (r1, sha256 `7264d7a890570d7b2cf3b0d54631f3a453b43ecd543eab272e1bbb90a1e61aed`, not edited). Not signed. | **v0.1 (for signature; drafts r1-r3 superseded)**. It supersedes the drafts r1 (sha256 `7264d7a890570d7b2cf3b0d54631f3a453b43ecd543eab272e1bbb90a1e61aed`, not edited), r2 (sha256 `d600980db80e5f423f57c6ccb0066ea6afc468be6eb759aaf1690cfa893030cd`, not edited) and r3 (sha256 `2bbb5bbf6c64880bbd6f6f6cad8959fc46fe14c822dc978773219836ad2d96aa`, not edited). Not signed. |
| K-03 | header, Location row | `.claude/reports/atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1-DRAFT-r2.md`. It moves | `/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1.md`. It moves |
| K-04 | header, "How r2 was made" row | How r2 was made / r1 was read in full and left untouched. r2 was written as one integrated text (in four writes), with the change lists applied by requirement; the OLD/NEW check is section 22 (every change ID with the requirement IDs it touched). The r2 sha256 is given in Atlas's reply: a file cannot contain its own hash (C-67). | How the drafts were made / r1 was read in full and left untouched. r2 was retyped from r1 as one integrated text (in four writes), with the change lists applied by requirement. r3 was made from r2 by one `cp` and then edits only (Edit tool); r4, this file, was made from r3 the same way (one `cp`, then edits only). The OLD/NEW check is section 22 (every change ID with the requirement IDs it touched; r2 → r3 and r3 → r4 are exact strings). The sha256 of each draft is given in Atlas's reply: a file cannot contain its own hash (C-67). Atlas's hand check of the fixture relations is kept apart from this document, in `/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-v0.1-working-notes-NOT-FOR-FIXTURE-AUTHOR.md`, for Nadira and Adacs only and never for the fixture author. |
| K-05 | section 20, signature block | (rows: Author, DRAFT v0.2 (r2) written; Scientific reviewer; Product; Acceptance) | two rows added after the Author row: "DRAFT (r3) written (from r2, by edits)" and "v0.1 (r4, the signature copy) written (from r3, by edits); the working notes are held apart" |
| K-06 | section 21, change log | (rows: v0.1 DRAFT; v0.2 DRAFT (r2)) | two rows added: "v0.2 DRAFT (r3)" and "v0.1 (for signature; drafts r1-r3 superseded) (r4)" |
| K-07 | section 19, Q-AT-C19-12, answer cell | (zero flag and ">" message replaced by Nadira's wording, NAD-2026-11-24-13 and -23(c); "Maximum | (zero flag replaced by Nadira's wording, NAD-2026-11-24-13; ">" message replaced by Nadira's wording, NAD-2026-11-24-23(c), -26; "Maximum |
| K-08 | section 19, Q-AT-C19-34 | a Federal Register read of 91 FR 59988's amendatory text. | a Federal Register read of 91 FR 59988's amendatory text. Kaito: Q3 written-terms question put to A.B. in the T-0735 report; Theron's grep accepted (KAITO-2026-11-24-10). |
| K-09 | Sources of r2, first table | (after the SOLON row, no row) | two rows added: THR3 (Theron's r3 clearance, sha256 `64a4e4effc367cb2f9cbc63d400c1c50954b2eb85defe09e2ffddee651415a79`) and VERA3 (Vera's r3 confirmation, sha256 `b5f2ead19814eb110ccc8bc34d31b7a0a48a17f4117b9901b6747df4b925673c`) |
| K-10 | section 15, rule paragraph | Atlas's hand check of each relation is kept in the separate working notes in the last section, **to be removed from the document at signature and not handed to the fixture author** (Kaito: strip before hand-off). | Atlas's hand check of each relation is kept in a separate file, the working notes (`/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-v0.1-working-notes-NOT-FOR-FIXTURE-AUTHOR.md`), **for Nadira and Adacs only and never handed to the fixture author**. |
| F15-c | F-15, expected cell, part (c) (ELM-FL-04 quotation; for Nadira's final check) | plus "your reported floor differs from DF × λ = [y]". | plus "your reported floor differs from DF × λ = [y] EU/mL". |
| WN-1 | last section of r3, the heading "WORKING NOTES" with Atlas's hand check (r3 l.863-889) | the section is in this file | removed from this file; held in the separate working-notes file named in the header (K-04) and in section 15 (K-10). Its content is not repeated here. |

### r4 → r5 (Nadira N-01 to N-07, NAD-2026-11-24-39 to -48; Kaito's housekeeping, KAITO-2026-11-24-12)

OLD is the exact r4 string (D-0131) and NEW the exact r5 string (this file). Only the changed span of a cell is quoted, except where the whole cell is named. Only the live text was changed; the r2 → r3 and r3 → r4 tables above, with their OLD and NEW blocks, were not edited. No requirement, fixture, acceptance test or page string changed.

| Change | Place | OLD (r4) | NEW (r5) |
|---|---|---|---|
| N-01 | section 19, "Conflicts for Nadira" intro | (THR-2026-11-23-463); a clearance named here is still owed before the signature request. | (THR-2026-11-23-463). No clearance named here is still owed: Theron cleared the final strings (THR-2026-11-23-465 to -471) and Vera confirmed rows 4 and 7 (VERA3). |
| N-02 | section 19, Conflicts row 4, notes | Vera to confirm the GxP-word point. Cleared (THR-2026-11-23-469). | Vera confirmed the GxP-word point (VERA3). Cleared (THR-2026-11-23-469). |
| N-03 | section 19, Conflicts row 7, notes | Vera to confirm the three scope edits keep her GxP point. | Vera confirmed that the three scope edits keep her GxP point (VERA3). |
| N-04 | header, Drafted by row | Atlas, for T-0735 stage 1, r2 | Atlas, for T-0735 stage 1 (drafts r1 to r4; this file is r5, the next revision) |
| N-05 | header, Guard blocks row | None in this r2 run. | Per run, from Atlas's own run records: r1 none; r2 none; r3 none; r4 none; r5 (this run) none. |
| N-06 | Sources heading | ## Sources of r2 (what the changes rest on) | ## Sources of the changes, r2 onward (what the changes rest on) |
| N-07 | Sources, R1 row | Atlas v0.1 DRAFT (this file's predecessor) | Atlas v0.1 DRAFT (r1, the first draft) |
| K-11 | document title (line 1) | v0.1 (for signature; drafts r1-r3 superseded) | v0.1 (for signature; r5; drafts r1-r4 superseded; earlier labels 'v0.2 DRAFT' in r2/r3 were drafting labels only) |
| K-12 | header, Version row | **v0.1 (for signature; drafts r1-r3 superseded)**. It supersedes the drafts r1 (...), r2 (...) and r3 (sha256 `2bbb5bbf6c64880bbd6f6f6cad8959fc46fe14c822dc978773219836ad2d96aa`, not edited). | **v0.1 (for signature; r5; drafts r1-r4 superseded; earlier labels 'v0.2 DRAFT' in r2/r3 were drafting labels only)**. It supersedes the drafts r1 (...), r2 (...), r3 (sha256 `2bbb5bbf6c64880bbd6f6f6cad8959fc46fe14c822dc978773219836ad2d96aa`, not edited) and r4 (sha256 `3798d8957ce6c45a2dccb7d4a323a3a5060b0e0386cb9889457911f68eddc0c8`, registered as D-0131, not edited). |
| K-13 | header, Location row | `.../atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1.md` (full absolute path in r4) | `.../atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1-r5.md` (full absolute path in r5) |
| K-14 | header, "How the drafts were made" row | r4, this file, was made from r3 the same way (one `cp`, then edits only). The OLD/NEW check is section 22 (...; r2 → r3 and r3 → r4 are exact strings). | r4 (D-0131) was made from r3 the same way (one `cp`, then edits only); r5, this file, was made from r4 the same way (one `cp`, then edits only). The OLD/NEW check is section 22 (...; r2 → r3, r3 → r4 and r4 → r5 are exact strings). |
| K-15 | section 20, signature block, r4 Author row | v0.1 (r4, the signature copy) written (from r3, by edits); the working notes are held apart | v0.1 (r4, D-0131) written (from r3, by edits); the working notes are held apart |
| K-16 | section 20, signature block | (no r5 row) | row added: "Author / Atlas / v0.1 (r5, the signature copy) written (from r4, by edits; record-only changes N-01 to N-07 and Kaito's housekeeping)" |
| K-17 | section 20, status line | **DRAFT. Not signed. Requirement IDs are frozen only from a signature, and none exists.** | **For signature (supersedes D-0131 once approved). Not yet approved.** |
| K-18 | section 21, change log | (rows up to "(r4)") | one row added: "v0.1 (for signature; r5; drafts r1-r4 superseded) (r5)" |
| K-19 | section 22, this table | (no r4 → r5 table) | this table added |

---

VERDICT: INFO



