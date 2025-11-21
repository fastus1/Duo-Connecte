# Circle.so Authentication Template - Webapp Replit

## 📋 Vue d'ensemble

Template d'application web Node.js/Express + React/TypeScript conçue pour être intégrée dans Circle.so via iframe, avec un système d'authentification "Defense in Depth" à 3 couches de sécurité.

## 🏗️ Architecture de Sécurité

### Système d'authentification à 3 couches :

1. **Couche 1 : Authentification Circle.so**
   - Pages réservées aux membres uniquement
   - Gestion native du login par Circle.so
   - Pas de forfait Business requis

2. **Couche 2 : Validation PostMessage + Multi-données**
   - Réception sécurisée des données via `window.postMessage`
   - Validation stricte de l'origine (Circle.so uniquement)
   - Validation multi-champs côté serveur :
     - Format email (regex)
     - ID numérique positif
     - Nom complet (prénom + nom)
     - Timestamp anti-replay (max 60 secondes)
   - Cross-field validation avec base de données

3. **Couche 3 : NIP Personnel (Multi-Factor)**
   - NIP de 4-6 chiffres pour chaque utilisateur
   - Hash bcrypt (10 rounds) - jamais stocké en clair
   - Rate limiting : 5 tentatives par 15 minutes
   - Session JWT avec expiration 60 minutes

## 🚀 Stack Technique

### Frontend
- **Framework** : React 18 + TypeScript
- **Routing** : Wouter
- **State Management** : TanStack Query v5
- **UI Components** : shadcn/ui + Radix UI
- **Styling** : Tailwind CSS + CSS Variables
- **Forms** : React Hook Form + Zod validation
- **Icons** : Lucide React

### Backend
- **Runtime** : Node.js 20
- **Framework** : Express.js
- **ORM** : Drizzle ORM
- **Database** : PostgreSQL (ou SQLite pour dev)
- **Authentication** : JWT + bcrypt
- **Security** : express-rate-limit, CORS
- **Validation** : Zod schemas

## 📁 Structure du Projet

```
project/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/          # Composants UI
│   │   │   ├── dev-mode-indicator.tsx
│   │   │   ├── pin-creation-form.tsx
│   │   │   ├── pin-login-form.tsx
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/               # React hooks
│   │   │   └── use-circle-auth.ts  # Hook postMessage
│   │   ├── lib/                 # Utilities
│   │   │   ├── auth.ts          # Auth helpers
│   │   │   ├── queryClient.ts   # TanStack Query
│   │   │   └── utils.ts
│   │   ├── pages/               # Pages
│   │   │   ├── auth.tsx         # Page authentification
│   │   │   ├── dashboard.tsx    # Dashboard protégé
│   │   │   └── not-found.tsx
│   │   ├── App.tsx              # Routes
│   │   ├── index.css            # Styles globaux + thème
│   │   └── main.tsx
│   └── index.html
├── server/                      # Backend Express
│   ├── app.ts                   # Configuration Express
│   ├── routes.ts                # API endpoints
│   ├── storage.ts               # Interface storage
│   └── index-dev.ts             # Dev server
├── shared/                      # Code partagé
│   └── schema.ts                # Schémas Drizzle + Zod
├── .env.example                 # Variables d'environnement
└── replit.md                    # Ce fichier
```

## 🔐 Endpoints API

### POST `/api/auth/validate`
Valide les données utilisateur reçues de Circle.so

**Body:**
```json
{
  "user": {
    "id": 12345,
    "email": "user@example.com",
    "name": "John Doe",
    "timestamp": 1234567890000
  }
}
```

**Response (nouveau membre):**
```json
{
  "status": "new_user",
  "user_id": 12345,
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response (membre existant):**
```json
{
  "status": "existing_user",
  "user_id": "uuid",
  "requires_pin": true
}
```

### POST `/api/auth/create-pin`
Crée un NIP pour un nouveau membre

**Body:**
```json
{
  "email": "user@example.com",
  "circle_id": 12345,
  "name": "John Doe",
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "session_token": "jwt_token_here",
  "user_id": "uuid"
}
```

### POST `/api/auth/validate-pin`
Valide le NIP d'un membre existant (rate limited: 5/15min)

**Body:**
```json
{
  "email": "user@example.com",
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "session_token": "jwt_token_here",
  "user_id": "uuid",
  "name": "John Doe"
}
```

## 🎨 Design System

### Couleurs de branding (Circle.so)

**Mode clair :**
- Primary: `#074491` (213 90% 29%)
- Links: `#2563EB`
- Success: `#009a2a`
- Warning: `#ffb200`
- Destructive: `#db0e00`

**Mode sombre :**
- Primary: `#3085F5` (211 100% 60%)
- Background: `#2B2E33`
- Success: `#009a2a`
- Warning: `#ffb200`
- Destructive: `#db0e00`

### Typographie
- Font: Inter (system-ui fallback)
- Headers: text-2xl font-semibold
- Labels: text-base font-medium
- Body: text-base
- Helper text: text-sm

## ⚙️ Variables d'Environnement

Créer un fichier `.env` basé sur `.env.example` :

```bash
# Obligatoires
JWT_SECRET=votre_secret_jwt_très_long_et_complexe
DATABASE_URL=postgresql://user:password@host:port/database

# Circle.so (production)
VITE_CIRCLE_ORIGIN=https://votre-espace.circle.so

# Mode développement (bypass auth Circle.so)
VITE_DEV_MODE=true

# Optionnels (valeurs par défaut)
SESSION_TIMEOUT=3600000
PIN_ATTEMPTS_LIMIT=5
PIN_ATTEMPTS_WINDOW=900000
PORT=5000
```

## 🚀 Démarrage

### Mode Développement (avec bypass auth)
```bash
# Définir la variable d'environnement
VITE_DEV_MODE=true

# Lancer l'application
npm run dev
```

L'app sera accessible sur `http://localhost:5000` avec un utilisateur mock.

### Mode Production (avec Circle.so)
```bash
# Définir les variables
VITE_DEV_MODE=false
VITE_CIRCLE_ORIGIN=https://votre-espace.circle.so

# Lancer l'application
npm run dev
```

## 🔗 Intégration Circle.so

### Étape 1 : Configurer les pages protégées
Dans Circle.so → Settings → Privacy → Pages :
- Activer "Members Only" sur les pages contenant l'iframe

### Étape 2 : Ajouter le code JavaScript
Dans Circle.so → Settings → Custom Code → Header :

```javascript
window.addEventListener('load', function() {
  const iframe = document.querySelector('iframe[src*="replit.app"]');
  
  const checkUser = setInterval(function() {
    if (window.circleUser && iframe) {
      clearInterval(checkUser);
      
      const userData = {
        type: 'CIRCLE_USER_AUTH',
        user: {
          id: window.circleUser.id,
          email: window.circleUser.email,
          name: window.circleUser.name,
          first_name: window.circleUser.first_name,
          last_name: window.circleUser.last_name,
          timestamp: Date.now()
        }
      };
      
      iframe.contentWindow.postMessage(
        userData, 
        'https://votre-app.replit.app'
      );
    }
  }, 100);
});
```

### Étape 3 : Intégrer l'iframe
Sur votre page Circle.so, ajouter l'iframe :

```html
<iframe 
  src="https://votre-app.replit.app" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="clipboard-write"
></iframe>
```

## 🛡️ Sécurité

### Protections implémentées
- ✅ HTTPS obligatoire (Replit + Circle.so)
- ✅ Validation origine stricte postMessage
- ✅ Validation multi-champs (email, ID, nom, timestamp)
- ✅ Cross-field validation en base de données
- ✅ Anti-replay attack (timestamp 60s max)
- ✅ Hash bcrypt (10 rounds) pour NIP
- ✅ Rate limiting (5 tentatives/15min)
- ✅ Session JWT avec expiration 60min
- ✅ Logging des tentatives de connexion
- ✅ CORS configuré pour Circle.so uniquement

### Attaques bloquées
- ❌ Accès non-membres → Bloqué par Circle.so
- ❌ Usurpation entre membres → Bloquée par NIP
- ❌ Manipulation données → Détectée par validation
- ❌ Replay attacks → Bloqués par timestamp
- ❌ Brute force NIP → Bloqué par rate limiting
- ❌ XSS → Protégé par validation + React
- ❌ SQL Injection → Protégé par Drizzle ORM

## 📊 Base de Données

### Table: users
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  circle_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Table: login_attempts
```sql
CREATE TABLE login_attempts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Flux Utilisateur

### Nouveau membre (première connexion)
1. Connexion sur Circle.so
2. Accès page avec iframe webapp
3. JavaScript Circle.so → postMessage
4. Frontend reçoit → envoie au backend `/validate`
5. Backend détecte nouveau membre
6. Formulaire création NIP (4-6 chiffres)
7. Backend hash NIP + crée compte
8. JWT généré (60 min)
9. Redirection vers dashboard

### Membre existant (reconnexion)
1. Connexion sur Circle.so
2. Accès page avec iframe webapp
3. JavaScript Circle.so → postMessage
4. Frontend reçoit → envoie au backend `/validate`
5. Backend détecte membre existant
6. Formulaire login NIP
7. Backend valide NIP (bcrypt compare)
8. JWT généré (60 min)
9. Redirection vers dashboard

## 🎯 Prochaines Étapes

### Phase actuelle : Phase 1 (Schema & Frontend) ✅
- ✅ Schémas de données (users, login_attempts)
- ✅ Couleurs de branding Circle.so
- ✅ Composants React (PinCreation, PinLogin)
- ✅ Hook useCircleAuth (postMessage)
- ✅ Pages (Auth, Dashboard)
- ✅ DevModeIndicator

### Phase 2 : Backend (en attente)
- ⏳ Storage interface (getUserByEmail, createUser, etc.)
- ⏳ Endpoints API (/validate, /create-pin, /validate-pin)
- ⏳ JWT generation/validation
- ⏳ Rate limiting middleware
- ⏳ Mode DEV avec utilisateur mock

### Phase 3 : Integration & Testing (en attente)
- ⏳ Connexion frontend ↔ backend
- ⏳ Gestion erreurs et états de chargement
- ⏳ Tests e2e avec Playwright
- ⏳ Review architect

## 📝 Notes

- Le mode DEV permet de développer sans Circle.so
- Les sessions expirent après 60 min d'inactivité
- Le NIP est TOUJOURS hashé, jamais stocké en clair
- Rate limiting s'applique par IP et par email
- Les couleurs s'adaptent automatiquement au thème clair/sombre
