import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
const BCRYPT_ROUNDS = 10;

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateSessionToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email } as JWTPayload,
    JWT_SECRET,
    { expiresIn: '60m' }
  );
}

export function verifySessionToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
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
  id: number;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  timestamp: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUserData(data: CircleUserData): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Email invalide' };
  }

  if (!data.id || typeof data.id !== 'number' || data.id <= 0) {
    return { valid: false, error: 'ID invalide' };
  }

  if (!data.name || data.name.split(' ').length < 2) {
    return { valid: false, error: 'Nom complet requis (prénom + nom)' };
  }

  const now = Date.now();
  const timestampAge = now - data.timestamp;
  if (!data.timestamp || timestampAge > 60000 || timestampAge < 0) {
    return { valid: false, error: 'Token expiré ou invalide (max 60 secondes)' };
  }

  return { valid: true };
}

export const pinRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.body.email || req.ip || 'unknown';
  },
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
