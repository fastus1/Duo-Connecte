# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** L'app doit fonctionner de maniere fiable dans l'iframe Circle.so avec toutes les couches de securite actives
**Current focus:** v1.1 Fix Support Tickets

## Current Position

Milestone: v1.1 Fix Support Tickets
Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-01-30 — Milestone v1.1 started

Progress: Milestone v1.1 in progress

## Milestone Summary

**v1 Railway Migration (2026-01-30):**
- 3 phases, 4 plans completed
- 11/11 requirements shipped
- Production: https://duo-connecte-production.up.railway.app

See: .planning/MILESTONES.md for full details

## Accumulated Context

### Decisions

All decisions are logged in PROJECT.md Key Decisions table.

**v1 Decisions:**
- Railway as deployment platform
- Keep Neon PostgreSQL
- RAILWAY_PUBLIC_DOMAIN for CORS
- APP_URL for email links
- Timestamp optional in Circle schema
- Admin bypass on paywall

### Pending Todos

None.

### Blockers/Concerns

**v1.1 Root Causes Identified:**
- Route mismatch: Frontend calls `/api/admin/support/tickets` but backend exposes `/api/support/admin/tickets`
- Email: RESEND_API_KEY not configured in Railway

Tech debt carried forward:
- Node 18.19.1 (some packages prefer 20+)
- npm audit vulnerabilities (pre-existing)

## Session Continuity

Last session: 2026-01-30
Stopped at: v1.1 milestone started, requirements gathered
Resume file: None

---
*Updated: 2026-01-30 after v1.1 milestone start*
