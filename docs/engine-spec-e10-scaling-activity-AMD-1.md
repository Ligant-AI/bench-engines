# E10R-AMD-1: amendment to the signed engine specification E10 (recipe scaling and activity conversion)

**Amends:** `.claude/reports/atlas/engine-spec-e10-scaling-activity-DRAFT-r3.1.md`, sha256 `6ba7fbcbf8e6bf0f042bef93be1abdf78471a3824f8c468316b612647ba316b1` (signed, NAD-2026-11-14-287). The file is not edited.
**Authority:** Nadira's ruling NAD-2026-11-14-291, item 4, in `.claude/reports/nadira/2026-11-15-t0639-c14-urs-science-rulings.md`, sha256 `519927cb93c3859d95327ea531a5be43a95b33236a3b06bc2afbcc4c7261896d`.
**Ticket:** T-0639.
**Status:** unsigned. Placed beside the spec as a separate file, not in the closed errata file of NAD-2026-11-14-286.

## The change: one row, against r3.1 line 304

The OLD string occurs exactly once in r3.1, in line 304 (the bullet "The four 1.2 recipe line kinds"). It is replaced by the NEW text, word for word from NAD-2026-11-14-291 (4).

**OLD:**

(e) an X-fold stock, E10R-F18; each passed value a terminating product, passed as exact plain decimal text; never through E10R-F13;

**NEW:**

(e) an X-fold stock, E10R-F18; (f) a percent of the final volume, w/v or v/v, E10R-F16 with `reference` `"final"` and `B` the recipe's final volume, one call (NAD-2026-11-14-291); each passed value a terminating product, passed as exact plain decimal text; never through E10R-F13; a line's amount is computed only through (a) to (f); a declared specific activity may add an E10R-F20 or E10R-F21 result to a line as a statement, never as an amount to add and never passed to another call (NAD-2026-11-14-291);
