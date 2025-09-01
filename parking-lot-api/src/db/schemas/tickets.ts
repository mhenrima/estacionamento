import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const tickets = pgTable("tickets", {
    id: text("id").primaryKey().$defaultFn(createId),
    plate: text("plate").notNull(),
    entryTime: timestamp("entry_time", { withTimezone: true }).notNull().defaultNow(),
});