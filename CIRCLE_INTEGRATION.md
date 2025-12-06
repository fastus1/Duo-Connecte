# Guide d'intégration Circle.so

Ce guide explique comment intégrer votre webapp Replit dans Circle.so avec le système d'authentification sécurisé à 3 couches.

## Prérequis

- Un espace Circle.so (forfait Professional ou supérieur recommandé)
- Votre webapp Replit déployée (`https://votre-app.replit.app`)
- Accès aux paramètres de votre espace Circle.so

## Configuration Circle.so

### Étape 1 : Protéger vos pages

1. Connectez-vous à votre espace Circle.so
2. Allez dans **Settings → Privacy → Pages**
3. Sélectionnez la page qui contiendra l'iframe
4. Activez l'option **"Members Only"**
5. Sauvegardez

### Étape 2 : Ajouter le script JavaScript

1. Allez dans **Settings → Custom Code → Header**
2. Ajoutez le code suivant :

```html
<script>
/************************************************************
 * SCRIPT : AUTH + THÈME
 * Cible : votre-app.replit.app
 ************************************************************/
(function() {
  const IFRAME_ORIGIN = 'https://votre-app.replit.app';
  
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  function buildPayload() {
    if (!window.circleUser) return null;
    return {
      type: 'CIRCLE_USER_AUTH',
      user: {
        publicUid: window.circleUser.publicUid,
        email: window.circleUser.email,
        name: window.circleUser.name,
        isAdmin: window.circleUser.isAdmin === 'true' || window.circleUser.isAdmin === true,
        timestamp: Date.now()
      },
      theme: getTheme()
    };
  }
  
  function sendToIframe() {
    const iframe = document.querySelector('iframe[src*="votre-app.replit.app"]');
    const payload = buildPayload();
    if (iframe && iframe.contentWindow && payload) {
      iframe.contentWindow.postMessage(payload, '*');
    }
  }
  
  // Écouter les demandes de l'iframe
  window.addEventListener('message', function(event) {
    if (event.origin === IFRAME_ORIGIN && event.data?.type === 'CIRCLE_AUTH_REQUEST') {
      sendToIframe();
    }
  });
  
  // Envoyer dès que circleUser est disponible
  let sent = false;
  const interval = setInterval(function() {
    if (window.circleUser && !sent) {
      const iframe = document.querySelector('iframe[src*="votre-app.replit.app"]');
      if (iframe) {
        sendToIframe();
        sent = true;
        clearInterval(interval);
      }
    }
  }, 500);
  
  setTimeout(function() { clearInterval(interval); }, 30000);
})();
</script>
```

3. **Remplacez** `votre-app.replit.app` par votre URL Replit exacte (3 occurrences)
4. Sauvegardez

### Étape 3 : Intégrer l'iframe

1. Créez ou éditez la page Circle.so
2. Ajoutez un bloc HTML/Embed :

```html
<iframe 
  src="https://votre-app.replit.app" 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
  allow="clipboard-write"
></iframe>
```

## Configuration Replit

### Variables d'environnement

Dans Replit → Secrets, configurez :

| Variable | Description |
|----------|-------------|
| `VITE_CIRCLE_ORIGIN` | URL de votre espace Circle.so (ex: `https://communaute.exemple.com`) |
| `SESSION_SECRET` | Chaîne aléatoire longue pour JWT |
| `DATABASE_URL` | URL PostgreSQL (auto-configurée par Replit) |

## Points critiques Circle.so

- Circle.so utilise **camelCase** : `publicUid`, `isAdmin`, `firstName`, `lastName`
- `isAdmin` est retourné comme **STRING** `"true"` ou `"false"`, pas boolean
- Le script gère la conversion automatiquement

## Test de l'intégration

### Mode développement (sans Circle.so)

1. Dans le Dashboard Admin, désactivez **Couche 1** (Exiger le domaine Circle.so)
2. L'app utilise un utilisateur mock `dev@example.com` (admin)
3. Testez les fonctionnalités

### Mode production (avec Circle.so)

1. Activez les 3 couches dans le Dashboard Admin
2. Déployez votre Replit
3. Testez dans Circle.so :
   - Nouvel utilisateur → Création NIP
   - Utilisateur existant → Saisie NIP
   - Le thème se synchronise automatiquement

## Dépannage

### "Accès restreint" affiché

- Vérifiez que `VITE_CIRCLE_ORIGIN` correspond exactement à l'URL Circle.so
- Vérifiez que le script JavaScript est bien dans le Header
- Vérifiez que l'iframe utilise la bonne URL

### Thème ne se synchronise pas

- Le script envoie le thème avec `postMessage`
- L'app l'applique automatiquement via le ThemeProvider

### Trop de tentatives (rate limiting)

- Attendez 15 minutes
- En développement, redémarrez le serveur

## Checklist production

- [ ] `VITE_CIRCLE_ORIGIN` configuré correctement
- [ ] Pages Circle.so en "Members Only"
- [ ] Script JavaScript avec la bonne URL
- [ ] 3 couches de sécurité activées
- [ ] Test de connexion réussi
