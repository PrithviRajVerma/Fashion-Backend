import {boolean, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {userAuth} from "./user_auth.ts";


export const RefreshToken = pgTable("refresh_token",{
    id : uuid("id").defaultRandom().notNull(),
    userId : uuid("userID")
        .references(() => userAuth.id)
        .notNull(),
    token_hashed: varchar("token_hashed",{length:255}).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isRevoked: boolean("isRevoked").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull()
});