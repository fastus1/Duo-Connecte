# Circle.so Authentication Template

## Vue d'ensemble

Template Node.js/Express + React/TypeScript pour intégration Circle.so via iframe avec authentification "Defense in Depth" à 4 couches configurables.

**Usage** : Base réutilisable pour applications Circle.so sous la marque "Avancer Simplement".

## Guide de Duplication

### Pour créer une nouvelle application basée sur ce template :

1. **Dupliquer le Repl** sur Replit
2. **Créer une nouvelle base de données PostgreSQL** (onglet Database)
3. **Configurer les variables d'environnement** :
   - `SESSION_SECRET` : Générer un nouveau secret unique
   - `WEBHOOK_SECRET` : Générer un nouveau secret pour le webhook
   - `VITE_CIRCLE_ORIGIN` : L'origine de votre communauté Circle.so
4. **Exécuter `npm run db:push`** pour créer les tables
5. **Configurer le Dashboard Admin** : Paywall, couches de sécurité
6. **Ajouter les scripts Circle.so** : Auth (Header) + Webhook (Paywall)

### Ce qui est configurable via le Dashboard Admin :
- 4 couches de sécurité (ON/OFF)
- Paramètres du paywall (titre, message, URLs)
- Membres payants (ajout/suppression manuel)
- Générateur de script webhook

### Ce qui reste constant (branding "Avancer Simplement") :
- Logos (bleu en mode clair, blanc en mode sombre)
- Typographie Montserrat Black Italic
- Couleurs de marque (#074491, #3085F5)

## Architecture de Sécurité

### 4 Couches d'Authentification (Configurables via Dashboard Admin)

1. **Couche 1 - Domaine Circle.so** : Vérifie que l'app est dans l'iframe Circle.so (désactiver pour développement)
2. **Couche 2 - Connexion Circle.so** : Validation postMessage (email, publicUid, timestamp 60s max)
3. **Couche 3 - Paywall** : Vérifie si l'utilisateur a payé (sync via webhook Circle.so)
4. **Couche 4 - NIP Personnel** : 4-6 chiffres, bcrypt 10 rounds, rate limit 5/15min, JWT 60min

### Configuration Dynamique

Toutes les couches sont configurables via le Dashboard Admin (table `app_config`):
- `requireCircleDomain` : Couche 1 ON/OFF
- `requireCircleLogin` : Couche 2 ON/OFF
- `requirePaywall` : Couche 3 ON/OFF (nécessite Couche 2 activée)
- `requirePin` : Couche 4 ON/OFF

### Configuration Paywall

Paramètres personnalisables via Dashboard Admin :
- `paywallTitle` : Titre de l'écran de blocage
- `paywallMessage` : Message explicatif pour les non-payants
- `paywallPurchaseUrl` : Lien vers la page d'achat
- `paywallInfoUrl` : Lien vers plus d'informations (optionnel)

## Stack Technique

- **Frontend** : React 18, TypeScript, Wouter, TanStack Query v5, shadcn/ui, Tailwind CSS
- **Backend** : Node.js 20, Express, Drizzle ORM, PostgreSQL (Neon), JWT, bcrypt, express-rate-limit

## Structure

```
client/src/
  components/     # UI (pin-creation, pin-login, theme-provider, logo)
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

### POST /api/auth/create-user-no-pin
Crée utilisateur sans NIP (quand Couche 4 désactivée).

### POST /api/auth/validate-pin
Valide NIP (rate limited 5/15min), retourne `session_token` JWT.

### GET /api/auth/me
Infos utilisateur (protégé par JWT).

### GET /api/config
Retourne la configuration des couches de sécurité.

### PATCH /api/config
Met à jour la configuration (admin seulement).

### POST /api/auth/check-paywall
Vérifie si un email a accès (membre payant).

### POST /webhooks/circle-payment
Webhook Circle.so pour notifications de paiement (ajoute/supprime membres payants).

### GET /api/admin/paid-members
Liste tous les membres payants (admin seulement).

### POST /api/admin/paid-members
Ajoute manuellement un membre payant (admin seulement).

### DELETE /api/admin/paid-members/:email
Supprime un membre payant (admin seulement).

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL Neon (auto-généré) |
| SESSION_SECRET | Secret pour JWT (générer unique par app) |
| VITE_CIRCLE_ORIGIN | Origine Circle.so (ex: https://votre-communaute.circle.so) |
| WEBHOOK_SECRET | Secret pour sécuriser le webhook (générer unique par app) |

**Note** : Le mode DEV/PROD est maintenant géré via le Dashboard Admin (Couche 1).

---

## Scripts Circle.so

### Script 1 : Authentification (UNIVERSEL - Header Custom Code)

**Ce script fonctionne pour TOUTES les apps Replit.** À placer dans le Header Custom Code de Circle.so une seule fois.

```html
<script>
/************************************************************
 * SCRIPT UNIVERSEL : AUTH + THÈME
 * Fonctionne avec toutes les apps *.replit.app
 ************************************************************/
(function() {
  const ALLOWED_ORIGINS = /\.replit\.app$/;
  
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  function buildPayload() {
    if (!window.circleUser) return null;
    return {
      type: 'CIRCLE_USER_AUTH',
      user: {
        publicUid: window.circleUser.publicUid,
        email: window.circleUser.email,
        name: window.circleUser.name,
        isAdmin: window.circleUser.isAdmin === 'true' || window.circleUser.isAdmin === true,
        timestamp: Date.now()
      },
      theme: getTheme()
    };
  }
  
  function sendToAllIframes() {
    const iframes = document.querySelectorAll('iframe[src*=".replit.app"]');
    const payload = buildPayload();
    if (payload) {
      iframes.forEach(function(iframe) {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(payload, '*');
        }
      });
    }
  }
  
  window.addEventListener('message', function(event) {
    if (ALLOWED_ORIGINS.test(event.origin) && event.data?.type === 'CIRCLE_AUTH_REQUEST') {
      sendToAllIframes();
    }
  });
  
  let sent = false;
  const interval = setInterval(function() {
    if (window.circleUser && !sent) {
      sendToAllIframes();
      sent = true;
      clearInterval(interval);
    }
  }, 500);
  
  setTimeout(function() { clearInterval(interval); }, 30000);
})();
</script>
```

**Sécurité** : Les 4 couches de validation côté serveur restent actives :
- Couche 1 : Vérification du Referer Circle.so
- Couche 2 : Validation timestamp (60s max anti-replay)
- Couche 3 : Vérification paywall en base de données
- Couche 4 : Hash bcrypt du NIP

---

### Script 2 : Webhook Paiement (SPÉCIFIQUE par app - Paywall Custom Code)

**Ce script doit être généré pour CHAQUE app.** Utiliser le générateur dans Dashboard Admin > onglet "Webhook".

Le générateur crée automatiquement le script avec :
- L'URL de l'app (ex: `https://mon-app.replit.app/webhooks/circle-payment`)
- Le secret webhook (doit correspondre à la variable `WEBHOOK_SECRET`)

**Exemple de script généré :**
```html
<script>
const WEBHOOK_SECRET = 'votre-secret-ici';
fetch('https://votre-app.replit.app/webhooks/circle-payment', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-Webhook-Secret': WEBHOOK_SECRET
  },
  body: JSON.stringify({
    event: 'payment_received',
    user: { 
      email: '{member_email}', 
      timestamp: Math.floor(Date.now() / 1000) 
    },
    payment: {
      paywall_display_name: '{paywall_display_name}',
      amount_paid: '{amount_paid}',
      coupon_code: '{coupon_code}'
    }
  })
});
</script>
```

**Où coller ce script** : Dans le Custom Code de chaque paywall Circle.so qui donne accès à l'app.

---

## Points Critiques Circle.so

- Utilise **camelCase** : `publicUid`, `isAdmin`, `firstName`, `lastName`
- `isAdmin` retourné comme STRING `"true"`/`"false"`, doit être converti en boolean
- `window.circleUser` disponible après chargement complet de la page

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
app_config: id, require_circle_domain, require_circle_login, require_paywall, require_pin, 
            paywall_purchase_url, paywall_info_url, paywall_title, paywall_message, 
            webhook_app_url, updated_at
paid_members: id, email (unique), public_uid, source, payment_plan, amount_paid, 
              coupon_used, payment_date, created_at
```

## Navigation

- **Admins** : Accès `/dashboard` + `/user-home`, boutons navigation + configuration sécurité
- **Utilisateurs** : `/user-home` uniquement, redirection auto si accès `/dashboard`

## Dashboard Admin (5 onglets)

1. **Accueil** : Infos session, bienvenue
2. **Sécurité** : 4 couches ON/OFF
3. **Paywall** : Titre, message, URLs
4. **Membres** : Liste et gestion des membres payants
5. **Webhook** : Générateur de script Circle.so

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
font-family: Inter, sans-serif;
font-weight: 400;
font-style: italic;
letter-spacing: 0.05em;
color: var(--muted-foreground);
```

### Couleurs principales
| Élément | Couleur |
|---------|---------|
| Primary (bleu) | `#074491` |
| Muted foreground (gris) | `#545861` |

## Notes Développeurs

- Couche 1 désactivée = Mode développement (utilisateur mock `dev@example.com`)
- Sessions expirent après 60min
- NIP toujours hashé (jamais en clair)
- Thème sync automatique avec Circle.so
- Statut admin sync à chaque connexion
- Configuration sécurité persistante en base de données
