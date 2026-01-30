# Roadmap: Duo-Connecte

## Milestones

- [x] **v1.0 Railway Migration** - Phases 1-3 (shipped 2026-01-30)
- [ ] **v1.1 Fix Support Tickets** - Phase 4 (in progress)

## Phases

<details>
<summary>v1.0 Railway Migration (Phases 1-3) - SHIPPED 2026-01-30</summary>

### Phase 1: Setup
**Goal**: Project migrated from Replit to Railway with basic deployment working
**Plans**: 2 plans

Plans:
- [x] 01-01: Remove Replit dependencies
- [x] 01-02: Configure Railway deployment

### Phase 2: Database
**Goal**: PostgreSQL connection working on Railway
**Plans**: 1 plan

Plans:
- [x] 02-01: Connect Neon PostgreSQL

### Phase 3: Validation
**Goal**: All 4 security layers and Circle.so iframe integration verified
**Plans**: 2 plans

Plans:
- [x] 03-01: Validate security layers
- [x] 03-02: Validate Circle.so iframe integration

</details>

### v1.1 Fix Support Tickets (In Progress)

**Milestone Goal:** Repair the support ticket system so admin receives notifications and can view/respond to tickets in the dashboard.

#### Phase 4: Support Ticket Fixes
**Goal**: Admin can receive, view, and respond to support tickets
**Depends on**: Phase 3 (v1 complete)
**Requirements**: TICK-01, TICK-02, TICK-03
**Success Criteria** (what must be TRUE):
  1. User submits a support ticket and it appears in admin dashboard at `/admin`
  2. Admin receives email notification when a new ticket is created
  3. Admin can view ticket details in the dashboard
  4. Admin can send email reply to user from the dashboard
**Plans**: TBD

Plans:
- [ ] 04-01: TBD (to be defined by plan-phase)

**Root Causes to Fix:**
- Route mismatch: Frontend calls `/api/admin/support/tickets` but backend exposes `/api/support/admin/tickets`
- Email: `RESEND_API_KEY` not configured in Railway

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Setup | v1.0 | 2/2 | Complete | 2026-01-30 |
| 2. Database | v1.0 | 1/1 | Complete | 2026-01-30 |
| 3. Validation | v1.0 | 2/2 | Complete | 2026-01-30 |
| 4. Support Ticket Fixes | v1.1 | 0/? | Not started | - |

---
*Created: 2026-01-30*
*Last updated: 2026-01-30*
