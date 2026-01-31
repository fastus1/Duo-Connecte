# Phase 3: Documentation & Data - Research

**Researched:** 2026-01-31
**Domain:** Technical documentation, database management, developer guides
**Confidence:** HIGH

## Summary

This phase focuses on two parallel tracks: (1) creating comprehensive developer documentation for the Circle App Template, and (2) building database reset tooling for clean-slate deployments. The codebase already has ARCHITECTURE.md (333 lines, French) covering technical details, but lacks README.md, extension guides, inline code comments, and database management scripts.

The documentation effort should follow established README best practices from the open-source community - structured sections, practical code examples, and clear installation instructions. For database reset, Drizzle ORM does not provide built-in reset functionality, so a custom script using TRUNCATE with CASCADE (to preserve schema while clearing data) is the recommended approach.

**Primary recommendation:** Create README.md following the Best-README-Template structure, add JSDoc comments to key files (contexts, middleware, routes), and build a `scripts/db-reset.ts` using Drizzle's delete operations with proper foreign key handling.

## Standard Stack

### Core (Already in Project)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Drizzle ORM | ^0.39.1 | Database ORM | Already used - provides delete/truncate APIs |
| drizzle-kit | ^0.31.4 | DB migrations | Already used - `npm run db:push` for schema sync |
| tsx | ^4.20.5 | TypeScript runner | Already used - can run scripts directly |

### Supporting (No new libraries needed)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| JSDoc | Inline documentation | Document functions, interfaces, modules |
| Markdown | README/guides | Standard for GitHub documentation |
| TypeScript comments | Code explanation | Complex logic, non-obvious patterns |

### No New Dependencies Required

This phase is documentation and scripting focused. All database operations use existing Drizzle ORM patterns. No additional npm packages needed.

**Installation:**
```bash
# No new packages - use existing stack
```

## Architecture Patterns

### Recommended Documentation Structure

```
/
├── README.md                    # Main entry point (NEW)
├── ARCHITECTURE.md              # Technical deep-dive (EXISTS)
├── docs/
│   └── extension-guide.md       # How to extend template (NEW)
├── scripts/
│   └── db-reset.ts              # Database reset script (NEW)
└── .env.example                 # Environment reference (EXISTS)
```

### Pattern 1: README.md Structure

**What:** Standard README sections for open-source templates
**When to use:** Main project documentation
**Source:** [Make a README](https://www.makeareadme.com/), [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

```markdown
# Circle App Template

## Overview
Brief description of what this template provides.

## Features
- Circle.so SSO integration
- Optional PIN authentication
- Paywall support
- Admin dashboard

## Prerequisites
- Node.js 18+
- PostgreSQL (Neon recommended)
- Circle.so community

## Installation
Step-by-step setup instructions.

## Configuration
Environment variables table.

## Usage
How to start development and production.

## Extension
How to add pages, routes, database tables.

## Deployment
Railway/Vercel/Replit deployment steps.

## License
MIT
```

### Pattern 2: JSDoc Comments for TypeScript

**What:** Structured comments for functions, interfaces, and modules
**When to use:** Key files: contexts, middleware, routes, storage
**Source:** [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

```typescript
/**
 * Validates user data received from Circle.so postMessage.
 *
 * Checks email format, handles Liquid template failures,
 * and normalizes optional fields (publicUid, name, timestamp).
 *
 * @param data - User data from Circle.so authentication
 * @returns Validation result with error message if invalid
 *
 * @example
 * const result = validateUserData({
 *   email: 'user@example.com',
 *   publicUid: 'circle_123',
 *   name: 'John Doe',
 *   timestamp: Date.now()
 * });
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateUserData(data: CircleUserData): ValidationResult {
  // Implementation
}
```

### Pattern 3: Database Reset Script

**What:** Script to clear all user data while preserving schema
**When to use:** Clean-slate deployments, testing, template distribution
**Source:** [Drizzle ORM Delete](https://orm.drizzle.team/docs/delete), [Community patterns](https://github.com/drizzle-team/drizzle-orm/discussions/3906)

```typescript
// scripts/db-reset.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

neonConfig.webSocketConstructor = ws;

async function resetDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not set');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle({ client: pool, schema });

  console.log('Resetting database...');

  // Delete in order respecting foreign keys
  // (login_attempts references users)
  await db.delete(schema.loginAttempts);
  await db.delete(schema.supportTickets);
  await db.delete(schema.feedbacks);
  await db.delete(schema.paidMembers);
  await db.delete(schema.users);

  // Reset app_config to defaults (don't delete)
  await db.update(schema.appConfig).set({
    requireCircleDomain: true,
    requireCircleLogin: true,
    requirePaywall: false,
    requirePin: true,
    environment: 'development',
    updatedAt: new Date(),
  });

  console.log('Database reset complete. Schema preserved.');
  await pool.end();
}

resetDatabase().catch(console.error);
```

### Anti-Patterns to Avoid

- **Inline comments explaining obvious code:** Comments should explain WHY, not WHAT
- **Outdated documentation:** Keep README in sync with actual setup process
- **DROP TABLE for reset:** Loses schema, requires re-migration
- **Hardcoded examples:** Use `.env.example` patterns, not real credentials

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| README generation | Auto-generators | Manual markdown | Template-specific content needed |
| Documentation site | Docusaurus/VitePress | Simple markdown files | Overkill for single template |
| DB migration | Custom SQL scripts | drizzle-kit push | Already handles schema sync |
| Schema documentation | Manual ER diagrams | schema.ts comments | Single source of truth |

**Key insight:** This is documentation work, not tooling work. The codebase is small enough that manual, thoughtful documentation beats auto-generation. Focus on quality explanation over quantity.

## Common Pitfalls

### Pitfall 1: Incomplete Environment Variable Documentation

**What goes wrong:** Users copy `.env.example` but don't understand what each variable does
**Why it happens:** Developers know the codebase, forget what's not obvious
**How to avoid:** Document EVERY env var with description, example value, and whether required
**Warning signs:** Support tickets asking "what should I put for X?"

### Pitfall 2: Foreign Key Violations in Reset Script

**What goes wrong:** `DELETE FROM users` fails because `login_attempts` references it
**Why it happens:** Foreign key constraints enforce referential integrity
**How to avoid:** Delete in reverse dependency order (children before parents)
**Warning signs:** "foreign key constraint violation" errors

### Pitfall 3: Stale Code Examples

**What goes wrong:** README shows old patterns, actual code has evolved
**Why it happens:** Documentation updated separately from code
**How to avoid:** Extract examples from actual codebase where possible, or add tests
**Warning signs:** Examples that don't compile or match current file structure

### Pitfall 4: Missing Circle.so Context in Docs

**What goes wrong:** Developers don't understand iframe/postMessage integration
**Why it happens:** Circle.so SSO is specific domain knowledge
**How to avoid:** Explain the Circle.so communication flow explicitly with diagrams
**Warning signs:** Questions about "how does authentication work?"

### Pitfall 5: Database Reset Deletes Config

**What goes wrong:** Reset script removes app_config, app fails on next startup
**Why it happens:** Treating all tables the same
**How to avoid:** Reset config to defaults, don't delete the row
**Warning signs:** "No config found" errors after reset

## Code Examples

### Environment Variables Documentation Pattern

```markdown
## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Yes | Secret for session tokens (min 32 chars) | `your-super-secret-key-here` |
| `VITE_CIRCLE_ORIGIN` | Yes | Your Circle.so community URL | `https://community.circle.so` |
| `VITE_DEV_MODE` | No | Bypass auth in development | `true` / `false` (default) |
| `PORT` | No | Server port | `5000` (default) |
| `NODE_ENV` | No | Environment mode | `development` / `production` |
```

### Extension Guide: Adding a New Page

```markdown
## Adding a New Page

1. **Create the page component** in `client/src/pages/`:

\`\`\`tsx
// client/src/pages/MyNewPage.tsx
export default function MyNewPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">My New Page</h1>
    </div>
  );
}
\`\`\`

2. **Add the route** in `client/src/App.tsx`:

\`\`\`tsx
import MyNewPage from "@/pages/MyNewPage";

// Inside SessionRouter's Switch:
<Route path="/my-new-page" component={MyNewPage} />
\`\`\`

3. **Protected vs Public:**
   - Public: Add path to the public check in `AccessGate`
   - Protected: Default behavior, requires authentication
```

### Extension Guide: Adding an API Route

```markdown
## Adding an API Route

1. **Create route file** in `server/routes/`:

\`\`\`typescript
// server/routes/myfeature.ts
import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

router.get('/items', requireAuth, async (req: Request, res: Response) => {
  try {
    // Your logic here
    return res.json({ items: [] });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
\`\`\`

2. **Register in routes index**:

\`\`\`typescript
// server/routes/index.ts
import myfeatureRouter from "./myfeature";

export function registerModularRoutes(app: Express): void {
  // ... existing routes
  app.use('/api/myfeature', myfeatureRouter);
}
\`\`\`
```

### Key Files Needing Comments

| File | Why It Needs Comments |
|------|----------------------|
| `client/src/contexts/AccessContext.tsx` | Complex Circle.so postMessage flow |
| `client/src/contexts/SessionContext.tsx` | Session state management |
| `server/middleware.ts` | Auth functions, JWT handling |
| `server/storage.ts` | Storage interface pattern |
| `server/routes/auth.ts` | Multi-step auth flow |
| `shared/schema.ts` | Database table purposes |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JSDoc for types | TypeScript native types | 2020+ | Use JSDoc for docs, TS for types |
| Wiki-style docs | README + inline docs | - | Single source of truth preferred |
| Raw SQL for reset | ORM delete operations | - | Type-safe, schema-aware |

**Current best practices:**
- README.md as primary entry point
- Inline JSDoc for function documentation
- TypeScript types replace @type annotations
- Code examples extracted from actual codebase

## Open Questions

1. **ARCHITECTURE.md Language**
   - What we know: Currently in French (333 lines)
   - What's unclear: Should it stay French or be translated?
   - Recommendation: Keep French (seems intentional for target audience), README in English

2. **Seed Data After Reset**
   - What we know: MemStorage seeds admin user on init
   - What's unclear: Should reset script also re-seed?
   - Recommendation: Separate reset from seeding - optional `--seed` flag

3. **Documentation Depth**
   - What we know: Full ARCHITECTURE.md exists
   - What's unclear: How much to duplicate in README vs reference
   - Recommendation: README for quick start, ARCHITECTURE for deep dive

## Sources

### Primary (HIGH confidence)

- Codebase analysis: `shared/schema.ts`, `server/storage.ts`, `server/routes/*.ts`
- [Drizzle ORM Delete Documentation](https://orm.drizzle.team/docs/delete) - Delete syntax and patterns
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) - Comment syntax

### Secondary (MEDIUM confidence)

- [Make a README](https://www.makeareadme.com/) - README structure best practices
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) - Section templates
- [The Good Docs Project - README Guide](https://www.thegooddocsproject.dev/template/readme) - Content guidelines
- [Drizzle ORM Reset Discussion](https://github.com/drizzle-team/drizzle-orm/discussions/3906) - Community patterns

### Tertiary (LOW confidence)

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) - Comment conventions (verify applicability)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing project dependencies
- Architecture: HIGH - Patterns derived from codebase analysis
- Pitfalls: HIGH - Based on actual schema foreign keys and common patterns

**Research date:** 2026-01-31
**Valid until:** 60+ days (documentation patterns are stable)
