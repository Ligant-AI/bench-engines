# E10R-AMD-3: amendment to the signed engine specification E10 (recipe scaling and activity conversion), r3.1 silences on `missing` names, absent values and a non-object `SA`; the unit-field rule; the status line of r3.1

**Amends:** `engine-spec-e10-scaling-activity.md` (r3.1), sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1` (signed, NAD-2026-11-14-287), as corrected by its errata `engine-spec-e10-scaling-activity-errata.md`, sha256 `744f86e741e9da1c1880a979f1e7d5502a88bd6a9368836173100ded8b7c66e7`, and as amended by E10R-AMD-1 (`engine-spec-e10-scaling-activity-AMD-1.md`, sha256 `4f835cea4bf305dd2c3bcf301ab9f8e6be3991c6ca62bcd60504a449d4e9a060`) and E10R-AMD-2 (`engine-spec-e10-scaling-activity-AMD-2-r2.md`, sha256 `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`), each with its errata. All six files are read at bench-engines commit `32ac05506d67bb323fb3e7774d569b0572e18022`. None of them is edited. Line numbers below are r3.1 lines at that commit.
**Authority:** Nadira's rulings NAD-2026-11-14-349, -350, -352 (a), -353 and -357, in `.claude/reports/nadira/2026-11-15-t0641-round-3-rulings.md`, sha256 `4d73cb16f4e9c432e52b247e0a75cfdd11e36fbe3d48b93120695308ef27a1c6` (hashed before reading). -357 fixes the scope: exactly items (1) to (5) below, nothing else. The rule text of items (1) to (3) is hers, taken from the ruling lines cited at each item. The anchor of item (2), the sentence of item (4) and the NEW text of item (5) are ruled in NAD-2026-11-14-358 to -360, in `.claude/reports/nadira/2026-11-15-t0649-amd3-signature.md`; the sentence of item (4) is her text.
**Ticket:** T-0649, under T-0477 and T-0641.
**Scope:** additive. It adds a name, a reading and a status to r3.1's silences. It changes no function, input, output, requirement ID, refusal code, acceptance row, value or unit. It adds no requirement row, no acceptance row and no fixture value: the rows that Nadira holds for this amendment (-350, -352 (a), -353) are written by the fixture author once it is placed.
**Status:** unsigned. Placed beside the spec as a separate file. To be signed by Nadira by sha.

## 1. Item (1): E10R-F15 `missing` for an empty, null or absent `parts` (NAD-2026-11-14-350)

**Adds to r3.1 line 196** (E10R-F15 `balanceVolume`, Refusals row, first sentence "Any null, or an empty `parts`: `incomplete`."). Nothing in line 196 is replaced. The following is added after that sentence:

> The `incomplete` result's `missing` member names the argument itself, `parts`, when `parts` is empty, null or left out, in argument order with any other missing argument. An empty list has no element, so it is never named `parts[0]`. A part that is null or left out, or that has a null or absent member, is named `parts[i]`, `i` zero-based (Q-E10R-A4, line 459).

This is the same rule NAD-2026-11-14-340 gives `lines` in E10R-F23 (AMD2-E-3, AMD2-E-4), applied to `parts`.

## 2. Item (2): an absent value is read as null across E10R (NAD-2026-11-14-352 (a))

**Adds to r3.1 line 161** (section 6, the statement for every function, whose opening clause is "Every function: `incomplete` on a null required input"; anchor ruled, Q-E10R-N22, NAD-2026-11-14-358). Nothing in line 161 is replaced. The following is added to line 161 and read with that clause:

> Across E10R, a required argument, array element or object member that is left out is not declared, exactly as `null` is. It gives `incomplete` with the same name the null case gives (`SA`, `SA.value`, `SA.unit`, `SA.lower`, `SA.lower.value`, and so on; `parts[i]`; or the argument). A result must not depend on whether the caller wrote "nothing" as `null` or left it out. "Required" means required by the declared `form`: a member that the `form` does not use (for example `relation` in a single SA) is not missing when it is absent.

**Where it reads.** Every place r3.1 says "null" for a required input is read with this sentence, so that "null" there means "null or left out". Those places are line 161 itself; the Refusals rows of lines 170 (E10R-F13), 182 (E10R-F14), 196 (E10R-F15), 208 (E10R-F16), 220 (E10R-F18), 232 (E10R-F19), 243 (E10R-F20, `SA` and `SA.<member>`), 254 (E10R-F21, as F20) and 266 (E10R-F22); the row of line 292 (E10R-RF-06, "no SA is `incomplete`"); and acceptance rows AT-E10R-11 (line 406, "Null plus a bad value") and AT-E10R-27 (line 421, "`SA` null; a member null"). Reading those two acceptance rows this way changes neither their text nor their expected outcome, and adds no acceptance row. Where r3.1 says `null` of an output (a bounded result's `lower` or `upper`, as in lines 242, 253 and 295), that is not a required input, and this item does not touch it. E10R-F23 already treats an absent value as null (AMD-2-r2 line 44, ruled NAD-2026-11-14-334); this item makes no change to it.

## 3. Item (3): a present `SA` that is not an object (NAD-2026-11-14-353)

**Adds to r3.1 line 243** (E10R-F20 `activityToMass`, Refusals row), and by "as E10R-F20" to line 254 (E10R-F21 `massToActivity`). Nothing in either line is replaced. The following is added after "A specific activity <= 0 or non-numeric: CCS-RF-03 (`["SA.value"]`, `["SA.lower"]` or `["SA.upper"]`).":

> A present `SA` that is not an object (text, a number, an array) is a malformed value: CCS-RF-03 `["SA"]`. It is evaluated at the value step of the order of statuses, with `SA.value` <= 0 or non-numeric, after any `incomplete` and after any unit or closed-string refusal. It is not E10-RC-01, because there is no unknown unit or string to name, and it is not `incomplete`, because something was declared.

Basis, as ruled: E10R-IN-01 (line 114, "A specific activity ... is an object") and the conversions spec section 2, step (3), which holds the value conditions.

## 4. Item (4): the unit-field rule, as one sentence for readers (NAD-2026-11-14-349)

**Adds to r3.1 Q-E10R-A5 (line 460) and to E10R-RF-02 (line 288) as a reading aid.** It changes no signed row: each case already reads from signed text (A5 line 460, AT-E10R-26 line 420, AT-E10R-41 (i) of AMD-2-r2, conversions erratum-1 row 5). The sentence is for readers. It is Nadira's text (Q-E10R-N23, NAD-2026-11-14-359), which replaces Atlas's draft compression:

> An E10-RC-02 refusal lists the unit fields it names in argument order, with every fault in the call collected: (a) a unit that is wrong for its own role (no other argument could make it right) is named alone, and if it is an input unit, units judged against it are not compared with it and are not named for that reason; (b) a unit field that must fit another field (a `toUnit` that must be of the dimension of `unit`, a `toUnit` that must be of the dimension the pairing implies, or a line unit that must be the unit of `final`) is named alone when it does not fit, and the field it is judged against is not; (c) a single fault names more than one field in three cases only: when a unit of the IU family meets a unit of the U family, every unit field in that meeting is named, whichever arguments carry them and whether or not one is judged against the other; when two input units listed as a pair, neither judged by the other, do not match (E10R-F14 `nUnit` with `cUnit`; the activity unit with `SA.unit` in E10R-F20 and E10R-F21), both are named; and when `scaleUnit` crosses dimensions, both are named, as conversions erratum-1 row 5 states; (a) and (b) judge only the kind of quantity a unit measures (mass, volume, amount, copies, mass concentration, molar concentration, activity amount, activity concentration, specific activity) and ignore family, while the IU-meets-U case compares family only between units that are each the right kind for their place, so a unit already named under (a) or (b) is not compared for family (NAD-2026-11-14-349).

No fixture row waits for this item (NAD-2026-11-14-357).

## 5. Item (5): correction of r3.1 line 3, the Status line (NAD-2026-11-14-357 (5))

Line 3 of r3.1 still reads "Unsigned". That is wrong since NAD-2026-11-14-287, which signs r3.1 by sha. The OLD string occurs exactly once in r3.1, in line 3 (the string "Unsigned" occurs nowhere else in the file). It is replaced by the NEW text; the rest of line 3 is not changed.

**OLD:**

```
r3.1 for Nadira. Unsigned. Requirement IDs freeze when she signs.
```

**NEW:**

```
r3.1, signed by Nadira, NAD-2026-11-14-287, sha256 6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1. Requirement IDs are frozen.
```

No fixture row waits for this item.

## 6. What this amendment does not do

- It carries no item beyond (1) to (5). It makes no ruling and adds no rule or value that Nadira's text does not give.
- It does not change r3.1's closed errata set (NAD-2026-11-14-286 (ii)), AMD-1 or AMD-2-r2, or their errata.
- It adds no requirement ID, acceptance row, refusal code, unit, constant, dependency or reference datum.

## 7. Open questions

All addressed to Nadira (NADIRA, science), by item. All are ruled in `.claude/reports/nadira/2026-11-15-t0649-amd3-signature.md`: Q-E10R-N22 NAD-2026-11-14-358 (the anchor is line 161, not line 291 or line 114), Q-E10R-N23 -359 (not faithful as drafted; her sentence in item (4) replaces it), Q-E10R-N24 -360 (the NEW text of item (5) is accepted).

| ID | Question | Item |
|---|---|---|
| Q-E10R-N22 | Item (2): is placing the added sentence at line 291 (E10R-RF-05), with the list of "null" rows in its "Where it reads" paragraph, the placement she wants, or does she want the sentence on E10R-IN-01 (line 114)? The rule text is hers; only the anchor is Atlas's | (2) |
| Q-E10R-N23 | Item (4): is the single sentence a faithful compression of -349 (a) to (c) and its precedence sentence? It is the only item whose wording is Atlas's compression rather than her sentence | (4) |
| Q-E10R-N24 | Item (5): the NEW text of line 3 states the signature, the ID and the sha, and "Requirement IDs are frozen." Is that wording acceptable? Her ruling gives the fault, not the replacement | (5) |

VERDICT: INFO
