import { db } from "@/db";
import { vehicles } from "@/db/schemas";
import { BadRequestError } from "@/http/errors";

// 1. A interface agora é mais simples, sem 'organizationId'
interface CreateVehicleParams {
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
}

export class VehiclesUseCase {
    // 2. O método também não espera mais o 'organizationId'
    async createVehicle({ plate, brand, model, year, color }: CreateVehicleParams) {
        try {
            const [newVehicle] = await db
                .insert(vehicles)
                .values({ // 3. A inserção no banco também foi simplificada
                    plate: plate.toUpperCase(),
                    brand,
                    model,
                    year,
                    color,
                })
                .returning({ id: vehicles.id });

            return newVehicle;
        } catch (error: any) {
            if (error.code === '23505' && error.constraint_name === 'vehicles_plate_unique') {
                throw new BadRequestError("Esta placa de veículo já está cadastrada.");
            }
            throw error;
        }
    }
}