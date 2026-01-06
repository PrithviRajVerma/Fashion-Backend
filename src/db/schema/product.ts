import {pgTable, serial, varchar, integer, boolean, timestamp, uuid, text} from "drizzle-orm/pg-core";
import {category} from "./category.ts";

export const product = pgTable("products", {
    id :  uuid("id").defaultRandom().primaryKey().notNull(),
    name : varchar("name",{length : 155}).notNull(),
    slug : varchar("slug",{length : 155}).unique().notNull(),
    description : text("description"),
    categoryId: uuid("categoryId")
        .references(() => category.id)
        .notNull(),
    brand: varchar("brand",{length : 100}),
    isActive: boolean("isActive").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
});