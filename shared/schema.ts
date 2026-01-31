/**
 * Database Schema Definitions
 *
 * Defines all database tables using Drizzle ORM's pgTable.
 * Also exports Zod schemas for runtime validation.
 *
 * Tables:
 * - users: Authenticated users from Circle.so
 * - loginAttempts: Security audit log for login events
 * - appConfig: Application-wide settings (single row)
 * - paidMembers: Users who have paid for premium access
 * - feedbacks: User feedback submissions
 * - supportTickets: Support request tracking
 *
 * @see https://orm.drizzle.team/docs/sql-schema-declaration
 */
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Users table - Authenticated Circle.so members
 * Created when user first authenticates via Circle.so SSO
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  publicUid: text("public_uid").notNull().unique(),
  name: text("name").notNull(),
  pinHash: text("pin_hash"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

/**
 * Login attempts - Security audit log
 * Tracks successful and failed login attempts for rate limiting
 */
export const loginAttempts = pgTable("login_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("idx_login_attempts_user_timestamp").on(table.userId, table.timestamp),
]);

/**
 * App configuration - Application settings (singleton)
 * Single row with id='main' stores all app-wide settings
 */
export const appConfig = pgTable("app_config", {
  id: varchar("id").primaryKey().default("main"),
  requireCircleDomain: boolean("require_circle_domain").notNull().default(true),
  requireCircleLogin: boolean("require_circle_login").notNull().default(true),
  requirePaywall: boolean("require_paywall").notNull().default(false),
  requirePin: boolean("require_pin").notNull().default(true),
  paywallPurchaseUrl: text("paywall_purchase_url").default(""),
  paywallInfoUrl: text("paywall_info_url").default(""),
  paywallTitle: text("paywall_title").default("Accès Réservé"),
  paywallMessage: text("paywall_message").default("Cette application est réservée aux membres ayant souscrit à l'offre."),
  webhookAppUrl: text("webhook_app_url").default(""),
  environment: text("environment").default("development").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Paid members - Premium access list
 * Populated via webhook when user completes payment
 */
export const paidMembers = pgTable("paid_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  paymentPlan: text("payment_plan"),
  amountPaid: text("amount_paid"),
  couponUsed: text("coupon_used"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  publicUid: true,
  name: true,
  pinHash: true,
  isAdmin: true,
}).extend({
  pinHash: z.string().nullable().optional(),
});

export const insertLoginAttemptSchema = createInsertSchema(loginAttempts).pick({
  userId: true,
  success: true,
  ipAddress: true,
}).extend({
  userId: z.string().nullable().optional(),
});

export const validateCircleUserSchema = z.object({
  publicUid: z.string().min(1, "Identifiant Circle.so requis"),
  email: z.string().email("Email invalide"),
  name: z.string().min(1, "Nom requis"),
  isAdmin: z.boolean().optional().default(false),
  timestamp: z.number(),
});

export const createPinSchema = z.object({
  email: z.string().email("Email invalide"),
  public_uid: z.string().min(1, "Identifiant requis"),
  name: z.string().min(1, "Nom requis"),
  pin: z.string().regex(/^\d{4,6}$/, "Le NIP doit contenir 4 à 6 chiffres"),
  validation_token: z.string().min(1, "Token de validation requis"),
});

export const validatePinSchema = z.object({
  email: z.string().email("Email invalide"),
  pin: z.string().min(1, "NIP requis"),
});

export const updateConfigSchema = z.object({
  requireCircleDomain: z.boolean().optional(),
  requireCircleLogin: z.boolean().optional(),
  requirePaywall: z.boolean().optional(),
  requirePin: z.boolean().optional(),
  paywallPurchaseUrl: z.string().optional(),
  paywallInfoUrl: z.string().optional(),
  paywallTitle: z.string().optional(),
  paywallMessage: z.string().optional(),
  webhookAppUrl: z.string().optional(),
  environment: z.enum(['development', 'production']).optional(),
});

export const insertPaidMemberSchema = createInsertSchema(paidMembers).omit({
  id: true,
  paymentDate: true,
});

export const paymentWebhookSchema = z.object({
  event: z.literal('payment_received'),
  user: z.object({
    email: z.string().email(),
    timestamp: z.number(),
  }),
  payment: z.object({
    paywall_display_name: z.string().optional(),
    amount_paid: z.string().optional(),
    price_interval: z.string().optional(),
    coupon_code: z.string().optional(),
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLoginAttempt = z.infer<typeof insertLoginAttemptSchema>;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type AppConfig = typeof appConfig.$inferSelect;
export type InsertPaidMember = z.infer<typeof insertPaidMemberSchema>;
export type PaidMember = typeof paidMembers.$inferSelect;

export const circleUserDataSchema = z.object({
  type: z.literal('CIRCLE_USER_AUTH'),
  user: z.object({
    publicUid: z.string().optional().default(''),
    email: z.string().email(),
    name: z.string().optional().default('Membre'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    isAdmin: z.union([z.boolean(), z.string()]).optional().default(false),
    timestamp: z.number().optional().default(() => Date.now()),
  }),
  theme: z.enum(['light', 'dark']).optional(),
});

export type CircleUserData = z.infer<typeof circleUserDataSchema>;

// Session state for template (simplified)
export const sessionStateSchema = z.object({
  currentStep: z.number().min(0).default(0),
  lastUpdated: z.string().optional(),
});

export type SessionState = z.infer<typeof sessionStateSchema>;

/**
 * Feedbacks - User feedback submissions
 * Stores ratings and improvement suggestions
 */
export const feedbacks = pgTable("feedbacks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rating: integer("rating").notNull(), // 0.5-5 (demi-étoiles)
  // Popup questions
  purchaseEase: integer("purchase_ease"), // 1-5
  experienceRating: integer("experience_rating"), // 1-5
  instructionsClarity: integer("instructions_clarity"), // 1-5
  perceivedUtility: integer("perceived_utility"), // 1-5
  helpfulAspect: text("helpful_aspect"), // texte libre
  improvementSuggestion: text("improvement_suggestion"), // texte libre
  difficulties: text("difficulties"), // texte libre
  confusingElements: text("confusing_elements"), // texte libre
  technicalIssues: text("technical_issues"), // texte libre
  missingFeatures: text("missing_features"), // texte libre
  durationFeedback: text("duration_feedback"), // "too_short" | "adequate" | "too_long"
  continuedUseLikelihood: integer("continued_use_likelihood"), // 1-10
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).omit({
  id: true,
  archived: true,
  createdAt: true,
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;

/**
 * Support tickets - Help requests
 * Tracks support requests from new to resolved status
 */
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("new"), // new, in_progress, resolved
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  status: true,
  createdAt: true,
  resolvedAt: true,
});

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

