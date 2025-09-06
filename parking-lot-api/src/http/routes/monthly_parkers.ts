// src/http/routes/monthly_parkers.ts
import { Elysia } from "elysia";
import { createMonthlyParkerSchema } from "@/http/dtos/monthly_parkers";
import { MonthlyParkerUseCase } from "@/use-cases/monthly_parkers";
// Importe seu guard de admin aqui

const monthlyParkerUseCase = new MonthlyParkerUseCase();

export const monthlyParkerRoutes = new Elysia({ prefix: "/api/monthly-parkers" })
    // Adicione o guard de admin para proteger todas as rotas
    // .guard({ ... }, (app) => 
    .get("/", async () => {
        return await monthlyParkerUseCase.listAll();
    })
    .post(
        "/",
        async ({ body, set }) => {
            const newParker = await monthlyParkerUseCase.create(body);
            set.status = 201;
            return newParker;
        },
        {
            body: createMonthlyParkerSchema,
        }
    )
// )