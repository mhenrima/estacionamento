import { Elysia } from "elysia";
import authRoutes from "./http/routes/auth";
import { cors } from "@elysiajs/cors";
import { parkingSpotRoutes, vehicles } from "./http/routes";
import { parkingRecordRoutes } from "./http/routes";
import { monthlyParkerRoutes } from "./http/routes";
import { reportRoutes } from "./http/routes"



const app = new Elysia()
  .use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }))
  .get("/", () => "Hello Elysia")
  .use(authRoutes)
  .use(vehicles)
  .use(parkingRecordRoutes)
  .use(parkingSpotRoutes)
  .use(reportRoutes)
  .use(monthlyParkerRoutes);




app.listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);