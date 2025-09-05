
import { Elysia, t } from "elysia";
import { ParkingSpotUseCase } from "@/use-cases/parking_spots";

const parkingSpotUseCase = new ParkingSpotUseCase();

export const parkingSpotRoutes = new Elysia({ prefix: "/spots" })
    .get("/status", async () => {
        return await parkingSpotUseCase.getSpotsWithStatus();
    })
    .post(
        "/configure",
        async ({ body }) => {
            return await parkingSpotUseCase.configureSpots(body.totalSpots);
        },
        {
            body: t.Object({ totalSpots: t.Numeric({ minimum: 1 }) }),
        }
    );