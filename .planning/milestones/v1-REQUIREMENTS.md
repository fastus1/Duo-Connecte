# Requirements Archive: v1 Railway Migration

**Archived:** 2026-01-30
**Status:** SHIPPED

This is the archived requirements specification for v1.
For current requirements, see `.planning/REQUIREMENTS.md` (created for next milestone).

---

# Requirements: Duo-Connecte Migration

**Defined:** 2026-01-30
**Core Value:** L'app doit fonctionner de maniere fiable dans l'iframe Circle.so avec toutes les couches de securite actives

## v1 Requirements

Requirements pour la migration Replit -> Railway.

### Code Cleanup

- [x] **CLEAN-01**: Supprimer plugins Replit de vite.config.ts (@replit/vite-plugin-*) — COMPLETE
- [x] **CLEAN-02**: Supprimer devDependencies Replit de package.json — COMPLETE
- [x] **CLEAN-03**: Mettre a jour configuration CORS pour Railway (supprimer references REPLIT_*) — COMPLETE

### Railway Configuration

- [x] **RAIL-01**: Creer projet Railway et connecter repository GitHub — COMPLETE
- [x] **RAIL-02**: Configurer toutes les variables d'environnement (DATABASE_URL, JWT_SECRET, CIRCLE_ORIGIN, etc.) — COMPLETE
- [x] **RAIL-03**: Deployer l'application sur Railway — COMPLETE

### Validation

- [x] **VAL-01**: Health endpoint `/api/health` repond correctement — COMPLETE
- [x] **VAL-02**: Frontend se charge et navigation fonctionne — COMPLETE
- [x] **VAL-03**: Connexion base de donnees Neon fonctionne (lecture/ecriture) — COMPLETE
- [x] **VAL-04**: Integration iframe Circle.so fonctionne (postMessage, origin validation) — COMPLETE
- [x] **VAL-05**: Les 4 couches de securite fonctionnent (domaine, user, paywall, PIN) — COMPLETE

## v2 Requirements (Deferred)

Deferred apres migration stable.

### Stabilite

- **STAB-01**: Identifier et corriger bugs existants
- **STAB-02**: Ameliorer gestion d'erreurs
- **STAB-03**: Ajouter logging/monitoring

### Reutilisabilite

- **REUSE-01**: Documenter architecture pour replication
- **REUSE-02**: Extraire composants reutilisables
- **REUSE-03**: Creer template pour nouvelles apps Circle.so

### Nouvelles Features

- A definir apres migration

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mode Solo | Extrait vers application separee |
| Modification auth.ts | Fichier critique, necessite approbation explicite |
| Migration base de donnees | Garder Neon existant |
| Nouvelles fonctionnalites | Apres migration stable |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEAN-01 | Phase 1: Code Cleanup | Complete |
| CLEAN-02 | Phase 1: Code Cleanup | Complete |
| CLEAN-03 | Phase 1: Code Cleanup | Complete |
| RAIL-01 | Phase 2: Railway Setup | Complete |
| RAIL-02 | Phase 2: Railway Setup | Complete |
| RAIL-03 | Phase 2: Railway Setup | Complete |
| VAL-01 | Phase 3: Validation | Complete |
| VAL-02 | Phase 3: Validation | Complete |
| VAL-03 | Phase 3: Validation | Complete |
| VAL-04 | Phase 3: Validation | Complete |
| VAL-05 | Phase 3: Validation | Complete |

**Coverage:**
- v1 requirements: 11 total
- Shipped: 11
- Deferred: 0
- Dropped: 0

---

## Milestone Summary

**Shipped:** 11 of 11 v1 requirements
**Adjusted:** None
**Dropped:** None

All requirements shipped as originally specified. Two minor fixes applied during validation:
1. Circle.so timestamp made optional (schema validation)
2. Admin bypass button added to paywall screen

---
*Archived: 2026-01-30 as part of v1 milestone completion*
