# Testing Patterns

**Analysis Date:** 2026-01-31

## Test Framework

**Runner:**
- Not detected - No test framework configured
- No Jest, Vitest, or other test runner found
- No test scripts in `package.json`

**Assertion Library:**
- Not in use

**Run Commands:**
- Type checking only: `npm run check` (runs TypeScript compiler)
- No dedicated test command available

## Test File Organization

**Status:** No test files found in `/client/src/` or `/server/`
- Test files exist only in node_modules (dependency tests)
- No local test infrastructure established

**Recommendation if testing is added:**
- Unit tests: Co-located with source files (e.g., `Component.test.tsx` next to `Component.tsx`)
- Integration tests: Separate `/tests/integration/` directory
- Server tests: `/server/__tests__/` directory structure

## Code Testing Approaches (Inferred from Source)

**Manual testing indicators found:**
- Demo components exist: `DemoLoadingScreen.tsx`, `DemoPinCreation.tsx`, `DemoPinLogin.tsx`, `DemoPaywallScreen.tsx` in `/client/src/pages/`
- These appear to be manual test/showcase components
- Data-testid attributes present in components (e.g., `data-testid="checklist"` in `Checklist.tsx`)

## Testing-Friendly Code Patterns

**Composition over logic:**
```typescript
// In Checklist.tsx - simple, testable props interface
interface ChecklistProps {
  items: ChecklistItem[];
}

export function Checklist({ items }: ChecklistProps) {
  return (
    <div className="space-y-3" data-testid="checklist">
      {items.map((item) => (
        <div key={item.id}>
          <Checkbox
            id={item.id}
            checked={item.checked}
            onCheckedChange={item.onChange}
            data-testid={`checkbox-${item.id}`}
          />
        </div>
      ))}
    </div>
  );
}
```

**Isolated hooks:**
```typescript
// In use-circle-auth.ts - hook with clear input/output
export function useCircleAuth() {
  const { data: configData, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ['/api/config'],
  });

  const [state, setState] = useState<CircleAuthState>({ ... });

  // Hook returns typed state - easy to test in isolation
  return state;
}
```

**Validation functions (easily testable):**
```typescript
// In middleware.ts - pure validation function
export function validateUserData(data: CircleUserData): ValidationResult {
  if (!data.email) {
    return { valid: false, error: 'Email required' };
  }
  return { valid: true };
}
```

**Middleware as pure functions:**
```typescript
// Auth middleware pattern - dependency injection friendly
export function createRequireAdmin(storage: { getUser: (id: string) => Promise<...> }) {
  return async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // Middleware implementation
  };
}
```

## Mocking Patterns (if testing framework added)

**Expected mocking approach for this codebase:**

**React Query mocking:**
```typescript
// Mock useQuery for auth state tests
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: { requireCircleDomain: true },
    isLoading: false,
    error: null,
  })),
}));
```

**Storage mocking (localStorage):**
```typescript
// Mock localStorage for cache tests
const mockLocalStorage = {
  getItem: vi.fn((key: string) => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = mockLocalStorage as any;
```

**Database layer mocking (Server tests):**
```typescript
// Factory pattern already supports dependency injection
const mockStorage = {
  getUser: vi.fn(async (id: string) => ({ isAdmin: true })),
  getUserByEmail: vi.fn(async (email: string) => null),
  createUser: vi.fn(async (data) => ({ id: '123', ...data })),
};

const requireAdmin = createRequireAdmin(mockStorage);
```

**Express middleware testing:**
```typescript
// Mock req/res for middleware tests
const mockReq = {
  headers: { authorization: 'Bearer token' },
  ip: '127.0.0.1',
  method: 'POST',
} as any;

const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
} as any;

const mockNext = vi.fn();
```

## What NOT to Mock

**Real validation logic:**
- Zod schemas should run against actual data
- Email regex validation should execute for real
- PIN format validation (`/^\d{4,6}$/`) should validate real inputs

**Cryptography functions:**
- `bcrypt.hash()` and `bcrypt.compare()` - too slow, would need fixtures
- `jwt.sign()` and `jwt.verify()` - could mock, but token structure matters

**Database layer (for integration tests):**
- Use test database or in-memory fixtures
- Don't mock query results - test actual ORM behavior with Drizzle

## Fixtures and Test Data

**Current approach:** No fixtures system found

**If testing framework added, pattern would likely be:**

```typescript
// fixtures/users.ts
export const mockUsers = {
  adminUser: {
    id: 'user-123',
    email: 'admin@example.com',
    publicUid: 'admin_123',
    name: 'Admin User',
    isAdmin: true,
    pinHash: 'hashed_pin',
  },
  regularUser: {
    id: 'user-456',
    email: 'user@example.com',
    publicUid: 'user_456',
    name: 'Regular User',
    isAdmin: false,
    pinHash: 'hashed_pin',
  },
};

// fixtures/circleAuth.ts
export const mockCircleUserData = {
  type: 'CIRCLE_USER_AUTH' as const,
  user: {
    publicUid: 'circle_123',
    email: 'member@circle.so',
    name: 'Circle Member',
    isAdmin: false,
    timestamp: Date.now(),
  },
  theme: 'light' as const,
};
```

## Coverage

**Requirements:** None currently enforced

**If added, focus areas should be:**
- Validation functions (middleware.ts): High priority - security critical
- Auth routes: High priority - security critical
- Utility functions (cn(), validate*): Medium priority - widely used
- Components: Lower priority - mainly UI layout

**View Coverage (if configured):**
```bash
# If using vitest:
npm run test:coverage
# Opens coverage report in browser
```

## Proposed Test Structure

**Unit Tests (if framework added):**
```
client/src/
  hooks/__tests__/
    use-circle-auth.test.ts
    usePageTransition.test.ts
  lib/__tests__/
    utils.test.ts
    auth.test.ts
  components/__tests__/
    Checklist.test.tsx

server/__tests__/
  middleware.test.ts
  routes/
    auth.test.ts
    admin.test.ts
  storage.test.ts
```

**Integration test pattern:**
```typescript
// Example: Auth flow integration test
describe('Auth Flow', () => {
  it('should validate user and create session', async () => {
    // Setup: Mock storage with test data
    const storage = createMockStorage();

    // Execute: POST /api/auth/validate
    const response = await request(app)
      .post('/api/auth/validate')
      .send({ user: mockCircleUserData });

    // Assert: Check response and state
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('validation_token');
  });
});
```

## Current Testing State

**Strengths:**
- Code already structured for testability (pure functions, dependency injection)
- Components have data-testid attributes for future e2e testing
- Validation logic separated from routes (easy to unit test)
- Zod schemas can be tested directly

**Gaps:**
- No test framework installed
- No test infrastructure
- No test data/fixtures
- Routes mixed with business logic (would need extraction for unit testing)

**Recommendation for implementation:**
1. Add Vitest (faster, ESM-native, simpler than Jest)
2. Start with utility/validation function tests
3. Add middleware tests
4. Consider e2e tests with Playwright for auth flows

---

*Testing analysis: 2026-01-31*
