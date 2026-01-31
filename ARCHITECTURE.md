# Architecture - Circle App Template

## Vue d'Ensemble

Cette template est une application web full-stack conçue pour s'intégrer dans une communauté Circle.so via iframe. Elle fournit une infrastructure d'authentification complète (Circle.so SSO + PIN optionnel), un dashboard d'administration, et un système de contrôle d'accès configurable (paywall, mode développement/production).

**Public cible:** AI (Claude Code avec GSD) qui va utiliser cette template via `/gsd:new-project` pour créer une nouvelle application Circle.so.

---

## Stack Technique

### Core

| Library | Version | Rôle |
|---------|---------|------|
| React | ^18.3.1 | UI Framework - SPA client |
| Vite | ^5.4.20 | Build tool + dev server avec HMR |
| Express | ^4.21.2 | API Server REST |
| Drizzle ORM | ^0.39.1 | Database ORM (PostgreSQL) |
| wouter | ^3.3.5 | Routing client-side léger |
| TanStack Query | ^5.60.5 | Data fetching + cache |
| TailwindCSS | ^3.4.17 | Styling utility-first |

### Supporting

| Library | Version | Rôle |
|---------|---------|------|
| @neondatabase/serverless | ^0.10.4 | PostgreSQL serverless (Neon) |
| jsonwebtoken | ^9.0.2 | JWT pour sessions |
| bcrypt | ^6.0.0 | Hash des PIN |
| zod | ^3.24.2 | Validation schemas |
| drizzle-zod | ^0.7.0 | Génération Zod depuis Drizzle |
| @radix-ui/* | various | Primitives UI (shadcn/ui) |
| lucide-react | ^0.453.0 | Icônes |
| react-hook-form | ^7.55.0 | Gestion des formulaires |

---

## Structure des Dossiers

```
template-app-circle/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── App.tsx              # Routes principales + providers
│   │   ├── main.tsx             # Point d'entrée React
│   │   ├── pages/               # Pages (composants route)
│   │   │   ├── auth.tsx         # Page d'authentification
│   │   │   ├── Welcome.tsx      # Page d'accueil post-auth
│   │   │   ├── dashboard.tsx    # Admin dashboard
│   │   │   ├── admin-login.tsx  # Login admin
│   │   │   ├── SupportPage.tsx  # Page support/tickets
│   │   │   ├── PaywallScreen.tsx# Écran paywall
│   │   │   └── not-found.tsx    # 404
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── admin/           # Composants admin dashboard
│   │   │   ├── ui/              # Primitives UI (shadcn/ui)
│   │   │   ├── GlobalHeader.tsx # Header global
│   │   │   └── theme-provider.tsx
│   │   ├── contexts/            # React contexts
│   │   │   ├── AccessContext.tsx # Gestion accès Circle.so
│   │   │   └── SessionContext.tsx# État session utilisateur
│   │   ├── hooks/               # Custom hooks
│   │   └── lib/                 # Utilitaires
│   │       ├── auth.ts          # Gestion token client
│   │       ├── queryClient.ts   # Config TanStack Query
│   │       └── utils.ts         # Helpers
│   └── index.html
├── server/                      # Backend Express
│   ├── app.ts                   # Config Express, CORS, middleware
│   ├── routes.ts                # Routes principales + health
│   ├── routes/                  # Routes modulaires
│   │   ├── index.ts             # Registre des routes
│   │   ├── auth.ts              # Authentification (validate, PIN)
│   │   ├── admin.ts             # Admin endpoints
│   │   ├── support.ts           # Support tickets
│   │   └── webhooks.ts          # Circle.so webhooks
│   ├── middleware.ts            # JWT, rate limiting, validation
│   ├── storage.ts               # Interface storage (Memory/DB)
│   ├── index-dev.ts             # Entry point développement
│   └── index-prod.ts            # Entry point production
├── shared/                      # Code partagé client/server
│   └── schema.ts                # Drizzle schema + Zod schemas
├── .env.example                 # Template variables d'environnement
├── drizzle.config.ts            # Config migrations DB
├── vite.config.ts               # Config Vite bundler
└── tailwind.config.ts           # Config TailwindCSS
```

---

## Flux d'Authentification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUX D'AUTHENTIFICATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Circle.so ────[postMessage CIRCLE_USER_AUTH]────> AccessContext            │
│       │           { email, name, isAdmin }              │                   │
│       │                                                 │                   │
│       │                                    Stocke email dans localStorage    │
│       │                                                 │                   │
│       │                                    POST /api/auth/validate          │
│       │                                                 │                   │
│       │                            ┌────────────────────┴───────────────┐   │
│       │                            │                                    │   │
│       │                      [new_user]                          [existing] │
│       │                            │                                    │   │
│       │                      PIN requis?                          PIN requis?│
│       │                       /      \                             /     \  │
│       │                     OUI      NON                         OUI    NON │
│       │                      │        │                           │      │  │
│       │               create-pin  auto-login               validate-pin auto│
│       │                      │        │                           │      │  │
│       │                      └────────┴───────────────────────────┴──────┘  │
│       │                                         │                            │
│       │                                  session_token (JWT 60min)           │
│       │                                         │                            │
│       │                              localStorage.setItem('session_token')   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Fichiers clés

- **`client/src/contexts/AccessContext.tsx`** - Écoute les messages `postMessage` de Circle.so, stocke l'email/admin status, vérifie l'accès via `/api/check-access`
- **`server/routes/auth.ts`** - Endpoints `/api/auth/validate`, `/api/auth/create-pin`, `/api/auth/validate-pin`
- **`server/middleware.ts`** - `generateSessionToken()`, `verifySessionToken()`, `requireAuth` middleware
- **`client/src/lib/auth.ts`** - Gestion du token côté client (`getSessionToken`, `setSessionToken`)

### Format du message Circle.so

```typescript
interface CircleUserMessage {
  type: 'CIRCLE_USER_AUTH';
  theme?: 'light' | 'dark';
  user?: {
    email?: string;
    name?: string;
    isAdmin?: boolean;
  };
}
```

---

## Contrôle d'Accès (AccessGate)

Le composant `AccessGate` dans `client/src/App.tsx` contrôle l'accès aux routes selon la configuration.

### Modes

| Mode | Comportement |
|------|--------------|
| `development` | Accès libre - pas de vérification |
| `production` | Vérifie Circle.so origin + paywall optionnel |

### Statuts d'accès

- `loading` - Vérification en cours
- `granted` - Accès autorisé
- `denied` - Accès refusé (paywall)
- `origin_invalid` - Origine non autorisée (pas depuis Circle.so)

### Configuration (via admin panel)

| Option | Effet |
|--------|-------|
| `requireCircleDomain` | Vérifie que l'app est dans un iframe Circle.so |
| `requireCircleLogin` | Requiert un email Circle.so |
| `requirePaywall` | Vérifie que l'email est dans `paid_members` |
| `requirePin` | Demande un PIN après validation Circle.so |

### Routes protégées

```tsx
// Dans App.tsx - SessionRouter
<AccessGate isAdmin={isAdmin}>
  <Switch>
    <Route path="/" component={AuthPage} />          {/* Public */}
    <Route path="/welcome" component={Welcome} />    {/* Public */}
    <Route path="/admin" component={Dashboard} />    {/* Protégé */}
    <Route path="/support" component={SupportPage} /> {/* Protégé */}
  </Switch>
</AccessGate>
```

---

## Points d'Extension

### Ajouter une Page

1. Créer le fichier dans `client/src/pages/MaPage.tsx`
2. Importer et ajouter la route dans `client/src/App.tsx`:

```tsx
import MaPage from "@/pages/MaPage";

// Dans SessionRouter
<Route path="/ma-page" component={MaPage} />
```

### Ajouter une API Route

1. Créer ou modifier dans `server/routes/`
2. Si nouveau fichier, l'enregistrer dans `server/routes/index.ts`:

```typescript
// server/routes/maroute.ts
export function registerMaRouteRoutes(app: Express) {
  app.get('/api/ma-route', (req, res) => { ... });
}

// server/routes/index.ts
import { registerMaRouteRoutes } from './maroute';
export function registerModularRoutes(app: Express) {
  // ...existing routes
  registerMaRouteRoutes(app);
}
```

### Modifier le Schema DB

1. Éditer `shared/schema.ts` - ajouter table ou colonnes
2. Créer les schemas Zod correspondants si nécessaire
3. Run `npm run db:push` pour appliquer les migrations

```typescript
// Exemple: ajouter une table
export const maTable = pgTable("ma_table", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMaTableSchema = createInsertSchema(maTable).omit({
  id: true,
  createdAt: true,
});
```

### Ajouter au Storage

Si nouvelle table, ajouter les méthodes dans `server/storage.ts`:

1. Ajouter à l'interface `IStorage`
2. Implémenter dans `MemStorage` (développement)
3. Implémenter dans `DbStorage` (production)

---

## Configuration

### Variables d'environnement (.env)

```bash
# Obligatoires
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://user:password@host:port/database

# Circle.so
VITE_CIRCLE_ORIGIN=https://your-space.circle.so

# Optionnels
VITE_DEV_MODE=false          # Bypass auth pour dev local
SESSION_TIMEOUT=3600000      # 1 heure en ms
PIN_ATTEMPTS_LIMIT=5         # Max tentatives PIN
PIN_ATTEMPTS_WINDOW=900000   # Fenêtre rate limit (15 min)
PORT=5000                    # Port serveur
NODE_ENV=development         # development | production
```

### Mode Développement vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Storage | `MemStorage` (in-memory) | `DbStorage` (PostgreSQL) |
| Auth | Bypass possible via `VITE_DEV_MODE` | Vérification complète |
| Build | `npm run dev` (Vite HMR) | `npm run build && npm start` |
| Entry | `server/index-dev.ts` | `server/index-prod.ts` |

### Mode App (via Admin Panel)

Le mode `development`/`production` de l'app (pas de Node) se configure dans le dashboard admin (`/admin`). Il contrôle:
- Vérification d'accès stricte ou permissive
- Affichage du paywall
- Validation de l'origine Circle.so

---

## Schema Base de Données

Tables principales dans `shared/schema.ts`:

| Table | Rôle |
|-------|------|
| `users` | Utilisateurs (email, PIN hash, admin status) |
| `login_attempts` | Audit des tentatives de connexion |
| `app_config` | Configuration de l'app (singleton) |
| `paid_members` | Liste des membres payants (paywall) |
| `feedbacks` | Retours utilisateurs |
| `support_tickets` | Tickets de support |

### Relations

- `login_attempts.userId` -> `users.id`
- `paid_members.email` -> vérifié contre `users.email` pour paywall

---

## Scripts NPM

```bash
npm run dev      # Dev server avec HMR
npm run build    # Build production (Vite + esbuild)
npm run start    # Serveur production
npm run check    # TypeScript type check
npm run db:push  # Appliquer migrations Drizzle
```

---

## Notes pour l'AI

- **Providers**: App.tsx enveloppe tout dans QueryClientProvider > ThemeProvider > TooltipProvider > AccessProvider > SessionProvider
- **Routing**: wouter (léger, API similaire à React Router)
- **State management**: TanStack Query pour server state, React Context pour client state
- **UI**: shadcn/ui components dans `client/src/components/ui/`
- **Auth flow**: Circle.so postMessage -> AccessContext -> API validate -> JWT
- **Storage pattern**: Interface permet de switcher Memory/DB sans changer le code métier
