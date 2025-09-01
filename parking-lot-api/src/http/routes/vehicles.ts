import { Elysia } from "elysia";
import { createVehicleBodySchema } from "@/http/dtos/vehicles";
import { VehiclesUseCase } from "@/use-cases/vehicles";

const vehiclesUseCase = new VehiclesUseCase();

export default new Elysia({ prefix: "/api" })

    .post(
        "/vehicles",
        async ({ body, set }) => {
            const newVehicle = await vehiclesUseCase.createVehicle(body);
            set.status = 201;
            return newVehicle;
        },
        {
            body: createVehicleBodySchema,
            detail: { tags: ["Vehicles"], summary: "Register a new vehicle" },
        },
    );