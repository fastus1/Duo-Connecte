import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  publicUid: text("public_uid").notNull().unique(),
  name: text("name").notNull(),
  pinHash: text("pin_hash").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const loginAttempts = pgTable("login_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const appConfig = pgTable("app_config", {
  id: varchar("id").primaryKey().default("main"),
  requireCircleDomain: boolean("require_circle_domain").notNull().default(true),
  requireCircleLogin: boolean("require_circle_login").notNull().default(true),
  requirePin: boolean("require_pin").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  publicUid: true,
  name: true,
  pinHash: true,
  isAdmin: true,
});

export const insertLoginAttemptSchema = createInsertSchema(loginAttempts).pick({
  userId: true,
  success: true,
  ipAddress: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLoginAttempt = z.infer<typeof insertLoginAttemptSchema>;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type AppConfig = typeof appConfig.$inferSelect;

export const circleUserDataSchema = z.object({
  type: z.literal('CIRCLE_USER_AUTH'),
  user: z.object({
    publicUid: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    isAdmin: z.boolean().optional().default(false),
    timestamp: z.number(),
  }),
  theme: z.enum(['light', 'dark']).optional(),
});

export type CircleUserData = z.infer<typeof circleUserDataSchema>;
