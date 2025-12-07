import { type User, type InsertUser, type LoginAttempt, type InsertLoginAttempt, type AppConfig, type PaidMember, type InsertPaidMember, type Feedback, type InsertFeedback, users, loginAttempts, appConfig, paidMembers, feedbacks } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and, gt } from "drizzle-orm";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPublicUid(publicUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: string): Promise<void>;
  updateUserRole(userId: string, isAdmin: boolean): Promise<void>;
  updateUserPublicUid(userId: string, publicUid: string): Promise<void>;

  // Login attempt operations
  logLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt>;
  getRecentLoginAttempts(userId: string, windowMs: number): Promise<LoginAttempt[]>;

  // App config operations
  getAppConfig(): Promise<AppConfig>;
  updateAppConfig(config: Partial<Omit<AppConfig, 'id' | 'updatedAt'>>): Promise<AppConfig>;

  // Paid members operations
  getPaidMemberByEmail(email: string): Promise<PaidMember | undefined>;
  createPaidMember(member: InsertPaidMember): Promise<PaidMember>;
  getAllPaidMembers(): Promise<PaidMember[]>;
  deletePaidMember(email: string): Promise<void>;

  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedbacks(): Promise<Feedback[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private loginAttempts: Map<string, LoginAttempt>;
  private paidMembersMap: Map<string, PaidMember>;
  private feedbacks: Map<string, Feedback>;
  private configState: AppConfig;

  constructor() {
    this.users = new Map();
    this.loginAttempts = new Map();
    this.paidMembersMap = new Map();
    this.feedbacks = new Map();
    this.configState = {
      id: "main",
      requireCircleDomain: true,
      requireCircleLogin: true,
      requirePaywall: false,
      requirePin: true,
      paywallPurchaseUrl: "",
      paywallInfoUrl: "",
      paywallTitle: "Accès Réservé",
      paywallMessage: "Cette application est réservée aux membres ayant souscrit à l'offre.",
      webhookAppUrl: "",
      environment: "development", // Added environment here
      updatedAt: new Date(),
    };

    // Seed admin user
    this.createUser({
      email: "fastusone@gmail.com",
      pinHash: "$2b$10$FKDhHfgZhXVQWeeDzl1q0Oz9DYDoRkoG3bmQYfR2ERaWfnKSbMUy6",
      isAdmin: true,
      name: "Admin Fastus",
      publicUid: "admin-fastus",
    }).then(() => {
      console.log("Admin user seeded: fastusone@gmail.com");
    });
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
      isAdmin: insertUser.isAdmin ?? false,
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

  async updateUserPublicUid(userId: string, publicUid: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.publicUid = publicUid;
      this.users.set(userId, user);
    }
  }

  async logLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt> {
    const id = randomUUID();
    const loginAttempt: LoginAttempt = {
      id,
      userId: attempt.userId ?? null,
      success: attempt.success,
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

  async getAppConfig(): Promise<AppConfig> {
    return this.configState;
  }

  async updateAppConfig(config: Partial<Omit<AppConfig, 'id' | 'updatedAt'>>): Promise<AppConfig> {
    this.configState = {
      ...this.configState,
      ...config,
      updatedAt: new Date(),
    };
    return this.configState;
  }

  async getPaidMemberByEmail(email: string): Promise<PaidMember | undefined> {
    return this.paidMembersMap.get(email.toLowerCase());
  }

  async createPaidMember(member: InsertPaidMember): Promise<PaidMember> {
    const id = randomUUID();
    const paidMember: PaidMember = {
      id,
      email: member.email.toLowerCase(),
      paymentDate: new Date(),
      paymentPlan: member.paymentPlan ?? null,
      amountPaid: member.amountPaid ?? null,
      couponUsed: member.couponUsed ?? null,
    };
    this.paidMembersMap.set(paidMember.email, paidMember);
    return paidMember;
  }

  async getAllPaidMembers(): Promise<PaidMember[]> {
    return Array.from(this.paidMembersMap.values());
  }

  async deletePaidMember(email: string): Promise<void> {
    this.paidMembersMap.delete(email.toLowerCase());
  }




  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      id,
      rating: insertFeedback.rating,
      helpfulAspect: insertFeedback.helpfulAspect ?? null,
      improvementSuggestion: insertFeedback.improvementSuggestion ?? null,
      createdAt: new Date(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle({ client: pool });
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

  async updateUserPublicUid(userId: string, publicUid: string): Promise<void> {
    await this.db.update(users)
      .set({ publicUid })
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

  async getAppConfig(): Promise<AppConfig> {
    const result = await this.db.select().from(appConfig).where(eq(appConfig.id, "main")).limit(1);
    if (result[0]) {
      return result[0];
    }
    try {
      const newConfig = await this.db.insert(appConfig).values({ id: "main" }).returning();
      return newConfig[0];
    } catch (error: any) {
      if (error.code === '23505') {
        const retry = await this.db.select().from(appConfig).where(eq(appConfig.id, "main")).limit(1);
        if (retry[0]) return retry[0];
      }
      throw error;
    }
  }

  async updateAppConfig(config: Partial<Omit<AppConfig, 'id' | 'updatedAt'>>): Promise<AppConfig> {
    const result = await this.db.update(appConfig)
      .set({
        ...config,
        updatedAt: new Date()
      })
      .where(eq(appConfig.id, "main"))
      .returning();
    return result[0];
  }

  async getPaidMemberByEmail(email: string): Promise<PaidMember | undefined> {
    const result = await this.db.select().from(paidMembers)
      .where(eq(paidMembers.email, email.toLowerCase()))
      .limit(1);
    return result[0];
  }

  async createPaidMember(member: InsertPaidMember): Promise<PaidMember> {
    const result = await this.db.insert(paidMembers).values({
      ...member,
      email: member.email.toLowerCase(),
    }).returning();
    return result[0];
  }

  async getAllPaidMembers(): Promise<PaidMember[]> {
    return await this.db.select().from(paidMembers);
  }

  async deletePaidMember(email: string): Promise<void> {
    await this.db.delete(paidMembers).where(eq(paidMembers.email, email.toLowerCase()));
  }




  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedback] = await this.db
      .insert(feedbacks)
      .values({
        rating: insertFeedback.rating,
        helpfulAspect: insertFeedback.helpfulAspect ?? null,
        improvementSuggestion: insertFeedback.improvementSuggestion ?? null,
      })
      .returning();
    return feedback;
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return await this.db.select().from(feedbacks).orderBy(feedbacks.createdAt);
  }
}

// Use database storage if DATABASE_URL is set, otherwise use memory storage
const databaseUrl = process.env.DATABASE_URL;
export const storage = databaseUrl && databaseUrl !== 'memory'
  ? new DbStorage(databaseUrl)
  : new MemStorage();
