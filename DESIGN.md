# Design System - SNS Automation Deployment Service

## Product Context
- **What this is:** an operational SaaS for running SNS publishing safely across brands, channels, approvals, and recovery flows.
- **Who it's for:** operators, approvers, organization admins, and platform super-admins.
- **Project type:** dense operational web app with a public marketing entrypoint and authenticated workspaces.

## Design Areas

### Marketing
- Public landing page that explains the product quickly
- Strong value proposition, trust signals, and clear CTAs
- More open layout than the app shell, but still grounded in the same system

### Auth
- Login, signup, and invite acceptance flows
- Short, low-friction forms
- Trust-first UI with minimal decoration and strong error handling

### Workspace
- Operational dashboard for overview, approvals, failures, composer, and `my`
- High information density
- Status first, cause second
- Keep the control-room feeling from the existing console

### Admin
- Organization-level management for brands, members, channels, policies, and audit logs
- Settings-heavy screens with clear hierarchy
- Data-rich but not noisy

### Super-Admin
- Platform-wide operations for tenants, system health, incidents, and billing
- Stronger warning hierarchy than organization admin
- Make global risk and system state impossible to miss

## Aesthetic Direction
- **Direction:** Quiet Control Room
- **Decoration level:** intentional
- **Mood:** calm, controlled, serious. The product should feel like an operational environment, not a generic SaaS template.

## Typography
- **Display/Hero:** `Sora`
- **Body/UI:** `Noto Sans KR`
- **Data/Tables:** `JetBrains Mono`
- **Loading:** `next/font/google`

## Color
- **Primary:** `#0f766e`
- **Secondary:** `#c76832`
- **Neutrals:** `#f3f1ea`, `#fbfaf6`, `#ffffff`, `#ddd6c8`, `#b8ad98`, `#6b7a7e`, `#38484c`, `#1d2a2f`
- **Semantic:** success `#dff3e7`, warning `#fff1cf`, error `#f7d9d4`, info `#d9ecea`
- Keep purple gradients and generic SaaS gloss out of the system

## Layout
- **Grid:** desktop 12 columns, tablet 8 columns, mobile 4 columns
- **Max content width:** `1440px`
- **Radius:** sm `8px`, md `14px`, lg `20px`, pill `9999px`
- Public pages can breathe wider, authenticated pages should stay denser

## Motion
- **Approach:** minimal-functional
- **Duration:** micro `80ms`, short `160ms`, medium `240ms`, long `420ms`
- Motion should support orientation, not decorate it

## Rules
- Status comes first, cause follows
- Public pages should convert, not merely explain
- Auth screens should reduce hesitation
- Workspace screens should move quickly from signal to action
- Admin and super-admin screens should make scope and authority obvious
- Failure screens should read like a recovery console, not an error dump

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-29 | Quiet Control Room direction retained | The product is about control, safety, and recovery |
| 2026-03-29 | FSD split across marketing, auth, workspace, admin, and super-admin | The UI now has distinct audiences and permission boundaries |
| 2026-03-29 | Public pages get a more sales-oriented presentation | The landing page has to attract and orient new users before login |
