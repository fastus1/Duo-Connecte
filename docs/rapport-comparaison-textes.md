# Rapport de comparaison des textes - Duo-Connecte

**Date :** 2026-02-07
**Comparaison :** Textes corrigés (`z-scratch/textes-duo-connecte/pages/`) vs textes actuels dans l'app (`client/src/pages/`)

---

## Sommaire

- **45 fichiers comparés**
- **27 fichiers avec des différences** (détaillés ci-dessous)
- **18 fichiers sans différence**
- **~86 différences au total**

### Catégories de différences

| Catégorie | Nb | Description |
|---|---|---|
| Orthographe / grammaire | ~10 | Conjugaisons, accords, pluriels manquants |
| Écriture inclusive | ~7 | Ajout de tirets/points médians (entendu-e, considéré-e, etc.) |
| Reformulation / vocabulaire | ~35 | Textes réécrits, exemples remplacés |
| Suppression de contenu | ~5 | Pages popup à supprimer |
| Ajout de contenu | ~4 | Nouveaux textes ou éléments |
| Changement structurel | ~10 | Types de champs modifiés, réorganisation popup |
| Inversion de rôles | ~5 | Sender/receiver inversés (bug corrigé) |
| Ponctuation / casse | ~5 | Points, deux-points, majuscules |
| Architecture divergente | ~5 | Admin/not-found : pages très différentes |

---

## Fichiers sans différence (18)

- Welcome.tsx
- DuoRoles.tsx
- DuoWarnings.tsx
- DuoIntention.tsx
- DuoTransition1.tsx
- DuoSenderExperience.tsx
- DuoSenderInterpretation.tsx
- DuoReceiverValidation.tsx
- DuoSenderValidation.tsx
- DuoTransition3.tsx
- DuoInversionPage7a.tsx
- DuoInversionPage8a.tsx
- DuoInversionPage12a.tsx
- DuoInversionPage16a.tsx
- DuoSenderClosing.tsx
- DuoReceiverClosing.tsx
- Toasts et messages système
- (PaywallScreen.tsx - voir note)

---

## Fichiers avec différences (27)

---

### 1. PaywallScreen.tsx (2 éléments à vérifier)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Vous avez déjà payé et vous voyez cet écran? Contactez le support pour résoudre ce problème.` | *(absent du scratch)* | [ajouter au scratch] |
| 2 | Bouton toggle thème `Mode clair` / `Mode sombre` | *(absent du scratch)* | [ignorer] |

> **Note :** Possiblement des omissions dans le scratch plutôt que des suppressions demandées. À confirmer. [Oui, exactement]

---

### 2. DuoPresentation.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `fortement déclenchée` | `fortement déclenché·e` | écriture inclusive | [corriger dans l'app]
| 2 | `La disponibilité émotionnelle des deux est essentielle.` dans un Callout séparé | Ce texte fait partie du même paragraphe | modification structure |[corriger dans l'app]

---

### 3. DuoSenderGrounding.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Pour {receiverName}, ça risque de l'aider à se déposer également.` | `Pour {receiverName}, risque de l'aider à se déposer également.` | modification (retrait de "ça") |[corriger dans l'app]
| 2 | Popup page 3 a un titre `Exemples` | Pas de titre dans le scratch | suppression titre |[corriger dans l'app]

> **Note :** Le retrait de "ça" rend la phrase grammaticalement incomplète. Possiblement une coquille dans le scratch.[non]

---

### 4. DuoReceiverGrounding.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Bouton principal : `Étape suivante` | `Étape Suivante` | casse (majuscule S) |[corrige scratch]
| 2 | Bouton popup : `Étape suivante` | `Étape Suivante` | casse (majuscule S) |[corrige scratch]

> **Note :** Incohérent avec la convention des autres pages qui utilisent "suivante" en minuscule.

---

### 5. DuoSenderSituation.tsx (3 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `tu nomme le déclencheur` | `tu nommes le déclencheur` | conjugaison |[corriger dans l'app]
| 2 | `Pourquoi rester factuel est crucial` | `Pourquoi rester factuel est crucial ?` | ponctuation (ajout ?) |[corriger dans l'app]
| 3 | `La différence entre fait et interprétation` | `La différence entre fait et interprétation :` | ponctuation (ajout :) |[corriger dans l'app]

---

### 6. DuoSenderImpact.tsx (10 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Bannière : `{receiverName}: écoute attentive et bienveillante` | `{receiverName}: continue avec ta présence ouverte` | reformulation |[corriger dans l'app]
| 2 | `je me sens rejeté / pas important / incompris...` | `je me sens rejeté·e / pas important·e / incompris·e...` | écriture inclusive |[corriger dans l'app]
| 3 | `Reconnaître ton pattern de réaction` | `Reconnaître ton fonctionnement défensif` | vocabulaire |[corriger dans l'app]
| 4 | Label `Défensive :` | `Justification :` | renommage |[corriger dans scratch]
| 5 | `pour équilibrer` | `pour me défendre` | reformulation |[corriger dans l'app]
| 6 | Pas de label + `inquiet·e` | Label `Scénarios imaginaires:` + `inquiet·ète` | ajout label + modification |[corriger dans l'app]
| 7 | `Hypercontrôle :` | `Contrôle :` | renommage |[corriger dans l'app]
| 8 | `pour ne plus ressentir ça` | `pour éviter de ressentir` | reformulation |[corriger dans l'app]
| 9 | `En identifiant ton pattern, tu passes de...` | `En identifiant ton fonctionnement défensif, tu te responsabilises, tu passes de...` (+ reformulation complète) | reformulation |[corriger dans l'app]
| 10 | Sous-titre popup `Les différents types d'impact` | Pas de sous-titre | suppression |[corriger dans l'app]

---

### 7. DuoSenderSummary.tsx (1 différence)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Quelques phrase, reste à l'essentiel` | `Quelques phrases, reste à l'essentiel` | orthographe (pluriel) |[corriger dans l'app]

---

### 8. DuoSenderConfirmation.tsx (1 différence)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `{receiverName} t'as bien entendu·e` | `{receiverName} t'a bien entendu·e` | grammaire (t'as → t'a) |[corriger dans l'scratch]

---

### 9. DuoReceiverExperience.tsx (1 différence)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `tes réaction défensives` | `tes réactions défensives` | orthographe (pluriel) |[corriger dans l'app]

---

### 10. DuoReceiverConfirmation.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `As-tu été bien entendu?` | `{receiverName}, as-tu été bien entendu?` | ajout prénom dynamique |[corriger dans l'app]
| 2 | `l'essentiel de ton vécu` | `l'essentiel de ton feedback` | vocabulaire |[corriger dans l'app]

---

### 11. DuoTransition2.tsx (11 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Popup p5 titre : `Pourquoi ça libère` | `Pourquoi cette distinction libère de l'exigence?` | reformulation |[corriger dans l'app]
| 2 | Popup p5 : `me sentir importante pour toi` | `me sentir considéré-e par toi` | écriture inclusive + reformulation |[corriger dans l'app]
| 3 | Popup p5 réponse partenaire | Réponse complètement réécrite (plus réaliste) | reformulation |[corriger dans l'app]
| 4 | Popup p6 titre : `Processus complet` | `Processus complet - Exemple:` | ajout |[ corriger dans l'app]
| 5 | Popup p6 : pas de texte intro | `Voici comment ça fonctionne du début à la fin:` | ajout |    [ corriger dans l'app]
| 6 | Popup p6 besoin : `J'ai besoin de me sentir respecté et écouté` | `Me sentir considéré-e` | reformulation |[corriger dans l'app]
| 7 | Popup p6 désir : `Je désire son attention visuelle quand on parle` | `J'aimerais avoir son attention quand on se parle` | reformulation |[corriger dans l'app]
| 8 | Popup p6 demande : `me regarder quand je te parle` | `poser ton téléphone quand je te parle` | reformulation |[corriger dans l'app]
| 9 | Popup p6 expression : `me sentir respecté et écouté` | `me sentir considéré-e` | reformulation |[corriger dans l'app]
| 10 | Popup p7 réponse 2 | Réponse complètement réécrite | reformulation |[corriger dans l'app]
| 11 | Popup p7 réponse 3 : `démarrer le téléphone dans une autre pièce` | `se céduler des moments où je laisse le téléphone dans une autre pièce` | reformulation |[corriger dans l'app]

---

### 12. DuoSenderNeeds.tsx (3 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Quel besoin humain fondamental n'est pas comblé?` | `Quel besoin n'est pas comblé?` | suppression "humain fondamental" |[corriger dans l'app]
| 2 | Popup p2 exemple sécurité | Reformulation complète (rassurer vs sécurité émotionnelle) | reformulation |  [corriger dans l'app]
| 3 | Popup p5 titre : `Si tu bloques` | `Si tu n'arrives pas à identifier ton besoin` | reformulation |    [corriger dans l'app]

---

### 13. DuoReceiverResponse.tsx (5 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Popup p1 : `Ça fait du sens` | `Ça va me faire plaisir` | reformulation | [corriger dans l'app]
| 2 | Popup p1 : accepter partiellement | Reformulation complète | reformulation |  [corriger dans l'app]
| 3 | Popup page 3 "Exemples de réponses" | **SUPPRIMER cette page popup** | suppression |[supprimer dans l'app]
| 4 | Popup page 5 "Ce qui fonctionne" | **SUPPRIMER cette page popup** | suppression |[supprimer dans l'app]
| 5 | Réorganisation : "Ce qu'il faut éviter" (actuellement p4) devient la nouvelle p3 | Réorganisation structurelle | modification | [réorganiser dans l'app]

---

### 14. DuoInversionPage9a.tsx (3 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Popup p1 ex1 : perspective "tu" (tu es parti-e...) | Perspective "je" (le receiverName parle de ses propres actions) | reformulation |    [corriger dans l'app]
| 2 | Popup p1 ex2 : perspective "tu" (tu n'as pas répondu...) | Perspective "je" (exemple complètement différent) | reformulation |    [corriger dans l'app]
| 3 | Popup p1 ex3 : perspective "tu" (ton silence...) | Perspective "je" (quand je n'ai pas répondu...) | reformulation |  [corriger dans l'app]

---

### 15. DuoInversionPage10a.tsx (6 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `comment as-tu réagis?` | `comment as-tu réagi?` | orthographe |      [corriger dans l'app]
| 2 | `On continu...` (bouton popup) | `On continue...` | orthographe |     [corriger dans l'app]
| 3 | `On continu...` (bouton principal) | `On continue...` | orthographe |    [corriger dans l'app]
| 4 | Popup p3 exemple 1 | Exemple complètement réécrit | reformulation |   [corriger dans l'app]
| 5 | Popup p3 exemple 2 | Exemple complètement réécrit | reformulation |   [corriger dans l'app]
| 6 | Popup p3 exemple 3 | Exemple complètement réécrit | reformulation |   [corriger dans l'app]

---

### 16. DuoInversionPage11a.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Popup p3 exemple de résumé | Exemple complètement modifié (dépasse-e/submergé-e vs préoccupé-e/distant-e) | reformulation |   [corriger dans l'app]
| 2 | *(absent dans l'app)* | `Tu peux renommer la situation si ça t'aide à suivre le fil.` | ajout |   [ajouter dans l'app]

---

### 17. DuoInversionPage13a.tsx (3 différences - écriture inclusive)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `est-ce que tu as bien été entendu?` | `est-ce que tu as bien été entendu-e?` | écriture inclusive |   [corriger dans l'app]
| 2 | `que tu te sentes vraiment entendu avant de passer` | `entendu-e` | écriture inclusive |  [corriger dans l'app]
| 3 | Bouton `J'ai bien été entendu` | `J'ai bien été entendu-e` | écriture inclusive |  [corriger dans l'app]

---

### 18. DuoInversionPage14a.tsx (10 différences - INVERSION DE RÔLES)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Bannière : `{senderName} : écoute attentive` | `{receiverName}: écoute attentive` | **inversion rôles** | [CORRIGER DANS L'APP]
| 2 | Sous-titre s'adresse à `{receiverName}` | S'adresse à `{senderName}` | **inversion rôles** |  [CORRIGER DANS L'APP]
| 3 | `de la part de {senderName}` | `de la part de {receiverName}` | **inversion rôles** |     [CORRIGER DANS L'APP]
| 4 | `face à celui de {senderName}` | `face à celui de {receiverName}` | **inversion rôles** |    [CORRIGER DANS L'APP]
| 5 | Popup p1 : `Après avoir écouté {senderName}` | `Après avoir écouté {receiverName}` | **inversion rôles** |    [CORRIGER DANS L'APP]
| 6 | Popup p3 exemple 1 | Reformulation complète | reformulation |   [corriger dans l'app]
| 7 | Popup p3 exemple 2 | Reformulation complète | reformulation |  [corriger dans l'app]
| 8 | Popup p4 : `le vécu de {senderName}` | `le vécu de {receiverName}` | **inversion rôles** |    [CORRIGER DANS L'APP]
| 9 | Popup p5 : `{senderName} a pris un risque` | `{receiverName} a pris un risque` | **inversion rôles** |    [CORRIGER DANS L'APP]
| 10 | `tes réaction défensives` | `tes réactions défensives` | orthographe (pluriel) |   [corriger dans l'app]

> **CRITIQUE :** Les rôles sender/receiver sont inversés dans l'app actuelle. Le scratch corrige ce bug.

---

### 19. DuoInversionPage15a.tsx (1 différence)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Être entendu-e apaise profondément.` | `Être entendu-e apaise.` | suppression "profondément" |   [corriger dans l'app]

---

### 20. DuoInversionPage17a.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Titre popup p2 : `Pourquoi cette distinction` | `Pourquoi cette distinction est importante` | reformulation |  [corriger dans l'app]
| 2 | `Quel besoin humain fondamental n'est pas comblé?` | `Quel besoin n'est pas comblé?` | suppression "humain fondamental" |  [corriger dans l'app]

---

### 21. DuoInversionPage18a.tsx (5 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Popup p1 : `Exemple 1 - Être écouté-e` | `Exemple 1 - Le besoin d'être écouté-e` | reformulation titre |  [corriger dans l'app]
| 2 | Popup p2 : `Exemple 2 - La confiance` | `Exemple 2 - Le besoin de confiance` | reformulation titre |  [corriger dans l'app]
| 3 | Popup p3 : `Simplement être entendu-e` | `Si ton besoin était simplement d'être entendu-e` | reformulation titre |    [corriger dans l'app]
| 4 | Popup p4 : `Ce qui fonctionne` | `Ce qui fonctionne vs ce qui ne fonctionne pas` | reformulation titre |  [corriger dans l'app]
| 5 | Popup page 5 "Rappel final" | **SUPPRIMER cette page popup** | suppression |  [supprimer dans l'app]

---

### 22. DuoInversionPage19a.tsx (1 différence)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Je ne peux pas m'engager sur tous les soirs, mais je peux le faire les mardis et jeudis. Est-ce que ça pourrait aider?` | `Je ne peux pas m'engager à être parfait, mais je peux m'engager à faire de mon mieux. Est-ce que ça te satisfait?` | reformulation |  [corriger dans l'app]

---

### 23. DuoInversionPage20a.tsx (1 différence)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Les deux perspectives ont été partagées. Il est maintenant temps de clôturer en vous partageant un dernier feedback sur comment vous vous sentez après tous ces échanges.` | `Les deux perspectives ont été partagées et entendues. Il est maintenant temps de clôturer en partageant un dernier feedback sur votre état présent après tous ces échanges.` | reformulation | [corriger dans l'app]

---

### 24. DuoFeedback.tsx (10+ différences - CHANGEMENTS STRUCTURELS MAJEURS)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Bouton `Passer cette étape` | `Passer` | simplification | [corriger dans l'app]
| 2 | Popup p2 : Échelle 1-5 (Désagréable → Agréable) | Champ texte court. Placeholder : "Par exemple: Transformatrice, Éclairante, Utile" | **changement de type** |   [corriger dans l'app]
| 3 | Popup p4 question : `aider à dénouer une situation difficile ou à vous rapprocher?` | `aider à améliorer votre communication de couple?` | reformulation |    [corriger dans l'app]
| 4 | Popup p5 : RadioGroup (choix unique, 5 options) | Champ texte libre. Placeholder : "Par exemple la structure étape par étape..." | **changement de type** |   [corriger dans l'app]
| 5 | Popup p6 : RadioGroup (choix unique, 6 options) | Champ texte libre. Placeholder : "Vos suggestions pour rendre cet outil encore plus efficace" | **changement de type** |    [corriger dans l'app]
| 6 | Popup p12 échelle : 1-5 | Échelle : 1-10 | **changement d'échelle** |
| 7 | Popup p12 question : `utilisiez Duo-Connecté de nouveau` | `utilisiez Duo-Connecté régulièrement` | reformulation |   [corriger dans l'app - important, l'app se nomme Duo-Connecte et non Duo-Connecté]   
| 8 | Popup p12 label : `Improbable` | `Peu probable` | reformulation |  [corriger dans l'app]

> **IMPORTANT :** Changements structurels (RadioGroup → texte libre, échelle 1-5 → 1-10) qui nécessitent des modifications de code, pas seulement de texte. [corriger dans l'app - c'est un changement majeur]

---

### 25. DuoCompletion.tsx (5 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Ce n'est pas facile mais vous l'avez fait.` | `Ce n'est pas facile, mais vous l'avez fait.` | ponctuation (virgule) |    [corriger dans l'app]
| 2 | `La communication authentique demande de la pratique` | `La communication authentique se cultive avec la pratique` | reformulation |  [corriger dans l'app]
| 3 | `Chaque conversation est une opportunité d'apprendre` | `Chaque conversation est une opportunité d'apprentissage` | reformulation |   [corriger dans l'app]
| 4 | URL thérapie : `.../fr/yannickdelormetherapeute` | `.../en/yannickdelormetherapeute` | URL modifiée (/fr/ → /en/) |   [corriger dans scratch]
| 5 | Restart sans confirmation | Dialogue de confirmation : "Êtes-vous sûr de vouloir recommencer une nouvelle session?" | ajout |[corriger dans scratch - pas de confirmation dans l'app, c'est voulu]

---

### 26. not-found.tsx (3 différences - PAGE ENTIÈRE À REFAIRE)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Titre : `404 Page Not Found` | `404` + sous-titre `Page non trouvée` | modification | [corriger dans l'app]
| 2 | Description : `Did you forget to add the page to the router?` (anglais/technique) | `La page que vous recherchez n'existe pas ou a été déplacée.` (français/utilisateur) | modification | [corriger dans l'app]
| 3 | *(absent)* | Bouton `Retour à l'accueil` | ajout |    [ignorer le bouton est dans l'app]

---

### 27. Admin (dashboard.tsx + admin-login.tsx) - ARCHITECTURE DIVERGENTE

Le scratch décrit une interface admin simplifiée. L'app a évolué vers un dashboard complet multi-onglets. Différences pertinentes :

**admin-login.tsx :**

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Titre : `Connexion` | `Administration` | modification |   [corriger dans l'app]
| 2 | Description : `Accédez à l'espace administrateur` | `Entrez le PIN à 6 chiffres pour accéder aux feedbacks` | modification |  [corriger dans scratch]
| 3 | Bouton : `Se connecter` | `Accéder` | modification | [corriger dans scratch]
| 4 | Champ email présent | Absent du scratch | suppression ? |[corriger dans l'app - le champ email est une erreur, il ne devrait pas être là]

**dashboard.tsx (section feedbacks) :**

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | Sous-titre feedbacks : `{count} feedback(s) actif(s)` | `{count} feedback(s) enregistré(s)` | modification |  

> **Note :** L'architecture admin a considérablement évolué. Le scratch ne reflète peut-être pas les décisions récentes. À évaluer au cas par cas.

---

### 28. SupportPage.tsx (2 différences)

| # | Texte actuel (app) | Texte corrigé (scratch) | Type |
|---|---|---|---|
| 1 | `Puis-je utiliser l'application seul·e?` | `Puis-je utiliser l'application seul?` | retrait point médian |    [corriger dans scratch]
| 2 | `Le parcours est conçu...` (singulier) | `Les parcours sont conçus...` (pluriel) | modification |[corriger dans scratch]

---

## Points critiques à adresser en priorité

### 1. Bug de rôles (DuoInversionPage14a.tsx)
Les rôles sender/receiver sont inversés dans le code actuel. C'est un bug fonctionnel, pas juste cosmétique. [Ne touche pas à ça]

### 2. Changements structurels (DuoFeedback.tsx)
Trois champs RadioGroup doivent devenir des champs texte libre, et l'échelle passe de 1-5 à 1-10. Cela nécessite des modifications de code significatives. [applique les changements structurels, c'est important pour la qualité des feedbacks]

### 3. Suppression de pages popup
- DuoReceiverResponse.tsx : supprimer 2 pages popup (p3 et p5) [oui, c'est écrit dans le scratch]
- DuoInversionPage18a.tsx : supprimer 1 page popup (p5) [oui, c'est écrit dans le scratch]

### 4. Page 404 (not-found.tsx)
Actuellement en anglais/technique. À réécrire entièrement en français pour les utilisateurs. [oui, c'est écrit dans le scratch]

---


