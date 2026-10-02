# MedFind Product Requirements

Version 1.0 | 2 October 2026 | Product owner: Team Enigma

MedFind helps patients and caregivers find the exact prescribed medicine at a participating licensed pharmacy before travelling. This document defines a narrow web prototype, its operating rules, and measurable acceptance criteria for product, design, development, and pilot operations.

## 1 Problem and evidence

Patients may call or visit several pharmacies without knowing whether the correct medicine, strength, and dosage form is available. A pharmacy elsewhere may hold that product but have no practical way to make its stock discoverable. MedFind addresses this information gap; it cannot create supply, make medicine affordable, or guarantee dispensing.

The supplied Gate 1 proposal reports five completed pharmacy interviews. Participants favoured updates taking under two minutes, stock information expiring after 24 hours, and holds lasting no more than 30 minutes with explicit pharmacist approval. Ten patient or caregiver interviews and pilot outcomes were still pending in that proposal. Historical shortage evidence is context, not evidence of current availability or national demand.

The proposal's pre-build thresholds are at least 6 of 10 patients reporting a recent multi-pharmacy search and 3 of 5 pharmacists agreeing to a seven-day update trial. These are decision criteria, not achieved results. Documentation and a synthetic demonstration can proceed; a live pilot requires recorded validation and operational sign-off.

## 2 Users and outcomes

- Patients and caregivers search without an account, identify an exact product, compare recent pharmacy reports, and obtain a fresh confirmation before travelling.
- Pharmacy staff update the small catalogue quickly. Only authorised pharmacists accept holds and confirm the requested product and quantity.
- Pilot coordinators verify partners, curate products and aliases with a pharmacist, support consented phone enquiries, correct reports, and measure reliability.

The initial target is 5-10 licensed community pharmacies and 10-15 pharmacist-selected products in participating regional clusters. Show actual coverage explicitly; do not describe the pilot as complete island-wide coverage. Patient search and basic pharmacy participation remain free.

## 3 Scope and priorities

P0 is required for the supervised prototype: exact catalogue selection; town or optional device location; pharmacy results; stock timestamps and expiry; phone confirmation guidance; staff sign-in and stock updates; admin partner verification; discrepancy reporting; audit records; responsive layouts; and consent and contact deletion controls.

P1 is the controlled hold workflow: opt-in enquiry, pharmacist acceptance or rejection, a server-controlled expiry, cancellation, collection recording, and a private status page. Ship P1 before offering any digital hold. Until then the interface offers only a call, and staff may document consented manual confirmation through the coordinator.

Later phases include full multilingual content, native mobile applications, approved messaging integrations, inventory integrations, and aggregated demand reporting. There is no checkout, payment, delivery, prescription upload, diagnosis, dose advice, automatic substitution, AI stock inference, or paid ranking in the prototype. Hospital-only products and products outside partners' lawful supply are excluded.

## 4 Functional requirements

- FR01 Catalogue: select a canonical product with medicine name, brand where relevant, strength with unit, dosage form, and release variant where relevant. Only a pharmacist-approved active catalogue entry is searchable.
- FR02 Search: match curated names and aliases. Suggest candidates after two characters; debounce requests by 300 ms. Require explicit selection before loading availability. A name-only query must not silently pick a strength, brand, or form.
- FR03 Location: allow town or district selection without permission. Device location is requested only after a user action. Calculate approximate straight-line distance when coordinates exist; do not imply travel time. Missing coordinates show a town label, not an invented distance.
- FR04 Results: show exact product, pharmacy, locality, reported stock, freshness, last confirmation time, licence verification information, contact, and hours if known. Distinguish missing data from zero results and unknown hours from closed.
- FR05 Enquiry: a phone call or form initiates a request; neither guarantees availability. A fresh human check is required before MedFind labels a referral confirmed. The form requires consent, one contact method, product, pharmacy, and requested quantity with unit.
- FR06 Pharmacy updates: show all pilot products with In stock, Low stock, and Out of stock controls. Save one row at a time; display success only after the server acknowledges. Support an explicit reviewed batch confirmation, with no automatic daily refresh.
- FR07 Holds: an authorised pharmacist freshly checks the exact product and requested quantity, sets an expiry within 30 minutes, and explicitly accepts. Pending requests never display as held.
- FR08 Administration: verify licence details and review date, invite staff, suspend partners, curate catalogue entries, inspect audit history, and handle discrepancies. Suspension removes public listings immediately and flags active holds for coordinator follow-up.
- FR09 Support: a discrepancy form records product and pharmacy identifiers and a controlled reason. Contact is optional and consented. A report marks that listing unconfirmed pending staff review and alerts the coordinator; it does not assert the pharmacy is at fault.
- FR10 Metrics: measure search episodes, confirmation outcomes, failed referrals, scheduled update completion, and staff update duration with minimal identifying data.

## 5 Core business logic

BR01 Product identity is immutable within a search or hold. A change of strength, form, release type, or brand creates a new selection and requires user confirmation. Alias matching only finds candidates; it does not establish therapeutic equivalence. Staff refer ambiguities to a pharmacist.

BR02 Store reported status separately from freshness. A record is fresh only when its server confirmation age is strictly less than 24 hours. At exactly 24 hours, on a missing or invalid timestamp, or while a discrepancy is unresolved, display Unconfirmed. Preserve the old reported status for audit but never show it as currently confirmed. This exact boundary is a proposed implementation convention for the proposal's 24-hour expiry.

BR03 In stock and Low stock are pharmacy reports, not counts or guarantees. Low stock means limited supply as assessed by staff; the prototype does not invent a quantity threshold. Unknown is distinct from Out of stock. A read, login, page refresh, or automated job must never refresh confirmation time.

BR04 For the selected exact product, default results contain fresh In stock and Low stock listings from verified active partners. Sort In stock first, then Low stock; within each group sort by distance if an origin exists, then newest confirmation, then pharmacy ID. Without an origin, sort by newest confirmation. Show unconfirmed and out-of-stock records only in a separate labelled section or explicit filter. Offer a user-controlled broader area when the selected area has no matches.

BR05 Server UTC time controls stock and hold deadlines. Display local times in Asia/Colombo alongside relative times and a date when needed. Return server time to the client so an incorrect device clock cannot extend a hold.

BR06 A proposed hold request expires unanswered after 10 minutes. An accepted hold lasts for the pharmacist's chosen duration, greater than zero and at most 30 minutes from acceptance. The pharmacist checks quantity in a declared unit and physically sets it aside. The app does not automatically deduct inventory because the prototype stores categorical stock only.

BR07 Conservatively allow at most one unexpired accepted hold per pharmacy and product. Serialize acceptance at the database level. Additional requests remain pending or are rejected; extending capacity requires quantity-based inventory in a later version. An acceptance never silently alters another patient's hold.

BR08 Cancellation, expiry, or collection releases the hold slot but does not mark a product In stock. Staff must check and update remaining stock independently. Existing accepted holds stay recorded if public stock becomes Out of stock, because their quantity may already be set aside. If that allocation cannot be honoured, the pharmacist cancels with a reason and the coordinator contacts the patient.

## 6 Journeys and state transitions

Search journey: enter medicine name, select exact product, choose location, inspect recent reports, contact a pharmacy, obtain a fresh confirmation, and travel only with that confirmation. A user can call without creating a patient account or storing a search history.

Hold journey: opt in and submit an enquiry, wait on the status page, receive pharmacist acceptance and an absolute expiry time, collect or cancel. A successful form submission says Request sent. It must not say Reserved.

The hold states are PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED, and COLLECTED. PENDING can move to ACCEPTED or REJECTED by a pharmacist, CANCELLED by the requester, or EXPIRED after its response deadline. ACCEPTED can move to CANCELLED, EXPIRED at its hold deadline, or COLLECTED by a pharmacist before expiry. Terminal states cannot be reopened. Create a new request for a new attempt.

The server checks deadlines on every read and transition, even if a cleanup job has not run. It returns a conflict for an outdated action and the current state for redisplay. Retrying the same request with the same idempotency key returns the original outcome. A client must never retry an ambiguous submission with a new key automatically.

If connectivity fails, keep entered non-sensitive search selections, show that current availability cannot be verified, and offer the pharmacy phone number if already loaded. Do not queue offline stock confirmations or hold acceptance. An expired session preserves the intended action but requires sign-in and a fresh read before submission.

## 7 Privacy and access

Public searches require no identity. Do not store diagnoses, prescription images, patient names in the stock register, or precise search coordinates in analytics. Keep medicine search parameters out of third-party analytics, application request logs, and outgoing referrers.

Collect a contact method only for an opted-in enquiry or hold. Show its purpose, which pharmacy can see it, and the retention period before submission. Restrict access to the relevant pharmacy and authorised coordinator. Delete contact details and private lookup credentials no later than 30 days after collection; longer retention requires a separately reviewed justification. Retain only non-identifying operational counts afterwards. Backups must age out within the documented retention window and deletion must be reapplied after a restore.

Use synthetic records for demonstrations. Pharmacy dispensing and prescription checks remain the pharmacist's responsibility. A licence badge means that the team checked registration details on a stated date; it does not mean government endorsement or guaranteed stock. Applicable privacy and pharmacy requirements need review before real patient use.

## 8 Acceptance and quality targets

- AC01 A query with two strengths offers separate choices and returns no availability until one is selected. An alias must not return a different form as the chosen product.
- AC02 At 23 hours 59 minutes a valid stock report is fresh; at 24 hours it is Unconfirmed. A page left open across that boundary updates its label without a new stock confirmation.
- AC03 A pending request cannot show a countdown for a confirmed hold. Acceptance with a 31-minute duration fails; expiry blocks collection even when the scheduled job is delayed.
- AC04 Two simultaneous acceptance attempts for one pharmacy and product create no more than one active accepted hold. Duplicate submissions do not create duplicate requests.
- AC05 Staff at pharmacy A cannot view contacts, modify stock, or act on holds belonging to pharmacy B, including by changing a URL or API identifier.
- AC06 Permission denial still allows town search. A network failure is not rendered as No stock. A suspended pharmacy disappears from fresh results immediately.
- AC07 Contact deletion removes the identifying fields and invalidates private lookup access after 30 days. Public responses contain no contacts from enquiries.
- AC08 A keyboard user can search, choose a product, inspect results, and submit or cancel an enquiry. At 320 CSS pixels the page has no horizontal content scrolling. Status meanings survive grayscale viewing.

Proposed engineering targets are a search API p95 under 500 ms with the pilot dataset at 20 concurrent users, and a usable results page within 3 seconds on a defined midrange phone and throttled mobile connection. Record the test device and network profile; these are targets, not measured performance.

## 9 Pilot measures and delivery

The proposal targets at least 90% agreement between displayed available reports and fresh pharmacy checks, at least 80% of scheduled updates completed, and median daily staff update effort below two minutes. Report fresh In stock accuracy separately from Low stock checks. Count failed checks as failures, not missing observations; document sampling and exclusions. Compute scheduled completion as completed planned pharmacy-day updates divided by all planned pharmacy-day updates.

Aim for 30 consented search episodes. Measure elapsed time from the start of an episode to fresh confirmed availability, and report unsuccessful episodes separately. Compare with participants' recalled previous searches only as a descriptive comparison. Report sample sizes and medians; do not claim a causal improvement from this small pilot.

Delivery sequence: validate demand and pharmacy participation; agree the catalogue and operating procedures; build P0 with synthetic data; verify freshness, access control, and correction flows; add and test P1; onboard partners; run a supervised pilot; decide continue, change, or stop. Expansion requires adequate stock reliability and participation. Optional LKR 2,000 monthly reporting is a later pricing hypothesis, not a launch fee or forecast.

## 10 Decisions to confirm before live use

Team Enigma must nominate a pilot coordinator and clinical reviewer, record participating pharmacies and products, and approve the pilot regions and support hours. The pharmacist reviewer approves catalogue identity, aliases, and quantity units. Product and operations owners confirm the proposed 10-minute pending deadline and one-active-hold limit. The team approves supported languages, hosting budget, retention implementation, and the rollout decision based on validation evidence.

## 11 Source and related documents

Primary source: Team Enigma, MedFind - Sri Lanka Medicine Availability Network, Gate 1 Problem and Proof, supplied PDF, pages 2-5 and 8-10. Interview findings are reported by that proposal and have not been independently revalidated in this specification.

Technology decisions and API contracts are in TECH_STACK.md. Screen layouts, visual tokens, and UI state behaviour are in DESIGN.md. The implementation conventions in this PRD are proposed product decisions wherever they go beyond the Gate 1 proposal.
