// src/use-cases/parking_records.ts
import { db } from "@/db";
import { vehicles, parkingRecords } from "@/db/schemas";
import { BadRequestError, NotFoundError } from "@/http/errors";
import { eq, and, isNull, desc } from "drizzle-orm";

export class ParkingRecordUseCase {
    /**
     * Registra a entrada de um veículo pela placa.
     */
    async createEntry(plate: string) {
        const upperPlate = plate.toUpperCase();

        // 1. Encontrar o veículo pelo ID
        const vehicle = await db.query.vehicles.findFirst({
            where: eq(vehicles.plate, upperPlate),
        });

        if (!vehicle) {
            throw new NotFoundError("Veículo não cadastrado.");
        }

        // 2. Verificar se o veículo já tem uma entrada ativa (sem saída)
        const activeRecord = await db.query.parkingRecords.findFirst({
            where: and(
                eq(parkingRecords.vehicleId, vehicle.id),
                isNull(parkingRecords.exitAt)
            ),
        });

        if (activeRecord) {
            throw new BadRequestError("Este veículo já se encontra no estacionamento.");
        }

        // 3. Criar o novo registro de entrada
        const [newRecord] = await db.insert(parkingRecords).values({
            vehicleId: vehicle.id,
        }).returning();

        return newRecord;
    }

    /**
     * Registra a saída de um veículo pela placa.
     */
    async createExit(plate: string) {
        const upperPlate = plate.toUpperCase();

        // 1. Encontrar o veículo
        const vehicle = await db.query.vehicles.findFirst({
            where: eq(vehicles.plate, upperPlate),
        });

        if (!vehicle) {
            throw new NotFoundError("Veículo não cadastrado.");
        }

        // 2. Encontrar o registro de entrada ativo
        const activeRecord = await db.query.parkingRecords.findFirst({
            where: and(
                eq(parkingRecords.vehicleId, vehicle.id),
                isNull(parkingRecords.exitAt)
            ),
        });

        if (!activeRecord) {
            throw new NotFoundError("Veículo não possui registro de entrada ativo.");
        }

        // 3. Atualizar o registro com a data e hora da saída
        const [updatedRecord] = await db.update(parkingRecords)
            .set({ exitAt: new Date() })
            .where(eq(parkingRecords.id, activeRecord.id))
            .returning();

        return updatedRecord;
    }

    /**
     * Retorna todos os veículos que estão atualmente no estacionamento.
     */
    async getActiveRecords() {
        const records = await db.query.parkingRecords.findMany({
            where: isNull(parkingRecords.exitAt),
            with: {
                // Inclui os dados do veículo relacionado (join)
                vehicle: {
                    columns: {
                        plate: true,
                        brand: true,
                        model: true,
                    }
                }
            },
            orderBy: [desc(parkingRecords.entryAt)], // Mais recentes primeiro
        });

        return records;
    }
}