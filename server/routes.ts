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

const DEV_MODE = process.env.VITE_DEV_MODE === 'true';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // POST /api/auth/validate - Validate Circle.so user data
  app.post('/api/auth/validate', async (req: Request, res: Response) => {
    try {
      const { user } = req.body as { user: CircleUserData };

      if (!user) {
        return res.status(400).json({ error: 'Données utilisateur manquantes' });
      }

      // In DEV_MODE, use mock Circle.so data but still validate format
      const userData = DEV_MODE ? {
        id: user.id || 12345,
        email: user.email || 'dev@example.com',
        name: user.name || 'Dev User',
        timestamp: Date.now(), // Fresh timestamp to pass anti-replay check
      } : user;

      if (DEV_MODE) {
        console.log('🔧 DEV MODE: Using mock Circle.so data but validating format');
      }

      // ALWAYS validate format and timestamp (even in DEV_MODE for security)
      const formatCheck = validateUserData(userData);
      if (!formatCheck.valid) {
        return res.status(400).json({ error: formatCheck.error });
      }

      // Check if user exists by email
      const existingUser = await storage.getUserByEmail(userData.email);

      if (!existingUser) {
        // New user - check if Circle ID is already registered (shouldn't happen but safety check)
        const userByCircleId = await storage.getUserByCircleId(userData.id);
        if (userByCircleId) {
          return res.status(403).json({ 
            error: 'Cet ID Circle.so est déjà associé à un autre email' 
          });
        }

        // New member - needs to create PIN
        return res.json({
          status: 'new_user',
          user_id: userData.id,
          email: userData.email,
          name: userData.name,
        });
      }

      // Existing user - verify Circle ID matches
      if (existingUser.circleId !== userData.id) {
        return res.status(403).json({ 
          error: 'Les données Circle.so ne correspondent pas au compte existant' 
        });
      }

      // Existing member - needs to enter PIN
      return res.json({
        status: 'existing_user',
        user_id: existingUser.id,
        requires_pin: true,
      });

    } catch (error) {
      console.error('Error in /api/auth/validate:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de la validation' });
    }
  });

  // POST /api/auth/create-pin - Create PIN for new user
  app.post('/api/auth/create-pin', async (req: Request, res: Response) => {
    try {
      const { email, circle_id, name, pin } = req.body;

      // Validate input
      if (!email || !circle_id || !name || !pin) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Validate PIN format (4-6 digits)
      if (!/^\d{4,6}$/.test(pin)) {
        return res.status(400).json({ 
          error: 'Le NIP doit contenir 4 à 6 chiffres' 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Un compte existe déjà pour cet email' 
        });
      }

      // Hash the PIN
      const pinHash = await hashPin(pin);

      // Create user
      const user = await storage.createUser({
        email,
        circleId: circle_id,
        name,
        pinHash,
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
      });

    } catch (error) {
      console.error('Error in /api/auth/create-pin:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du NIP' });
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
      });

    } catch (error) {
      console.error('Error in /api/auth/validate-pin:', error);
      return res.status(500).json({ error: 'Erreur lors de la validation du NIP' });
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
        circleId: user.circleId,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      });

    } catch (error) {
      console.error('Error in /api/auth/me:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
