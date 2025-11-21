import { type User, type InsertUser, type LoginAttempt, type InsertLoginAttempt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPublicUid(publicUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: string): Promise<void>;
  
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

export const storage = new MemStorage();
