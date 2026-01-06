import {decimal, integer, pgTable, uuid} from "drizzle-orm/pg-core";
import {orders} from "./orders.ts";
import {productVariants} from "./productVariants.ts";


export const orderItems = pgTable("orderItems",{
    id : uuid("id").primaryKey().notNull(),
    orderId : uuid("orderId")
        .references(() => orders.id , {onDelete : "cascade"})
        .notNull(),
    variantId: uuid("variantId")
        .references(() => productVariants.id)
        .notNull(),
    quantity: integer("quantity").notNull(),
    price: decimal("price",{precision: 10, scale: 2}).notNull()
});