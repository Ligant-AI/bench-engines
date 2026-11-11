# E10 conversions spec erratum E10C-ERR-2 (DRAFT for Nadira's signature)

**Applies to:** both of these files, line 174 only:
1. The signed draft spec `.claude/reports/atlas/engine-spec-e10-conversions-DRAFT.md`, sha256 `e50773d40385fd537a4378320efbbf8341199b3010577d7ed03078f553596fd1`, 433 lines.
2. The placed copy `bench-engines/docs/engine-spec-e10-conversions.md` (commit db0b6b1), sha256 `3985409a8a2606bdfb5f21f469ede62af3352914c638df2544d6b4fdbc41fa49`, 431 lines.

**Drafted by:** Atlas, 10 Nov 2026, under T-0493. Source rulings: NAD-2026-11-10-03 (derivation) and NAD-2026-11-10-04 (the erratum and its exact row), in `.claude/reports/nadira/2026-11-10-t0491-t0493-e10-erratum1-q38-24-q38-13.md` (sha256 `f41503c2045dfdb6e28dcb1ef7a981aa1fb486136f83840c5dd79c9204aa08fc`, lines 47-59). Atlas read that report and line 174 of both specs. Atlas makes no ruling; the OLD and NEW strings are Nadira's, copied character for character from lines 51 and 55 of her report.

## 1. What this note is

NAD-2026-11-10-04 rules that line 174 of the E10 conversions spec states the dye relation of the 3.8 DOL without the path length, so the dye molarity is wrong when the path is not 1. This is E10C-ERR-2. Erratum E10C-ERR-1 stays as signed and is not touched.

- Line 174 is section 8, boundary text for the tool. It is not an engine relation. No engine version moves and no engine fixture moves.
- It is still a signed line that states a wrong relation, and a builder or fixture author could follow it, so it is corrected under signature and is not left to the URS to override.
- The last sentence of :174 ("the one step 3.8 shares with the engine is `molarToMass` (M x MW) in one call with `toUnit: "mg/mL"`") stays true under NAD-2026-11-10-05 and is not changed. Line 276 (Q-E10C-13) is not changed.
- The change-log row at :337 is history and is not touched.
- This note must be signed before the 3.8 URS is signed (Thu 12 Nov 2026), because the 3.8 URS cites E10:174. It does not block the 12 Nov engine acceptance.

## 2. Current text and correct reading

One row. It replaces a fragment inside line 174, in section 8. The fragment occurs once in each file (`grep -cF` = 1 in each; line 174 in each).

### Row 1. Line 174, section 8, 3.8 boundary text (NAD-2026-11-10-04)

OLD:

```
DOL = (Amax_neat / epsilon_dye) / protein molarity, with protein molarity = A_corr / (epsilon_protein x path)
```

NEW:

```
DOL = dye molarity / protein molarity, with dye molarity = Amax_neat / (epsilon_dye x path) and protein molarity = A_corr / (epsilon_protein x path); the path cancels in the DOL, never in either concentration (NAD-2026-11-10-03)
```

## 3. Status of the signed files

Both files are unchanged by this note. The draft spec still hashes to `e50773d40385fd537a4378320efbbf8341199b3010577d7ed03078f553596fd1` and the placed copy to `3985409a8a2606bdfb5f21f469ede62af3352914c638df2544d6b4fdbc41fa49`. Where this note and line 174 differ, this note governs. Elsewhere the signed files govern. The row is carried into the next spec version.

## 4. Signature

DRAFT. This note is not in force until Nadira signs it.

| Field | Entry |
|---|---|
| Signed by | |
| Role | NADIRA (science) |
| Signature reference | |
| Date | |
| sha256 of this note at signing | |
