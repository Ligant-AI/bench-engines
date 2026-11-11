# E10 conversions spec erratum E10C-ERR-1 (DRAFT for Nadira's signature)

**Applies to:** `.claude/reports/atlas/engine-spec-e10-conversions-DRAFT.md`, sha256 `e50773d40385fd537a4378320efbbf8341199b3010577d7ed03078f553596fd1`, 433 lines.
**Drafted by:** Atlas, 10 Nov 2026, under T-0491. Source rulings: ADC-2026-11-10-01 and ADC-2026-11-10-02 (`.claude/reports/adacs/2026-11-10-t0491-e10c-four-points.md`). Atlas read that report and the spec lines quoted below. Atlas makes no ruling; the NEW text is Adacs's, copied character for character.

## 1. What this note is

ADC-2026-11-10-01 finds that the signed text is inconsistent on `engine.moduleVersion`: E10C-NF-05 (line 31) moves the E10 module line from 0.1.0 to 0.2.0, while E10C-NF-01 (line 27) and AT-E10C-16 (line 246) say existing results are unchanged except `engine.version`. It rules that the fixtures expect `engine.moduleVersion` 0.2.0 on every E10 result and refusal, old functions and new. ADC-2026-11-10-02 fixes the `fields` content and the control values of AT-E10C-05. Both are wording corrections to the signed spec. Adacs proposes one signed erratum covering both, so that one signature serves. This note records the five replacements. It adds no science question.

## 2. Current text and correct reading

Each row gives the line, the current text quoted exactly (OLD) and the correct reading (NEW).

### Row 1. Line 27, E10C-NF-01 (ADC-2026-11-10-01)

OLD:

```
Additive only: `strengthFactor` and `splitVolumes` are unchanged in behaviour, inputs, outputs and tests
```

NEW:

```
Additive only: `strengthFactor` and `splitVolumes` are unchanged in behaviour, inputs, outputs and tests, except the engine version fields (`engine.version`, `engine.moduleVersion`), which move as E10C-NF-05 states
```

### Row 2. Line 31, E10C-NF-05, after `E9 and E7 module lines do not move.` (ADC-2026-11-10-01)

OLD:

```
(nothing)
```

NEW:

```
The E10 module line is reported in `engine.moduleVersion` of every E10 result and refusal, the ten new functions and `strengthFactor` and `splitVolumes` alike (0.1.0 section 2): `0.2.0` for E10, `0.1.0` for E9 and E7.
```

### Row 3. Line 245, AT-E10C-15, expected column (ADC-2026-11-10-01)

OLD:

```
`engine.module == "E10"`; `engine.version` is the new package string `0.1.1` (ADC-2026-11-09-03)
```

NEW:

```
`engine.module == "E10"`; `engine.version` is the new package string `0.1.1`; `engine.moduleVersion` is `0.2.0`, on every E10 result and refusal, old functions and new (ADC-2026-11-09-03; ADC-2026-11-10-01)
```

### Row 4. Line 246, AT-E10C-16, expected column (ADC-2026-11-10-01)

OLD:

```
Pass; existing results unchanged except `engine.version`, which the fixtures expect as the new string `0.1.1` (ADC-2026-11-09-03)
```

NEW:

```
Pass; existing results unchanged except `engine.version`, which the fixtures expect as the new string `0.1.1`, and `engine.moduleVersion`, which the fixtures expect as `0.2.0` (ADC-2026-11-09-03; ADC-2026-11-10-01)
```

### Row 5. Line 235, AT-E10C-05, expected column (ADC-2026-11-10-02)

OLD:

```
E10-RC-02 for the crossing cases; the control is a result
```

NEW:

```
E10-RC-02 for the crossing cases, `fields` `["fromUnit","toUnit"]`; the control is a result (`value` 0.001, `exact` 1/1000, `unit` `L`) (ADC-2026-11-10-02)
```

## 3. Status of the signed file

The signed file is unchanged and still hashes to `e50773d40385fd537a4378320efbbf8341199b3010577d7ed03078f553596fd1`. Where this note and lines 27, 31, 235, 245 and 246 differ, this note governs. Elsewhere the signed file governs. The rows are carried into the next spec version.

## 4. Signature

DRAFT. This note is not in force until Nadira signs it.

| Field | Entry |
|---|---|
| Signed by | |
| Role | NADIRA (science) |
| Signature reference | |
| Date | |
| sha256 of this note at signing | |
