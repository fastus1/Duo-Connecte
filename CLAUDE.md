# CLAUDE.md - Duo-Connecte

## Deployment Workflow

**IMPORTANT: TOUJOURS tester sur staging avant production.**

### Branches
| Branche | Usage |
|---------|-------|
| `staging` | Développement et tests |
| `main` | Production (Railway → Circle.so) |

### Environnements
| Environnement | Branche | Indicateur | Déploiement |
|---------------|---------|------------|-------------|
| Local | `staging` | - | `npm run dev` |
| Portainer (staging) | `staging` | Badge orange "STAGING" | Manuel (Pull and redeploy) |
| Railway (production) | `main` | Aucun | Auto sur push |

### Workflow obligatoire

```bash
# 1. TOUJOURS travailler sur staging
git checkout staging

# 2. Développer et tester localement
npm run dev

# 3. Commit et push sur staging
git add .
git commit -m "feat: description"
git push origin staging

# 4. Redéployer sur Portainer
#    → Stacks → duo-connecte-staging → Pull and redeploy
#    → Vérifier le badge orange "STAGING" visible

# 5. SEULEMENT quand tout est validé → merge vers main
git checkout main
git merge staging
git push origin main   # → Railway déploie automatiquement vers Circle.so
```

### Règles strictes

1. **Ne JAMAIS push directement sur main** - toujours passer par staging
2. **Tester localement** avant de commit sur staging
3. **Valider sur Portainer (staging)** avant de merge vers main
4. Les commits sur `main` déclenchent le déploiement production
5. Le badge orange "STAGING" confirme que tu es sur l'environnement de test

## Project Info

- **Platform:** Circle.so (embedded)
- **Production:** Railway (auto-deploy from `main`)
- **Staging:** Portainer (port 5001, branche `staging`)
- **Database:** Neon PostgreSQL

## Docker

Le projet utilise Docker pour le déploiement staging:
- `Dockerfile` - Build multi-stage Node.js
- `docker-compose.yml` - Configuration Portainer avec `VITE_APP_ENV=staging`

## Identificateur d'environnement

- **Staging:** Badge orange "STAGING" en bas à gauche (visible)
- **Production:** Aucun badge (clean pour les utilisateurs)
