# Duo-Connecte

## What This Is

Application de communication authentique guidée entre deux personnes, intégrée à Circle.so via iframe. Parcours structuré "Duo" en 38 étapes avec architecture de sécurité configurable à 4 couches. Marque : "Avancer Simplement".

**Deployed:** https://duo-connecte-production.up.railway.app

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
- ✓ Migration de Replit vers Railway — v1
- ✓ Configuration environnement Railway (variables, build, démarrage) — v1
- ✓ Connexion base de données PostgreSQL (Neon) depuis Railway — v1
- ✓ Validation des 4 couches de sécurité sur Railway — v1
- ✓ Test intégration iframe Circle.so depuis Railway — v1
- ✓ Suppression des dépendances Replit (plugins Vite, variables d'environnement) — v1

### Active

(No active requirements — define in next milestone)

### Out of Scope

- Mode Solo — extrait vers application séparée
- Modification auth.ts — fichier critique, nécessite approbation explicite

## Context

**Current State (v1 shipped 2026-01-30):**
- App deployed on Railway at https://duo-connecte-production.up.railway.app
- Connected to Neon PostgreSQL database
- All 4 security layers verified working
- Circle.so iframe integration validated
- Admin user: fastusone@gmail.com

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
- Deployment: Railway (auto-deploy from GitHub)
- 21,603 lines of TypeScript

**Known Issues (tech debt):**
- Support tickets feature not working
- Node 18.19.1 (some packages prefer 20+)
- npm audit vulnerabilities (pre-existing)

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
| Railway comme plateforme | Alternative à Replit, meilleur contrôle, pas de vendor lock-in | ✓ Good — deployed, stable |
| Garder Neon PostgreSQL | Base existante, évite migration données | ✓ Good — connected, working |
| Migration avant améliorations | Stabilité d'abord, features ensuite | ✓ Good — migration complete |
| RAILWAY_PUBLIC_DOMAIN for CORS | Auto-detection of Railway domain | ✓ Good — works in production |
| APP_URL for email links | Fallback pattern for dynamic URLs | ✓ Good — emails work |
| Timestamp optional in Circle schema | Circle.so doesn't always send timestamp | ✓ Good — fixed validation errors |
| Admin bypass on paywall | Admins need access when paywall enabled | ✓ Good — admins can configure |

---
*Last updated: 2026-01-30 after v1 milestone*
