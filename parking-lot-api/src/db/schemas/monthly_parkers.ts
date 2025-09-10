import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vehicles } from "./vehicles";

export const monthlyPlanStatusEnum = pgEnum('monthly_plan_status', ['active', 'inactive', 'expired']);

export const monthlyParkers = pgTable("monthly_parkers", {
    id: text("id").primaryKey().$defaultFn(createId),
    name: text("name").notNull(),
    document: text("document").notNull().unique(),
    email: text("email"),
    phone: text("phone"),
    planStartDate: timestamp("plan_start_date", { withTimezone: true }).notNull().defaultNow(),
    planEndDate: timestamp("plan_end_date", { withTimezone: true }),
    status: monthlyPlanStatusEnum("status").notNull().default('active'),

    vehicleId: text("vehicle_id").notNull().unique().references(() => vehicles.id),

}, (table) => {
    return {
        vehicleIdIdx: index("monthly_parker_vehicle_id_idx").on(table.vehicleId),
    };
});

export const monthlyParkersRelations = relations(monthlyParkers, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [monthlyParkers.vehicleId],
        references: [vehicles.id],
    }),
}));