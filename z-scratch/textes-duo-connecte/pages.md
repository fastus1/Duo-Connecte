# Pages de l'application Duo-Connecte

## Pages publiques / utilitaires

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| - | `/` | `auth.tsx` | Page d'authentification (redirect Circle.so) |
| - | `/welcome` | `Welcome.tsx` | Page d'accueil / bienvenue |
| - | `/user-home` | - | Redirect vers `/welcome` |
| - | `/support` | `SupportPage.tsx` | Formulaire de ticket support |
| - | `/paywall` | `PaywallScreen.tsx` | Écran de paywall (accès refusé) |
| - | `*` | `not-found.tsx` | Page 404 |

## Pages admin

| Route | Fichier | Description |
|-------|---------|-------------|
| `/admin-login` | `admin-login.tsx` | Connexion admin (PIN) |
| `/admin` | `dashboard.tsx` | Tableau de bord admin |
| `/admin/blocks` | `BlockShowcase.tsx` | Vitrine des blocs UI |

## Pages demo (preview admin)

| Route | Fichier | Description |
|-------|---------|-------------|
| `/_demo/loading` | `DemoLoadingScreen.tsx` | Demo écran de chargement |
| `/_demo/paywall` | `DemoPaywallScreen.tsx` | Demo écran paywall |
| `/_demo/pin-creation` | `DemoPinCreation.tsx` | Demo création de PIN |
| `/_demo/pin-login` | `DemoPinLogin.tsx` | Demo connexion PIN |

## Parcours Duo - Flow principal (steps 0-24)

### Section 0 - Introduction

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 0 | `/duo/presentation` | `DuoPresentation.tsx` | Présentation du processus |
| 1 | `/duo/roles` | `DuoRoles.tsx` | Choix des rôles (émetteur/récepteur) |
| 2 | `/duo/warnings` | `DuoWarnings.tsx` | Avertissements et attentes |

### Section 1 - Préparation

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 3 | `/duo/intention` | `DuoIntention.tsx` | Établir l'intention de communication |
| 4 | `/duo/sender-grounding` | `DuoSenderGrounding.tsx` | Ancrage de l'émetteur |
| 5 | `/duo/receiver-grounding` | `DuoReceiverGrounding.tsx` | Ancrage du récepteur |
| 6 | `/duo/transition-1` | `DuoTransition1.tsx` | Transition vers l'expression |

### Section 2 - Expression de l'émetteur

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 7 | `/duo/sender-situation` | `DuoSenderSituation.tsx` | Décrire la situation |
| 8 | `/duo/sender-experience` | `DuoSenderExperience.tsx` | Partager son vécu / émotions |
| 9 | `/duo/sender-interpretation` | `DuoSenderInterpretation.tsx` | Partager son interprétation |
| 10 | `/duo/sender-impact` | `DuoSenderImpact.tsx` | Décrire l'impact ressenti |
| 11 | `/duo/sender-summary` | `DuoSenderSummary.tsx` | Résumé du message de l'émetteur |

### Section 3 - Validation du récepteur

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 12 | `/duo/receiver-validation` | `DuoReceiverValidation.tsx` | Le récepteur valide ce qu'il a entendu |
| 13 | `/duo/sender-confirmation` | `DuoSenderConfirmation.tsx` | L'émetteur confirme la compréhension |

### Section 4 - Expression du récepteur

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 14 | `/duo/receiver-experience` | `DuoReceiverExperience.tsx` | Le récepteur partage son vécu |

### Section 5 - Validation de l'émetteur

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 15 | `/duo/sender-validation` | `DuoSenderValidation.tsx` | L'émetteur valide le récepteur |
| 16 | `/duo/receiver-confirmation` | `DuoReceiverConfirmation.tsx` | Le récepteur confirme la compréhension |
| 17 | `/duo/transition-2` | `DuoTransition2.tsx` | Transition vers les besoins |

### Section 6 - Besoins et réponses

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 18 | `/duo/sender-needs` | `DuoSenderNeeds.tsx` | L'émetteur exprime ses besoins |
| 19 | `/duo/receiver-response` | `DuoReceiverResponse.tsx` | Le récepteur répond aux besoins |
| 20 | `/duo/transition-3` | `DuoTransition3.tsx` | Transition vers la clôture |

### Section 7 - Clôture

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 21 | `/duo/sender-closing` | `DuoSenderClosing.tsx` | Mot de la fin de l'émetteur |
| 22 | `/duo/receiver-closing` | `DuoReceiverClosing.tsx` | Mot de la fin du récepteur |
| 23 | `/duo/feedback` | `DuoFeedback.tsx` | Feedback / évaluation |
| 24 | `/duo/completion` | `DuoCompletion.tsx` | Conversation terminée + suivi |

## Parcours inversé (steps 25-38)

Même structure que les steps 7-20, mais avec les rôles inversés (l'ancien récepteur devient émetteur).

### Section 2 (inversé) - Expression du nouveau émetteur

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 25 | `/duo/inversion-des-roles/page-7a` | `DuoInversionPage7a.tsx` | Situation (rôles inversés) |
| 26 | `/duo/inversion-des-roles/page-8a` | `DuoInversionPage8a.tsx` | Vécu / émotions (inversé) |
| 27 | `/duo/inversion-des-roles/page-9a` | `DuoInversionPage9a.tsx` | Interprétation (inversé) |
| 28 | `/duo/inversion-des-roles/page-10a` | `DuoInversionPage10a.tsx` | Impact (inversé) |
| 29 | `/duo/inversion-des-roles/page-11a` | `DuoInversionPage11a.tsx` | Résumé (inversé) |

### Section 3 (inversé) - Validation

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 30 | `/duo/inversion-des-roles/page-12a` | `DuoInversionPage12a.tsx` | Validation du récepteur (inversé) |
| 31 | `/duo/inversion-des-roles/page-13a` | `DuoInversionPage13a.tsx` | Confirmation de l'émetteur (inversé) |

### Section 4 (inversé) - Expression du récepteur

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 32 | `/duo/inversion-des-roles/page-14a` | `DuoInversionPage14a.tsx` | Vécu du récepteur (inversé) |

### Section 5 (inversé) - Validation croisée

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 33 | `/duo/inversion-des-roles/page-15a` | `DuoInversionPage15a.tsx` | Validation de l'émetteur (inversé) |
| 34 | `/duo/inversion-des-roles/page-16a` | `DuoInversionPage16a.tsx` | Confirmation du récepteur (inversé) |
| 35 | `/duo/inversion-des-roles/page-17a` | `DuoInversionPage17a.tsx` | Transition (inversé) |

### Section 6 (inversé) - Besoins et réponses

| Step | Route | Fichier | Description |
|------|-------|---------|-------------|
| 36 | `/duo/inversion-des-roles/page-18a` | `DuoInversionPage18a.tsx` | Besoins (inversé) |
| 37 | `/duo/inversion-des-roles/page-19a` | `DuoInversionPage19a.tsx` | Réponse (inversé) |
| 38 | `/duo/inversion-des-roles/page-20a` | `DuoInversionPage20a.tsx` | Transition finale (inversé) |
