import {boolean, pgEnum, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export const authProviderEnum = pgEnum("auth_provider",[
    "EMAIL",
    "GOOGLE"
])

export const roleEnum = pgEnum("role",[
    "USER",
    "STAFF",
    "ADMIN"
])

export const userAuth = pgTable("user_auth",{
    id : uuid("id").defaultRandom().primaryKey(),
    identifier: varchar("identifier",{length:255}).unique().notNull(), // sub for oidc OR email
    passwordHashed: varchar("password",{length:150}).unique(),
    provider: authProviderEnum("auth_provider").default("GOOGLE").notNull(),
    role: roleEnum("role").default("USER").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
