# External Integrations

**Analysis Date:** 2026-01-30

## APIs & External Services

**Circle.so Integration:**
- Circle.so community platform - User authentication and identity provider
  - SDK/Client: postMessage API for iframe communication
  - Auth: Frame-to-frame authentication via message passing
  - Implementation: `client/src/hooks/use-circle-auth.ts`
  - Env vars: `VITE_CIRCLE_ORIGIN`, `CIRCLE_ORIGIN`
  - Purpose: Authenticates users from Circle.so communities, provides user identity data

**Email Service:**
- Resend - Transactional email service for support tickets
  - SDK/Client: `resend` package (6.6.0)
  - Auth: `RESEND_API_KEY` environment variable
  - Implementation: `server/routes/support.ts`
  - Endpoints:
    - Support ticket notifications to `support@avancersimplement.com`
    - Support ticket replies to user email addresses
  - Purpose: Sends email notifications for new support tickets and admin replies

**Payment Webhook:**
- Circle.so Payment Webhook - Receives payment notifications
  - Endpoint: `POST /api/webhooks/circle-payment`
  - Auth: `X-Webhook-Secret` header validation (env var: `WEBHOOK_SECRET`)
  - Implementation: `server/routes/webhooks.ts`
  - Purpose: Processes payment events and registers paid members

## Data Storage

**Databases:**
- PostgreSQL (production) or SQLite (optional fallback)
  - Connection: `DATABASE_URL` environment variable
  - Client: Drizzle ORM with Neon serverless driver
  - Implementation: `server/storage.ts` (DB layer with abstraction)
  - Connection pooling: `@neondatabase/serverless` Pool

**Database Tables:**
- `users` - User accounts with JWT-based sessions
  - Fields: id (UUID), email, publicUid, name, pinHash, isAdmin, createdAt, lastLogin
  - Indexes: Primary key on id

- `login_attempts` - Login audit trail
  - Fields: id, userId, success, ipAddress, timestamp
  - Indexes: Composite on (userId, timestamp)

- `app_config` - Application configuration singleton
  - Fields: requireCircleDomain, requireCircleLogin, requirePaywall, requirePin, paywallPurchaseUrl, paywallInfoUrl, paywallTitle, paywallMessage, webhookAppUrl, environment, updatedAt
  - Purpose: Runtime configuration without code deployment

- `paidMembers` - Paid subscription tracking
  - Fields: id (UUID), email (unique), paymentDate, paymentPlan, amountPaid, couponUsed
  - Purpose: Tracks users with active subscriptions

- `feedbacks` - User feedback collection
  - Fields: id, rating, message, createdAt, archived

- `supportTickets` - Support request management
  - Fields: id, name, email, subject, description, status, createdAt, updatedAt

**File Storage:**
- Local filesystem only - Static assets in `attached_assets/`
  - Served via Express static middleware from `dist/public`

**Caching:**
- In-memory cache for client (localStorage)
  - Circle.so user data cached for 7 days
  - Validation tokens cached in memory (5 minute expiry)
- Session storage (configurable)
  - Development: memorystore (in-process)
  - Production: connect-pg-simple (PostgreSQL-backed)

## Authentication & Identity

**Auth Provider:**
- Circle.so (primary) - Community platform authentication
  - Implementation: iframe-based postMessage protocol
  - Data flow:
    1. Client requests user auth from parent frame (Circle.so)
    2. Circle.so sends user data via postMessage
    3. Client validates and stores user info (localStorage)
    4. Server validates Circle.so user data on auth endpoints

- Custom PIN-based (secondary) - Local PIN authentication
  - Implementation: bcrypt hashing with 10 rounds
  - Endpoints: `/api/auth/validate-pin`, `/api/auth/create-pin`
  - Rate limiting: 5 attempts per 15 minutes

**Session Management:**
- JWT tokens (Bearer tokens)
  - Implementation: `server/middleware.ts`
  - Secret: `JWT_SECRET` or `SESSION_SECRET` env var
  - Expiry: 60 minutes
  - Payload: { userId, email }

## Monitoring & Observability

**Error Tracking:**
- Not integrated (console.error only)

**Logs:**
- Console logging (stdout)
  - Dev mode: Request/response logging
  - Auth logging: [AUTH], [WEBHOOK], [VALIDATE] tags
  - Email logging: [RESEND] tags
  - Webhook logging: [WEBHOOK] tags

## CI/CD & Deployment

**Hosting:**
- Replit (detected via REPLIT_* environment variables)
  - Dev domain: `REPLIT_DEV_DOMAIN`
  - Deployment URL: `REPLIT_DEPLOYMENT_URL`
  - Production domains: `REPLIT_DOMAINS` (comma-separated)

**Build & Deployment:**
- Vite for client bundling
- esbuild for production server bundling
- Single port serving (5000)
  - Firewalled - only accessible on configured port
  - Serves both API and static client

**CI Pipeline:**
- None detected in configuration

## Environment Configuration

**Required env vars (for operation):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` or `SESSION_SECRET` - Token signing key
- `NODE_ENV` - Set to `production` for production
- `PORT` - Server port (default 5000)

**Critical optional env vars:**
- `RESEND_API_KEY` - Email notifications (required for support email feature)
- `WEBHOOK_SECRET` - Payment webhook validation (required for payment processing)
- `VITE_CIRCLE_ORIGIN` - Circle.so community origin (for auth validation)
- `CIRCLE_ORIGIN` - Circle.so origin in production

**Feature flags:**
- `VITE_DEV_MODE=true` - Bypasses Circle.so authentication (development only)
- `SESSION_TIMEOUT` - Session timeout milliseconds (default 3600000 = 1 hour)
- `PIN_ATTEMPTS_LIMIT=5` - Maximum PIN validation attempts
- `PIN_ATTEMPTS_WINDOW=900000` - Rate limit window (15 minutes)

**Secrets location:**
- Environment variables only (no .env file in version control)
- Replit environment dashboard for production secrets

## Webhooks & Callbacks

**Incoming Webhooks:**
- `POST /api/webhooks/circle-payment` - Circle.so payment notifications
  - Event types: `payment_received`
  - Headers: `X-Webhook-Secret` (HMAC validation)
  - Payload: { event, user: { email }, payment: { paywall_display_name, amount_paid, coupon_code } }
  - Purpose: Register paid members when payment received

**Outgoing Webhooks:**
- None implemented (configurable URL in `app_config.webhookAppUrl` but not used)

**Email Callbacks:**
- None (Resend is one-way notification service)

## Cross-Origin Integration

**CORS Configuration:**
- `server/app.ts` - Dynamic CORS policy
  - Allows Circle.so origin (from `CIRCLE_ORIGIN` env var)
  - Allows app's own origins (Replit deployment domains)
  - Dev mode: Allows all origins
  - Credentials: enabled

**iframe Support:**
- Content-Security-Policy: `frame-ancestors 'self' [circleOrigin]`
- X-Frame-Options: removed to allow embedding
- Purpose: Application embedded in Circle.so iframe

## Rate Limiting

**PIN Validation:**
- Service: `express-rate-limit`
- Configuration: 5 attempts per 15 minutes (900000ms)
- Implementation: `server/middleware.ts` (pinRateLimiter)
- Applied to: `/api/auth/validate-pin`, `/api/auth/admin-login`

**Trust Proxy:**
- Express configured to trust proxy (for accurate IP detection behind reverse proxy)

---

*Integration audit: 2026-01-30*
