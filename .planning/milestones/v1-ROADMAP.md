# Milestone v1: Railway Migration

**Status:** SHIPPED 2026-01-30
**Phases:** 1-3
**Total Plans:** 4

## Overview

Migration de l'application Duo-Connecte de Replit vers Railway. Ce projet nettoie les dependances Replit du code, configure le deploiement Railway, et valide que toutes les fonctionnalites existantes (notamment l'integration iframe Circle.so et les 4 couches de securite) fonctionnent correctement sur la nouvelle plateforme.

## Phases

### Phase 1: Code Cleanup

**Goal**: Codebase is free of Replit-specific code and ready for Railway deployment
**Depends on**: Nothing (first phase)
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03
**Plans**: 1 plan
**Status**: Complete (2026-01-30)

Plans:
- [x] 01-01-PLAN.md - Remove Replit plugins, update CORS for Railway, delete config files

**Success Criteria (verified):**
1. `npm run build` succeeds without Replit plugins
2. `npm run start` succeeds locally without Replit environment variables
3. No references to `@replit/*` packages remain in codebase
4. CORS configuration uses Railway-compatible environment variables

### Phase 2: Railway Setup

**Goal**: Application is deployed and running on Railway platform
**Depends on**: Phase 1
**Requirements**: RAIL-01, RAIL-02, RAIL-03
**Plans**: 1 plan
**Status**: Complete (2026-01-30)

Plans:
- [x] 02-01-PLAN.md - Deploy to Railway with CLI (create project, set env vars, deploy, verify)

**Success Criteria (verified):**
1. Railway project exists with GitHub repository connected
2. All required environment variables are configured (DATABASE_URL, JWT_SECRET, CIRCLE_ORIGIN, NODE_ENV)
3. Application builds successfully on Railway
4. Application starts and responds to HTTP requests

### Phase 3: Validation

**Goal**: All application functionality verified working on Railway deployment
**Depends on**: Phase 2
**Requirements**: VAL-01, VAL-02, VAL-03, VAL-04, VAL-05
**Plans**: 2 plans
**Status**: Complete (2026-01-30)

Plans:
- [x] 03-01-PLAN.md - Verify API, frontend, and database functionality (VAL-01, VAL-02, VAL-03)
- [x] 03-02-PLAN.md - Verify Circle.so iframe integration and security layers (VAL-04, VAL-05)

**Success Criteria (verified):**
1. Health endpoint `/api/health` responds with 200 OK
2. Frontend loads completely and navigation between pages works
3. Database operations work (user can create/read data via Neon PostgreSQL)
4. Circle.so iframe embedding works (postMessage communication, origin validation)
5. All 4 security layers function correctly (domain check, user validation, paywall, PIN authentication)

---

## Milestone Summary

**Key Decisions:**
- Railway as deployment platform (alternative to Replit, better control, no vendor lock-in)
- Keep Neon PostgreSQL (existing database, avoid data migration)
- Migration before improvements (stability first, features later)
- Use RAILWAY_PUBLIC_DOMAIN for automatic Railway domain detection
- Use APP_URL env var for email links with RAILWAY_PUBLIC_DOMAIN fallback

**Issues Resolved:**
- Circle.so timestamp validation (made optional in Zod schema)
- Admin paywall bypass (added admin access button)
- Replit plugin dependencies (all removed)
- CORS configuration for Railway environment

**Issues Deferred:**
- Support tickets feature not working (outside migration scope)
- Node engine upgrade to 20+ (not blocking)
- npm audit vulnerabilities (pre-existing)

**Technical Debt Incurred:**
- Running Node 18.19.1, some packages prefer Node 20+
- npm audit vulnerabilities not addressed (pre-existing)

---

*For current project status, see .planning/ROADMAP.md (created for next milestone)*
*Archived: 2026-01-30 as part of v1 milestone completion*
