import { Elysia } from "elysia";
import { ReportsUseCase } from "@/use-cases/reports";

const reportsUseCase = new ReportsUseCase();

export const reportRoutes = new Elysia({ prefix: "/api/reports" })
    .get("/daily-summary", async () => {
        return await reportsUseCase.getDailySummary();
    })
