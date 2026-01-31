# Railway Deployment Guide: Express + React (Vite) Full-Stack App

**Project:** Duo-Connecte
**Researched:** 2026-01-30
**Confidence:** HIGH (verified with official Railway documentation)

## Executive Summary

Railway deployment for this Express + React (Vite) full-stack TypeScript app is straightforward. The app already has the correct architecture: Express serves the built Vite frontend from the `dist/public` directory. Railway's Railpack builder (the new default, replacing deprecated Nixpacks) auto-detects Node.js projects and handles builds with zero configuration for most cases.

**Key insight:** This is a single-service deployment, not a monorepo split. The Express server serves both API endpoints and static React files. This simplifies deployment significantly.

---

## Railway Configuration

### Option 1: Minimal Configuration (Recommended)

Railway's Railpack auto-detects Node.js projects. For most cases, you only need:

**Service Settings (in Railway Dashboard):**
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`

No configuration files required for basic deployment.

### Option 2: railway.json (Explicit Configuration)

Create `railway.json` in project root for version-controlled configuration:

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

### Option 3: railway.toml (Alternative Format)

```toml
[build]
builder = "RAILPACK"
buildCommand = "npm run build"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

### Node.js Version Pinning (Optional)

To pin a specific Node.js version, add to `package.json`:

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

Or use environment variable in Railway: `RAILPACK_NODE_VERSION=20`

---

## Build Process

### Current Build Scripts (Already Compatible)

From `package.json`:
```json
{
  "scripts": {
    "build": "vite build && esbuild server/index-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

**This is already Railway-compatible.** The build:
1. Runs Vite to build React frontend to `dist/public/`
2. Bundles server with esbuild to `dist/index.js`
3. Start command runs the bundled server

### Build Output Structure

```
dist/
  index.js          # Bundled Express server
  public/           # Vite-built React app
    index.html
    assets/
      *.js
      *.css
```

### Build Timing Expectations

| Stage | Expected Duration |
|-------|-------------------|
| Install dependencies | 30-60 seconds |
| Vite build | 10-30 seconds |
| esbuild bundle | 5-10 seconds |
| Total | ~1-2 minutes |

---

## Environment Variables

### Required Variables (Set in Railway Dashboard)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Session token signing key (32+ chars) | `your-long-random-secret-key-here` |
| `NODE_ENV` | Production mode | `production` |
| `CIRCLE_ORIGIN` | Circle.so domain for iframe embedding | `https://communaute.avancersimplement.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (Railway sets automatically) | Railway assigns dynamically |
| `WEBHOOK_SECRET` | Circle.so webhook verification | - |
| `RESEND_API_KEY` | Email service API key | - |
| `SESSION_TIMEOUT` | Session duration (ms) | `3600000` |

### Setting Variables in Railway

1. Navigate to your service in Railway dashboard
2. Click **Variables** tab
3. Click **New Variable** or use **RAW Editor** to paste:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
NODE_ENV=production
CIRCLE_ORIGIN=https://communaute.avancersimplement.com
```

### Variable Availability

Variables are available during:
- Build process (for any build-time configuration)
- Runtime (via `process.env`)

---

## Static File Serving

### Current Implementation (Already Correct)

From `server/index-prod.ts`:

```typescript
app.use(express.static(distPath, {
  setHeaders: (res) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${circleOrigin}`);
  }
}));

// SPA fallback
app.use("*", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});
```

**This is correct for Railway.** The Express server:
1. Serves static files from `dist/public`
2. Falls back to `index.html` for client-side routing
3. Sets appropriate CSP headers for Circle.so iframe embedding

### No Caddy/Nginx Needed

Unlike separate frontend deployments, this unified approach doesn't need a separate static file server. Express handles everything.

---

## Database Connection

### External Neon Database

The app uses an external Neon PostgreSQL database. No changes needed for Railway migration.

**Verify in Railway:**
1. Set `DATABASE_URL` environment variable to your Neon connection string
2. Ensure SSL mode is enabled: `?sslmode=require`

### Connection String Format

```
postgresql://username:password@host.neon.tech:5432/database?sslmode=require
```

### Connection Pooling (Recommended for Neon)

Neon recommends using connection pooling. Update connection string to use pooler:

```
postgresql://username:password@host-pooler.neon.tech:5432/database?sslmode=require
```

---

## Common Pitfalls (Replit to Railway Migration)

### Critical Pitfalls

#### 1. Replit-Specific Code in Production

**Problem:** The codebase contains Replit-specific environment variables and plugins.

**Files to Modify:**

**`vite.config.ts`** - Remove Replit plugins:
```typescript
// REMOVE these imports:
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// REMOVE from plugins array:
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
```

**`server/app.ts`** - Remove Replit domain logic:
```typescript
// REMOVE or modify getAppOrigins() function
// It references REPLIT_DEV_DOMAIN, REPLIT_DEPLOYMENT_URL, REPLIT_DOMAINS
```

**`package.json`** - Remove Replit dev dependencies:
```json
// REMOVE:
"@replit/vite-plugin-cartographer": "^0.4.4",
"@replit/vite-plugin-dev-banner": "^0.1.1",
"@replit/vite-plugin-runtime-error-modal": "^0.0.3",
```

#### 2. Port Binding Hardcoded

**Problem:** App must use `process.env.PORT` and bind to `0.0.0.0`.

**Current code is correct:**
```typescript
const port = parseInt(process.env.PORT || '5000', 10);
server.listen({ port, host: "0.0.0.0" });
```

**Railway assigns PORT dynamically. Do not hardcode a port.**

#### 3. Trust Proxy Setting

**Problem:** Rate limiting and IP detection fail behind Railway's proxy.

**Current code uses:**
```typescript
app.set('trust proxy', 1);
```

**This is correct for Railway.** Keep this setting.

### Moderate Pitfalls

#### 4. CORS Configuration for Railway

**Problem:** CORS origin checking references Replit domains.

**Solution:** Update CORS to use Railway domain:

```typescript
const getAppOrigins = (): string[] => {
  const origins: string[] = [];

  // Railway provides RAILWAY_PUBLIC_DOMAIN
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    origins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }

  // Custom domain if configured
  if (process.env.APP_DOMAIN) {
    origins.push(process.env.APP_DOMAIN);
  }

  return origins;
};
```

#### 5. Missing `package-lock.json`

**Problem:** Railway needs lockfile for deterministic builds.

**Verify:** Ensure `package-lock.json` is committed to Git and not in `.gitignore`.

#### 6. Build Caching Issues

**Problem:** Stale builds from cached layers.

**Solution:** If builds behave unexpectedly, set `NO_CACHE=1` temporarily in Railway variables, then remove after successful deploy.

### Minor Pitfalls

#### 7. Health Check Endpoint

**Problem:** Railway health checks may fail without proper endpoint.

**Current code has:**
```typescript
// In routes.ts
app.get("/api/health", (req, res) => { ... });
```

**Good.** Configure health check in Railway settings or `railway.json`:
```json
"healthcheckPath": "/api/health"
```

#### 8. Session Storage

**Current implementation uses:** Memory store with memorystore package.

**For single-instance deployment, this is fine.** If scaling to multiple instances, consider Redis session store.

---

## Migration Checklist

### Pre-Migration

- [ ] Verify `package-lock.json` is committed to Git
- [ ] Ensure all required files are pushed (check `client/` folder exists in repo)
- [ ] Document all environment variables needed
- [ ] Test build locally: `npm run build && npm run start`

### Code Changes Required

- [ ] Remove Replit plugins from `vite.config.ts`
- [ ] Remove Replit dev dependencies from `package.json`
- [ ] Update CORS configuration in `server/app.ts` (remove Replit domain references)
- [ ] Verify `PORT` environment variable usage
- [ ] Verify `0.0.0.0` host binding

### Railway Setup

- [ ] Create new project in Railway
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `CIRCLE_ORIGIN`
- [ ] Configure build command: `npm run build`
- [ ] Configure start command: `npm run start`
- [ ] Set health check path: `/api/health`
- [ ] Deploy and verify logs

### Post-Migration Verification

- [ ] Check deployment logs for errors
- [ ] Verify API endpoints: `https://your-domain.railway.app/api/health`
- [ ] Verify frontend loads correctly
- [ ] Test Circle.so iframe embedding
- [ ] Verify database connection
- [ ] Test authentication flow

### Optional Configuration

- [ ] Add custom domain
- [ ] Configure `railway.json` for version control
- [ ] Set up automatic deployments on push

---

## Files to Create/Modify Summary

### Create (Optional)

| File | Purpose |
|------|---------|
| `railway.json` | Version-controlled Railway configuration |

### Modify (Required)

| File | Changes |
|------|---------|
| `vite.config.ts` | Remove Replit plugins |
| `package.json` | Remove Replit devDependencies |
| `server/app.ts` | Update CORS to remove Replit domain logic |

### Delete (Recommended)

| File | Reason |
|------|--------|
| `.replit` | Replit-specific configuration |
| `replit.md` | Replit documentation |

---

## Railway vs Replit Feature Mapping

| Replit Feature | Railway Equivalent |
|----------------|-------------------|
| Secrets | Variables tab |
| Environment variables | Variables tab |
| Port 5000 mapping | Automatic PORT assignment |
| Deployment domain | Railway public domain or custom |
| Build command | Build command in settings |
| Run command | Start command in settings |
| `REPLIT_DEV_DOMAIN` | `RAILWAY_PUBLIC_DOMAIN` |
| `.replit` config | `railway.json` |

---

## Deployment Commands (Railway CLI)

For command-line deployment (alternative to dashboard):

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project
railway link

# Deploy
railway up

# View logs
railway logs

# Run with Railway environment locally
railway run npm run dev

# Set environment variable
railway variables set NODE_ENV=production
```

---

## Sources

- [Railway Build Configuration](https://docs.railway.com/guides/build-configuration) - HIGH confidence
- [Railway Config as Code](https://docs.railway.com/reference/config-as-code) - HIGH confidence
- [Railway Deploy Express App](https://docs.railway.com/guides/express) - HIGH confidence
- [Railway Variables](https://docs.railway.com/guides/variables) - HIGH confidence
- [Railway Monorepo Deployment](https://docs.railway.com/guides/monorepo) - HIGH confidence
- [Railway React Deployment](https://docs.railway.com/guides/react) - HIGH confidence
- [Railpack vs Nixpacks](https://blog.railway.com/p/introducing-railpack) - HIGH confidence
- [Replit to Railway Migration Guide](https://station.railway.com/community/guidance-for-replit-git-hub-railway-d-743a3b78) - MEDIUM confidence
- [Nixpacks Configuration](https://nixpacks.com/docs/configuration/file) - MEDIUM confidence (deprecated but still functional)
