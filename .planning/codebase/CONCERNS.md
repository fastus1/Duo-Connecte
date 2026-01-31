# Codebase Concerns

**Analysis Date:** 2026-01-31

## Tech Debt

**In-Memory Validation Cache in Auth Routes:**
- Issue: Validation tokens cached in memory during authentication flow will be lost on server restart
- Files: `server/routes/auth.ts` (lines 16-33)
- Impact: Users will get "validation token expired" errors if server restarts during signup flow; poor UX on deployments
- Fix approach: Move validation cache to Redis or database-backed session store; implement distributed cache for multi-instance deployments

**Hardcoded Admin User in Development Storage:**
- Issue: Default admin user seeded in memory storage with hardcoded email and bcrypt hash
- Files: `server/storage.ts` (lines 79-88)
- Impact: Development credentials exposed in production if memory storage is accidentally used; not a concern if database storage is used, but creates maintenance burden
- Fix approach: Use environment variables or a migration system for initial admin setup; document the production requirement clearly

**Global Error Handler Logs Full Error Details:**
- Issue: Global error handler exposes error messages in response bodies in development mode
- Files: `server/app.ts` (lines 139-145, 141)
- Impact: Sensitive stack traces and implementation details leakable to clients in dev mode; current DEV_MODE check mitigates in dev environment
- Fix approach: Implement structured error logging separate from response; ensure error details never reach production responses

**Validation Token Cleanup Interval Not Optimal:**
- Issue: Cleanup interval runs every 60 seconds but expires tokens after 5 minutes - potential memory leak if many validation tokens created
- Files: `server/routes/auth.ts` (lines 26-33)
- Impact: Memory leak on high signup volume; cleanup interval not configurable
- Fix approach: Use WeakMap for cleanup or implement TTL-based cache library (node-cache, redis)

## Security Concerns

**CORS Origin Validation Uses String Includes:**
- Issue: CORS check uses `origin.includes()` which allows origin spoofing
- Files: `server/app.ts` (line 68)
- Impact: `https://evil.com-allowed-domain.com` would pass validation; should validate exact domain match or use subdomain patterns
- Fix approach: Replace with exact origin matching or proper subdomain validation using URL parsing

**Weak X-Frame-Options Handling:**
- Issue: X-Frame-Options header is removed entirely to allow iframe embedding; only CSP frame-ancestors is set
- Files: `server/app.ts` (lines 91-102)
- Impact: Older browsers without CSP support are vulnerable to clickjacking; tradeoff between Circle.so embedding and security
- Fix approach: Use both X-Frame-Options and CSP; document the security tradeoff explicitly

**Validation Cache Token Not Cryptographically Secure:**
- Issue: Validation tokens use crypto.randomBytes(32) which is secure, but cache lookups are synchronous and tokens visible in logs
- Files: `server/routes/auth.ts` (line 62, 107)
- Impact: Token enumeration possible if logs are exposed; tokens logged in console output
- Fix approach: Prevent tokens from being logged; implement rate limiting on validation endpoints

**No Rate Limiting on Auth Endpoints Except PIN:**
- Issue: `/api/auth/validate`, `/api/auth/create-pin`, `/api/auth/create-user-no-pin` have no rate limiting
- Files: `server/routes/auth.ts` (lines 35, 146, 241)
- Impact: User enumeration possible via validate endpoint; brute force attacks on account creation
- Fix approach: Apply rate limiting middleware to all auth endpoints; use IP-based rate limiting for unauthenticated endpoints

**Admin Status Determined from Client Data:**
- Issue: Admin status received from Circle.so can override server database state
- Files: `server/routes/auth.ts` (line 86)
- Impact: Privilege escalation possible if Circle.so data is compromised or spoofed; relies on client data for security decisions
- Fix approach: Never trust client-provided admin status; always derive from database; validate Circle.so integrity if critical

**Webhook Secret Validation:**
- Issue: Webhook secret is basic string comparison without timing-attack protection
- Files: `server/routes/webhooks.ts` (line 18)
- Impact: Timing attacks possible to guess webhook secret
- Fix approach: Use constant-time comparison (crypto.timingSafeEqual)

**No Input Sanitization in Email HTML Templates:**
- Issue: User input (ticket.description, ticket.name, message) directly embedded in HTML emails
- Files: `server/routes/support.ts` (lines 41, 166, 183)
- Impact: Email injection and HTML injection possible if user input contains `<` or email headers
- Fix approach: HTML-escape all user input before embedding in emails; use a template library with auto-escaping

**Session Token Hard-coded Expiry:**
- Issue: Session tokens have 60-minute expiry hard-coded; no refresh token mechanism
- Files: `server/middleware.ts` (line 19)
- Impact: No way to extend sessions; users forced to re-auth after 60 minutes
- Fix approach: Implement refresh tokens or sliding session window

**Sensitive Data in Console Logs:**
- Issue: Admin actions logged to console with email addresses and admin email visible
- Files: `server/routes/admin.ts` (lines 85, 124, 153)
- Impact: Logs may expose sensitive information if not properly secured; could leak to monitoring systems
- Fix approach: Log only necessary audit info; hash or redact email addresses in logs; implement proper audit trail

**Client-Side Session Storage:**
- Issue: Session token and user data stored in localStorage without encryption
- Files: `client/src/lib/auth.ts` (lines 2-3, 20-35)
- Impact: XSS attacks can steal session tokens; no protection from compromised browser storage
- Fix approach: Use httpOnly cookies for session tokens; validate token server-side on each request

**Circle Auth Fallback Accepts Malformed Data:**
- Issue: Fallback auth parsing directly uses user-provided fields without full validation
- Files: `client/src/hooks/use-circle-auth.ts` (lines 204-210)
- Impact: Invalid or malicious Circle.so data may be accepted if it has email field; could bypass validation
- Fix approach: Require full schema validation for fallback case; don't accept partial objects

## Performance Bottlenecks

**In-Memory Array Iteration for User Lookups:**
- Issue: User lookups iterate entire array instead of using map keys
- Files: `server/storage.ts` (lines 96-98, 102-104)
- Impact: O(n) lookup time; scales poorly with user count even though users are stored in Map
- Fix approach: Use email/publicUid as Map keys directly; avoid converting to array

**Validation Cache Stored in Single Map:**
- Issue: All validation tokens in single in-memory map with cleanup on 60-second interval
- Files: `server/routes/auth.ts` (lines 23, 26-33)
- Impact: Linear scan on cleanup; potential memory leak if cleanup is missed
- Fix approach: Use TTL-based cache or database-backed session store

**No Database Query Optimization:**
- Issue: Database queries have no indexes or batch operations defined
- Files: `server/storage.ts` (DbStorage class)
- Impact: Slow lookups for email-based queries if database has many users
- Fix approach: Define database indexes on `email`, `publicUid`, `userId` fields in schema

**Support Ticket Sorting Done in Memory:**
- Issue: Tickets sorted in memory after database fetch
- Files: `server/storage.ts` (line 294)
- Impact: All tickets fetched from database then sorted; should sort in query
- Fix approach: Add ORDER BY to database query

## Known Bugs

**Login Attempt IP Address May Be Null:**
- Issue: `req.ip` can be undefined depending on proxy configuration
- Files: `server/routes/auth.ts` (lines 93, 224, 294, 360, 386, 426, 449)
- Impact: Login attempts recorded with null IP address, defeating rate limiting based on IP
- Fix approach: Ensure `trust proxy` is configured correctly; validate req.ip before logging

**Support Ticket Email Reply Uses Wrong Sender:**
- Issue: Email sender name differs between notification and reply
- Files: `server/routes/support.ts` (lines 28, 130)
- Impact: User sees inconsistent sender ("Duo Connecte" vs "Avancer Simplement")
- Fix approach: Standardize sender name; use same value in both places

**Missing Branding Variables:**
- Issue: Email templates reference hardcoded brand names not sourced from config
- Files: `server/routes/support.ts` (lines 28, 152, 197)
- Impact: Cannot rebrand without code changes; email content hardcoded to French
- Fix approach: Move branding to AppConfig; implement i18n for email templates

## Fragile Areas

**Validation Cache Token Dependency:**
- Files: `server/routes/auth.ts` (entire file)
- Why fragile: Auth flow depends on in-memory cache that's not persistent; single point of failure; no fallback if cache is lost
- Safe modification: Test reboot scenarios; add integration tests for auth flow; monitor cache size
- Test coverage: No tests visible in codebase for auth flow; validation cache not tested

**Circle.so Data Validation:**
- Files: `client/src/hooks/use-circle-auth.ts` (lines 164-220)
- Why fragile: Multiple fallback mechanisms to extract email if schema validation fails; lenient origin checking; accepts partial objects
- Safe modification: Add integration tests with actual Circle.so data; validate all Circle.so changes; document assumptions about Circle.so API
- Test coverage: No visible tests for Circle.so integration; fallback logic not covered

**Admin Role Check Flow:**
- Files: `server/middleware.ts` (lines 135-160), `server/routes/auth.ts` (lines 86)
- Why fragile: Admin status determined from both client-provided data and database; unclear which takes precedence
- Safe modification: Add tests for privilege escalation; audit all admin role assignments; document trust boundaries
- Test coverage: No visible tests for admin authorization; role assignment logic not covered

**Payment/Paywall Enforcement:**
- Files: `server/routes/auth.ts` (lines 155-163, 250-259, 343-353)
- Why fragile: Paywall check repeated in three places; inconsistent error responses; no refactoring for DRY
- Safe modification: Extract paywall check to shared middleware; add tests for paywall bypass prevention
- Test coverage: Paywall enforcement not tested; no integration tests for payment flow

## Test Coverage Gaps

**Auth Flow Not Tested:**
- What's not tested: Validation, PIN creation, PIN validation, session token generation
- Files: `server/routes/auth.ts`
- Risk: Regressions in critical auth path go undetected; security bugs in validation flow
- Priority: High

**Admin Operations Not Tested:**
- What's not tested: Admin login, admin role enforcement, user deletion, PIN reset
- Files: `server/routes/admin.ts`, `server/middleware.ts`
- Risk: Privilege escalation bugs undetected; admin functions break silently
- Priority: High

**Circle.so Integration Not Tested:**
- What's not tested: Circle user data validation, cache behavior, fallback parsing, theme setting
- Files: `client/src/hooks/use-circle-auth.ts`
- Risk: Integration breaks on Circle.so API changes; fallback logic may fail silently
- Priority: High

**Email/Webhook Integration Not Tested:**
- What's not tested: Webhook signature validation, payment webhook processing, email sending
- Files: `server/routes/webhooks.ts`, `server/routes/support.ts`
- Risk: Payment processing breaks; webhooks not validated; email sending fails silently
- Priority: Medium

**Database Storage Not Tested:**
- What's not tested: Database operations, connection handling, transaction safety
- Files: `server/storage.ts` (DbStorage class)
- Risk: Data corruption, race conditions, connection leaks in production
- Priority: High

**CORS and Security Middleware Not Tested:**
- What's not tested: CORS origin validation, CSP headers, frame options, rate limiting
- Files: `server/app.ts`, `server/middleware.ts`
- Risk: Security controls fail; CORS bypass possible; rate limiting doesn't work
- Priority: High

## Missing Critical Features

**No Test Suite:**
- Problem: Zero visible test files in repository
- Blocks: Cannot safely refactor; security bugs go undetected; regressions unnoticed
- Impact: High risk for production code

**No Error Recovery/Fallback:**
- Problem: Database connection failure, webhook failures, email failures are not gracefully handled
- Files: `server/index-prod.ts`, `server/routes/webhooks.ts`
- Impact: Cascading failures; no graceful degradation

**No Audit Trail:**
- Problem: Admin actions logged to console only; no persistent audit log
- Files: `server/routes/admin.ts`, `server/routes/auth.ts`
- Impact: Cannot investigate security incidents; compliance violations

**No Monitoring/Observability:**
- Problem: No error tracking (Sentry), no APM, no structured logging
- Impact: Production issues detected only by users; no performance visibility

**No Secrets Management:**
- Problem: Secrets configured via .env files
- Files: `.env`, `server/routes/webhooks.ts`
- Impact: Secrets at risk; no key rotation; no audit trail for secret access

**No Request Validation Middleware:**
- Problem: Each endpoint manually validates input; inconsistent error handling
- Impact: Inconsistent validation behavior; possible bypasses

## Dependencies at Risk

**jsonwebtoken Without Key Rotation:**
- Risk: No mechanism to rotate or revoke tokens
- Impact: Compromised token secret affects all existing tokens
- Migration plan: Implement key rotation with dual-validation; use refresh tokens with short expiry

**bcrypt Hash Cost Fixed:**
- Risk: BCRYPT_ROUNDS hard-coded; if compromised, all passwords equally vulnerable
- Impact: Old hashes become weak if ROUNDS increased
- Migration plan: Implement password re-hashing on login

**Neon Serverless PostgreSQL:**
- Risk: Connection pool exhaustion possible; no connection limiting
- Impact: Database connection limits reached under load
- Migration plan: Implement connection pooling; use PgBouncer

**memorystore for Session Storage:**
- Risk: Sessions lost on server restart; no persistence
- Impact: All users logged out on deployment
- Migration plan: Switch to Redis or database-backed sessions

---

*Concerns audit: 2026-01-31*
