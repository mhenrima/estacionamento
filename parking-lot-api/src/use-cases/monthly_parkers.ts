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


    async create(data: CreateMonthlyParkerParams) {
        console.log("[USE CASE] Tentando criar mensalista com os dados:", data);

        const vehicle = await db.query.vehicles.findFirst({
            where: eq(vehicles.plate, data.plate.toUpperCase()),
        });

        if (!vehicle) {
            console.error("[USE CASE] ERRO: Veículo com a placa informada não foi encontrado.");
            throw new NotFoundError("Veículo não cadastrado. Cadastre o veículo antes de associá-lo a um mensalista.");
        }

        const existingParkerForVehicle = await db.query.monthlyParkers.findFirst({
            where: eq(monthlyParkers.vehicleId, vehicle.id)
        });

        if (existingParkerForVehicle) {
            console.error("[USE CASE] ERRO: Veículo já associado a outro mensalista.");
            throw new BadRequestError("Este veículo já está associado a um plano de mensalista.");
        }

        try {
            const [newParker] = await db.insert(monthlyParkers).values({
                name: data.name,
                document: data.document,
                email: data.email,
                phone: data.phone,
                planStartDate: new Date(data.planStartDate),
                vehicleId: vehicle.id,
            }).returning();
            console.log("[USE CASE] Mensalista criado com sucesso no banco de dados.");

            return newParker;
        }
        catch (error: any) {
            console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.error("!! [USE CASE] OCORREU UM ERRO AO INSERIR NO BANCO !!");
            console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.error("Erro capturado:", error);

            if (error.code === '23505' && error.constraint_name?.includes('document_unique')) {
                throw new BadRequestError("Já existe um mensalista cadastrado com este documento.");
            }
            throw error;
        }

    }
}