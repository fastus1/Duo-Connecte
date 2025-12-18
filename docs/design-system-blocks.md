# Design System - Blocs Réutilisables

Ce document décrit tous les blocs disponibles pour construire des pages. Utilisez cette syntaxe pour générer des layouts structurés.

---

## Table des Matières

1. [Blocs de Marque](#blocs-de-marque)
   - [Logo](#logo)
   - [ArrowsIcon](#arrowsicon)
2. [Blocs de Texte](#blocs-de-texte)
   - [PageTitle](#pagetitle)
   - [Subtitle](#subtitle)
   - [Paragraph](#paragraph)
   - [BulletList](#bulletlist)
   - [QuoteBlock](#quoteblock)
3. [Blocs d'Emphase](#blocs-demphase)
   - [HeroIcon](#heroicon)
   - [Callout](#callout)
   - [WarningCard](#warningcard)
   - [TipCard](#tipcard)
4. [Blocs d'Interaction](#blocs-dinteraction)
   - [CtaButton](#ctabutton)
   - [ChoiceCards](#choicecards)
   - [ToggleCard](#togglecard)
5. [Blocs de Formulaire](#blocs-de-formulaire)
   - [StarRating](#starrating)
   - [TextQuestion](#textquestion)
6. [Blocs de Navigation](#blocs-de-navigation)
   - [RoleIndicator](#roleindicator)
   - [StepProgress](#stepprogress)
7. [Blocs Utilitaires](#blocs-utilitaires)
   - [Separator](#separator)
   - [ExplanationModal](#explanationmodal)

---

## Blocs de Marque

### Logo

Logo complet avec texte "AVANCER SIMPLEMENT".

**Syntaxe:**
```
Logo (taille)
```

**Tailles disponibles:**
| Taille | Description |
|--------|-------------|
| `sm` | Petit - pour headers, footers |
| `md` | Moyen - usage général |
| `lg` | Grand - pages d'accueil |

**Exemples:**
```
Logo (sm)
Logo (md)
Logo (lg)
```

---

### ArrowsIcon

Icône des flèches seule (sans texte).

**Syntaxe:**
```
ArrowsIcon (taille)
```

**Tailles disponibles:**
| Taille | Description |
|--------|-------------|
| `sm` | Petit |
| `md` | Moyen |
| `lg` | Grand |

**Exemples:**
```
ArrowsIcon (sm)
ArrowsIcon (md)
ArrowsIcon (lg)
```

---

## Blocs de Texte

### PageTitle

Titre principal de la page. Centré, police serif, grande taille.

**Syntaxe:**
```
PageTitle: "Votre titre"
```

**Exemples:**
```
PageTitle: "Se connecter"
PageTitle: "Bienvenue dans le parcours"
PageTitle: "Mettre la table"
```

---

### Subtitle

Texte d'introduction sous le titre.

**Syntaxe:**
```
Subtitle (variante): "Votre texte"
```

**Variantes disponibles:**
| Variante | Description |
|----------|-------------|
| `muted` | Texte gris, plus discret |
| `default` | Texte en couleur principale (blanc/noir) |

**Exemples:**
```
Subtitle (muted): "Un moment pour vous recentrer"
Subtitle (default): "Prenez le temps de respirer"
```

---

### Paragraph

Texte de paragraphe simple pour le contenu principal.

**Syntaxe:**
```
Paragraph: "Votre texte ici"
```

**Exemples:**
```
Paragraph: "Ceci est un paragraphe explicatif qui décrit le contenu de cette section."
Paragraph: "Prenez quelques instants pour lire attentivement les instructions suivantes."
```

---

### BulletList

Liste à puces avec points colorés.

**Syntaxe:**
```
BulletList (variante): ["Item 1", "Item 2", "Item 3"]
```

**Variantes disponibles:**
| Variante | Couleur | Usage |
|----------|---------|-------|
| `primary` | Bleu | Points positifs, étapes |
| `destructive` | Rouge | Avertissements, points d'attention |

**Exemples:**
```
BulletList (primary): ["Premier point", "Deuxième point", "Troisième point"]
BulletList (destructive): ["Attention à ceci", "Ne pas oublier"]
BulletList (primary): ["Respirer profondément", "Se recentrer", "Exprimer son ressenti"]
```

---

### QuoteBlock

Citation mise en valeur avec guillemets décoratifs.

**Syntaxe (sans auteur):**
```
QuoteBlock: "Votre citation"
```

**Syntaxe (avec auteur):**
```
QuoteBlock: "Votre citation"
  author: "Nom de l'auteur"
```

**Exemples:**
```
QuoteBlock: "Prendre le temps de s'exprimer, c'est se donner la chance d'être entendu."

QuoteBlock: "Derrière chaque comportement, il y a un besoin qui cherche à être satisfait."
  author: "Marshall Rosenberg"
```

---

## Blocs d'Emphase

### HeroIcon

Icône dans un cercle coloré. Idéal pour illustrer un concept.

**Syntaxe:**
```
HeroIcon (variante, icône)
```

**Variantes disponibles:**
| Variante | Couleur | Usage |
|----------|---------|-------|
| `primary` | Bleu | Actions principales, positif |
| `destructive` | Rouge | Attention, danger |
| `success` | Vert | Validation, succès |

**Icônes disponibles:**
- `Heart` - Amour, bienveillance
- `AlertTriangle` - Attention, avertissement
- `CheckCheck` - Validation, confirmation
- `MessageCircle` - Communication
- `Users` - Groupe, ensemble
- `User` - Individu
- `UserCheck` - Personne validée
- `Smile` - Émotion positive
- `RefreshCw` - Renouveau, cycle
- `MessageSquare` - Message
- `Settings` - Paramètres

**Exemples:**
```
HeroIcon (primary, Heart)
HeroIcon (destructive, AlertTriangle)
HeroIcon (success, CheckCheck)
HeroIcon (primary, MessageCircle)
```

---

### Callout

Encadré pour mettre en valeur une information importante.

**Syntaxe (sans titre):**
```
Callout (variante): "Contenu"
```

**Syntaxe (avec titre):**
```
Callout (variante, "Titre"): "Contenu"
```

**Variantes disponibles:**
| Variante | Couleur | Usage |
|----------|---------|-------|
| `primary` | Bleu | Information importante |
| `destructive` | Rouge | Avertissement critique |
| `neutral` | Gris | Information neutre |

**Exemples:**
```
Callout (primary): "L'objectif est que l'autre comprenne vraiment ce que tu vis."

Callout (primary, "Conseil"): "Assurez-vous d'avoir 30 à 45 minutes devant vous."

Callout (destructive, "Attention"): "Cet outil n'est pas un substitut à une thérapie relationnelle."

Callout (neutral): "Information neutre sans accent de couleur particulier."
```

---

### WarningCard

Carte d'avertissement avec icône danger. Plus visible qu'un Callout.

**Syntaxe:**
```
WarningCard: "Message d'avertissement"
```

**Exemples:**
```
WarningCard: "Cet outil n'est pas un substitut à une thérapie relationnelle"
WarningCard: "Si vous êtes en situation de crise, contactez un professionnel"
```

---

### TipCard

Carte conseil avec icône ampoule pour donner des astuces pratiques.

**Syntaxe (titre par défaut "Conseil"):**
```
TipCard: "Texte du conseil"
```

**Syntaxe (titre personnalisé):**
```
TipCard: "Texte du conseil"
  title: "Titre personnalisé"
```

**Exemples:**
```
TipCard: "Prends une grande respiration avant de commencer à t'exprimer."

TipCard: "Tu peux reformuler ce que tu as entendu pour t'assurer d'avoir bien compris."
  title: "Astuce"
```

---

## Blocs d'Interaction

### CtaButton

Bouton d'action principal (Call To Action).

**Syntaxe (simple):**
```
CtaButton (variante): "Texte du bouton"
```

**Syntaxe (avec icône):**
```
CtaButton (variante, icône): "Texte du bouton"
```

**Variantes disponibles:**
| Variante | Couleur | Usage |
|----------|---------|-------|
| `primary` | Bleu | Action principale |
| `destructive` | Rouge | Action avec avertissement |

**Icônes optionnelles:**
- `CheckCheck` - Validation
- `Heart` - Action positive
- `ArrowRight` - Continuer
- (toutes les icônes Lucide)

**Exemples:**
```
CtaButton (primary): "Continuer"
CtaButton (destructive): "J'ai compris, continuer"
CtaButton (primary, CheckCheck): "J'ai été entendu"
CtaButton (primary, Heart): "Je me sens prêt"
```

---

### ChoiceCards

Cartes de choix avec icône, titre, description et bouton. Flexible de 1 à 4 cartes.

**Syntaxe:**
```
ChoiceCards (nombre):
  - Icon: IconeName, Title: "Titre", Description: "Description", Button: "Action"
  - Icon: IconeName, Title: "Titre", Description: "Description", Button: "Action"
```

**Syntaxe avec sous-titre (optionnel):**
```
ChoiceCards (nombre):
  - Icon: IconeName, Title: "Titre", Subtitle: "Sous-titre", Description: "Description", Button: "Action"
```

**Exemples:**

**1 carte:**
```
ChoiceCards (1):
  - Icon: Heart, Title: "Seul", Description: "Faire le parcours en solo", Button: "Commencer seul"
```

**2 cartes:**
```
ChoiceCards (2):
  - Icon: User, Title: "Solo", Description: "Régulation émotionnelle personnelle", Button: "Mode Solo"
  - Icon: Users, Title: "Duo", Description: "Communication à deux", Button: "Mode Duo"
```

**2 cartes avec sous-titres:**
```
ChoiceCards (2):
  - Icon: MessageSquare, Title: "Émetteur", Subtitle: "Tu partages", Description: "Tu exprimes ton vécu", Button: "Je suis l'émetteur"
  - Icon: RefreshCw, Title: "Récepteur", Subtitle: "Tu écoutes", Description: "Tu accueilles l'autre", Button: "Je suis le récepteur"
```

**3 cartes:**
```
ChoiceCards (3):
  - Icon: User, Title: "Option A", Description: "Description A", Button: "Choisir A"
  - Icon: Users, Title: "Option B", Description: "Description B", Button: "Choisir B"
  - Icon: Smile, Title: "Option C", Description: "Description C", Button: "Choisir C"
```

**4 cartes:**
```
ChoiceCards (4):
  - Icon: Heart, Title: "Option A", Description: "Description A", Button: "Choisir A"
  - Icon: MessageSquare, Title: "Option B", Description: "Description B", Button: "Choisir B"
  - Icon: UserCheck, Title: "Option C", Description: "Description C", Button: "Choisir C"
  - Icon: Settings, Title: "Option D", Description: "Description D", Button: "Choisir D"
```

---

### ToggleCard

Carte avec switch on/off pour des options binaires.

**Syntaxe (simple):**
```
ToggleCard: "Label"
  checked: true/false
```

**Syntaxe (avec description):**
```
ToggleCard: "Label"
  description: "Description explicative"
  checked: true/false
```

**Exemples:**
```
ToggleCard: "Activer les notifications"
  checked: false

ToggleCard: "Mode silencieux"
  description: "Désactive tous les sons de l'application"
  checked: true
```

---

## Blocs de Formulaire

### StarRating

Système de notation par étoiles cliquables (1 à 5 étoiles).

**Syntaxe:**
```
StarRating (taille)
```

**Tailles disponibles:**
| Taille | Description |
|--------|-------------|
| `sm` | Petit |
| `md` | Moyen |
| `lg` | Grand (défaut) |

**Exemples:**
```
StarRating (sm)
StarRating (md)
StarRating (lg)
```

---

### TextQuestion

Champ de texte avec label et placeholder.

**Syntaxe (requis):**
```
TextQuestion: "Question?" placeholder="Exemple de réponse..."
```

**Syntaxe (optionnel):**
```
TextQuestion (optional): "Question?" placeholder="Exemple de réponse..."
```

**Exemples:**
```
TextQuestion: "Votre message" placeholder="Écrivez ici..."

TextQuestion (optional): "Qu'est-ce qui a été le plus utile?" placeholder="Par exemple: la structure étape par étape..."
```

---

## Blocs de Navigation

### RoleIndicator

Indicateur visuel de qui parle ou écoute.

**Syntaxe:**
```
RoleIndicator (rôle): "Nom"
```

**Rôles disponibles:**
| Rôle | Description |
|------|-------------|
| `speaking` | La personne qui s'exprime |
| `listening` | La personne qui écoute |

**Exemples:**
```
RoleIndicator (speaking): "Marie"
RoleIndicator (listening): "Pierre"
```

---

### StepProgress

Indicateur de progression dans un parcours.

**Syntaxe:**
```
StepProgress: étape_actuelle/total_étapes (variante)
```

**Variantes disponibles:**
| Variante | Description |
|----------|-------------|
| `dots` | Points (rond plein/vide) |
| `bars` | Barres horizontales |
| `numbers` | Chiffres (Étape X sur Y) |

**Exemples:**
```
StepProgress: 3/5 (dots)
StepProgress: 2/4 (bars)
StepProgress: 2/4 (numbers)
```

---

## Blocs Utilitaires

### Separator

Ligne de séparation stylisée.

**Syntaxe:**
```
Separator: variante
```

**Variantes disponibles:**
| Variante | Description |
|----------|-------------|
| `line` | Ligne simple |
| `dots` | Trois points |
| `gradient` | Dégradé coloré |

**Exemples:**
```
Separator: line
Separator: dots
Separator: gradient
```

---

### ExplanationModal

Popup fullscreen pour explications détaillées. S'ouvre au clic sur un lien.

**Syntaxe (sans audio):**
```
ExplanationModal: "Titre"
  triggerText: "Texte du lien"
  Contenu: paragraphes d'explication
```

**Syntaxe (avec audio):**
```
ExplanationModal: "Titre"
  triggerText: "Texte du lien"
  audioSrc: "/audio/fichier.mp3"
  Contenu: paragraphes d'explication
```

**Exemples:**
```
ExplanationModal: "Qu'est-ce que le vécu?"
  triggerText: "En savoir plus"
  Contenu:
    Le vécu désigne l'ensemble des sensations, émotions et ressentis que vous avez expérimentés.
    Il s'agit de ce que vous avez ressenti "dans votre corps".

ExplanationModal: "L'importance de l'ancrage"
  triggerText: "Écouter l'explication"
  audioSrc: "/audio/ancrage.mp3"
  Contenu:
    L'ancrage est une technique qui permet de se recentrer sur le moment présent.
```

---

## Exemples de Pages Complètes

### Page d'Accueil Simple

```
Logo (lg)
PageTitle: "Bienvenue"
Subtitle (muted): "Un espace pour mieux communiquer"
Separator: gradient
Paragraph: "Cet outil vous guide pas à pas dans un processus de communication authentique."
ChoiceCards (2):
  - Icon: User, Title: "Solo", Description: "Régulation émotionnelle personnelle", Button: "Commencer seul"
  - Icon: Users, Title: "Duo", Description: "Communication à deux", Button: "Commencer ensemble"
```

### Page d'Instructions

```
HeroIcon (primary, Heart)
PageTitle: "Mettre la table"
Subtitle (default): "Préparez-vous à communiquer"
Separator: line
Callout (primary, "Conseil"): "Assurez-vous d'avoir 30 à 45 minutes devant vous."
BulletList (primary): ["Trouvez un endroit calme", "Mettez vos téléphones en silencieux", "Installez-vous confortablement"]
TipCard: "Prenez quelques respirations profondes avant de commencer."
CtaButton (primary): "Je suis prêt"
```

### Page d'Avertissement

```
HeroIcon (destructive, AlertTriangle)
PageTitle: "Avant de commencer"
WarningCard: "Cet outil n'est pas un substitut à une thérapie relationnelle"
Paragraph: "Si vous êtes en situation de crise ou ressentez un malaise important, nous vous invitons à consulter un professionnel."
BulletList (destructive): ["Ne pas utiliser en situation de crise", "Ne remplace pas un accompagnement professionnel"]
CtaButton (destructive): "J'ai compris, continuer"
```

### Page de Feedback

```
PageTitle: "Votre avis compte"
Subtitle (muted): "Aidez-nous à améliorer cette expérience"
StarRating (lg)
TextQuestion (optional): "Qu'est-ce qui a été le plus utile?" placeholder="Par exemple: la structure étape par étape..."
TextQuestion (optional): "Que pourrions-nous améliorer?" placeholder="Vos suggestions..."
CtaButton (primary): "Envoyer mon feedback"
```

---

## Règles de Composition

1. **Hiérarchie visuelle** : Commencez par un HeroIcon ou Logo, suivi du PageTitle, puis Subtitle
2. **Séparation** : Utilisez Separator entre les sections logiques
3. **Emphase** : Un seul Callout ou WarningCard par section
4. **Action** : Terminez par un CtaButton clair
5. **Cohérence des couleurs** : 
   - `primary` (bleu) pour le positif, les actions principales
   - `destructive` (rouge) pour les avertissements
   - `success` (vert) pour les validations
   - `neutral` pour les informations sans emphase

---

## Icônes Disponibles (Lucide)

| Icône | Nom | Usage suggéré |
|-------|-----|---------------|
| :heart: | `Heart` | Amour, bienveillance, émotion |
| :warning: | `AlertTriangle` | Avertissement, attention |
| :white_check_mark: | `CheckCheck` | Validation, confirmation |
| :speech_balloon: | `MessageCircle` | Communication, dialogue |
| :busts_in_silhouette: | `Users` | Groupe, couple, ensemble |
| :bust_in_silhouette: | `User` | Individu, solo |
| :heavy_check_mark: | `UserCheck` | Personne validée |
| :grinning: | `Smile` | Émotion positive |
| :arrows_counterclockwise: | `RefreshCw` | Renouveau, inversion |
| :envelope: | `MessageSquare` | Message |
| :gear: | `Settings` | Paramètres |
