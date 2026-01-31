# Codebase Structure

**Analysis Date:** 2026-01-31

## Directory Layout

```
template-app-circle/
├── client/                    # React SPA client application
│   ├── index.html            # Entry HTML template (server-rendered in dev, static in prod)
│   ├── public/               # Static assets (icons, logos)
│   └── src/
│       ├── main.tsx          # React root initialization
│       ├── App.tsx           # Main app component with routing and providers
│       ├── index.css         # Global styles (Tailwind)
│       ├── components/       # Reusable UI components
│       │   ├── ui/           # Radix UI + custom styled primitives
│       │   ├── admin/        # Admin panel components
│       │   ├── flow/         # Duo workflow-specific components
│       │   ├── GlobalHeader.tsx
│       │   ├── PageLayout.tsx
│       │   ├── PersistentNav.tsx
│       │   ├── theme-provider.tsx
│       │   └── [other shared components]
│       ├── pages/            # Full-page components (40+ pages)
│       │   ├── auth.tsx                  # Login/Circle.so auth page
│       │   ├── admin-login.tsx           # Admin PIN login
│       │   ├── dashboard.tsx             # User dashboard
│       │   ├── Welcome.tsx               # Landing page
│       │   ├── PaywallScreen.tsx         # Payment wall
│       │   ├── DuoPresentation.tsx       # Duo Connecté workflow step 1
│       │   ├── DuoRoles.tsx              # Step 2 (role selection)
│       │   ├── DuoSenderSituation.tsx    # Step N (multi-step flow)
│       │   ├── DuoFeedback.tsx           # Feedback collection
│       │   ├── DuoCompletion.tsx         # Workflow completion
│       │   ├── DuoInversionPage*.tsx     # Alternate flow pages (14 variants)
│       │   ├── SupportPage.tsx           # Support ticket form
│       │   ├── not-found.tsx             # 404 page
│       │   └── [20+ other workflow pages]
│       ├── contexts/         # React Context providers
│       │   ├── SessionContext.tsx        # Workflow state (step, names)
│       │   └── AccessContext.tsx         # Auth state (email, access, origin)
│       ├── hooks/            # Custom React hooks
│       │   ├── use-circle-auth.ts        # Circle.so integration hook
│       │   ├── use-mobile.tsx            # Mobile detection
│       │   ├── usePageTransition.ts      # Page animation
│       │   └── use-toast.ts              # Toast notifications
│       └── lib/              # Utilities and helpers
│           ├── queryClient.ts            # TanStack React Query config
│           ├── auth.ts                   # Client-side auth utilities
│           └── utils.ts                  # General utilities (cn, etc)
│
├── server/                    # Express.js backend API
│   ├── index-dev.ts          # Dev server entry (with Vite HMR)
│   ├── index-prod.ts         # Production server entry (static files)
│   ├── app.ts                # Express app config (CORS, middleware, error handling)
│   ├── middleware.ts         # Auth, validation, rate limiting
│   ├── storage.ts            # Database abstraction (IStorage interface + MemStorage)
│   ├── routes.ts             # Route registration (registerRoutes function)
│   └── routes/               # Modular route handlers
│       ├── index.ts          # Route registration orchestrator (registerModularRoutes)
│       ├── auth.ts           # POST /api/auth/validate, /create-pin, /validate-pin, /me
│       ├── admin.ts          # POST /api/admin/login, GET /config, POST /config, user mgmt
│       ├── support.ts        # POST /api/support/tickets, GET /support/tickets
│       └── webhooks.ts       # /webhooks/* endpoints
│
├── shared/                    # Shared code (client + server)
│   └── schema.ts             # Drizzle ORM tables + Zod validation schemas
│
├── public/                    # Build artifacts (generated)
│   ├── assets/               # Bundled JS/CSS
│   ├── icons/                # Icon files
│   └── index.html            # Built HTML (production only)
│
├── migrations/               # Drizzle migrations (auto-generated)
│   └── *.sql                 # Database schema migrations
│
├── docs/                     # Documentation
│
├── attached_assets/          # External assets referenced in build
│
├── .planning/               # Planning documents (created by GSD)
│   └── codebase/
│       ├── ARCHITECTURE.md
│       ├── STRUCTURE.md
│       ├── CONVENTIONS.md
│       ├── TESTING.md
│       ├── STACK.md
│       ├── INTEGRATIONS.md
│       └── CONCERNS.md
│
├── dist/                    # Production build output
│   ├── index.js             # Bundled server (from esbuild)
│   └── public/              # Vite-built client (from vite build)
│
├── node_modules/            # Dependencies (not committed)
│
├── vite.config.ts           # Vite build config for client
├── tsconfig.json            # TypeScript config (shared client/server)
├── tailwind.config.ts       # Tailwind CSS config
├── package.json             # Dependencies, scripts
├── drizzle.config.ts        # Database migration config
└── components.json          # Shadcn/ui config

```

## Directory Purposes

**`client/src/`:**
- Purpose: React source code for user-facing UI
- Contains: Components, pages, hooks, contexts, utilities
- Key files: App.tsx (main router), main.tsx (entry point)

**`client/src/components/ui/`:**
- Purpose: Styled primitives from Radix UI with Tailwind
- Contains: 30+ reusable UI components (Button, Dialog, Input, etc)
- Source: Shadcn/ui library (synced via CLI)

**`client/src/pages/`:**
- Purpose: Full-page route components
- Contains: 40+ pages covering auth, workflow, admin, and demo flows
- Pattern: One component per page/route

**`client/src/contexts/`:**
- Purpose: Global state providers
- Contains: SessionContext (workflow state), AccessContext (auth state)
- Pattern: React Context + custom hook for easy access

**`client/src/hooks/`:**
- Purpose: Reusable logic as custom hooks
- Contains: Auth integration, mobile detection, page transitions, notifications
- Pattern: Stateful logic extracted from components

**`server/routes/`:**
- Purpose: Route handler organization by feature
- Contains: Auth routes, admin routes, support routes, webhooks
- Pattern: Express Router instances mounted in registerModularRoutes()

**`shared/`:**
- Purpose: Type definitions and schemas used by both client and server
- Contains: Drizzle table schemas, Zod validation schemas
- Pattern: Single source of truth for data shapes

**`migrations/`:**
- Purpose: Database schema version control
- Contains: Auto-generated SQL files from Drizzle Kit
- Pattern: One file per schema change (drizzle-kit push)

## Key File Locations

**Entry Points:**

- `server/index-dev.ts`: Dev server with Vite HMR - run with `npm run dev`
- `server/index-prod.ts`: Production server serving static assets - run with `npm start` (after build)
- `client/src/main.tsx`: React app root - mounted in browser
- `server/app.ts`: Express app initialization and middleware setup

**Configuration:**

- `vite.config.ts`: Client build config (root: client, outDir: dist/public, aliases: @, @shared, @assets)
- `tsconfig.json`: TypeScript config (includes client/src, shared, server)
- `tailwind.config.ts`: Tailwind CSS theming
- `drizzle.config.ts`: Database migration config (dialect: postgresql, schema: shared/schema.ts)
- `package.json`: Scripts (dev, build, start, check, db:push) and dependencies

**Core Logic:**

- `server/storage.ts`: Database operations abstraction (IStorage interface + MemStorage implementation)
- `server/middleware.ts`: Authentication, validation, rate limiting
- `client/src/contexts/SessionContext.tsx`: Workflow state management
- `client/src/contexts/AccessContext.tsx`: Authentication and access control
- `client/src/lib/auth.ts`: Client-side auth token management

**Shared Schemas:**

- `shared/schema.ts`: Drizzle ORM tables (users, loginAttempts, appConfig, paidMembers, feedbacks, supportTickets) + Zod schemas for validation

**Testing:**

- No test files currently present in codebase
- Test structure would follow: `*.test.ts`, `*.spec.ts` files co-located with source

**Public Assets:**

- `client/public/icons/`: Icon SVG files
- `client/public/`: Static files served in dev

## Naming Conventions

**Files:**

- React components: PascalCase.tsx (e.g., SessionContext.tsx, GlobalHeader.tsx)
- Hooks: kebab-case with `use-` prefix (e.g., use-circle-auth.ts, use-mobile.tsx)
- Utils/helpers: kebab-case.ts (e.g., queryClient.ts, utils.ts)
- Pages: PascalCase.tsx (e.g., DuoPresentation.tsx, AdminLogin.tsx)
- Routes: kebab-case.ts (e.g., auth.ts, admin.ts, support.ts)

**Directories:**

- Feature-based: lowercase (components, pages, hooks, lib, contexts, routes, migrations)
- UI components: `ui/` subdirectory under components
- Feature-specific: domain-based (admin, flow subdirectories under components)

**Variables/Functions:**

- Constants: UPPER_SNAKE_CASE (VALIDATION_EXPIRY_MS, SESSION_SECRET)
- Functions: camelCase (generateSessionToken, validateUserData)
- React state: camelCase (session, accessStatus, userEmail)
- Types/Interfaces: PascalCase (SessionState, AccessContextType, JWTPayload)

**Routes:**

- API routes: kebab-case with /api/ prefix (e.g., /api/auth/validate, /api/admin/config)
- Frontend routes: kebab-case (e.g., /welcome, /admin-login, /admin)

## Where to Add New Code

**New Feature (e.g., New Workflow Page):**

- Primary code: `client/src/pages/[PageName].tsx` - create React component
- Contexts: Update `client/src/contexts/SessionContext.tsx` if new state needed
- Styles: Use Tailwind classes inline, components in `client/src/components/`
- Routes: Add to wouter Switch in `client/src/App.tsx`
- API: Create endpoint in `server/routes/[feature].ts` if needed

**New API Endpoint:**

- Implementation: `server/routes/[feature].ts` - add router method (post, get, etc)
- Middleware: Use `requireAuth` or `requireAdmin` from `server/middleware.ts`
- Validation: Add Zod schema in `shared/schema.ts`
- Storage: Call `storage.method()` from IStorage interface
- CORS: Automatically applied via `app.use('/api', corsMiddleware)`

**New Component/Module:**

- Shared UI component: `client/src/components/[ComponentName].tsx`
- Feature-specific component: `client/src/components/[feature]/[ComponentName].tsx`
- Hook: `client/src/hooks/use-[feature-name].ts`
- Library function: `client/src/lib/[name].ts`
- Server utility: `server/[name].ts`

**New Context/State:**

- Create file: `client/src/contexts/[ContextName]Context.tsx`
- Pattern: Create context, provider component, custom hook (useContextName)
- Export: Named export for Provider, named export for hook
- Wrap: Add provider in App.tsx at appropriate level

**Utilities:**

- Shared helpers: `client/src/lib/utils.ts` or new file `client/src/lib/[name].ts`
- Server utilities: `server/[name].ts`
- Cross-cutting concerns: `server/middleware.ts`

**Database:**

- New table: Add to `shared/schema.ts` (pgTable definition + Zod schema)
- New operation: Add method to IStorage interface
- Implementation: Add to MemStorage class in `server/storage.ts`
- Migration: Run `npm run db:push` to auto-generate migration

## Special Directories

**`dist/`:**
- Purpose: Production build output
- Generated: Yes (via `npm run build`)
- Committed: No (gitignored)
- Contents: `dist/public/` contains Vite-built client, `dist/index.js` contains bundled server
- Build command: Vite builds client to dist/public, esbuild bundles server to dist/index.js

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (via `npm install`)
- Committed: No (gitignored)
- Size: Large (hundreds of packages)

**`migrations/`:**
- Purpose: Database schema version control
- Generated: Yes (via `npm run db:push` with drizzle-kit)
- Committed: Yes (tracked in git)
- Pattern: One SQL file per migration, numbered sequentially

**`.planning/`:**
- Purpose: GSD planning and analysis documents
- Generated: Yes (by `/gsd:*` commands)
- Committed: Tracked for project planning
- Structure: Organized by document type (codebase, phases, milestones)

**`.local/`:**
- Purpose: Local development state and agent state files
- Generated: Yes (by Replit agent system)
- Committed: No (local-only)

---

*Structure analysis: 2026-01-31*
