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
  
  // Apply CORS only to API routes
  app.use('/api', corsMiddleware);
  
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
      // When requireCircleDomain is false, frontend sends mock data
      const userData = {
        publicUid: user.publicUid || 'dev123',
        email: user.email || 'dev@example.com',
        name: user.name || 'Dev User',
        isAdmin: user.isAdmin !== undefined ? user.isAdmin : false,
        timestamp: user.timestamp || Date.now(),
      };

      // Validate format and timestamp
      const formatCheck = validateUserData(userData);
      if (!formatCheck.valid) {
        return res.status(400).json({ error: formatCheck.error });
      }

      // Check if user exists by email
      const existingUser = await storage.getUserByEmail(userData.email);

      if (!existingUser) {
        // New user - check if publicUid is already registered (shouldn't happen but safety check)
        const userByPublicUid = await storage.getUserByPublicUid(userData.publicUid);
        if (userByPublicUid) {
          return res.status(403).json({ 
            error: 'Cet identifiant Circle.so est déjà associé à un autre email' 
          });
        }

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

      // Existing user - verify publicUid matches
      if (existingUser.publicUid !== userData.publicUid) {
        return res.status(403).json({ 
          error: 'Les données Circle.so ne correspondent pas au compte existant' 
        });
      }

      // CRITICAL: Sync admin status from Circle.so on every login
      await storage.updateUserRole(existingUser.id, userData.isAdmin || false);

      // If PIN is NOT required, auto-login the user
      if (!appConfig.requirePin) {
        await storage.updateUserLastLogin(existingUser.id);
        await storage.logLoginAttempt({
          userId: existingUser.id,
          success: true,
          ipAddress: req.ip || 'unknown',
        });
        const sessionToken = generateSessionToken(existingUser.id, existingUser.email);
        
        return res.json({
          status: 'auto_login',
          user_id: existingUser.id,
          is_admin: userData.isAdmin || false,
          session_token: sessionToken,
          requires_pin: false,
        });
      }

      // Existing member - needs to enter PIN
      return res.json({
        status: 'existing_user',
        user_id: existingUser.id,
        is_admin: userData.isAdmin || false,
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

      // Double-check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Un compte existe déjà pour cet email' 
        });
      }

      // Hash the PIN
      const pinHash = await hashPin(pin);

      // Create user with isAdmin from validation cache
      const user = await storage.createUser({
        email,
        publicUid: public_uid,
        name,
        pinHash,
        isAdmin: cachedData.isAdmin,
      });

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Log successful login attempt
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || 'unknown',
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
        return res.status(400).json({ error: 'Un compte existe déjà pour cet email' });
      }

      // Create user with random PIN (user will never need it)
      const randomPin = crypto.randomBytes(6).toString('hex');
      const pinHash = await hashPin(randomPin);

      const user = await storage.createUser({
        email,
        publicUid: public_uid,
        name,
        pinHash,
        isAdmin: cachedData.isAdmin,
      });

      await storage.updateUserLastLogin(user.id);
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || 'unknown',
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

      // Get user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Log failed attempt for non-existent user
        await storage.logLoginAttempt({
          userId: 'unknown',
          success: false,
          ipAddress: req.ip || 'unknown',
        });
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Compare PIN
      const isValidPin = await comparePin(pin, user.pinHash);

      if (!isValidPin) {
        // Log failed attempt
        await storage.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress: req.ip || 'unknown',
        });

        return res.status(401).json({ error: 'NIP incorrect' });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Log successful attempt
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || 'unknown',
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
      if (!user) {
        await storage.logLoginAttempt({
          userId: 'unknown',
          success: false,
          ipAddress: req.ip || 'unknown',
        });
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      // Security check: Only admins can use this endpoint
      if (!user.isAdmin) {
        await storage.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress: req.ip || 'unknown',
        });
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      // Verify PIN
      const isValidPin = await comparePin(pin, user.pinHash);
      if (!isValidPin) {
        await storage.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress: req.ip || 'unknown',
        });
        return res.status(401).json({ error: 'NIP incorrect' });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Log successful attempt
      await storage.logLoginAttempt({
        userId: user.id,
        success: true,
        ipAddress: req.ip || 'unknown',
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
      // isPublicMode: true ONLY when ALL 3 layers are disabled
      const isPublicMode = !config.requireCircleDomain && !config.requireCircleLogin && !config.requirePin;
      return res.json({
        requireCircleDomain: config.requireCircleDomain,
        requireCircleLogin: config.requireCircleLogin,
        requirePin: config.requirePin,
        isPublicMode,
      });
    } catch (error) {
      console.error('Error in GET /api/config:', error);
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

      const { requireCircleDomain, requireCircleLogin, requirePin } = req.body;

      const updatedConfig = await storage.updateAppConfig({
        requireCircleDomain: requireCircleDomain !== undefined ? requireCircleDomain : undefined,
        requireCircleLogin: requireCircleLogin !== undefined ? requireCircleLogin : undefined,
        requirePin: requirePin !== undefined ? requirePin : undefined,
      });

      return res.json({
        success: true,
        requireCircleDomain: updatedConfig.requireCircleDomain,
        requireCircleLogin: updatedConfig.requireCircleLogin,
        requirePin: updatedConfig.requirePin,
      });
    } catch (error) {
      console.error('Error in PATCH /api/config:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
