import { Elysia } from "elysia";
import { createMonthlyParkerSchema } from "@/http/dtos/monthly_parkers";
import { MonthlyParkerUseCase } from "@/use-cases/monthly_parkers";

const monthlyParkerUseCase = new MonthlyParkerUseCase();

export const monthlyParkerRoutes = new Elysia({ prefix: "/api/monthly-parkers" })
    .get("/", async () => {
        return await monthlyParkerUseCase.listAll();
    })
    .post(
        "/",
        async ({ body, set }) => {
            console.log("[ROTA /monthly-parkers] Requisição recebida com o body:", body);
            const newParker = await monthlyParkerUseCase.create(body);
            set.status = 201;
            return newParker;
        },
        {
            body: createMonthlyParkerSchema,
        }
    )
