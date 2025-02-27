import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: text("creator_id").references(() => profiles.id).notNull(),
  type: text("type").notNull().default("public"), // public, private
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Channel = typeof channels.$inferSelect;
export type NewChannel = typeof channels.$inferInsert; 