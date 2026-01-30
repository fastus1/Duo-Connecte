# Duo-Connecte

## What This Is

Application de communication authentique guidée entre deux personnes, intégrée à Circle.so via iframe. Parcours structuré "Duo" en 38 étapes avec architecture de sécurité configurable à 4 couches. Marque : "Avancer Simplement".

## Core Value

L'app doit fonctionner de manière fiable dans l'iframe Circle.so avec toutes les couches de sécurité actives — c'est la base de confiance pour les utilisateurs payants.

## Requirements

### Validated

- ✓ Authentification Circle.so (vérification domaine, validation utilisateur) — existing
- ✓ Authentification PIN personnelle (bcrypt, JWT, rate limiting) — existing
- ✓ Vérification paywall (membres payants via webhooks Circle) — existing
- ✓ Parcours Duo 38 étapes avec inversion — existing
- ✓ Dashboard admin avec mode preview — existing
- ✓ Système de tickets support — existing
- ✓ FAQ — existing
- ✓ PWA (manifest, icons, installation banner) — existing
- ✓ Synchronisation thème avec Circle.so — existing
- ✓ Gestion membres (suppression accès/données) — existing

### Active

- [ ] Migration de Replit vers Railway
- [ ] Configuration environnement Railway (variables, build, démarrage)
- [ ] Connexion base de données PostgreSQL (Neon) depuis Railway
- [ ] Validation des 4 couches de sécurité sur Railway
- [ ] Test intégration iframe Circle.so depuis Railway
- [ ] Suppression des dépendances Replit (plugins Vite, variables d'environnement)

### Out of Scope

- Mode Solo — extrait vers application séparée
- Nouvelles fonctionnalités — après migration stable
- Correction de bugs — après migration stable
- Refactoring pour réutilisation — après migration stable

## Context

**Situation actuelle:**
- App fonctionne sur Replit mais dépendance non désirée
- Tentative précédente de migration échouée (erreurs build, env vars, DB)
- Objectif : développer avec Claude Code, déployer sur Railway

**Architecture de sécurité (4 couches):**
1. Vérification domaine Circle.so (postMessage origin)
2. Validation utilisateur Circle (email, nom via postMessage)
3. Paywall (membres payants via webhooks)
4. PIN personnel (bcrypt + JWT sessions)

**Intégration Circle.so:**
- Iframe sur `communaute.avancersimplement.com`
- Communication via postMessage
- Headers CSP `frame-ancestors` pour autoriser embedding

**Base technique:**
- Frontend: React 18, TypeScript, Vite, shadcn/ui, Tailwind
- Backend: Express, Drizzle ORM, PostgreSQL (Neon)
- Auth: JWT (60min expiry), bcrypt (10 rounds)

**Futur:**
- Cette app servira de base/template pour d'autres apps Circle.so
- La fondation (auth, support, etc.) doit être solide

## Constraints

- **Circle.so**: L'intégration iframe et les 4 couches de sécurité sont non-négociables
- **Base de données**: PostgreSQL via Neon (connexion existante à préserver)
- **Auth critique**: Ne pas modifier `server/routes/auth.ts` sans approbation explicite
- **Solo exclus**: Le mode Solo a été extrait — ne pas le réintroduire

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Railway comme plateforme | Alternative à Replit, meilleur contrôle, pas de vendor lock-in | — Pending |
| Garder Neon PostgreSQL | Base existante, évite migration données | — Pending |
| Migration avant améliorations | Stabilité d'abord, features ensuite | — Pending |

---
*Last updated: 2026-01-30 after initialization*
