# Duo-Connecté - Guide de Communication et Régulation Émotionnelle

## Vue d'ensemble

Application de guidance pour la communication authentique et la régulation émotionnelle, intégrée à Circle.so via iframe. L'application propose deux parcours guidés (Solo et Duo) avec une architecture de sécurité à 4 couches configurables.

**Marque** : "Avancer Simplement"

## Fonctionnalités Principales

### Deux Modes de Parcours

1. **Mode Solo** - Régulation émotionnelle personnelle
   - 27 étapes guidées
   - Travail individuel sur ses émotions
   - Couleur de progression : Rouge

2. **Mode Duo** - Communication authentique à deux
   - 39 étapes guidées (incluant le parcours inversé)
   - Dialogue structuré entre émetteur et récepteur
   - Couleur de progression : Bleu
   - Possibilité d'inverser les rôles

### Parcours Structuré en 8 Sections

1. **Bienvenue** - Introduction et choix des rôles
2. **Mettre la table** - Intention et ancrage
3. **Le vif du sujet - Émetteur** - Situation, vécu, interprétation, impact
4. **Récepteur - Valider l'émetteur** - Écoute et validation
5. **Ce que vit le récepteur** - Expression du vécu du récepteur
6. **Valider le récepteur** - Confirmation mutuelle
7. **Demande et besoin** - Expression des besoins
8. **Clôture** - Fermeture et feedback

## Architecture de Sécurité

### 4 Couches d'Authentification (Configurables via Dashboard Admin)

| Couche | Nom | Description |
|--------|-----|-------------|
| 1 | Domaine Circle.so | Vérifie que l'app est dans l'iframe Circle.so |
| 2 | Connexion Circle.so | Validation postMessage (email, publicUid, timestamp 60s max) |
| 3 | Paywall | Vérifie si l'utilisateur a payé (sync via webhook Circle.so) |
| 4 | NIP Personnel | 4-6 chiffres, bcrypt 10 rounds, rate limit 5/15min, JWT 60min |

### Configuration via Dashboard Admin

Toutes les couches sont configurables via le Dashboard Admin (table `app_config`):
- `requireCircleDomain` : Couche 1 ON/OFF
- `requireCircleLogin` : Couche 2 ON/OFF
- `requirePaywall` : Couche 3 ON/OFF (nécessite Couche 2 activée)
- `requirePin` : Couche 4 ON/OFF

## Stack Technique

- **Frontend** : React 18, TypeScript, Wouter, TanStack Query v5, shadcn/ui, Tailwind CSS, Framer Motion
- **Backend** : Node.js 20, Express, Drizzle ORM, PostgreSQL (Neon), JWT, bcrypt, express-rate-limit

## Structure du Projet

```
client/src/
  components/
    ui/              # Composants shadcn/ui
    admin/           # Composants admin (AdminFeedbacks)
    GlobalHeader.tsx # En-tête global avec navigation
    ProgressBar.tsx  # Barre de progression du parcours
    Checklist.tsx    # Listes de vérification interactives
    logo.tsx         # Logo adaptatif (clair/sombre)
  contexts/
    SessionContext.tsx  # État de la session de conversation
    AccessContext.tsx   # Gestion de l'accès et authentification Circle.so
  hooks/
    use-circle-auth.ts  # Hook pour l'authentification Circle.so
    usePageTransition.ts # Transitions entre pages
  pages/
    Welcome.tsx         # Page d'accueil
    Solo*.tsx           # Pages du parcours Solo (27 pages)
    Duo*.tsx            # Pages du parcours Duo (25 pages)
    DuoInversion*.tsx   # Pages du parcours inversé (14 pages)
    PaywallScreen.tsx   # Écran de blocage paywall
    auth.tsx            # Authentification
    dashboard.tsx       # Dashboard admin
  lib/
    auth.ts           # Utilitaires d'authentification
    queryClient.ts    # Configuration TanStack Query

server/
  app.ts           # Express + CORS + trust proxy
  routes.ts        # API endpoints
  storage.ts       # Interface DB (MemStorage ou DbStorage)
  middleware.ts    # JWT, bcrypt, rate limiting

shared/
  schema.ts        # Modèles Drizzle + Zod + Configuration des parcours
```

## Base de Données

```sql
users: id, email, public_uid, name, pin_hash, is_admin, created_at, last_login

login_attempts: id, user_id, success, ip_address, timestamp

app_config: id, require_circle_domain, require_circle_login, require_paywall, require_pin, 
            paywall_purchase_url, paywall_info_url, paywall_title, paywall_message, 
            webhook_app_url, environment, updated_at

paid_members: id, email (unique), payment_date, payment_plan, amount_paid, coupon_used

feedbacks: id, rating (1-5), helpful_aspect, improvement_suggestion, created_at
```

## API Endpoints

### Authentification
- `POST /api/auth/validate` - Valide données Circle.so
- `POST /api/auth/create-pin` - Crée NIP avec validation_token
- `POST /api/auth/create-user-no-pin` - Crée utilisateur sans NIP
- `POST /api/auth/validate-pin` - Valide NIP (rate limited)
- `GET /api/auth/me` - Infos utilisateur (protégé JWT)

### Configuration
- `GET /api/config` - Configuration des couches de sécurité
- `PATCH /api/config` - Met à jour la configuration (admin)
- `GET /api/settings` - Alias pour config (AccessContext)
- `POST /api/check-access` - Vérifie l'accès utilisateur

### Paywall & Membres
- `POST /api/auth/check-paywall` - Vérifie accès membre payant
- `POST /webhooks/circle-payment` - Webhook Circle.so paiements
- `GET /api/admin/paid-members` - Liste membres payants (admin)
- `POST /api/admin/paid-members` - Ajoute membre payant (admin)
- `DELETE /api/admin/paid-members/:email` - Supprime membre (admin)

### Feedback
- `POST /api/feedback` - Soumet un feedback anonyme
- `GET /api/admin/feedbacks` - Liste tous les feedbacks (admin)

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL Neon (auto-généré) |
| SESSION_SECRET | Secret pour JWT (générer unique par app) |
| VITE_CIRCLE_ORIGIN | Origine Circle.so (ex: https://communaute.avancersimplement.circle.so) |
| WEBHOOK_SECRET | Secret pour sécuriser le webhook |

## Gestion de Session

L'état de la conversation est stocké dans `SessionContext` :

```typescript
{
  senderName: string,      // Nom de l'émetteur
  receiverName: string,    // Nom du récepteur
  currentStep: number,     // Étape actuelle (0-38)
  appType: 'solo' | 'duo', // Type de parcours
  // Checklists pour validation des étapes
  checklistSituation: boolean,
  checklistVecu: boolean,
  checklistInterpretation: boolean,
  checklistImpact: boolean,
  // Checklists parcours inversé
  checklistVecuInverse: boolean,
  checklistInterpretationInverse: boolean,
  checklistImpactInverse: boolean,
  // Suivi nécessaire
  suiviNecessaire: boolean,
}
```

## Branding "Avancer Simplement"

### Logo
- **Mode clair** : `logo-blue.png`
- **Mode sombre** : `logo-white.png`

### Typographie
- Titres de marque : Montserrat Black Italic, uppercase
- Corps de texte : Inter

### Couleurs
| Élément | Couleur |
|---------|---------|
| Primary (bleu) | `#074491` |
| Primary light | `#3085F5` |
| Solo (rouge) | `hsl(0, 84%, 60%)` |
| Duo (bleu) | `hsl(221, 83%, 53%)` |

## Dashboard Admin

Accessible via `/admin` (nécessite authentification admin)

1. **Sécurité** : 4 couches ON/OFF + environnement dev/prod
2. **Paywall** : Titre, message, URLs
3. **Membres** : Liste et gestion des membres payants
4. **Webhook** : Générateur de script Circle.so
5. **Feedbacks** : Consultation des retours utilisateurs

## Scripts Circle.so

### Script 1 : Authentification (Header Custom Code - UNIVERSEL)

Script universel pour toutes les apps Replit dans le Header Custom Code de Circle.so.

### Script 2 : Webhook Paiement (Paywall Custom Code - SPÉCIFIQUE)

Généré via Dashboard Admin pour chaque app, à placer dans le Custom Code de chaque paywall.

## Commandes

```bash
npm run dev       # Démarre serveur de développement
npm run build     # Build production
npm run start     # Démarre en production
npm run db:push   # Push schema vers la base de données
```

## Notes Développeurs

- Couche 1 désactivée = Mode développement (utilisateur mock)
- Sessions JWT expirent après 60min
- NIP toujours hashé (bcrypt 10 rounds)
- Thème synchronisé automatiquement avec Circle.so
- Statut admin sync à chaque connexion
- Les parcours Solo et Duo partagent la page Welcome
