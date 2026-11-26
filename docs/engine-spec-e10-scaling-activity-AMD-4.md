# E10R-AMD-4: amendment to the signed engine specification E10 (recipe scaling and activity conversion), r3.1 line 352 (Example 14), the `fields` of E10R-F13 IU to U

**Amends:** `engine-spec-e10-scaling-activity.md` (r3.1), sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1` (signed, NAD-2026-11-14-287), as corrected by its errata `engine-spec-e10-scaling-activity-errata.md`, and as amended by E10R-AMD-1 (`engine-spec-e10-scaling-activity-AMD-1.md`, sha256 `4f835cea4bf305dd2c3bcf301ab9f8e6be3991c6ca62bcd60504a449d4e9a060`), E10R-AMD-2 (`engine-spec-e10-scaling-activity-AMD-2-r2.md`, sha256 `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`) and E10R-AMD-3 (`engine-spec-e10-scaling-activity-AMD-3.md`, sha256 `bebae6ef93e9d26fc837b8ee67b9548c819e19b080a8182ab9a55d472775e175`), each with its errata. All are read at bench-engines commit `8d5b277` ("[T-0649] place signed E10R-AMD-3 and its errata"). None of them is edited. The line number below is the r3.1 line at that commit.
**Authority:** Nadira's ruling NAD-2026-11-14-365, in `.claude/reports/nadira/2026-11-15-t0650-f13-iu-ml-point.md`, sha256 `6e52e61adde94c1c2b2bb3f3e6f9ec51b101a637ba061e11a642560323f5dbda` (hashed before reading). The OLD and NEW strings below are hers, carried byte for byte from that record.
**Ticket:** T-0654, under T-0650.
**Scope:** exactly one string replaced, in r3.1 line 352 (Example 14), the last sentence of the line. It changes no function, input, output, requirement ID, refusal code, acceptance row, value or unit. It adds no requirement row, no acceptance row and no fixture value. The rows that Nadira holds for this call (the `fields` of F13 IU to U and U to IU, and AT-E10R-26 "F13 IU to U") are written by the fixture author once this amendment is placed (NAD-2026-11-14-365, follow-ups for Adacs).
**Status:** unsigned. Placed beside the spec as a separate file. To be signed by Nadira by sha.

## 1. The correction of r3.1 line 352 (NAD-2026-11-14-365)

**The fault.** Signed r3.1 line 352 (Example 14) gives `scaleToVolume("100", "IU", "100", "mL", "250", "mL", "U")` as E10-RC-02 `["toUnit"]`. E10R-AMD-3 item (4) (the unit-field rule, NAD-2026-11-14-349, sentence (c)) says that when a unit of the IU family meets a unit of the U family, every unit field in that meeting is named. For this call that is `["unit","toUnit"]`. No amendment replaced line 352, so under the reading order the placed set contradicted itself on this one call. Nadira rules that both fields is the right side: IU and U are each the right kind for E10R-F13 (activity amounts, line 168), the fault is the meeting of the two scales, and every other signed cross-family case names every unit in the meeting (for example Example 26, line 388, `["cUnit","toUnit"]`).

**The OLD string occurs exactly once in r3.1**, in line 352, the last sentence of the line. Checked at bench-engines `8d5b277` with `git grep -n -F` of the full OLD string on `docs/engine-spec-e10-scaling-activity.md`: one match, at line 352 (the same file with `git grep -c -F` of the tail `is E10-RC-02 ` followed by `["toUnit"]` and a full stop also returns 1). The OLD string is replaced by the NEW string; the rest of line 352 is not changed.

**OLD:**

```
`scaleToVolume("100", "IU", "100", "mL", "250", "mL", "U")` is E10-RC-02 `["toUnit"]`.
```

**NEW:**

```
`scaleToVolume("100", "IU", "100", "mL", "250", "mL", "U")` is E10-RC-02 `["unit","toUnit"]`: IU meets U, so both unit fields are named (NAD-2026-11-14-349; E10R-AMD-3 item (4)).
```

## 2. Reading notes

- **E10R-AMD-3 line 35.** AMD-3 item (4) says "It changes no signed row: each case already reads from signed text". For E10R-F13 IU to U that claim was false while line 352 read `["toUnit"]` (NAD-2026-11-14-365, "My error"). With this amendment placed it is true for that case. AMD-3 is not edited.
- **U to IU.** Nadira confirms that `scaleToVolume(..., "U", ..., "IU")` gives the same refusal as IU to U, E10-RC-02 `["unit","toUnit"]`, with no message, by E10R-AMD-3 item (4) (c), "whichever arguments carry them". No signed row names this direction and this amendment adds none; the engine tests and the fixture author add the case.
- **Other rows.** AT-E10R-26 (line 420) reads "F13 IU to U ... E10-RC-02 naming the unit fields in argument order"; with this amendment that reads `["unit","toUnit"]`. Its text is not changed.

## 3. What this amendment does not do

- It carries no change beyond the one string of section 1. It makes no ruling and adds no rule or value that Nadira's text does not give.
- It does not change r3.1's closed errata set (NAD-2026-11-14-286 (ii)), AMD-1, AMD-2-r2 or AMD-3, or their errata. It is not an erratum; it is an amendment, as Nadira rules.
- It does not change the two sub-cases of NAD-2026-11-14-364 (`IU/mL` as `unit`) or the message ruling of -366; both rest on placed text and are unaffected.
- It adds no requirement ID, acceptance row, refusal code, unit, constant, dependency or reference datum.

## 4. Open questions

None. The OLD and NEW strings are Nadira's, verbatim, and the OLD string is confirmed to occur once at `8d5b277`. The reading order is closed at four documents in the AMD-3 errata; the companion file `engine-spec-e10-scaling-activity-AMD-4-errata.md` extends it to five (KAITO-D200 pattern).

VERDICT: INFO
