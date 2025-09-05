import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";

export const parkingSpotStatusEnum = pgEnum('parking_spot_status', ['available', 'occupied']);

export const parkingSpots = pgTable("parking_spots", {
    id: text("id").primaryKey().$defaultFn(createId),
    code: text("code").notNull().unique(),
    status: parkingSpotStatusEnum("status").notNull().default('available'),
});