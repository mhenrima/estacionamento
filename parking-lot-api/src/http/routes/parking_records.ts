import { Elysia } from "elysia";
import { createRecordByPlateSchema } from "@/http/dtos/parking_records";
import { ParkingRecordUseCase } from "@/use-cases/parking_records";

const parkingRecordUseCase = new ParkingRecordUseCase();

export const parkingRecordRoutes = new Elysia({ prefix: "/records" })
    .get("/active", async () => {
        return await parkingRecordUseCase.getActiveRecords();
    })

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

    .patch(
        "/exit",
        async ({ body }) => {
            return await parkingRecordUseCase.createExit(body.plate);
        },
        {
            body: createRecordByPlateSchema,
        }
    );