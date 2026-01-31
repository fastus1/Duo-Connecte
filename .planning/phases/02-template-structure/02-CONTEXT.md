# Phase 2: Template Structure - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Créer la documentation nécessaire pour qu'une AI (Claude Code avec GSD) puisse comprendre et utiliser cette template Circle.so efficacement. L'objectif est de rendre la template "prête à cloner" — un développeur (humain ou AI) doit pouvoir dupliquer le repo et commencer à construire immédiatement.

**Note:** Le scope original de Phase 2 (créer des pages Home/Demo) est abandonné. La template a déjà une structure fonctionnelle (auth, admin, support). Ce qu'il manque c'est la documentation pour qu'une AI comprenne rapidement l'architecture.

</domain>

<decisions>
## Implementation Decisions

### Format de documentation
- Un seul fichier `ARCHITECTURE.md` à la racine du projet
- Pas de docs éparpillés dans plusieurs fichiers — tout dans un endroit
- L'AI peut loader un fichier et avoir le contexte complet

### Niveau de détail
- **Détaillé** — assez pour comprendre les connexions sans noyer dans les détails
- Inclure: structure des dossiers, flux principal, technologies, relations entre composants, responsabilités des modules
- Exclure: documentation de chaque fichier individuellement

### Langue
- Documentation en **français**

### Diagrammes
- Diagrammes ASCII **où ça clarifie** (ex: flux d'authentification)
- Pas de diagrammes pour le plaisir — seulement si ça aide la compréhension

### Patterns d'extension
- Pas de guides step-by-step détaillés
- L'AI lira le code existant et comprendra les patterns
- Juste **pointer où sont les choses**:
  - Pages: `client/src/pages/`, routes dans `App.tsx`
  - API: `server/routes/`
  - Schema DB: `shared/schema.ts`

### Configuration
- `.env.example` existant est suffisant
- Mention brève des modes dev/prod dans l'architecture (géré via admin panel)

### Claude's Discretion
- Structure exacte des sections dans ARCHITECTURE.md
- Quels diagrammes ASCII inclure
- Niveau de détail pour chaque composant

</decisions>

<specifics>
## Specific Ideas

- "C'est pour une AI qui va prendre le projet avec /gsd:new-project"
- L'AI doit pouvoir parser la doc et savoir où mettre les mains
- Pas besoin de hand-holding — l'AI figure out les détails en lisant le code

</specifics>

<deferred>
## Deferred Ideas

- Phase 3 (Documentation & Data) du roadmap original peut être simplifiée ou fusionnée
- Scripts de reset DB — à évaluer si vraiment nécessaire pour une template

</deferred>

---

*Phase: 02-template-structure*
*Context gathered: 2026-01-31*
