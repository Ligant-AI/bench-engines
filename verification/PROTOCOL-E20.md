# E20 verification PROTOCOL: black-box interface for the endotoxin limit and maximum valid dilution engine module

Protocol id: `E20-PROTOCOL v1.1`. Author: Adacs. Draft for placement at `bench-engines/verification/PROTOCOL-E20.md` (a new, separate file; the existing `bench-engines/verification/PROTOCOL.md` and `bench-engines/verification/run-engine.mjs` are not touched and are not part of this contract). Research use only. Not qualified for GxP decision-making.

Signed basis: the signed E20 engine specification (D-0134, `bench-engines/docs/engine-spec-e20-endotoxin-limit-mvd.md`, sha256 `79d50a45617b506195a7e7cd56e02ea4dd6830e41aadd7edf1e5005a5ee67ddf`), cited as "S"; the signed URS D-0132 (sha256 `15099b7907d2d1f1a91cdfa9819508a71f91d33954d18fec099a5cdb818aeb1d`, "U") and its signed Amendment 1 D-0133 (sha256 `1d68c0542b4137566210d0421dc2cdd27b1d19acb1a2225c81e3d785c96359f1`, "A"). Expected values are derived from U, read with A, and S, and from the rows S section 11.1 names: `engine-spec-0.1.0.md` sections 2 and 6, `engine-spec-e10-conversions.md` section 2, E10R-AMD-3 items (1) to (3) and E10R-AMD-5 items (1) and (2) (paths and shas in the brief). Where S and a named row differ, S governs. This file states **no expected value and no derived figure**. Every expected value is derived by the fixture author from these signed documents.

The dispatch shape in section 2 is taken from S section 6 alone (function names, argument order). It is stated here, in full, because the readers of this file are not given any other bench-engines protocol.

## 0. Who reads this and what for

- **E20 fixture author** and **E20 clean room**: the contract for inputs, outputs and files, so that two independent readers produce files an outside comparator can join. Neither sees the case list, the comparator, the builder's code or the other's folder.
- **Engine builder**: no runner and no file in `bench-engines/verification` is asked of the builder by this file. The built engine is run by Adacs's own driver (section 7), which the builder does not see and does not edit.
- **Adacs**: owns the case list, the comparators and the driver for the built engine.

Tokens in this file (`$absent`, `$ref`, `calls`, the id forms) are Adacs's own naming so that the three programs speak one language. They are not specification text. Every closed string, code, reason and member name of the engine is S's, spelled as S spells it.

## 1. Programs, files and command lines

| Program | Where | Input | Output |
|---|---|---|---|
| Built engine driver | Adacs's own folder (Adacs writes it; neither pair nor the builder reads or edits it) | a cases file or a fixture file | a run file (section 5) |
| Clean-room runner | `bench-engines/reimpl/e20/e20_reimpl.py` (clean room writes; Python, standard library only) | the same two file kinds | the same run file layout |
| Fixture file | `bench-engines/verification/fixtures/e20/expected.json` (fixture author writes) | none | entries (section 4) |

Command lines (paths are arguments; nothing is hard-coded; nothing reads a path it was not given):

- `node <driver> --entry <absolute path of the package entry> --in <file> --out <file> [--ids <id>,<id>,...]`
- `python3 -I <file> --in <file> --out <file> [--ids <id>,<id>,...]`, where `<file>` is `bench-engines/reimpl/e20/e20_reimpl.py`

`--in` accepts a **cases file** (section 2) or a **fixture file** (section 4). In a fixture file a runner reads only `id`, `fn`, `args` and `calls` of each entry, and ignores the rest. A runner never reads `expected`, `handDerivation` or any expected value. `--ids` limits the run to the named ids. A runner writes only the file named by `--out`.

The built engine driver calls the package under test through its entry point: the namespace `e20` exported by the package entry (S section 2.2), found at the path given by `--entry`. The clean-room runner calls only the clean room's own code. Neither pair is given Adacs's cases; each pair may run its own runner on its own fixture file to check shape, writing only inside its own folder.

This file governs over any card or brief on file names, command lines, input and output forms, the unsupported result and the gap file.

Output folders (everything a pair writes is inside its own):

| Path | Written by | Content |
|---|---|---|
| `bench-engines/verification/fixtures/e20/expected.json`, `.../e20/generator/` | fixture author | section 4 |
| `bench-engines/reimpl/e20/` (including `e20_reimpl.py` and `gaps.json`) | clean room | the runner, its sources, `{ "gaps": [ { "gapId", "ref", "text" } ] }` |

No earlier module's folder, fixtures or reimplementation is read or written. Scratch is kept inside the author's own folder and removed when done. Nothing is staged in `/tmp` or any shared folder.

## 2. Cases file and the dispatch shape

```
{ "protocol": "E20-PROTOCOL v1.1", "module": "E20",
  "cases": [ { "id": "<case id>", "fn": "<function name>", "args": [ <encoded value>, ... ] },
             { "id": "<case id>", "calls": [ { "fn": "<function name>", "args": [ ... ] }, ... ] } ] }
```

`fn` is one of the nine exported function names of S section 6, spelled as there:

| Number | `fn` | Arguments, in order (S section 6) |
|---|---|---|
| E20L-F01 | `resolveLimit` | `limit` |
| E20L-F02 | `listPresets` | none (`"args": []`) |
| E20L-F03 | `mvdFromLimit` | `limit`, `technique`, `c`, `cUnit`, `lambda` |
| E20L-F04 | `checkDilution` | `DF`, `mvd` |
| E20L-F05 | `assessResult` | `limit`, `technique`, `c`, `cUnit`, `lambda`, `highestStandard`, `DF`, `resultQualifier`, `resultValue`, `reagentType`, `suitability` |
| E20L-F06 | `assessSuitability` | `suitability` |
| E20L-F07 | `screenDilutions` | `limit`, `c`, `cUnit`, `recoveryRange`, `criterion`, `curves` |
| E20L-F08 | `formatThreeFigures` | `value` |
| E20L-F09 | `checkRecordDates` | `testDate`, `expiryDate`, `calibrationDueDate` |

The runner calls `e20[fn](...args)` with exactly the arguments the case lists, in order, after decoding (section 3). A case with `calls` makes its calls in order, in one process, with no reset between them (this is how repeated and interleaved calls are tested). A runner passes no argument that the case does not list.

### 2.1 Case ids

An id is `<base>@<target>`.

- `<base>` is one of: a row of U section 15 written as in U (`F-nn`, with its letter as `F-nn(x)`, or `F-nn#k` for these rows only: F-16 (1 the `>` qualifier, 2 the text), F-18 (one per semicolon-separated entry), F-25 (one per preset chosen, in the order of the cell) and F-37(b) as `F-37(b)#k` (one per basis); F-29 to F-32 are one call per dataset or letter); or an engine-only situation of S section 9.2 written `E20L-X-nn/k`, where k is the author's own counter; or an acceptance row `AT-E20L-nn/k` with the author's counter.
- `<target>` is `F01` to `F09` (the function of the table above) for a single call, or `calls` for a case with several.
- A row of U that S section 9.1 maps to several functions is several cases, one per function, each with its own id. F-18 entries are written only for the mapped functions that take the argument the sub-case is about. A row mapped to F04 (F-12, F-13) is `<row>@calls` for F04: an `mvdFromLimit` call, then `checkDilution` with `{"$ref": {"call": 0, "path": ["mvd", "exact"]}}`; its F05 case is `<row>@F05`. The preset list is `F-25@F02`; the presets used are `F-25#k@F01`.
- F-30 at the engine is one curve, as S section 9.1 says; A row ELM-AMD-1-05 is how the page enters it.
- In row F-32 the plus signs are row notation: those r values are given without the plus. The minus sign is U+002D.
- Ids with `/k` are chosen by the author and by the clean room independently; they are checked by running the clean room on the fixture author's inputs (section 6), not by Adacs's own cases.
- Where an input is defined by a relation to a value the engine derives, the author writes that input as the text its own derivation gives, and shows the derivation in `handDerivation`. Adacs's cases carry his own text for the same input; the comparison checks that the two are the same.

## 3. Value encoding (inputs, expected, outputs: one scheme)

JSON cannot carry what the engine tests need (an argument left out, a bigint, a number where text is wanted, a computed object passed on). One tagged scheme applies to `args`, to `expected`, and to every run-file output.

**Decoding `args` (and `expected`):**

| Written | Meaning |
|---|---|
| JSON string, boolean, `null`, array | the same value in JS |
| JSON number | a JS **number**, used only as an input that is not text or not an object. S says what each kind of slot does with it |
| JSON object with no key beginning `$` | a plain object; members set in the written order |
| `{"$absent": true}` | as an argument or an array element: `undefined` (not `null`, not text); as an object member: the member is **not set at all** |
| `{"$bigint": "<digits>"}` | a BigInt, the digits with an optional leading `-` |
| `{"$number": "NaN"}`, `"Infinity"`, `"-Infinity"`, `"-0"` | that JS number |
| `{"$ref": {"call": k, "path": [ ... ]}}` | in a `calls` case: the value found at `path` (member names as text, array positions as integers) in the **output of call k** (0-based, an earlier call), exactly as the engine returned it, passed on without change. It is how a computed `exact` object `{num, den}` is handed to a later call. A path that finds nothing makes that case record `{"$caseError": "<text>"}` |
| any other object with a `$` key | a case error, recorded as above |

Strings are exact: spaces, tabs, U+00D7, U+2265, U+003E, `-0` and the like are written as the characters (or JSON escapes) and reach the engine unchanged. No runner trims, normalises or re-encodes a string.

**Encoding outputs (and `expected`):** the runner walks the value the engine returned and writes it as follows. It never lets plain `JSON.stringify` decide, because that drops `undefined` and fails on bigint.

| Engine value | Written |
|---|---|
| string, boolean, `null` | as JSON |
| array | an array, element by element, in order |
| plain object | an object, **own enumerable string keys in the order the engine created them**. Member order is not compared; array order is |
| any JS **number** (integer, float, `NaN`, `Infinity`, `-0`) | `{"$number": "<String(value)>"}`, with `"-0"` for negative zero. **No bare JSON number ever appears in a run file.** A bare number in `expected` means a JS number is expected |
| bigint | `{"$bigint": "<digits>"}` |
| `undefined` as a member value or array element | `{"$undefined": true}` (the member is present). An absent member is simply absent |
| array hole | `{"$hole": true}` |
| function | `{"$function": true}`; symbol `{"$symbol": true}` |
| an object that is not plain (a class instance, `Map`, `Date`, ...) | `{"$object": "<constructor name>"}` |
| a reference cycle | `{"$cycle": true}` |
| an error thrown by the call | the whole call's output is `{"$threw": {"name": "<error name>", "message": "<message>"}}`. The runner never crashes and never drops it |

## 4. Fixture file (the fixture author's output)

Path: `bench-engines/verification/fixtures/e20/expected.json`.

```
{ "protocol": "E20-PROTOCOL v1.1", "module": "E20",
  "entries": [ { "id": "<case id>",
                 "fn": "<function name>", "args": [ ... ],           // or "calls": [ { "fn", "args" }, ... ]
                 "expected": <encoded output (section 3)>,          // single call; for "calls": an array, one element per call
                 "handDerivation": "<each derived value, token and refusal, with the working and the S or U row that decides it>",
                 "assumptions": [ "<text>", ... ],
                 "gaps": [ "<gap id>", ... ] } ],
  "gaps": [ { "gapId": "GAP-E20-nn", "ref": "<S or U row id>", "text": "<what the signed documents leave open>" } ] }
```

Rules:

- `args` or `calls` is complete: a runner can run the entry unaided.
- `expected` is the whole output of the call, in the encoding of section 3, **including the `engine` object**. A member the author cannot derive from the signed documents is left out and the entry names a gap (S section 11.4: a case the rows do not decide is a gap, reported, not settled).
- A property that no single output states (for example "no returned member, at any depth, is a JS number", or "repeated and interleaved calls give identical results") is carried by an entry with `"expected": null`, a `"property"` text, and the `args` or `calls` that exercise it. Adacs holds the comparison for it.
- Scan, diff and review rows of S section 10 (the name scan, the source-level parts of the Mode B and float rows, the additive-change diff, the dependency check) are Adacs's own checks. No entry is written for them.
- The author writes every row S section 9.1 maps to a function, every engine-only situation of S section 9.2, and the acceptance rows of S section 10 that are fixtures. Every refusal code, reason token and closed string of S section 4 and every function of S section 6 has at least one entry.

## 5. Run file (every runner's output)

```
{ "protocol": "E20-PROTOCOL v1.1", "module": "E20",
  "results": { "<case id>": { "result": <encoded output> }                      // a single call
               | { "calls": [ <encoded output>, ... ] }                           // a calls case
               | { "$caseError": "<text>" }
               | { "unsupported": "<gap id>" } } }                                // clean room only
```

The engine's own `engine` object is in each output as S section 3 (E20L-NF-05) fixes it. The runner adds no member to any engine output and removes none. One case never stops the run. `{"unsupported": "<gap id>"}` is the clean-room runner's record for a case that needs what a gap of section 8 leaves undecided; it is never a `$caseError`, and the built engine driver does not write it.

## 6. How the comparison uses these files (what the pair must know)

- Adacs runs the built engine, and the clean room, on **his own cases file**. He compares the two run files by case id, and each against the fixture file where the inputs are the same.
- Where a fixture entry's `args` or `calls` differ from the cases file's for the same id, that is a finding about a reading of the signed documents, not a pass or a fail of the build. So the author's inputs must be exactly the inputs the row and the common inputs describe. Where they leave an input open, the author chooses it, keeps every other argument in an accepted state, and lists the choice in `assumptions`. Open inputs are not compared with the cases file, and `expected` is compared only with runs on the author's own inputs.
- Adacs also runs the built engine and the clean room on every fixture entry's inputs, including the author's `/k` ids, and compares both with the fixture's `expected` and with each other. The clean room therefore must run **any** call of section 2, not only those it might expect, and must implement the encoding of section 3 for itself.
- Neither pair reads the other's folder, the run files, nor the builder's code or output.

## 7. Contract for the built-engine driver (Adacs's own)

1. Command line of section 1; exit 0 when the run file was written, 1 otherwise; no network; no write outside `--out`.
2. Import the package entry at the path given by `--entry`; decode `args` as section 3; call `e20[fn](...args)`; encode the output as section 3, **including every JS number as `$number`**, so that a number anywhere in an output is visible.
3. A throw is recorded as `$threw` for that call; an unresolved `$ref` or an unknown `fn` is a `$caseError`. The run continues.
4. The driver holds no copy of any engine logic, token or expected string.
5. The driver reads `fn`, `args`, `calls` only. It never opens `verification/fixtures/`, `reimpl/` or any `expected` member.

## 8. Gap list

A gap is a place where the signed documents, read as written, do not decide the output. The pair does not settle a gap; it lists it by id, with the S or U row and one sentence, and goes on. Ids are `GAP-E20-nn`, numbered by the author or clean room. Gaps go in `expected.json` (`gaps`) and in `reimpl/e20/gaps.json`.

## 9. Change rule

This file is pinned by its sha256 before either pair starts. A change after a pair has started stops that pair; it restarts fresh on the new pin. The earlier set is kept and not used. A change comes to Quality before it is pinned.
