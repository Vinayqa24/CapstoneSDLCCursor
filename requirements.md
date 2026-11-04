# Requirements

## User Story

**Source:** [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31) (To Do, Story)

As a product owner, I want to capture and document the current UI capabilities from provided screenshots and map the end-to-end booking journey so that gaps and future enhancements are evidence-based and prioritized correctly.

**Business value (from Jira):** Prevent rework and a misaligned backlog by establishing a verified baseline of existing features and user flow.

**Jira acceptance (verbatim):**

- Given screenshots are provided for Home/Search, Search Results, Hotel Details, Checkout/Booking, and Confirmation (or equivalent), when analysis is completed, then a current feature inventory is produced with each feature mapped to the screen and UI evidence (section/control).
- Given the primary booking journey exists, when analysis is completed, then an end-to-end journey map is documented covering search → results → hotel/room selection → guest details → submit → confirmation, including transitions and required inputs.
- Given each step is documented, when required fields and validations are identified, then they are listed per step with expected formats (e.g., dates, guests, email) and failure states.
- Given gaps are identified, when prioritization is done, then each gap is categorized as P0/P1/P2 with rationale tied to user impact and booking integrity.
- Given the inventory and journey map are completed, when they are reviewed, then they are stored in the project knowledge base (or attached to the Jira ticket) and linked from the story.
- Given ambiguities remain (missing screens/unclear controls), when noted, then a questions/assumptions list is produced with owners and due dates.

**Evidence on the ticket:** Two attachments, `image-20261103-075923.png` (id 10000, embedded in the description) and `HotelBooking.png` (id 10001), are byte-identical (SHA-256 `58E33A893C6BEF7112D6F8B5F84B6D8C9ECBB8E0A5F3788200E3995DF3B9C785`). The canonical copy in this repo is `docs/baseline/evidence/image-20261103-075923.png`.

**What that single image shows:** One Hotel Titan page in a browser at `localhost:3000`. It is a home page with a hero, three featured property cards (Titan City House, Titan Shoreline, Titan Alpine Lodge), and an inline “Book your stay” form. It does not show separate Search Results, Hotel Details, Checkout, or Confirmation screens.

**Cycle note:** This replaces [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5) as the active requirements baseline. SCRUM-5 architecture, plan, HarborStay map behavior, and later stage reports remain historical. They are not approved design for SCRUM-31.

## Clarifications (Q&A summary)

| Topic | Decision |
|----|---|
| Evidence | Use only the one Jira screenshot (the description image). The second attachment is the same file. Do not inventory the HarborStay app or invent screens that are not in the PNG. |
| Missing screens | Search Results, Hotel Details, a separate Checkout page, and Confirmation are not in the image. Record each as an assumption/question. Do not draw them. |
| Delivery | A Python web app presents the feature inventory, journey map, field/validation list, and P0/P1/P2 gaps, backed by markdown under `docs/baseline/`. Stage 7 verifies the pages with Playwright. The app documents the baseline; it does not reimplement Hotel Titan booking. |
| Gaps | A gap is a journey step or required field (including its format or failure state) that the screenshot does not show. Priority follows user impact and booking integrity using the rubric below. |
| Publish | Store artifacts in the repo and reference them from this file. Do not comment on or attach files to SCRUM-31 until a later explicit approval. |
| Priority rubric | **P0:** the traveler cannot tell whether a stay was reserved, or the evidenced submit path has no outcome (confirmation / post-submit state). **P1:** the traveler cannot see how a specific hotel is chosen, or a visible field has no shown format or failure state. **P2:** absent content that does not change booking integrity (for example hero slides 02 and 03). |
| Question owners | Jira assignee is empty. Owner for every open question is the **product owner** role. Due is **before Stage 2 (Architecture) approval**. A calendar date was not provided (`Not Found`). |
| Historical app | Do not treat HarborStay routes or the SCRUM-5 map as screenshot evidence. |

## Functional Requirements

1. The project SHALL keep the canonical screenshot at `docs/baseline/evidence/image-20261103-075923.png` and SHALL treat it as the only UI evidence for this story.
2. Markdown under `docs/baseline/` SHALL be the source of truth for the inventory, journey map, per-step fields, gap list, and questions list. The web pages SHALL present that same content.
3. The feature inventory SHALL map each feature to a screen and to the UI evidence (section/control) in the screenshot. It SHALL include only controls visible in the file, at minimum:
   - Header: Hotel Titan mark and the text “Your next stay starts here” (navigation target is `Not Found` if not visible).
   - Hero: eyebrow, headline, supporting sentence, hero image and caption, and the visible carousel indicator (only the shown position; other slides are `Not Found`).
   - Featured properties: Titan City House, Titan Shoreline, and Titan Alpine Lodge, each with the visible short description and location label.
   - Booking panel: first name, last name, email, room, guests, check-in date, check-out date, phone, and the “Book my stay” button.
   - The visible statement that booking does not require sign-in.
4. The inventory SHALL NOT add prices, totals, error messages, extra hotels, extra room types, or extra screens that are not visible in the file.
5. The journey map SHALL cover search → results → hotel/room selection → guest details → submit → confirmation, including transitions and required inputs. Any step or transition not shown in the screenshot SHALL be marked `Not Found` and listed as a gap. The inline booking form on the home page is the only evidenced guest-details and submit UI.
6. For each journey step, the field list SHALL name the inputs that are visible and SHALL record expected format and failure state. Where the screenshot shows only a placeholder (for example a date placeholder or an email example) and does not show a validation rule or error, format enforcement and failure state SHALL be `Not Found`.
7. The gap list SHALL categorize every gap as P0, P1, or P2 using the rubric in Clarifications, with a rationale that cites user impact or booking integrity. From this screenshot the list SHALL include at least:
   - **P0:** no confirmation (or other post-submit outcome) is shown after “Book my stay”.
   - **P1:** no distinct search, search-results, or hotel-details step is shown, and no navigation from a featured property card is shown.
   - **P1:** no failure states are shown for empty or invalid name, email, room, guests, dates, or phone.
   - **P2:** hero carousel positions other than the one visible frame are not shown.
8. The questions/assumptions list SHALL include an owner and a due for each item. Until the product owner answers, use the owner and due in Clarifications.
9. The Python web application SHALL expose the baseline at `GET /baseline` with separate regions for inventory, journey, validations, gaps, and questions. Each region SHALL expose a stable `data-testid`: `baseline-inventory`, `baseline-journey`, `baseline-validations`, `baseline-gaps`, `baseline-questions`.
10. If the canonical screenshot file is missing, `GET /baseline` SHALL still respond successfully, SHALL show a visible message that the evidence is `Not Found`, and SHALL NOT render invented hotel or form rows. That message SHALL use `data-testid="baseline-evidence-missing"`.
11. Pages SHALL NOT call Jira or any other external API while rendering the baseline.
12. Stage 7 SHALL verify the page with Playwright, including the populated baseline and the missing-evidence message.

## Non-Functional Requirements

1. **Stack:** Deliver a Python web application. Framework choice is confirmed in Architecture. The baseline viewer is documentation of the screenshot, not a second booking engine.
2. **Security:** No API keys, tokens, passwords, or `api-conf.properties` contents in source, templates, tests, markdown, or the screenshot commit. Do not embed Jira credentials in image URLs.
3. **Integrity of evidence:** Analysis text SHALL quote or describe only what is visible. Unknown fields use the literal `Not Found`. Do not fabricate acceptance data to fill gaps.
4. **Reliability:** A missing evidence file SHALL NOT raise an unhandled error to the traveler. The missing-evidence message in Functional Requirement 10 is the failure behavior.
5. **Accessibility:** Region headings and the inventory table SHALL have text labels available to assistive technology. Priority SHALL NOT be conveyed by color alone.
6. **Performance:** `GET /baseline` SHALL be renderable from local files only and SHALL return within 2 seconds on a local run with the committed markdown and PNG.
7. **Privacy:** Do not collect booking submissions. The form on the screenshot is documented, not wired to storage.
8. **Testability:** Playwright locators SHALL use the `data-testid` values in Functional Requirement 9 and 10.
9. **Verification:** Stage 7 covers the happy path (regions populated from `docs/baseline/`) and the missing-screenshot path.

## Acceptance Criteria

- [ ] `docs/baseline/evidence/image-20261103-075923.png` is the only UI evidence, and the inventory lists the header, hero, three Titan properties, booking fields, and “Book my stay” from that file.
- [ ] The inventory does not contain a control or screen that is absent from that file.
- [ ] `GET /baseline` shows inventory, journey, validations, gaps, and questions, matching the markdown source, with the `data-testid` values named above.
- [ ] The journey map includes search → results → hotel/room selection → guest details → submit → confirmation, and marks steps that are not in the screenshot as `Not Found`.
- [ ] Visible fields are listed with format and failure state, using `Not Found` when the screenshot does not show a rule or error.
- [ ] Gaps include the P0 confirmation gap, the P1 selection and validation gaps, and the P2 carousel gap, each with a written rationale.
- [ ] Every open question has owner “product owner” and due “before Stage 2 (Architecture) approval”.
- [ ] When the evidence PNG is removed, the page shows `baseline-evidence-missing` and does not invent hotels or form fields.
- [ ] No secrets appear in the repo or in documentation for this story.
- [ ] Playwright can open `/baseline` and assert the five regions, and can assert the missing-evidence message.

## Out of Scope

- Reimplementing Hotel Titan (live search, room inventory, payment, or a working reservation).
- Using the HarborStay product UI or the SCRUM-5 map as evidence.
- Additional screenshots, screen recordings, or stakeholder review meetings.
- Writing a Jira comment or attaching the artifacts to SCRUM-31 in this stage.
- Accounts, sign-in (the screenshot says none is required), saved trips, and pricing rules that are not visible.
- Changing SCRUM-5 map behavior except where a later approved design says the baseline viewer must coexist with the existing app.

## Open Questions (if any remain)

| ID | Question | Working assumption | Owner | Due |
|----|---|---|---|---|
| Q1 | Do distinct Search Results, Hotel Details, Checkout, and Confirmation screens exist outside this file? | They are `Not Found`. The inline “Book your stay” form is the only checkout UI. Do not invent the other screens. | Product owner | Before Stage 2 approval |
| Q2 | Do the featured property cards or “Your next stay starts here” navigate anywhere? | Targets are `Not Found`. Cards are inventory items only. | Product owner | Before Stage 2 approval |
| Q3 | Which fields are required, and what date, email, phone, room, and guest formats are enforced? | Record visible placeholders only. Enforcement and errors are `Not Found`. | Product owner | Before Stage 2 approval |
| Q4 | Who is the named owner, and is there a calendar due date? | Role owner is product owner. Assignee on SCRUM-31 is empty. Calendar date is `Not Found`. | Product owner | Before Stage 2 approval |
| Q5 | Should Stage 2 replace `architecture.md` for a baseline viewer that coexists with HarborStay? | Yes. SCRUM-5 architecture is historical and is not the approved design for this story. | Product owner | Before Stage 2 approval |
