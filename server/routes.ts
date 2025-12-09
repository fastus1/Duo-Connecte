import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  validateUserData,
  generateSessionToken,
  hashPin,
  comparePin,
  pinRateLimiter,
  requireAuth,
  type CircleUserData
} from "./middleware";
import { corsMiddleware } from "./app";
import crypto from "crypto";
import {
  validateCircleUserSchema,
  createPinSchema,
  validatePinSchema,
  updateConfigSchema,
  insertFeedbackSchema,
  insertSupportTicketSchema
} from "@shared/schema";

// Temporary cache for validated Circle.so data (5 minutes expiry)
interface ValidationCache {
  email: string;
  publicUid: string;
  name: string;
  isAdmin: boolean;
  timestamp: number;
}
const validationCache = new Map<string, ValidationCache>();
const VALIDATION_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Cleanup expired validations every minute
setInterval(() => {
  const now = Date.now();
  Array.from(validationCache.entries()).forEach(([token, data]) => {
    if (now - data.timestamp > VALIDATION_EXPIRY_MS) {
      validationCache.delete(token);
    }
  });
}, 60 * 1000);

export async function registerRoutes(app: Express): Promise<Server> {

  // Apply CORS to API routes and webhooks (webhooks called from Circle.so client-side scripts)
  app.use('/api', corsMiddleware);
  app.use('/webhooks', corsMiddleware);

  // Feedback endpoint
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedFeedback = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedFeedback);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all feedbacks - Admin only
  app.get("/api/admin/feedbacks", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      const feedbacks = await storage.getAllFeedbacks();
      res.json(feedbacks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get archived feedbacks - Admin only
  app.get("/api/admin/feedbacks/archived", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      const feedbacks = await storage.getArchivedFeedbacks();
      res.json(feedbacks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Archive feedback - Admin only
  app.patch("/api/admin/feedbacks/:id/archive", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      await storage.archiveFeedback(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Unarchive feedback - Admin only
  app.patch("/api/admin/feedbacks/:id/unarchive", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      await storage.unarchiveFeedback(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete feedback - Admin only
  app.delete("/api/admin/feedbacks/:id", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      await storage.deleteFeedback(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // SUPPORT TICKET ENDPOINTS
  // ========================================

  // Create support ticket (public - no auth required)
  app.post("/api/support/tickets", async (req, res) => {
    try {
      const validatedTicket = insertSupportTicketSchema.parse(req.body);
      const ticket = await storage.createSupportTicket(validatedTicket);
      
      // TODO: Add Resend email notification here
      
      res.json({ success: true, ticketId: ticket.id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all support tickets - Admin only
  app.get("/api/admin/support/tickets", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update ticket status - Admin only
  app.patch("/api/admin/support/tickets/:id/status", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      const { status } = req.body;
      if (!['new', 'in_progress', 'resolved'].includes(status)) {
        return res.status(400).json({ error: "Statut invalide" });
      }

      const ticket = await storage.updateSupportTicketStatus(req.params.id, status);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket non trouvé" });
      }
      res.json(ticket);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete ticket - Admin only
  app.delete("/api/admin/support/tickets/:id", requireAuth, async (req, res) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Accès réservé aux administrateurs" });
      }

      await storage.deleteSupportTicket(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/health - Health check endpoint for debugging
  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      // Test database connection
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

  // GET /api/debug/admin-check - Check if admin user exists (for debugging production)
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

  // POST /api/debug/fix-admin - One-time fix to set admin status (secured with secret)
  app.post('/api/debug/fix-admin', async (req: Request, res: Response) => {
    try {
      const { email, secret } = req.body;
      
      // Security: require the webhook secret to use this endpoint
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
      
      // Update user to be admin
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

  // POST /api/auth/validate - Validate Circle.so user data
  app.post('/api/auth/validate', async (req: Request, res: Response) => {
    try {
      const { user } = req.body as { user: CircleUserData };

      if (!user) {
        return res.status(400).json({ error: 'Données utilisateur manquantes' });
      }

      // Get app configuration
      const appConfig = await storage.getAppConfig();

      // Use data as provided by the frontend
      // Generate unique publicUid if not provided
      const uniqueSuffix = crypto.randomBytes(4).toString('hex');
      const userData = {
        publicUid: user.publicUid || `circle_${uniqueSuffix}`,
        email: user.email || 'dev@example.com',
        name: user.name || 'Membre',
        isAdmin: user.isAdmin !== undefined ? user.isAdmin : false,
        timestamp: user.timestamp || Date.now(),
      };

      // Validate format and timestamp
      const formatCheck = validateUserData(userData);
      if (!formatCheck.valid) {
        return res.status(400).json({ error: formatCheck.error });
      }

      // Check if user exists by email (email is the authoritative identifier)
      const existingUser = await storage.getUserByEmail(userData.email);

      if (!existingUser) {
        // New user - email is unique, publicUid conflicts are handled by generating unique IDs
        // Generate one-time validation token for new user
        const validationToken = crypto.randomBytes(32).toString('hex');
        validationCache.set(validationToken, {
          email: userData.email,
          publicUid: userData.publicUid,
          name: userData.name || `User ${userData.publicUid}`,
          isAdmin: userData.isAdmin || false,
          timestamp: Date.now(),
        });

        // New member - needs to create PIN (or auto-register if PIN not required)
        return res.json({
          status: 'new_user',
          user_id: userData.publicUid,
          email: userData.email,
          name: userData.name,
          is_admin: userData.isAdmin || false,
          validation_token: validationToken,
          requires_pin: appConfig.requirePin,
        });
      }

      // Existing user - if publicUid differs, update it (Circle.so may regenerate IDs)
      // We trust the email as the primary identifier
      if (existingUser.publicUid !== userData.publicUid) {
        await storage.updateUserPublicUid(existingUser.id, userData.publicUid);
      }

      // Admin status: PRESERVE existing admin status from database
      // Only upgrade to admin if Circle.so explicitly says isAdmin=true
      // Never downgrade an existing admin (admins are set via database or dashboard)
      const finalIsAdmin = existingUser.isAdmin || userData.isAdmin || false;

      // If PIN is NOT required, auto-login the user
      if (!appConfig.requirePin) {
        await storage.updateUserLastLogin(existingUser.id);
        await storage.logLoginAttempt({
          userId: existingUser.id,
          success: true,
          ipAddress: req.ip || null,
        });
        const sessionToken = generateSessionToken(existingUser.id, existingUser.email);

        return res.json({
          status: 'auto_login',
          user_id: existingUser.id,
          is_admin: finalIsAdmin,
          session_token: sessionToken,
          requires_pin: false,
        });
      }

      // Check if existing user has a PIN
      if (!existingUser.pinHash) {
        // Existing user WITHOUT PIN - needs to create one
        // Generate validation token for PIN creation
        const validationToken = crypto.randomBytes(32).toString('hex');
        validationCache.set(validationToken, {
          email: userData.email,
          publicUid: userData.publicUid,
          name: existingUser.name || userData.name || 'Membre',
          isAdmin: finalIsAdmin,
          timestamp: Date.now(),
        });

        return res.json({
          status: 'missing_pin',
          user_id: userData.publicUid,
          db_user_id: existingUser.id,
          email: userData.email,
          name: existingUser.name || userData.name,
          is_admin: finalIsAdmin,
          validation_token: validationToken,
          requires_pin: true,
        });
      }

      // Existing member with PIN - needs to enter PIN
      return res.json({
        status: 'existing_user',
        user_id: existingUser.id,
        is_admin: finalIsAdmin,
        requires_pin: true,
      });

    } catch (error) {
      console.error('Error in /api/auth/validate:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      return res.status(500).json({
        error: 'Erreur serveur lors de la validation',
        details: process.env.DEV_MODE === 'true' ? errorMessage : undefined
      });
    }
  });

  // POST /api/auth/create-pin - Create PIN for new user (REQUIRES validation token)
  app.post('/api/auth/create-pin', async (req: Request, res: Response) => {
    try {
      const { email, public_uid, name, pin, validation_token } = req.body;

      // Validate input
      if (!email || !public_uid || !name || !pin || !validation_token) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // SERVER-SIDE PAYWALL CHECK: Prevent bypassing paywall via direct API calls
      const appConfig = await storage.getAppConfig();
      if (appConfig.requirePaywall && email) {
        const paidMember = await storage.getPaidMemberByEmail(email.toLowerCase());
        if (!paidMember) {
          console.log(`[AUTH] Paywall block on create-pin for: ${email}`);
          return res.status(403).json({
            error: 'Accès réservé aux membres payants',
            paywall_blocked: true
          });
        }
      }

      // CRITICAL: Verify validation token to prevent unauthorized account creation
      const cachedData = validationCache.get(validation_token);
      if (!cachedData) {
        return res.status(403).json({
          error: 'Token de validation invalide ou expiré. Veuillez recommencer l\'authentification.'
        });
      }

      // Verify the data matches the cached validation
      if (cachedData.email !== email || cachedData.publicUid !== public_uid) {
        validationCache.delete(validation_token); // Clean up invalid attempt
        return res.status(403).json({
          error: 'Les données ne correspondent pas à la validation Circle.so'
        });
      }

      // Check if validation is still fresh (not expired)
      if (Date.now() - cachedData.timestamp > VALIDATION_EXPIRY_MS) {
        validationCache.delete(validation_token);
        return res.status(403).json({
          error: 'Token de validation expiré. Veuillez recommencer l\'authentification.'
        });
      }

      // Delete token (one-time use)
      validationCache.delete(validation_token);

      // Validate PIN format (4-6 digits)
      if (!/^\d{4,6}$/.test(pin)) {
        return res.status(400).json({
          error: 'Le NIP doit contenir 4 à 6 chiffres'
        });
      }

      // Hash the PIN
      const pinHash = await hashPin(pin);

      // Check if user already exists (may be updating PIN for existing user without one)
      const existingUser = await storage.getUserByEmail(email);
      let user;
      
      if (existingUser) {
        // Existing user without PIN - update their PIN
        if (existingUser.pinHash) {
          return res.status(400).json({
            error: 'Un NIP existe déjà pour ce compte. Utilisez la connexion normale.'
          });
        }
        // Update existing user with new PIN
        await storage.updateUserPin(existingUser.id, pinHash);
        user = { ...existingUser, pinHash, isAdmin: cachedData.isAdmin };
      } else {
        // Create new user with PIN
        user = await storage.createUser({
          email,
          publicUid: public_uid,
          name,
          pinHash,
          isAdmin: cachedData.isAdmin,
        });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Log successful login attempt
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || null,
      });

      // Generate session token
      const sessionToken = generateSessionToken(user.id, user.email);

      return res.json({
        success: true,
        session_token: sessionToken,
        user_id: user.id,
        is_admin: user.isAdmin,
      });

    } catch (error) {
      console.error('Error in /api/auth/create-pin:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du NIP' });
    }
  });

  // POST /api/auth/create-user-no-pin - Create user without PIN (when PIN is not required)
  app.post('/api/auth/create-user-no-pin', async (req: Request, res: Response) => {
    try {
      const { email, public_uid, name, validation_token } = req.body;

      // Check if PIN is required
      const appConfig = await storage.getAppConfig();
      if (appConfig.requirePin) {
        return res.status(403).json({ error: 'Le NIP est requis pour créer un compte' });
      }

      // SERVER-SIDE PAYWALL CHECK: Prevent bypassing paywall via direct API calls
      if (appConfig.requirePaywall && email) {
        const paidMember = await storage.getPaidMemberByEmail(email.toLowerCase());
        if (!paidMember) {
          console.log(`[AUTH] Paywall block on create-user-no-pin for: ${email}`);
          return res.status(403).json({
            error: 'Accès réservé aux membres payants',
            paywall_blocked: true
          });
        }
      }

      // Validate input
      if (!email || !public_uid || !name || !validation_token) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Verify validation token
      const cachedData = validationCache.get(validation_token);
      if (!cachedData) {
        return res.status(403).json({
          error: 'Token de validation invalide ou expiré. Veuillez recommencer l\'authentification.'
        });
      }

      // Verify the data matches
      if (cachedData.email !== email || cachedData.publicUid !== public_uid) {
        validationCache.delete(validation_token);
        return res.status(403).json({
          error: 'Les données ne correspondent pas à la validation Circle.so'
        });
      }

      // Check expiration
      if (Date.now() - cachedData.timestamp > VALIDATION_EXPIRY_MS) {
        validationCache.delete(validation_token);
        return res.status(403).json({
          error: 'Token de validation expiré. Veuillez recommencer l\'authentification.'
        });
      }

      validationCache.delete(validation_token);

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        // User exists - just log them in (PIN not required)
        await storage.updateUserLastLogin(existingUser.id);
        await storage.logLoginAttempt({
          userId: existingUser.id,
          success: true,
          ipAddress: req.ip || null,
        });
        const sessionToken = generateSessionToken(existingUser.id, existingUser.email);
        return res.json({
          success: true,
          session_token: sessionToken,
          user_id: existingUser.id,
          is_admin: existingUser.isAdmin,
        });
      }

      // Create user WITHOUT pinHash (they can create one later if layer 4 is enabled)
      const user = await storage.createUser({
        email,
        publicUid: public_uid,
        name,
        pinHash: null,
        isAdmin: cachedData.isAdmin,
      });

      await storage.updateUserLastLogin(user.id);
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || null,
      });

      const sessionToken = generateSessionToken(user.id, user.email);

      return res.json({
        success: true,
        session_token: sessionToken,
        user_id: user.id,
        is_admin: user.isAdmin,
      });

    } catch (error) {
      console.error('Error in /api/auth/create-user-no-pin:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  });

  // POST /api/auth/validate-pin - Validate PIN for existing user (rate limited)
  app.post('/api/auth/validate-pin', pinRateLimiter, async (req: Request, res: Response) => {
    try {
      const { email, pin } = req.body;

      // Validate input
      if (!email || !pin) {
        return res.status(400).json({ error: 'Email et NIP requis' });
      }

      // SERVER-SIDE PAYWALL CHECK: Prevent bypassing paywall via direct API calls
      const appConfig = await storage.getAppConfig();
      if (appConfig.requirePaywall && email) {
        const paidMember = await storage.getPaidMemberByEmail(email.toLowerCase());
        if (!paidMember) {
          console.log(`[AUTH] Paywall block on validate-pin for: ${email}`);
          return res.status(403).json({
            error: 'Accès réservé aux membres payants',
            paywall_blocked: true
          });
        }
      }

      // Get user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Log failed attempt for non-existent user
        await storage.logLoginAttempt({
          userId: null,
          success: false,
          ipAddress: req.ip || null,
        });
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Check if user has a PIN
      if (!user.pinHash) {
        return res.status(400).json({ error: 'Aucun NIP configuré pour ce compte. Veuillez en créer un.' });
      }

      // Compare PIN
      const isValidPin = await comparePin(pin, user.pinHash);

      if (!isValidPin) {
        // Log failed attempt
        await storage.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress: req.ip || null,
        });

        return res.status(401).json({ error: 'NIP incorrect' });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Log successful attempt
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || null,
      });

      // Generate session token
      const sessionToken = generateSessionToken(user.id, user.email);

      return res.json({
        success: true,
        session_token: sessionToken,
        user_id: user.id,
        name: user.name,
        is_admin: user.isAdmin,
      });

    } catch (error) {
      console.error('Error in /api/auth/validate-pin:', error);
      return res.status(500).json({ error: 'Erreur lors de la validation du NIP' });
    }
  });

  // POST /api/auth/admin-login - Admin login with email + PIN (bypass Circle.so)
  // Security: Always requires admin status - this is for admins to access dashboard
  app.post('/api/auth/admin-login', pinRateLimiter, async (req: Request, res: Response) => {
    try {
      const { email, pin } = req.body;

      // Validate input
      if (!email || !pin) {
        return res.status(400).json({ error: 'Email et NIP requis' });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      console.log('[ADMIN-LOGIN] User lookup result:', { 
        email, 
        found: !!user, 
        userId: user?.id,
        isAdmin: user?.isAdmin,
        isAdminType: typeof user?.isAdmin
      });
      
      if (!user) {
        await storage.logLoginAttempt({
          userId: null,
          success: false,
          ipAddress: req.ip || null,
        });
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Security check: Only admins can use this endpoint
      if (!user.isAdmin) {
        await storage.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress: req.ip || null,
        });
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      // Check if user has a PIN
      if (!user.pinHash) {
        return res.status(400).json({ error: 'Aucun NIP configuré pour ce compte admin.' });
      }

      // Verify PIN
      const isValidPin = await comparePin(pin, user.pinHash);
      if (!isValidPin) {
        await storage.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress: req.ip || null,
        });
        return res.status(401).json({ error: 'NIP incorrect' });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Log successful attempt
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || null,
      });

      // Generate session token
      const sessionToken = generateSessionToken(user.id, user.email);

      return res.json({
        success: true,
        session_token: sessionToken,
        user_id: user.id,
        name: user.name,
        is_admin: user.isAdmin,
      });

    } catch (error) {
      console.error('Error in /api/auth/admin-login:', error);
      return res.status(500).json({ error: 'Erreur lors de la connexion admin' });
    }
  });

  // GET /api/auth/me - Get current user info (protected route example)
  app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Return user info without sensitive data
      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        publicUid: user.publicUid,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      });

    } catch (error) {
      console.error('Error in /api/auth/me:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // GET /api/config - Get app configuration (public)
  app.get('/api/config', async (req: Request, res: Response) => {
    try {
      const config = await storage.getAppConfig();
      // isPublicMode: true ONLY when ALL 4 layers are disabled
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

  // GET /api/settings - Alias for /api/config to support migrated AccessContext
  app.get('/api/settings', async (req: Request, res: Response) => {
    try {
      const config = await storage.getAppConfig();
      return res.json({
        environment: config.environment,
        circleOnlyMode: config.requireCircleDomain, // Map requireCircleDomain to circleOnlyMode
      });
    } catch (error) {
      console.error('Error in GET /api/settings:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/check-access - Check access for migrated AccessContext
  app.post('/api/check-access', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const config = await storage.getAppConfig();

      // If in development mode, grant access (unless specific restrictions apply)
      if (config.environment === 'development') {
        return res.json({
          hasAccess: true,
          mode: 'development'
        });
      }

      // In production, check requirements

      // 1. Check Paywall if enabled
      if (config.requirePaywall) {
        if (!email) {
          return res.json({ hasAccess: false, mode: 'production', reason: 'email_required_for_paywall' });
        }
        const paidMember = await storage.getPaidMemberByEmail(email);
        if (!paidMember) {
          return res.json({ hasAccess: false, mode: 'production', reason: 'paywall' });
        }
      }

      // 2. Check Circle Domain if enabled (handled by client mostly, but we can validate email domain if needed)
      // For now, we assume client validation for origin, and here we just check if email is present if login is required
      if (config.requireCircleLogin && !email) {
        return res.json({ hasAccess: false, mode: 'production', reason: 'login_required' });
      }

      // If all checks pass
      return res.json({
        hasAccess: true,
        mode: 'production'
      });

    } catch (error) {
      console.error('Error in POST /api/check-access:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // PATCH /api/config - Update app configuration (admin only)
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

  // POST /api/auth/check-paywall - Check if user has paid (requires email from Circle.so login)
  app.post('/api/auth/check-paywall', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const config = await storage.getAppConfig();

      console.log(`[PAYWALL CHECK] Email: "${email}", requirePaywall: ${config.requirePaywall}`);

      // If paywall is disabled, grant access
      if (!config.requirePaywall) {
        console.log(`[PAYWALL CHECK] Paywall disabled - granting access`);
        return res.json({ hasAccess: true, paywallEnabled: false });
      }

      // Paywall enabled - check if user has paid
      if (!email) {
        console.log(`[PAYWALL CHECK] No email provided - blocking access`);
        return res.json({
          hasAccess: false,
          paywallEnabled: true,
          paywallTitle: config.paywallTitle,
          paywallMessage: config.paywallMessage,
          paywallPurchaseUrl: config.paywallPurchaseUrl,
          paywallInfoUrl: config.paywallInfoUrl,
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const paidMember = await storage.getPaidMemberByEmail(normalizedEmail);
      console.log(`[PAYWALL CHECK] Checking: "${normalizedEmail}", found: ${paidMember ? 'YES - ' + paidMember.email : 'NO'}`);

      if (paidMember) {
        console.log(`[PAYWALL CHECK] Access GRANTED for ${normalizedEmail}`);
        return res.json({ hasAccess: true, paywallEnabled: true });
      }

      // User has not paid
      return res.json({
        hasAccess: false,
        paywallEnabled: true,
        paywallTitle: config.paywallTitle,
        paywallMessage: config.paywallMessage,
        paywallPurchaseUrl: config.paywallPurchaseUrl,
        paywallInfoUrl: config.paywallInfoUrl,
      });

    } catch (error) {
      console.error('Error in /api/auth/check-paywall:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /webhooks/circle-payment - Receive payment notifications from Circle.so
  // This endpoint is called by Circle.so when a payment is completed
  // Security: Requires X-Webhook-Secret header matching WEBHOOK_SECRET env var
  app.post('/webhooks/circle-payment', async (req: Request, res: Response) => {
    try {
      const webhookSecret = process.env.WEBHOOK_SECRET;
      const providedSecret = req.headers['x-webhook-secret'] as string;

      // Log webhook attempt (for debugging)
      console.log(`[WEBHOOK] Payment webhook called from ${req.ip} at ${new Date().toISOString()}`);

      // Validate webhook secret
      if (!webhookSecret) {
        console.error('[WEBHOOK] WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'Webhook not configured' });
      }

      if (!providedSecret || providedSecret !== webhookSecret) {
        console.warn(`[WEBHOOK] Invalid secret attempt from ${req.ip}`);
        return res.status(401).json({ error: 'Non autorisé - secret invalide' });
      }

      const { event, user, payment } = req.body;

      // Validate event type
      if (event !== 'payment_received') {
        console.log(`[WEBHOOK] Unsupported event type: ${event}`);
        return res.status(400).json({ error: 'Type d\'événement non supporté' });
      }

      // Validate email
      if (!user?.email) {
        console.log('[WEBHOOK] Missing email in payload');
        return res.status(400).json({ error: 'Email requis' });
      }

      const email = user.email.toLowerCase();

      // Check if already registered
      const existingMember = await storage.getPaidMemberByEmail(email);
      if (existingMember) {
        console.log(`[WEBHOOK] Member already registered: ${email}`);
        return res.json({
          success: true,
          message: 'Membre déjà enregistré',
          email,
        });
      }

      // Register new paid member
      const newMember = await storage.createPaidMember({
        email,
        paymentPlan: payment?.paywall_display_name || null,
        amountPaid: payment?.amount_paid || null,
        couponUsed: payment?.coupon_code || null,
      });

      console.log(`[WEBHOOK] New paid member registered: ${email}, plan: ${payment?.paywall_display_name || 'N/A'}`);

      return res.json({
        success: true,
        message: 'Accès activé',
        email: newMember.email,
        paymentDate: newMember.paymentDate,
      });

    } catch (error) {
      console.error('[WEBHOOK] Error processing payment:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du paiement' });
    }
  });

  // GET /api/admin/paid-members - List all paid members (admin only)
  app.get('/api/admin/paid-members', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      const paidMembers = await storage.getAllPaidMembers();
      return res.json({ members: paidMembers });

    } catch (error) {
      console.error('Error in GET /api/admin/paid-members:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/admin/paid-members - Manually add a paid member (admin only)
  app.post('/api/admin/paid-members', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email requis' });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if already exists
      const existing = await storage.getPaidMemberByEmail(normalizedEmail);
      if (existing) {
        return res.status(400).json({ error: 'Ce membre est déjà enregistré' });
      }

      const newMember = await storage.createPaidMember({
        email: normalizedEmail,
        paymentPlan: 'Manual',
        amountPaid: null,
        couponUsed: null,
      });

      console.log(`[ADMIN] Paid member manually added: ${normalizedEmail} by ${user.email}`);

      return res.json({ success: true, member: newMember });

    } catch (error) {
      console.error('Error in POST /api/admin/paid-members:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // DELETE /api/admin/paid-members/:email - Remove a paid member (admin only)
  app.delete('/api/admin/paid-members/:email', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const user = await storage.getUser(userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      const { email } = req.params;
      await storage.deletePaidMember(email);

      return res.json({ success: true, message: 'Membre supprimé' });

    } catch (error) {
      console.error('Error in DELETE /api/admin/paid-members:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // DELETE /api/admin/delete-user/:email - Delete user and all their data (admin only)
  app.delete('/api/admin/delete-user/:email', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const adminUser = await storage.getUser(userId);

      if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      const { email } = req.params;
      const normalizedEmail = email.toLowerCase().trim();
      
      // Prevent deleting yourself
      if (normalizedEmail === adminUser.email?.toLowerCase()) {
        return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
      }

      const targetUser = await storage.getUserByEmail(normalizedEmail);

      if (!targetUser) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Also delete from paid members if exists
      await storage.deletePaidMember(normalizedEmail);
      
      // Delete the user and all their data
      await storage.deleteUser(targetUser.id);

      console.log(`[ADMIN] User completely deleted: ${normalizedEmail} by admin: ${adminUser.email} at ${new Date().toISOString()}`);

      return res.json({ 
        success: true, 
        message: `Utilisateur ${normalizedEmail} et toutes ses données ont été supprimés.` 
      });

    } catch (error) {
      console.error('Error in DELETE /api/admin/delete-user:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/admin/reset-user-pin - Reset a user's PIN (admin only)
  app.post('/api/admin/reset-user-pin', requireAuth, async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const adminUser = await storage.getUser(userId);

      if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email requis' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const targetUser = await storage.getUserByEmail(normalizedEmail);

      if (!targetUser) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Reset the PIN to null
      await storage.updateUserPin(targetUser.id, null);

      // Audit log
      console.log(`[ADMIN] PIN reset for user: ${normalizedEmail} by admin: ${adminUser.email} at ${new Date().toISOString()}`);

      return res.json({ 
        success: true, 
        message: `NIP réinitialisé pour ${normalizedEmail}. L'utilisateur devra en créer un nouveau.` 
      });

    } catch (error) {
      console.error('Error in POST /api/admin/reset-user-pin:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
