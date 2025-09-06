// src/http/dtos/monthly_parkers.ts
import { t } from "elysia";

export const createMonthlyParkerSchema = t.Object({
    name: t.String({ minLength: 3, error: "O nome é obrigatório." }),
    document: t.String({ minLength: 11, error: "O documento é obrigatório." }),
    email: t.Optional(t.String({ format: 'email', error: "Formato de e-mail inválido." })),
    phone: t.Optional(t.String()),
    planStartDate: t.String({ format: 'date-time', error: "A data de início é obrigatória." }),
    plate: t.String({ minLength: 7, maxLength: 7, error: "A placa deve ter 7 caracteres." }),
});