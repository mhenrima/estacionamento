import { db } from "@/db";
import { vehicles, parkingRecords } from "@/db/schemas";
import { BadRequestError, NotFoundError } from "@/http/errors";
import { eq, and, isNull, desc, asc } from "drizzle-orm";
import { parkingSpots } from "@/db/schemas";

export class ParkingRecordUseCase {

    async createEntry(plate: string) {
        const upperPlate = plate.toUpperCase();

        const vehicle = await db.query.vehicles.findFirst({
            where: eq(vehicles.plate, upperPlate),
        });

        if (!vehicle) {
            throw new NotFoundError("Veículo não cadastrado.");
        }

        const activeRecord = await db.query.parkingRecords.findFirst({
            where: and(
                eq(parkingRecords.vehicleId, vehicle.id),
                isNull(parkingRecords.exitAt)
            ),
        });

        if (activeRecord) {
            throw new BadRequestError("Este veículo já se encontra no estacionamento.");
        }



        const availableSpot = await db.query.parkingSpots.findFirst({
            where: eq(parkingSpots.status, 'available'),
            orderBy: [asc(parkingSpots.code)]
        });

        if (!availableSpot) {
            throw new BadRequestError("Estacionamento lotado.");
        }
        const [newRecord] = await db.insert(parkingRecords).values({
            vehicleId: vehicle.id,
            parkingSpotId: availableSpot.id,
        }).returning();

        await db.update(parkingSpots)
            .set({ status: 'occupied' })
            .where(eq(parkingSpots.id, availableSpot.id));

        return newRecord;
    }

    private _calculatePrice(entryAt: Date, exitAt: Date): number {
        const durationInMillis = exitAt.getTime() - entryAt.getTime();
        const durationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));

        if (durationInHours <= 1) {
            return 5.00;
        }

        const additionalHours = durationInHours - 1;
        const price = 5.00 + (additionalHours * 3.00);
        return price;
    }

    async createExit(plate: string) {
        const upperPlate = plate.toUpperCase();

        const vehicle = await db.query.vehicles.findFirst({
            where: eq(vehicles.plate, upperPlate),
        });

        if (!vehicle) {
            throw new NotFoundError("Veículo não cadastrado.");
        }

        const activeRecord = await db.query.parkingRecords.findFirst({
            where: and(
                eq(parkingRecords.vehicleId, vehicle.id),
                isNull(parkingRecords.exitAt)
            ),
        });

        if (!activeRecord) {
            throw new NotFoundError("Veículo não possui registro de entrada ativo.");
        }

        const exitAt = new Date();
        const price = this._calculatePrice(activeRecord.entryAt, exitAt);

        const [updatedRecord] = await db.update(parkingRecords)
            .set({
                exitAt: exitAt,
                totalPrice: price.toString()
            })
            .where(eq(parkingRecords.id, activeRecord.id))
            .returning();

        await db.update(parkingSpots)
            .set({ status: 'available' })
            .where(eq(parkingSpots.id, activeRecord.parkingSpotId));


        return updatedRecord;
    }


    async getActiveRecords() {
        const records = await db.query.parkingRecords.findMany({
            where: isNull(parkingRecords.exitAt),
            with: {
                vehicle: {
                    columns: {
                        plate: true,
                        brand: true,
                        model: true,
                    }
                }
            },
            orderBy: [desc(parkingRecords.entryAt)],
        });

        return records;
    }
}