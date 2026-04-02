# Duo-Connecte

Application web de communication authentique guidee entre deux personnes, integree dans Circle.so.

## Apercu

Duo-Connecte accompagne deux personnes a travers un processus structure de conversation en 8 sections, base sur la methodologie de "Communication Authentique". L'application guide un emetteur et un recepteur a travers l'expression emotionnelle, la validation mutuelle, l'identification des besoins et la resolution.

### Parcours utilisateur

1. **Accueil & Selection des roles** — Choix emetteur / recepteur
2. **Ancrage** — Preparation emotionnelle et centrage
3. **Perspective de l'emetteur** — Situation, vecu, interpretation, impact
4. **Validation du recepteur** — Reconnaissance de la perspective de l'emetteur
5. **Vecu du recepteur** — Reponse emotionnelle et besoins
6. **Validation croisee** — Les deux parties se valident mutuellement
7. **Besoins & Reponse** — Identification et reponse aux besoins reels
8. **Cloture** — Gratitude et reflexion
9. **Flux inverse** (optionnel) — Inversion des roles (pages 7a-20a)

### Fonctionnalites plateforme

- Integration Circle.so via iframe et postMessage
- Systeme de securite a 4 couches (domaine Circle, login Circle, paywall, PIN)
- Sessions JWT (expiration 60 minutes) avec versionnage de tokens
- PIN personnel 4-6 chiffres (hache bcrypt)
- Tableau de bord administrateur (6 onglets)
- Systeme de support par tickets avec notifications email
- Collecte de feedback anonyme
- Gestion du paywall avec webhook Circle.so
- Theme clair/sombre

## Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 18 + TypeScript + Vite 5.4 |
| **UI** | Tailwind CSS 3.4 + shadcn/ui (Radix UI) |
| **Animations** | Framer Motion 11.13 |
| **Routage** | Wouter 3.3 |
| **State** | TanStack React Query 5.60 |
| **Formulaires** | React Hook Form 7.55 + Zod |
| **Backend** | Express 4.21 + TypeScript |
| **ORM** | Drizzle ORM 0.39 |
| **Base de donnees** | PostgreSQL (Neon serverless) |
| **Auth** | JWT + bcrypt |
| **Email** | Resend 6.6 |
| **Deploiement** | Railway (auto-deploy depuis `main`) |

## Structure du projet

```
duo-connecte/
├── client/src/
│   ├── App.tsx                 # Routeur principal + AccessGate
│   ├── pages/                  # 50+ pages (24 flux principal, 14 inverse, 12 systeme)
│   ├── components/             # 40+ composants reutilisables
│   │   └── ui/                 # Primitives shadcn/ui
│   ├── contexts/
│   │   ├── AccessContext.tsx    # Controle d'acces 4 couches
│   │   └── SessionContext.tsx   # Etat de la conversation
│   ├── hooks/                  # use-circle-auth, use-mobile, use-toast
│   └── lib/                    # auth.ts (gestion JWT), queryClient.ts
│
├── server/
│   ├── app.ts                  # Setup Express, CORS, CSP
│   ├── middleware.ts           # JWT, bcrypt, rate limiting, cache validation
│   ├── storage.ts              # Couche d'abstraction DB
│   ├── routes/
│   │   ├── auth.ts             # Endpoints authentification
│   │   ├── admin.ts            # Endpoints administration
│   │   ├── support.ts          # Tickets de support
│   │   └── webhooks.ts         # Webhook paiement Circle.so
│   ├── index-dev.ts            # Serveur dev (tsx watch)
│   └── index-prod.ts           # Serveur production
│
├── shared/
│   └── schema.ts               # Tables Drizzle + validateurs Zod
│
├── docs/
│   └── ARCHITECTURE.md         # Documentation systeme detaillee
│
├── Dockerfile                  # Build multi-stage Node 20 Alpine
├── nixpacks.toml               # Config build Railway
├── docker-compose.yml          # Config Docker
├── design_guidelines.md        # Lignes directrices UI/UX
└── CLAUDE.md                   # Guide deploiement
```

## Variables d'environnement

### Requises

```bash
JWT_SECRET=                     # Cle de signature JWT (chaine aleatoire longue)
DATABASE_URL=                   # URL PostgreSQL (Neon)
CIRCLE_ORIGIN=                  # Domaine communaute Circle.so
WEBHOOK_SECRET=                 # Secret pour webhooks paiement Circle.so
NODE_ENV=production             # Environnement
```

### Optionnelles

```bash
VITE_APP_ENV=staging            # "staging" ou "production"
RESEND_API_KEY=                 # Notifications email via Resend
APP_DOMAIN=                     # Domaine personnalise
PORT=5000                       # Port serveur (defaut: 5000)
VITE_DEV_MODE=true              # Bypass authentification en dev
PIN_ATTEMPTS_LIMIT=5            # Limite tentatives PIN
PIN_ATTEMPTS_WINDOW=900000      # Fenetre rate limit (15 min)
SESSION_TIMEOUT=3600000         # Duree session (60 min)
```

## Deploiement

### Workflow obligatoire

```
staging → test local → push staging → merge main → Railway
```

**Ne JAMAIS push directement sur `main`.**

### Production (Railway)

Auto-deploy sur push vers `main`. Railway fournit `RAILWAY_PUBLIC_DOMAIN` automatiquement.

### Dev local

```bash
npm install
cp .env.example .env.local
npm run dev
# Frontend: http://localhost:5173 | API: http://localhost:5000
```

## Commandes

```bash
npm run dev         # Serveur dev avec hot reload
npm run build       # Build client (Vite) + serveur (esbuild)
npm start           # Production (node dist/index.js)
npm run check       # Verification TypeScript
npm run db:push     # Pousser le schema vers la DB
```

## Securite (4 couches)

1. **Domaine Circle.so** — App accessible uniquement via iframe Circle.so
2. **Login Circle.so** — Utilisateur connecte a Circle.so
3. **Paywall** — Email dans la table `paid_members` (bypass admin)
4. **PIN** — Code 4-6 chiffres, hache bcrypt, rate-limite (5 tentatives / 15 min)

## Base de donnees

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (email, PIN hash, admin, timestamps) |
| `app_config` | Config globale (toggles securite, paywall, token version) |
| `paid_members` | Liste d'acces paywall |
| `feedbacks` | Feedback anonyme (notes, suggestions) |
| `support_tickets` | Tickets de support (statut, dates) |
| `login_attempts` | Journal des tentatives de connexion |

## Git

- **Repo** : `https://github.com/fastus1/Duo-Connecte.git`
- **Branches** : `main` (prod), `staging` (dev)
- **Backup** : `gitsafe-backup` (serveur interne)

## Statut

**Actif** — En developpement sur la branche `staging`. Deploye en production sur Railway.
