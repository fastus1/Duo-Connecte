# Architecture

**Analysis Date:** 2026-01-30

## Pattern Overview

**Overall:** Full-stack Express + React web application with shared type definitions

**Key Characteristics:**
- Server and client share schemas via `@shared` directory
- Database-first schema definitions with Drizzle ORM
- Session-based authentication with JWT tokens and PIN validation
- Multi-mode access control: Circle.so integration, paywall, PIN, admin roles
- React Router-based client with context providers for session and access state

## Layers

**Server (Backend):**
- Purpose: REST API, database operations, authentication, session management
- Location: `/home/yan/projets/Duo-Connecte/server`
- Contains: Express routes, middleware, storage layer with Drizzle ORM
- Depends on: PostgreSQL (via Neon), bcrypt, JWT, Zod for validation
- Used by: Client application via HTTP, webhooks from Circle.so

**Client (Frontend):**
- Purpose: User interface, state management, routing, form handling
- Location: `/home/yan/projets/Duo-Connecte/client/src`
- Contains: React components, pages, contexts, hooks, UI library components
- Depends on: React Query, Wouter router, Radix UI components, Tailwind CSS
- Used by: End users via browser

**Shared Types:**
- Purpose: Type safety across server and client
- Location: `/home/yan/projets/Duo-Connecte/shared/schema.ts`
- Contains: Drizzle tables, Zod schemas, TypeScript interfaces
- Used by: Both server and client for validation and types

## Data Flow

**Authentication Flow (Circle.so + PIN):**

1. User lands on app, origin check via `AccessContext`
2. Client calls `/api/auth/validate` with Circle.so user data
3. Server validates and creates or updates user in database
4. If PIN required, returns validation token; client navigates to PIN creation
5. Client submits PIN via `/api/auth/create-pin` or `/api/auth/validate-pin`
6. Server hashes PIN, stores in database, returns JWT session token
7. Client stores token in localStorage with timestamp for 60-minute expiry
8. All authenticated requests include `Authorization: Bearer <token>` header

**Access Control Flow:**

1. Client fetches `/api/config` to determine app mode (public, Circle-only, paywall, PIN)
2. `AccessProvider` context checks:
   - Environment (development allows all)
   - Circle.so domain requirement
   - Circle.so login requirement (email presence)
   - Paywall status via `/api/check-access`
   - PIN authentication status
3. `AccessGate` component blocks/allows content based on `accessStatus` state
4. Admin users bypass most restrictions via `circleIsAdmin` or JWT `isAdmin` flag

**Session & State Flow:**

1. `SessionContext` manages Duo Connecté workflow state: names, current step
2. Persists names to localStorage (`duo-connecte-names` key)
3. Syncs URL with current step - `SessionRouter` redirects if step changes
4. Admin preview mode allows navigation across all pages with sidebar

**API Response Pattern:**

- Authentication endpoints return: `{ status, user_id, email, name, is_admin, validation_token?, session_token? }`
- Protected endpoints verified by `requireAuth` middleware (checks JWT in Authorization header)
- Config endpoints return: `{ requireCircleDomain, requireCircleLogin, requirePaywall, requirePin, ... }`
- Health check via `/api/health` returns: `{ status, database, config, timestamp }`

## Key Abstractions

**Storage Layer (`storage.ts`):**
- Purpose: Abstraction over database operations
- Examples: `MemStorage` (in-memory implementation), Drizzle ORM calls
- Pattern: `IStorage` interface defines contract; implementation can be swapped
- Methods: User CRUD, login attempts, app config, paid members, feedback, support tickets

**Middleware Functions:**
- Purpose: Cross-cutting concerns (auth, validation, rate limiting)
- Examples:
  - `requireAuth`: Validates JWT bearer token, attaches user to request
  - `createRequireAdmin`: Factory function creating admin-check middleware
  - `pinRateLimiter`: Express rate limit (5 attempts per 15 minutes)
  - `validateUserData`: Validates Circle.so user data, handles Liquid template issues
- Pattern: Express middleware chain applied to routes

**Context Providers (Client):**
- Purpose: Share state across component tree without prop drilling
- Examples:
  - `SessionContext`: Workflow state (names, current step)
  - `AccessContext`: Access status (loading, granted, denied), Circle.so admin flag
- Pattern: React Context API with custom hooks (`useSession()`, `useAccess()`)

**Page Components:**
- Purpose: Routable components representing screens in Duo Connecté workflow
- Examples: `DuoRoles.tsx`, `DuoSenderSituation.tsx`, `DuoIntention.tsx`, etc.
- Pattern: Controlled components using `SessionContext` to read/write workflow state

## Entry Points

**Server Entry Points:**

**Development (`server/index-dev.ts`):**
- Location: `/home/yan/projets/Duo-Connecte/server/index-dev.ts`
- Triggers: `npm run dev` script
- Responsibilities: Sets up Vite dev server with HMR, runs Express with hot module reloading

**Production (`server/index-prod.ts`):**
- Location: `/home/yan/projets/Duo-Connecte/server/index-prod.ts`
- Triggers: `npm run start` (after `npm run build`)
- Responsibilities: Bundles and minifies server code with esbuild, runs standalone Node.js server

**Client Entry Point (`client/src/main.tsx`):**
- Location: `/home/yan/projets/Duo-Connecte/client/src/main.tsx`
- Triggers: HTML `<script src="/src/main.tsx">` in `client/index.html`
- Responsibilities: Mounts React app to `#root` DOM element via `createRoot().render()`

**Root Component (`client/src/App.tsx`):**
- Location: `/home/yan/projets/Duo-Connecte/client/src/App.tsx`
- Triggers: Called by `main.tsx`
- Responsibilities: Wraps app with providers (Query, Theme, Tooltip, Access, Session), renders `SessionRouter`

**Route Registration (`server/routes.ts` & `server/routes/index.ts`):**
- Location: `/home/yan/projets/Duo-Connecte/server/routes.ts`
- Triggers: Called by `app.ts` during `registerRoutes(app)`
- Responsibilities: Registers `/api/feedback`, `/api/health`, `/api/config`, `/api/check-access`, `/api/settings` endpoints and modular route handlers

## Error Handling

**Strategy:** Global Express error handler with per-route try-catch, client-side fallback UI

**Patterns:**

**Server-side:**
- Routes wrap async operations in try-catch blocks
- Catch handlers call `res.status(code).json({ error: message })`
- Zod validation errors caught and formatted as 400 responses
- Global error handler in `app.ts` catches uncaught errors, returns 500 with message

**Client-side:**
- `AccessContext` shows "origin_invalid" state with redirect link if access denied
- `AccessGate` component shows loading spinner during access check
- `AccessGate` shows `PaywallScreen` component if `accessStatus === 'denied'`
- React Query handles HTTP error responses in hooks
- User-facing messages in French (e.g., "Erreur serveur", "Accès réservé aux administrateurs")

**Validation:**
- Server validates all input via Zod schemas (`createPinSchema`, `validatePinSchema`, `updateConfigSchema`)
- Client-side form validation via React Hook Form + Zod
- Circle.so user data validated in `validateUserData()` function with detailed error messages

## Cross-Cutting Concerns

**Logging:**
- Server: Console logs with timestamp and source (e.g., `[12:34:56 PM [express] GET /api/config 200 in 45ms]`)
- Intercepted via middleware that captures response JSON and duration
- Logs filtered to only `/api/*` routes to avoid noise
- Error logs in red via `console.error()` for caught exceptions

**Validation:**
- Shared Zod schemas in `@shared/schema.ts` for both server and client
- Server validates all POST/PATCH request bodies against schemas before processing
- Client validates forms via React Hook Form before submission
- Drizzle ORM types generated from table definitions ensure type safety

**Authentication:**
- Session tokens are signed JWTs with 60-minute expiry
- PIN-based authentication uses bcrypt for hashing with 10 rounds
- Both methods supported: PIN login (for non-Circle users) and Circle.so OAuth
- `Authorization: Bearer <token>` header required for protected endpoints

**CORS:**
- Dynamic origin checking based on environment (dev allows all, production allows Circle.so + app origins)
- `circleOrigin` from `CIRCLE_ORIGIN` or `VITE_CIRCLE_ORIGIN` env var
- App origins built from `REPLIT_DEV_DOMAIN`, `REPLIT_DEPLOYMENT_URL`, `REPLIT_DOMAINS` env vars
- CSP `frame-ancestors` header allows Circle.so iframe embedding

**Rate Limiting:**
- PIN validation endpoint rate-limited to 5 attempts per 15 minutes (IP-based)
- IPv6 subnet masking (/64) for proper distributed client tracking
- Uses `express-rate-limit` package with memory store

---

*Architecture analysis: 2026-01-30*
