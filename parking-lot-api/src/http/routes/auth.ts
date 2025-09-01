import { Elysia } from "elysia";
import {
    registerBodySchema,
    createSessionBodySchema,
    userProfileResponseSchema,
} from "@/http/dtos/auth";
import { AuthUseCase } from "@/use-cases/auth";
import { UnauthorizedError } from "@/http/errors";

const authUseCase = new AuthUseCase();

export default new Elysia({ prefix: "/api" })
    // Rota Pública: Registro
    .post(
        "/users",
        async ({ body, set }) => {
            const { name, email, password } = body;
            await authUseCase.registerUser({ name, email, password_raw: password });
            set.status = 201;
        },
        { body: registerBodySchema, detail: { tags: ["Auth"], summary: "Register a new user" } }
    )
    // Rota Pública: Login
    .post(
        "/sessions",
        async ({ body, cookie }) => {
            const { email, password } = body;
            const { sessionId } = await authUseCase.createSession({
                email,
                password_raw: password,
            });

            cookie.auth.set({
                value: sessionId,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 7 dias
                path: "/",
            });

            return { message: "Logged in successfully" };
        },
        { body: createSessionBodySchema, detail: { tags: ["Auth"], summary: "Authenticate" } }
    )
    // Rota Protegida: Perfil do Usuário
    .get(
        "/me",
        async ({ cookie, set }) => {
            const sessionId = cookie.auth.value; // 1. Pega o ID da sessão do cookie

            if (!sessionId) {
                throw new UnauthorizedError("Authentication is required.");
            }

            const user = await authUseCase.getUserFromSession(sessionId); // 2. Busca o usuário

            if (!user) {
                cookie.auth.remove(); // 3. Se a sessão for inválida, limpa o cookie
                throw new UnauthorizedError("Invalid session.");
            }

            return user; // 4. Retorna o usuário
        },
        {
            response: { 200: userProfileResponseSchema },
            detail: { tags: ["Auth"], summary: "Get authenticated user profile" },
        },
    );