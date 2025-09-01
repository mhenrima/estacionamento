// src/http/dtos/parking_records.ts
import { t } from "elysia";

// DTO para registrar entrada ou saída
export const createRecordByPlateSchema = t.Object({
    plate: t.String({ minLength: 7, maxLength: 7, error: "A placa deve ter 7 caracteres." }),
});