import {decimal, pgEnum, pgTable, timestamp, uuid} from "drizzle-orm/pg-core";
import {userAuth} from "./user_auth.ts";
import {userprofile} from "./user_profile.ts";


export const orderStatusEnum = pgEnum("orderStatus", [
    "PLACED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "CANCELED",
    "RETURNED"
]);

export const paymentStatusEnum = pgEnum("paymentStatus", [
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED"
]);

export const orders = pgTable("orders",{
    id : uuid("id").defaultRandom().primaryKey().notNull(),
    userId : uuid("userId")
        .references(() => userprofile.userId)
        .notNull(),
    totalAmount: decimal("totalAmount", {precision: 10 , scale: 2}).notNull(),
    Status : orderStatusEnum("orderStatus").default("PLACED").notNull(),
    paymentStatus: paymentStatusEnum("paymentStatus").default("PENDING").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull()
})