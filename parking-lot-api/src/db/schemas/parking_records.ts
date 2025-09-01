// src/db/schemas/parking_records.ts
import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";
import { relations } from "drizzle-orm"; // <-- 1. Importe a função 'relations'

export const parkingRecords = pgTable("parking_records", {
    id: text("id").primaryKey().$defaultFn(createId),
    vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
    entryAt: timestamp("entry_at", { withTimezone: true }).notNull().defaultNow(),
    exitAt: timestamp("exit_at", { withTimezone: true }),
}, (table) => {
    return {
        vehicleIdIdx: index("vehicle_id_idx").on(table.vehicleId),
    };
});

// --- NOVA PARTE - ADICIONE O CÓDIGO ABAIXO ---

// 2. Defina a relação entre as tabelas
export const parkingRecordsRelations = relations(parkingRecords, ({ one }) => ({
    // Diz que cada 'parkingRecord' tem um 'vehicle'
    vehicle: one(vehicles, {
        fields: [parkingRecords.vehicleId], // O campo local da relação
        references: [vehicles.id],          // O campo na outra tabela
    }),
}));