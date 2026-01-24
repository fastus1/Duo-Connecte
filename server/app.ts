import { type Server } from "node:http";

import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";

import { registerRoutes } from "./routes";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

// Trust proxy for rate limiting behind Replit's reverse proxy
app.set('trust proxy', 1);

// Configure CORS for Circle.so integration (API routes only)
// Use CIRCLE_ORIGIN for backend (available in production)
// Fallback to VITE_CIRCLE_ORIGIN for dev mode compatibility
const circleOrigin = process.env.CIRCLE_ORIGIN || process.env.VITE_CIRCLE_ORIGIN;
const devMode = process.env.DEV_MODE === 'true';

// Get app's own origin dynamically from Replit environment
// REPLIT_DOMAINS contains the deployment domain in production
const getAppOrigins = (): string[] => {
  const origins: string[] = [];

  // Dev domain
  if (process.env.REPLIT_DEV_DOMAIN) {
    origins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }

  // Deployment URL
  if (process.env.REPLIT_DEPLOYMENT_URL) {
    origins.push(process.env.REPLIT_DEPLOYMENT_URL);
  }

  // REPLIT_DOMAINS contains comma-separated list of domains
  if (process.env.REPLIT_DOMAINS) {
    process.env.REPLIT_DOMAINS.split(',').forEach(domain => {
      origins.push(`https://${domain.trim()}`);
    });
  }

  return origins;
};

export const corsMiddleware = cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In dev mode, allow all origins
    if (devMode) {
      return callback(null, true);
    }

    // In production, allow Circle.so origin AND the app's own origins
    const allowedOrigins = [
      circleOrigin,
      ...getAppOrigins(),
    ].filter(Boolean);

    if (allowedOrigins.some(allowed => origin.includes(allowed?.replace('https://', '') || ''))) {
      return callback(null, true);
    }

    // Otherwise reject with proper CORS error
    return callback(null, false);
  },
  credentials: true,
});

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Allow embedding in iframe from Circle.so
app.use((req, res, next) => {
  // Remove X-Frame-Options to allow iframe embedding
  res.removeHeader('X-Frame-Options');
  
  // Set Content-Security-Policy frame-ancestors to allow Circle.so and self
  const allowedOrigins = circleOrigin 
    ? `frame-ancestors 'self' ${circleOrigin}` 
    : "frame-ancestors 'self'";
  res.setHeader('Content-Security-Policy', allowedOrigins);
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
): Promise<Server> {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Global error handler caught:', err);
    res.status(status).json({ message });
  });

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  return new Promise((resolve) => {
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
      resolve(server);
    });
  });
}
