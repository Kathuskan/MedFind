# MedFind Web Experience Design

Version 1.0 | 2 October 2026 | Design specification for the prototype

Design MedFind as a calm, search-led availability service. The primary task is to identify an exact medicine and obtain a trustworthy pharmacy confirmation. This specification gives designers and developers the screen structure, visual tokens, component behaviour, and responsive rules needed to build the web prototype and prepare for future mobile applications.

## 1 Reference and visual direction

The requested reference is Musemind's Shopcart - Ecommerce Web Design for Electronics Stores on Dribbble. Its linked live demo uses a dark green utility strip, a white navigation bar with prominent search, a large coloured hero area, category sections, and product cards. The design author emphasises information architecture and visual hierarchy. Reference links appear at the end of this document.

Adapt the clear navigation and reusable cards to MedFind. Replace promotional content with coverage and confirmation guidance, product shopping cards with pharmacy availability cards, and commercial urgency with explicit stock freshness. Use a compact pale mint hero so medicine search stays above the fold. The exact tokens below are proposed MedFind values, not claimed measurements of the reference. Create original branding and UI assets; no Shopcart imagery is required.

## 2 Information architecture

- Public routes: / for medicine search; /search for exact-product results held in client state; /pharmacies/:id for public profiles; /enquiry for a consented request and private status; /help for service limits and assistance; /privacy for information handling.
- Staff routes: /staff/login; /staff/stock; /staff/enquiries; and /staff/profile. Stock and enquiry actions are scoped to the selected permitted pharmacy.
- Admin routes: /admin/pharmacies; /admin/catalogue; /admin/reports; and /admin/audit. Administrative screens clearly identify the active partner or product before an edit.

Public navigation contains Find medicine, How it works, Help, and Pharmacy sign in. Show language choices only for supported, reviewed translations. Search inputs and private credentials must not appear in shareable URLs. A reload can return users to a safe selection step instead of storing sensitive search history automatically.

## 3 Patient screens

Home: a compact coverage strip names participating areas. The header carries the MedFind wordmark, public links, and pharmacy sign-in. The hero says Find your prescribed medicine nearby, followed by a labelled medicine search field, exact-product selector, town selector, optional Use my location action, and Find pharmacies button. A short three-step explanation follows: select the exact medicine, check recent reports, confirm with the pharmacy before travelling.

Autocomplete: each option shows medicine name, brand if relevant, strength, form, and release variant. The option's whole row is selectable by keyboard or touch. Similar strengths remain separate. Selecting an alias only selects the reviewed catalogue product; changing the typed query clears the prior product selection and results. The primary search action stays disabled until a product is selected, with a visible explanation.

Results: retain the exact medicine summary and location above the list, with Change medicine and Change location actions. Show a result count only after a successful response. Provide availability and area filters and a clear default sort label. The main list contains fresh In stock and Low stock reports; a labelled secondary section can reveal Unconfirmed and Out of stock records. Each card includes pharmacy name, verification review date, locality, approximate distance if known, hours if known, reported status, and last confirmed time.

The card's primary action is Call to confirm. If P1 is enabled, offer Request a short hold as a secondary action only where eligibility allows it. Directions follows the pharmacy address and does not imply confirmed availability. Include the visible sentence Stock can change. Confirm before travelling. Keep exact product identity near the action, especially after scrolling.

Pharmacy detail: show the public address, phone, verified licence review date, available hours, and selected medicine's current report. Include Report incorrect availability. Do not present a licence badge as an endorsement. If a pharmacy is suspended, replace search actions with a service-unavailable state; private active-hold users still receive the relevant status and support route.

Enquiry form: repeat exact product and pharmacy, collect quantity and unit plus one contact method, and show an unchecked consent box describing sharing and 30-day retention. Do not request a diagnosis, patient account, or prescription image. The submit action is Send request. Inline validation names the field and how to fix it.

Enquiry status: display Request sent while pending, with its response deadline and Call pharmacy fallback. An accepted state shows Hold confirmed, the exact quantity and unit, an absolute expiry in Sri Lanka time, a secondary countdown, and Cancel hold. Keep the expiry text visible if the countdown fails. After expiry, remove collection guidance and offer a new confirmation attempt. Collected, rejected, and cancelled states show a clear outcome and next step.

## 4 Staff and administrator screens

The stock dashboard begins with pharmacy name, sign-in identity, and a count of records needing review. Display each medicine's full identity, three stock controls, last confirmed time, and save state. On desktop use a compact table; on mobile use stacked rows with full-width medicine labels and 44-pixel controls. Never truncate the strength or form to fit.

A single stock tap initiates a save and shows Saving. Only the acknowledged result updates Last confirmed. On failure, restore the known saved display and retain an Unsaved change indicator with Retry. A reviewed batch confirmation lists the records being renewed and requires explicit confirmation that staff checked them; simply opening the dashboard does not refresh stock.

The enquiry queue separates Pending, Accepted, and Completed items. Show the product, requested quantity, deadline, and minimal authorised contact. Acceptance opens a short review panel: exact identity, physically available quantity, set-aside confirmation, and a duration of 1-30 minutes. The final action is Confirm hold. Disable the action during submission; stale conflicts reload the current state rather than showing a success toast.

Admin partner review includes licence reference, review date, verification result, public address, and publication state. Catalogue review includes aliases by language and explicit strength/form fields. Discrepancy review shows the affected listing and an action to request a fresh check. The audit view shows who changed what and when, with no patient contact values.

## 5 Visual tokens

Use the following proposed values consistently in CSS and design files. Validate colour combinations in the implemented interface, including hover, focus, and disabled states.

- Brand primary: #14532D. Use for primary buttons and active navigation, with white text.
- Brand hover: #0F3D22. Focus ring: #2563EB, 3 pixels with 2-pixel offset.
- Canvas: #F8FAF9. Surface: #FFFFFF. Hero: #ECFDF3. Borders: #CBD5E1.
- Main text: #172B24. Secondary text: #475569. Avoid using pale grey for essential instructions.
- In stock: text #166534 on #DCFCE7, with a check icon and the full label.
- Low stock: text #92400E on #FEF3C7, with a warning icon. Do not use a sales-style urgency message.
- Out of stock: text #991B1B on #FEE2E2, with the full label.
- Unconfirmed: text #475569 on #F1F5F9, with a clock icon and last known confirmation time.

Typography: use a system sans-serif stack for the initial web build; use appropriate Noto Sans Sinhala and Tamil fonts when those translations are enabled. Body text is 16 pixels with 24-pixel line height. Supporting text is at least 14 pixels with 20-pixel line height. Desktop headings use 40/48, 28/36, and 20/28 pixels for size/line height; mobile uses 30/38, 24/32, and 20/28. Use weights 400, 500, and 600, with sentence case and visible field labels.

Spacing follows 4, 8, 12, 16, 24, 32, and 48 pixels. Cards use a 12-pixel radius, inputs 8 pixels, and status chips a pill shape. Use a 1-pixel border and restrained shadows for raised dialogs, not every text block. Buttons are at least 44 pixels tall with 16-pixel horizontal padding. Keep clinical identity and status more prominent than decoration.

## 6 Responsive layout

Below 768 pixels, use a single column with 16-pixel side padding, stacked search fields, full-width primary actions, and filters in an accessible modal sheet. Keep Call to confirm and the status text together. A sticky bottom action is optional on detail pages but must not cover content, browser controls, or keyboard focus.

From 768 to 1023 pixels, use 24-pixel gutters and a compact search row that wraps without cropping labels. Above 1023 pixels, use a centred container up to 1200 pixels wide, 32-pixel gutters, and a 12-column grid. Results use a three-column filter area and a nine-column list. Prefer a vertical comparison list over a dense shopping grid because each pharmacy card has time-sensitive details.

Design and test at widths 320, 390, 768, 1024, and 1440 pixels, landscape orientation, and 200% text zoom. The initial website must work in mobile browsers. Native mobile navigation and push notifications remain a later design phase using the same content hierarchy and status language.

## 7 Layout blueprints

Desktop home, top to bottom: coverage strip; wordmark and public navigation; compact hero with headline and search form; how-it-works explanation; pilot coverage and service limits; help and privacy links. Avoid a promotional carousel that pushes search out of view.

Desktop results, top to bottom: compact header; exact medicine and location summary; results count and sort; left-side filters beside stacked pharmacy cards; labelled secondary unconfirmed results; support link. Each card reads in this order: pharmacy and location, stock state, last confirmed, exact product, contact actions.

Mobile results, top to bottom: compact header; full medicine identity; location and Change action; Filters button and count; one card per row. Inside each card place the status and timestamp before the primary action. Expand supporting licence and hours information without hiding the essential status.

Staff mobile, top to bottom: pharmacy selector restricted to memberships; pending enquiries indicator; records needing review; medicine rows; per-row saving feedback. Keep queue navigation separate from stock toggles to reduce accidental acceptance.

## 8 Component state contract

- MedicineSearch supports idle, typing, loading, candidates, no match, selected, and error. No match says This medicine is not in the pilot catalogue, followed by a spelling prompt and help route. Do not suggest an unreviewed replacement medicine.
- PharmacyCard supports fresh in-stock, fresh low-stock, out-of-stock, unconfirmed, and unavailable partner states. Freshness and partner eligibility come from the API. At freshness_expires_at, the client demotes the report and rechecks it.
- StockToggle supports unchanged, saving, saved, failed, and version conflict. The saved timestamp changes only after acknowledgment. Conflict copy says This record changed. Review the latest status and try again.
- HoldStatus supports every PRD state. The PENDING deadline is a response deadline, not a reserved-stock countdown. ACCEPTED uses the server expiry. Do not allow local device time changes to prolong the displayed hold.
- LocationInput supports a manual town, requesting permission, resolved coordinates, denial, and unavailable location. Denial copy says Choose a town to continue. Device location is optional.
- ResultList supports loading skeletons, success, no fresh matches, no participating pharmacies, server error, and offline. An error says We could not check availability. Try again or contact the pharmacy. It never says No stock.

If a response arrives for an older search after the user selects a new product, discard that response. When switching product or location, clear stale result actions while the new query loads. Do not show one medicine's stock beneath another medicine's heading.

## 9 Accessibility and language

Target WCAG 2.2 AA. Use semantic headings, landmarks, visible input labels, and keyboard-accessible controls. The combobox supports arrow keys, Enter, Escape, and clear selection announcements. Dialogs trap focus, return it to the trigger, and expose a descriptive title. Use a polite live region for save outcomes and request-state changes; avoid announcing a countdown every second.

Maintain at least 4.5:1 text contrast for normal text and 3:1 for large text; test non-text controls and focus visibility too. Text and icons must carry stock meaning independently of colour. Support reduced motion and text resizing. Do not require hover, dragging, or a map to complete the main task. Touch targets use the project's 44-pixel minimum.

Start the demonstration in English with translation keys for all visible strings. Before a pilot involving Sinhala or Tamil speakers, provide reviewed core task translations or a clearly staffed assisted workflow. Do not display non-working language switches. Keep canonical medicine names visible alongside reviewed aliases, and never use automated translation to infer an exact product match.

## 10 Prototype evaluation and handoff

Build linked screens for home, product selection, results, pharmacy detail, pending request, accepted hold, expired hold, staff stock, enquiry queue, and admin verification. Include denied-location, stale-stock, save-failure, empty-results, and concurrent-hold conflict variants. Clearly label synthetic pharmacies and stock in demonstrations.

Test whether participants can select the intended strength and form, explain the difference between reported availability and a confirmed hold, find the last-confirmed time, and recover from no fresh results. Time staff updating all 10-15 pilot products. Use the PRD's under-two-minute median target as a usability goal, not an achieved claim.

Handoff includes component variants, tokens, screen dimensions, keyboard behaviour, copy, loading/error states, and API field mappings. Designers and developers jointly verify all PRD acceptance criteria, especially 24-hour expiry, pharmacist acceptance, and the 30-minute maximum. Review responsive screens with realistic long medicine and pharmacy names before live use.

## 11 References

- Musemind, Shopcart - Ecommerce Web Design for Electronics Stores: https://dribbble.com/shots/19614098-Shopcart-Ecommerce-Web-Design-for-Electronics-Stores
- Live demo linked by the designer: https://museshopcart.webflow.io/
- W3C WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- Team Enigma Gate 1 proposal, supplied PDF, pages 8-10, for freshness, pharmacy confirmation, and operating limits.

Reference review date: 2 October 2026. PRD.md defines product behaviour; TECH_STACK.md defines server enforcement. Visual inspiration does not imply copying Shopcart assets or introducing ecommerce features into MedFind.
