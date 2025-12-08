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

export function validateUserData(data: CircleUserData): ValidationResult {
  // Check if email is provided
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    return { valid: false, error: 'Email non reçu de Circle.so. Veuillez actualiser la page.' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Format d\'email invalide. Veuillez actualiser la page.' };
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
