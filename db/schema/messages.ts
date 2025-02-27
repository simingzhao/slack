import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { channels } from "./channels";

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  channelId: text("channel_id").references(() => channels.id).notNull(),
  profileId: text("profile_id").references(() => profiles.id).notNull(),
  parentId: text("parent_id"), // Simple foreign key to messages.id (for threads)
  isEdited: boolean("is_edited").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert; 