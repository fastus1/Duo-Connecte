# CLAUDE.md - Duo-Connecte

App React embarquée dans Circle.so. Railway (production), Neon PostgreSQL.

## Déploiement — Règles strictes

- **Ne JAMAIS push directement sur `main`** — toujours passer par `staging`
- `staging` → développement et tests locaux (`npm run dev`)
- `main` → production (Railway auto-deploy vers Circle.so sur push)
- Workflow : travailler sur `staging` → valider → merge vers `main` → push
