# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** L'app doit fonctionner de maniere fiable dans l'iframe Circle.so avec toutes les couches de securite actives
**Current focus:** v1 complete — ready for next milestone

## Current Position

Milestone: v1 Railway Migration — SHIPPED
Phase: N/A (no active phase)
Plan: N/A
Status: Ready to plan next milestone
Last activity: 2026-01-30 — v1 milestone complete

Progress: Milestone v1 complete

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

Tech debt carried forward to next milestone:
- Support tickets feature not working
- Node 18.19.1 (some packages prefer 20+)
- npm audit vulnerabilities (pre-existing)

## Session Continuity

Last session: 2026-01-30
Stopped at: v1 milestone completed
Resume file: None

---
*Updated: 2026-01-30 after v1 milestone completion*
