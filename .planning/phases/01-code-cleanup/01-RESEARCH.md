# Phase 1: Code Cleanup - Research

**Researched:** 2026-01-30
**Domain:** Replit to Railway code migration - removing platform-specific dependencies
**Confidence:** HIGH

## Summary

This phase involves removing Replit-specific code from the codebase to prepare for Railway deployment. The cleanup is straightforward: remove 3 Vite plugins from `vite.config.ts`, remove 3 devDependencies from `package.json`, and update CORS configuration in `server/app.ts` to use Railway environment variables instead of Replit ones.

The existing RAILWAY.md research document (found in `.planning/research/`) already identified all the specific changes needed. This research validates those findings and adds implementation details. The changes are low-risk because:
1. All Replit plugins are dev-only (don't affect production bundle)
2. CORS changes are environment variable swaps (same logic, different var names)
3. No business logic changes required

**Primary recommendation:** Remove all `@replit/*` packages and replace `REPLIT_*` environment variables with `RAILWAY_PUBLIC_DOMAIN` in the CORS configuration.

## Standard Stack

### Core (No Changes Needed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Vite | ^5.4.20 | Build tool | Keep - works on Railway |
| @vitejs/plugin-react | ^4.7.0 | React support | Keep |
| esbuild | ^0.25.0 | Server bundling | Keep |
| Express | ^4.21.2 | Backend server | Keep |

### To Remove
| Package | Version | Purpose | Why Remove |
|---------|---------|---------|------------|
| @replit/vite-plugin-cartographer | ^0.4.4 | File mapping for Replit IDE | Replit-specific, not needed |
| @replit/vite-plugin-dev-banner | ^0.1.1 | Replit dev environment banner | Replit-specific, not needed |
| @replit/vite-plugin-runtime-error-modal | ^0.0.3 | Replit error overlay | Replit-specific, not needed |

### Environment Variables Mapping
| Replit Variable | Railway Equivalent | Usage |
|-----------------|-------------------|-------|
| `REPLIT_DEV_DOMAIN` | N/A (not needed for CORS) | Development domain |
| `REPLIT_DEPLOYMENT_URL` | N/A (not needed for CORS) | Deployment URL |
| `REPLIT_DOMAINS` | `RAILWAY_PUBLIC_DOMAIN` | Production domain for CORS |
| `REPL_ID` | N/A | Used for conditional plugin loading |

**Post-cleanup installation:**
```bash
npm install
```

(No new packages needed - just remove Replit ones and reinstall)

## Architecture Patterns

### Pattern 1: Clean Vite Configuration
**What:** Remove all Replit-specific plugins from vite.config.ts
**When to use:** After removing devDependencies from package.json

**Target vite.config.ts structure:**
```typescript
// Source: Vite official docs - https://vite.dev/guide/using-plugins
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // No Replit plugins - removed for Railway compatibility
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

### Pattern 2: Railway-Compatible CORS
**What:** Replace Replit environment variables with Railway's in CORS configuration
**When to use:** In server/app.ts for production CORS origin management

**Target getAppOrigins() function:**
```typescript
// Source: Railway docs - https://docs.railway.com/reference/variables
const getAppOrigins = (): string[] => {
  const origins: string[] = [];

  // Railway provides RAILWAY_PUBLIC_DOMAIN automatically
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    origins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }

  // Custom domain if configured (future-proofing)
  if (process.env.APP_DOMAIN) {
    origins.push(process.env.APP_DOMAIN);
  }

  return origins;
};
```

### Anti-Patterns to Avoid
- **Keeping conditional Replit checks:** Don't leave `process.env.REPL_ID` checks in the code - remove them entirely
- **Hardcoding domains:** Don't hardcode `.railway.app` domains - use environment variables
- **Leaving dead code:** Don't comment out Replit code - delete it completely

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CORS origin management | Custom domain parsing | Express cors middleware + env vars | Already in place, just update vars |
| Error overlays | Custom error UI | Browser DevTools | Vite HMR provides good DX already |
| Build process | Custom bundling | Vite + esbuild (existing) | Already properly configured |

**Key insight:** This cleanup removes unused tooling - no replacements needed. The app already works without these dev plugins in production.

## Common Pitfalls

### Pitfall 1: Forgetting package-lock.json Update
**What goes wrong:** npm install doesn't remove packages from node_modules properly
**Why it happens:** package-lock.json cached old dependencies
**How to avoid:** Run `rm -rf node_modules && rm package-lock.json && npm install` after modifying package.json
**Warning signs:** Build still references @replit packages

### Pitfall 2: Missing Import Removal
**What goes wrong:** Build fails with "Cannot find module '@replit/...'"
**Why it happens:** Removed from package.json but import statement left in vite.config.ts
**How to avoid:** Remove imports BEFORE removing from package.json
**Warning signs:** TypeScript errors or build failures

### Pitfall 3: CORS Rejection in Production
**What goes wrong:** API calls fail with CORS errors after deployment
**Why it happens:** RAILWAY_PUBLIC_DOMAIN not set or wrong format used
**How to avoid:** Verify env var exists and includes https:// prefix in the origins array
**Warning signs:** Network tab shows CORS preflight failures

### Pitfall 4: Leftover Hardcoded Replit URLs
**What goes wrong:** Email notifications, documentation still reference replit.app domains
**Why it happens:** Hardcoded URLs in source code outside main config files
**How to avoid:** Search entire codebase for ".replit.app" strings
**Warning signs:** Users receive emails with broken links

**Files with hardcoded Replit URLs (found in codebase):**
- `server/routes/support.ts` line 41: hardcoded admin URL in email template
- `client/src/components/admin/WebhookTab.tsx` lines 113, 203: placeholder and iframe selector
- Note: `attached_assets/` files are documentation/examples - not deployed code

### Pitfall 5: Keeping .replit Configuration Files
**What goes wrong:** Confusion about which config applies, potential conflicts
**Why it happens:** Forgot to delete Replit-specific files
**How to avoid:** Delete `.replit` and `replit.md` as part of cleanup
**Warning signs:** Git still tracks Replit config files

## Code Examples

### Example 1: Removing Vite Plugins (vite.config.ts)
```typescript
// BEFORE - with Replit plugins
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  // ...
});

// AFTER - clean, Railway-compatible
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  // ... rest unchanged
});
```

### Example 2: CORS Configuration Update (server/app.ts)
```typescript
// BEFORE - Replit environment variables
const getAppOrigins = (): string[] => {
  const origins: string[] = [];
  if (process.env.REPLIT_DEV_DOMAIN) {
    origins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }
  if (process.env.REPLIT_DEPLOYMENT_URL) {
    origins.push(process.env.REPLIT_DEPLOYMENT_URL);
  }
  if (process.env.REPLIT_DOMAINS) {
    process.env.REPLIT_DOMAINS.split(',').forEach(domain => {
      origins.push(`https://${domain.trim()}`);
    });
  }
  return origins;
};

// AFTER - Railway environment variables
const getAppOrigins = (): string[] => {
  const origins: string[] = [];

  // Railway automatically provides RAILWAY_PUBLIC_DOMAIN
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    origins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }

  // Support custom domain via APP_DOMAIN env var
  if (process.env.APP_DOMAIN) {
    origins.push(process.env.APP_DOMAIN);
  }

  return origins;
};
```

### Example 3: Removing devDependencies (package.json)
```json
// BEFORE
{
  "devDependencies": {
    "@replit/vite-plugin-cartographer": "^0.4.4",
    "@replit/vite-plugin-dev-banner": "^0.1.1",
    "@replit/vite-plugin-runtime-error-modal": "^0.0.3",
    "@tailwindcss/typography": "^0.5.15",
    // ... other deps
  }
}

// AFTER
{
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    // ... other deps (Replit lines removed)
  }
}
```

### Example 4: Updating Hardcoded URLs (server/routes/support.ts)
```typescript
// BEFORE - hardcoded Replit URL
<a href="https://duo-connecte--fastusone.replit.app/admin" ...>

// AFTER - dynamic URL from environment
const appUrl = process.env.APP_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
<a href="${appUrl}/admin" ...>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Replit dev plugins | Native browser DevTools | This migration | Simpler setup, no vendor lock-in |
| REPLIT_* env vars | RAILWAY_* env vars | This migration | Railway-compatible deployment |
| Platform-specific config | Standard Node.js config | This migration | Portable codebase |

**Deprecated/outdated:**
- `@replit/vite-plugin-*`: These are Replit IDE-specific and not needed outside Replit
- `REPLIT_*` environment variables: Railway uses different naming convention

## Open Questions

1. **Hardcoded admin URL in email template**
   - What we know: `server/routes/support.ts` has hardcoded `https://duo-connecte--fastusone.replit.app/admin`
   - What's unclear: Should this use `APP_URL` env var or `RAILWAY_PUBLIC_DOMAIN`?
   - Recommendation: Add `APP_URL` environment variable for explicit control, fallback to Railway domain

2. **WebhookTab.tsx iframe selector**
   - What we know: Uses `iframe[src*=".replit.app"]` selector pattern
   - What's unclear: Should this be parameterized or is it just example code?
   - Recommendation: This is admin documentation/example code - update placeholder text but selector may be Circle.so-side code

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `vite.config.ts`, `package.json`, `server/app.ts` - Direct file analysis
- [Railway Variables Documentation](https://docs.railway.com/reference/variables) - RAILWAY_PUBLIC_DOMAIN confirmed
- [Vite Using Plugins Guide](https://vite.dev/guide/using-plugins) - Plugin configuration patterns

### Secondary (MEDIUM confidence)
- `.planning/research/RAILWAY.md` - Prior research document with migration details
- [Vite Build for Production](https://vite.dev/guide/build) - Production build patterns

### Tertiary (LOW confidence)
- None - all findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - direct codebase inspection
- Architecture: HIGH - patterns from official Vite and Railway docs
- Pitfalls: HIGH - based on actual code analysis and common migration issues

**Research date:** 2026-01-30
**Valid until:** 2026-03-01 (30 days - stable domain, no fast-moving dependencies)

## Files Requiring Modification

| File | Change Type | Complexity |
|------|-------------|------------|
| `vite.config.ts` | Remove imports and plugins | Low |
| `package.json` | Remove 3 devDependencies | Low |
| `server/app.ts` | Update CORS env vars | Low |
| `server/routes/support.ts` | Update hardcoded URL | Low |
| `client/src/components/admin/WebhookTab.tsx` | Update placeholder text | Low |

## Files to Delete

| File | Reason |
|------|--------|
| `.replit` | Replit-specific configuration |
| `replit.md` | Replit documentation |

## Verification Commands

After cleanup, verify with:
```bash
# Build should succeed without Replit plugins
npm run build

# Start should work without REPLIT_* vars
npm run start

# No @replit references should remain
grep -r "@replit" --include="*.ts" --include="*.tsx" --include="*.json" .

# No REPLIT_ references in server code
grep -r "REPLIT_" server/
```
