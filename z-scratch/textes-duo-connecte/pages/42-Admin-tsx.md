# PAGE ADMINISTRATION (Admin.tsx)

## Écran de connexion

### Titre

Administration

### Description

Accédez à l'espace administrateur

### Placeholder

000000

### Bouton

Se connecter

### Toast erreur

- Titre: Erreur
- Description: Le PIN doit contenir 6 chiffres

## Écran principal admin

### Barre supérieure

- Texte: Administration
- Boutons toggle: Développement / Production

### Titre

Feedbacks des utilisateurs

### Sous-titre

{count} feedback(s) enregistré(s)

### Boutons

- Télécharger Markdown
- Déconnexion

### État vide

Aucun feedback pour le moment

### État chargement

Chargement des feedbacks...

### Carte feedback

- Étoiles: [affichage visuel des étoiles]
- Note: {rating}/5
- Date: [date formatée en français]
- Section "Ce qui a été le plus utile :" (si renseigné)
- Section "Ce qui pourrait être amélioré :" (si renseigné)
- Message si vide: Aucun commentaire fourni

### Toasts

- Téléchargement réussi: {count} feedback(s) exporté(s) en Markdown
- Aucun feedback: Il n'y a pas de feedbacks à télécharger.
- Environnement modifié: Mode {Développement/Production} activé
- Accès refusé: PIN incorrect. Veuillez réessayer.
