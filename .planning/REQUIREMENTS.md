# Requirements: Circle App Template

**Defined:** 2026-01-31
**Core Value:** Ready-to-deploy Circle.so app infrastructure

## v1 Requirements

Requirements for template transformation. Each maps to roadmap phases.

### Cleanup

- [x] **CLEAN-01**: Remove all Duo workflow pages from `client/src/pages/` (Duo*.tsx files)
- [x] **CLEAN-02**: Remove SessionContext participant/step logic
- [x] **CLEAN-03**: Remove Duo-specific routes from App.tsx router
- [x] **CLEAN-04**: Update branding from "Duo-Connecte" to "Circle App Template"
- [x] **CLEAN-05**: Clean up unused imports and dead code

### Template Structure

- [x] **ARCH-01**: Create ARCHITECTURE.md for AI comprehension (200-400 lines, French, covers stack/structure/auth/extension points)

*Note: Original TMPL-01 to TMPL-05 (UI pages) abandoned per CONTEXT.md - template already has functional pages from cleanup*

### Documentation

- [ ] **DOCS-01**: Complete README.md with installation, configuration, deployment instructions
- [ ] **DOCS-02**: Extension guide explaining how to add new pages and features
- [ ] **DOCS-03**: Inline code comments in key files (contexts, middleware, routes)
- [ ] **DOCS-04**: Code snippets/examples for common patterns (new page, API route, DB query)
- [ ] **DOCS-05**: Document all environment variables and their purposes

### Database

- [ ] **DATA-01**: Create database reset script to clear all user data
- [ ] **DATA-02**: Keep schema intact (users, tickets, config, etc.)
- [ ] **DATA-03**: Document how to run migrations and seed data

## v2 Requirements

Deferred to future release. Not in current scope.

### Enhancements

- **ENH-01**: Multiple template variants (minimal, full-featured)
- **ENH-02**: CLI tool to scaffold new Circle apps from template
- **ENH-03**: Automated testing setup
- **ENH-04**: CI/CD pipeline templates

## Out of Scope

Explicitly excluded from this transformation.

| Feature | Reason |
|---------|--------|
| New admin features | Focus is stripping down, not adding |
| Mobile responsiveness improvements | Current styling works, defer to future |
| Additional auth providers | Circle.so auth is sufficient |
| Internationalization | English only for v1 template |
| Performance optimization | Current performance is acceptable |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEAN-01 | Phase 1 | Complete |
| CLEAN-02 | Phase 1 | Complete |
| CLEAN-03 | Phase 1 | Complete |
| CLEAN-04 | Phase 1 | Complete |
| CLEAN-05 | Phase 1 | Complete |
| ARCH-01 | Phase 2 | Complete |
| DOCS-01 | Phase 3 | Pending |
| DOCS-02 | Phase 3 | Pending |
| DOCS-03 | Phase 3 | Pending |
| DOCS-04 | Phase 3 | Pending |
| DOCS-05 | Phase 3 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| DATA-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 14 total (5 CLEAN + 1 ARCH + 5 DOCS + 3 DATA)
- Mapped to phases: 14
- Unmapped: 0

---
*Requirements defined: 2026-01-31*
*Last updated: 2026-01-31 after Phase 2 completion*
