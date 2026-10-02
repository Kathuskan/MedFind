# MedFind Technology and Architecture

Version 1.0 | 2 October 2026 | Technical specification for the web prototype

Use a React web client, a FastAPI service, and PostgreSQL. This preserves the Gate 1 proposal's technical direction while placing medicine identity, stock freshness, permissions, and hold decisions on the server. The same versioned API can support native mobile clients later. These are proposed implementation choices; no application or deployment is implied by this document.

## 1 Stack decisions

- Web: React with TypeScript and Vite. Build a responsive client with reusable components; public search does not need a patient account. A client-rendered prototype avoids an additional server rendering framework at this scale.
- UI: CSS custom properties for design tokens, CSS Modules for component styles, and accessible headless dialog and combobox primitives selected during implementation. Use React Router for routes and TanStack Query for request state and invalidation. Validate dependencies and accessibility rather than assuming a library makes the application compliant.
- API: Python FastAPI with Pydantic request and response schemas. Publish an OpenAPI contract and generate a typed web client. Keep business rules in services independent of HTTP handlers.
- Database: PostgreSQL with SQLAlchemy and Alembic migrations. Use transactions, foreign keys, constraints, and row locks for correctness. No Redis, search cluster, or microservices are required for the pilot.
- Authentication: staff-only accounts, Argon2id password hashing through a maintained library, and revocable opaque server sessions in secure cookies. Invite-only onboarding; no public staff registration. Admins assign pharmacy memberships and roles.
- Background work: one scheduled worker for pending-request expiry, hold expiry, and contact deletion. The API also computes expiry on reads and enforces it on writes, so correctness does not depend on worker timing.
- Operations: Docker containers on a small managed hosting service, managed PostgreSQL, HTTPS, encrypted backups, and a same-origin reverse proxy. Choose the vendor and region after budget, support, and data-handling review.
- Testing: pytest for domain and database integration tests; Vitest and Testing Library for UI behaviour; Playwright for browser journeys and accessibility checks; GitHub Actions for repeatable checks.

Select supported stable versions at implementation kickoff and pin exact versions in lockfiles and container image digests. Do not treat unversioned package names here as a dependency lock. Review security updates routinely. Hosting prices, free-tier limits, and messaging charges need a current quote before provisioning.

## 2 System shape and ownership

Browser or future mobile client -> HTTPS API -> domain services -> PostgreSQL. Staff clients use the same API with explicit roles. A worker uses the same domain services for deadline and retention processing. Manual phone or WhatsApp coordination remains an operating channel; it does not write directly to the database.

The web host serves static assets and proxies /api/v1 to FastAPI. A single origin simplifies cookie handling and browser policy. API responses contain server_now, computed freshness, and applicable deadlines. Clients format these values and display the current state; only the API decides whether an update or hold transition is legal.

Suggested repository structure when implementation starts: apps/web for the client; services/api for routes, schemas, domain services, and repositories; services/api/migrations for database changes; tests for contract and browser tests; infra for container and deployment configuration; docs for these specifications. This is a proposed structure, not existing code.

## 3 Data model

Use UUID identifiers and timezone-aware UTC timestamps. Public response schemas are allowlists; never serialize database models directly.

- MedicineProduct: id, generic_name, optional brand_name, strength_value, strength_unit, dosage_form, optional release_variant, display_name, active, and reviewer_id. Product identity changes create a new catalogue version or product; old enquiries keep their original identity snapshot.
- MedicineAlias: id, product_id, language, normalized_alias, and approved_by. One alias may legitimately refer to multiple products. Do not enforce alias uniqueness across all products or assume a unique clinical match.
- Pharmacy: id, name, address, district, town, optional latitude and longitude, public phone, optional opening_hours, licence_reference, licence_checked_at, optional licence_expiry, verification_state, and active. Expired or suspended verification blocks public eligibility.
- StaffUser and Membership: account id, password_hash, active, and pharmacy-scoped role. Coordinator access is separately assigned. Staff roles distinguish stock editing from pharmacist hold acceptance.
- StockReport: pharmacy_id, product_id, reported_status, confirmed_at, confirmed_by, version, and unresolved_discrepancy. The pharmacy and product pair is unique. Status is IN_STOCK, LOW, OUT, or UNKNOWN; freshness is computed, not a fifth stored stock status.
- EnquiryHold: id, pharmacy_id, product_id, product_snapshot, requested_quantity, quantity_unit, state, requested_at, pending_expires_at, accepted_at, hold_expires_at, accepted_by, terminal_reason, and version. Quantity is positive; acceptance requires a pharmacist to confirm that unit and amount.
- EnquiryContact: enquiry_id, encrypted contact_value, contact_type, consent_version, consent_at, and delete_after. Keep identifying data separate from stock and audit tables.
- PrivateLookup: enquiry_id, hash of a cryptographically random secret, created_at, and expires_at. The secret is only returned once; do not put it in public URLs or analytics. Use a private session to view and cancel that enquiry.
- AuditEvent: actor_id, pharmacy_id, entity_id, event_type, before and after non-sensitive fields, reason, and occurred_at. Contact values and raw search queries are excluded.
- Discrepancy: stock pair, controlled reason, created_at, resolution, resolved_at, and optionally a separately retained consented contact reference.

Indexes: unique stock pair; alias normalized text; pharmacy district and active state; hold pharmacy/product/state/deadlines; and contact delete_after. Start with normalized exact and prefix matching and a small town coordinate table. PostGIS can be introduced if measured geographic scale warrants it.

## 4 Search and freshness algorithm

Normalize Unicode, trim whitespace, collapse repeated spaces, and perform case-insensitive matching. Do not erase strength units, release variants, or clinically meaningful tokens. Search curated catalogue labels and aliases; rank exact name matches before prefix matches. Display every candidate with strength, form, and brand. A product_id selection is required for availability.

At request time, load verified active pharmacies for that product. Compute fresh = confirmed_at exists AND server_now < confirmed_at + 24 hours AND no unresolved discrepancy. Invalid or future timestamps fail closed as Unconfirmed and generate an operational alert. Confirmation timestamps are written by the server, never trusted from a client.

Apply PRD BR04 grouping and ordering. Calculate Haversine distance for the small cohort when a user provides an origin; label it approximate straight-line distance. Missing coordinates sort after known distances within the same stock group. Do not persist precise origins by default. Pagination uses a bounded page size of 20 and stable identifiers for tie-breaking.

Return freshness_expires_at and server_now. Clients invalidate their displayed state at expiry and refetch when the tab regains focus. Stock and private hold responses use Cache-Control: no-store; avoid service-worker caching of these endpoints. Static assets can use immutable caching with hashed filenames.

## 5 API contract

All routes are under /api/v1. Validation rejects unknown enum values, invalid coordinates, non-positive quantities, invalid units, and durations outside permitted bounds. Return a consistent error object with code, message, field_errors, and request_id. Never return traces or patient contacts in errors.

- POST /catalogue/search: anonymous request with query and optional language; returns candidate product identities. A request body reduces exposure of sensitive terms in access-log URLs. Redact request bodies from logs too.
- POST /availability/search: anonymous product_id, town_id or optional coordinates, filters, and cursor; returns pharmacy cards, freshness, server_now, and next_cursor. Rate-limit and bound body size.
- GET /pharmacies/{id}: public verified pharmacy profile and known hours. No internal staff or enquiry fields.
- POST /enquiries: contact consent, product_id, pharmacy_id, quantity, and unit plus an Idempotency-Key header; creates PENDING and a private lookup credential. Server rejects ineligible partners and products.
- POST /enquiries/access: exchange the private secret in the body for a scoped secure session. GET /enquiries/{id} and POST /enquiries/{id}/cancel require that session or authorised staff membership. The public identifier alone grants no access.
- PATCH /staff/pharmacies/{id}/stock/{product_id}: reported_status and expected_version; checks membership and writes the stock report plus audit event atomically. A reviewed confirmation can save the same status with a new server timestamp.
- POST /staff/enquiries/{id}/accept: expected_version and hold_minutes; checks pharmacist role, fresh physical confirmation, quantity, eligibility, and capacity. Rejects a request whose pending deadline has passed.
- POST /staff/enquiries/{id}/reject and /collect: enforce role, version, and legal transitions. A staff cancellation uses a separate permission-checked action and reason.
- POST /discrepancies: validates a known product/pharmacy pair, applies abuse controls, and marks its report unconfirmed for review. Admin routes resolve discrepancies, verify pharmacies, and curate the catalogue with audit records.

Use 401 for absent authentication, 403 for denied role access, 404 for inaccessible private resources, 409 for stale versions or illegal state transitions, 422 for invalid inputs, and 429 for throttling. A failed stock save leaves the last confirmed status visible and marks the attempted change unsaved.

## 6 Atomic hold handling

Within one database transaction, lock the StockReport row for the pharmacy and product, then lock the target enquiry. Use that order for every operation that changes hold capacity. Reload current server time and state after acquiring locks, expire any elapsed accepted hold for the same pair, and check whether another unexpired accepted hold exists.

If capacity is free and the enquiry remains eligible, set ACCEPTED, accepted_at, and hold_expires_at no more than 30 minutes later, increment version, and append the audit event. Commit before showing success. A partial unique index on pharmacy_id and product_id where state = ACCEPTED provides a second safeguard; elapsed rows must be transitioned before inserting a new accepted state. Handle a unique conflict as a user-visible conflict, not an automatic override.

Enquiry creation idempotency is scoped to the requester session and key, with a request-body hash. Reusing a key with different data returns 409. Acceptance and terminal actions also use idempotency keys. Store enough outcome metadata to return the original result safely on network retries. Terminal actions never recreate capacity or refresh stock timestamps implicitly.

## 7 Security and operations

Enforce authorization on every server operation, including resource ownership. Use Secure, HttpOnly, SameSite cookies, CSRF protection for cookie-authenticated mutations, short idle sessions, login throttling, and server-side session revocation. Never store staff credentials or long-lived session secrets in browser local storage. Review a maintained authentication package before implementation; do not implement cryptographic primitives.

Protect contacts with managed encryption keys, restrict database access, and separate development, staging, and production. Keep secrets in the hosting secret store and only placeholders in example configuration. Redact search bodies, contact values, private tokens, and precise coordinates from logs. Set Referrer-Policy: no-referrer on search and enquiry pages. Do not load advertising trackers.

Suggested initial limits are 60 public searches per minute per short-lived network key, five enquiry submissions per ten minutes per private session, and tighter login limits. Tune during pilot testing so shared networks are not locked out unnecessarily. Hash abuse keys and expire them within 24 hours. Limit discrepancies and monitor malicious repeated reports.

Run contact deletion at least daily, with delete_after scheduled so deletion occurs no later than day 30. Use a maximum 30-day backup lifetime, restrict restore access, and reapply a deletion ledger before restored data becomes available. Proposed non-identifying audit retention is 90 days, subject to pilot review. Test deletion and restore procedures with synthetic data.

Set alerts for elevated error rates, failed jobs, stale stock share, and failed backups. Proposed pilot recovery targets are a 24-hour recovery point and a four-hour restoration time; verify these against the hosting plan before promising them. If the database fails, show an availability error and phone fallback, never a cached assertion of stock.

## 8 Delivery and testing

CI runs formatting, type checks, unit tests, PostgreSQL integration tests, production client build, and key browser flows. Test transaction behaviour against PostgreSQL rather than relying on SQLite. Test 24-hour and 30-minute boundaries with a controlled clock, concurrent acceptance, retry idempotency, cross-pharmacy access, expiry when workers are late, and deletion after restore.

Deploy staging with synthetic fixtures first. Run migrations as a controlled release step, back up before destructive schema changes, and use compatible staged migrations so application rollback remains possible. Smoke-test public search, staff updates, and private enquiry access after deployment. Production activation follows the PRD pilot readiness decision.

Manual WhatsApp and telephone operations are sufficient initially. Automated messaging needs separately reviewed provider access, consent, templates, cost, retries, and delivery tracking. The status page remains authoritative if a message is delayed or undelivered.

## 9 Future mobile path

The first release is a responsive website used from desktop and mobile browsers. Later, evaluate React Native with Expo after testing camera-free search and notification needs with users. Share API schemas, validation concepts, and design tokens; expect to rebuild presentation components for native accessibility and navigation.

Native clients should use an appropriate OAuth or OpenID Connect authorization flow with PKCE and platform secure storage rather than copying browser cookie assumptions. Add push notifications only with consent. A later progressive web app may cache the static shell, but offline stock reports remain explicitly unconfirmed and hold decisions still require the server. Existing /api/v1 contracts remain compatible while clients migrate.

## 10 References

Gate 1 proposal, supplied by Team Enigma, pages 8-10, establishes React, FastAPI, PostgreSQL, manual messaging, and conditional development. Additional stack components here are proposed engineering decisions.

- React official documentation: https://react.dev/
- FastAPI official documentation and OpenAPI support: https://fastapi.tiangolo.com/
- PostgreSQL locking reference: https://www.postgresql.org/docs/current/explicit-locking.html

References reviewed 2 October 2026. PRD.md is the authority for product rules and acceptance criteria; DESIGN.md specifies their visible presentation.
