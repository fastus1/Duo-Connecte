# Circle App Template

## What This Is

A reusable starter template for building apps embedded in Circle.so communities. Provides authentication (Circle.so iframe integration, PIN system), admin dashboard, support ticket system, and user management out of the box. Developers clone this template and build their custom app logic on top.

## Core Value

**Ready-to-deploy Circle.so app infrastructure** — auth, admin, and support systems work immediately so developers can focus on their unique app features instead of boilerplate.

## Requirements

### Validated

<!-- Existing functionality from Duo-Connecte codebase -->

- [x] AUTH: Circle.so iframe authentication with origin validation — existing
- [x] AUTH: PIN-based secondary authentication with bcrypt hashing — existing
- [x] AUTH: JWT session management with 60-min expiry — existing
- [x] AUTH: Rate limiting on PIN attempts (5 per 15 minutes) — existing
- [x] ADMIN: Admin login with separate credentials — existing
- [x] ADMIN: User management (view, search users) — existing
- [x] ADMIN: Support ticket management with statuses — existing
- [x] ADMIN: App configuration (feature flags) — existing
- [x] ADMIN: Analytics/stats dashboard — existing
- [x] SUPPORT: Ticket creation from user side — existing
- [x] SUPPORT: Ticket status tracking — existing
- [x] INFRA: Express API with modular routes — existing
- [x] INFRA: PostgreSQL via Neon serverless — existing
- [x] INFRA: Railway deployment configuration — existing
- [x] INFRA: CORS configured for Circle.so domains — existing
- [x] INFRA: Webhook endpoint for Circle.so events — existing

### Active

<!-- New work for template transformation -->

- [ ] TEMPLATE: Remove all Duo-Connecte specific pages (50+ workflow pages)
- [ ] TEMPLATE: Remove SessionContext participant/step logic
- [ ] TEMPLATE: Create starter home page with header, nav, content area
- [ ] TEMPLATE: Keep one example/demo page showing component structure
- [ ] TEMPLATE: Rename app branding from "Duo-Connecte" to "Circle App Template"
- [ ] DOCS: Add developer documentation in code (README, comments)
- [ ] DOCS: Document how to extend the template with new pages
- [ ] DOCS: Document environment variables and configuration
- [ ] DATA: Provide database reset/seed scripts for clean slate

### Out of Scope

- New features beyond template structure — this is about stripping down, not adding
- Mobile app version — web-first, embedded in Circle.so
- OAuth providers (Google, GitHub) — Circle.so auth is sufficient
- Real-time features (WebSocket chat) — template is request/response based
- Multi-language support — English only for v1

## Context

**Origin:** This template is extracted from "Duo-Connecte", a working production app that runs on Railway and embeds in Circle.so communities via custom HTML blocks.

**Technical environment:**
- Frontend: React 18 + Vite + Tailwind CSS + Radix UI
- Backend: Express.js + TypeScript
- Database: PostgreSQL via Neon serverless + Drizzle ORM
- Deployment: Railway with nixpacks
- Integration: Circle.so iframe embedding with postMessage communication

**Current state:** The codebase has 50+ pages specific to the Duo workflow that need removal. The infrastructure (auth, admin, support) is production-tested and should remain untouched.

**Target users:** Developers (including non-experts) who want to build Circle.so embedded apps without setting up auth/admin from scratch.

## Constraints

- **Tech stack**: Keep existing stack (React, Express, Drizzle, Neon) — no migrations
- **Styling**: Keep current Tailwind + Radix UI design system
- **Deployment**: Must remain Railway-compatible
- **Circle.so**: Must maintain iframe embedding compatibility
- **Database**: Keep all existing tables, just clear data

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep full admin dashboard | Users need user/ticket/config management from day one | — Pending |
| Keep current styling | Avoid scope creep, style is already functional | — Pending |
| Include one demo page | Show developers how to structure new pages | — Pending |
| Clear data, keep schema | Clean template but preserves working structure | — Pending |

---
*Last updated: 2026-01-31 after initialization*
