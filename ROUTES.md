# Documentation des Routes

Ce document explique le comportement de chaque page de l'application.

---

## Vue d'ensemble des Routes

| Route | Page | Accès |
|-------|------|-------|
| `/` | Authentification | Public |
| `/admin-login` | Connexion Admin | Public |
| `/dashboard` | Dashboard Admin | Admins uniquement |
| `/user-home` | Espace Membre | Utilisateurs connectés |
| `*` | Page 404 | Public |

---

## Configuration de Sécurité (3 Couches)

La sécurité est configurable via le **Dashboard Admin** :

| Couche | Description | Effet si désactivée |
|--------|-------------|---------------------|
| Couche 1 | Exiger le domaine Circle.so | Mode développement (utilisateur mock) |
| Couche 2 | Exiger la connexion Circle.so | Visiteurs non-connectés acceptés |
| Couche 3 | Exiger le NIP personnel | Auto-login sans NIP |

**Mode Public** : Les 3 couches désactivées = accès direct à `/user-home` sans authentification.

---

## `/` - Page d'Authentification

### Comportement selon la configuration

| Configuration | Résultat |
|---------------|----------|
| Mode Public (3 couches OFF) | Redirection automatique vers `/user-home` |
| Couche 1 OFF | Utilisateur mock `dev@example.com` (admin) |
| Couche 1 ON, hors Circle.so | Message "Accès restreint" + bouton "Accès Administrateur" |
| Couche 1 ON, dans Circle.so | Réception des données via postMessage |
| Nouvel utilisateur + Couche 3 ON | Formulaire de création de NIP |
| Nouvel utilisateur + Couche 3 OFF | Création compte automatique |
| Utilisateur existant + Couche 3 ON | Formulaire de connexion avec NIP |
| Utilisateur existant + Couche 3 OFF | Auto-login |
| Authentification réussie (Admin) | Redirection vers `/dashboard` |
| Authentification réussie (User) | Redirection vers `/user-home` |

---

## `/admin-login` - Connexion Administrateur

Permet aux administrateurs de se connecter **hors de Circle.so** avec leur email et NIP.

| Circonstance | Résultat |
|--------------|----------|
| Email non trouvé | Erreur "Utilisateur introuvable" |
| Utilisateur non-admin | Erreur "Accès réservé aux administrateurs" |
| NIP incorrect | Erreur "NIP incorrect" |
| 5 tentatives échouées | Blocage 15 minutes |
| Succès | Redirection vers `/dashboard` |

---

## `/dashboard` - Dashboard Admin

### Contrôle d'accès

| Circonstance | Résultat |
|--------------|----------|
| Pas de token de session | Redirection vers `/` |
| Token expiré (> 60 min) | Redirection vers `/` |
| Utilisateur non-admin | Redirection vers `/user-home` |
| Utilisateur admin | Affichage du dashboard |

### Fonctionnalités

- **Configuration de sécurité** : Activer/désactiver les 3 couches
- **Informations de session** : Heure de connexion, expiration
- **Navigation** : Bouton "Page d'accueil" → `/user-home`
- **Déconnexion** : Suppression session + redirection `/`

---

## `/user-home` - Espace Membre

### Contrôle d'accès

| Circonstance | Résultat |
|--------------|----------|
| Mode Public | Accès libre (pas de session requise) |
| Pas de token + pas Mode Public | Redirection vers `/` |
| Token expiré | Redirection vers `/` |
| Token valide | Affichage de l'espace membre |

### Fonctionnalités

- Message de bienvenue personnalisé
- Bouton "Dashboard Admin" (admins uniquement)
- Bouton "Déconnexion" ou "Admin" selon l'état

---

## Gestion des Sessions

### Stockage (localStorage)

| Clé | Description |
|-----|-------------|
| `session_token` | JWT de session (expire après 60 min) |
| `user_id` | ID de l'utilisateur connecté |
| `is_admin` | Statut admin |
| `session_timestamp` | Timestamp de début de session |
| `circle_user_data` | Cache des données Circle.so |
| `circle_user_timestamp` | Timestamp du cache Circle.so |

### Déconnexion

La déconnexion supprime toutes les clés ci-dessus et redirige vers `/`.

---

## Matrice de Redirection

```
┌─────────────────────────────────────────────────────────────────┐
│                    MATRICE DE REDIRECTION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Non connecté (Mode Normal):                                     │
│    /dashboard → /                                                │
│    /user-home → /                                                │
│                                                                  │
│  Non connecté (Mode Public):                                     │
│    / → /user-home                                                │
│    /dashboard → /                                                │
│    /user-home → (reste)                                          │
│                                                                  │
│  Connecté (Utilisateur normal):                                  │
│    /dashboard → /user-home                                       │
│    /user-home → (reste)                                          │
│                                                                  │
│  Connecté (Admin):                                               │
│    /dashboard → (reste)                                          │
│    /user-home → (reste)                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
