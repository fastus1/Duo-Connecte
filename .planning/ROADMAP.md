# Roadmap: Duo-Connecte Migration

## Overview

Migration de l'application Duo-Connecte de Replit vers Railway. Ce projet nettoie les dependances Replit du code, configure le deploiement Railway, et valide que toutes les fonctionnalites existantes (notamment l'integration iframe Circle.so et les 4 couches de securite) fonctionnent correctement sur la nouvelle plateforme.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Code Cleanup** - Remove Replit-specific dependencies from codebase
- [x] **Phase 2: Railway Setup** - Configure and deploy on Railway platform
- [x] **Phase 3: Validation** - Verify all functionality works on Railway

## Phase Details

### Phase 1: Code Cleanup
**Goal**: Codebase is free of Replit-specific code and ready for Railway deployment
**Depends on**: Nothing (first phase)
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03
**Success Criteria** (what must be TRUE):
  1. `npm run build` succeeds without Replit plugins
  2. `npm run start` succeeds locally without Replit environment variables
  3. No references to `@replit/*` packages remain in codebase
  4. CORS configuration uses Railway-compatible environment variables
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md - Remove Replit plugins, update CORS for Railway, delete config files

### Phase 2: Railway Setup
**Goal**: Application is deployed and running on Railway platform
**Depends on**: Phase 1
**Requirements**: RAIL-01, RAIL-02, RAIL-03
**Success Criteria** (what must be TRUE):
  1. Railway project exists with GitHub repository connected
  2. All required environment variables are configured (DATABASE_URL, JWT_SECRET, CIRCLE_ORIGIN, NODE_ENV)
  3. Application builds successfully on Railway
  4. Application starts and responds to HTTP requests
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md - Deploy to Railway with CLI (create project, set env vars, deploy, verify)

### Phase 3: Validation
**Goal**: All application functionality verified working on Railway deployment
**Depends on**: Phase 2
**Requirements**: VAL-01, VAL-02, VAL-03, VAL-04, VAL-05
**Success Criteria** (what must be TRUE):
  1. Health endpoint `/api/health` responds with 200 OK
  2. Frontend loads completely and navigation between pages works
  3. Database operations work (user can create/read data via Neon PostgreSQL)
  4. Circle.so iframe embedding works (postMessage communication, origin validation)
  5. All 4 security layers function correctly (domain check, user validation, paywall, PIN authentication)
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md - Verify API, frontend, and database functionality (VAL-01, VAL-02, VAL-03)
- [x] 03-02-PLAN.md - Verify Circle.so iframe integration and security layers (VAL-04, VAL-05)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Code Cleanup | 1/1 | Complete | 2026-01-30 |
| 2. Railway Setup | 1/1 | Complete | 2026-01-30 |
| 3. Validation | 2/2 | Complete | 2026-01-30 |

---
*Roadmap created: 2026-01-30*
*Last updated: 2026-01-30*
*Phase 1 completed: 2026-01-30*
*Phase 2 completed: 2026-01-30*
*Phase 3 completed: 2026-01-30*
*Milestone complete: 2026-01-30*
