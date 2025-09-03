// parking-lot-api/src/db/schemas/parking_spots.ts
import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";

// Definimos os status possíveis para uma vaga
export const parkingSpotStatusEnum = pgEnum('parking_spot_status', ['available', 'occupied']);

export const parkingSpots = pgTable("parking_spots", {
    id: text("id").primaryKey().$defaultFn(createId),
    code: text("code").notNull().unique(), // Ex: "A01", "B12"
    status: parkingSpotStatusEnum("status").notNull().default('available'),
});