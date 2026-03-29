# Frontend Architecture

This package is the Next.js frontend for the SNS automation deployment service.

It is being reorganized into an FSD-style structure, with `app` used only for routing and composition, and feature/domain code moved into layered modules.

## Structure

- `src/app`: route groups, layouts, and page entrypoints
- `src/views`: page-level compositions adapted from the FSD page layer name
- `src/widgets`: large UI blocks assembled from features and entities
- `src/features`: user actions and workflows
- `src/entities`: domain models and their UI/state
- `src/shared`: design tokens, utilities, API client, and shared UI

## Route Groups

The frontend is being expanded into these areas:

- `/(marketing)`: landing page and public product marketing
- `/(auth)`: login, signup, and invite acceptance
- `/(workspace)`: main app shell, overview, approvals, failures, composer, and `my`
- `/(org-admin)`: organization admin area for brands, channels, members, policies, and audit logs
- `/(platform-admin)`: super-admin area for tenants, system health, incidents, and billing

## Pages

- Landing
- Login
- Signup
- Invite acceptance
- My page
- Admin page
- Super-admin page
- Workspace pages for overview, approvals, failures, and content composition

## Design Direction

The UI follows the `Quiet Control Room` direction from `DESIGN.md`.

- Public pages should sell the product and reduce friction
- Auth pages should be short, trustworthy, and focused
- Workspace pages should keep operational density
- Admin and super-admin pages should make hierarchy and system state obvious

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:13000`.

If you need to override the backend URL, copy `.env.example` to `.env.local`.

```powershell
Copy-Item .env.example .env.local
```

Demo auth accounts:

- `admin@example.com`
- `operator@example.com`
- `approver@example.com`
- `viewer@example.com`
- `superadmin@example.com`

Any non-empty password works in local demo mode.

## Notes

- Keep route-specific code in `src/app`
- Keep reusable app logic out of `src/app`
- Avoid reintroducing the old `components/` bucket for new code
