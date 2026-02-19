import bcrypt from "bcrypt";
import {db} from "../config/db.ts";
import {userAuth} from "./schema";
import {eq} from "drizzle-orm";

async function seedAdmin() {
    const adminEmail = "2266prr@gmail.com";
    const password = "admin@123";


    const existing = await db.query.userAuth.findFirst(
        {where: eq(userAuth.email, adminEmail)},
    )

    if (existing) {
        console.log("Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(userAuth).values({
        email: adminEmail,
        passwordHashed: hashedPassword,
        role: "ADMIN"
    });

    console.log("Admin created successfully.");
}

seedAdmin().then(() => process.exit());
