import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import {userprofile} from "./user_profile.ts";
import {product} from "./product.ts";


export const reviews = pgTable("reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => userprofile.userId).notNull(),
    productId: uuid("product_id").references(() => product.id).notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
});
