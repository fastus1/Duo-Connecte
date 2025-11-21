# Guide d'intégration Circle.so

Ce guide explique comment intégrer votre webapp Replit dans Circle.so avec le système d'authentification sécurisé.

## 📋 Prérequis

- Un espace Circle.so (forfait Professional ou supérieur recommandé)
- Votre webapp Replit déployée et accessible via une URL publique (`https://votre-app.replit.app`)
- Accès aux paramètres de votre espace Circle.so

## 🔧 Configuration Circle.so

### Étape 1 : Protéger vos pages

1. Connectez-vous à votre espace Circle.so
2. Allez dans **Settings → Privacy → Pages**
3. Sélectionnez la page qui contiendra l'iframe de votre webapp
4. Activez l'option **"Members Only"** pour cette page
5. Sauvegardez les modifications

> ⚠️ **Important** : Sans cette protection, n'importe qui pourrait accéder à votre webapp, même les non-membres.

### Étape 2 : Ajouter le code JavaScript de transmission

1. Allez dans **Settings → Custom Code**
2. Sélectionnez l'onglet **"Header"** (ou "Footer" selon votre préférence)
3. Ajoutez le code suivant :

```javascript
window.addEventListener('load', function() {
  // Sélectionner l'iframe de votre webapp
  // Adaptez le sélecteur selon votre URL Replit
  const iframe = document.querySelector('iframe[src*="votre-app.replit.app"]');
  
  // Vérifier périodiquement si circleUser est disponible
  const checkUser = setInterval(function() {
    if (window.circleUser && iframe) {
      clearInterval(checkUser);
      
      // Préparer les données utilisateur
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
      
      // Envoyer via postMessage à l'iframe
      // ⚠️ IMPORTANT : Remplacer par votre URL Replit exacte
      iframe.contentWindow.postMessage(
        userData, 
        'https://votre-app.replit.app'
      );
      
      console.log('✅ Données utilisateur envoyées à l\'iframe');
    }
  }, 100); // Vérifier toutes les 100ms
});
```

4. **Remplacez** `votre-app.replit.app` par votre URL Replit **exacte**
5. Sauvegardez les modifications

### Étape 3 : Intégrer l'iframe dans votre page

1. Créez ou éditez la page Circle.so où vous voulez afficher votre webapp
2. Passez en mode **"Edit Page"** ou **"HTML/Embed"**
3. Ajoutez le code HTML suivant :

```html
<iframe 
  src="https://votre-app.replit.app" 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  allow="clipboard-write"
></iframe>
```

4. **Personnalisez** selon vos besoins :
   - `width` : Largeur de l'iframe (100% recommandé)
   - `height` : Hauteur en pixels (ajustez selon votre contenu)
   - `style` : Styles CSS personnalisés

5. Sauvegardez la page

## ⚙️ Configuration Replit

### Variables d'environnement requises

Dans votre Replit, configurez ces variables d'environnement :

```bash
# URL exacte de votre espace Circle.so (sans trailing slash)
VITE_CIRCLE_ORIGIN=https://votre-espace.circle.so

# Mode développement (mettre à false en production)
VITE_DEV_MODE=false

# Secret JWT (générer une chaîne aléatoire longue)
JWT_SECRET=votre_secret_jwt_très_long_et_complexe_ici

# URL de la base de données
DATABASE_URL=postgresql://user:password@host:port/database
```

### Comment ajouter les variables dans Replit :

1. Ouvrez votre Replit
2. Cliquez sur l'onglet **"Secrets"** (icône de cadenas) dans le panneau de gauche
3. Ajoutez chaque variable :
   - **Key** : Nom de la variable (ex: `VITE_CIRCLE_ORIGIN`)
   - **Value** : Valeur correspondante
4. Cliquez sur **"Add new secret"** pour chaque variable

## 🧪 Test de l'intégration

### Test en mode développement (local)

1. Dans Replit, définissez `VITE_DEV_MODE=true`
2. Lancez votre application
3. Vous verrez un badge **"MODE DÉVELOPPEMENT"** en haut à droite
4. L'authentification Circle.so est bypassée (utilisateur mock)
5. Testez la création de NIP et la connexion

### Test en production (avec Circle.so)

1. Définissez `VITE_DEV_MODE=false`
2. Déployez votre application Replit
3. Sur Circle.so :
   - Connectez-vous en tant que membre
   - Accédez à la page contenant l'iframe
   - Vérifiez dans la console du navigateur (F12) :
     ```
     ✅ Circle.so user data received
     ```
4. Première connexion :
   - Vous devriez voir le formulaire "Créer un NIP"
   - Créez votre NIP (4-6 chiffres)
   - Vous êtes redirigé vers le dashboard
5. Reconnexions suivantes :
   - Vous voyez le formulaire "Connexion"
   - Entrez votre NIP
   - Accès au dashboard

## 🔍 Dépannage

### Problème : "Origine non autorisée" dans la console

**Solution :**
- Vérifiez que `VITE_CIRCLE_ORIGIN` dans Replit correspond **exactement** à votre URL Circle.so
- Assurez-vous qu'il n'y a **pas de trailing slash** (`/`) à la fin
- Redéployez l'application après modification

### Problème : L'iframe ne reçoit pas les données

**Solution :**
1. Vérifiez dans la console Circle.so (F12) :
   - Y a-t-il le message "✅ Données utilisateur envoyées à l'iframe" ?
2. Si non, vérifiez :
   - Que `window.circleUser` est disponible (tapez dans la console)
   - Que le sélecteur d'iframe est correct dans le code JavaScript
3. Dans le code JavaScript Circle.so, remplacez le sélecteur par :
   ```javascript
   const iframe = document.querySelector('iframe');
   ```

### Problème : "Token expiré" lors de la validation

**Solution :**
- Le timestamp a plus de 60 secondes (protection anti-replay)
- Rechargez la page Circle.so
- Si le problème persiste, augmentez la limite dans le backend (déconseillé pour la sécurité)

### Problème : Rate limiting (trop de tentatives)

**Solution :**
- Attendez 15 minutes avant de réessayer
- En développement, vous pouvez redémarrer le serveur pour réinitialiser
- En production, c'est une protection normale contre le brute force

### Problème : L'iframe ne s'affiche pas

**Solution :**
1. Vérifiez que votre Replit est bien déployé et accessible publiquement
2. Testez l'URL directement dans votre navigateur
3. Vérifiez les paramètres CSP (Content Security Policy) de Circle.so
4. Essayez de désactiver temporairement les bloqueurs de pub/scripts

## 🔒 Vérification de sécurité

### Checklist avant la mise en production :

- [ ] Pages Circle.so configurées en "Members Only"
- [ ] `VITE_CIRCLE_ORIGIN` correctement configuré dans Replit
- [ ] `VITE_DEV_MODE=false` en production
- [ ] `JWT_SECRET` est une chaîne longue et aléatoire (min 32 caractères)
- [ ] HTTPS activé (automatique sur Replit)
- [ ] Code JavaScript Circle.so utilise l'URL exacte de votre Replit
- [ ] Test de connexion réussi avec un compte membre
- [ ] Test de rate limiting (5 tentatives échouées)
- [ ] Session expire bien après 60 minutes d'inactivité

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez la console du navigateur** (F12) pour les erreurs JavaScript
2. **Vérifiez les logs Replit** pour les erreurs backend
3. **Testez en mode DEV** pour isoler le problème
4. **Consultez** `replit.md` pour la documentation technique complète

## 🎯 Ressources

- [Documentation Circle.so - Custom Code](https://community.circle.so/c/platform-updates/)
- [Documentation Replit - Deployment](https://docs.replit.com/hosting/deployments/about-deployments)
- [Guide de sécurité - Defense in Depth](https://www.fortinet.com/resources/cyberglossary/defense-in-depth)

---

**Félicitations !** Votre webapp est maintenant intégrée de manière sécurisée dans Circle.so. 🎉
