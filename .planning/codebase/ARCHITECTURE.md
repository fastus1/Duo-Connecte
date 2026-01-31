# Architecture

**Analysis Date:** 2026-01-31

## Pattern Overview

**Overall:** Monolithic full-stack application with client-server separation

**Key Characteristics:**
- Single Node.js/Express server serving both API and static client
- React SPA client (Vite-bundled) rendered in index.html
- TypeScript shared types across client and server
- Multi-environment configuration (development with hot reload, production with static assets)
- Role-based access control (admin vs regular users)
- Circle.so community integration with iframe embedding

## Layers

**Client Layer (React SPA):**
- Purpose: User interface and state management for the "Duo Connecté" workflow application
- Location: `client/src/`
- Contains: React components, pages, hooks, contexts, utilities
- Depends on: Express API, shared schema
- Used by: Users accessing via browser or iframe from Circle.so

**Server/API Layer (Express.js):**
- Purpose: HTTP API endpoints, authentication, session management, data validation
- Location: `server/`
- Contains: Route handlers, middleware, database operations, storage abstraction
- Depends on: Database (PostgreSQL via Neon), shared schema
- Used by: Client-side fetch requests, webhooks from external services

**Shared Schema Layer:**
- Purpose: Centralized type definitions and Zod validation schemas
- Location: `shared/schema.ts`
- Contains: Database table definitions (Drizzle ORM), insert/response schemas, validation rules
- Depends on: Drizzle ORM, Zod
- Used by: Both client and server for type safety and data validation

**Storage/Database Layer:**
- Purpose: Data persistence and transaction management
- Location: `server/storage.ts`
- Contains: IStorage interface, MemStorage implementation (in-memory), Drizzle ORM queries
- Depends on: PostgreSQL database via Neon serverless
- Used by: Route handlers for CRUD operations

## Data Flow

**User Authentication Flow:**

1. User arrives at app (from Circle.so iframe or direct)
2. Circle.so posts user data via message event (from iframe communication)
3. AccessContext (`client/src/contexts/AccessContext.tsx`) receives and validates Circle.so origin
4. Client calls `POST /api/auth/validate` with user data from Circle.so
5. Server validates user format, checks if user exists in database
6. Server returns either:
   - `new_user` status with validation_token (requires PIN creation)
   - `existing_user` status with requires_pin flag
7. Client creates PIN via `POST /api/auth/create-pin` (new users) or validates PIN via `POST /api/auth/validate-pin`
8. Server generates JWT session token and returns it
9. Client stores token in localStorage and makes future API calls with `Authorization: Bearer {token}` header

**Workflow State Management:**

1. SessionContext (`client/src/contexts/SessionContext.tsx`) stores current step and participant names
2. User navigates through Duo pages (20+ step progression)
3. Names persisted to localStorage for session continuity
4. Feedback submitted to `POST /api/feedback` endpoint
5. Support tickets created via `POST /api/support/tickets`

**Admin Dashboard Flow:**

1. Admin logs in via `/admin-login` page
2. Submits credentials to `POST /api/admin/login`
3. Server validates PIN against user's hash using bcrypt
4. Returns JWT token for session
5. Admin can access `/api/admin/*` endpoints with requireAdmin middleware
6. Endpoints allow config updates, user management, feedback/ticket viewing

**State Management:**

- Session state (user step, participant names): React Context (SessionContext)
- Access state (auth status, origin validation, email): React Context (AccessContext)
- Query state (API data): TanStack React Query (queryClient)
- Local state: localStorage for session tokens, user email, names
- Theme state: next-themes provider

## Key Abstractions

**IStorage Interface:**
- Purpose: Abstract database operations from route handlers
- Examples: `server/storage.ts` implements IStorage
- Pattern: Dependency injection - routes receive storage instance
- Methods cover: Users (CRUD), login attempts, app config, paid members, feedback, support tickets

**Authentication Middleware:**
- Purpose: Protect API routes by validating JWT tokens
- Examples: `requireAuth()`, `requireAdmin()`, `pinRateLimiter`
- Pattern: Express middleware factory - receives storage dependency, returns middleware
- Validates: Bearer token format, JWT signature, admin status

**Route Modularity:**
- Purpose: Organize API endpoints by feature domain
- Locations: `server/routes/auth.ts`, `server/routes/admin.ts`, `server/routes/support.ts`, `server/routes/webhooks.ts`
- Pattern: Router instances mounted on main app via `registerModularRoutes()`
- Prefixes: `/api/auth/`, `/api/admin/`, `/api/support/`, `/webhooks/`

**Page Components:**
- Purpose: Full-page views for multi-step workflow
- Locations: `client/src/pages/` contains 30+ page components
- Pattern: One component per workflow step (e.g., DuoRoles, DuoPresentation, DuoFeedback)
- Integration: Mounted dynamically in App.tsx router

**Contexts:**
- Purpose: Global state containers for cross-component access
- Examples: SessionContext (workflow state), AccessContext (auth state)
- Pattern: React Context + Provider pattern with custom hooks
- Usage: useSession(), useAccess() custom hooks throughout app

## Entry Points

**Server Entry (Development):**
- Location: `server/index-dev.ts`
- Triggers: `npm run dev` command
- Responsibilities:
  - Creates Vite dev server in middleware mode with HMR
  - Serves hot-reloadable client code
  - Transforms index.html with Vite
  - Falls back to index.html for SPA routing

**Server Entry (Production):**
- Location: `server/index-prod.ts`
- Triggers: `npm start` command (after `npm run build`)
- Responsibilities:
  - Serves pre-built static assets from `dist/public/`
  - Sets Cache-Control headers
  - Falls back to index.html for SPA routing
  - Removes X-Frame-Options to allow Circle.so iframe embedding

**App Core:**
- Location: `server/app.ts`
- Responsibilities:
  - Express app initialization with CORS and body parsing
  - CORS middleware configuration for Circle.so and Railway domains
  - API logging middleware (captures and truncates responses)
  - Error handling (catches all thrown errors)
  - HTTP server creation and port binding (5000 by default)

**Client Entry:**
- Location: `client/src/main.tsx`
- Triggers: Browser requests index.html
- Responsibilities:
  - React root initialization with ReactDOM.createRoot()
  - Renders App component

**App Router:**
- Location: `client/src/App.tsx`
- Responsibilities:
  - Wraps entire app with providers (QueryClientProvider, ThemeProvider, SessionProvider, AccessProvider)
  - Implements wouter-based route matching
  - AccessGate component gates protected routes by access status
  - SessionRouter component manages auth flow and user redirects
  - Mounts 50+ pages for workflow, admin, and demo flows

## Error Handling

**Strategy:** Centralized error catching with status codes and user-friendly messages

**Patterns:**

**Express Layer (`server/app.ts`):**
- Global error handler middleware catches all thrown/passed errors
- Returns status code (err.status/statusCode) and message as JSON
- Logs to console
- Returns 500 if no status provided

**Middleware Layer (`server/middleware.ts`):**
- JWT verification returns 401 if token invalid/expired
- Authentication required returns 401 if header missing
- Admin check returns 403 if user not admin
- Rate limiter (pinRateLimiter) returns 429 after 5 failed attempts in 15 minutes

**Route Layer (`server/routes/`):**
- Zod schema validation catches errors and returns 400 with error message
- Database queries wrapped in try-catch
- Returns appropriate status and error message as JSON

**Client Layer (`client/src/`):**
- Toast component displays error messages to users
- Failed API calls logged via React Query error handling
- AccessContext catches origin validation errors and shows origin_invalid state
- Form validation via react-hook-form + Zod

## Cross-Cutting Concerns

**Logging:**
- Express middleware logs API calls with method, path, status, duration, response body (truncated to 80 chars)
- Format: `[HH:MM:SS] [express] METHOD /path STATUS in XXXms :: response`
- Only logs requests to `/api/*` paths

**Validation:**
- Server-side: Zod schemas in `shared/schema.ts` applied to all requests
- Client-side: react-hook-form + Zod for form validation
- Email format, PIN format (4-6 digits), Liquid template detection (Circle.so integration)

**Authentication:**
- JWT tokens (60-minute expiry) stored in Bearer header
- Session secret from env var SESSION_SECRET (fallback to JWT_SECRET)
- Bcrypt PIN hashing (10 rounds) for admin/user PINs
- Rate limiting on PIN attempts (5 per 15 minutes)

**CORS:**
- Allowed origins: Circle.so domain (CIRCLE_ORIGIN env var), Railway public domain, custom APP_DOMAIN
- Dev mode (DEV_MODE=true) allows all origins
- Requests with no origin (mobile, curl) allowed
- Applied to `/api/*` routes and `/webhooks` routes

**Configuration:**
- Environment-based: NODE_ENV, DEV_MODE, DATABASE_URL, PORT
- Feature flags: requireCircleDomain, requireCircleLogin, requirePaywall, requirePin
- Integration: CIRCLE_ORIGIN, WEBHOOK_SECRET, SESSION_SECRET
- Stored in AppConfig table (single row, id="main")

---

*Architecture analysis: 2026-01-31*
