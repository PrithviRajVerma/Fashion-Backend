import {integer, pgTable, uuid} from "drizzle-orm/pg-core";
import {userAuth} from "./user_auth.ts";
import {productVariants} from "./productVariants.ts";
import {userprofile} from "./user_profile.ts";



export const cartItems = pgTable("cartItems",{
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
        .references(() => userprofile.userId)
        .notNull(),
    productVariant: uuid("productVariant")
        .references(()=> productVariants.id)
        .notNull(),
    quantity: integer("quantity").notNull(),
})