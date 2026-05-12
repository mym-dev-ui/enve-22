# Objective
Run a production-scope security scan across the static Next.js application and determine whether any real vulnerabilities remain despite the absence of a backend/API layer.

# Relevant information
- The app is a static export (`next.config.js` -> `output: 'export'`), so there is no production server runtime in this repo.
- Browser storage is the main persistence layer: `localStorage` for visitor records and `sessionStorage` for the active visitor ID.
- Sensitive registration fields include name, phone, ID number, address, email, password, and security code.
- `/dashboard` is an admin-like surface but is publicly routable in the static app.
- Automated scanners returned zero SAST and zero HoundDog findings, so manual review is the primary source of signal.

# Tasks

### T001: Validate client-side sensitive-data exposure
- **Blocked By**: []
- **Details**:
  - Trace what registration fields are persisted, how long they persist, and where they are rendered.
  - Determine whether plaintext browser storage of passwords, codes, and PII is a real production vulnerability under this threat model.
  - Files: `contexts/VisitorContext.tsx`, `lib/types.ts`, `app/registration/step-1/page.tsx`, `app/registration/step-2/page.tsx`, `app/registration/step-3/page.tsx`, `app/dashboard/page.tsx`
  - Acceptance: Confirm or reject a data-exposure finding with concrete evidence and calibrated severity.

### T002: Validate dashboard/operator access control exposure
- **Blocked By**: []
- **Details**:
  - Assess whether `/dashboard` meaningfully creates broken access control or only exposes same-browser local data.
  - Consider shared-device and kiosk-style exploitation scenarios and whether they are relevant enough to report.
  - Files: `app/dashboard/page.tsx`, `contexts/VisitorContext.tsx`, `app/registration/step-4/page.tsx`, `components/TransferVisitorModal.tsx`
  - Acceptance: Confirm or reject an authorization/data-exposure finding with a clear exploit story.

### T003: Validate client-side verification and flow-integrity weaknesses
- **Blocked By**: []
- **Details**:
  - Review hardcoded verification values, client-only step progression, and password-reset behavior.
  - Report only if these weaknesses have production impact beyond local UI state tampering.
  - Files: `app/registration/step-3/page.tsx`, `app/registration/step-4/page.tsx`, `app/password-reset/page.tsx`
  - Acceptance: Confirm or reject findings around spoofing/tampering with clear justification.

### T004: Final synthesis and grouping
- **Blocked By**: [T001, T002, T003]
- **Details**:
  - Review subagent outputs, deduplicate findings, group new vulnerabilities under `.local/new_vulnerabilities/`, and ensure threat model remains current.
  - Acceptance: Findings are grouped correctly, noise is removed, and the scan is ready to report.
