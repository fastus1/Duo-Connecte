# External Integrations

**Analysis Date:** 2026-01-31

## APIs & External Services

**Email Service:**
- Resend - Email delivery for support tickets and admin notifications
  - SDK/Client: `resend` 6.6.0
  - Auth: `RESEND_API_KEY` environment variable
  - Usage: `server/routes/support.ts` - Sends support ticket notifications to admin and reply emails to users
  - Sender: `support@avancersimplement.com`

**Community Platform:**
- Circle.so - Embedded community/membership platform
  - Integration: iframe embedding with CORS configuration
  - Auth: Custom validation flow via `server/routes/auth.ts`
  - User data flow: Circle passes user data to `/api/auth/validate` endpoint
  - Config: `CIRCLE_ORIGIN` (production) or `VITE_CIRCLE_ORIGIN` (development) environment variables
  - CORS: Configured in `server/app.ts` to allow Circle.so origin
  - Frame policy: X-Frame-Options removed, Content-Security-Policy set to allow iframe embedding

## Data Storage

**Databases:**

**PostgreSQL (Production/Primary):**
- Connection: `DATABASE_URL` environment variable (Neon serverless)
- Client: Drizzle ORM with `@neondatabase/serverless` connection pooling
- Tables managed in `shared/schema.ts`:
  - `users` - User accounts with email, public UID, PIN hash, admin flag
  - `loginAttempts` - Login audit trail with IP addresses and timestamps
  - `appConfig` - Single config row for app settings (PIN requirement, paywall, Circle.so settings)
  - `paidMembers` - Paywall/payment tracking (email, plan, amount, coupon)
  - `feedbacks` - Anonymous user feedback with ratings and comments
  - `supportTickets` - Support requests with name, email, subject, description, status
- Migrations: Stored in `./migrations` directory, managed via `drizzle-kit`

**In-Memory (Development/Fallback):**
- Storage: `memorystore` 1.6.7
- Usage: Development mode or when DATABASE_URL not set
- Implements: `MemStorage` class in `server/storage.ts` with full data persistence simulation
- Seeded with: Admin user `fastusone@gmail.com` with hashed PIN

**Session Store:**
- PostgreSQL via `connect-pg-simple` - Stateful session storage
- Fallback: In-memory (`memorystore`) if not configured
- Configuration: `SESSION_SECRET` or `JWT_SECRET` environment variables (default: "development-secret-change-in-production")

**File Storage:**
- Local filesystem only - No external file storage integration detected
- Assets stored in: `attached_assets/` directory
- Static files served from: `dist/public/` (Vite build output)

**Caching:**
- Client-side: TanStack React Query handles HTTP response caching
- Server-side: Validation cache in `server/routes/auth.ts` (in-memory, 5-minute TTL)
- No external cache service configured

## Authentication & Identity

**Auth Provider:**
- Circle.so (community platform)
  - User data includes: publicUid, email, name, isAdmin flag, timestamp
  - Implementation: Validation API endpoint flow (`/api/auth/validate`)

**Custom Authentication:**
- PIN-based login: 4-6 digit numeric PIN, bcrypt hashed
- Session tokens: JWT format via jsonwebtoken, signed with JWT_SECRET
- Rate limiting: PIN attempts limited (default 5 attempts per 15 minutes) via express-rate-limit

**Auth Flow:**
1. Circle.so sends user data to `/api/auth/validate`
2. Validation token cached in memory (5-minute expiry)
3. User creates PIN or logs in with existing PIN
4. Successful auth returns JWT session token
5. Paywall check available via `/api/auth/check-paywall` endpoint

**Paywall Integration:**
- Membership check: `requirePaywall` flag in appConfig table
- Paid members tracked in `paidMembers` table
- Payment webhook: `/api/webhooks/circle-payment` (Circle.so payment events)
- Auth blocks non-paid users if paywall enabled

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Rollbar, or similar service configured

**Logs:**
- Console logging only (stdout)
- Log patterns in code:
  - `[WEBHOOK]` - Payment webhook events
  - `[RESEND]` - Email service events
  - `[AUTH]` - Authentication events
  - `[PAYWALL CHECK]` - Paywall validation
  - `[ADMIN-LOGIN]` - Admin authentication
- Server logs API requests: method, path, status code, duration, response payload
- No external log aggregation service

## CI/CD & Deployment

**Hosting:**
- Railway.com (production deployment platform)
- Auto-provisioned via Railway: RAILWAY_PUBLIC_DOMAIN environment variable
- Support for custom domains via APP_DOMAIN environment variable
- nixpacks.toml for build configuration

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or similar configured
- Manual deployments to Railway

**Build Output:**
- Client: `dist/public/` (Vite build)
- Server: `dist/index.js` (esbuild bundled ESM)
- Start command: `node dist/index.js`

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless recommended)
- `JWT_SECRET` - Secret key for JWT signing (min 16 chars recommended)
- `NODE_ENV` - "development" or "production"
- `PORT` - Server port (default 5000)
- `VITE_DEV_MODE` - "true" to bypass Circle.so validation (development only)

**Optional env vars:**
- `CIRCLE_ORIGIN` - Circle.so community URL (e.g., https://your-space.circle.so)
- `VITE_CIRCLE_ORIGIN` - Fallback Circle.so URL for dev mode
- `RESEND_API_KEY` - API key for email notifications (optional, support tickets only)
- `WEBHOOK_SECRET` - Secret for validating incoming webhooks (required for paywall)
- `APP_URL` - Custom app URL (falls back to Railway domain)
- `APP_DOMAIN` - Custom domain for CORS whitelist
- `SESSION_TIMEOUT` - Session timeout in milliseconds (default 3600000 = 1 hour)
- `PIN_ATTEMPTS_LIMIT` - Max PIN attempts before rate limit (default 5)
- `PIN_ATTEMPTS_WINDOW` - Rate limit window in milliseconds (default 900000 = 15 min)
- `SESSION_SECRET` - Fallback to JWT_SECRET if not provided

**Secrets location:**
- Development: `.env` file (not committed)
- Production: Railway environment variables

## Webhooks & Callbacks

**Incoming Webhooks:**
- `POST /api/webhooks/circle-payment` - Circle.so payment webhook
  - Payload: `{ event: 'payment_received', user: { email, timestamp }, payment: { paywall_display_name?, amount_paid?, coupon_code? } }`
  - Auth: `x-webhook-secret` header validation
  - Action: Records paid member in `paidMembers` table, enables access if paywall enabled
  - Logging: Detailed webhook event logging in production

**Outgoing Webhooks:**
- Email notifications via Resend:
  - Support ticket created: Admin notification email to `support@avancersimplement.com`
  - Support ticket replied: Reply email to user's registered email address
- Both emails include: Ticket ID, subject, sender name/email, formatted response message

**Webhook Security:**
- Payment webhook protected by `WEBHOOK_SECRET` environment variable
- Secret validation mandatory (returns 401 Unauthorized if missing/invalid)
- No HMAC signature validation (relies on secret header only)

---

*Integration audit: 2026-01-31*
