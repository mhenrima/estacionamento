import { Elysia } from "elysia";
import authRoutes from "./http/routes/auth";
import { cors } from "@elysiajs/cors";
import { vehicles } from "./http/routes";
import { parkingRecordRoutes } from "./http/routes";



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
  .use(parkingRecordRoutes);



app.listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);