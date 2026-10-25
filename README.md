# @ligant/bench-engines

The shared calculation engines of the Ligant Bench Tools programme: engines E1 to E19 of the master tool list (`.claude/reports/nadira/2026-10-24-master-tool-list-and-roadmap.md`, with its two errata). Every tool calls them through a vendored, versioned tarball, the way it uses `@ligant/bench-chrome`.

**Status (25 October 2026):** an empty skeleton. Nothing is built until the C10 URS is signed. The first modules are the ones C10 Cell Counting and Seeding calls: **E9** (cell counting and seeding), **E7** (the Poisson counting CV only), **E4** (the replicate statistics C10 needs) and **E10** (the dilution arithmetic C10 needs). The rest of train 0 (the remaining E4 and E10 scope, E2 and E16 Tier A, the single least-squares routine) follows C10. See `../Bench-Tools-Programme/train-0-plan.md`.

## Rules that make this a package and not code in each tool

1. **One implementation in the suite.** A second copy of any engine function inside a tool is refused at acceptance (cat1 NAD-2026-10-24-547(6); -1206; -1209). Tools import from here.
2. **Every export prints the engine version** it used (NAD-2026-10-24-1217(12)). The version is this package's `version`, and each engine module also carries its own version line.
3. **Deterministic.** No random numbers at run time (a fixed seed does not count), no simulation, no randomised or quasi-random quadrature. Tier A closed forms only, unless a URS signs a Tier B fit under its five conditions.
4. **Independently verified.** Each engine has its own fixtures (`verification/fixtures/`, written by `c10-fixture-author` for the first modules) and a clean-room reimplementation (`reimpl/`, by `c10-cleanroom`), neither committed here and neither visible to the builder. `verification/acceptance/` holds Adacs's comparators.
5. **Research use only. Not qualified for GxP decision-making.**

## Layout

| Path | What | Who writes it |
|---|---|---|
| `docs/` | the engine specification (from the signed URS) | Atlas drafts, Nadira signs, the main session places it |
| `src/` | one folder per engine (`e9/`, `e7/`, `e4/`, `e10/`) | c10-builder |
| `tests/` | the builder's own tests, values from `docs/` only | c10-builder |
| `verification/PROTOCOL.md` | the black-box interface: cases on stdin, results on stdout | Atlas drafts, Adacs confirms |
| `verification/run-engine.mjs` | the harness that runs the engine on PROTOCOL cases | c10-builder |
| `verification/fixtures/` | independent expected values (not committed) | c10-fixture-author |
| `reimpl/` | clean-room Python implementation (not committed) | c10-cleanroom |
| `verification/acceptance/` | comparators | Adacs drafts, the main session places |

## Open items

- **Public source.** Every page links to its public source code and the exact engine version (-1236(2)). How the engine source appears in each tool's public run-only export (`publish-public.mjs`), or as its own public repository, is for Loom and Clause before C10 goes live.
- GitHub repository `Ligant-AI/bench-engines` (private): the owner creates it. Local git only so far.

Apache-2.0. Copyright Ligant AI Inc.
