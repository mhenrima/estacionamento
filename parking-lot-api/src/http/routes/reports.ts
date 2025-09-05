import { Elysia } from "elysia";
import { ReportsUseCase } from "@/use-cases/reports";
// Importe seu plugin de autenticação e o guard de admin

const reportsUseCase = new ReportsUseCase();

export const reportRoutes = new Elysia({ prefix: "/api/reports" })
    // Adicione um guard aqui para garantir que apenas administradores acessem
    // .guard({ beforeHandle: ({ user, set }: any) => { /* lógica do admin */ } }, (app) => 
    .get("/daily-summary", async () => {
        return await reportsUseCase.getDailySummary();
    })
// )