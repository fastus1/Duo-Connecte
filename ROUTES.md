# Documentation des Routes Utilisateurs

Ce document explique le comportement de chaque page de l'application selon les différentes circonstances.

---

## Vue d'ensemble des Routes

| Route | Page | Accès |
|-------|------|-------|
| `/` | Authentification | Public |
| `/dashboard` | Dashboard Admin | Admins uniquement |
| `/user-home` | Espace Membre | Utilisateurs connectés |
| `*` | Page 404 | Public |

---

## `/` - Page d'Authentification

### Mode DEV

| Circonstance | Résultat |
|--------------|----------|
| Ouverture de la page | Authentification automatique avec utilisateur mock (dev@example.com, Admin) |
| Après authentification | Redirection vers `/dashboard` (car mock est admin) |

### Mode PROD

| Circonstance | Résultat |
|--------------|----------|
| Page ouverte hors Circle.so | Message "Accès restreint" après 5 secondes |
| Page ouverte dans iframe Circle.so (utilisateur non connecté à Circle) | Message "Accès restreint" |
| Page ouverte dans iframe Circle.so (utilisateur connecté) | Réception des données Circle.so via postMessage |
| Données Circle.so reçues - Nouvel utilisateur | Formulaire de création de NIP (4-6 chiffres) |
| Données Circle.so reçues - Utilisateur existant | Formulaire de connexion avec NIP |
| NIP créé/validé avec succès (Admin) | Redirection vers `/dashboard` |
| NIP créé/validé avec succès (Utilisateur normal) | Redirection vers `/user-home` |
| Échec validation NIP (5 tentatives) | Blocage 15 minutes (rate limiting) |

### Flux d'authentification complet

```
┌─────────────────────────────────────────────────────────────────┐
│                         MODE DEV                                 │
├─────────────────────────────────────────────────────────────────┤
│  Ouverture page → Mock user → Validation → /dashboard           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         MODE PROD                                │
├─────────────────────────────────────────────────────────────────┤
│  Ouverture page                                                  │
│       │                                                          │
│       ▼                                                          │
│  Attente message Circle.so (max 5 secondes)                     │
│       │                                                          │
│       ├── Pas de message → "Accès restreint"                    │
│       │                                                          │
│       └── Message reçu                                          │
│               │                                                  │
│               ▼                                                  │
│          Validation backend (email, publicUid, timestamp)       │
│               │                                                  │
│               ├── Nouvel utilisateur → Création NIP             │
│               │                              │                   │
│               │                              ▼                   │
│               │                    Sauvegarde NIP (bcrypt)      │
│               │                              │                   │
│               └── Utilisateur existant → Saisie NIP             │
│                                              │                   │
│                                              ▼                   │
│                                    Validation NIP               │
│                                              │                   │
│                                              ├── Succès (Admin) │
│                                              │      → /dashboard │
│                                              │                   │
│                                              └── Succès (User)  │
│                                                   → /user-home  │
└─────────────────────────────────────────────────────────────────┘
```

---

## `/dashboard` - Dashboard Admin

### Contrôle d'accès

| Circonstance | Résultat |
|--------------|----------|
| Pas de token de session | Redirection vers `/` |
| Token expiré (> 60 min) | Redirection vers `/` |
| Token valide mais utilisateur non-admin | Redirection vers `/user-home` |
| Token valide et utilisateur admin | Affichage du dashboard |

### Fonctionnalités disponibles

- Affichage du statut de sécurité (3 couches)
- Informations de session (heure de connexion)
- Bouton "Page d'accueil" → `/user-home`
- Bouton "Déconnexion" → Suppression session + redirection `/`

---

## `/user-home` - Espace Membre

### Contrôle d'accès

| Circonstance | Résultat |
|--------------|----------|
| Pas de token de session | Redirection vers `/` |
| Token expiré (> 60 min) | Redirection vers `/` |
| Token valide (admin ou utilisateur) | Affichage de l'espace membre |

### Fonctionnalités disponibles

- Message de bienvenue personnalisé (prénom)
- Bouton "Dashboard Admin" (visible uniquement pour les admins) → `/dashboard`
- Bouton "Déconnexion" → Suppression session + redirection `/`

---

## Gestion des Sessions

### Stockage (localStorage)

| Clé | Description |
|-----|-------------|
| `session_token` | JWT de session (expire après 60 min) |
| `user_id` | ID de l'utilisateur connecté |
| `session_timestamp` | Timestamp de début de session |
| `circle_user_data` | Cache des données Circle.so |
| `circle_user_timestamp` | Timestamp du cache Circle.so |
| `app_mode` | Mode actuel (`dev` ou `prod`) |

### Déconnexion

La déconnexion (bouton ou expiration) :
1. Supprime `session_token`
2. Supprime `user_id`
3. Supprime `session_timestamp`
4. Redirige vers `/`

---

## Changement de Mode (DEV ↔ PROD)

| Action | Résultat |
|--------|----------|
| DEV → PROD | Suppression de toutes les données de session + cache Circle.so + rechargement page |
| PROD → DEV | Suppression de toutes les données de session + cache Circle.so + rechargement page |

---

## Cas Particuliers

### Refresh de page (F5) en mode PROD

| Circonstance | Résultat |
|--------------|----------|
| Session valide | Données rechargées depuis `/api/auth/me` |
| Session expirée | Redirection vers `/` |
| Sur `/` avec cache Circle.so valide | Utilisation du cache, pas besoin de Ctrl+Shift+R |
| Sur `/` sans cache Circle.so | Demande de données à Circle.so (handshake) |

### Accès direct aux URLs

| URL | Sans session | Avec session (user) | Avec session (admin) |
|-----|--------------|---------------------|----------------------|
| `/` | Page auth | Page auth | Page auth |
| `/dashboard` | → `/` | → `/user-home` | Dashboard |
| `/user-home` | → `/` | Espace membre | Espace membre + bouton admin |

---

## Résumé des Redirections

```
┌─────────────────────────────────────────────────────────────────┐
│                    MATRICE DE REDIRECTION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Non connecté:                                                   │
│    /dashboard → /                                                │
│    /user-home → /                                                │
│                                                                  │
│  Connecté (Utilisateur normal):                                  │
│    /dashboard → /user-home                                       │
│    /user-home → (reste sur /user-home)                          │
│                                                                  │
│  Connecté (Admin):                                               │
│    /dashboard → (reste sur /dashboard)                          │
│    /user-home → (reste sur /user-home)                          │
│                                                                  │
│  Après déconnexion:                                              │
│    Toute page → /                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
