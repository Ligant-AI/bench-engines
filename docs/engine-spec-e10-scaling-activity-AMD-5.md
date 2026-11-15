# E10R-AMD-5: amendment to the signed engine specification E10 (recipe scaling and activity conversion), additions to AMD-2-r2 line 44 (E10R-F23) and r3.1 line 196 (E10R-F15), and a reading aid for r3.1 line 129

**Amends:** `engine-spec-e10-scaling-activity.md` (r3.1), sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1` (signed, NAD-2026-11-14-287), as corrected by its errata `engine-spec-e10-scaling-activity-errata.md`, and as amended by E10R-AMD-1 (`engine-spec-e10-scaling-activity-AMD-1.md`, sha256 `4f835cea4bf305dd2c3bcf301ab9f8e6be3991c6ca62bcd60504a449d4e9a060`), E10R-AMD-2 (`engine-spec-e10-scaling-activity-AMD-2-r2.md`, sha256 `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`), E10R-AMD-3 (`engine-spec-e10-scaling-activity-AMD-3.md`, sha256 `bebae6ef93e9d26fc837b8ee67b9548c819e19b080a8182ab9a55d472775e175`) and E10R-AMD-4 (`engine-spec-e10-scaling-activity-AMD-4.md`, sha256 `5e1d04cf96e2a8ff118fd3ada924db3b4b0c1fb0ffd871a0dd398a01a4378238`), each with its errata. All are read at bench-engines commit `276c8fb` ("[T-0654] place signed E10R-AMD-4 and its errata (NAD-2026-11-14-367, -368)"). None of them is edited. The line numbers below are the line numbers of the placed files at that commit.
**Authority:** Nadira's ruling NAD-2026-11-14-376, in `.claude/reports/nadira/2026-11-15-t0651-set-b-gaps-rc03.md`. The text of items (1), (2) and (3) below is hers, carried character for character from that record. It carries the substance of her rulings NAD-2026-11-14-373, -374 and -371.
**Ticket:** T-0656, under T-0651 and T-0477.
**Scope:** exactly three items, each an addition or a reading aid. Nothing in any placed line is replaced. It changes no function, input, output, requirement ID, refusal code, acceptance row, value or unit, and adds no fixture value.
**Status:** unsigned. Placed beside the spec as a separate file. To be signed by Nadira by sha.

## 1. Item (1). Adds to AMD-2-r2 line 44 (E10R-F23 Refusals row)

The text is added after "an element failure names the field as `lines[i]`, zero-based". Nothing in line 44 is replaced. The added text:

> A present value of the wrong form is a malformed value, not a missing one: a `lines` that is not an array (an object, text, a number); a `final`, or an element of `lines`, that is not an object (text, a number, an array); and an `exact` member of a line or of `final` that is not an object (text, including decimal text such as `"5"` and a display string, a number, an array). Here an array is not an object. Each is CCS-RF-03, naming `lines` for the list, `lines[i]` for an element or its `exact`, and `final` for `final` or its `exact`. The members of a value that is not an object are not read as absent, so none of these is `incomplete`; blank text (empty or whitespace-only) in any of these places is still `incomplete` at step (1), with the same name (NAD-2026-11-14-351). Each is evaluated at the value step of the order of statuses, after any `incomplete` and any unit refusal, and is collected in argument order with the other value faults of the call (for example `["lines","final"]`). When `lines` is not an array there are no line units, and the unit step checks `final.unit` alone (NAD-2026-11-14-373, -374).

## 2. Item (2). Adds to r3.1 line 196 (E10R-F15 Refusals row)

The text is added after the sentence AMD-3 item (1) added. Nothing in line 196 is replaced. The added text:

> A present `parts` that is not an array (an object, text, a number) is a malformed value: CCS-RF-03 `["parts"]`, at the value step, collected in argument order with the other value faults of the call. It is not `incomplete`, because something was declared; blank text in its place is `incomplete`, `missing` `["parts"]` (NAD-2026-11-14-350, -351, -376).

## 3. Item (3). Reading aid for r3.1 line 129

It changes no signed row. The text:

> The E10-RC-03 message of r3.1 line 129 is the exact string `the parts add up to more than the total`, lowercase, with no closing full stop and no quotation marks, the form of the other engine messages (r3.1 line 243; conversions spec line 40) (NAD-2026-11-14-371).

## 4. What this amendment does not do

- It carries no text beyond items (1), (2) and (3). It makes no ruling and adds no rule or value that Nadira's text does not give.
- It does not change r3.1's closed errata set, AMD-1, AMD-2-r2, AMD-3 or AMD-4, or their errata.
- It adds no requirement ID, acceptance row, refusal code, unit, constant, dependency or reference datum.

## 5. Open questions

None for Nadira. For the signature: the three added texts are to be word-checked against NAD-2026-11-14-376 before signing (her step, as the record states).

VERDICT: INFO
