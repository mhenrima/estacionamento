import { t } from "elysia";

export const createRecordByPlateSchema = t.Object({
    plate: t.String({ minLength: 7, maxLength: 7, error: "A placa deve ter 7 caracteres." }),
});