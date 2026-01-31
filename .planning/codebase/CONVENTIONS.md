# Coding Conventions

**Analysis Date:** 2026-01-31

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `SessionContext.tsx`, `Checklist.tsx`)
- Pages/screens: PascalCase for page components (e.g., `DuoIntention.tsx`, `auth.tsx`)
- Hooks: kebab-case with `use-` prefix or camelCase (e.g., `use-circle-auth.ts`, `usePageTransition.ts`)
- Utilities/lib: camelCase (e.g., `queryClient.ts`, `auth.ts`, `utils.ts`)
- Routes: lowercase with paths as directories (e.g., `/routes/auth.ts`, `/routes/admin.ts`)
- Database/Schema: camelCase in code, snake_case in database (e.g., `publicUid` → `public_uid`)

**Functions:**
- camelCase for all function names: `generateSessionToken()`, `validateUserData()`, `handleContinue()`
- Async functions clearly marked: `async function getUserByEmail()`
- Factory functions: `createRequireAdmin()`, `createInsertSchema()`
- Validation functions: `validate*` prefix (e.g., `validateUserData()`, `validatePin()`)
- Event handlers: `handle*` prefix (e.g., `handleContinue()`, `handleMessage()`)

**Variables:**
- camelCase for all local variables and constants
- UPPER_SNAKE_CASE for constants only: `MAX_CACHE_AGE_MS`, `VALIDATION_EXPIRY_MS`, `CIRCLE_ORIGIN`, `BCRYPT_ROUNDS`
- Storage keys: UPPER_SNAKE_CASE (e.g., `CIRCLE_USER_STORAGE_KEY`)
- Private variables/functions: Optional leading underscore not used; rely on context
- State variables: descriptive camelCase (e.g., `cachedUser`, `messageReceived`, `retryCount`)

**Types/Interfaces:**
- PascalCase for all types and interfaces: `CircleAuthState`, `ValidationCache`, `JWTPayload`, `CircleUserData`
- Schema definitions: camelCase in Zod (e.g., `circleUserDataSchema`, `createPinSchema`)
- Suffix types with `Type` if needed: `SessionContextType`

## Code Style

**Formatting:**
- No ESLint or Prettier config detected - code appears to follow consistent style manually
- 2-space indentation used throughout
- Lines typically break at ~100-120 characters
- JSX opening brackets on same line: `<div className="...">`

**Linting:**
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)
- ESLint/Prettier: Not detected - no configuration files present
- Type checking via `npm run check`: runs TypeScript compiler without emit

**Comments:**
- Inline comments use `//` (French and English)
- Section dividers: Simple `// [Description]` comments
- Debug comments: `console.log()` with prefixes like `[VALIDATE]`, `[ADMIN-LOGIN]`, `[PAYWALL CHECK]`
- No JSDoc/TSDoc comments observed - not required in this codebase

## Import Organization

**Order:**
1. Node.js built-ins: `import crypto from 'crypto'`
2. Framework/library imports: `import express from 'express'`, `import { createContext } from 'react'`
3. Third-party packages: `import { z } from 'zod'`, `import bcrypt from 'bcrypt'`
4. Local imports with aliases: `import { useSession } from '@/contexts/SessionContext'`, `import { validateUserData } from '../middleware'`
5. Type imports: `import type { JWTPayload } from '../middleware'`

**Path Aliases:**
- `@/*` → `./client/src/*` (client code)
- `@shared/*` → `./shared/*` (shared schemas and types)
- `@assets/*` → `./attached_assets/*` (static assets)
- Relative paths used within server directory

**Example import pattern:**
```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
```

## Error Handling

**Patterns:**
- Try-catch blocks wrap async operations: `try { ... } catch (error) { ... }`
- Silent failures common in utilities: `catch { return null }` for non-critical operations
- Graceful degradation: cached data used if fresh data fails
- Validation errors returned as structured responses with `error` and optional `details` fields
- Console error logging for debugging: `console.error('[CONTEXT] Message:', error)`
- HTTP status codes for API errors: 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

**Error response pattern:**
```typescript
return res.status(400).json({ error: 'Description message' });
return res.status(500).json({
  error: 'Erreur serveur',
  details: process.env.DEV_MODE === 'true' ? errorMessage : undefined
});
```

**Async error handling:**
```typescript
try {
  const result = await someAsyncOperation();
  // Process result
} catch (error) {
  console.error('Error context:', error);
  return res.status(500).json({ error: 'User-friendly message' });
}
```

## Logging

**Framework:** Console methods (`console.log`, `console.error`, `console.warn`)

**Patterns:**
- Structured logging with prefixes: `[VALIDATE]`, `[AUTH]`, `[PAYWALL CHECK]`, `[ADMIN-LOGIN]`
- Request/response logging in middleware: `${req.method} ${path} ${res.statusCode} in ${duration}ms`
- Error tracking: All errors logged before returning response
- Debug mode: Conditional details in responses when `DEV_MODE === 'true'`
- Timestamp logging: `new Date().toLocaleTimeString()` for formatted output

**Logging examples:**
```typescript
console.log('[VALIDATE] Received data:', JSON.stringify(data, null, 2));
console.log('[AUTH] Paywall block on create-pin for:', email);
log(`${formattedTime} [${source}] ${message}`);
```

## Function Design

**Size:** Functions typically 5-50 lines; longer functions decomposed
  - Route handlers: 30-100 lines when handling complex logic
  - Context/hook setup: 50-150 lines acceptable for setup and effects
  - Helper functions: 5-20 lines, single responsibility

**Parameters:**
- Named parameters preferred over positional: Use object destructuring for 2+ parameters
- Type annotations required for all parameters in TypeScript
- Optional parameters: Use `?` or provide defaults
- Middleware pattern: `(req: Request, res: Response, next: NextFunction) => void`

**Return Values:**
- Functions return typed values: No implicit `any`
- Promise types explicit: `Promise<User | null>`
- Union types for success/error: `{ valid: boolean, error?: string }`
- JSON responses structured: `{ success: true, data: ... }` or `{ error: '...' }`

## Module Design

**Exports:**
- Named exports preferred: `export function validateUserData() { ... }`
- Default exports for page components: `export default function HomePage() { ... }`
- Type exports: `export type User = typeof users.$inferSelect`
- Interface exports: `export interface CircleAuthState { ... }`

**Context/Provider pattern:**
- Context created separately: `const SessionContext = createContext<...>(undefined)`
- Provider component wraps context setup
- Custom hook provides access: `export function useSession() { ... }`
- Error on missing provider: `throw new Error('... must be used within ...')`

**File organization:**
- One main export per file
- Helper functions (prefixed with non-export) in same file
- Interfaces/types at top of file
- Configuration constants after imports

## Data Validation

**Zod schema pattern:**
```typescript
export const createPinSchema = z.object({
  email: z.string().email('Email invalide'),
  pin: z.string().regex(/^\d{4,6}$/, 'Le NIP doit contenir 4 à 6 chiffres'),
});

export type CreatePin = z.infer<typeof createPinSchema>;
```

**Validation function pattern:**
```typescript
export function validateUserData(data: CircleUserData): ValidationResult {
  if (!data.email) {
    return { valid: false, error: 'Email required' };
  }
  return { valid: true };
}
```

## Async/Await

- Always used over `.then()` chains
- Try-catch blocks wrap await calls
- Error types checked: `error instanceof Error`
- Conditional awaits in useEffect for setup: `if (configLoading) return`

---

*Convention analysis: 2026-01-31*
