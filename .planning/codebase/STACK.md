# Technology Stack

**Analysis Date:** 2026-01-30

## Languages

**Primary:**
- TypeScript 5.6.3 - Full codebase (client, server, shared)
- HTML/CSS - Client views and styling

**Secondary:**
- JavaScript - Package configuration and build tools

## Runtime

**Environment:**
- Node.js (via tsx and esbuild for TypeScript execution)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)

## Frameworks

**Core:**
- Express 4.21.2 - Backend REST API server
- React 18.3.1 - Frontend UI framework
- Vite 5.4.20 - Frontend build tool and dev server

**UI & Components:**
- Radix UI (multiple @radix-ui packages) - Accessible component primitives
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- shadcn/ui pattern - Built on Radix UI components

**Form & Validation:**
- React Hook Form 7.55.0 - Form state management
- Zod 3.24.2 - Runtime schema validation
- drizzle-zod 0.7.0 - ORM schema validation integration

**Routing & Navigation:**
- Wouter 3.3.5 - Lightweight client-side router

**Data Fetching & State:**
- TanStack React Query 5.60.5 - Server state management

**Database:**
- Drizzle ORM 0.39.1 - Type-safe SQL ORM
- Drizzle Kit 0.31.4 - Drizzle migrations and schema management

**Authentication:**
- jsonwebtoken 9.0.2 - JWT token generation and verification
- bcrypt 6.0.0 - Password hashing

**Testing & Development:**
- tsx 4.20.5 - TypeScript execution for dev/build
- @vitejs/plugin-react 4.7.0 - React plugin for Vite
- esbuild 0.25.0 - JavaScript bundler for production server

**Styling:**
- PostCSS 8.4.47 - CSS transformations
- Autoprefixer 10.4.20 - Browser vendor prefix automation
- TailwindCSS Vite plugin 4.1.3 - Tailwind integration with Vite
- tailwindcss-animate 1.0.7 - Animation utilities for Tailwind
- tw-animate-css 1.2.5 - Additional animation utilities

**UI Utilities:**
- Framer Motion 11.13.1 - Animation library
- Recharts 2.15.2 - React charts library
- date-fns 3.6.0 - Date/time utilities
- Lucide React 0.453.0 - Icon library
- React Icons 5.4.0 - Additional icon collections
- class-variance-authority 0.7.1 - Component variant utilities
- clsx 2.1.1 - Utility for conditional class names
- tailwind-merge 2.6.0 - Merge Tailwind class utilities
- cmdk 1.1.1 - Command palette component
- input-otp 1.4.2 - OTP input component
- vaul 1.1.2 - Drawer component library
- react-day-picker 8.10.1 - Calendar date picker

**Session Management:**
- express-session 1.18.1 - HTTP session management
- connect-pg-simple 10.0.0 - PostgreSQL session store
- memorystore 1.6.7 - In-memory session store (development)

**Rate Limiting:**
- express-rate-limit 8.2.1 - HTTP request rate limiting

**CORS & Server Security:**
- cors 2.8.5 - Cross-Origin Resource Sharing middleware

**Development Environment Variables:**
- dotenv 17.2.3 - Environment variable loading

**Validation & Serialization:**
- zod-validation-error 3.4.0 - Enhanced Zod validation error formatting

**WebSocket:**
- ws 8.18.0 - WebSocket library

**Development Tools:**
- Replit Vite plugins:
  - @replit/vite-plugin-cartographer 0.4.4 - File mapping
  - @replit/vite-plugin-dev-banner 0.1.1 - Dev environment banner
  - @replit/vite-plugin-runtime-error-modal 0.0.3 - Error modal UI
- cross-env 10.1.0 - Cross-platform environment variables
- @tailwindcss/typography 0.5.15 - Typography plugin for Tailwind

## Key Dependencies

**Critical:**
- `@neondatabase/serverless 0.10.4` - Serverless PostgreSQL client with connection pooling (production database access)
- `drizzle-orm 0.39.1` - Type-safe database abstraction layer
- `jsonwebtoken 9.0.2` - JWT-based session token generation and verification
- `bcrypt 6.0.0` - PIN/password hashing and verification

**Infrastructure:**
- `express 4.21.2` - HTTP server framework
- `vite 5.4.20` - Next-generation frontend build tool
- `esbuild 0.25.0` - Production server bundling
- `@vitejs/plugin-react 4.7.0` - React JSX transformation

**Email & Communication:**
- `resend 6.6.0` - Email service API for support ticket notifications

**Type Safety:**
- `@types/bcrypt 6.0.0`
- `@types/cors 2.8.19`
- `@types/jsonwebtoken 9.0.10`
- `@types/connect-pg-simple 7.0.3`
- `@types/express 4.17.21`
- `@types/express-session 1.18.0`
- `@types/node 20.16.11`
- `@types/react 18.3.11`
- `@types/react-dom 18.3.1`
- `@types/ws 8.5.13`

## Configuration

**Environment:**
- Variables configured via `.env` file (copied from `.env.example`)
- Key configurations:
  - `JWT_SECRET` - Session token signing key
  - `DATABASE_URL` - PostgreSQL connection string
  - `VITE_DEV_MODE` - Development mode flag (bypasses Circle.so auth)
  - `VITE_CIRCLE_ORIGIN` - Circle.so community URL
  - `SESSION_TIMEOUT` - Session timeout in milliseconds
  - `PIN_ATTEMPTS_LIMIT` - Rate limiting for PIN attempts
  - `PIN_ATTEMPTS_WINDOW` - Rate limiting time window
  - `PORT` - Server port (default: 5000)
  - `NODE_ENV` - Node environment (development/production)
  - `RESEND_API_KEY` - Email service API key (optional)
  - `WEBHOOK_SECRET` - Webhook authentication secret
  - `CIRCLE_ORIGIN` - Circle.so origin (production)

**Build:**
- `vite.config.ts` - Vite build configuration
  - Client root: `./client`
  - Build output: `./dist/public`
  - Alias paths: `@` -> `client/src`, `@shared` -> `shared`, `@assets` -> `attached_assets`
  - React plugin enabled
  - Replit dev tools integrated

- `tsconfig.json` - TypeScript configuration
  - Strict mode enabled
  - Module resolution: bundler
  - Path aliases for imports

- `drizzle.config.ts` - Drizzle ORM configuration
  - Schema: `./shared/schema.ts`
  - Migrations: `./migrations`
  - Dialect: PostgreSQL

- `tailwind.config.ts` - Tailwind CSS customization
  - Dark mode: class-based
  - Content: `./client/index.html` and client src files
  - Extended theme with custom colors, border radius

- `postcss.config.js` - PostCSS pipeline
  - Tailwind plugin
  - Autoprefixer for vendor prefixes

## Platform Requirements

**Development:**
- Node.js (compatible with tsx and esbuild)
- PostgreSQL database (or SQLite fallback, see `.env.example`)
- npm for package management

**Production:**
- Node.js runtime
- PostgreSQL database (via Neon serverless)
- Replit deployment (environment variables: REPLIT_DEV_DOMAIN, REPLIT_DEPLOYMENT_URL, REPLIT_DOMAINS)

**Scripts:**
- `npm run dev` - Start development server with hot reload (uses tsx)
- `npm run build` - Build client with Vite + bundle server with esbuild
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push schema changes to database

---

*Stack analysis: 2026-01-30*
