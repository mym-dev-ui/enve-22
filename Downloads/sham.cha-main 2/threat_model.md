# Threat Model

## Project Overview

Sham Cash is a Next.js 14 App Router application with server runtime enabled. It includes client-side registration/dashboard pages plus server-side API routes under `app/api/visitors/**` that persist visitor records to `/tmp/shamcha-visitors.json` on the running node instance. Active registration tracking remains in browser `sessionStorage` via `currentVisitorId`, while shared visitor records are synchronized through the API.

Production scope includes both browser routes and the server API handlers. Per platform assumptions, TLS is handled by the deployment platform and the mockup sandbox is not production.

## Assets

- **Visitor PII** — full name, phone number, ID number, and address collected during registration. Exposure would reveal sensitive personal data.
- **Account-style credentials and codes** — email address, password, security code, and verification code fields represented in the registration data model. Even if this app is currently static-only, collecting or persisting these values insecurely would create a credential-handling risk.
- **Registration state** — visitor progress, completion state, and transfer actions exposed in the dashboard. Tampering can falsify workflow state and expose previously entered data on shared devices.

## Trust Boundaries

- **Browser route boundary** — all pages are directly reachable by the client. Dashboard route protection is still client-side (`sessionStorage`), so it should not be treated as strong authentication.
- **User input to server store boundary** — registration fields cross from browser form state into server API routes and then to `/tmp/shamcha-visitors.json`.
- **Visitor flow to dashboard boundary** — dashboard data now comes from server APIs and is polled by clients; records are no longer browser-local by default.

## Scan Anchors

- **Production entry points:** `app/page.tsx`, `app/registration/**`, `app/password-reset/page.tsx`, `app/dashboard/page.tsx`
- **Highest-risk code areas:** `contexts/VisitorContext.tsx`, `app/api/visitors/route.ts`, `app/api/visitors/[id]/route.ts`, `app/api/visitors/store.ts`, `app/dashboard/page.tsx`, registration step pages
- **Public vs authenticated vs admin surfaces:** all routes are public in this repo; `/dashboard` behaves like an admin surface but has no server-side protection
- **Dev-only / usually out of scope:** `.next/`, `out/`, `node_modules/`, attached scratch files under `attached_assets/`

## Threat Categories

### Information Disclosure

The main confidentiality risk is persistence of sensitive registration data in a non-encrypted server file (`/tmp/shamcha-visitors.json`) and rendering it in the dashboard (including credential-like fields). The application must not persist credentials or sensitive PII in plaintext longer than necessary, and admin-style views must not expose records to unauthorized users.

### Tampering

Because the browser is the only execution environment, all workflow state can be modified by the user. Route progression, current step, and visitor completion state must be treated as untrusted client data. Security-sensitive decisions must not rely on client-only step indicators, hardcoded verification values, or local state transitions if the application later gains real backend effects.

### Spoofing / Elevation of Privilege

This repo has no real authentication system, but `/dashboard` is an operator-style surface that displays and manipulates stored visitor records. If the app is used in shared-browser or kiosk-style workflows, any user who can open the route can act as an operator for data already stored in that browser. Any future production version must enforce operator authentication and authorization outside the client.
