# URS Amendment 1 to Endotoxin Limit and Maximum Valid Dilution (suite ID C19), v0.1 r5: for signature

| Field | Value |
|---|---|
| Amends | D-0132: `.claude/reports/atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1-r5.md`, sha256 `15099b7907d2d1f1a91cdfa9819508a71f91d33954d18fec099a5cdb818aeb1d`. D-0132 is signed and is not edited. This amendment is a separate file and is read with r5. |
| Route | KAITO-2026-11-24-28 (separate URS amendment; D-0132 stays byte-identical); no objection, NAD-2026-11-24-77. |
| Task | T-0735 |
| Status | For signature. Amendment row IDs (`ELM-AMD-1-nn`) are frozen only on signature. |
| Drafted by | Atlas. No scientific question was resolved and no product decision was made. Every NEW text below is the text ruled in, or cleared under, the IDs cited in its row. |
| Signer | A.B. (this route for D-0132). |
| Receives this amendment, with r5 | the page builder, the page fixture author, the clean room and Adacs. |
| Effect | Each row below replaces or adds the text named, at the place named, and nothing else in r5 changes. Where a row replaces text, the OLD text is the exact text of r5. |
| Location | `/Users/moszart/Private-Developement/Ligant-Projects/benchtools-OS/.claude/reports/atlas/URS-C19-Endotoxin-Limit-and-MVD-v0.1-AMD-1-r2.md`. It moves to the tool's `docs/` only after signature. |

Research use only. Not qualified for GxP decision-making.

## Amendment rows

### Section 6, refusal sentences (additions)

Place for rows 01 to 03: section 6 (Requirements: refusals and incomplete states, RF), as new rows of its table after ELM-RF-09. Columns: ID, State, Words, Basis. The ELM-RF IDs of r5 are unchanged. The state names are those of the ruling.

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-01 | Section 6, new row after ELM-RF-09 | (none: new row) | State: `low-above-high`: in a declared recovery range, the suitability one (ELM-SU-03) or the I/E one (ELM-IE-03), both ends are plain decimal text and the low end is above the high end. Low equal to high is accepted; a negative end is accepted. Words: **"The low end of the range must not be above the high end."** The refused block shows no figure; in the main flow the calculated values stay and the comparison is withheld with the "suitability values incomplete: [fields]" reason of ELM-FL-02, naming the refused fields. | NAD-2026-11-24-65 (sentence); NAD-2026-11-24-57 (state: the low end of a range is above the high end; low equal to high is accepted). Cleared by Theron, THR-2026-11-23-485; NAD-2026-11-24-82. |
| ELM-AMD-1-02 | Section 6, new row after ELM-RF-09 | (none: new row) | State: `outside-zero-to-one`: the declared \|r\| criterion (ELM-IE-04) is below 0 or above 1. 0 and 1 are accepted. The criterion is judged only when r is entered for at least one curve. Words: **"The \|r\| criterion must be from 0 to 1."** (the backslashes are Markdown table escapes, not text) | NAD-2026-11-24-65 (sentence); NAD-2026-11-24-57 (state: an \|r\| criterion below 0 or above 1; 0 and 1 included). THR-2026-11-23-485; NAD-2026-11-24-82. |
| ELM-AMD-1-03 | Section 6, new row after ELM-RF-09 | (none: new row) | State: `outside-minus-one-to-one`: an r entered for a curve (ELM-IE-02, ELM-IE-04) is below -1 or above 1. -1 and 1 are accepted. Words: **"r must be from -1 to 1."** (the minus sign is U+002D) | NAD-2026-11-24-65 (sentence); NAD-2026-11-24-57 (state: an r below -1 or above 1; -1 and 1 included). THR-2026-11-23-485; NAD-2026-11-24-82. |

### ELM-RF-03

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-11 | Section 6, ELM-RF-03, State cell | `A negative result` | `A negative result, or a negative sample CV, spike CV, CV maximum, spiked-sample reading B or unspiked-sample reading A. Zero is accepted in each. A computed recovery below zero and a negative I/E spike recovery are accepted` (the Words cell is unchanged) | NAD-2026-11-24-56, -57, -82; THR-2026-11-23-485 (reuse of the template) |

### ELM-FL-05, the date note

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-04 | Section 5, ELM-FL-05, Requirement cell, end of the cell | `Whether a result from an expired lot is usable is the lab procedure's decision.` | `Whether a result from an expired lot is usable is the lab procedure's decision.` followed by: **Date note.** When the test date, the reagent expiry date or the instrument calibration due date (ELM-IN-12) holds text that is not exactly a calendar date written `YYYY-MM-DD` (four, two and two digits, year 0001 to 9999, a date that exists, no space before or after), the note **"Enter the date as YYYY-MM-DD."** shows beside that date, on screen, in the print and in every export, with the date as typed. A flag that uses that date is not shown; the other flag is not affected; nothing is refused or withheld. An empty field, or one holding only spaces, is "not entered" and shows no note. | NAD-2026-11-24-65 (sentence); NAD-2026-11-24-64 (rule); NAD-2026-11-24-84 (place, exports). Cleared by Theron, THR-2026-11-23-485 (sentence). |

### Fixture F-30, inputs cell

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-05 | Section 15, row F-30, Inputs cell | `limit 2.5 EU/mL, λ = 0.01; DF 5, 25, 100, 250, 500 with recoveries 40, 50, 110, 200, 90; range 50-200` | `limit 2.5 EU/mL, λ = 0.01; DF 5, 25, 100, 250, 500 with recoveries 40, 50, 110, 200, 90; range 50-200; entered on the page as two curves with the same λ: the first four dilutions in curve 1, the fifth in curve 2; r, lot, expiry and highest standard not entered in either curve` | NAD-2026-11-24-65 (separate item, correction to F-30); NAD-2026-11-24-83. The Expected cell of F-30 is not changed. |

### ELM-IE-02

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-10 | Section 8, ELM-IE-02, Requirement cell | `and an optional correlation coefficient r.` | `and an optional correlation coefficient r. λ is compelled for every curve. Lot, expiry, highest standard and reagent are record fields in this screen: each may be left empty ("not entered" in the print and exports; for the reagent, "reagent type: not selected"), and they enter no calculation and no check, so ELM-RF-05 and the date flags do not run in this screen.` | NAD-2026-11-24-61, -83 |

### ELM-IE-08, the print line

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-06 | Section 8, ELM-IE-08, Requirement cell, end of the cell | `The line is a fact, not a judgment.` | `The line is a fact, not a judgment. "[DF values]" prints each value's exact decimal, separated by a comma and a space. Each different value prints once, in ascending order, in plain digits with no trailing zeros after the decimal point and never in the × 10^n form. In this line only, this replaces the typed echo of ELM-DP-01.` (the line's own words are unchanged) | NAD-2026-11-24-77 (V-16); NAD-2026-11-24-60, -78 |
| ELM-AMD-1-09 | Section 8, ELM-IE-08, Requirement cell | `"Lie between" is by DF order, among the dilutions entered.` | `Each curve has its own listing (ELM-IE-07) and its own line. "Lie between" is by DF order, among the dilutions entered in that curve: a dilution that is not listed, whose exact value is above the smallest and below the largest listed DF of that curve and equal to no listed DF of that curve. If no dilution lies between, the line does not print.` | NAD-2026-11-24-60, -80 |

### ELM-UN-05

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-07 | Section 4, ELM-UN-05, Requirement cell | `MVD, DF and the raw-reading ratio are dimensionless; the page says so.` | `MVD and DF are dimensionless; the page says so.` | NAD-2026-11-24-77 and NAD-2026-11-24-81 (the raw reading is in EU/mL and no raw-reading ratio is an output) |

### AT-ELM-14

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-08 | Section 16, AT-ELM-14, Test cell, end of the cell | `the two quoted in ELM-FL-12 appears (THR-458 as corrected by THR-461)` | `the two quoted in ELM-FL-12 appears (THR-458 as corrected by THR-461). AT-ELM-14 also runs form (A) of section 8 of the signed engine spec (E20) in force at acceptance, full term list, on every CSV header and JSON key that the page derives from the module's names. Adacs runs this check at acceptance; it is not a fixture.` | THR-2026-11-23-484 (follow-up); NAD-2026-11-24-85; KAITO-2026-11-24-34 |

### Acceptance tests

| ID | Place in r5 | OLD | NEW | Source ruling |
|---|---|---|---|---|
| ELM-AMD-1-12 | Section 16, AT-ELM-09, Test cell; and Requirements cell of the same row | Test cell: `F-18: impossible-value refusals; plain decimal rule`. Requirements cell: `RF-01 to -08, IN-13` | Test cell: `F-18: impossible-value refusals; plain decimal rule; the states of ELM-AMD-1-01 to -03 and ELM-AMD-1-11, each with its sentence, and no refusal at a value the row accepts; the date note of ELM-FL-05 as amended (ELM-AMD-1-04)`. Requirements cell: `RF-01 to -08, IN-13, FL-05, ELM-AMD-1-01 to -04, -11` | NAD-2026-11-24-86 |
| ELM-AMD-1-13 | Section 16, AT-ELM-15, Test cell | `including the strings of NAD-2026-11-24-12, -13, -18 and -23` | `including the strings of NAD-2026-11-24-12, -13, -18, -23 and -65` | NAD-2026-11-24-86 |

## Rows in this amendment

ELM-AMD-1-01 to ELM-AMD-1-13. No other change to r5 is made by this amendment.

## Signature

| Role | Name | Status |
|---|---|---|
| Signer | A.B. (this route for D-0132) | not signed |
