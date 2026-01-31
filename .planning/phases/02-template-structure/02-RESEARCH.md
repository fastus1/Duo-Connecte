# Phase 2: Template Structure - Research

**Researched:** 2026-01-31
**Domain:** Documentation technique pour AI (ARCHITECTURE.md)
**Confidence:** HIGH

## Summary

Cette recherche porte sur la creation d'un fichier ARCHITECTURE.md en francais pour permettre a une AI (Claude Code avec GSD) de comprendre rapidement cette template Circle.so. L'objectif n'est PAS de creer des pages UI mais de documenter l'architecture existante.

Le projet est une application web full-stack avec:
- **Frontend:** React 18 + Vite + TailwindCSS + wouter (routing)
- **Backend:** Express.js + Drizzle ORM + PostgreSQL (Neon)
- **Integration:** Circle.so via postMessage API (iframe embedding)
- **Auth:** JWT sessions + PIN optionnel + Circle.so SSO

**Primary recommendation:** Creer un ARCHITECTURE.md unique a la racine qui documente la structure des dossiers, les flux principaux (auth, access control), le stack techno, et les points d'extension - le tout en francais avec des diagrammes ASCII strategiques.

## Standard Stack

Cette section documente les technologies DEJA utilisees par le projet (pas de nouvelles installations).

### Core Stack Existant
| Library | Version | Purpose | Role dans le projet |
|---------|---------|---------|---------------------|
| React | ^18.3.1 | UI Framework | Client SPA |
| Vite | ^5.4.20 | Build tool | Dev server + bundling |
| Express | ^4.21.2 | API Server | Backend REST |
| Drizzle ORM | ^0.39.1 | Database | PostgreSQL queries |
| wouter | ^3.3.5 | Routing | Client-side routing |
| TanStack Query | ^5.60.5 | Data fetching | API state management |
| TailwindCSS | ^3.4.17 | Styling | Utility CSS |

### Supporting Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| @neondatabase/serverless | ^0.10.4 | PostgreSQL serverless |
| jsonwebtoken | ^9.0.2 | JWT auth |
| bcrypt | ^6.0.0 | PIN hashing |
| zod | ^3.24.2 | Validation schemas |
| drizzle-zod | ^0.7.0 | Zod schemas from Drizzle |
| @radix-ui/* | various | UI components primitives |
| lucide-react | ^0.453.0 | Icons |

### Configuration Files
| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite bundler config |
| `drizzle.config.ts` | DB migrations config |
| `tailwind.config.ts` | TailwindCSS config |
| `tsconfig.json` | TypeScript config |
| `.env.example` | Environment variables template |

## Architecture Patterns

### Structure du Projet (Verifiee)
```
template-app-circle/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── App.tsx        # Routes + providers principaux
│   │   ├── main.tsx       # Point d'entree React
│   │   ├── pages/         # Pages (composants route)
│   │   ├── components/    # Composants reutilisables
│   │   │   ├── admin/     # Composants admin dashboard
│   │   │   ├── ui/        # Primitives UI (shadcn/ui)
│   │   │   └── flow/      # Composants de flow
│   │   ├── contexts/      # React contexts (Access, Session)
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitaires (auth, queryClient)
│   └── index.html
├── server/                 # Backend Express
│   ├── app.ts             # Config Express, CORS, middleware
│   ├── routes.ts          # Routes principales + health
│   ├── routes/            # Routes modulaires
│   │   ├── auth.ts        # Authentification
│   │   ├── admin.ts       # Admin endpoints
│   │   ├── support.ts     # Support tickets
│   │   └── webhooks.ts    # Circle.so webhooks
│   ├── middleware.ts      # JWT, rate limiting, validation
│   ├── storage.ts         # Couche data (Memory + DB)
│   ├── index-dev.ts       # Entry dev (Vite HMR)
│   └── index-prod.ts      # Entry prod (static files)
├── shared/                 # Code partage client/server
│   └── schema.ts          # Drizzle schema + Zod schemas
└── .env.example           # Variables d'environnement
```

### Pattern 1: Integration Circle.so (iframe + postMessage)
**What:** L'app s'execute dans un iframe Circle.so et recoit les donnees utilisateur via postMessage
**Flux:**
```
Circle.so                          App (iframe)
   |                                    |
   |--[postMessage CIRCLE_USER_AUTH]--->|
   |    { email, name, isAdmin }        |
   |                                    |
   |                              AccessContext recoit
   |                              Stocke dans localStorage
   |                              Verifie acces via /api/check-access
```

**Code reference:** `client/src/contexts/AccessContext.tsx` lignes 150-201

### Pattern 2: Auth Flow (JWT + PIN optionnel)
**What:** Authentification multi-couche avec Circle.so SSO + PIN local optionnel
**Flux:**
```
1. Circle.so postMessage --> AccessContext stocke email
2. POST /api/auth/validate --> Verifie/cree user
3. Si PIN requis:
   - Nouvel user: POST /api/auth/create-pin
   - User existant: POST /api/auth/validate-pin
4. Retourne session_token (JWT 60min)
5. Client stocke dans localStorage
```

**Code references:**
- `server/routes/auth.ts` - Endpoints auth
- `server/middleware.ts` - JWT generation/validation
- `client/src/lib/auth.ts` - Client-side token management

### Pattern 3: Access Control (AccessGate)
**What:** Protection des routes basee sur config admin + status acces
**Modes:**
- `development` - Acces libre
- `production` - Verification Circle.so origin + paywall optionnel

**Code reference:** `client/src/App.tsx` lignes 22-97 (AccessGate component)

### Pattern 4: Storage Layer (Interface pattern)
**What:** Interface IStorage avec MemStorage (dev) et DbStorage (prod)
**Avantage:** Developper sans DB, meme code en prod

**Code reference:** `server/storage.ts`

## Don't Hand-Roll

Cette section est N/A pour cette phase - on documente l'existant, on ne construit pas de features.

| Probleme | Solution existante dans le projet |
|----------|-----------------------------------|
| UI Components | shadcn/ui via @radix-ui/* |
| Forms | react-hook-form + zod |
| Data fetching | TanStack Query |
| Auth tokens | jsonwebtoken |
| Password hash | bcrypt |
| Validation | zod + drizzle-zod |

## Common Pitfalls

### Pitfall 1: Documentation trop detaillee
**What goes wrong:** Documenter chaque fichier individuellement noie l'essentiel
**Why it happens:** Reflexe de completude
**How to avoid:** Se concentrer sur les FLUX et CONNEXIONS, pas les details
**CONTEXT.md dit:** "Detaille - assez pour comprendre les connexions sans noyer dans les details"

### Pitfall 2: Diagrammes excessifs
**What goes wrong:** Trop de diagrammes ASCII rendent la doc illisible
**Why it happens:** Vouloir tout illustrer
**How to avoid:** Diagrammes seulement ou ca CLARIFIE (ex: auth flow)
**CONTEXT.md dit:** "Diagrammes ASCII ou ca clarifie - pas pour le plaisir"

### Pitfall 3: Oublier que le lecteur est une AI
**What goes wrong:** Ecrire pour un humain qui scrolle visuellement
**Why it happens:** Habitude de documentation classique
**How to avoid:** Structure claire avec sections bien nommees, pointers directs vers fichiers
**Best practice:** Une AI peut parser rapidement si la structure est predictible

### Pitfall 4: Documentation en anglais
**What goes wrong:** Ne pas respecter la decision utilisateur
**Why it happens:** Reflexe de documenter en anglais
**How to avoid:** CONTEXT.md specifie explicitement francais
**Note:** Le code reste en anglais, seule la doc ARCHITECTURE.md est en francais

## Code Examples

### Section recommandee pour ARCHITECTURE.md

```markdown
## Points d'Extension

### Ajouter une Page
1. Creer le fichier dans `client/src/pages/MaPage.tsx`
2. Ajouter la route dans `client/src/App.tsx`:
   ```tsx
   <Route path="/ma-page" component={MaPage} />
   ```

### Ajouter une API Route
1. Creer ou modifier dans `server/routes/`
2. Si nouveau fichier, l'enregistrer dans `server/routes/index.ts`

### Modifier le Schema DB
1. Editer `shared/schema.ts`
2. Run `npm run db:push`
```

### Diagramme Auth recommande (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUX D'AUTHENTIFICATION                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Circle.so ──postMessage──> AccessContext                   │
│       │                          │                          │
│       │                    email, name, isAdmin             │
│       │                          │                          │
│       │                    POST /api/auth/validate          │
│       │                          │                          │
│       │              ┌───────────┴───────────┐              │
│       │              │                       │              │
│       │         [new_user]            [existing_user]       │
│       │              │                       │              │
│       │        PIN requis?              PIN requis?         │
│       │         /    \                   /    \             │
│       │       OUI    NON               OUI    NON           │
│       │        │      │                 │      │            │
│       │  create-pin  auto-login    validate-pin  auto-login │
│       │        │      │                 │      │            │
│       │        └──────┴─────────────────┴──────┘            │
│       │                       │                             │
│       │                 session_token (JWT)                 │
│       │                       │                             │
│       │               localStorage.setItem()                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## State of the Art

### Documentation AI-Ready (2026)

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| CONTRIBUTING.md pour humains | CLAUDE.md / ARCHITECTURE.md pour AI | AI parse et comprend le projet |
| Docs eparpilles | Single source of truth | Charge 1 fichier = contexte complet |
| Descriptions vagues | Pointers precis vers fichiers | AI trouve immediatement |

**Sources:**
- [The Complete Guide to CLAUDE.md](https://www.builder.io/blog/claude-md-guide)
- [Claude Code in 2026: SDLC Workflow](https://developersvoice.com/blog/ai/claude_code_2026_end_to_end_sdlc/)
- [AI-Ready Content Architecture Trends](https://www.fluidtopics.com/blog/industry-insights/technical-documentation-trends-2026/)

## Open Questions

### 1. Niveau de detail pour chaque module
- **What we know:** CONTEXT.md dit "detaille mais sans noyer"
- **What's unclear:** Exactement combien de lignes par section?
- **Recommendation:** 3-5 phrases par module, focus sur responsabilite + fichiers cles

### 2. Quels diagrammes inclure
- **What we know:** Auth flow est le plus complexe, beneficierait d'un diagramme
- **What's unclear:** Access control (AccessGate) aussi?
- **Recommendation:** Auth flow definitif, AccessGate optionnel si espace permet

### 3. Sections exactes du ARCHITECTURE.md
- **What we know:** Structure dossiers, flux, techno, points d'extension
- **What's unclear:** Ordre exact, titres
- **Recommendation (Claude's Discretion):**
  1. Vue d'ensemble (1 paragraphe)
  2. Stack Technique (tableau)
  3. Structure des Dossiers (tree)
  4. Flux Principaux (auth, access)
  5. Points d'Extension (ou ajouter pages/API/schema)
  6. Configuration (.env, modes dev/prod)

## Sources

### Primary (HIGH confidence)
- Codebase analysis direct - tous les fichiers lus et analyses
- `package.json` - versions exactes des dependencies
- `shared/schema.ts` - schema DB complet
- `client/src/App.tsx` - routing et providers
- `server/routes/*.ts` - API endpoints

### Secondary (MEDIUM confidence)
- [Builder.io CLAUDE.md Guide](https://www.builder.io/blog/claude-md-guide) - structure doc AI
- [Claude Code Overview](https://code.claude.com/docs/en/overview) - comment Claude utilise les docs

### Tertiary (LOW confidence)
- WebSearch sur trends 2026 - informatif mais non critique pour cette tache

## Metadata

**Confidence breakdown:**
- Comprehension du codebase: HIGH - analyse directe de tous les fichiers
- Structure ARCHITECTURE.md: HIGH - basee sur CONTEXT.md decisions + best practices
- Contenu exact: MEDIUM - certains details a discretion du planner

**Research date:** 2026-01-31
**Valid until:** 60 jours (codebase stable, pas de breaking changes prevus)

---

## Recommandations pour le Planner

### Structure ARCHITECTURE.md proposee

```markdown
# Architecture - Circle App Template

## Vue d'Ensemble
[1 paragraphe: template Circle.so, auth integree, admin dashboard]

## Stack Technique
[Tableau: React, Express, Drizzle, etc.]

## Structure des Dossiers
[Tree: client/, server/, shared/]

## Flux d'Authentification
[Diagramme ASCII + explication]

## Controle d'Acces
[Modes dev/prod, AccessGate]

## Points d'Extension
- Ajouter une page
- Ajouter une API
- Modifier le schema

## Configuration
[.env variables, modes]
```

### Estimation de taille
- Target: 200-400 lignes markdown
- Assez court pour charger en une fois
- Assez complet pour comprendre ou mettre les mains
