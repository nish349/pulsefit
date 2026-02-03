
import { pgTable, serial, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Enums
export const roleEnum = pgEnum("role", ["admin", "member"]);
export const statusEnum = pgEnum("status", ["active", "inactive", "pending_payment"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

// 2. Plans Table


export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Stored as integer (e.g. 5000 for 5000)
  features: text("features").array(), // Array of feature strings
  isActive: boolean("is_active").default(true),
});

// 3. Members Table
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash"),
  gender: genderEnum("gender").notNull(),
  dob: timestamp("dob").notNull(),
  address: text("address").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: roleEnum("role").default("member"),
  status: statusEnum("status").default("pending_payment"),
  planId: integer("plan_id").references(() => plans.id),
});

// 4. Relations
export const membersRelations = relations(members, ({ one }) => ({
  plan: one(plans, {
    fields: [members.planId],
    references: [plans.id],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  members: many(members),
}));
