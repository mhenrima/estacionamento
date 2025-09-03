// parking-lot-api/src/use-cases/parking_spots.ts
import { db } from "@/db";
import { parkingSpots, parkingRecords, vehicles } from "@/db/schemas";
import { eq, isNull, sql, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export class ParkingSpotUseCase {
    async configureSpots(totalSpots: number) {
        // Apaga todas as vagas existentes para recomeçar
        await db.delete(parkingSpots);

        const spotsToInsert = [];
        for (let i = 1; i <= totalSpots; i++) {
            spotsToInsert.push({
                code: `V${i.toString().padStart(3, '0')}`, // Gera V001, V002, etc.
            });
        }
        await db.insert(parkingSpots).values(spotsToInsert);
        return { message: `${totalSpots} vagas criadas com sucesso.` };
    }

    async getSpotsWithStatus() {
        const activeRecords = alias(parkingRecords, "activeRecords");
        const vehicleInfo = alias(vehicles, "vehicleInfo");

        const spots = await db.select({
            id: parkingSpots.id,
            code: parkingSpots.code,
            status: parkingSpots.status,
            plate: vehicleInfo.plate,
        })
            .from(parkingSpots)
            .leftJoin(
                activeRecords,
                and(
                    eq(activeRecords.parkingSpotId, parkingSpots.id),
                    isNull(activeRecords.exitAt)
                )
            )
            .leftJoin(vehicleInfo, eq(activeRecords.vehicleId, vehicleInfo.id))
            .orderBy(parkingSpots.code);

        return spots;
    }
}