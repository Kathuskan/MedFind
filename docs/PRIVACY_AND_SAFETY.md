# Privacy and Safety Guidelines 🛡️⚕️

MedFind handles sensitive medicine queries and patient health interactions. This document outlines our data minimization, privacy compliance, safety guidelines, and retention policies.

---

## 1. Core Principles

1. **Data Minimization**: Collect only what is strictly necessary to match patient requests with pharmacy stock.
2. **Prescription Integrity**: MedFind never dispenses or authorizes prescription medicines directly; physical verification by a licensed pharmacist is mandatory.
3. **Anonymization & Pseudonymization**: Stock enquiries and search telemetry must be stripped of Personally Identifiable Information (PII) before storage.
4. **Transparent Retention**: Temporary holds and enquiry conversations are retained only for as long as functionally required.

---

## 2. Medicine Holds & Reservations Safety

- Holds are strictly **temporary reservations** (default: 30 minutes).
- Holds do **not** constitute a completed transaction or prescription approval.
- Controlled substances (Schedule II–V or local equivalents) are strictly excluded from automated reservation.
- Patients must present a valid physical or verified electronic prescription upon collection at the pharmacy counter.

---

## 3. Data Retention & Purging Policy

The `retention` service runs periodic background tasks to enforce the following retention schedule:

| Data Type | Retention Period | Action After Expiry |
| :--- | :--- | :--- |
| **Active Stock Holds** | 30 minutes | Automatically released back to inventory |
| **Cancelled / Expired Holds** | 7 days | Anonymized & archived |
| **Guest Inquiries / Chats** | 48 hours | Permanently purged |
| **Audit Logs** | 90 days | Exported to cold storage / pruned |

---

## 4. Compliance and Disclaimers

- MedFind is **not** a substitute for emergency medical care. Emergency banners and poison control numbers must remain visible on user-facing search screens.
- Any vulnerability reports should be directed to the security team immediately.
