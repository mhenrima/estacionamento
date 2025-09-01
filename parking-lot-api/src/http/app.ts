// /Users/marcelohenriquemachado/Documents/ufu/pds/parking-lot/parking-lot-api/src/http/app.ts

import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import authRoutes from "./routes/auth";
import vehicleRoutes from "./routes/vehicles";
import { parkingRecordRoutes } from "./routes/parking_records";

const app = new Elysia()

    .use(authRoutes)
    .use(vehicleRoutes)
    .use(parkingRecordRoutes);

export default app;