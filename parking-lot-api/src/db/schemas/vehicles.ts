import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
    id: text("id").primaryKey().$defaultFn(createId),
    plate: text("plate").notNull().unique(),
    brand: text("brand").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    color: text("color").notNull(),
    createdAt: timestamp("created\_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated\_at", { withTimezone: true }).notNull().defaultNow(),
});