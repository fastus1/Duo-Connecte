# Coding Conventions

**Analysis Date:** 2026-01-30

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `Checklist.tsx`, `SessionContext.tsx`, `DuoSenderSummary.tsx`)
- Hooks: kebab-case with "use-" prefix (e.g., `use-circle-auth.ts`, `use-mobile.tsx`, `use-toast.ts`)
- Utilities/helpers: camelCase (e.g., `queryClient.ts`, `utils.ts`, `auth.ts`)
- API route files: camelCase (e.g., `auth.ts`, `admin.ts`, `support.ts`)
- UI components: PascalCase (e.g., `Button`, `Input`, `Checkbox`)
- Context files: PascalCase (e.g., `SessionContext.tsx`, `AccessContext.tsx`)
- Pages: PascalCase (e.g., `DuoSenderSummary.tsx`, `PaywallScreen.tsx`, `Welcome.tsx`)

**Functions:**
- Regular functions: camelCase (e.g., `getParentOrigin()`, `isValidCircleOrigin()`, `getCachedUserData()`)
- Helper functions in utils: camelCase (e.g., `cn()` for classname utility)
- Handler functions: camelCase with "handle" prefix (e.g., `handleContinue()`, `handleMessage()`)
- Factory functions: create + camelCase (e.g., `createRequireAdmin()`, `createInsertSchema()`)
- Callback/event handlers: camelCase with "on" prefix (e.g., `onCheckedChange`, `onChange`)

**Variables:**
- Constants: UPPER_SNAKE_CASE (e.g., `CIRCLE_ORIGIN`, `MAX_CACHE_AGE_MS`, `SESSION_SECRET`)
- Regular variables: camelCase (e.g., `parentOrigin`, `messageReceived`, `validationToken`)
- State variables: camelCase (e.g., `session`, `userData`, `isLoading`, `error`)
- Boolean flags: camelCase prefixed with "is", "has", "should", "can" (e.g., `isLoading`, `hasCircleData`, `shouldShow`)

**Types:**
- Interface names: PascalCase (e.g., `CircleAuthState`, `AppConfig`, `ValidationResult`)
- Type aliases: PascalCase (e.g., `SessionState`, `CircleUserData`)
- Zod schemas: camelCase with "Schema" suffix (e.g., `circleUserDataSchema`, `insertUserSchema`, `validatePinSchema`)
- Union types: PascalCase (e.g., `AccessStatus = 'loading' | 'granted' | 'denied' | 'origin_invalid'`)

## Code Style

**Formatting:**
- No explicit formatter configuration found (ESLint/Prettier not configured)
- Uses TypeScript strict mode: `"strict": true` in `tsconfig.json`
- Import organization follows ES modules with explicit paths
- Path aliases in use: `@/*` for client source, `@shared/*` for shared code

**Linting:**
- TypeScript type checking via `npm run check` (tsc)
- ESLint/Prettier: Not detected in project
- Type safety enforced at compile time (TypeScript strict mode)
- No pre-commit hooks configured

## Import Organization

**Order:**
1. External dependencies (react, express, etc.)
2. Type imports and interfaces
3. Shared code imports (`@shared/*`)
4. Local imports from project (`@/*` or relative paths)
5. Side effects (CSS imports)

**Examples from codebase:**
```typescript
// App.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { duoFlow, getFlow } from '@shared/schema';

// use-circle-auth.ts
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
import { setThemeFromCircle } from '@/components/theme-provider';
```

**Path Aliases:**
- `@/*`: Maps to `client/src/*` - use for all client-side code
- `@shared/*`: Maps to `shared/*` - use for shared types and schemas
- `@assets`: Maps to `attached_assets/*` - use for static assets

## Error Handling

**Patterns:**
- Try-catch blocks with console logging for debugging
- Graceful degradation: "Silent fail" comments where errors are acceptable
- Validation results returned as objects with `{valid: boolean, error?: string}`
- HTTP error responses: status codes with error message in JSON (e.g., `res.status(400).json({ error: 'message' })`)
- Type guards for error checking: `error instanceof Error ? error.message : 'Unknown error'`

**Examples:**
```typescript
// Cache operations - silent fail
function getCachedUserData(): CircleUserData['user'] | null {
  try {
    const timestamp = localStorage.getItem(CIRCLE_USER_TIMESTAMP_KEY);
    const data = localStorage.getItem(CIRCLE_USER_STORAGE_KEY);
    if (!timestamp || !data) return null;
    return JSON.parse(data);
  } catch {
    return null; // Silent fail - cache not critical
  }
}

// API error handling
try {
  const validatedFeedback = insertFeedbackSchema.parse(req.body);
  const feedback = await storage.createFeedback(validatedFeedback);
  res.json(feedback);
} catch (error: any) {
  res.status(400).json({ error: error.message });
}

// Type-safe error extraction
const errorMessage = error instanceof Error ? error.message : 'Unknown error';
return res.status(500).json({ error: errorMessage });
```

## Logging

**Framework:** Console API (console.log, console.error)

**Patterns:**
- Prefixed logs with brackets for context: `[VALIDATE]`, `[Circle Auth]`, `[express]`
- Formatted timestamps for server logs
- Structured logging with `log()` utility function in `server/app.ts`
- Debug logging for authentication flows
- No production logging framework (Sentry, DataDog, etc.) detected

**Examples:**
```typescript
// Server logging
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {...});
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Client validation logging
console.log('[VALIDATE] Received data:', JSON.stringify(data, null, 2));
console.log('[VALIDATE] Email missing or empty:', data.email);
console.warn('[Circle Auth] Liquid template not replaced:', rawEmail);
```

## Comments

**When to Comment:**
- Complex validation logic (email format checks, timestamp validation)
- Non-obvious workarounds or browser compatibility issues
- Security considerations (CORS configuration, token validation)
- Configuration options and their purpose
- Business logic that isn't immediately obvious from code

**JSDoc/TSDoc:**
- Minimal JSDoc usage observed
- Inline comments preferred for clarity
- Type annotations provide most documentation via TypeScript

**Examples:**
```typescript
// Security: Be permissive with origin validation - accept if it looks like Circle data
const hasCircleData = event.data && event.data.type === 'CIRCLE_USER_AUTH';

// Caching strategy explanation
// Still request fresh data in background
requestAuthFromParent();

// Configuration purpose
// In development, be more permissive
if (import.meta.env.DEV) {
  return true;
}
```

## Function Design

**Size:**
- Keep functions focused on single responsibility
- Average function size: 20-80 lines
- Complex functions factored into helpers (e.g., `getParentOrigin()`, `isValidCircleOrigin()`)

**Parameters:**
- Single parameter object for multiple arguments: `({ children, isAdmin }: { children: React.ReactNode; isAdmin: boolean })`
- Type all parameters explicitly
- Use optional parameters with defaults sparingly

**Return Values:**
- Explicit return types on all functions
- Async functions return Promise types
- Validation functions return result objects: `{valid: boolean, error?: string}`
- Null/undefined acceptable for optional values (explicitly typed)

**Examples:**
```typescript
// Single responsibility with typed parameters
function isValidCircleOrigin(origin: string): boolean {
  if (!origin) return false;
  const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
  // Validation logic...
  return false;
}

// Result object pattern
export function validateUserData(data: CircleUserData): ValidationResult {
  if (!data.email) {
    return { valid: false, error: 'Email non reçu de Circle.so...' };
  }
  return { valid: true };
}

// Component with object destructuring
function AccessGate({ children, isAdmin }: { children: React.ReactNode; isAdmin: boolean }) {
  // Component logic...
}
```

## Module Design

**Exports:**
- Named exports preferred for functions and types
- Default export for React components and page components
- Explicit export statements (no wildcard exports observed in core modules)

**Barrel Files:**
- Not used extensively
- Each component/hook in separate file
- Index files used in route directories (e.g., `server/routes/index.ts`)

**Examples:**
```typescript
// Named exports for utilities
export function cn(...inputs: ClassValue[]) { ... }
export function clearCircleUserCache(): void { ... }
export function useCircleAuth() { ... }

// Default export for components
export default function SenderSummary() { ... }
export default App;

// Index file for modular routes
import { registerModularRoutes } from "./routes/index";
```

## React Patterns

**Hooks:**
- Use React hooks for state management (useState, useContext, useEffect)
- Custom hooks with "use" prefix
- React Query for server state (`useQuery`, `QueryClientProvider`)
- Context API for shared state (SessionContext, AccessContext)

**Components:**
- Functional components only
- Props interface with explicit types
- Fragment shorthand `<>...</>` for wrapping
- CSS classes via `cn()` utility for Tailwind merging

**State Management:**
- Local state for UI state (modals, transitions)
- Context for app-wide state (session, access control)
- localStorage for persistence (names, auth tokens, cache)
- React Query for server data

## TypeScript

**Type Safety:**
- Strict mode enabled: `"strict": true`
- Explicit types on all function parameters
- Explicit return types on functions
- Type aliases for complex types
- Zod schemas for runtime validation of external data

**Generic Usage:**
```typescript
// Custom generic in useQuery
const { data: configData, isLoading: configLoading } = useQuery<AppConfig>({
  queryKey: ['/api/config'],
});
```

---

*Convention analysis: 2026-01-30*
