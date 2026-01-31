# Technology Stack

**Analysis Date:** 2026-01-31

## Languages

**Primary:**
- TypeScript 5.6.3 - Full codebase including client, server, and shared code
- JavaScript - Configuration and tooling

**Secondary:**
- JSX/TSX - React component implementation in client code

## Runtime

**Environment:**
- Node.js (version inferred from dependencies; ESM modules required)

**Package Manager:**
- npm (package-lock.json present)
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Express 4.21.2 - Backend HTTP server and API routing
- React 18.3.1 - Frontend UI library
- Vite 5.4.20 - Frontend build tool and dev server

**UI Components:**
- Radix UI (multiple @radix-ui packages) - Accessible component library
  - Dialog, dropdown menus, form controls (checkbox, radio, select), tooltips, etc.
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Tailwind Animate 1.0.7 - Animation utilities
- Framer Motion 11.13.1 - Advanced animation library

**Form & Validation:**
- React Hook Form 7.55.0 - Form state management
- Zod 3.24.2 - TypeScript-first schema validation
- @hookform/resolvers 3.10.0 - Bridge between React Hook Form and Zod
- Zod Validation Error 3.4.0 - Better error formatting

**Routing:**
- Wouter 3.3.5 - Lightweight client-side router

**Database & ORM:**
- Drizzle ORM 0.39.1 - TypeScript ORM with PostgreSQL support
- Drizzle Kit 0.31.4 - Schema migration and management tool
- @neondatabase/serverless 0.10.4 - Serverless PostgreSQL client (Neon)

**State Management & Data Fetching:**
- TanStack React Query 5.60.5 - Server state and data fetching management
- memorystore 1.6.7 - In-memory session storage (development)

**Authentication & Security:**
- jsonwebtoken 9.0.2 - JWT token generation and verification
- bcrypt 6.0.0 - Password hashing (for PIN hashing)
- express-session 1.18.1 - Session management middleware
- connect-pg-simple 10.0.0 - PostgreSQL session store

**Utilities:**
- date-fns 3.6.0 - Date/time utilities
- lucide-react 0.453.0 - Icon library
- recharts 2.15.2 - Chart/visualization library
- react-day-picker 8.10.1 - Date picker component
- input-otp 1.4.2 - OTP/PIN input component
- Clsx 2.1.1 - Conditional CSS class names
- Tailwind Merge 2.6.0 - Tailwind class name merging
- Class Variance Authority 0.7.1 - Component variant management
- cmdk 1.1.1 - Command menu component
- Vaul 1.1.2 - Drawer/sidebar component
- next-themes 0.4.6 - Theme management (light/dark mode)

**Backend Utilities:**
- cors 2.8.5 - CORS middleware
- express-rate-limit 8.2.1 - Rate limiting middleware
- dotenv 17.2.3 - Environment variable loading

**WebSocket:**
- ws 8.18.0 - WebSocket server implementation
- bufferutil 4.0.8 (optional) - WebSocket performance optimization

## Key Dependencies

**Critical:**
- `drizzle-orm` 0.39.1 - Core data access layer for all database operations. Used in `server/storage.ts` to manage users, auth, tickets, config
- `@neondatabase/serverless` 0.10.4 - Serverless PostgreSQL connection pooling via Neon. Required for DATABASE_URL connection
- `express` 4.21.2 - HTTP server handling all API routes in `server/routes/`
- `react` 18.3.1 + `react-dom` 18.3.1 - Core UI rendering in `client/src/`

**Infrastructure:**
- `jsonwebtoken` 9.0.2 - JWT session tokens used in `server/middleware.ts` for authentication
- `bcrypt` 6.0.0 - PIN hashing for user authentication (`server/middleware.ts`)
- `express-session` + `connect-pg-simple` - Stateful session management
- `@tanstack/react-query` 5.60.5 - Client-side API request management and caching

## Configuration

**Environment:**
- Environment variables in `.env` (development) and deployed via platform env vars
- Key required vars: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`
- Optional: `RESEND_API_KEY`, `WEBHOOK_SECRET`, `CIRCLE_ORIGIN`

**Build:**
- TypeScript configuration: `tsconfig.json` - Strict mode enabled, ESNext target
- Vite config: `vite.config.ts` - React plugin, path aliases (@, @shared, @assets)
- Drizzle config: `drizzle.config.ts` - PostgreSQL dialect, migrations in `./migrations`
- Tailwind config: `tailwind.config.ts` - Customization and utilities
- PostCSS config: `postcss.config.js` - Tailwind CSS processing

## Platform Requirements

**Development:**
- Node.js with npm
- PostgreSQL database (Neon serverless recommended)
- `.env` file with DATABASE_URL, JWT_SECRET, and other vars

**Production:**
- Deployment platform with Node.js support (Railway used in production)
- PostgreSQL database (Neon serverless)
- Environment variables: DATABASE_URL, JWT_SECRET, NODE_ENV=production, RESEND_API_KEY (optional), WEBHOOK_SECRET (optional)
- CORS configured for Circle.so origin via CIRCLE_ORIGIN or VITE_CIRCLE_ORIGIN

---

*Stack analysis: 2026-01-31*
