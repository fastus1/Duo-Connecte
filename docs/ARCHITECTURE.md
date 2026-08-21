# Architecture de la plateforme

Documentation de la base reusable de l'application. Ne couvre pas le contenu specifique (parcours Duo), seulement l'infrastructure : authentification, securite, paiement, admin, feedback, support.

---

## Table des matieres

1. [Vue d'ensemble](#1-vue-densemble)
2. [Systeme d'authentification](#2-systeme-dauthentification)
3. [Couches de securite](#3-couches-de-securite)
4. [Sessions JWT et token version](#4-sessions-jwt-et-token-version)
5. [Systeme de paiement (Paywall)](#5-systeme-de-paiement-paywall)
6. [Panneau d'administration](#6-panneau-dadministration)
7. [Feedback et support](#7-feedback-et-support)
8. [Base de donnees](#8-base-de-donnees)
9. [Deploiement](#9-deploiement)
10. [Integration Circle.so](#10-integration-circleso)
11. [Reutiliser pour une autre app](#11-reutiliser-pour-une-autre-app)

---

## 1. Vue d'ensemble

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS |
| Routing client | wouter |
| State serveur | TanStack React Query |
| Backend | Express.js + TypeScript |
| ORM | Drizzle |
| Base de donnees | PostgreSQL (Neon serverless) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Email | Resend |
| Deploiement | Railway (prod) / Portainer (staging) |

### Structure des fichiers cles

```
shared/
  schema.ts              # Schema DB + types + validation Zod

server/
  app.ts                 # Express setup, CORS, CSP headers
  middleware.ts          # JWT, bcrypt, rate limiting, requireAuth
  routes.ts              # Routes racine (/api/config, /api/check-access, etc.)
  storage.ts             # Couche d'abstraction DB (interface + implementations)
  routes/
    index.ts             # Enregistrement des routes modulaires
    auth.ts              # Endpoints d'authentification
    admin.ts             # Endpoints admin proteges
    webhooks.ts          # Webhook de paiement Circle.so
    support.ts           # Tickets de support + email

client/src/
  App.tsx                # Routing principal, AccessGate, SessionRouter
  lib/auth.ts            # Gestion token session (localStorage)
  hooks/use-circle-auth.ts  # Hook postMessage Circle.so
  contexts/
    AccessContext.tsx     # Controle d'acces (origine, login, paywall)
    SessionContext.tsx    # Etat du parcours utilisateur
  pages/
    auth.tsx             # Page d'authentification principale
    dashboard.tsx        # Panneau admin (onglets)
  components/admin/
    SecurityTab.tsx      # Toggles couches + reset sessions
    PaywallTab.tsx       # Configuration paywall
    MembersTab.tsx       # Gestion membres payants
    WebhookTab.tsx       # URL webhook
```

---

## 2. Systeme d'authentification

### Flux complet

```
Circle.so (page parent)
  |
  |  window.circleUser disponible brievement
  |  Script capture: email, name, publicUid, isAdmin
  |
  v  postMessage({ type: 'CIRCLE_USER_AUTH', user, theme })

App (iframe)
  |
  |  useCircleAuth() recoit le message
  |  Cache dans localStorage (7 jours)
  |
  v  POST /api/auth/validate { user }

Backend
  |
  |  Cherche l'utilisateur par email
  |
  +---> Utilisateur inconnu?
  |       requirePin=true  --> status: 'new_user' (creer NIP)
  |       requirePin=false --> status: 'auto_login' + session_token
  |
  +---> Utilisateur connu, pas de NIP?
  |       --> status: 'missing_pin' (creer NIP)
  |
  +---> Utilisateur connu, a un NIP?
          --> status: 'existing_user' (saisir NIP)
```

### Endpoints auth

| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/validate` | Handshake Circle.so -> backend |
| POST | `/api/auth/create-pin` | Creer un NIP (4-6 chiffres) |
| POST | `/api/auth/validate-pin` | Valider un NIP existant |
| POST | `/api/auth/create-user-no-pin` | Creer un compte sans NIP |
| POST | `/api/auth/admin-login` | Login admin (email + NIP) |
| GET | `/api/auth/me` | Profil utilisateur courant |
| POST | `/api/auth/check-paywall` | Verifier l'acces paywall |

### Cache de validation

Le backend utilise un cache memoire pour les tokens de validation :
- Duree de vie : 5 minutes
- Lie a un email + publicUid specifique
- Usage unique (supprime apres utilisation)
- Nettoye automatiquement chaque minute

---

## 3. Couches de securite

### Les 4 couches

```
Couche 1 : Domaine Circle.so (requireCircleDomain)
  L'app doit etre accedee via l'iframe Circle.so.
  Verifie l'origine des postMessages.
  Si desactive : l'app est accessible directement (mode dev).

Couche 2 : Login Circle.so (requireCircleLogin)
  L'utilisateur doit etre connecte a Circle.so.
  Necessite la Couche 1 (sinon pas de postMessage).
  Si desactive : visiteurs non connectes peuvent voir l'app.

Couche 3 : Paywall (requirePaywall)
  L'email doit etre dans la table paid_members.
  Necessite les Couches 1 et 2 (pour connaitre l'email).
  Les admins passent toujours (bypass automatique).

Couche 4 : NIP personnel (requirePin)
  L'utilisateur doit creer puis saisir un NIP de 4-6 chiffres.
  Stocke en bcrypt (10 rounds).
  Rate-limite : 5 tentatives / 15 minutes.
  Utile pour les apps avec donnees sensibles.
```

### Dependances entre couches

- Couche 2 active automatiquement Couche 1
- Couche 3 active automatiquement Couches 1 et 2
- Couche 4 est independante (mais a besoin d'un email pour identifier l'utilisateur)

### Combinaisons typiques

| Cas d'usage | C1 | C2 | C3 | C4 |
|-------------|----|----|----|----|
| App gratuite dans Circle | ON | ON | OFF | OFF |
| App payante dans Circle | ON | ON | ON | OFF |
| App payante + donnees privees | ON | ON | ON | ON |
| Mode developpement | OFF | OFF | OFF | OFF |

### Admin bypass

Les administrateurs (`users.isAdmin = true`) :
- Passent toujours la Couche 3 (paywall), meme sans etre dans `paid_members`
- Doivent quand meme saisir leur NIP si Couche 4 active
- Ont acces au panneau admin (`/admin`)

---

## 4. Sessions JWT et token version

### Structure du JWT

```json
{
  "userId": "uuid-...",
  "email": "user@example.com",
  "tokenVersion": 0,
  "iat": 1234567890,
  "exp": 1234571490
}
```

- Signe avec `SESSION_SECRET` (variable d'environnement)
- Expire apres 60 minutes
- Stocke cote client dans `localStorage` (`session_token`)

### Token version (reset global des sessions)

Le champ `tokenVersion` dans `app_config` permet d'invalider toutes les sessions d'un coup :

1. Admin clique "Reset sessions" dans le panneau admin
2. `tokenVersion` incremente (0 -> 1 -> 2 -> ...)
3. Tous les JWT existants ont une version inferieure
4. Au prochain appel `/api/auth/me`, le serveur compare les versions
5. Si `jwt.tokenVersion < config.tokenVersion` -> 401 -> re-authentification

### Verification cote client

Deux points de verification :
- **Page auth** (`auth.tsx`) : appelle `/api/auth/me` avant de rediriger vers `/welcome`
- **Dashboard** (`dashboard.tsx`) : appelle `/api/auth/me` au chargement, redirige vers `/` si 401

### localStorage utilise

| Cle | Contenu | Duree |
|-----|---------|-------|
| `session_token` | JWT | 60 min |
| `user_id` | UUID utilisateur | Session |
| `session_timestamp` | Heure de creation | Session |
| `user_email` | Email (pour re-check paywall) | Session |
| `is_admin` | Boolean | Session |
| `circle_user_data` | Donnees Circle.so en cache | 7 jours |

---

## 5. Systeme de paiement (Paywall)

### Flux de paiement

```
Utilisateur paie sur Circle.so
  |
  v  Circle.so envoie un webhook

POST /webhooks/circle-payment
  Header: x-webhook-secret = WEBHOOK_SECRET
  Body: { event: 'payment_received', user: { email }, payment: { ... } }
  |
  v  Email normalise et ajoute a paid_members

Prochaine visite de l'utilisateur :
  /api/auth/check-paywall { email }
  --> { hasAccess: true }
```

### Ajout manuel

L'admin peut aussi ajouter des membres payants manuellement :
- POST `/api/admin/paid-members` `{ email }`
- Plan affiche : "Manual"

### Ecran paywall

Quand un utilisateur est bloque, il voit :
- Titre et message configurables
- Bouton "Acheter" (lien externe)
- Bouton "Plus d'informations" (lien externe)
- Bouton "Actualiser" (apres achat)
- Lien vers login admin

### Configuration

Via le panneau admin, onglet Paywall :
- `paywallTitle` : Titre affiche
- `paywallMessage` : Message affiche
- `paywallPurchaseUrl` : Lien d'achat
- `paywallInfoUrl` : Lien d'information

---

## 6. Panneau d'administration

### Acces

- Route : `/admin`
- Accessible via le header (icone engrenage, visible seulement pour les admins)
- Protege par `requireAdmin` middleware (Bearer token + `isAdmin` en DB)
- Login alternatif : `/admin-login` (email + NIP, sans Circle.so)

### Onglets

| Onglet | Fonctionnalite |
|--------|----------------|
| Accueil | Infos session, bienvenue |
| Securite | 4 toggles de couches + bouton reset sessions |
| Paywall | URLs, titre, message |
| Membres | Ajouter/supprimer membres payants, supprimer utilisateurs |
| Webhook | URL webhook (lecture seule) |
| Feedbacks | Voir, archiver, supprimer les feedbacks |
| Support | Voir les tickets, repondre par email |

### Endpoints admin

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/feedbacks` | Lister feedbacks actifs |
| GET | `/api/admin/feedbacks/archived` | Lister feedbacks archives |
| PATCH | `/api/admin/feedbacks/:id/archive` | Archiver |
| DELETE | `/api/admin/feedbacks/:id` | Supprimer |
| GET | `/api/admin/paid-members` | Lister membres payants |
| POST | `/api/admin/paid-members` | Ajouter manuellement |
| DELETE | `/api/admin/paid-members/:email` | Retirer l'acces |
| DELETE | `/api/admin/delete-user/:email` | Supprimer utilisateur completement |
| POST | `/api/admin/reset-user-pin` | Reinitialiser le NIP |
| POST | `/api/admin/reset-sessions` | Invalider toutes les sessions |

---

## 7. Feedback et support

### Feedback (anonyme)

- Collecte en fin de parcours utilisateur
- POST `/api/feedback` (pas d'authentification requise)
- Champs : rating (etoiles), facilite d'achat, clarte, utilite, suggestions, duree, probabilite de reutilisation
- L'admin peut archiver ou supprimer depuis le panneau

### Support (tickets)

- Formulaire accessible a `/support`
- POST `/api/support/tickets` `{ name, email, subject, description }`
- Notification email a l'admin (via Resend)
- L'admin peut repondre depuis le panneau -> email envoye a l'utilisateur
- Statuts : `new` -> `in_progress` -> `resolved`

---

## 8. Base de donnees

### Tables

```sql
users
  id          VARCHAR PK (UUID auto)
  email       TEXT UNIQUE NOT NULL
  public_uid  TEXT UNIQUE NOT NULL
  name        TEXT NOT NULL
  pin_hash    TEXT (nullable)
  is_admin    BOOLEAN DEFAULT false
  created_at  TIMESTAMP
  last_login  TIMESTAMP

app_config (singleton, id='main')
  require_circle_domain  BOOLEAN
  require_circle_login   BOOLEAN
  require_paywall        BOOLEAN
  require_pin            BOOLEAN
  paywall_purchase_url   TEXT
  paywall_info_url       TEXT
  paywall_title          TEXT
  paywall_message        TEXT
  token_version          INTEGER DEFAULT 0
  environment            TEXT
  updated_at             TIMESTAMP

paid_members
  id            VARCHAR PK (UUID auto)
  email         TEXT UNIQUE NOT NULL
  payment_date  TIMESTAMP
  payment_plan  TEXT
  amount_paid   TEXT
  coupon_used   TEXT

login_attempts
  id          VARCHAR PK (UUID auto)
  user_id     VARCHAR (nullable)
  success     BOOLEAN NOT NULL
  ip_address  TEXT
  timestamp   TIMESTAMP
  INDEX(user_id, timestamp)

feedbacks
  id          VARCHAR PK (UUID auto)
  rating      INTEGER NOT NULL
  ... (12 champs optionnels)
  archived    BOOLEAN DEFAULT false
  created_at  TIMESTAMP

support_tickets
  id          VARCHAR PK (UUID auto)
  name        TEXT NOT NULL
  email       TEXT NOT NULL
  subject     TEXT NOT NULL
  description TEXT NOT NULL
  status      TEXT DEFAULT 'new'
  created_at  TIMESTAMP
  resolved_at TIMESTAMP
```

### ORM et migrations

- Drizzle ORM avec schema dans `shared/schema.ts`
- Migration : `DATABASE_URL=... npm run db:push`
- Pas de fichiers de migration generes — Drizzle push compare le schema au DB et applique les diffs

---

## 9. Deploiement

### Environnements

| Env | Branche | Deploiement | Plateforme |
|-----|---------|-------------|------------|
| Local | `staging` | `npm run dev` | Node.js |
| Staging | `staging` | Manuel (Portainer) | Docker |
| Production | `main` | Auto (push) | Railway |

### Workflow obligatoire

```
staging -> tester local -> commit -> push staging
        -> redeploy Portainer -> valider
        -> merge vers main -> Railway deploie auto
```

### Variables d'environnement

**Requises en production :**
```
NODE_ENV=production
SESSION_SECRET=<cle-secrete-jwt>
DATABASE_URL=<url-neon-postgres>
WEBHOOK_SECRET=<secret-webhook-circle>
CIRCLE_ORIGIN=https://communaute.avancersimplement.com
```

**Optionnelles :**
```
RESEND_API_KEY=<pour-emails-support>
APP_DOMAIN=<domaine-custom>
DEV_MODE=true
VITE_APP_ENV=staging|production
```

### Indicateur d'environnement

- **Staging** : Badge orange "STAGING" en bas a gauche
- **Production** : Aucun badge (propre pour les utilisateurs)
- Controle par `VITE_APP_ENV` au build

---

## 10. Integration Circle.so

### Script a installer

Emplacement : Circle.so -> Settings -> Code Snippets -> JavaScript

Le script (`docs/temp/circle-auth-script.html`) fait deux choses :

1. **Theme** : Detecte `light`/`dark` sur Circle.so et envoie a l'iframe
2. **Auth** : Capture `window.circleUser` et envoie les donnees a l'iframe

Comportement :
- Poll `window.circleUser` toutes les 100ms pendant 6 secondes
- Cache les donnees dans une variable (l'objet Circle disparait apres quelques ms)
- Envoie a toutes les iframes `.railway.app` (ou toutes les iframes en fallback)
- Repond aux demandes `CIRCLE_AUTH_REQUEST` de l'app
- Re-envoie au `load` de la page et des iframes

### Donnees transmises

```javascript
{
  type: 'CIRCLE_USER_AUTH',
  user: {
    publicUid: 'abc123',
    email: 'user@example.com',
    name: 'John Doe',
    isAdmin: true,   // string 'true' ou boolean true
    timestamp: Date.now()
  },
  theme: 'dark'
}
```

### CORS et CSP

Configure dans `server/app.ts` :
- CORS permet l'origine Circle.so configuree
- CSP `frame-ancestors` autorise Circle.so a embedder l'app
- `X-Frame-Options` retire pour permettre l'iframe

---

## 11. Reutiliser pour une autre app

### Ce qui est reutilisable tel quel

- Systeme d'auth complet (Circle.so + JWT + NIP)
- 4 couches de securite configurables
- Token version et reset de sessions
- Panneau admin avec onglets
- Gestion des membres payants
- Webhook de paiement
- Feedback et support
- Deploiement Railway + Portainer

### Ce qu'il faut adapter

1. **Remplacer les pages du parcours** : supprimer `client/src/pages/Duo*.tsx`, creer les nouvelles pages
2. **Adapter le routing** dans `App.tsx` (routes, sections, flow config dans `schema.ts`)
3. **Adapter le SessionContext** si le nouveau parcours a un etat different
4. **Changer `CIRCLE_ORIGIN`** si c'est un autre espace Circle.so
5. **Mettre a jour les textes** : paywall, erreurs, labels admin

### Ce qu'il ne faut PAS toucher

- `server/middleware.ts` — systeme JWT stable
- `server/routes/auth.ts` — flux auth complet
- `server/routes/admin.ts` — gestion admin
- `shared/schema.ts` — tables de base (ajouter, ne pas supprimer)
- `client/src/hooks/use-circle-auth.ts` — hook Circle.so
- `client/src/contexts/AccessContext.tsx` — controle d'acces
