// parking-lot-api/src/http/routes/parking_spots.ts
// (Crie este novo arquivo de rotas)
import { Elysia, t } from "elysia";
import { ParkingSpotUseCase } from "@/use-cases/parking_spots";
// Adicione aqui a lógica de verificação de admin, se já tiver

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
            // Adicione um guard para verificar se o usuário é admin
        }
    );