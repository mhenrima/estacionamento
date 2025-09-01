import { t } from "elysia";

export const createVehicleBodySchema = t.Object({
    plate: t.String({ minLength: 7, maxLength: 7, error: "A placa deve ter 7 caracteres." }),
    brand: t.String({ minLength: 2, error: "A marca é obrigatória." }),
    model: t.String({ minLength: 1, error: "O modelo é obrigatório." }),
    year: t.Numeric({ minimum: 1950, error: "O ano deve ser um número válido." }),
    color: t.String({ minLength: 3, error: "A cor é obrigatória." }),
});