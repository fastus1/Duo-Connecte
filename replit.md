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

## Branding "Avancer Simplement"

### Logo
- **Mode clair** : `logo-bleu-320` (logo bleu)
- **Mode sombre** : `logo-blanc-320` (logo blanc)
- Composant : `client/src/components/logo.tsx`

### Typographie de marque

#### "AVANCER SIMPLEMENT" (Nom de la communauté)
```css
font-family: 'Montserrat', sans-serif;
font-weight: 900;           /* Black */
font-style: italic;
text-transform: uppercase;
/* Mode clair: */ color: #074491;   /* Primary blue */
/* Mode sombre: */ color: #3085F5;  /* Light blue */
```

#### "Présente" (Sous-titre des apps)
```css
font-family: Inter, sans-serif;  /* Police par défaut */
font-weight: 400;                /* Normal */
font-style: italic;
letter-spacing: 0.05em;          /* tracking-wide */
color: var(--muted-foreground);  /* Gris #545861 */
```

### Utilisation
Toutes les apps présentées par Avancer Simplement doivent utiliser ce design de base :
1. Logo adaptatif (bleu/blanc selon thème)
2. Titre "AVANCER SIMPLEMENT" en Montserrat Black Italic majuscules
3. Sous-titre "Présente" en Inter Italic avec espacement

### Couleurs principales
| Élément | Couleur |
|---------|---------|
| Primary (bleu) | `#074491` |
| Muted foreground (gris) | `#545861` |

## Notes Développeurs

- Mode DEV bypass Circle.so avec utilisateur admin
- Sessions expirent après 60min
- NIP toujours hashé (jamais en clair)
- Thème sync automatique avec Circle.so
- Statut admin sync à chaque connexion
