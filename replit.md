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

### Feature Specifications

-   **Duo Mode:** 38 guided steps, including an inversion path, for structured dialogue between a sender and receiver. Progress is indicated by a blue color.
-   **Structured Journey:** Divided into 8 sections: Welcome, Setting the Table, Sender's Core Issue, Receiver Validates Sender, Receiver's Experience, Validate Receiver, Request and Need, and Closure.
-   **Admin Preview Sidebar:** Allows navigation to all pages (Duo, Inversion, special pages) for administrators.
-   **Member Management:** Options to "Remove paid access" or "Delete completely" (user + data).
-   **Support System:** Includes tickets and FAQ functionality (requires Resend for emails).
-   **Session Management:** Conversation state is managed via `SessionContext`, storing sender/receiver names, current step, and checklist progress.

### System Design Choices

-   **Security Architecture:** A configurable 4-layer authentication system:
    1.  **Circle.so Domain:** Verifies if the app is within the Circle.so iframe.
    2.  **Circle.so Login:** Validates user data via `postMessage` (email, publicUid, timestamp).
    3.  **Paywall:** Checks for paid access (synchronized via Circle.so webhook).
    4.  **Personal PIN:** 4-6 digit PIN, bcrypt hashed, rate-limited, JWT-secured.
    -   All layers are configurable via the Admin Dashboard.
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