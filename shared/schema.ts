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

// Raw schema to accept various field name formats from Circle.so
const rawCircleUserSchema = z.object({
  type: z.literal('CIRCLE_USER_AUTH'),
  user: z.object({
    // Accept multiple ID field names
    publicUid: z.string().optional(),
    public_uid: z.string().optional(),
    id: z.union([z.string(), z.number()]).optional(),
    // Email is usually consistent
    email: z.string().email(),
    // Name can come in different formats
    name: z.string().optional(),
    firstName: z.string().optional(),
    first_name: z.string().optional(),
    lastName: z.string().optional(),
    last_name: z.string().optional(),
    // isAdmin can be boolean or string
    isAdmin: z.union([z.boolean(), z.string()]).optional(),
    is_admin: z.union([z.boolean(), z.string()]).optional(),
    // Timestamp might not always be provided
    timestamp: z.number().optional(),
  }),
  theme: z.enum(['light', 'dark']).optional(),
});

// Transform to normalized format
export const circleUserDataSchema = rawCircleUserSchema.transform((data) => {
  const user = data.user;
  
  // Normalize publicUid
  const publicUid = user.publicUid || user.public_uid || String(user.id || user.email);
  
  // Normalize name
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  const name = user.name || `${firstName} ${lastName}`.trim() || user.email.split('@')[0];
  
  // Normalize isAdmin (handle string "true"/"false")
  const rawIsAdmin = user.isAdmin ?? user.is_admin ?? false;
  const isAdmin = rawIsAdmin === true || rawIsAdmin === 'true';
  
  // Add timestamp if not provided
  const timestamp = user.timestamp || Date.now();
  
  return {
    type: data.type as 'CIRCLE_USER_AUTH',
    user: {
      publicUid,
      email: user.email,
      name,
      firstName,
      lastName,
      isAdmin,
      timestamp,
    },
    theme: data.theme,
  };
});

export type CircleUserData = z.infer<typeof circleUserDataSchema>;
