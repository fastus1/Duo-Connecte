/**
 * Authentication Middleware
 *
 * Provides Express middleware for protecting API routes.
 * Uses JWT tokens stored in httpOnly cookies for session management.
 *
 * Available middleware:
 * - requireAuth: Ensures user is logged in
 * - requireAdmin: Ensures user is logged in AND is admin
 * - optionalAuth: Adds user to request if logged in, continues if not
 *
 * Utility functions:
 * - generateSessionToken: Creates a signed JWT
 * - verifySessionToken: Validates and decodes a JWT
 * - hashPin: Hashes a user PIN with bcrypt
 * - comparePin: Compares a PIN against its hash
 * - validateUserData: Validates Circle.so postMessage data
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Use SESSION_SECRET in production (Cloud Run), fallback to JWT_SECRET for backwards compatibility
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'development-secret-change-in-production';
const BCRYPT_ROUNDS = 10;

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateSessionToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email } as JWTPayload,
    SESSION_SECRET,
    { expiresIn: '60m' }
  );
}

export function verifySessionToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, SESSION_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, BCRYPT_ROUNDS);
}

export async function comparePin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}

export interface CircleUserData {
  publicUid: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  timestamp: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates Circle.so postMessage user data.
 *
 * Checks for required fields (email) and validates format.
 * Normalizes email to lowercase and handles missing optional fields.
 * Detects unresolved Liquid templates from Circle.so.
 *
 * @param data - User data received from Circle.so postMessage
 * @returns ValidationResult with valid=true or valid=false with error message
 */
export function validateUserData(data: CircleUserData): ValidationResult {
  console.log('[VALIDATE] Received data:', JSON.stringify(data, null, 2));
  
  // Check if email is provided
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    console.log('[VALIDATE] Email missing or empty:', data.email);
    return { valid: false, error: 'Email non reçu de Circle.so. Veuillez actualiser la page dans Circle.so.' };
  }
  
  // Normalize email
  const email = data.email.trim().toLowerCase();
  
  // Check if Liquid template was not replaced (Circle.so issue)
  if (email.includes('{{') || email.includes('}}') || email.includes('member.')) {
    console.log('[VALIDATE] Liquid template not replaced:', email);
    return { valid: false, error: 'Données Circle.so non chargées. Veuillez vous reconnecter à Circle.so.' };
  }
  
  data.email = email;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('[VALIDATE] Email regex failed for:', email);
    return { valid: false, error: 'Format d\'email invalide. Veuillez vous reconnecter à Circle.so.' };
  }

  // publicUid is optional - Circle.so may not always provide it
  // Generate a fallback from email if missing
  if (!data.publicUid || typeof data.publicUid !== 'string' || data.publicUid.trim().length === 0) {
    data.publicUid = `circle_${data.email.replace(/[^a-z0-9]/gi, '_')}`;
  }

  // Accept any name, use default if empty
  if (!data.name || data.name.trim().length === 0) {
    data.name = 'Membre';
  }

  // Timestamp validation - be lenient
  if (!data.timestamp) {
    data.timestamp = Date.now();
  }
  
  const now = Date.now();
  const timestampAge = now - data.timestamp;
  // Allow up to 5 minutes (300000ms) for clock skew
  if (timestampAge > 300000 || timestampAge < -60000) {
    return { valid: false, error: 'Token expiré ou invalide' };
  }

  return { valid: true };
}

export const pinRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 64, // IPv6 subnet masking for proper rate limiting
});

/**
 * Middleware that requires user authentication.
 *
 * Validates the JWT from Authorization header, attaches user to request.
 * Returns 401 if token is missing, invalid, or expired.
 *
 * After this middleware, access user via (req as any).user
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const token = authHeader.substring(7);
  const payload = verifySessionToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Session invalide ou expirée' });
  }

  (req as any).user = payload;
  next();
}

/**
 * Factory function to create requireAdmin middleware.
 *
 * Same as requireAuth but also checks isAdmin flag from database.
 * Returns 403 if user is authenticated but not an admin.
 *
 * @param storage - Storage instance with getUser method
 * @returns Express middleware function
 */
export function createRequireAdmin(storage: { getUser: (id: string) => Promise<{ isAdmin: boolean } | undefined> }) {
  return async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    const token = authHeader.substring(7);
    const payload = verifySessionToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Session invalide ou expirée' });
    }

    // Check admin status
    const user = await storage.getUser(payload.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    (req as any).user = payload;
    (req as any).adminUser = user;
    next();
  };
}
