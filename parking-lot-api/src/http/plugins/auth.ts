import { Elysia } from "elysia";
import { AuthUseCase } from "@/use-cases/auth";

const authUseCase = new AuthUseCase();

export const auth = new Elysia({ name: "auth" }).derive(
    async ({ cookie: { auth: sessionCookie } }) => {
        // LOG DE DEBUG DO PLUGIN
        console.log("\n--- Plugin Auth Verificando ---");
        console.log("Cookie Recebido pelo Plugin:", sessionCookie);

        // A verificação agora é mais robusta
        if (!sessionCookie || !sessionCookie.value) {
            console.log("--> Plugin: Nenhum cookie 'auth' válido encontrado. Retornando user null.");
            return { user: null };
        }

        console.log("--> Plugin: Cookie encontrado. Chamando a UseCase...");
        const user = await authUseCase.getUserFromSession(sessionCookie.value);
        console.log("--> Plugin: UseCase retornou:", user); // Veremos se a UseCase acha o usuário

        return { user };
    },
);