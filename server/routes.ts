import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth } from "./middleware";
import { corsMiddleware } from "./app";
import { insertFeedbackSchema } from "@shared/schema";
import { registerModularRoutes } from "./routes/index";

export async function registerRoutes(app: Express): Promise<Server> {

  app.use('/api', corsMiddleware);
  
  registerModularRoutes(app);

  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedFeedback = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedFeedback);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      const testUser = await storage.getUserByEmail('test@nonexistent.com');
      const config = await storage.getAppConfig();
      return res.json({
        status: 'ok',
        database: 'connected',
        config: {
          requireCircleDomain: config.requireCircleDomain,
          requireCircleLogin: config.requireCircleLogin,
          requirePaywall: config.requirePaywall,
          requirePin: config.requirePin,
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({
        status: 'error',
        database: 'disconnected',
        error: errorMessage
      });
    }
  });

  app.get('/api/debug/admin-check', async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: 'Email parameter required' });
      }
      
      const user = await storage.getUserByEmail(email);
      return res.json({
        exists: !!user,
        isAdmin: user?.isAdmin ?? null,
        hasPin: !!user?.pinHash,
        userId: user?.id ?? null,
        environment: process.env.NODE_ENV || 'unknown',
        devMode: process.env.DEV_MODE === 'true',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: errorMessage });
    }
  });

  app.post('/api/debug/fix-admin', async (req: Request, res: Response) => {
    try {
      const { email, secret } = req.body;
      
      const webhookSecret = process.env.WEBHOOK_SECRET;
      if (!secret || secret !== webhookSecret) {
        return res.status(401).json({ error: 'Invalid secret' });
      }
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await storage.updateUserRole(user.id, true);
      
      return res.json({
        success: true,
        message: `User ${email} is now admin`,
        userId: user.id,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: errorMessage });
    }
  });

  app.get('/api/config', async (req: Request, res: Response) => {
    try {
      const config = await storage.getAppConfig();
      const isPublicMode = !config.requireCircleDomain && !config.requireCircleLogin && !config.requirePaywall && !config.requirePin;
      return res.json({
        requireCircleDomain: config.requireCircleDomain,
        requireCircleLogin: config.requireCircleLogin,
        requirePaywall: config.requirePaywall,
        requirePin: config.requirePin,
        paywallPurchaseUrl: config.paywallPurchaseUrl,
        paywallInfoUrl: config.paywallInfoUrl,
        paywallTitle: config.paywallTitle,
        paywallMessage: config.paywallMessage,
        environment: config.environment,
        isPublicMode,
      });
    } catch (error) {
      console.error('Error in GET /api/config:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.get('/api/settings', async (req: Request, res: Response) => {
    try {
      const config = await storage.getAppConfig();
      return res.json({
        environment: config.environment,
        circleOnlyMode: config.requireCircleDomain,
      });
    } catch (error) {
      console.error('Error in GET /api/settings:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/api/check-access', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const config = await storage.getAppConfig();

      if (config.environment === 'development') {
        return res.json({
          hasAccess: true,
          mode: 'development'
        });
      }

      if (config.requirePaywall) {
        if (!email) {
          return res.json({ hasAccess: false, mode: 'production', reason: 'email_required_for_paywall' });
        }
        const paidMember = await storage.getPaidMemberByEmail(email);
        if (!paidMember) {
          return res.json({ hasAccess: false, mode: 'production', reason: 'paywall' });
        }
      }

      if (config.requireCircleLogin && !email) {
        return res.json({ hasAccess: false, mode: 'production', reason: 'login_required' });
      }

      return res.json({
        hasAccess: true,
        mode: 'production'
      });

    } catch (error) {
      console.error('Error in POST /api/check-access:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.patch('/api/config', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      const {
        requireCircleDomain,
        requireCircleLogin,
        requirePaywall,
        requirePin,
        paywallPurchaseUrl,
        paywallInfoUrl,
        paywallTitle,
        paywallMessage,
        environment,
      } = req.body;

      const updateData: Partial<any> = {};

      console.log('[PATCH /api/config] Received body:', req.body);

      if (requireCircleDomain !== undefined) updateData.requireCircleDomain = requireCircleDomain;
      if (requireCircleLogin !== undefined) updateData.requireCircleLogin = requireCircleLogin;
      if (requirePaywall !== undefined) updateData.requirePaywall = requirePaywall;
      if (requirePin !== undefined) updateData.requirePin = requirePin;
      if (paywallPurchaseUrl !== undefined) updateData.paywallPurchaseUrl = paywallPurchaseUrl;
      if (paywallInfoUrl !== undefined) updateData.paywallInfoUrl = paywallInfoUrl;
      if (paywallTitle !== undefined) updateData.paywallTitle = paywallTitle;
      if (paywallMessage !== undefined) updateData.paywallMessage = paywallMessage;
      if (environment !== undefined) updateData.environment = environment;

      console.log('[PATCH /api/config] Constructed updateData:', updateData);

      const updatedConfig = await storage.updateAppConfig(updateData);

      console.log('[PATCH /api/config] Updated config from storage:', updatedConfig);

      return res.json({
        success: true,
        requireCircleDomain: updatedConfig.requireCircleDomain,
        requireCircleLogin: updatedConfig.requireCircleLogin,
        requirePaywall: updatedConfig.requirePaywall,
        requirePin: updatedConfig.requirePin,
        paywallPurchaseUrl: updatedConfig.paywallPurchaseUrl,
        paywallInfoUrl: updatedConfig.paywallInfoUrl,
        paywallTitle: updatedConfig.paywallTitle,
        paywallMessage: updatedConfig.paywallMessage,
        environment: updatedConfig.environment,
      });
    } catch (error) {
      console.error('Error in PATCH /api/config:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
