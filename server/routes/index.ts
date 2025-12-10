import type { Express } from "express";
import webhooksRouter from "./webhooks";
import supportRouter from "./support";
import adminRouter from "./admin";
import authRouter from "./auth";
import { corsMiddleware } from "../app";

export function registerModularRoutes(app: Express): void {
  app.use('/webhooks', corsMiddleware);
  
  app.use('/webhooks', webhooksRouter);
  
  app.use('/api/support', supportRouter);
  
  app.use('/api/admin', adminRouter);
  
  app.use('/api/auth', authRouter);
}
