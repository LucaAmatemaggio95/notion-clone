import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// name inside the quotes are the actual names of the fields inside the DB
export const $notes = pgTable("note", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("image_url"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state"),
});

export type NoteType = typeof $notes.$inferInsert;
