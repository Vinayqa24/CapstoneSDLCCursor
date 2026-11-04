# Design Review

## Summary

Architecture for [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31) is **fit for the existing Flask app**: one read-only `GET /baseline` page, markdown tables as the source of truth, and the Hotel Titan screenshot as the only evidence gate. Flask stays the right choice versus FastAPI or Django. HarborStay routes are left in place and are not used as inventory evidence.

The first draft was incomplete in three places that would let Stage 5 render the wrong rows, skip accessible headings, or read a file outside the baseline directory. Those are **closed in `architecture.md`**. Residual risk is content authoring (the five markdown files do not exist yet) and the known GitHub pull-request 403, not the stack.

## Findings

### Critical

1. **A bad pipe table could still render shifted cells**
   Data Flow accepted any pipe table. A short row or a wrong header would show hotel names or priorities under the wrong column and could still satisfy a loose “region is visible” check. That breaks the evidence rule in requirements FR-3 and FR-4.
   **Fix applied:** the header must match the contract columns in order, every data row must have that width, and any mismatch drops the whole region to `Not Found` with no partial rows.

2. **Region headings were optional markdown**
   Requirements NFR-5 requires text labels on the regions and the inventory table. The reader ignored prose and treated the file’s first heading as optional, so a table-only file had no guaranteed accessible name.
   **Fix applied:** `baseline.html` owns the headings Inventory, Journey, Validations, Gaps, and Questions. The page title is Baseline.

3. **Baseline paths were not anchored**
   `BASELINE_DIR` was described as `<repo>/docs/baseline` without saying how the root is found. A cwd-relative default, or a symlink from the evidence file to a path outside the directory, could read files the story did not approve.
   **Fix applied:** the default is the parent of the `app` package plus `docs/baseline`. After `resolve()`, a path that leaves `BASELINE_DIR` is missing. The loader does not log an absolute path outside that directory.

### Warnings

1. **Any file with the canonical name unlocked the page**
   A non-PNG at that path would have been served as `image/png` and would have shown the markdown regions.
   **Fix applied:** presence requires a regular file, size from 1 byte through 2 MiB, and the PNG signature. The evidence route uses the same check and returns 404 otherwise.

2. **No size bound on markdown**
   One huge file could miss the 2 second local render budget in requirements NFR-6.
   **Fix applied:** a markdown file over 256 KiB is `Not Found` for that region.

3. **Failure logs were unspecified**
   Logging cell text or a home-directory path could leak content or local usernames.
   **Fix applied:** log a reason code and the fixed file name only (`missing`, `escape`, `not-png`, `too-large`, `decode`, `bad-table`).

4. **Autoescape could be undone in the template**
   Security named Jinja autoescape but did not forbid marking cells safe.
   **Fix applied:** `baseline.html` must not mark cell text as safe and must not wrap cells in `Markup`.

5. **Parser behavior had no unit-test contract**
   Playwright covers the page. It is a poor tool for a short row, a bad header, and a non-PNG file.
   **Fix applied:** Interfaces now require temp-directory unit tests for those cases. Playwright remains the Stage 7 UI check.

### Suggestions

1. Keep the HarborStay header link as a text link only. Existing map Playwright specs key off map test ids, not the header, so the link should not change those results.
2. Author the five markdown files in Stage 5 from the screenshot and the approved `Not Found` rules. Do not start that authoring in planning beyond the column contract already in architecture.
3. Leave Jira comments until a later explicit approval, as requirements already say.

## Decisions Agreed

| Decision | Source |
|----|---|
| Flask + Jinja2 on the existing app | Requirements NFR-1; Architecture Technology Choices |
| HarborStay routes unchanged; not used as evidence | Requirements clarifications; Architecture Overview |
| Markdown pipe tables, no new runtime dependency | Architecture Technology Choices |
| Hide all five regions when the PNG check fails | Requirements FR-10; Architecture Open Trade-offs |
| Reject a table that does not match the column contract | This review |
| Fixed template headings | Requirements NFR-5; this review |
| Path stays inside `BASELINE_DIR`; PNG signature and size caps | This review |
| Unit tests for the loader plus Playwright for `/baseline` | Architecture Interfaces |
| Q1–Q4 stay assumptions; no invented screens or calendar date | Requirements Open Questions; Architecture Overview |

## Architecture Updates Made

- Components: package-relative `BASELINE_DIR`, PNG and table checks, fixed headings, no safe-marked cells.
- Data Flow: path containment, PNG signature, BOM stripping, row-width rejection, 256 KiB and 2 MiB caps.
- Interfaces: evidence route uses the PNG check; unit-test list added; Playwright also asserts headings.
- Security and Failure Modes: escape, `not-png`, `too-large`, `bad-table`, and log reason codes.
- Open Trade-offs: headings live in the template; a bad table is `Not Found`.

## Residual Risks

- `inventory.md`, `journey.md`, `validations.md`, `gaps.md`, and `questions.md` are not written yet. Stage 5 must author them from the screenshot. Until then `/baseline` cannot meet the content acceptance criteria.
- A product-owner answer to Q1–Q4 can change those markdown rows later. It does not change the loader contract.
- The header link appears on every HarborStay page. It does not change map or booking handlers. Stage 7 should rerun the existing map specs once to confirm that.
- GitHub token cannot create PRs (403). Stage PRs may stay at compare URLs.
- `gh` is not installed on this machine.

## Approval Status

**Approved** by the human on 2026-11-04. Stage 4 Implementation Planning may proceed. Stage 5 coding still waits for approval of `impl-plan.md`.
