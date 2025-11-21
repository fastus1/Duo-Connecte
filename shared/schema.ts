import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  circleId: integer("circle_id").notNull(),
  name: text("name").notNull(),
  pinHash: text("pin_hash").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  circleId: true,
  name: true,
  pinHash: true,
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

export const circleUserDataSchema = z.object({
  type: z.literal('CIRCLE_USER_AUTH'),
  user: z.object({
    id: z.number().positive(),
    email: z.string().email(),
    name: z.string().min(1),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    timestamp: z.number(),
  }),
});

export type CircleUserData = z.infer<typeof circleUserDataSchema>;
