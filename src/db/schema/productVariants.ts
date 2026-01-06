import {decimal, pgTable, uuid, varchar} from "drizzle-orm/pg-core";
import {product} from "./product.ts";

export const productVariants = pgTable("product_variants", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").references(() => product.id).notNull(),
    size: varchar("size", { length: 10 }).notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    sku: varchar("sku", { length: 50 }).unique().notNull(),
});