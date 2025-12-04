# Circle.so Authentication Template

## Vue d'ensemble

Template Node.js/Express + React/TypeScript pour intégration Circle.so via iframe avec authentification "Defense in Depth" à 3 couches.

**Usage** : Base réutilisable pour applications Circle.so.

## Architecture de Sécurité

### 3 Couches d'Authentification

1. **Circle.so** : Pages membres uniquement, login natif
2. **PostMessage** : Validation origine + multi-champs (email, publicUid, timestamp 60s max)
3. **NIP Personnel** : 4-6 chiffres, bcrypt 10 rounds, rate limit 5/15min, JWT 60min

## Stack Technique

- **Frontend** : React 18, TypeScript, Wouter, TanStack Query v5, shadcn/ui, Tailwind CSS
- **Backend** : Node.js 20, Express, Drizzle ORM, PostgreSQL (Neon), JWT, bcrypt, express-rate-limit

## Structure

```
client/src/
  components/     # UI (pin-creation, pin-login, theme-provider, mode-toggle)
  contexts/       # config-context.tsx (DEV/PROD mode)
  hooks/          # use-circle-auth.ts (postMessage + thème)
  pages/          # auth.tsx, dashboard.tsx, user-home.tsx
  lib/            # auth.ts, queryClient.ts

server/
  app.ts          # Express + CORS + trust proxy
  routes.ts       # API endpoints
  storage.ts      # DB interface
  middleware.ts   # JWT, bcrypt, rate limiting

shared/
  schema.ts       # Drizzle + Zod schemas
```

## API Endpoints

### POST /api/auth/validate
Valide données Circle.so, retourne `validation_token` (5min) pour nouveaux membres.

### POST /api/auth/create-pin
Crée NIP avec `validation_token`, retourne `session_token` JWT.

### POST /api/auth/validate-pin
Valide NIP (rate limited 5/15min), retourne `session_token` JWT.

### GET /api/auth/me
Infos utilisateur (protégé par JWT).

## Variables d'Environnement

### Backend (process.env)
| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL Neon |
| SESSION_SECRET | Secret sessions |
| DEV_MODE | `true`/`false` - Mode développement |
| CIRCLE_ORIGIN | Origine Circle.so |

### Frontend (import.meta.env)
| Variable | Description |
|----------|-------------|
| VITE_DEV_MODE | Mode DEV (compilé au build) |
| VITE_CIRCLE_ORIGIN | Origine Circle.so |

**Important** : `DEV_MODE` (backend) != `VITE_DEV_MODE` (frontend). Ne jamais utiliser `VITE_*` côté serveur.

## Mode Développement

Utilisateur mock : `dev@example.com` (Admin, redirige vers `/dashboard`)

## Intégration Circle.so

**Handshake bidirectionnel** : L'iframe peut demander les données à Circle.so à tout moment (déconnexion, changement de mode), pas seulement au chargement initial.

Script JavaScript (Header Custom Code) :
```javascript
(function() {
  const IFRAME_ORIGIN = 'https://web-template-base-ok.replit.app';
  let cachedUserData = null;
  
  function buildUserPayload() {
    if (!window.circleUser) return null;
    const isAdmin = window.circleUser.isAdmin === 'true' || window.circleUser.isAdmin === true;
    return {
      type: 'CIRCLE_USER_AUTH',
      user: {
        publicUid: window.circleUser.publicUid,
        email: window.circleUser.email,
        name: window.circleUser.name,
        isAdmin: isAdmin,
        timestamp: Date.now()
      },
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    };
  }
  
  function sendAuthToIframe(iframe) {
    const payload = buildUserPayload();
    if (payload && iframe && iframe.contentWindow) {
      cachedUserData = payload;
      iframe.contentWindow.postMessage(payload, IFRAME_ORIGIN);
    }
  }
  
  // Écouter les demandes de l'iframe
  window.addEventListener('message', function(event) {
    if (event.origin !== IFRAME_ORIGIN) return;
    if (event.data && event.data.type === 'CIRCLE_AUTH_REQUEST') {
      const iframe = document.querySelector('iframe[src*="replit.app"]');
      sendAuthToIframe(iframe);
    }
  });
  
  // Envoi initial au chargement
  window.addEventListener('load', function() {
    const iframe = document.querySelector('iframe[src*="replit.app"]');
    const checkUser = setInterval(function() {
      if (window.circleUser && iframe) {
        clearInterval(checkUser);
        sendAuthToIframe(iframe);
      }
    }, 100);
  });
})();
```

**Points critiques Circle.so** :
- Utilise **camelCase** : `publicUid`, `isAdmin`, `firstName`, `lastName`
- `isAdmin` retourné comme STRING `"true"`/`"false"`, doit être converti en boolean
- Le script écoute `CIRCLE_AUTH_REQUEST` et répond avec les données utilisateur (handshake)

## Sécurité

- Trust proxy configuré pour rate limiting
- CORS dynamique (URL auto-détectée via REPLIT_DEV_DOMAIN/REPLIT_DEPLOYMENT_URL)
- Validation timestamp anti-replay (60s max)
- Sync admin depuis Circle.so à chaque login
- bcrypt 10 rounds, JWT 60min

## Base de Données

```sql
users: id, email, public_uid, name, pin_hash, is_admin, created_at, last_login
login_attempts: id, user_id, success, ip_address, timestamp
```

## Navigation

- **Admins** : Accès `/dashboard` + `/user-home`, boutons navigation
- **Utilisateurs** : `/user-home` uniquement, redirection auto si accès `/dashboard`

## Notes Développeurs

- Mode DEV bypass Circle.so avec utilisateur admin
- Sessions expirent après 60min
- NIP toujours hashé (jamais en clair)
- Thème sync automatique avec Circle.so
- Statut admin sync à chaque connexion
