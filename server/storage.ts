import { type User, type InsertUser, type LoginAttempt, type InsertLoginAttempt, users, loginAttempts } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and, gt } from "drizzle-orm";
import ws from "ws";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPublicUid(publicUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: string): Promise<void>;
  updateUserRole(userId: string, isAdmin: boolean): Promise<void>;
  
  // Login attempt operations
  logLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt>;
  getRecentLoginAttempts(userId: string, windowMs: number): Promise<LoginAttempt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private loginAttempts: Map<string, LoginAttempt>;

  constructor() {
    this.users = new Map();
    this.loginAttempts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByPublicUid(publicUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.publicUid === publicUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      lastLogin: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(userId, user);
    }
  }

  async updateUserRole(userId: string, isAdmin: boolean): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.isAdmin = isAdmin;
      this.users.set(userId, user);
    }
  }

  async logLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt> {
    const id = randomUUID();
    const loginAttempt: LoginAttempt = {
      ...attempt,
      id,
      ipAddress: attempt.ipAddress || null,
      timestamp: new Date(),
    };
    this.loginAttempts.set(id, loginAttempt);
    return loginAttempt;
  }

  async getRecentLoginAttempts(userId: string, windowMs: number): Promise<LoginAttempt[]> {
    const cutoffTime = new Date(Date.now() - windowMs);
    return Array.from(this.loginAttempts.values()).filter(
      (attempt) => attempt.userId === userId && attempt.timestamp > cutoffTime,
    );
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    this.db = drizzle({
      connection: databaseUrl,
      ws: ws,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByPublicUid(publicUid: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.publicUid, publicUid)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await this.db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserRole(userId: string, isAdmin: boolean): Promise<void> {
    await this.db.update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId));
  }

  async logLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt> {
    const result = await this.db.insert(loginAttempts).values(attempt).returning();
    return result[0];
  }

  async getRecentLoginAttempts(userId: string, windowMs: number): Promise<LoginAttempt[]> {
    const cutoffTime = new Date(Date.now() - windowMs);
    return await this.db.select().from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.userId, userId),
          gt(loginAttempts.timestamp, cutoffTime)
        )
      );
  }
}

// Use database storage if DATABASE_URL is set, otherwise use memory storage
const databaseUrl = process.env.DATABASE_URL;
export const storage = databaseUrl && databaseUrl !== 'memory' 
  ? new DbStorage(databaseUrl)
  : new MemStorage();
