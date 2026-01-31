# Extension Guide

How to extend the Circle App Template with new features.

## Adding a New Page

### Step 1: Create the Page Component

Create a new file in `client/src/pages/`:

```tsx
// client/src/pages/MyFeature.tsx
export default function MyFeature() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Feature</h1>
      <p>Your content here.</p>
    </div>
  );
}
```

### Step 2: Add the Route

In `client/src/App.tsx`, import your component and add a route:

```tsx
import MyFeature from "@/pages/MyFeature";

// Inside SessionRouter's Switch component:
<Route path="/my-feature" component={MyFeature} />
```

### Step 3: Protected vs Public

By default, all routes require authentication. To make a page public:

1. Open `client/src/components/AccessGate.tsx`
2. Find the public paths array
3. Add your path: `'/my-feature'`

## Adding an API Route

### Step 1: Create the Route File

Create a new file in `server/routes/`:

```typescript
// server/routes/myfeature.ts
import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

// GET /api/myfeature/items - Get all items
router.get('/items', requireAuth, async (req: Request, res: Response) => {
  try {
    // Your logic here - use storage for DB access
    const items = []; // Replace with actual query
    return res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/myfeature/items - Create an item
router.post('/items', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }
    // Create item in database
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

### Step 2: Register the Route

In `server/routes/index.ts`, import and register:

```typescript
import myfeatureRouter from "./myfeature";

export function registerModularRoutes(app: Express): void {
  // ... existing routes
  app.use('/api/myfeature', myfeatureRouter);
}
```

## Adding a Database Table

### Step 1: Define the Schema

In `shared/schema.ts`, add your table:

```typescript
export const myItems = pgTable("my_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMyItemSchema = createInsertSchema(myItems).omit({
  id: true,
  createdAt: true,
});

export type InsertMyItem = z.infer<typeof insertMyItemSchema>;
export type MyItem = typeof myItems.$inferSelect;
```

### Step 2: Push the Schema

Run the migration:

```bash
npm run db:push
```

### Step 3: Add Storage Methods

In `server/storage.ts`, add methods to the IStorage interface and DatabaseStorage class:

```typescript
// In IStorage interface:
getMyItems(userId: string): Promise<MyItem[]>;
createMyItem(item: InsertMyItem): Promise<MyItem>;

// In DatabaseStorage class:
async getMyItems(userId: string): Promise<MyItem[]> {
  return await this.db.select().from(myItems).where(eq(myItems.userId, userId));
}

async createMyItem(item: InsertMyItem): Promise<MyItem> {
  const [result] = await this.db.insert(myItems).values(item).returning();
  return result;
}
```

## Common Patterns

### Using the Storage Layer

Always use the storage interface for database operations:

```typescript
import { storage } from "../storage";

// Get user
const user = await storage.getUser(userId);

// Create record
await storage.createSomething(data);
```

### Authentication Middleware

Use `requireAuth` for protected routes:

```typescript
import { requireAuth, requireAdmin } from "../middleware";

router.get('/protected', requireAuth, handler);      // Any logged-in user
router.get('/admin-only', requireAdmin, handler);    // Admin users only
```

### Error Handling

Follow the existing pattern:

```typescript
try {
  // Your logic
  return res.json({ data });
} catch (error) {
  console.error('Context:', error);
  return res.status(500).json({ error: 'User-friendly message' });
}
```

### React Query for Data Fetching

Use TanStack Query for API calls:

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/myfeature/items'],
  queryFn: () => fetch('/api/myfeature/items').then(r => r.json()),
});

// Mutating data
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (newItem) => fetch('/api/myfeature/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/myfeature/items'] });
  },
});
```

## Project Structure Reference

```
client/src/
├── pages/           # Page components (add new pages here)
├── components/      # Reusable UI components
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts (auth, session)
├── hooks/           # Custom hooks
└── lib/             # Utilities (apiRequest, utils)

server/
├── routes/          # API routes (add new routes here)
│   └── index.ts     # Route registration
├── middleware.ts    # Auth middleware (requireAuth, requireAdmin)
└── storage.ts       # Database access layer (IStorage interface)

shared/
└── schema.ts        # Database schema + Zod validation (add tables here)
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Routes + providers - add new routes here |
| `client/src/components/AccessGate.tsx` | Auth protection - configure public paths |
| `server/routes/index.ts` | API route registration |
| `server/storage.ts` | Database access layer |
| `server/middleware.ts` | Auth middleware definitions |
| `shared/schema.ts` | Database schema + types |

## Further Reading

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Detailed architecture documentation (French)
- [Drizzle ORM Docs](https://orm.drizzle.team/) - Database ORM reference
- [wouter](https://github.com/molefrog/wouter) - React router used
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching library
- [shadcn/ui](https://ui.shadcn.com/) - UI component reference
