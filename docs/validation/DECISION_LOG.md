# Architectural & Product Decision Log (ADR) 🏛️

All significant decisions regarding technology stack, privacy boundaries, and core workflows are recorded here.

---

## ADR-001: Separation of Stock Status from Precise Inventory Counts
- **Date**: 2026-10-14
- **Status**: Accepted
- **Context**: Community pharmacists expressed concern that displaying exact pill quantities publicly poses security and competitive risks.
- **Decision**: Public search will display discrete availability indicators (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`) rather than exact inventory quantities.
- **Consequences**: Protects pharmacy privacy while still providing patients with actionable availability data.

---

## ADR-002: Automatic 30-Minute Expiry for Stock Holds
- **Date**: 2026-10-14
- **Status**: Accepted
- **Context**: Pharmacists cannot hold critical medications indefinitely if patients do not arrive.
- **Decision**: Temporary holds will automatically expire after 30 minutes unless renewed or confirmed by the pharmacist.
- **Consequences**: Balances patient convenience with pharmacy inventory turnover.

---

## ADR-003: Asynchronous FastAPI Backend with Pydantic v2
- **Date**: 2026-10-14
- **Status**: Accepted
- **Context**: High-concurrency geo-search queries and realtime stock notifications require high-throughput I/O.
- **Decision**: Adopt Python FastAPI with SQLAlchemy 2.0 async engine and Pydantic v2.
- **Consequences**: High performance, strict type validation, and automatic OpenAPI documentation generation.
