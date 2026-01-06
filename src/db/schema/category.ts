import {pgTable, uuid, varchar} from "drizzle-orm/pg-core";

export const category = pgTable("category",{
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name : varchar("name", {length : 50}).notNull(),
    slug : varchar("slug", {length : 50}).notNull(),
})