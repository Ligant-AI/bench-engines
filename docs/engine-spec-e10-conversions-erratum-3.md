# E10 conversions spec erratum E10C-ERR-3 (DRAFT for Nadira's signature)

**Applies to:** both of these files, line 31 only:
1. The signed draft spec `.claude/reports/atlas/engine-spec-e10-conversions-DRAFT.md`, sha256 `e50773d40385fd537a4378320efbbf8341199b3010577d7ed03078f553596fd1`, 433 lines.
2. The placed copy `bench-engines/docs/engine-spec-e10-conversions.md` (commit db0b6b1), sha256 `3985409a8a2606bdfb5f21f469ede62af3352914c638df2544d6b4fdbc41fa49`, 431 lines.

**Drafted by:** Atlas, 10 Nov 2026, under T-0492 (with T-0491). Source rulings: NAD-2026-11-10-09 (an erratum is needed) and NAD-2026-11-10-10 (the erratum and its exact row), in `.claude/reports/nadira/2026-11-10-t0492-nf05-untracked-fixture-erratum3.md`. Atlas read that report and line 31 of both specs. Atlas makes no ruling; the OLD and NEW strings are Nadira's, copied character for character from her NAD-2026-11-10-10.

## 1. What this note is

NAD-2026-11-10-09 rules that E10C-NF-05 (line 31) names the fixture expectation of `engine.version` among the things that change "in one commit", and that `bench-engines/.gitignore` (lines 6-10) keeps the fixture expectations out of the repository, so the sentence cannot be met without force-adding independent evidence. NAD-2026-11-10-10 rules the correction. This is E10C-ERR-3.

- Line 31 is the E10C-NF-05 row. The sentence replaced is the one-commit sentence only.
- The rest of line 31 (the sentence beginning "C10's version line states the engine change") is unchanged.
- **ERR-1 Row 2 and this row do not overlap.** ERR-1 Row 2 (`engine-spec-e10-conversions-erratum-1.md`, lines 28-40) inserts a sentence after "E9 and E7 module lines do not move.", which in line 31 sits immediately before the OLD sentence below. ERR-1 stays as signed and is not touched; both apply.
- ERR-2 (line 174) is on a different line and is not touched.
- Nothing else in the signed text needs an erratum (NAD-2026-11-10-11).
- Per NAD-2026-11-10-12(a), ERR-3 should be signed before the version commit on Wed 11 Nov 2026. If it is not, the commit may still be made, and Adacs records NF-05 as not met or as a declared deviation.

## 2. Current text and correct reading

One row. It replaces one sentence inside line 31. The sentence occurs once in each file (`grep -cF` = 1 in each; line 31 in each).

### Row 1. Line 31, E10C-NF-05, the one-commit sentence (NAD-2026-11-10-10)

OLD:

```
The package version, `MODULE_VERSION`, README, PROTOCOL version line and the fixture expectation of `engine.version` change together in one commit.
```

NEW:

```
The package version, `MODULE_VERSION`, README and PROTOCOL version line change together in one commit. The fixture expectations of the version fields are independent evidence that `bench-engines/.gitignore` keeps out of the repository, so they are never committed and never force-added: `engine.version` moves to `0.1.1` in every expected E9, E7 and E10 result or refusal that states it, and `engine.moduleVersion` moves to `0.2.0` in every expected E10 result or refusal that states it, and only there (E9 and E7 stay `0.1.0`). The fixture author edits them in place, taking the values from this specification and its signed errata, never from an engine output, and changes no other expected value. The edit is completed, with before and after hash notes and a member-by-member comparison of the before and after files, before the version commit is made (VERA-2026-11-10-30; NAD-2026-11-10-10).
```

## 3. Status of the signed files

Both files are unchanged by this note. The draft spec still hashes to `e50773d40385fd537a4378320efbbf8341199b3010577d7ed03078f553596fd1` and the placed copy to `3985409a8a2606bdfb5f21f469ede62af3352914c638df2544d6b4fdbc41fa49` (both re-checked with `shasum -a 256`, read only, on 10 Nov 2026). Where this note and line 31 differ, this note governs. Elsewhere the signed files govern. The row is carried into the next spec version.

## 4. Signature

DRAFT. This note is not in force until Nadira signs it.

| Field | Entry |
|---|---|
| Signed by | |
| Role | NADIRA (science) |
| Signature reference | |
| Date | |
| sha256 of this note at signing | |
