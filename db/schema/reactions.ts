import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { messages } from "./messages";

export const reactions = pgTable("reactions", {
  id: text("id").primaryKey(),
  emoji: text("emoji").notNull(),
  messageId: text("message_id").references(() => messages.id).notNull(),
  profileId: text("profile_id").references(() => profiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Use a unique index to prevent duplicate reactions
  uniqueReaction: uniqueIndex("unique_reaction_idx").on(table.messageId, table.profileId, table.emoji)
}));

export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert; 