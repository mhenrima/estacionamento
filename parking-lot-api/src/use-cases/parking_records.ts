// src/use-cases/parking_records.ts
import { db } from "@/db";
import { vehicles, parkingRecords } from "@/db/schemas";
import { BadRequestError, NotFoundError } from "@/http/errors";
import { eq, and, isNull, desc, asc } from "drizzle-orm";
import { parkingSpots } from "@/db/schemas"; // Importe o schema de vagas


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



        const availableSpot = await db.query.parkingSpots.findFirst({
            where: eq(parkingSpots.status, 'available'),
            orderBy: [asc(parkingSpots.code)] // Ordena por V001, V002, etc. e pega a primeira
        });

        if (!availableSpot) {
            throw new BadRequestError("Estacionamento lotado.");
        }
        // -> Nova Lógica: Criar o registro VINCULADO à vaga
        const [newRecord] = await db.insert(parkingRecords).values({
            vehicleId: vehicle.id,
            parkingSpotId: availableSpot.id, // Vincula a vaga
        }).returning();

        // -> Nova Lógica: Marcar a vaga como ocupada
        await db.update(parkingSpots)
            .set({ status: 'occupied' })
            .where(eq(parkingSpots.id, availableSpot.id));

        return newRecord;
    }

    private _calculatePrice(entryAt: Date, exitAt: Date): number {
        const durationInMillis = exitAt.getTime() - entryAt.getTime();
        // Converte a duração de milissegundos para horas
        const durationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));

        if (durationInHours <= 1) {
            return 5.00; // R$ 5 para a primeira hora (ou menos)
        }

        const additionalHours = durationInHours - 1;
        const price = 5.00 + (additionalHours * 3.00); // R$ 5 da primeira hora + R$ 3 por hora adicional

        return price;
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

        const exitAt = new Date();
        // -> 1. Chama o método de cálculo
        const price = this._calculatePrice(activeRecord.entryAt, exitAt);

        // -> 2. Atualiza o registro com a data da saída E o preço calculado
        const [updatedRecord] = await db.update(parkingRecords)
            .set({
                exitAt: exitAt,
                totalPrice: price.toString() // Drizzle espera o decimal como string
            })
            .where(eq(parkingRecords.id, activeRecord.id))
            .returning();

        await db.update(parkingSpots)
            .set({ status: 'available' })
            .where(eq(parkingSpots.id, activeRecord.parkingSpotId));


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