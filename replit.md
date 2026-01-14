# duo-connecte - Guide de Communication Authentique

## Overview

Duo-connecte is an application designed to guide authentic communication between two people, integrated into Circle.so via an iframe. It offers a structured "Duo" journey with a configurable 4-layer security architecture. The application aims to provide a guided experience for interpersonal communication, emphasizing structured dialogue and emotional regulation. It is exclusively dedicated to the two-person (Duo) journey, with the Solo mode having been extracted to a separate application.

**Brand:** "Avancer Simplement" (Moving Forward Simply)

## User Preferences

I prefer explanations that are concise and to the point.
I value clear architectural diagrams and structured information.
Please ensure that any proposed changes maintain the existing security architecture and integration with Circle.so.
I prefer iterative development, with clear communication before major changes are implemented.
Do not reintroduce the Solo journey (it has been extracted to a separate application).
Do not make changes to the `server/routes/auth.ts` file without explicit approval, as it contains critical authentication logic.

## System Architecture

The application is structured around a guided communication journey for two users.

### UI/UX Decisions

-   **Branding:** "Avancer Simplement" with a distinct logo for light and dark modes (`logo-blue.png`, `logo-white.png`).
-   **Typography:** Montserrat Black Italic (uppercase) for brand titles, Inter for body text.
-   **Color Scheme:** Primary blue (`#074491`), light primary blue (`#3085F5`), and Duo blue (`hsl(221, 83%, 53%)`) for progress indication.
-   **Theming:** Synchronizes automatically with Circle.so.
-   **Components:** Utilizes `shadcn/ui` for UI components, `Tailwind CSS` for styling, and `Framer Motion` for animations.

### Technical Implementations

-   **Frontend:** React 18, TypeScript, Wouter for routing, TanStack Query v5 for data fetching, shadcn/ui, Tailwind CSS, Framer Motion.
-   **Backend:** Node.js 20, Express for the server, Drizzle ORM for database interaction, PostgreSQL (Neon) as the database, JWT for session management, bcrypt for password hashing, and express-rate-limit for security.
-   **PWA:** Implemented with `manifest.json`, PWA icons, and Apple meta tags for iOS Safari, including an installation banner on mobile.

### Reusable Components

#### MultiPageModal (Popup multi-pages)
Location: `client/src/components/flow/MultiPageModal.tsx`

**Usage:** Pour tous les popups informatifs/théoriques avec plusieurs pages.

**Design établi:**
- Suit le mode light/dark automatiquement (bg-card)
- Header avec icône dans un cercle coloré (bg-primary/10)
- Indicateurs de page cliquables (points)
- Contenu aéré avec padding généreux (p-6 → p-10)
- Footer avec boutons Précédent/Suivant
- Accents de couleur primaire

**Exemple d'utilisation:**
```tsx
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';
import { Sparkles, ListChecks, Shield } from 'lucide-react';

const pages = [
  {
    title: "Titre de la page",
    icon: Sparkles,  // Optionnel - icône Lucide
    content: (
      <div className="space-y-8">
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
          Paragraphe aéré...
        </p>
        <Callout variant="primary">
          Contenu important encadré
        </Callout>
      </div>
    )
  },
  // ... autres pages
];

<MultiPageModal
  triggerText="Plus d'infos: Théories"
  pages={pages}
  finalButtonText="Commencer le parcours"
  onComplete={() => handleNavigation()}
/>
```

**Règles de design pour le contenu:**
- Utiliser `space-y-8` pour l'espacement principal
- Paragraphes courts et séparés
- Callouts pour les informations importantes
- BulletList pour les listes
- Subtitle pour les sous-titres

### Feature Specifications

-   **Duo Mode:** 38 guided steps, including an inversion path, for structured dialogue between a sender and receiver. Progress is indicated by a blue color.
-   **Structured Journey:** Divided into 8 sections: Welcome, Setting the Table, Sender's Core Issue, Receiver Validates Sender, Receiver's Experience, Validate Receiver, Request and Need, and Closure.
-   **Admin Preview Sidebar:** Allows navigation to all pages (Duo, Inversion, special pages) for administrators.
-   **Member Management:** Options to "Remove paid access" or "Delete completely" (user + data).
-   **Support System:** Includes tickets and FAQ functionality (requires Resend for emails).
-   **Session Management:** Conversation state is managed via `SessionContext`, storing sender/receiver names, current step, and checklist progress.

### System Design Choices

-   **Security Architecture:** A configurable 4-layer authentication system (see detailed section below).
-   **Modular Project Structure:** The codebase is separated into `client/` (frontend components, contexts, hooks, pages, lib) and `server/` (Express app, routes, storage, middleware, and modular routes for auth, admin, support, webhooks). Shared schemas are in `shared/`.
-   **Circle.so Integration:** Relies on `window.circleUser` for user data provided by Circle.so, communicated via `postMessage` to the iframe.
-   **Database Schema:** Utilizes PostgreSQL with tables for `users`, `login_attempts`, `app_config`, `paid_members`, `feedbacks`, and `support_tickets`.

## External Dependencies

-   **Circle.so:** Primary platform integration for user authentication, member status (paywall), and iframe embedding.
-   **PostgreSQL (Neon):** The relational database used for all application data.
-   **Resend:** (To be configured) For sending emails related to support tickets.
-   **TanStack Query v5:** For server-state management on the frontend.
-   **Wouter:** A small routing library for React.
-   **shadcn/ui:** UI component library.
-   **Tailwind CSS:** Utility-first CSS framework.
-   **Framer Motion:** Animation library for React.
-   **Express:** Web framework for Node.js.
-   **Drizzle ORM:** TypeScript ORM for PostgreSQL.
-   **JWT (JSON Web Tokens):** For secure session management.
-   **bcrypt:** For hashing user PINs.
-   **express-rate-limit:** Middleware for rate limiting requests.

## Authentication System

The application implements a **configurable 4-layer security architecture** designed for Circle.so iframe integration. All layers are independently toggleable via the Admin Dashboard.

### Layer 1: Circle.so Domain Verification

**Purpose:** Ensures the app is accessed only from within the authorized Circle.so community.

**Implementation:**
- `AccessContext.tsx` listens for `postMessage` events from the parent window
- Validates that `event.origin === 'https://communaute.avancersimplement.com'`
- If `circleOnlyMode` is enabled and no valid Circle.so message is received within 3 seconds, access is denied with status `origin_invalid`

**Key Files:**
- `client/src/contexts/AccessContext.tsx` - Origin validation and timeout logic

### Layer 2: Circle.so User Validation

**Purpose:** Authenticates users based on their Circle.so identity.

**Flow:**
1. Circle.so sends a `CIRCLE_USER_AUTH` message via `postMessage` containing:
   - `user.email` - User's email from Circle.so
   - `user.name` - Display name
   - `user.isAdmin` - Admin status in Circle.so
   - `theme` - Current theme preference

2. The app stores this in:
   - `localStorage` (key: `duo-connecte-user-email`)
   - `window.__CIRCLE_USER_EMAIL__` (global reference)

3. Backend validates user data at `/api/auth/validate`:
   - Checks email format and required fields
   - Creates validation token (expires in 5 minutes)
   - Returns user status: `new_user`, `existing_user`, `missing_pin`, or `auto_login`

**Key Files:**
- `client/src/contexts/AccessContext.tsx` - Message listener
- `server/routes/auth.ts` - `/api/auth/validate` endpoint
- `server/middleware.ts` - `validateUserData()` function

### Layer 3: Paywall Verification

**Purpose:** Restricts access to paid members only (synchronized via Circle.so webhooks).

**Flow:**
1. Admin enables paywall via Dashboard (`app_config.requirePaywall`)
2. On each authentication attempt, backend checks `paid_members` table
3. If user's email is not in the paid members list, access is blocked

**Endpoints:**
- `POST /api/auth/check-paywall` - Checks if user has paid access
- `POST /api/webhooks/circle` - Receives member updates from Circle.so

**Paywall Blocking Points:**
- `/api/auth/create-pin` - Blocks PIN creation for non-members
- `/api/auth/create-user-no-pin` - Blocks account creation for non-members
- `/api/auth/validate-pin` - Blocks PIN login for non-members

**Key Files:**
- `server/routes/auth.ts` - Paywall checks on all auth endpoints
- `server/routes/webhooks.ts` - Circle.so webhook handler
- `client/src/components/admin/PaywallTab.tsx` - Admin configuration

### Layer 4: Personal PIN Authentication

**Purpose:** Adds a personal security layer with a 4-6 digit PIN.

**Flow:**
1. **New Users:**
   - Receive `validation_token` from `/api/auth/validate`
   - Create PIN via `/api/auth/create-pin`
   - PIN is bcrypt hashed before storage

2. **Returning Users:**
   - Enter PIN on login screen
   - PIN validated via `/api/auth/validate-pin`
   - Rate-limited to prevent brute force (5 attempts per 15 minutes)

3. **Session Management:**
   - On successful login, server generates JWT token via `generateSessionToken()`
   - Token stored in `localStorage` as `session_token`
   - Session expires after 1 hour (checked client-side)

**Security Measures:**
- `bcrypt` for PIN hashing (10 salt rounds)
- `express-rate-limit` on PIN endpoints
- JWT tokens signed with `SESSION_SECRET`
- Login attempts logged in `login_attempts` table

**Key Files:**
- `server/routes/auth.ts` - PIN creation and validation endpoints
- `server/middleware.ts` - `hashPin()`, `comparePin()`, `pinRateLimiter`
- `client/src/lib/auth.ts` - `isAuthenticated()`, `clearAuth()`, `getSessionToken()`
- `client/src/components/pin-login-form.tsx` - PIN entry UI
- `client/src/components/pin-creation-form.tsx` - PIN creation UI

### Admin Authentication

Administrators use a separate login flow at `/admin-login`:
1. Must have `isAdmin: true` in database
2. Same PIN validation as regular users
3. Rate-limited independently

**Endpoint:** `POST /api/auth/admin-login`

### Authentication Endpoints Summary

| Endpoint | Purpose | Rate Limited |
|----------|---------|--------------|
| `POST /api/auth/validate` | Validate Circle.so user data | No |
| `POST /api/auth/create-pin` | Create new PIN for user | No |
| `POST /api/auth/create-user-no-pin` | Create user when PIN disabled | No |
| `POST /api/auth/validate-pin` | Login with PIN | Yes |
| `POST /api/auth/admin-login` | Admin PIN login | Yes |
| `GET /api/auth/me` | Get current user info | No (requires auth) |
| `POST /api/auth/check-paywall` | Check paywall access | No |

### Configuration Options (Admin Dashboard)

| Setting | Description | Default |
|---------|-------------|---------|
| `circleOnlyMode` | Require Circle.so iframe | `false` |
| `requirePaywall` | Enable paid access check | `false` |
| `requirePin` | Require PIN authentication | `true` |
| `paywallTitle` | Custom paywall message title | - |
| `paywallMessage` | Custom paywall message body | - |
| `paywallPurchaseUrl` | Link to purchase access | - |
| `paywallInfoUrl` | Link to more information | - |