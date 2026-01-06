
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const emailTokens = pgTable("email_tokens", {
    token: text("token").primaryKey(),
    identifier: text("identifier").notNull(),   // email
    expiresAt: timestamp("expires_at").notNull()
});
