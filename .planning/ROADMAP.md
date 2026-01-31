# Roadmap: Circle App Template

## Overview

Transform Duo-Connecte into a reusable Circle.so app template by systematically removing application-specific code, establishing a clean starter structure, and documenting the template for developers. Three phases progress from cleanup through structure creation to documentation, delivering a ready-to-clone template.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Cleanup** - Remove Duo-Connecte specific code and rebrand
- [ ] **Phase 2: Template Structure** - Create starter home page and example components
- [ ] **Phase 3: Documentation & Data** - Developer docs and database scripts

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
**Plans**: TBD

Plans:
- [ ] 01-01: TBD

### Phase 2: Template Structure
**Goal**: Establish a clean, welcoming starter structure for developers
**Depends on**: Phase 1
**Requirements**: TMPL-01, TMPL-02, TMPL-03, TMPL-04, TMPL-05
**Success Criteria** (what must be TRUE):
  1. Home page loads at root URL with visible header, content area, and footer
  2. Header shows app title and navigation links (Home, Admin if logged in)
  3. Content area displays guidance text about the template
  4. Demo page exists showing how to structure a new page with components
  5. Navigation between Home and Demo page works
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

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
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Cleanup | 0/TBD | Not started | - |
| 2. Template Structure | 0/TBD | Not started | - |
| 3. Documentation & Data | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-31*
*Last updated: 2026-01-31*
