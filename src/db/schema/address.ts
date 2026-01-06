import {decimal, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {userprofile} from "./user_profile.ts";

export const address = pgTable("address",{
    id: uuid("id").defaultRandom().primaryKey(),
    userId : uuid("userID")
        .references(() => userprofile.userId, {onDelete: "cascade"})
        .notNull(),
    latitude: decimal("latitude",{precision : 9, scale: 6}).notNull(),
    longitude: decimal("longitude",{precision : 9, scale: 6}).notNull(),
    accuracy: decimal("accuracy", { precision: 6, scale: 2 }), // meters
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    pincode: varchar("pincode", { length: 10 }),
    country: varchar("country", { length: 50 }),
    source: varchar("source", { length: 20 }).default("BROWSER"),
    createdAt: timestamp("created_at").defaultNow(),
});