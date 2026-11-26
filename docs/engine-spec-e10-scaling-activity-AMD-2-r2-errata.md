# E10 scaling and activity spec, amendment E10R-AMD-2 (r2): errata AMD2-E-1 to AMD2-E-4

**Applies to:** the amendment `.claude/reports/atlas/engine-spec-e10-scaling-activity-AMD-2-r2.md`, sha256 `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`, approved by Nadira (recorded approval, AI agent) in NAD-2026-11-14-337. It is to be placed as a byte-identical copy at `bench-engines/docs/engine-spec-e10-scaling-activity-AMD-2-r2.md` (NAD-2026-11-14-342), hashing to the same sha256.
**Authority:** NAD-2026-11-14-342 and NAD-2026-11-14-343 (AMD2-E-3 and AMD2-E-4 rest on NAD-2026-11-14-340), in Nadira's record `.claude/reports/nadira/2026-11-15-t0641-amendment-placement-and-n1.md`, sha256 `3a8b6e80b73e3a5ec8cdc6acd684cd24392423c6ccee6274c156b2f92e58df37`. The OLD and NEW text of AMD2-E-1 to AMD2-E-4 and the text under "Reading order" are hers, character for character. This file adds no correction and no ruling of its own.
**Format:** VERA-2026-11-14-109 (T-0641).

## Corrections

Each row gives the amendment line, the text as approved (OLD) and the correct reading (NEW).

### AMD2-E-1. Line 8, Status

OLD:

```
unsigned. Placed beside the spec as a separate file. To be signed by Nadira by sha.
```

NEW:

```
signed by Nadira, NAD-2026-11-14-337, sha256 bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86. Placed beside the spec as a separate file.
```

### AMD2-E-2. Line 6, Opens

OLD:

```
The C14 URS will cite E10R-F23 once AMD-2 is signed; it does not cite it now.
```

NEW:

```
The C14 URS cites E10R-F23 through its amendment MBP-AMD-1 (signed NAD-2026-11-14-338, sha256 580f8cd7e41b644c99339c7f53d1572dfc8ec8c6d97a5313e56f4dc4a63fa298), which closes OI-1.2-11.
```

### AMD2-E-3. Line 44, Refusals row of E10R-F23

OLD:

```
or an empty `lines`: `incomplete` (ruled, NAD-2026-11-14-334).
```

NEW:

```
or an empty `lines`: `incomplete` (ruled, NAD-2026-11-14-334), with `missing` naming the arguments in argument order: `["lines"]` for a null, absent or empty `lines`, `["final"]` for a null or absent `final`, and `["lines","final"]` for both (NAD-2026-11-14-340).
```

### AMD2-E-4. Line 75, AT-E10R-41 (a) and (b)

OLD:

```
(a) `lines` as `[]`: `incomplete`. (b) `lines` null: `incomplete`.
```

NEW:

```
(a) `lines` as `[]`: `incomplete`, `missing` `["lines"]` (never `lines[0]`: an empty list has no element). (b) `lines` null: `incomplete`, `missing` `["lines"]`.
```

## Reading order

> Read the E10 scaling and activity specification in this order. (1) `engine-spec-e10-scaling-activity.md` (r3.1, sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1`), with its errata `engine-spec-e10-scaling-activity-errata.md` for lines 1, 4, 8 and 480. (2) E10R-AMD-1, `engine-spec-e10-scaling-activity-AMD-1.md` (sha256 `4f835cea4bf305dd2c3bcf301ab9f8e6be3991c6ca62bcd60504a449d4e9a060`), with its errata; it replaces r3.1 line 304. (3) E10R-AMD-2, `engine-spec-e10-scaling-activity-AMD-2-r2.md` (sha256 `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`), with its errata; it replaces r3.1 line 302 and adds E10R-F23 and its rows. Where an amendment replaces a line of r3.1, the amendment governs that line. The sentence "Everywhere else the signed file governs." in the r3.1 errata file means: everywhere not corrected by that errata file and not replaced by an amendment.

## Status of the amendment

The amendment is not edited and still hashes to `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`. Where this file and lines 6, 8, 44 and 75 of the amendment differ, this file governs. Everywhere else the amendment's own text governs, read in the order above.
