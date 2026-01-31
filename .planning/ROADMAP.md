# Roadmap: Circle App Template

## Overview

Transform Duo-Connecte into a reusable Circle.so app template by systematically removing application-specific code, establishing a clean starter structure, and documenting the template for developers. Three phases progress from cleanup through structure creation to documentation, delivering a ready-to-clone template.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Cleanup** - Remove Duo-Connecte specific code and rebrand
- [x] **Phase 2: Template Structure** - Create ARCHITECTURE.md for AI comprehension
- [x] **Phase 3: Documentation & Data** - Developer docs and database scripts

## Phase Details

### Phase 1: Cleanup
**Goal**: Strip all Duo-Connecte specific code, leaving only reusable infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04, CLEAN-05
**Success Criteria** (what must be TRUE):
  1. No Duo*.tsx files exist in client/src/pages/
  2. App.tsx router contains only admin, support, and auth routes (no /duo-* routes)
  3. SessionContext no longer references participants or workflow steps
  4. App displays "Circle App Template" branding (not "Duo-Connecte")
  5. Build completes without unused import warnings for removed code
**Plans**: 3 plans in 3 waves

Plans:
- [x] 01-01-PLAN.md — Delete Duo page files and clean up App.tsx router
- [x] 01-02-PLAN.md — Schema, context, and sidebar cleanup
- [x] 01-03-PLAN.md — Branding update and build verification

### Phase 2: Template Structure
**Goal**: Create ARCHITECTURE.md - comprehensive architecture documentation for AI (Claude Code with GSD) to understand and work with the template
**Depends on**: Phase 1
**Requirements**: ARCH-01 (ARCHITECTURE.md creation) - Note: Original UI requirements TMPL-01 to TMPL-05 abandoned per CONTEXT.md
**Success Criteria** (what must be TRUE):
  1. ARCHITECTURE.md exists at project root
  2. Document is in French, 200-400 lines
  3. Contains: Vue d'Ensemble, Stack Technique, Structure des Dossiers, Flux d'Authentification, Points d'Extension, Configuration
  4. ASCII diagram for auth flow included
  5. All file path references are accurate
**Plans**: 1 plan in 1 wave

Plans:
- [x] 02-01-PLAN.md — Create ARCHITECTURE.md for AI comprehension

### Phase 3: Documentation & Data
**Goal**: Provide complete developer documentation and clean-slate database tools
**Depends on**: Phase 2
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. README.md contains installation, configuration, and deployment instructions
  2. Extension guide explains adding new pages with code examples
  3. Key source files have inline comments explaining their purpose
  4. Database reset script exists and clears user data when run
  5. Environment variables are documented with descriptions and examples
**Plans**: 3 plans in 1 wave

Plans:
- [x] 03-01-PLAN.md — Create README.md with complete documentation
- [x] 03-02-PLAN.md — Database reset script and extension guide
- [x] 03-03-PLAN.md — JSDoc comments in key source files

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Cleanup | 3/3 | Complete | 2026-01-31 |
| 2. Template Structure | 1/1 | Complete | 2026-01-31 |
| 3. Documentation & Data | 3/3 | Complete | 2026-01-31 |

---
*Roadmap created: 2026-01-31*
*Last updated: 2026-01-31 - Phase 3 complete, milestone complete*
