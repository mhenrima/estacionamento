// src/use-cases/monthly_parkers.ts
import { db } from "@/db";
import { vehicles, monthlyParkers } from "@/db/schemas";
import { BadRequestError, NotFoundError } from "@/http/errors";
import { eq, desc } from "drizzle-orm";

interface CreateMonthlyParkerParams {
    name: string;
    document: string;
    email?: string;
    phone?: string;
    planStartDate: string;
    plate: string;
}

export class MonthlyParkerUseCase {
    /**
     * Lista todos os mensalistas
     */
    async listAll() {
        const parkers = await db.query.monthlyParkers.findMany({
            with: {
                vehicle: {
                    columns: { plate: true, model: true, color: true }
                }
            },
            orderBy: [desc(monthlyParkers.planStartDate)],
        });
        return parkers;
    }

    /**
     * Cria um novo mensalista
     */
    async create(data: CreateMonthlyParkerParams) {
        // 1. Encontrar o veículo pela placa para obter o ID
        const vehicle = await db.query.vehicles.findFirst({
            where: eq(vehicles.plate, data.plate.toUpperCase()),
        });

        if (!vehicle) {
            throw new NotFoundError("Veículo não cadastrado. Cadastre o veículo antes de associá-lo a um mensalista.");
        }

        // 2. Verificar se o veículo já está associado a outro mensalista
        const existingParkerForVehicle = await db.query.monthlyParkers.findFirst({
            where: eq(monthlyParkers.vehicleId, vehicle.id)
        });

        if (existingParkerForVehicle) {
            throw new BadRequestError("Este veículo já está associado a um plano de mensalista.");
        }

        // 3. Criar o novo registro de mensalista
        const [newParker] = await db.insert(monthlyParkers).values({
            name: data.name,
            document: data.document,
            email: data.email,
            phone: data.phone,
            planStartDate: new Date(data.planStartDate),
            vehicleId: vehicle.id,
        }).returning();

        return newParker;
    }
}