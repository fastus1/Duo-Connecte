# Système de Contrôle d'Accès pour Applications Circle.so

## Protection par Paiement (Paywall)

### Description

Cette protection vérifie que l'utilisateur a effectué un paiement en vérifiant son email dans la table `paid_members`.

### Message affiché si bloqué

```
Accès Réservé
Cette application est réservée aux membres ayant souscrit à l'offre. 
Obtenez votre accès pour profiter de tous les parcours de communication 
et de régulation émotionnelle.

[Bouton: Acheter maintenant]  [Bouton: Plus d'informations]
```

### Configuration Admin

- **Toggle** : Développement / Production
- **Développement** : Accès accordé à tous (bypass du paywall)
- **Production** : Seuls les membres payants ont accès

### Structure de la base de données

```sql
-- Table: paid_members
CREATE TABLE paid_members (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  payment_date TIMESTAMP DEFAULT NOW(),
  payment_plan VARCHAR(100),
  amount_paid VARCHAR(50),
  coupon_used VARCHAR(100)
);

-- Table: app_settings
CREATE TABLE app_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT
);

-- Paramètres initiaux
INSERT INTO app_settings (key, value) VALUES ('environment', 'development');
INSERT INTO app_settings (key, value) VALUES ('circleOnlyMode', 'false');
```

### Code Frontend (AccessContext.tsx)

```typescript
// Vérifier l'accès
const checkAccess = useCallback(async () => {
  setAccessStatus('loading');
  
  // Récupérer l'environnement
  const response = await fetch('/api/settings');
  const { environment } = await response.json();
  
  // Mode développement : accès accordé
  if (environment === 'development') {
    setAccessStatus('granted');
    return;
  }
  
  // Mode production : vérifier le paiement
  if (!userEmail) {
    setAccessStatus('denied');
    return;
  }
  
  const accessResponse = await fetch('/api/check-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail }),
  });
  
  const { hasAccess } = await accessResponse.json();
  setAccessStatus(hasAccess ? 'granted' : 'denied');
}, [userEmail]);
```

### Code Backend (routes.ts)

```typescript
// POST /api/check-access - Vérifier si l'utilisateur a payé
app.post("/api/check-access", async (req, res) => {
  const { email } = req.body;
  
  // Récupérer l'environnement
  const environment = await storage.getSetting("environment") || "development";
  
  // Mode développement : accès accordé à tous
  if (environment === "development") {
    return res.json({ hasAccess: true, mode: "development" });
  }
  
  // Mode production : vérifier le paiement
  if (!email) {
    return res.json({ hasAccess: false, mode: "production" });
  }
  
  const paidMember = await storage.getPaidMemberByEmail(email);
  res.json({ 
    hasAccess: !!paidMember, 
    mode: "production" 
  });
});

// POST /api/admin/settings/environment - Changer l'environnement
app.post("/api/admin/settings/environment", async (req, res) => {
  const adminPin = req.headers["x-admin-pin"];
  if (adminPin !== process.env.ADMIN_PIN) {
    return res.status(401).json({ error: "PIN invalide" });
  }
  
  const { environment } = req.body;
  await storage.setSetting("environment", environment);
  res.json({ environment });
});
```

### Webhook Circle.so pour enregistrer les paiements

Ce script s'ajoute à la fin du processus de paiement Circle.so :

```html
<script>
fetch('https://VOTRE-APP.replit.app/webhooks/circle-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'payment_received',
    user: {
      email: '{member_email}',
      timestamp: Math.floor(Date.now() / 1000)
    },
    payment: {
      paywall_display_name: '{paywall_display_name}',
      amount_paid: '{amount_paid}',
      price_interval: '{paywall_price_interval}',
      coupon_code: '{coupon_code}'
    }
  })
});
</script>
```

### Route Webhook Backend

```typescript
// POST /webhooks/circle-payment - Recevoir les paiements
app.post("/webhooks/circle-payment", async (req, res) => {
  const { user, payment } = req.body;
  
  if (!user?.email) {
    return res.status(400).json({ error: "Email requis" });
  }
  
  // Vérifier si déjà enregistré
  const existing = await storage.getPaidMemberByEmail(user.email);
  if (existing) {
    return res.json({ success: true, message: "Membre déjà enregistré" });
  }
  
  // Enregistrer le nouveau membre
  await storage.createPaidMember({
    email: user.email,
    paymentPlan: payment?.paywall_display_name,
    amountPaid: payment?.amount_paid,
    couponUsed: payment?.coupon_code,
  });
  
  res.json({ success: true, message: "Accès activé" });
});
```

---

## 3. Interface Admin

### Accès

- **URL** : `/admin`
- **Protection** : Code PIN à 6 chiffres (variable d'environnement `ADMIN_PIN`)

### Fonctionnalités

1. **Toggle Développement / Production** : Contrôle le paywall
2. **Toggle Ouvert / Circle.so** : Contrôle la vérification d'origine
3. **Liste des feedbacks** : Voir tous les retours utilisateurs
4. **Export** : Exporter les données au format Markdown

### Code du Toggle Admin

```tsx
// Toggle Environnement
<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
  <Button
    variant={environment === 'development' ? 'default' : 'ghost'}
    size="sm"
    onClick={() => handleEnvironmentChange('development')}
  >
    Développement
  </Button>
  <Button
    variant={environment === 'production' ? 'default' : 'ghost'}
    size="sm"
    onClick={() => handleEnvironmentChange('production')}
  >
    Production
  </Button>
</div>

// Toggle Circle.so
<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
  <Button
    variant={!circleOnlyMode ? 'default' : 'ghost'}
    size="sm"
    onClick={() => handleCircleOnlyChange(false)}
  >
    Ouvert
  </Button>
  <Button
    variant={circleOnlyMode ? 'default' : 'ghost'}
    size="sm"
    onClick={() => handleCircleOnlyChange(true)}
  >
    Circle.so
  </Button>
</div>
```

---

## 4. Récapitulatif des Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `ADMIN_PIN` | Code PIN pour l'accès admin | `074491` |
| `SESSION_SECRET` | Secret pour les sessions | `votre-secret-aleatoire` |

---

## 5. Schéma Drizzle (schema.ts)

```typescript
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Table des membres payants
export const paidMembers = pgTable("paid_members", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentPlan: text("payment_plan"),
  amountPaid: text("amount_paid"),
  couponUsed: text("coupon_used"),
});

// Table des paramètres
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
});

// Schemas Zod
export const insertPaidMemberSchema = createInsertSchema(paidMembers).omit({ id: true, paymentDate: true });
export type InsertPaidMember = z.infer<typeof insertPaidMemberSchema>;
export type PaidMember = typeof paidMembers.$inferSelect;
```

---

## 6. Checklist de Déploiement

### Avant la mise en production

- [ ] Définir `ADMIN_PIN` dans les variables d'environnement
- [ ] Définir `DATABASE_URL` pour PostgreSQL
- [ ] Pousser le schéma avec `npm run db:push`
- [ ] Configurer le mode "Production" dans l'admin
- [ ] Configurer le mode "Circle.so" dans l'admin
- [ ] Ajouter le script postMessage dans Circle.so (Code Snippets)
- [ ] Ajouter le script webhook paiement dans Circle.so
- [ ] Tester le flux complet depuis Circle.so

### URLs à personnaliser

- `ALLOWED_ORIGIN` : L'URL de votre communauté Circle.so
- Liens dans PaywallScreen : Page d'achat et page d'informations
- URL du webhook dans le script de paiement

---

## 7. Dépannage

### "Accès non autorisé" s'affiche même depuis Circle.so

1. Vérifier que le script postMessage est bien ajouté dans Circle.so
2. Vérifier que `ALLOWED_ORIGIN` correspond exactement à l'URL Circle.so
3. Vérifier les logs de la console pour voir l'origine reçue

### "Accès Réservé" s'affiche pour un membre payant

1. Vérifier que l'email est bien enregistré dans `paid_members`
2. Vérifier que le webhook de paiement fonctionne
3. Vérifier que l'email Circle.so correspond à l'email de paiement

### Le toggle admin ne fonctionne pas

1. Vérifier que le PIN est correct
2. Vérifier les logs du serveur pour les erreurs
3. Vérifier que la table `app_settings` existe en base

---

