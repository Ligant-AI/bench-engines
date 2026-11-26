# E10R-AMD-2: amendment to the signed engine specification E10 (recipe scaling and activity conversion), one new function, E10R-F23 `volumeFill`

**Amends:** `.claude/reports/atlas/engine-spec-e10-scaling-activity-DRAFT-r3.1.md`, sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1` (signed, NAD-2026-11-14-287), as amended by E10R-AMD-1, `.claude/reports/atlas/engine-spec-e10-scaling-activity-AMD-1.md`, sha256 `4f835cea4bf305dd2c3bcf301ab9f8e6be3991c6ca62bcd60504a449d4e9a060` (NAD-2026-11-14-312). Neither file is edited.
**Authority:** Kaito's ruling KAITO-D183 (over-full detection by an exact comparison inside the engine; it replaces KAITO-D180), taken from the brief as stated to Atlas, its source file not read. Nadira's ruling NAD-2026-11-14-313 (D180 not admissible; the five constraints the mechanism must meet), in `.claude/reports/nadira/2026-11-15-t0640-c14-urs-review.md`, sha256 `c7ce8b0b00f70b88be5b9f64ae37da143a3d8e26f8a236844adf0c11c4d07077`, lines 54 to 63.
**Ticket:** T-0641.
**Opens:** URS open item OI-1.2-11 (the over-full mechanism). The C14 URS will cite E10R-F23 once AMD-2 is signed; it does not cite it now.
**Scope:** additive and within KAITO-D172's minor bump of the E10 module and the package (E10R-NF-05): no existing function, input, output, refusal or test changes. One new function, E10R-F23, and the rows that follow from it.
**Status:** unsigned. Placed beside the spec as a separate file. To be signed by Nadira by sha.

## 1. The change: one new function, inserted after E10R-F22 (r3.1 line 267), before section 7

One line of r3.1 is replaced: section 8, line 302 (section 4 below; ruled, Q-E10R-N21 (a), NAD-2026-11-14-331). Nothing else in r3.1 or AMD-1 is replaced. The function and its consequent rows are added as below.

## 2. The five constraints of NAD-2026-11-14-313, verbatim, and how E10R-F23 meets each

From the ruling, `.claude/reports/nadira/2026-11-15-t0640-c14-urs-review.md` lines 58 to 62, word for word:

> (1) The test is exact, made on the engine's exact values of the drawn volume lines and of the final volume.
> (2) It never uses display strings, rounded values, JS numbers or decimal text written from a result.
> (3) Only `exact` {num, den} objects may carry a computed value into the test, as F19 already takes them.
> (4) No difference, balance or total is shown, copied or exported.
> (5) It makes no F15 call.

| Constraint | How E10R-F23 meets it |
|---|---|
| (1) | The comparison is made inside the engine on integer `num` and `den` values, by cross-multiplication, with no rounding step (relation below) |
| (2) | The inputs are `exact` objects of integer strings. A JS number, a decimal text and a display string are each refused (E10R-RF-07). Nothing is rounded, and no decimal is written from a result |
| (3) | The `exact` {num, den} objects of the drawn volume lines and of the final volume are the only carriers of a computed value into the call. This is the same carrier E10R-F19 already takes |
| (4) | The result is a classification word (`"under"`, `"full"` or `"over"`) and the stated assumption `"additive volumes"`. The function returns no value, no `exact`, no unit, no difference, no balance and no total, so there is nothing for the page to show, copy or export |
| (5) | E10R-F23 is not E10R-F15 and makes no E10R-F15 call. It does not share E10R-F15's formula, inputs, refusals or result shape, and it computes no balance of any kind. It makes no E10R-F15 call, and the page, which also may not call E10R-F15 (NAD-2026-11-14-293 (e), -294), still does not |

## 3. The function

### E10R-F23 `volumeFill(lines, final)`

Name, result field and words ruled, Q-E10R-N17 (NAD-2026-11-14-328). The function is a classification and nothing more: it says whether the drawn volume lines, taken as additive, are under, exactly equal to, or over a stated final volume.

| Item | Specification |
|---|---|
| Purpose | Classify the sum of a list of volumes against a final volume, exactly, for the share bar of page 1.2 (KAITO-D183; NAD-2026-11-14-313). It answers one question: is the sum under, equal to, or over the final volume. It returns neither the sum nor the difference |
| Inputs | `lines`: an array of `{exact: {num, den}, unit}`, at least one element. `final`: `{exact: {num, den}, unit}`. Every `num` and `den` is a string of decimal digits (an integer string, as E10R-F19 takes the `exact` of a result). Every `unit` is a volume unit, and every line's `unit` is the same as `final.unit`: the caller expresses all the volumes in the final volume's unit before the call. The `exact` objects are those of engine results (or of an engine unit scaling of a typed value), passed as objects. No decimal text, no JS number and no display string is accepted in their place |
| Relation | Let the lines be n_i/d_i for i = 1..k and the final volume N/D. Let L = d_1 x d_2 x ... x d_k and S = sum over i of (n_i x (L / d_i)), an integer (each L / d_i is the product of the other denominators). The sum of the lines is S/L. Then compare S x D with N x L, integers, no division and no rounding: S x D < N x L gives `"under"`; S x D = N x L gives `"full"`; S x D > N x L gives `"over"`. All arithmetic is on arbitrary-precision integers. No unit factor enters, because every volume is in one unit |
| Result | `{status: "result", fill: "under" \| "full" \| "over", assumes: "additive volumes"}`, with the version fields of E10C-NF-05. No `value`, no `exact`, no `unit`. The `assumes` field is on every result, as on the other results that add volumes (E10R-OU-02; ruled, Q-E10R-N19, NAD-2026-11-14-330), and on no refusal |
| Refusals | Any null or absent value (the list, an element, `final`, or a member `exact`, `num`, `den` or `unit`), or an empty `lines`: `incomplete` (ruled, NAD-2026-11-14-334). An unknown unit: E10-RC-01 naming the field. A non-volume unit, or a line whose unit is not the unit of `final`: E10-RC-02 naming the unit fields as `lines[i].unit` or `final.unit` (ruled, Q-E10R-N18, NAD-2026-11-14-329). A `num` or `den` that is not an integer string, including a JS number, a decimal text (such as `"1.5"`), `"abc"` or a non-object element: CCS-RF-03 naming `lines[i]` or `final`. A `den` of zero: CCS-RF-03 naming `lines[i]` or `final`. A negative `num` or `den` (a leading minus sign): CCS-RF-03 naming `lines[i]` or `final`. A `final` whose `num` is zero, whatever its `den`: CCS-RF-03 naming `final` (a recipe has a final volume above zero; ruled, Q-E10R-N21 (b), NAD-2026-11-14-332). A line's `num` of zero is a result: a line of `0/1` counts as zero volume. Order of statuses as the conversions spec section 2 (incomplete, unknown unit, wrong dimension or mismatch, then all value conditions together); at most one `rejected` per call; an element failure names the field as `lines[i]`, zero-based |
| Boundary | The result is a classification and never a quantity. The engine does not hold, return or log the sum. A caller that wants to say "over by x" cannot get x from this function, by design (NAD-2026-11-14-313 (4)). The function makes no unit conversion; the caller converts through `toUnit` of the earlier calls (E10C-NF-02) |
| Serves | E10R-DT-11, E10R-RF-07, E10R-OU-04 |

## 4. Consequent rows (new IDs only; none of r3.1's rows is edited)

**New requirement rows (the next free numbers in each area of r3.1 section 7):**

| Area | ID | Requirement |
|---|---|---|
| Determination | E10R-DT-11 | `volumeFill` (E10R-F23): the classification of S x D against N x L by integer cross-multiplication, S/L the exact sum of the lines, N/D the exact final volume |
| Refusals | E10R-RF-07 | `volumeFill`: an empty list, a null or an absent value is `incomplete`; an unknown unit is E10-RC-01; a non-volume unit or a unit unlike the final's is E10-RC-02; a non-integer `num` or `den`, a zero `den`, a negative value, or a `final` of zero is CCS-RF-03; at most one `rejected` per call |
| Output | E10R-OU-04 | `volumeFill` returns `{status, fill, assumes}` only, `assumes` the string `"additive volumes"` as E10R-OU-02: never a value, `exact`, difference, balance or total |

**The one deliberate exception to E10R-NF-03 (ruled, Q-E10R-N20, NAD-2026-11-14-327; the new questions of section 6 are numbered Q-E10R-N17 to -N21, after r3.1's last, Q-E10R-N16):**

E10R-NF-03 says a value that has passed through a division is never re-entered, and terminating results may be passed on only as exact plain decimal text. E10R-IN-01 says every numeric input is plain decimal text. E10R-F23 takes the `exact` {num, den} objects of results, some of which have passed through a division (125/3 mL, 100/3 mL), as objects and not as decimal text. NAD-2026-11-14-313 (3) requires exactly this carrier. This is therefore a deliberate exception to E10R-NF-03 and to E10R-IN-01 for this one function, in the same way E10R-F19 already takes an `exact` object. It is not a general relaxation: every other function keeps the passing rule as signed, and F23 returns no value that could be re-entered. Ruled, Q-E10R-N20 (NAD-2026-11-14-327): the exception stands, for E10R-F23 only. Each `exact` object passed is the `exact` member of an engine result, unchanged; the page never builds, reduces or edits one, and never makes one from a display string or a JS number.

**New acceptance rows, continuing after AT-E10R-33:**

Every row compares the exact sum with the exact final volume as S x D against N x L (section 3). The working is shown for each. The lines and the final volume are in mL, and `final` is `{exact: {num: "100", den: "1"}, unit: "mL"}` unless stated.

| ID | Test | Expected |
|---|---|---|
| AT-E10R-34 | One line `{num: "150001", den: "1500"}` mL against the final volume 100/1 mL. Working: k = 1, L = 1500, S = 150001. S x D = 150001 x 1 = 150001. N x L = 100 x 1500 = 150000. 150001 > 150000 | `{status: "result", fill: "over", assumes: "additive volumes"}` (the F-11 case of the C14 URS: 100/3 + 100/3 + 16667/500 mL). A decimal-based test fails this: it differs by 1/1500 mL |
| AT-E10R-35 | The same total as three lines: `{num: "100", den: "3"}`, `{num: "100", den: "3"}`, `{num: "16667", den: "500"}` mL, against 100/1 mL. Working: L = 3 x 3 x 500 = 4500. S = 100 x (4500 / 3) + 100 x (4500 / 3) + 16667 x (4500 / 500) = 100 x 1500 + 100 x 1500 + 16667 x 9 = 150000 + 150000 + 150003 = 450003. S x D = 450003 x 1 = 450003. N x L = 100 x 4500 = 450000. 450003 > 450000. (Check: 450003 / 4500 = 150001 / 1500, since 450003 = 3 x 150001 and 4500 = 3 x 1500.) | `over` |
| AT-E10R-36 | One line `{num: "100", den: "1"}` mL against 100/1 mL. Working: L = 1, S = 100. S x D = 100 x 1 = 100. N x L = 100 x 1 = 100. Equal | `{status: "result", fill: "full", assumes: "additive volumes"}` |
| AT-E10R-37 | Three lines `{num: "100", den: "3"}` mL each, against 100/1 mL. Working: L = 27. S = 100 x 9 + 100 x 9 + 100 x 9 = 2700. S x D = 2700. N x L = 100 x 27 = 2700. Equal. (A test made on decimals rounded up, 33.334 x 3 = 100.002, would say over) | `full` |
| AT-E10R-38 | Two lines `{num: "125", den: "3"}` mL each, against 100/1 mL. Working: L = 9. S = 125 x 3 + 125 x 3 = 750. S x D = 750 x 1 = 750. N x L = 100 x 9 = 900. 750 < 900. (Check: 750 / 9 = 250 / 3 = 83.33... mL, less than 100 mL) | `{status: "result", fill: "under", assumes: "additive volumes"}` |
| AT-E10R-39 | Zero and unreduced values: (a) `0/1` against 100/1 mL: S x D = 0, N x L = 100, so `under`. (b) `0/1` and `100/1` against 100/1 mL: L = 1, S = 100, so `full` (a zero line adds nothing). (c) `200/2` against 100/1 mL: L = 2, S = 200, S x D = 200, N x L = 100 x 2 = 200, so `full` (unreduced forms compare by cross-multiplication) | `under`; `full`; `full` |
| AT-E10R-40 | No-quantity check: for the results of AT-E10R-34 to -39, the result object has exactly the keys `status`, `fill`, `assumes` (the string `"additive volumes"`) and the version fields. No `value`, `exact`, `unit`, `difference`, `balance`, `total` or `partsTotal` is present | Pass |
| AT-E10R-41 | Refusals, one row per class, each the only fault in its call, final `{num: "100", den: "1"}` mL unless stated: (a) `lines` as `[]`: `incomplete`. (b) `lines` null: `incomplete`. (c) `{num: "5", den: "0"}` as line 0: CCS-RF-03 `["lines[0]"]`. (d) `{num: "1.5", den: "2"}` as line 0 (non-integer): CCS-RF-03 `["lines[0]"]`. (e) a JS number 5 in place of line 0, and a decimal text `"5"` in place of line 0: CCS-RF-03 `["lines[0]"]`. (f) `{num: "-1", den: "2"}` as line 0 (negative): CCS-RF-03 `["lines[0]"]`; and `{num: "1", den: "-2"}`: CCS-RF-03 `["lines[0]"]`. (g) a final `{num: "100", den: "0"}`: CCS-RF-03 `["final"]`. (h) a negative final `{num: "-100", den: "1"}`: CCS-RF-03 `["final"]`. (i) unit mismatch: a line `{num: "50", den: "1"}` with unit `"L"` against a final in `"mL"`: E10-RC-02 `["lines[0].unit"]`. (j) a non-volume unit `"g"` on a line: E10-RC-02 `["lines[0].unit"]`. (k) an unknown unit `"ml"` on a line: E10-RC-01 `["lines[0].unit"]`. (l) several faults at once (line 0 `{num: "5", den: "0"}` and line 1 `{num: "-1", den: "2"}`): one `rejected`, `fields` in argument order, `["lines[0]", "lines[1]"]`. (m) a final `{num: "0", den: "1"}` with line 0 `{num: "0", den: "1"}`, and a final `{num: "0", den: "5"}` with line 0 `{num: "50", den: "1"}`: CCS-RF-03 `["final"]` each. (n) line 0 `{unit: "mL"}`, with no `exact` member: `incomplete` naming `lines[0]` | As stated; no `fill` and no `assumes` in any refusal |
| AT-E10R-42 | Regression: E10R-F15 and every other function unchanged by this amendment; the whole r3.1 test set and AT-E10R-19 (the make-up route makes no E10R-F15 call) pass | Pass; version fields only |

**Section 8, r3.1 line 302 (ruled, Q-E10R-N21 (a), NAD-2026-11-14-331).** The OLD string occurs exactly once in r3.1, in line 302. It is replaced by the NEW text.

**OLD:**

Engine: E10R-F13 to E10R-F16 and E10R-F18 to E10R-F22 with `toUnit`, the -623 modes, w/w, the additive balance, the activity relations and the declared-rounding display function.

**NEW:**

Engine: E10R-F13 to E10R-F16 and E10R-F18 to E10R-F22 with `toUnit`, the -623 modes, w/w, the additive balance, the activity relations and the declared-rounding display function; and E10R-F23 (E10R-AMD-2), which classifies the drawn volume lines against a final volume, exactly, as under, full or over, takes no `toUnit` and returns no quantity.

## 5. What this amendment does not do

- It does not change E10R-F15 (`balanceVolume`), its purpose, its refusals, its rows or AT-E10R-19. E10R-F23 is not E10R-F15 and makes no E10R-F15 call.
- It does not edit r3.1 or AMD-1, except the one line of r3.1 section 8 (line 302) given in section 4. The register of section 9, the examples of section 10 and the traceability line are not edited.
- It adds no refusal code to the series (E10-RC-04 stays reserved) and uses the codes of r3.1. It adds no unit, no constant, no dependency and no reference data (E10R-NF-04, -NF-08).
- It makes no scientific ruling. Every choice marked as a proposal is a question to Nadira in section 6.

## 6. Open questions

All addressed to Nadira (NADIRA, science), by requirement ID. All are ruled in `.claude/reports/nadira/2026-11-15-t0640-c14-urs-r2-and-amd2.md`: Q-E10R-N17 NAD-2026-11-14-328, Q-E10R-N18 -329, Q-E10R-N19 -330, Q-E10R-N20 -327, Q-E10R-N21 (a) -331, (b) -332, (c) -333. The answers to N17 to N21 (b) are written into sections 3 and 4; N21 (c) is answered in the C14 URS amendment MBP-AMD-1.

| ID | Question | Requirement |
|---|---|---|
| Q-E10R-N17 | Is the function name `volumeFill`, and the result field name `fill` with the three words `"under"`, `"full"` and `"over"`, acceptable? They are Atlas's proposal. Her word on any alternative replaces them | E10R-F23, E10R-OU-04 |
| Q-E10R-N18 | A line whose unit differs from the final's (for example `"L"` against `"mL"`) is, in the engine's table, a volume unit of the right dimension. Atlas reuses E10-RC-02 (the "unit does not fit" code) for it and adds no new code. Does she accept E10-RC-02 for a unit mismatch, or does she want a new code in the series at E10-RC-05 (E10-RC-04 is reserved)? | E10R-RF-07, AT-E10R-41 (i) |
| Q-E10R-N19 | Should the result carry `assumes: "additive volumes"`? E10R-OU-02 requires it on F15 and on F16 modes 2 and 3 results, which add volumes. F23 also adds volumes but returns a classification only. Atlas has marked it as proposed and has not decided | E10R-OU-02, E10R-OU-04, E10R-F23 |
| Q-E10R-N20 | The NF-03 exception: does she rule that E10R-F23 may take `exact` {num, den} objects of results that have passed through a division, as objects, as the one deliberate exception to E10R-NF-03 and to E10R-IN-01 (plain decimal text), for this function only, as NAD-2026-11-14-313 (3) requires? Is any wording of the exception to be changed in section 4? | E10R-NF-03, E10R-IN-01, E10R-F23 |
| Q-E10R-N21 | Two consequential points of r3.1 are not edited here. (a) Section 8 (line 302) lists the engine functions as E10R-F13 to E10R-F16 and E10R-F18 to E10R-F22. Is it enough that this amendment adds E10R-F23, or does she want that line amended? (b) A final volume of zero (`final` of `0/1`) is not on the closed refusal list of KAITO-D183, so the function as written compares it like any value (every line of `0/1` gives `full`, any positive line gives `over`). Does she want it refused, or left as a result? And where does the page get the `exact` object of the typed final volume (for example through E10C-F03 with its own unit, which divides nothing)? | E10R-F23, E10R-RF-07, section 8 (r3.1 line 302) |

VERDICT: INFO
