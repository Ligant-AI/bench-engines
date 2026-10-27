SIGNED: NAD-2026-10-27-42, 2026-10-27, Nadira (CSO). In force. sha256 of the text below this line: 136f2365f8bc6bb2f22731e99c0accba6af0f6584f0e502d0d621209dd83a6e8.
# Erratum 2 to the bench-engines 0.1.0 engine specification (DRAFT for Nadira's signature)

**Applies to:** `bench-engines/docs/engine-spec-0.1.0.md`, sha256 `15d0db0a9f3b3d6a7c6349c234af1e6769b5b7d52937ac6a13ed18e927ed90bd` (file byte-identical to da35748), signed NAD-2026-10-26-86.
**Drafted by:** Atlas, 27 Oct 2026, under T-0006, on the COO's instruction (plan D-0008). Source ruling: NAD-2026-10-27-29 (`.claude/reports/nadira/2026-10-27-c10-errata-signature.md`), which responds to ADC-2026-10-27-20. Atlas read only line 82 of the spec, erratum-1 and the Nadira file.

## 1. What this note is

Section 4.2 of the signed file carries S-3 (NAD-2026-10-26-49) in its "Refusals" cell, at line 82. For lists that are empty or of unequal length, that text leaves `fields` and `indices` partly to inference. NAD-2026-10-27-29 ruled the wording below, amended so that `fields` and the both-empty case are stated. This note is wording only. It adds no behaviour. The engine version does not move. The signed file is not edited.

## 2. Correct reading

The sentence below governs S-3 in section 4.2 (line 82) where the lists are empty or of unequal length. The signed S-3 text otherwise stands.

"When either list is empty (including both), `fields` names both lists in argument order and `indices` is `[]`, even if the other list has element faults. When both lists are non-empty and of unequal length, `fields` names both lists and `indices` is the ascending union, each position once, of the element-fault positions in both lists (ADC-2026-10-26-117, ADC-2026-10-27-10, NAD-2026-10-26-50)."

## 3. Current text, quoted exactly

### Line 82 (section 4.2, "Refusals" cell)

> | Refusals | Empty list (n_sq < 1), a count negative or non-integer, lists of unequal length: `rejected`, CCS-RF-03, with `indices` as in S-3 below (zero-based). A `null` or blank element in `live[]` or `dead[]` is `incomplete` (CCS-RF-01), not CCS-RF-03 (NAD-2026-10-26-30): `missing` names the list(s) and the index is carried in `missingIndices` (S-7). Live sum + dead sum = 0: handled by 4.4 and 4.3 (CCS-RF-06). **S-3 (NAD-2026-10-26-49):** For an empty list or unequal lengths, `fields` names the lists (an empty list is named; for unequal lengths both `live` and `dead` are named) and `indices` is `[]`; `indices` names squares only for element faults (a negative or non-integer count). Where both lists have element faults, `indices` is the union of offending indices, ascending, each once, and `fields` names every list with a fault in argument order (NAD-2026-10-26-50) |

## 4. Status of the signed file

The signed file is unchanged. Its bytes still hash to `15d0db0a9f3b3d6a7c6349c234af1e6769b5b7d52937ac6a13ed18e927ed90bd`. Where this note and line 82 differ on empty or unequal-length lists, this note governs. Elsewhere the signed file governs.

## 5. Signature

This note is not in force until Nadira signs it.

| Field | Entry |
|---|---|
| Signed by | |
| Role | NADIRA (science) |
| Signature reference | |
| Date | |
| sha256 of this note at signing | |
