// src/http/routes/parking_records.ts
import { Elysia } from "elysia";
import { createRecordByPlateSchema } from "@/http/dtos/parking_records";
import { ParkingRecordUseCase } from "@/use-cases/parking_records";

const parkingRecordUseCase = new ParkingRecordUseCase();

export const parkingRecordRoutes = new Elysia({ prefix: "/records" })
    // Endpoint para buscar veículos que estão no estacionamento
    .get("/active", async () => {
        return await parkingRecordUseCase.getActiveRecords();
    })

    // Endpoint para registrar uma nova entrada
    .post(
        "/entry",
        async ({ body, set }) => {
            const newEntry = await parkingRecordUseCase.createEntry(body.plate);
            set.status = 201;
            return newEntry;
        },
        {
            body: createRecordByPlateSchema,
        }
    )

    // Endpoint para registrar uma saída
    .patch( // Usamos PATCH pois é uma atualização parcial
        "/exit",
        async ({ body }) => {
            return await parkingRecordUseCase.createExit(body.plate);
        },
        {
            body: createRecordByPlateSchema,
        }
    );