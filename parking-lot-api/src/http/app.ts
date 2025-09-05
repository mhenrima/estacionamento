
import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import authRoutes from "./routes/auth";
import vehicleRoutes from "./routes/vehicles";
import { parkingRecordRoutes } from "./routes/parking_records";
import { parkingSpotRoutes } from "./routes";
import { reportRoutes } from "./routes/reports"; // <-- Importe aqui


const app = new Elysia()

    .use(authRoutes)
    .use(vehicleRoutes)
    .use(parkingRecordRoutes)
    .use(parkingSpotRoutes)
    .use(reportRoutes); // <-- Registre aqui


export default app;