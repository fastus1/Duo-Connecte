# Phase 2: Railway Setup - Research

**Researched:** 2026-01-30
**Domain:** Railway PaaS deployment for Node.js/Express + React (Vite) application
**Confidence:** HIGH

## Summary

Railway deployment for this Express + React full-stack application is straightforward because Phase 1 has already prepared the codebase. The application architecture (Express serving built Vite frontend from `dist/public/`) is ideal for a single-service Railway deployment. Railway's Railpack builder auto-detects Node.js projects and the existing `npm run build` and `npm run start` scripts are already Railway-compatible.

The key focus for this phase is operational setup: creating the Railway project, connecting GitHub for automatic deploys, and correctly configuring all required environment variables. The existing Neon PostgreSQL database is kept as-is - only the DATABASE_URL needs to be set in Railway. Railway automatically provides RAILWAY_PUBLIC_DOMAIN which the Phase 1 CORS configuration already uses.

**Primary recommendation:** Use the Railway dashboard to connect GitHub, configure environment variables (DATABASE_URL, JWT_SECRET, CIRCLE_ORIGIN, NODE_ENV), generate a public domain, and deploy. No code changes are required.

## Standard Stack

### Core (Railway Platform)

| Tool | Purpose | Why Standard |
|------|---------|--------------|
| Railway Dashboard | Project creation, GitHub connection, variable management | Official Railway interface, full control |
| Railpack Builder | Automatic Node.js detection and build | Railway's default builder, auto-detects Node.js via package.json |
| Railway Public Domain | Auto-generated HTTPS domain | Free, immediate, no configuration needed |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Railway CLI | Local development with Railway env vars | Optional - for `railway run npm run dev` locally |
| railway.json | Version-controlled Railway config | Optional - after initial deployment succeeds |
| Custom Domain | Production domain | After validating Railway deployment works |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Dashboard setup | Railway CLI (`railway init`) | CLI is faster but dashboard provides better visibility for first deployment |
| Auto-generated domain | Custom domain | Custom requires DNS configuration, use auto-generated first to validate deployment |
| Railpack | Dockerfile | Dockerfile gives more control but Railpack works perfectly for this Node.js app |

**No additional packages needed** - this phase is purely operational/platform configuration.

## Architecture Patterns

### Railway Service Architecture

```
Railway Project: duo-connecte
|
+-- Service: Web Application (GitHub connected)
    |-- Build: npm run build
    |-- Start: npm run start
    |-- Variables: DATABASE_URL, JWT_SECRET, CIRCLE_ORIGIN, NODE_ENV
    |-- Networking: Auto-generated Railway domain (HTTPS)
    |
    +-- External: Neon PostgreSQL (via DATABASE_URL)
```

### Pattern 1: Single-Service Full-Stack Deployment

**What:** Express server serves both API endpoints and static React files from one Railway service.

**When to use:** When frontend and backend are in the same repository and frontend is served by backend.

**Why this is correct for Duo-Connecte:**
- `npm run build` creates both `dist/index.js` (server) and `dist/public/` (frontend)
- `npm run start` runs the bundled server which serves static files
- No need for separate frontend service
- Simpler deployment, single domain, no CORS complexity between services

### Pattern 2: GitHub Autodeploys

**What:** Railway automatically deploys on every push to the connected branch.

**When to use:** Always enable for production deployments.

**Configuration:**
- Connect GitHub repository in Railway dashboard
- Select branch (usually `main`)
- Enable "Watch for changes" (default)

**Source:** [Railway GitHub Autodeploys Guide](https://docs.railway.com/guides/github-autodeploys)

### Pattern 3: Railway-Provided Environment Variables

**What:** Railway automatically sets `RAILWAY_PUBLIC_DOMAIN` and other system variables.

**Available automatically:**
| Variable | Example Value | Use |
|----------|---------------|-----|
| `RAILWAY_PUBLIC_DOMAIN` | `duo-connecte-production.up.railway.app` | CORS, URL generation |
| `RAILWAY_ENVIRONMENT_NAME` | `production` | Environment detection |
| `RAILWAY_SERVICE_NAME` | `web` | Service identification |
| `PORT` | `(dynamic)` | Server port (Railway assigns) |

**Source:** [Railway Variables Reference](https://docs.railway.com/reference/variables)

### Anti-Patterns to Avoid

- **Hardcoding PORT:** Never hardcode port number. Use `process.env.PORT || 5000`. Railway assigns port dynamically.
- **Using localhost in production URLs:** Use `RAILWAY_PUBLIC_DOMAIN` or custom domain env vars.
- **Skipping health check configuration:** Always configure `/api/health` as health check path.
- **Setting DATABASE_URL to Railway PostgreSQL:** Keep using Neon - the existing database has data.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSL/HTTPS | Custom certificate management | Railway auto-provisions Let's Encrypt | Automatic renewal, zero config |
| Reverse proxy | Nginx/Caddy setup | Railway's built-in proxy | Already handles routing, headers |
| Domain generation | Custom subdomain system | Railway Generate Domain button | Immediate, no DNS required |
| Build detection | Custom buildpack | Railpack auto-detection | Reads package.json automatically |
| Environment management | .env file deployment | Railway Variables tab | Secure, versionable, sealed options |

**Key insight:** Railway handles infrastructure. Focus only on setting environment variables correctly.

## Common Pitfalls

### Pitfall 1: Forgetting to Generate a Domain

**What goes wrong:** Deployment succeeds but app is inaccessible - no public URL.

**Why it happens:** Railway doesn't auto-generate domains. Must click "Generate Domain" in Networking settings.

**How to avoid:** After first successful deploy, immediately go to Settings > Networking > Generate Domain.

**Warning signs:** Deploy logs show success but no URL to access app.

### Pitfall 2: Missing Required Environment Variables

**What goes wrong:** App crashes on startup with "JWT_SECRET is not defined" or database connection errors.

**Why it happens:** Environment variables must be set BEFORE first deployment that uses them.

**How to avoid:** Set ALL required variables in Variables tab before triggering deploy:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Long random string for token signing
- `CIRCLE_ORIGIN` - `https://communaute.avancersimplement.com`
- `NODE_ENV` - `production`

**Warning signs:** Build succeeds but app crashes with "undefined" errors in logs.

### Pitfall 3: Wrong DATABASE_URL Format

**What goes wrong:** Database connection fails despite URL being set.

**Why it happens:** Missing `?sslmode=require` for Neon connections.

**How to avoid:** Use complete Neon connection string with SSL:
```
postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require
```

**Warning signs:** "SSL required" or "connection refused" errors.

### Pitfall 4: Health Check Timeout

**What goes wrong:** Railway marks deployment as failed even though app starts.

**Why it happens:** Default health check timeout may be too short, or health endpoint path wrong.

**How to avoid:**
- Verify `/api/health` endpoint exists and responds quickly
- Set `healthcheckPath: "/api/health"` in railway.json if using config-as-code
- Or configure in Dashboard under Service Settings

**Warning signs:** Deployment shows "unhealthy" status, app works when tested manually.

### Pitfall 5: Not Waiting for Build to Complete

**What goes wrong:** Accessing URL before build finishes shows old version or error.

**Why it happens:** Railway builds take 1-2 minutes. Checking too early shows previous state.

**How to avoid:** Watch build logs until "Deployment live at..." message appears.

**Warning signs:** Old version showing, 502 errors, or "application not responding" messages.

## Code Examples

No code changes required for this phase. The codebase is already Railway-ready from Phase 1.

### Verification Commands

**Check existing Railway compatibility:**
```bash
# Verify PORT usage
grep -n "process.env.PORT" server/app.ts
# Expected: const port = parseInt(process.env.PORT || '5000', 10);

# Verify host binding
grep -n "0.0.0.0" server/app.ts
# Expected: host: "0.0.0.0"

# Verify RAILWAY_PUBLIC_DOMAIN usage
grep -n "RAILWAY_PUBLIC_DOMAIN" server/app.ts
# Expected: if (process.env.RAILWAY_PUBLIC_DOMAIN)

# Verify health endpoint
grep -n "/api/health" server/routes.ts
# Expected: app.get("/api/health", ...
```

### Environment Variables Template

Copy this to Railway Variables tab (RAW Editor):

```env
DATABASE_URL=postgresql://your_user:your_password@ep-xxx-xxx.region.neon.tech/your_db?sslmode=require
JWT_SECRET=your-32-character-or-longer-random-secret-here
CIRCLE_ORIGIN=https://communaute.avancersimplement.com
NODE_ENV=production
```

### Optional: railway.json Configuration

Create after initial deployment succeeds:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Source:** [Railway Config as Code](https://docs.railway.com/reference/config-as-code)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Nixpacks builder | Railpack builder | 2025 | Railpack is new default, faster, better Node.js detection |
| Manual port config | Automatic PORT env | Always | Railway assigns port, app must use process.env.PORT |
| Procfile required | Auto-detection | Always | Railpack reads package.json scripts directly |

**Deprecated/outdated:**
- Nixpacks: Still works but Railpack is recommended default
- Heroku-style Procfile: Not needed, use package.json scripts or railway.json

## Open Questions

1. **Custom domain timing**
   - What we know: Custom domains supported via Settings > Networking
   - What's unclear: When to configure custom domain (now or after validation phase)
   - Recommendation: Use auto-generated Railway domain first, add custom domain after Phase 3 validation

2. **RESEND_API_KEY requirement**
   - What we know: Used for support ticket emails
   - What's unclear: Is this required for core functionality or optional feature
   - Recommendation: Set it if the key is available, but not blocking for initial deployment

## Sources

### Primary (HIGH confidence)

- [Railway Express Deployment Guide](https://docs.railway.com/guides/express) - Deployment methods, auto-detection
- [Railway Variables Guide](https://docs.railway.com/guides/variables) - Environment variable management
- [Railway Variables Reference](https://docs.railway.com/reference/variables) - RAILWAY_PUBLIC_DOMAIN and system variables
- [Railway Public Networking](https://docs.railway.com/guides/public-networking) - Domain generation, PORT binding
- [Railway GitHub Autodeploys](https://docs.railway.com/guides/github-autodeploys) - GitHub integration, branch selection
- [Neon + Railway Guide](https://neon.com/docs/guides/railway) - External database connection

### Secondary (MEDIUM confidence)

- Existing project research: `.planning/research/RAILWAY.md` - Pre-existing detailed migration guide
- Phase 1 completion: `.planning/phases/01-code-cleanup/01-01-SUMMARY.md` - CORS/env var changes verified

### Tertiary (LOW confidence)

- Community posts on Railway Help Station - Troubleshooting patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Railway documentation
- Architecture patterns: HIGH - Verified against official guides and existing project structure
- Pitfalls: HIGH - Combination of official docs and community reports

**Research date:** 2026-01-30
**Valid until:** 60 days (Railway platform is stable, infrequent breaking changes)
