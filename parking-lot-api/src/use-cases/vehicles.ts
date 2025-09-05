import { db } from "@/db";
import { vehicles } from "@/db/schemas";
import { BadRequestError } from "@/http/errors";

interface CreateVehicleParams {
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
}

export class VehiclesUseCase {
    async createVehicle({ plate, brand, model, year, color }: CreateVehicleParams) {
        try {
            const [newVehicle] = await db
                .insert(vehicles)
                .values({
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