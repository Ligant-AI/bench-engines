# E10 scaling and activity spec, amendment E10R-AMD-5: erratum AMD5-E-1 and the extended reading order

**Applies to:** the amendment `.claude/reports/atlas/engine-spec-e10-scaling-activity-AMD-5.md`, sha256 `d07a7a54437a0cd8d72ed3cefb22f8ecfb08233133205a5a5c3ade578b77f6dc`, signed by Nadira (recorded approval, AI agent) in NAD-2026-11-14-385. It is to be placed as a byte-identical copy at `bench-engines/docs/engine-spec-e10-scaling-activity-AMD-5.md`, hashing to the same sha256.
**Authority:** the pattern of AMD4-E-1 and the AMD-4 reading order (KAITO-D200), and NAD-2026-11-14-376 for the amendment and for this file, in Nadira's record `.claude/reports/nadira/2026-11-15-t0651-set-b-gaps-rc03.md`. The amendment is signed in NAD-2026-11-14-385 and this file in NAD-2026-11-14-386; the changes that made both final are ruled in NAD-2026-11-14-382 and NAD-2026-11-14-384, in Nadira's record `.claude/reports/nadira/2026-11-15-t0656-amd5-word-check.md`. The reading-order block extends the AMD-4 errata block with item (6). This file adds no correction of substance and no ruling of its own.
**Format:** VERA-2026-11-14-109 (T-0641).

## Why this file is needed

The placed AMD-4 errata (`engine-spec-e10-scaling-activity-AMD-4-errata.md`, bench-engines `276c8fb`) closes its reading order at five documents, ending at E10R-AMD-4, and says that block supersedes the AMD-3 errata block. A sixth document is not in it. This file extends the order to six. The AMD-4 errata bytes are signed and are not edited.

## Corrections

The row gives the amendment line, the text as approved (OLD) and the correct reading (NEW).

### AMD5-E-1. Line 7 of the amendment, Status

The OLD string occurs once in the amendment, in its Status line.

OLD:

```
unsigned. Placed beside the spec as a separate file. To be signed by Nadira by sha.
```

NEW:

```
signed by Nadira, NAD-2026-11-14-385, sha256 d07a7a54437a0cd8d72ed3cefb22f8ecfb08233133205a5a5c3ade578b77f6dc. Placed beside the spec as a separate file.
```

## Reading order

This block supersedes the reading-order block of the AMD-4 errata, which lists five documents and says nothing of a sixth; its bytes are signed and are not edited. Where this block and that differ, this block governs. The AMD-1, AMD-2-r2 and AMD-3 errata blocks stay superseded, as the AMD-3 and AMD-4 errata state.

> Read the E10 scaling and activity specification in this order. (1) `engine-spec-e10-scaling-activity.md` (r3.1, sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1`), with its errata `engine-spec-e10-scaling-activity-errata.md` for lines 1, 4, 8 and 480. (2) E10R-AMD-1, `engine-spec-e10-scaling-activity-AMD-1.md` (sha256 `4f835cea4bf305dd2c3bcf301ab9f8e6be3991c6ca62bcd60504a449d4e9a060`), with its errata; it replaces r3.1 line 304. (3) E10R-AMD-2, `engine-spec-e10-scaling-activity-AMD-2-r2.md` (sha256 `bf2389120e8431c63b48f2c02a357fc1612d7a637e1823cf1a46365ff8865e86`), with its errata; it replaces r3.1 line 302 and adds E10R-F23 and its rows. (4) E10R-AMD-3, `engine-spec-e10-scaling-activity-AMD-3.md` (sha256 `bebae6ef93e9d26fc837b8ee67b9548c819e19b080a8182ab9a55d472775e175`), with its errata; it adds to r3.1 lines 161, 196, 243 and 254 and to the reading of the places where r3.1 says "null" of a required input, gives lines 288 and 460 a reading aid (its item (4)), and corrects the status statement of r3.1 line 3 as its item (5) states. (5) E10R-AMD-4, `engine-spec-e10-scaling-activity-AMD-4.md` (sha256 `5e1d04cf96e2a8ff118fd3ada924db3b4b0c1fb0ffd871a0dd398a01a4378238`), with its errata; it replaces one string of r3.1 line 352 (Example 14), the last sentence, so that E10R-F13 IU to U is E10-RC-02 `["unit","toUnit"]`. (6) E10R-AMD-5, `engine-spec-e10-scaling-activity-AMD-5.md` (sha256 `d07a7a54437a0cd8d72ed3cefb22f8ecfb08233133205a5a5c3ade578b77f6dc`), with its errata; it adds to AMD-2-r2 line 44 (E10R-F23) and to r3.1 line 196 (E10R-F15) the refusal of a present value of the wrong form, and gives r3.1 line 129 a reading aid that quotes the E10-RC-03 message. An addition to a line of an amendment is read as an addition to a line of r3.1 is: the line stands and the addition is read with it. Where an amendment replaces a line of r3.1, or corrects a string in it, the amendment governs that line or string; where it adds to a line, the line stands and the addition is read with it. The sentence "Everywhere else the signed file governs." in the r3.1 errata file means: everywhere not corrected by that errata file and not replaced or corrected by an amendment; a line an amendment adds to still governs, read with the addition.

## Status of the amendment

The amendment is not edited and hashes to `d07a7a54437a0cd8d72ed3cefb22f8ecfb08233133205a5a5c3ade578b77f6dc`. Where this file and the Status line of the amendment differ, this file governs. Everywhere else the amendment's own text governs, read in the order above.

VERDICT: INFO
