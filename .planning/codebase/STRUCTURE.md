# Codebase Structure

**Analysis Date:** 2026-01-30

## Directory Layout

```
/home/yan/projets/Duo-Connecte/
├── server/                    # Express backend application
│   ├── index-dev.ts          # Development entry point with Vite
│   ├── index-prod.ts         # Production entry point (bundled)
│   ├── app.ts                # Express app configuration, middleware
│   ├── routes.ts             # Main route registration, core API endpoints
│   ├── routes/               # Modular route handlers
│   │   ├── index.ts          # Route registration orchestrator
│   │   ├── auth.ts           # /api/auth/* (Circle.so, PIN, JWT)
│   │   ├── admin.ts          # /api/admin/* (protected admin operations)
│   │   ├── support.ts        # /api/support/* (feedback, tickets)
│   │   └── webhooks.ts       # /webhooks/* (Circle.so webhooks)
│   ├── storage.ts            # Database abstraction layer (Drizzle ORM)
│   └── middleware.ts         # Auth, validation, rate limiting functions
├── client/                   # React frontend application
│   ├── src/
│   │   ├── main.tsx          # React DOM mount point
│   │   ├── App.tsx           # Root component with providers
│   │   ├── index.css         # Global styles
│   │   ├── pages/            # Page components (routable screens)
│   │   │   ├── auth/         # Login/signup flows
│   │   │   ├── DuoXxx.tsx    # Duo Connecté workflow pages (25+ files)
│   │   │   ├── DuoInversionPageXa.tsx  # Inversion variant pages (14 files)
│   │   │   ├── dashboard.tsx # Admin dashboard
│   │   │   ├── Welcome.tsx   # Welcome screen
│   │   │   └── [other pages] # Demo screens, support, 404
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/           # Radix UI primitives (button, card, form, etc.)
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── flow/         # Duo flow step components
│   │   │   ├── App.tsx       # Root wrapper (providers)
│   │   │   ├── GlobalHeader.tsx
│   │   │   └── [others]
│   │   ├── contexts/         # React Context providers
│   │   │   ├── SessionContext.tsx  # Workflow state (names, step)
│   │   │   └── AccessContext.tsx   # Access control state
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── use-toast.ts  # Toast notifications
│   │   │   ├── use-circle-auth.ts
│   │   │   ├── use-mobile.tsx
│   │   │   └── usePageTransition.ts
│   │   └── lib/              # Utilities and services
│   │       ├── queryClient.ts     # React Query setup
│   │       ├── utils.ts           # Helper functions
│   │       └── auth.ts            # Auth token management
│   ├── public/               # Static assets
│   │   └── icons/
│   └── index.html            # HTML entry point
├── shared/                   # Shared TypeScript code
│   └── schema.ts             # Drizzle tables, Zod schemas, types
├── vite.config.ts            # Vite build configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── package.json              # Dependencies and scripts
├── .env*                     # Environment variables (not committed)
├── dist/                     # Build output (generated)
│   └── public/               # Built client assets
├── docs/                     # Documentation (if present)
└── .planning/
    └── codebase/             # Planning documents
        ├── ARCHITECTURE.md
        ├── STRUCTURE.md
        ├── CONVENTIONS.md
        ├── TESTING.md
        ├── STACK.md
        ├── INTEGRATIONS.md
        └── CONCERNS.md
```

## Directory Purposes

**`server/`:**
- Purpose: Express backend with database operations, authentication, API endpoints
- Contains: Route handlers, middleware, storage layer, Drizzle ORM integration
- Key files:
  - `app.ts`: Express instance, CORS setup, middleware chain
  - `routes.ts`: Endpoint registration (`/api/feedback`, `/api/config`, `/api/check-access`)
  - `storage.ts`: `IStorage` interface and `MemStorage` implementation
  - `middleware.ts`: JWT signing/verification, PIN hashing, validation functions

**`client/src/`:**
- Purpose: React frontend with pages, components, state management
- Contains: Page components, UI library, contexts, hooks
- Key subdirectories:
  - `pages/`: Routable screens (Duo workflow pages, auth, admin, welcome)
  - `components/ui/`: Radix UI-based design system components
  - `components/admin/`: Admin dashboard components
  - `contexts/`: SessionContext (workflow state), AccessContext (access control)

**`client/src/pages/`:**
- Purpose: Full-screen routable components
- Contains: 50+ page components following patterns:
  - `Duo*.tsx`: Duo Connecté workflow pages (sender/receiver perspectives)
  - `DuoInversion*.tsx`: Variant pages for role reversal
  - `Dashboard.tsx`: Admin control panel
  - `AuthPage.tsx`, `AdminLogin.tsx`: Login flows
  - Demo screens: `DemoLoadingScreen.tsx`, `DemoPaywallScreen.tsx`, `DemoPinCreation.tsx`

**`client/src/components/ui/`:**
- Purpose: Radix UI wrapper components styled with Tailwind
- Contains: Unstyled component exports (button, card, form, dialog, etc.)
- Pattern: File per component (e.g., `button.tsx`, `card.tsx`, `form.tsx`)

**`shared/`:**
- Purpose: Shared type definitions and validation schemas
- Contains:
  - Drizzle ORM table definitions (`users`, `appConfig`, `paidMembers`, etc.)
  - Zod validation schemas (`createPinSchema`, `validatePinSchema`, `updateConfigSchema`)
  - TypeScript interfaces (`User`, `AppConfig`, `SessionState`)
- Used by: Both server and client for type safety and runtime validation

## Key File Locations

**Entry Points:**

**Server (Development):**
- `server/index-dev.ts`: Development entry point, sets up Vite HMR and Express

**Server (Production):**
- `server/index-prod.ts`: Production bundled entry point (esbuild)

**Client:**
- `client/src/main.tsx`: React DOM mount point, imports App component
- `client/src/App.tsx`: Root component with all providers (Query, Theme, Access, Session)
- `client/index.html`: HTML shell with `<div id="root">` and script tag

**Configuration:**

- `tsconfig.json`: TypeScript settings, path aliases
- `vite.config.ts`: Vite build config, alias definitions (`@`, `@shared`, `@assets`)
- `tailwind.config.ts`: Tailwind CSS theme and plugin config
- `package.json`: Dependencies, build scripts, version info
- `.env.local`, `.env.example`: Environment variables (secrets not committed)

**Core Logic:**

- `server/app.ts`: Express instance, CORS, middleware, global error handler
- `server/routes.ts`: Main route registration and core API endpoints
- `server/storage.ts`: Database abstraction, MemStorage or Drizzle ORM implementation
- `server/middleware.ts`: JWT, PIN, validation, rate limiting functions
- `client/src/contexts/SessionContext.tsx`: Workflow state management
- `client/src/contexts/AccessContext.tsx`: Access control state management
- `shared/schema.ts`: All Drizzle tables, Zod schemas, TypeScript types

**Testing:**

- Not detected in current structure (no `__tests__`, `*.test.ts`, or `*.spec.ts` files found)

## Naming Conventions

**Files:**

- **React Components:** PascalCase (`SessionContext.tsx`, `GlobalHeader.tsx`, `DuoRoles.tsx`)
- **Utilities/Services:** camelCase (`queryClient.ts`, `usePageTransition.ts`, `use-circle-auth.ts`)
- **Hooks:** `use` prefix, camelCase (`use-toast.ts`, `use-mobile.tsx`, `use-circle-auth.ts`)
- **Pages:** PascalCase with domain prefix (`DuoSenderSituation.tsx`, `AdminLogin.tsx`)
- **Routes:** Abbreviated action name (`auth.ts`, `admin.ts`, `support.ts`, `webhooks.ts`)

**Directories:**

- **UI Components:** `components/ui/` (Radix-based, lowercase with dash: `alert-dialog.tsx`, `dropdown-menu.tsx`)
- **Features:** Feature name in lowercase or PascalCase (`admin/`, `flow/`, `pages/`)
- **Hooks:** `hooks/` subdirectory, file names with `use-` prefix
- **Utilities:** `lib/` subdirectory for shared helpers and services

**TypeScript/JavaScript:**

- **Interfaces:** PascalCase (`User`, `AppConfig`, `IStorage`)
- **Types:** PascalCase (`SessionState`, `CircleUserData`)
- **Functions:** camelCase (`hashPin()`, `validateUserData()`, `generateSessionToken()`)
- **Constants:** SCREAMING_SNAKE_CASE (`VALIDATION_EXPIRY_MS`, `BCRYPT_ROUNDS`)
- **React Hooks:** camelCase with `use` prefix (`useSession()`, `useAccess()`, `useQuery()`)

## Where to Add New Code

**New Feature:**
- **Primary code:** `client/src/pages/FeatureName.tsx` for page, `client/src/components/FeatureName.tsx` for components
- **Server logic:** `server/routes/featureName.ts` if new endpoint category, or add to existing file
- **Types/schemas:** Add to `shared/schema.ts` (Drizzle tables, Zod validators, TypeScript types)
- **API calls:** Add query functions in `client/src/lib/queryClient.ts` or create new hook in `client/src/hooks/`

**New Component/Module:**
- **UI Component:** Create in `client/src/components/` with file name matching component name (PascalCase)
- **Page Component:** Create in `client/src/pages/` following naming pattern (`DuoXxx.tsx`, `AdminXxx.tsx`)
- **Server Endpoint:** Add route to appropriate file in `server/routes/` (auth.ts, admin.ts, support.ts, etc.) or create new route file
- **Middleware:** Add function to `server/middleware.ts` or create separate file if complex

**Utilities:**
- **Shared helpers:** `client/src/lib/utils.ts` for general utilities
- **Authentication utilities:** `client/src/lib/auth.ts` for token/auth logic
- **Custom hooks:** `client/src/hooks/` directory with `use` prefix naming
- **Server utilities:** Create in `server/` at appropriate level or in `server/routes/`

**Database Operations:**
- **New table:** Add Drizzle table definition to `shared/schema.ts`
- **Zod schema:** Add validation schema in `shared/schema.ts` near corresponding Drizzle table
- **Storage methods:** Implement in `MemStorage` class in `server/storage.ts`, update `IStorage` interface

**Styling:**
- **Global styles:** `client/src/index.css` for app-wide styles
- **Component styles:** Inline Tailwind classes in JSX (no separate CSS files)
- **Theme config:** Modify `tailwind.config.ts` for custom colors, fonts, spacing

## Special Directories

**`dist/`:**
- Purpose: Build output directory
- Generated: Yes (created by `vite build && esbuild` build process)
- Committed: No (in `.gitignore`)
- Contents: Minified client assets in `dist/public/`, bundled server code in `dist/index.js`

**`client/public/`:**
- Purpose: Static assets served directly (icons, images, logos)
- Generated: No
- Committed: Yes
- Contents: Icon files (`icons/`), favicon, publicly accessible files

**`attached_assets/`:**
- Purpose: Additional assets (not in repo)
- Generated: No
- Committed: Partial (referenced in vite alias `@assets`)

**`.planning/codebase/`:**
- Purpose: Architecture and planning documents
- Generated: Yes (by GSD commands)
- Committed: Yes
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

**`.config/npm/`:**
- Purpose: Node package manager configuration
- Generated: Yes (by npm/package manager)
- Committed: No
- Contents: Global npm packages and cache

**`.local/`:**
- Purpose: Local development state (not version controlled)
- Generated: Yes (by development tools and Replit agent)
- Committed: No
- Contents: Agent state files, build caches

---

*Structure analysis: 2026-01-30*
