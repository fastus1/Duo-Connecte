# duo-connecte - Guide de Communication et Régulation Émotionnelle

## Vue d'ensemble

Application de guidance pour la communication authentique et la régulation émotionnelle, intégrée à Circle.so via iframe. L'application propose deux parcours guidés (Solo et Duo) avec une architecture de sécurité à 4 couches configurables.

**Marque** : "Avancer Simplement"

## Changements Récents

- **2025-12-13** : Correction sticky composer dans BlockShowcase
  - Le composer sticky était coupé car le header retourne `null` pendant le chargement
  - Solution: lecture réactive de `--global-header-height` via MutationObserver + useState
- **2025-12-10** : PWA (Progressive Web App) implémentée
  - manifest.json avec nom, icônes et couleurs
  - Icônes PWA 192x192 et 512x512 dans /public/icons/
  - Meta tags Apple pour iOS Safari
  - Bannière d'installation sur mobile (Welcome page)
  - Instructions adaptées iOS (Partager) et Android (Menu)
- **2025-12-10** : Correction navigation parcours Duo
  - Tous les indices `transitionToStep()` décrémentés de 1 (corrige offset +1)
  - 38 pages Duo corrigées : main flow (24) + inversion flow (14)
  - La page Warnings s'affiche maintenant correctement dans la séquence
- **2025-12-10** : Restructuration Welcome - Page d'accueil séparée des parcours
  - Welcome (/welcome) est maintenant une page indépendante
  - Solo commence à /solo/roles (26 étapes)
  - Duo commence à /duo/roles (38 étapes incluant inversion)
  - AccessGate autorise /welcome comme page publique
- **2025-12-10** : Optimisation performance Phase 5 - Extraction composants dashboard
  - dashboard.tsx réduit de 1,111 → 290 lignes (-74%)
  - Nouveaux composants: SecurityTab.tsx, PaywallTab.tsx, MembersTab.tsx, WebhookTab.tsx
  - Chaque composant avec props TypeScript typés (UseMutationResult)
- **2025-12-10** : Optimisation performance Phase 4 - Extraction routes d'authentification
  - routes.ts réduit de 885 → 237 lignes (-73% total depuis Phase 3)
  - Nouveau module `routes/auth.ts` (551 lignes) avec validation, NIP, paywall
  - Structure finale: routes.ts (237) + auth.ts (551) + admin.ts (165) + support.ts (225) + webhooks.ts (69)
- **2025-12-10** : Optimisation performance Phase 3 - Refactoring routes.ts (1,464 → 885 lignes, -40%)
  - Nouveau middleware `createRequireAdmin` pour éliminer code dupliqué
  - Structure modulaire: `server/routes/` (admin.ts, support.ts, webhooks.ts)
  - Index sur `login_attempts(user_id, timestamp)` pour rate limiting
- **2025-12-09** : Système de support avec tickets, FAQ (Resend pour emails à configurer)
- **2025-12-09** : Mode Prévisualisation Admin - Barre latérale pour naviguer vers toutes les pages (Solo, Duo, Inversion, pages spéciales)
- **2025-12-09** : Gestion membres améliorée - Deux options de suppression : "Retirer l'accès payant" ou "Supprimer complètement" (utilisateur + données)
- **2025-12-09** : Correction bug NIP Layer 4 - Les utilisateurs créés sans NIP peuvent maintenant en créer un quand la couche 4 est activée
- **2025-12-09** : Nouvel endpoint admin `/api/admin/reset-user-pin` pour réinitialiser le NIP d'un utilisateur
- **2025-12-08** : **CORRECTION MAJEURE** - Script Circle.so v3 : utilise `window.circleUser` (fourni par Circle.so) au lieu de variables Liquid qui ne fonctionnent pas dans le JS
- **2025-12-08** : Header retiré pour les utilisateurs non-admin, sélecteur de thème en bas, bouton maison supprimé
- **2025-12-08** : Correction du statut admin en production (endpoint /api/debug/fix-admin)
- **2025-12-08** : Ajout de JWT_SECRET en production pour les tokens de session

## Fonctionnalités Principales

### Deux Modes de Parcours

1. **Mode Solo** - Régulation émotionnelle personnelle
   - 26 étapes guidées (Welcome est séparé)
   - Travail individuel sur ses émotions
   - Couleur de progression : Rouge

2. **Mode Duo** - Communication authentique à deux
   - 38 étapes guidées (incluant le parcours inversé, Welcome séparé)
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
  routes.ts        # Routes config, debug, health, feedback (237 lignes)
  storage.ts       # Interface DB (MemStorage ou DbStorage)
  middleware.ts    # JWT, bcrypt, rate limiting, requireAdmin
  routes/
    index.ts       # Assemblage des modules (18 lignes)
    auth.ts        # Authentification Circle.so, NIP, paywall (551 lignes)
    admin.ts       # Routes admin (feedbacks, membres, gestion utilisateurs) (165 lignes)
    support.ts     # Routes support tickets (225 lignes)
    webhooks.ts    # Webhook Circle.so paiement (69 lignes)

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

support_tickets: id (uuid), name, email, subject, message, status (new/in_progress/resolved), created_at, updated_at, resolved_at
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

### Support Tickets
- `POST /api/support/tickets` - Crée un ticket (public)
- `GET /api/admin/support/tickets` - Liste tous les tickets (admin)
- `PATCH /api/admin/support/tickets/:id` - Met à jour le statut (admin)
- `DELETE /api/admin/support/tickets/:id` - Supprime un ticket (admin)

## Variables d'Environnement

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL Neon (auto-généré) |
| SESSION_SECRET | Secret pour JWT (générer unique par app) |
| VITE_CIRCLE_ORIGIN | Origine Circle.so (ex: https://communaute.avancersimplement.circle.so) |
| WEBHOOK_SECRET | Secret pour sécuriser le webhook |
| RESEND_API_KEY | Clé API Resend pour l'envoi d'emails |

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
6. **Support** : Gestion des tickets d'aide avec filtrage par statut

## Intégration Circle.so - IMPORTANT

### Comment Circle.so partage les données

Circle.so expose automatiquement un objet JavaScript `window.circleUser` pour les membres connectés :

```javascript
window.circleUser = {
  email: "membre@example.com",    // Email du membre
  name: "Nom Complet",            // Nom du membre
  publicUid: "abc123xyz",         // Identifiant public unique
  is_admin: true                  // Booléen - statut admin
}
```

**ATTENTION - NE JAMAIS FAIRE :**
- ❌ Utiliser des variables Liquid (`{{member.email}}`) dans le JavaScript
- ❌ Placer le script dans "Head Code Snippets"
- ❌ Essayer de définir `window.circleUser` manuellement

**TOUJOURS FAIRE :**
- ✅ Utiliser `window.circleUser` directement (fourni par Circle.so)
- ✅ Placer le script dans **Settings → Code Snippets → JavaScript**
- ✅ Attendre que `window.circleUser` soit disponible avant d'envoyer

### Script d'Authentification (Code Snippets → JavaScript)

Le script dans le Dashboard Admin envoie les données de `window.circleUser` vers les iframes Replit via `postMessage`. Il :
1. Attend que `window.circleUser` soit disponible
2. Envoie les données à toutes les iframes `.replit.app`
3. Répond aux demandes `CIRCLE_AUTH_REQUEST`

### Script Webhook Paiement (Paywall Custom Code)

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
