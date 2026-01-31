# Phase 1: Cleanup - Research

**Researched:** 2026-01-31
**Domain:** React/TypeScript codebase refactoring and code removal
**Confidence:** HIGH

## Summary

This phase involves removing Duo-Connecte specific code from a React/TypeScript application to create a reusable template. The codebase uses Vite, wouter for routing, React Query for data fetching, and Tailwind CSS for styling.

The cleanup is straightforward: delete 42 Duo-specific page files, remove their imports and route definitions from App.tsx, simplify SessionContext to remove participant logic, update branding strings across multiple files, and clean the shared schema. TypeScript strict mode ensures broken imports will be caught at build time.

**Primary recommendation:** Execute file deletions first, then run `npm run check` to identify all broken imports systematically, then fix imports and routes, then update branding strings.

## Standard Stack

This phase doesn't introduce new libraries - it removes code from existing stack.

### Core (Already in Use)
| Library | Version | Purpose | Relevance to Cleanup |
|---------|---------|---------|---------------------|
| TypeScript | 5.6.3 | Type checking | Will catch broken imports after deletions |
| wouter | 3.3.5 | Routing | Routes need cleanup in App.tsx |
| React | 18.3.1 | UI Framework | Components will be removed |
| Vite | 5.4.20 | Build tool | Will verify clean build |

### Verification Tools
| Tool | Command | Purpose |
|------|---------|---------|
| TypeScript | `npm run check` | Catch type errors, broken imports |
| Vite build | `npm run build` | Verify production build succeeds |

**No installation required** - all tools already present.

## Architecture Patterns

### Current Structure (Before Cleanup)
```
client/src/
├── pages/
│   ├── Duo*.tsx           # 42 files TO REMOVE
│   ├── Welcome.tsx        # TO KEEP (but update branding)
│   ├── PaywallScreen.tsx  # TO KEEP
│   ├── SupportPage.tsx    # TO KEEP (but update branding)
│   ├── admin-login.tsx    # TO KEEP
│   ├── dashboard.tsx      # TO KEEP
│   ├── auth.tsx           # TO KEEP
│   └── not-found.tsx      # TO KEEP
├── contexts/
│   └── SessionContext.tsx # TO MODIFY (remove participant logic)
├── components/
│   ├── AdminPreviewSidebar.tsx  # TO MODIFY (remove Duo references)
│   └── GlobalHeader.tsx   # TO MODIFY (update branding)
└── App.tsx                # TO MODIFY (remove Duo routes)

shared/
└── schema.ts              # TO MODIFY (remove duoFlow, participant fields)

client/
├── index.html             # TO MODIFY (update title, meta)
└── public/
    └── manifest.json      # TO MODIFY (update app name)
```

### Target Structure (After Cleanup)
```
client/src/
├── pages/
│   ├── Welcome.tsx        # Renamed/rebranded as template landing
│   ├── PaywallScreen.tsx  # Generic paywall
│   ├── SupportPage.tsx    # Generic support
│   ├── admin-login.tsx    # Admin login
│   ├── dashboard.tsx      # Admin dashboard
│   ├── auth.tsx           # Auth page
│   └── not-found.tsx      # 404 page
├── contexts/
│   └── SessionContext.tsx # Simplified (no senderName/receiverName)
├── components/
│   ├── AdminPreviewSidebar.tsx  # Simplified (no Duo nav)
│   └── GlobalHeader.tsx   # Generic branding
└── App.tsx                # Clean routes (admin, auth, support only)

shared/
└── schema.ts              # Clean schema (no duoFlow)
```

### Pattern: Safe Deletion Order

**What:** Delete files in dependency order to minimize cascading errors
**When to use:** When removing multiple interconnected files
**Order:**
1. Delete leaf files first (Duo page components)
2. Run TypeScript check to identify broken imports
3. Fix imports in parent files (App.tsx)
4. Clean up shared schema
5. Final build verification

### Anti-Patterns to Avoid
- **Shotgun deletion:** Don't delete and fix randomly - use TypeScript errors as guide
- **Partial cleanup:** Don't leave orphan imports or commented code
- **Forgetting string literals:** Search for "Duo" and "duo-connecte" strings, not just imports

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Finding broken imports | Manual search | `npm run check` (TypeScript) | TypeScript strict mode catches all |
| Finding string references | Manual grep | Grep for patterns | Comprehensive coverage |
| Verifying clean build | Manual testing | `npm run build` | Catches runtime issues |

**Key insight:** TypeScript strict mode is the primary verification tool. Delete files, run check, fix errors systematically.

## Common Pitfalls

### Pitfall 1: Orphan Imports in App.tsx
**What goes wrong:** Delete page files but leave import statements
**Why it happens:** App.tsx has 40+ imports, easy to miss some
**How to avoid:** Run `npm run check` after deletion - TypeScript will flag all broken imports
**Warning signs:** Build fails with "Cannot find module" errors

### Pitfall 2: Leftover Route Definitions
**What goes wrong:** Routes reference removed components
**Why it happens:** Routes are JSX, not direct imports - less obvious
**How to avoid:** Search for `/duo` paths in App.tsx and remove all related Route components
**Warning signs:** Runtime errors about undefined components

### Pitfall 3: Schema References to Removed Types
**What goes wrong:** `shared/schema.ts` exports duoFlow, SessionState has participant fields
**Why it happens:** Schema is used by both client and server
**How to avoid:** Clean schema AFTER fixing App.tsx - check for usage first
**Warning signs:** TypeScript errors mentioning duoFlow or senderName

### Pitfall 4: Hardcoded Branding Strings
**What goes wrong:** "Duo-Connecte" appears in UI after cleanup
**Why it happens:** Strings are in multiple files, not all obvious
**How to avoid:** Use grep search for all variations: "Duo-Connecte", "duo-connecte", "Duo Connecte"
**Warning signs:** Manual testing shows old branding

### Pitfall 5: localStorage Keys
**What goes wrong:** Old localStorage keys remain, cause confusion
**Why it happens:** Keys like 'duo-connecte-names' are string literals
**How to avoid:** Search for localStorage usage, update key names
**Warning signs:** Console errors or stale data behavior

### Pitfall 6: AdminPreviewSidebar References
**What goes wrong:** Admin sidebar still references Duo pages
**Why it happens:** Sidebar imports duoFlow from schema
**How to avoid:** Simplify sidebar to only show admin/support pages
**Warning signs:** Sidebar shows dead links or errors

## Code Examples

### Removing Imports (App.tsx)

Before:
```typescript
// Import Duo flow pages
import DuoRoles from '@/pages/DuoRoles';
import DuoPresentation from '@/pages/DuoPresentation';
// ... 40 more imports
```

After:
```typescript
// Template Pages
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import Welcome from '@/pages/Welcome';
import PaywallScreen from '@/pages/PaywallScreen';
import SupportPage from '@/pages/SupportPage';
```

### Simplifying Routes (App.tsx)

Before:
```tsx
<Switch>
  <Route path="/" component={AuthPage} />
  <Route path="/welcome" component={Welcome} />
  <Route path="/admin-login" component={AdminLogin} />
  <Route path="/admin" component={Dashboard} />
  <Route path="/support" component={SupportPage} />
  {/* Duo flow routes */}
  {duoFlow.pages.map((page, index) => (
    <Route key={`duo-${page.id}`} path={page.path}>
      {React.createElement(duoPageComponents[index] || NotFound)}
    </Route>
  ))}
  <Route component={NotFound} />
</Switch>
```

After:
```tsx
<Switch>
  <Route path="/" component={AuthPage} />
  <Route path="/welcome" component={Welcome} />
  <Route path="/admin-login" component={AdminLogin} />
  <Route path="/admin" component={Dashboard} />
  <Route path="/support" component={SupportPage} />
  <Route component={NotFound} />
</Switch>
```

### Simplifying SessionContext

Before:
```typescript
const defaultSession: SessionState = {
  senderName: '',
  receiverName: '',
  currentStep: 0,
  lastUpdated: new Date().toISOString(),
};
```

After:
```typescript
interface SessionState {
  currentStep: number;
  lastUpdated: string;
}

const defaultSession: SessionState = {
  currentStep: 0,
  lastUpdated: new Date().toISOString(),
};
```

### Updating Branding

Files to update with "Circle App Template":
```
client/index.html          - <title> and meta description
client/public/manifest.json - name and short_name
client/src/pages/Welcome.tsx - heading text
client/src/components/GlobalHeader.tsx - title/subtitle
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual file deletion | Delete + TypeScript check | Standard | TypeScript catches broken refs |
| grep for strings | grep with patterns | Standard | Comprehensive string search |

**Deprecated/outdated:**
- Nothing deprecated - standard refactoring techniques apply

## Files to Delete (Complete List)

42 files in `client/src/pages/`:
```
DuoCompletion.tsx
DuoFeedback.tsx
DuoIntention.tsx
DuoInversionPage10a.tsx
DuoInversionPage11a.tsx
DuoInversionPage12a.tsx
DuoInversionPage13a.tsx
DuoInversionPage14a.tsx
DuoInversionPage15a.tsx
DuoInversionPage16a.tsx
DuoInversionPage17a.tsx
DuoInversionPage18a.tsx
DuoInversionPage19a.tsx
DuoInversionPage20a.tsx
DuoInversionPage7a.tsx
DuoInversionPage8a.tsx
DuoInversionPage9a.tsx
DuoPresentation.tsx
DuoReceiverClosing.tsx
DuoReceiverConfirmation.tsx
DuoReceiverExperience.tsx
DuoReceiverGrounding.tsx
DuoReceiverResponse.tsx
DuoReceiverValidation.tsx
DuoRoles.tsx
DuoSenderClosing.tsx
DuoSenderConfirmation.tsx
DuoSenderExperience.tsx
DuoSenderGrounding.tsx
DuoSenderImpact.tsx
DuoSenderInterpretation.tsx
DuoSenderNeeds.tsx
DuoSenderSituation.tsx
DuoSenderSummary.tsx
DuoSenderValidation.tsx
DuoThanks.tsx
DuoTransition1.tsx
DuoTransition2.tsx
DuoTransition3.tsx
DuoWarnings.tsx
```

Also consider removing Demo pages (optional, based on requirements):
```
DemoLoadingScreen.tsx
DemoPaywallScreen.tsx
DemoPinCreation.tsx
DemoPinLogin.tsx
BlockShowcase.tsx
```

## Files to Modify (Complete List)

| File | What to Change |
|------|----------------|
| `client/src/App.tsx` | Remove Duo imports, routes, duoPageComponents array |
| `client/src/contexts/SessionContext.tsx` | Remove senderName/receiverName, simplify state |
| `client/src/components/GlobalHeader.tsx` | Update branding strings |
| `client/src/components/AdminPreviewSidebar.tsx` | Remove Duo navigation sections |
| `client/src/pages/Welcome.tsx` | Update branding |
| `client/src/pages/SupportPage.tsx` | Update FAQ content |
| `client/src/components/admin/AdminFeedbacks.tsx` | Update export filename |
| `client/index.html` | Update title, description |
| `client/public/manifest.json` | Update app name |
| `shared/schema.ts` | Remove duoFlow, sessionStateSchema participant fields |
| `server/routes/support.ts` | Update email template branding |

## Branding Strings to Replace

| Original | Replacement |
|----------|-------------|
| "Duo Connecte" | "Circle App Template" |
| "Duo-Connecte" | "Circle App Template" |
| "duo-connecte" | "circle-app-template" |
| "Application duo-connecte" | "Circle App Template" |
| "Jumelage" | "Circle App Template" |

## Open Questions

None - the cleanup requirements are clear and the codebase is well-understood.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of `/home/yan/projets/template-app-circle`
- TypeScript configuration in `tsconfig.json`
- Package.json scripts for verification commands

### Secondary (MEDIUM confidence)
- None needed - this is internal codebase refactoring

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- File list to delete: HIGH - direct filesystem inspection
- Files to modify: HIGH - grep and code analysis
- Branding strings: HIGH - comprehensive grep search
- Verification approach: HIGH - standard TypeScript/Vite tooling

**Research date:** 2026-01-31
**Valid until:** N/A - codebase-specific, not library-dependent
