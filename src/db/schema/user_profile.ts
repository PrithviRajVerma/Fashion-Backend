import {date, pgTable, uuid, varchar} from "drizzle-orm/pg-core";
import { userAuth} from "./user_auth.ts";


export const userprofile = pgTable("user_profile",{
    userId : uuid("id")
        .references(() => userAuth.id ,{onDelete : "cascade"})
        .primaryKey(),
    full_name: varchar("full_name", {length:50}).notNull(),
    gender: varchar("gender", {length:10}),
    profile_picture: varchar("profile_picture_url",{length:255}),
    dob: date("dob"),
    updated_at: date("updated_at"),
})