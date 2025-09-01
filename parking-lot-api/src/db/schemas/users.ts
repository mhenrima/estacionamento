import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["admin", "user"]);

export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(createId),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: rolesEnum("role").notNull().default("user"),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});