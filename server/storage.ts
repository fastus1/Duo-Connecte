/**
 * Storage Layer - Database Access Interface
 *
 * Provides a unified interface for all database operations.
 * Uses the Repository pattern to abstract Drizzle ORM queries.
 *
 * Two implementations:
 * - MemStorage: In-memory storage for testing (seeds default admin)
 * - DbStorage: PostgreSQL via Drizzle ORM (production)
 *
 * Usage:
 *   import { storage } from './storage';
 *   const user = await storage.getUser(id);
 *
 * The active implementation is exported as `storage` singleton.
 * Selection based on DATABASE_URL environment variable.
 */
import { type User, type InsertUser, type LoginAttempt, type InsertLoginAttempt, type AppConfig, type PaidMember, type InsertPaidMember, type Feedback, type InsertFeedback, type SupportTicket, type InsertSupportTicket, users, loginAttempts, appConfig, paidMembers, feedbacks, supportTickets } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and, gt } from "drizzle-orm";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

/**
 * Storage interface defining all database operations.
 * Both MemStorage and DbStorage implement this interface.
 */
export interface IStorage {
  // User operations
  /** Retrieves user by ID */
  getUser(id: string): Promise<User | undefined>;
  /** Retrieves user by email address */
  getUserByEmail(email: string): Promise<User | undefined>;
  /** Retrieves user by Circle.so public UID */
  getUserByPublicUid(publicUid: string): Promise<User | undefined>;
  /** Creates new user record */
  createUser(user: InsertUser): Promise<User>;
  /** Updates user's last login timestamp */
  updateUserLastLogin(userId: string): Promise<void>;
  /** Updates user's admin role status */
  updateUserRole(userId: string, isAdmin: boolean): Promise<void>;
  /** Updates user's Circle.so public UID */
  updateUserPublicUid(userId: string, publicUid: string): Promise<void>;
  /** Updates or clears user's PIN hash */
  updateUserPin(userId: string, pinHash: string | null): Promise<void>;
  /** Deletes user and associated login attempts */
  deleteUser(userId: string): Promise<void>;

  // Login attempt operations
  /** Records a login attempt for security auditing */
  logLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt>;
  /** Gets login attempts within time window for rate limiting */
  getRecentLoginAttempts(userId: string, windowMs: number): Promise<LoginAttempt[]>;

  // App config operations
  /** Retrieves application configuration (singleton) */
  getAppConfig(): Promise<AppConfig>;
  /** Updates application configuration */
  updateAppConfig(config: Partial<Omit<AppConfig, 'id' | 'updatedAt'>>): Promise<AppConfig>;

  // Paid members operations
  /** Checks if email has paid access */
  getPaidMemberByEmail(email: string): Promise<PaidMember | undefined>;
  /** Adds a paid member (via webhook) */
  createPaidMember(member: InsertPaidMember): Promise<PaidMember>;
  /** Lists all paid members */
  getAllPaidMembers(): Promise<PaidMember[]>;
  /** Removes paid member access */
  deletePaidMember(email: string): Promise<void>;

  // Feedback operations
  /** Stores user feedback submission */
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  /** Gets all non-archived feedbacks */
  getAllFeedbacks(): Promise<Feedback[]>;
  /** Gets archived feedbacks */
  getArchivedFeedbacks(): Promise<Feedback[]>;
  /** Archives a feedback entry */
  archiveFeedback(id: string): Promise<void>;
  /** Restores archived feedback */
  unarchiveFeedback(id: string): Promise<void>;
  /** Permanently deletes feedback */
  deleteFeedback(id: string): Promise<void>;

  // Support ticket operations
  /** Creates a new support ticket */
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  /** Gets all support tickets */
  getAllSupportTickets(): Promise<SupportTicket[]>;
  /** Gets a single support ticket */
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  /** Updates ticket status (new/in_progress/resolved) */
  updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket | undefined>;
  /** Deletes a support ticket */
  deleteSupportTicket(id: string): Promise<void>;
}

/**
 * In-memory storage implementation.
 * Used for development/testing when DATABASE_URL is not set.
 * Seeds a default admin user on initialization.
 */
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private loginAttempts: Map<string, LoginAttempt>;
  private paidMembersMap: Map<string, PaidMember>;
  private feedbacks: Map<string, Feedback>;
  private supportTicketsMap: Map<string, SupportTicket>;
  private configState: AppConfig;

  constructor() {
    this.users = new Map();
    this.loginAttempts = new Map();
    this.paidMembersMap = new Map();
    this.feedbacks = new Map();
    this.supportTicketsMap = new Map();
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
      pinHash: insertUser.pinHash ?? null,
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

  async updateUserPin(userId: string, pinHash: string | null): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.pinHash = pinHash;
      this.users.set(userId, user);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    this.users.delete(userId);
    Array.from(this.loginAttempts.entries()).forEach(([id, attempt]) => {
      if (attempt.userId === userId) {
        this.loginAttempts.delete(id);
      }
    });
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
      purchaseEase: insertFeedback.purchaseEase ?? null,
      experienceRating: insertFeedback.experienceRating ?? null,
      instructionsClarity: insertFeedback.instructionsClarity ?? null,
      perceivedUtility: insertFeedback.perceivedUtility ?? null,
      difficulties: insertFeedback.difficulties ?? null,
      confusingElements: insertFeedback.confusingElements ?? null,
      technicalIssues: insertFeedback.technicalIssues ?? null,
      missingFeatures: insertFeedback.missingFeatures ?? null,
      durationFeedback: insertFeedback.durationFeedback ?? null,
      continuedUseLikelihood: insertFeedback.continuedUseLikelihood ?? null,
      archived: false,
      createdAt: new Date(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(f => !f.archived);
  }

  async getArchivedFeedbacks(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(f => f.archived);
  }

  async archiveFeedback(id: string): Promise<void> {
    const feedback = this.feedbacks.get(id);
    if (feedback) {
      feedback.archived = true;
      this.feedbacks.set(id, feedback);
    }
  }

  async unarchiveFeedback(id: string): Promise<void> {
    const feedback = this.feedbacks.get(id);
    if (feedback) {
      feedback.archived = false;
      this.feedbacks.set(id, feedback);
    }
  }

  async deleteFeedback(id: string): Promise<void> {
    this.feedbacks.delete(id);
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const id = randomUUID();
    const supportTicket: SupportTicket = {
      id,
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      description: ticket.description,
      status: "new",
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.supportTicketsMap.set(id, supportTicket);
    return supportTicket;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    return this.supportTicketsMap.get(id);
  }

  async updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket | undefined> {
    const ticket = this.supportTicketsMap.get(id);
    if (ticket) {
      ticket.status = status;
      if (status === "resolved") {
        ticket.resolvedAt = new Date();
      }
      this.supportTicketsMap.set(id, ticket);
      return ticket;
    }
    return undefined;
  }

  async deleteSupportTicket(id: string): Promise<void> {
    this.supportTicketsMap.delete(id);
  }
}

/**
 * PostgreSQL implementation of IStorage interface.
 * Uses Drizzle ORM for type-safe database queries.
 * Connects via Neon serverless driver with WebSocket support.
 */
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

  async updateUserPin(userId: string, pinHash: string | null): Promise<void> {
    await this.db.update(users)
      .set({ pinHash })
      .where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.delete(loginAttempts).where(eq(loginAttempts.userId, userId));
    await this.db.delete(users).where(eq(users.id, userId));
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
        purchaseEase: insertFeedback.purchaseEase ?? null,
        experienceRating: insertFeedback.experienceRating ?? null,
        instructionsClarity: insertFeedback.instructionsClarity ?? null,
        perceivedUtility: insertFeedback.perceivedUtility ?? null,
        difficulties: insertFeedback.difficulties ?? null,
        confusingElements: insertFeedback.confusingElements ?? null,
        technicalIssues: insertFeedback.technicalIssues ?? null,
        missingFeatures: insertFeedback.missingFeatures ?? null,
        durationFeedback: insertFeedback.durationFeedback ?? null,
        continuedUseLikelihood: insertFeedback.continuedUseLikelihood ?? null,
      })
      .returning();
    return feedback;
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return await this.db.select().from(feedbacks)
      .where(eq(feedbacks.archived, false))
      .orderBy(feedbacks.createdAt);
  }

  async getArchivedFeedbacks(): Promise<Feedback[]> {
    return await this.db.select().from(feedbacks)
      .where(eq(feedbacks.archived, true))
      .orderBy(feedbacks.createdAt);
  }

  async archiveFeedback(id: string): Promise<void> {
    await this.db.update(feedbacks)
      .set({ archived: true })
      .where(eq(feedbacks.id, id));
  }

  async unarchiveFeedback(id: string): Promise<void> {
    await this.db.update(feedbacks)
      .set({ archived: false })
      .where(eq(feedbacks.id, id));
  }

  async deleteFeedback(id: string): Promise<void> {
    await this.db.delete(feedbacks).where(eq(feedbacks.id, id));
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [result] = await this.db.insert(supportTickets).values({
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      description: ticket.description,
    }).returning();
    return result;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await this.db.select().from(supportTickets).orderBy(supportTickets.createdAt);
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const result = await this.db.select().from(supportTickets)
      .where(eq(supportTickets.id, id))
      .limit(1);
    return result[0];
  }

  async updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket | undefined> {
    const updates: Partial<SupportTicket> = { status };
    if (status === "resolved") {
      updates.resolvedAt = new Date();
    }
    const [result] = await this.db.update(supportTickets)
      .set(updates)
      .where(eq(supportTickets.id, id))
      .returning();
    return result;
  }

  async deleteSupportTicket(id: string): Promise<void> {
    await this.db.delete(supportTickets).where(eq(supportTickets.id, id));
  }
}

// Use database storage if DATABASE_URL is set, otherwise use memory storage
const databaseUrl = process.env.DATABASE_URL;
export const storage = databaseUrl && databaseUrl !== 'memory'
  ? new DbStorage(databaseUrl)
  : new MemStorage();
