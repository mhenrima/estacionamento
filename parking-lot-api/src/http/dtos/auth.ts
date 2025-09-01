import { t } from "elysia";

/**
 * Valida o corpo (body) da requisição para criar um novo usuário.
 */
export const registerBodySchema = t.Object({
    name: t.String({ minLength: 2 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
});

/**
 * Valida o corpo (body) da requisição para fazer login.
 */
export const createSessionBodySchema = t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
});

/**
 * Define a estrutura da resposta JSON para um login bem-sucedido.
 */
export const createSessionResponseSchema = t.Object({
    token: t.String(),
});

/**
 * Define a estrutura da resposta JSON para o perfil do usuário.
 * Importante: Não inclui a senha!
 */
export const userProfileResponseSchema = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    role: t.Enum({
        admin: "admin",
        user: "user",
    }),
    createdAt: t.Date(),
});