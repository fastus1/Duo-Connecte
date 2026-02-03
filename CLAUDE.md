# CLAUDE.md - Duo-Connecte

## Deployment Workflow

**IMPORTANT: TOUJOURS tester sur staging avant production.**

### Branches
| Branche | Usage |
|---------|-------|
| `staging` | Développement et tests |
| `main` | Production (Railway → Circle.so) |

### Environnements
| Environnement | Branche | URL |
|---------------|---------|-----|
| Local | `staging` | `localhost:5000` |
| Portainer (staging) | `staging` | À configurer |
| Railway (production) | `main` | Circle.so |

### Workflow obligatoire

```bash
# 1. TOUJOURS travailler sur staging
git checkout staging

# 2. Développer et tester localement
npm run dev

# 3. Commit sur staging
git add .
git commit -m "feat: description"
git push origin staging

# 4. Tester sur Portainer (staging) si configuré

# 5. SEULEMENT quand tout est validé → merge vers main
git checkout main
git merge staging
git push origin main   # → Railway déploie automatiquement vers Circle.so
```

### Règles strictes

1. **Ne JAMAIS push directement sur main** - toujours passer par staging
2. **Tester localement** avant de commit sur staging
3. **Valider sur staging** avant de merge vers main
4. Les commits sur `main` déclenchent le déploiement production

## Project Info

- **Platform:** Circle.so (embedded)
- **Production:** Railway (auto-deploy from `main`)
- **Staging:** Portainer (à configurer)
- **Database:** Neon PostgreSQL
