import { Router, Request, Response } from "express";
import { storage } from "../storage";
import {
  validateUserData,
  generateSessionToken,
  hashPin,
  comparePin,
  pinRateLimiter,
  requireAuth,
  type CircleUserData
} from "../middleware";
import crypto from "crypto";

const router = Router();

interface ValidationCache {
  email: string;
  publicUid: string;
  name: string;
  isAdmin: boolean;
  timestamp: number;
}
const validationCache = new Map<string, ValidationCache>();
const VALIDATION_EXPIRY_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  Array.from(validationCache.entries()).forEach(([token, data]) => {
    if (now - data.timestamp > VALIDATION_EXPIRY_MS) {
      validationCache.delete(token);
    }
  });
}, 60 * 1000);

router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { user } = req.body as { user: CircleUserData };

    if (!user) {
      return res.status(400).json({ error: 'Données utilisateur manquantes' });
    }

    const appConfig = await storage.getAppConfig();

    const uniqueSuffix = crypto.randomBytes(4).toString('hex');
    const userData = {
      publicUid: user.publicUid || `circle_${uniqueSuffix}`,
      email: user.email || 'dev@example.com',
      name: user.name || 'Membre',
      isAdmin: user.isAdmin !== undefined ? user.isAdmin : false,
      timestamp: user.timestamp || Date.now(),
    };

    const formatCheck = validateUserData(userData);
    if (!formatCheck.valid) {
      return res.status(400).json({ error: formatCheck.error });
    }

    const existingUser = await storage.getUserByEmail(userData.email);

    if (!existingUser) {
      const validationToken = crypto.randomBytes(32).toString('hex');
      validationCache.set(validationToken, {
        email: userData.email,
        publicUid: userData.publicUid,
        name: userData.name || `User ${userData.publicUid}`,
        isAdmin: userData.isAdmin || false,
        timestamp: Date.now(),
      });

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

    if (existingUser.publicUid !== userData.publicUid) {
      await storage.updateUserPublicUid(existingUser.id, userData.publicUid);
    }

    const finalIsAdmin = existingUser.isAdmin || userData.isAdmin || false;

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

    if (!existingUser.pinHash) {
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

router.post('/create-pin', async (req: Request, res: Response) => {
  try {
    const { email, public_uid, name, pin, validation_token } = req.body;

    if (!email || !public_uid || !name || !pin || !validation_token) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

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

    const cachedData = validationCache.get(validation_token);
    if (!cachedData) {
      return res.status(403).json({
        error: 'Token de validation invalide ou expiré. Veuillez recommencer l\'authentification.'
      });
    }

    if (cachedData.email !== email || cachedData.publicUid !== public_uid) {
      validationCache.delete(validation_token);
      return res.status(403).json({
        error: 'Les données ne correspondent pas à la validation Circle.so'
      });
    }

    if (Date.now() - cachedData.timestamp > VALIDATION_EXPIRY_MS) {
      validationCache.delete(validation_token);
      return res.status(403).json({
        error: 'Token de validation expiré. Veuillez recommencer l\'authentification.'
      });
    }

    validationCache.delete(validation_token);

    if (!/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({
        error: 'Le NIP doit contenir 4 à 6 chiffres'
      });
    }

    const pinHash = await hashPin(pin);

    const existingUser = await storage.getUserByEmail(email);
    let user;
    
    if (existingUser) {
      if (existingUser.pinHash) {
        return res.status(400).json({
          error: 'Un NIP existe déjà pour ce compte. Utilisez la connexion normale.'
        });
      }
      await storage.updateUserPin(existingUser.id, pinHash);
      user = { ...existingUser, pinHash, isAdmin: cachedData.isAdmin };
    } else {
      user = await storage.createUser({
        email,
        publicUid: public_uid,
        name,
        pinHash,
        isAdmin: cachedData.isAdmin,
      });
    }

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
    console.error('Error in /api/auth/create-pin:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du NIP' });
  }
});

router.post('/create-user-no-pin', async (req: Request, res: Response) => {
  try {
    const { email, public_uid, name, validation_token } = req.body;

    const appConfig = await storage.getAppConfig();
    if (appConfig.requirePin) {
      return res.status(403).json({ error: 'Le NIP est requis pour créer un compte' });
    }

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

    if (!email || !public_uid || !name || !validation_token) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const cachedData = validationCache.get(validation_token);
    if (!cachedData) {
      return res.status(403).json({
        error: 'Token de validation invalide ou expiré. Veuillez recommencer l\'authentification.'
      });
    }

    if (cachedData.email !== email || cachedData.publicUid !== public_uid) {
      validationCache.delete(validation_token);
      return res.status(403).json({
        error: 'Les données ne correspondent pas à la validation Circle.so'
      });
    }

    if (Date.now() - cachedData.timestamp > VALIDATION_EXPIRY_MS) {
      validationCache.delete(validation_token);
      return res.status(403).json({
        error: 'Token de validation expiré. Veuillez recommencer l\'authentification.'
      });
    }

    validationCache.delete(validation_token);

    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
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

router.post('/validate-pin', pinRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ error: 'Email et NIP requis' });
    }

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

    const user = await storage.getUserByEmail(email);
    if (!user) {
      await storage.logLoginAttempt({
        userId: null,
        success: false,
        ipAddress: req.ip || null,
      });
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    if (!user.pinHash) {
      return res.status(400).json({ error: 'Aucun NIP configuré pour ce compte. Veuillez en créer un.' });
    }

    const isValidPin = await comparePin(pin, user.pinHash);

    if (!isValidPin) {
      await storage.logLoginAttempt({
        userId: user.id,
        success: false,
        ipAddress: req.ip || null,
      });

      return res.status(401).json({ error: 'NIP incorrect' });
    }

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
      name: user.name,
      is_admin: user.isAdmin,
    });

  } catch (error) {
    console.error('Error in /api/auth/validate-pin:', error);
    return res.status(500).json({ error: 'Erreur lors de la validation du NIP' });
  }
});

router.post('/admin-login', pinRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ error: 'Email et NIP requis' });
    }

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

    if (!user.isAdmin) {
      await storage.logLoginAttempt({
        userId: user.id,
        success: false,
        ipAddress: req.ip || null,
      });
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    if (!user.pinHash) {
      return res.status(400).json({ error: 'Aucun NIP configuré pour ce compte admin.' });
    }

    const isValidPin = await comparePin(pin, user.pinHash);
    if (!isValidPin) {
      await storage.logLoginAttempt({
        userId: user.id,
        success: false,
        ipAddress: req.ip || null,
      });
      return res.status(401).json({ error: 'NIP incorrect' });
    }

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
      name: user.name,
      is_admin: user.isAdmin,
    });

  } catch (error) {
    console.error('Error in /api/auth/admin-login:', error);
    return res.status(500).json({ error: 'Erreur lors de la connexion admin' });
  }
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

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

router.post('/check-paywall', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const config = await storage.getAppConfig();

    console.log(`[PAYWALL CHECK] Email: "${email}", requirePaywall: ${config.requirePaywall}`);

    if (!config.requirePaywall) {
      console.log(`[PAYWALL CHECK] Paywall disabled - granting access`);
      return res.json({ hasAccess: true, paywallEnabled: false });
    }

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

export default router;
