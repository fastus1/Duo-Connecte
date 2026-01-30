---
phase: 01-code-cleanup
plan: 01
subsystem: infra
tags: [vite, railway, cors, deployment, cleanup]

# Dependency graph
requires: []
provides:
  - Clean Vite configuration without Replit plugins
  - Railway-compatible CORS configuration
  - Dynamic email URL using APP_URL/RAILWAY_PUBLIC_DOMAIN
  - Platform-agnostic codebase ready for Railway deployment
affects: [02-railway-setup, 03-validation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Railway env vars (RAILWAY_PUBLIC_DOMAIN, APP_DOMAIN, APP_URL)
    - Dynamic origin detection for CORS

key-files:
  created: []
  modified:
    - vite.config.ts
    - package.json
    - server/app.ts
    - server/routes/support.ts
    - client/src/components/admin/WebhookTab.tsx

key-decisions:
  - "Use RAILWAY_PUBLIC_DOMAIN for automatic Railway domain detection"
  - "Support custom domains via APP_DOMAIN env var"
  - "Use APP_URL env var for email links with RAILWAY_PUBLIC_DOMAIN fallback"

patterns-established:
  - "Railway env pattern: RAILWAY_PUBLIC_DOMAIN for production domain"
  - "Dynamic URL pattern: APP_URL || RAILWAY_PUBLIC_DOMAIN fallback"

# Metrics
duration: 3min
completed: 2026-01-30
---

# Phase 1 Plan 1: Remove Replit Dependencies Summary

**Removed all Replit plugins/config and migrated CORS/URLs to Railway environment variables**

## Performance

- **Duration:** 2m 41s
- **Started:** 2026-01-30T19:48:21Z
- **Completed:** 2026-01-30T19:51:02Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Removed @replit/vite-plugin-* packages from dependencies and vite.config.ts
- Replaced REPLIT_* environment variables with RAILWAY_PUBLIC_DOMAIN
- Made email admin link dynamic using APP_URL with Railway fallback
- Deleted .replit and replit.md configuration files
- Updated WebhookTab.tsx iframe selector for Railway domains

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove Replit Vite plugins and dependencies** - `68eeac9` (feat)
2. **Task 2: Update CORS and email URL configuration for Railway** - `9df4516` (feat)
3. **Task 3: Clean up remaining Replit artifacts and reinstall** - `13d44d2` (chore)

## Files Created/Modified

- `vite.config.ts` - Removed Replit plugin imports and runtime error overlay
- `package.json` - Removed 3 @replit/* devDependencies
- `server/app.ts` - Replaced REPLIT_* with RAILWAY_PUBLIC_DOMAIN for CORS
- `server/routes/support.ts` - Dynamic admin URL in support ticket email
- `client/src/components/admin/WebhookTab.tsx` - Updated iframe selector and placeholder URL for Railway

## Files Deleted

- `.replit` - Replit run configuration
- `replit.md` - Replit documentation file

## Decisions Made

1. **Railway environment variable naming:** Used RAILWAY_PUBLIC_DOMAIN (auto-provided by Railway) as primary domain detection, APP_DOMAIN for custom domains
2. **Email URL strategy:** APP_URL environment variable with RAILWAY_PUBLIC_DOMAIN fallback, localhost fallback for development
3. **Iframe selector update:** Changed from `.replit.app` to `.railway.app` and `.up.railway.app` patterns

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Node engine warnings during npm install (cross-env and resend require Node 20+, current is 18.19.1) - not blocking, packages still function
- Minor npm audit vulnerabilities - not addressed in this cleanup phase, existing issue

## Next Phase Readiness

- Codebase is clean of Replit dependencies
- Ready for Railway deployment configuration (Phase 2)
- Build succeeds without Replit packages
- No blockers for Railway setup

---
*Phase: 01-code-cleanup*
*Completed: 2026-01-30*
