# Circle App Template

A ready-to-deploy infrastructure for building apps embedded in Circle.so communities. Provides authentication (Circle.so SSO + optional PIN), admin dashboard, support ticket system, and user management out of the box.

## Overview

Circle App Template is a full-stack web application designed to run as an iframe inside Circle.so communities. It handles authentication, access control, and common administrative features so you can focus on building your custom app logic. Extracted from a production application, all infrastructure code is battle-tested.

## Features

- **Circle.so SSO Integration** - Automatic authentication via postMessage from Circle.so iframe
- **Optional PIN Authentication** - Two-factor security layer with rate limiting
- **Paywall Support** - Restrict access to paid members only
- **Admin Dashboard** - Configure app settings, manage users, view analytics
- **Support Ticket System** - Built-in user support with status tracking
- **User Management** - View, search, and manage authenticated users
- **Session Management** - JWT-based sessions with configurable timeout

## Prerequisites

- **Node.js 18+** - Required for running the application
- **PostgreSQL Database** - Neon serverless recommended for easy setup
- **Circle.so Community** - With Custom Apps feature enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd circle-app-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Configuration](#configuration) below).

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will be running at `http://localhost:5000` (or your configured PORT).

## Configuration

All configuration is done through environment variables. Copy `.env.example` to `.env` and configure:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Yes | Secret key for session tokens (use a long random string) | `your_super_secret_jwt_key_here` |
| `VITE_CIRCLE_ORIGIN` | Yes | Your Circle.so community URL | `https://your-space.circle.so` |
| `VITE_DEV_MODE` | No | Bypass Circle.so auth for local development | `true` / `false` (default) |
| `SESSION_TIMEOUT` | No | Session duration in milliseconds | `3600000` (1 hour, default) |
| `PIN_ATTEMPTS_LIMIT` | No | Max PIN attempts before lockout | `5` (default) |
| `PIN_ATTEMPTS_WINDOW` | No | Rate limit window in milliseconds | `900000` (15 min, default) |
| `PORT` | No | Server port | `5000` (default) |
| `NODE_ENV` | No | Environment mode | `development` / `production` |

### Security Notes

- Generate a strong `JWT_SECRET` (minimum 32 characters recommended)
- Never commit `.env` to version control
- In production, ensure `VITE_DEV_MODE` is `false` or unset

## Usage

### Development

```bash
npm run dev
```

Starts the development server with hot module reloading. The app runs on the configured PORT (default 5000).

### Production Build

```bash
npm run build
npm start
```

Builds optimized frontend and starts the production server.

### Database Commands

```bash
npm run db:push    # Push schema changes to database
npm run check      # TypeScript type checking
```

## Project Structure

```
/
├── client/              # React frontend (Vite + TailwindCSS)
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (auth, session)
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
│   └── index.html
├── server/              # Express backend
│   ├── routes/          # API route modules
│   ├── middleware.ts    # Auth, rate limiting
│   └── storage.ts       # Database interface
├── shared/              # Shared code
│   └── schema.ts        # Drizzle schema + Zod validators
├── ARCHITECTURE.md      # Detailed architecture docs (French)
├── .env.example         # Environment template
└── drizzle.config.ts    # Database config
```

## Extending the Template

For detailed architecture information and extension patterns, see `ARCHITECTURE.md`.

### Adding a New Page

1. Create your page in `client/src/pages/MyPage.tsx`
2. Add the route in `client/src/App.tsx`:
   ```tsx
   import MyPage from "@/pages/MyPage";

   // In SessionRouter's Switch:
   <Route path="/my-page" component={MyPage} />
   ```

### Adding an API Route

1. Create route file in `server/routes/myroute.ts`
2. Register in `server/routes/index.ts`:
   ```typescript
   import myrouteRouter from "./myroute";
   app.use('/api/myroute', myrouteRouter);
   ```

### Modifying the Database

1. Edit `shared/schema.ts` to add tables or columns
2. Run `npm run db:push` to apply changes

## Deployment

### Railway

1. Create a new project on Railway
2. Add a PostgreSQL database
3. Set environment variables:
   - `DATABASE_URL` - Auto-configured if using Railway PostgreSQL
   - `JWT_SECRET` - Your secret key
   - `VITE_CIRCLE_ORIGIN` - Your Circle.so URL
   - `NODE_ENV=production`
4. Deploy from GitHub

### Replit

1. Import repository from GitHub
2. Add secrets in the Secrets tab (same variables as above)
3. Click Run

### Generic Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Set environment variables for production
3. Start the server:
   ```bash
   NODE_ENV=production npm start
   ```

Ensure your deployment platform provides:
- Node.js 18+ runtime
- PostgreSQL database access
- HTTPS (required for Circle.so iframe embedding)

## Circle.so Setup

This application runs as an iframe inside your Circle.so community. To set it up:

1. **Enable Custom Apps**
   - Go to your Circle.so admin settings
   - Enable the Custom Apps feature (may require certain plan levels)

2. **Create the App**
   - Navigate to Settings > Custom Apps > Create App
   - Set the App URL to your deployed application URL
   - Configure the app name and description

3. **Add to a Space**
   - Go to the space where you want the app
   - Add a Custom App block
   - Select your created app

4. **Configure Origin**
   - Ensure `VITE_CIRCLE_ORIGIN` in your `.env` matches exactly your Circle.so community URL
   - Example: `https://your-community.circle.so`

### How Authentication Works

1. Circle.so sends user data via `postMessage` when the iframe loads
2. The app validates the origin matches `VITE_CIRCLE_ORIGIN`
3. User email is verified/created in the database
4. Optional PIN verification (if enabled in admin settings)
5. JWT session token issued for subsequent requests

## Troubleshooting

### "Origin invalid" error

- Check that `VITE_CIRCLE_ORIGIN` exactly matches your Circle.so URL (no trailing slash)
- Ensure the app is being accessed from within Circle.so, not directly

### Database connection fails

- Verify `DATABASE_URL` is correct and the database is accessible
- For Neon: Ensure your IP is allowlisted if using IP restrictions

### Authentication not working

- In development, set `VITE_DEV_MODE=true` to bypass Circle.so auth
- Check browser console for postMessage errors
- Verify Circle.so Custom Apps is properly configured

## License

MIT License - Feel free to use this template for your Circle.so applications.

---

For detailed architecture documentation and advanced patterns, see [ARCHITECTURE.md](./ARCHITECTURE.md).
