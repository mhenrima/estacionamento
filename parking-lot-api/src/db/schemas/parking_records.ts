import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, index, decimal } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";
import { relations } from "drizzle-orm";
import { parkingSpots } from "./parking_spots";


export const parkingRecords = pgTable("parking_records", {
    id: text("id").primaryKey().$defaultFn(createId),
    vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
    parkingSpotId: text("parking_spot_id").notNull().references(() => parkingSpots.id),
    entryAt: timestamp("entry_at", { withTimezone: true }).notNull().defaultNow(),
    exitAt: timestamp("exit_at", { withTimezone: true }),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }),

}, (table) => {
    return {
        vehicleIdIdx: index("vehicle_id_idx").on(table.vehicleId),
    };
});

export const parkingRecordsRelations = relations(parkingRecords, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [parkingRecords.vehicleId],
        references: [vehicles.id],
    }),
    parkingSpot: one(parkingSpots, { fields: [parkingRecords.parkingSpotId], references: [parkingSpots.id] }),

}));