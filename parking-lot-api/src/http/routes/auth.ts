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
    .post(
        "/users",
        async ({ body, set }) => {
            const { name, email, password } = body;
            await authUseCase.registerUser({ name, email, password_raw: password });
            set.status = 201;
        },
        { body: registerBodySchema, detail: { tags: ["Auth"], summary: "Register a new user" } }
    )
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
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            return { message: "Logged in successfully" };
        },
        { body: createSessionBodySchema, detail: { tags: ["Auth"], summary: "Authenticate" } }
    )
    .get(
        "/me",
        async ({ cookie, set }) => {
            const sessionId = cookie.auth.value;
            if (!sessionId) {
                throw new UnauthorizedError("Authentication is required.");
            }

            const user = await authUseCase.getUserFromSession(sessionId);

            if (!user) {
                cookie.auth.remove();
                throw new UnauthorizedError("Invalid session.");
            }

            return user;
        },
        {
            response: { 200: userProfileResponseSchema },
            detail: { tags: ["Auth"], summary: "Get authenticated user profile" },
        },
    );