import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const loginAttempts = pgTable("login_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("idx_login_attempts_user_timestamp").on(table.userId, table.timestamp),
]);

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
    timestamp: z.number(),
  }),
  theme: z.enum(['light', 'dark']).optional(),
});

export type CircleUserData = z.infer<typeof circleUserDataSchema>;

// Session state for conversation flow
export const sessionStateSchema = z.object({
  senderName: z.string().min(1),
  receiverName: z.string().min(1),
  currentStep: z.number().min(0).max(38),
  // App type (Duo only - Solo moved to separate app)
  appType: z.literal('duo').optional(),
  // Checklist states (parcours normal)
  checklistSituation: z.boolean().optional(),
  checklistVecu: z.boolean().optional(),
  checklistInterpretation: z.boolean().optional(),
  checklistImpact: z.boolean().optional(),
  // Checklist states (parcours inversé)
  checklistVecuInverse: z.boolean().optional(),
  checklistInterpretationInverse: z.boolean().optional(),
  checklistImpactInverse: z.boolean().optional(),
  // Follow-up needed
  suiviNecessaire: z.boolean().optional(),
  // Timestamp for session tracking
  lastUpdated: z.string().optional(),
});

export type SessionState = z.infer<typeof sessionStateSchema>;

// Feedback table for anonymous user feedback
export const feedbacks = pgTable("feedbacks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rating: integer("rating").notNull(), // 0.5-5 (demi-étoiles)
  // Popup questions
  purchaseEase: integer("purchase_ease"), // 1-5
  experienceDescription: text("experience_description"), // texte court
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

// Support tickets table
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

// Flow configuration (Solo moved to separate app)
export type FlowType = 'duo';

export interface FlowConfig {
  type: FlowType;
  label: string;
  progressColor: string; // CSS color for progress indicator
  pages: ReadonlyArray<{
    id: number;
    path: string;
    section: number;
  }>;
}

// Duo flow configuration (Welcome is now a separate landing page)
export const duoFlow: FlowConfig = {
  type: 'duo',
  label: 'Communication authentique',
  progressColor: 'hsl(221, 83%, 53%)', // Blue for duo
  pages: [
    { id: 0, path: "/duo/presentation", section: 0 },
    { id: 1, path: "/duo/roles", section: 0 },
    { id: 2, path: "/duo/warnings", section: 0 },
    { id: 3, path: "/duo/intention", section: 1 },
    { id: 4, path: "/duo/sender-grounding", section: 1 },
    { id: 5, path: "/duo/receiver-grounding", section: 1 },
    { id: 6, path: "/duo/transition-1", section: 1 },
    { id: 7, path: "/duo/sender-situation", section: 2 },
    { id: 8, path: "/duo/sender-experience", section: 2 },
    { id: 9, path: "/duo/sender-interpretation", section: 2 },
    { id: 10, path: "/duo/sender-impact", section: 2 },
    { id: 11, path: "/duo/sender-summary", section: 2 },
    { id: 12, path: "/duo/receiver-validation", section: 3 },
    { id: 13, path: "/duo/sender-confirmation", section: 3 },
    { id: 14, path: "/duo/receiver-experience", section: 4 },
    { id: 15, path: "/duo/sender-validation", section: 5 },
    { id: 16, path: "/duo/receiver-confirmation", section: 5 },
    { id: 17, path: "/duo/transition-2", section: 5 },
    { id: 18, path: "/duo/sender-needs", section: 6 },
    { id: 19, path: "/duo/receiver-response", section: 6 },
    { id: 20, path: "/duo/transition-3", section: 6 },
    { id: 21, path: "/duo/sender-closing", section: 7 },
    { id: 22, path: "/duo/receiver-closing", section: 7 },
    { id: 23, path: "/duo/feedback", section: 7 },
    { id: 24, path: "/duo/completion", section: 7 },
    // Parcours inversé (7a-20a)
    { id: 25, path: "/duo/inversion-des-roles/page-7a", section: 2 },
    { id: 26, path: "/duo/inversion-des-roles/page-8a", section: 2 },
    { id: 27, path: "/duo/inversion-des-roles/page-9a", section: 2 },
    { id: 28, path: "/duo/inversion-des-roles/page-10a", section: 2 },
    { id: 29, path: "/duo/inversion-des-roles/page-11a", section: 2 },
    { id: 30, path: "/duo/inversion-des-roles/page-12a", section: 3 },
    { id: 31, path: "/duo/inversion-des-roles/page-13a", section: 3 },
    { id: 32, path: "/duo/inversion-des-roles/page-14a", section: 4 },
    { id: 33, path: "/duo/inversion-des-roles/page-15a", section: 5 },
    { id: 34, path: "/duo/inversion-des-roles/page-16a", section: 5 },
    { id: 35, path: "/duo/inversion-des-roles/page-17a", section: 5 },
    { id: 36, path: "/duo/inversion-des-roles/page-18a", section: 6 },
    { id: 37, path: "/duo/inversion-des-roles/page-19a", section: 6 },
    { id: 38, path: "/duo/inversion-des-roles/page-20a", section: 6 },
  ],
};

// Helper to get flow configuration (always returns duoFlow now)
export function getFlow(_appType?: FlowType): FlowConfig {
  return duoFlow;
}

// Legacy pages export for backward compatibility (defaults to duo)
export const pages = duoFlow.pages;

export const sectionNames = [
  "Bienvenue",
  "Mettre la table",
  "Le vif du sujet - Émetteur",
  "Récepteur - Valider l'émetteur",
  "Ce que vit le récepteur",
  "Valider le récepteur",
  "Demande et besoin",
  "Clôture",
] as const;
