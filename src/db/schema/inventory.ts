import {integer, pgTable, uuid} from "drizzle-orm/pg-core";
import {productVariants} from "./productVariants.ts";

export const inventory = pgTable("inventory",{
    variantId: uuid("id")
        .references(() => productVariants.id)
        .primaryKey().notNull(),
    stock: integer("stock").notNull(),
    lowStockThreshold: integer("lowStockThreshold").default(5)
})