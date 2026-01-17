import {boolean, pgEnum, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {User_Roles} from "../../api/enum/role.ts";

export const authProviderEnum = pgEnum("auth_provider",[
    "EMAIL",
    "GOOGLE",
    "BOTH"
])

export const roleEnum = pgEnum("role",User_Roles);

export const userAuth = pgTable("user_auth",{
    id : uuid("id").defaultRandom().primaryKey(),
    email: varchar("email",{length:100}).unique().notNull(),
    googleSub: varchar("google_sub",{length:255}).unique().notNull(),
    passwordHashed: varchar("passwordHashed",{length:150}),
    provider: authProviderEnum("auth_provider").default("GOOGLE").notNull(),
    role: roleEnum("role").default("USER").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
