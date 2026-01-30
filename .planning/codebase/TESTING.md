# Testing Patterns

**Analysis Date:** 2026-01-30

## Test Framework

**Status:** No testing framework detected

- No Jest, Vitest, or other test runner configured
- No test files (*.test.ts, *.spec.ts) found in codebase
- No `jest.config.js`, `vitest.config.ts`, or similar configuration
- Package.json excludes `**/*.test.ts` from TypeScript compilation
- No test dependencies in package.json

**Implications:**
- Testing is not currently part of the development workflow
- All testing must be manual or external (E2E/integration testing only)
- No unit test examples to reference in codebase

## Run Commands

**Currently available:**
```bash
npm run dev              # Run development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run check            # Run TypeScript type checking
npm run db:push          # Push database schema changes (Drizzle)
```

**No test commands available.**

## Test File Organization

**Opportunity:**
When testing is implemented, follow these patterns:

**Recommended Location:**
- Co-located with source files for unit tests
- Tests next to component: `components/Button.test.tsx` alongside `components/Button.tsx`
- Or separate `__tests__` directory at same level

**Naming Convention:**
- Suffix pattern: `.test.ts` or `.test.tsx` for unit tests
- Suffix pattern: `.integration.test.ts` for integration tests
- Suffix pattern: `.e2e.test.ts` for end-to-end tests (if E2E framework added)

**Directory Structure (recommended):**
```
client/src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── hooks/
│   ├── use-toast.ts
│   └── use-toast.test.ts
└── contexts/
    ├── SessionContext.tsx
    └── SessionContext.test.tsx

server/
├── middleware.ts
├── middleware.test.ts
├── routes/
│   ├── auth.ts
│   └── auth.test.ts
```

## Mocking Strategy

**Recommended Framework:**
- Vitest for unit tests (matches Vite build setup)
- Jest for server-side tests (Express compatibility)
- React Testing Library for component tests

**What to Mock:**

1. **External APIs:**
   - Circle.so authentication messages via `postMessage`
   - Fetch requests (use MSW - Mock Service Worker)
   - localStorage and sessionStorage

2. **Dependencies:**
   - React Query client (`useQuery`)
   - Context providers (`SessionContext`, `AccessContext`)
   - Express middleware and routes

3. **What NOT to Mock:**
   - Core React hooks (useState, useEffect, useContext)
   - Zod validation schemas
   - Business logic functions
   - Database schema definitions

**Patterns to implement:**

```typescript
// Mock postMessage for Circle Auth testing
const mockPostMessage = jest.fn();
Object.defineProperty(window, 'parent', {
  value: { postMessage: mockPostMessage },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock useQuery
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ data: null, isLoading: false })),
}));

// Mock fetch for API routes
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: 'ok' }),
  })
);
```

## Test Types

**Unit Tests:**
- **Scope:** Individual functions, utility helpers, validation logic
- **Examples to test:**
  - `utils.ts`: `cn()` classname utility
  - `auth.ts`: Session token generation and verification
  - Middleware validators: `validateUserData()`, `isValidCircleOrigin()`
  - Schema validation: Zod schema parsing

**Integration Tests:**
- **Scope:** Feature workflows, API route + storage layer, hooks with context
- **Examples to test:**
  - Complete auth flow: validate → create pin → verify pin → session token
  - Session persistence: name saving/loading in SessionContext
  - Access control: AccessGate with different user roles
  - API endpoints with database interaction

**E2E Tests:**
- **Framework:** Not currently present; consider Playwright or Cypress
- **Scope:** Complete user journeys through UI
- **Examples to test:**
  - User login flow: Circle auth → PIN creation → dashboard
  - Duo conversation flow: both participants through all steps
  - Admin preview mode: sidebar navigation, page transitions

## Test Structure Patterns

**Recommended setup (unit test example):**
```typescript
describe('useCircleAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should load cached user data on mount', () => {
    // Arrange
    const cachedUser = { email: 'test@example.com', name: 'Test User' };
    localStorage.setItem(CIRCLE_USER_STORAGE_KEY, JSON.stringify(cachedUser));

    // Act
    const { result } = renderHook(() => useCircleAuth());

    // Assert
    expect(result.current.userData).toEqual(cachedUser);
  });

  it('should request auth from parent when cache is empty', () => {
    // Arrange
    const mockPostMessage = jest.fn();

    // Act
    const { result } = renderHook(() => useCircleAuth());

    // Assert
    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'CIRCLE_AUTH_REQUEST' },
      expect.any(String)
    );
  });
});
```

**Test suite organization:**
```typescript
describe('SessionContext', () => {
  describe('loadSavedNames', () => {
    it('returns empty names when no localStorage data exists', () => { ... });
    it('returns parsed names from localStorage', () => { ... });
    it('handles corrupted JSON gracefully', () => { ... });
  });

  describe('SessionProvider', () => {
    it('provides default session state', () => { ... });
    it('updates session when updateSession is called', () => { ... });
    it('persists names to localStorage on change', () => { ... });
  });
});
```

## Async Testing Patterns

**React hooks with async operations:**
```typescript
it('should handle async validation', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCircleAuth());

  expect(result.current.isLoading).toBe(true);

  await waitForNextUpdate();

  expect(result.current.isLoading).toBe(false);
});
```

**API route testing:**
```typescript
it('should validate user and return token', async () => {
  const response = await request(app)
    .post('/api/auth/validate')
    .send({ user: mockUserData });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('validation_token');
  await waitFor(() => expect(response.body.status).toBe('new_user'));
});
```

## Error Testing

**Validation error patterns:**
```typescript
it('should reject invalid email', () => {
  const result = validateUserData({
    email: 'invalid-email',
    name: 'Test',
    publicUid: 'test-uid',
    timestamp: Date.now(),
  });

  expect(result.valid).toBe(false);
  expect(result.error).toContain('Email invalide');
});

it('should reject Liquid template variables', () => {
  const result = validateUserData({
    email: '{{member.email}}',
    name: 'Test',
    publicUid: 'test-uid',
    timestamp: Date.now(),
  });

  expect(result.valid).toBe(false);
  expect(result.error).toContain('Liquid template');
});
```

**API error handling:**
```typescript
it('should return 401 when auth header missing', async () => {
  const response = await request(app)
    .get('/api/admin/users')
    .set('Authorization', '');

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('error');
});

it('should handle database errors gracefully', async () => {
  jest.spyOn(storage, 'getUser').mockRejectedValue(new Error('DB error'));

  const response = await request(app)
    .post('/api/auth/validate')
    .send({ user: mockUserData });

  expect(response.status).toBe(500);
  expect(response.body.error).toContain('DB error');
});
```

## Fixtures and Factories

**Test data location (recommended):**
- `__tests__/fixtures/` for mock data
- `__tests__/factories/` for data builders

**Fixture examples to create:**

```typescript
// __tests__/fixtures/users.ts
export const mockCircleUser = {
  publicUid: 'circle_test123',
  email: 'test@example.com',
  name: 'Test User',
  isAdmin: false,
  timestamp: Date.now(),
};

export const mockAdminUser = {
  ...mockCircleUser,
  isAdmin: true,
};

// __tests__/factories/user.ts
export function createUser(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    email: `test${Date.now()}@example.com`,
    publicUid: `uid_${Date.now()}`,
    name: 'Test User',
    pinHash: null,
    isAdmin: false,
    createdAt: new Date(),
    lastLogin: null,
    ...overrides,
  };
}

export function createValidationToken() {
  return crypto.randomBytes(32).toString('hex');
}
```

**Usage in tests:**
```typescript
it('should create user from validation token', async () => {
  const user = createUser({ isAdmin: true });
  const token = createValidationToken();

  const response = await request(app)
    .post('/api/auth/pin/create')
    .send({ validation_token: token, ...user });

  expect(response.status).toBe(200);
});
```

## Coverage Goals

**Current Status:** Not enforced

**Recommended targets when framework added:**
- Core utilities: 90%+ coverage
- API routes: 85%+ coverage
- React components: 80%+ coverage
- Custom hooks: 85%+ coverage

**Excluded from coverage:**
- Type definitions
- Barrel exports
- Configuration files
- Demo/preview components

## Critical Areas to Test First

**High Priority (when implementing tests):**

1. **Authentication & Security:**
   - `server/middleware.ts`: Token generation, verification, PIN hashing
   - `server/routes/auth.ts`: User validation, session creation
   - All Bearer token verification

2. **Data Validation:**
   - `server/middleware.ts`: `validateUserData()` with all edge cases
   - Zod schemas in `shared/schema.ts`
   - Email format, Liquid template detection

3. **State Management:**
   - `client/src/contexts/SessionContext.tsx`: Name persistence
   - `client/src/contexts/AccessContext.tsx`: Access status transitions
   - `client/src/hooks/use-circle-auth.ts`: Cache management

4. **Database Operations:**
   - User CRUD operations
   - Login attempt tracking
   - Paid member queries

5. **Circle.so Integration:**
   - postMessage protocol handling
   - Origin validation
   - Cache expiry

---

*Testing analysis: 2026-01-30*
