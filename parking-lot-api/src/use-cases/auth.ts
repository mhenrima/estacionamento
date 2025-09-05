import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { UnauthorizedError, BadRequestError } from "@/http/errors";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

interface CreateUserParams { name: string; email: string; password_raw: string; }
interface CreateSessionParams { email: string; password_raw: string; }

const SESSIONS_FILE_PATH = path.join(process.cwd(), "sessions.json");

function loadSessions(): Record<string, { userId: string }> {
    try {
        if (fs.existsSync(SESSIONS_FILE_PATH)) {
            const fileContent = fs.readFileSync(SESSIONS_FILE_PATH, "utf-8");
            return JSON.parse(fileContent);
        }
    } catch (error) { console.error("Could not load sessions from file:", error); }
    return {};
}

function saveSessions(sessions: Record<string, { userId: string }>) {
    try {
        fs.writeFileSync(SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2));
    } catch (error) { console.error("Could not save sessions to file:", error); }
}

const sessions = loadSessions();

export class AuthUseCase {
    async registerUser({ name, email, password_raw }: CreateUserParams) {
        const passwordHash = await hash(password_raw, 8);
        try {
            const [newUser] = await db.insert(users).values({ name, email, passwordHash, role: "user" }).returning({ id: users.id });
            return { id: newUser.id };
        } catch (error: any) {
            if (error.code === '23505') { throw new BadRequestError("Este endereço de e-mail já está em uso."); }
            throw error;
        }
    }

    async createSession({ email, password_raw }: CreateSessionParams) {
        const user = await db.query.users.findFirst({ where: eq(users.email, email), });
        if (!user) { throw new UnauthorizedError("Credenciais inválidas."); }

        const doesPasswordMatch = await compare(password_raw, user.passwordHash);
        if (!doesPasswordMatch) { throw new UnauthorizedError("Credenciais inválidas."); }

        const sessionId = randomBytes(32).toString('hex');
        sessions[sessionId] = { userId: user.id };
        saveSessions(sessions);

        return { sessionId };
    }

    async getUserFromSession(sessionId: string) {
        const session = sessions[sessionId];
        if (!session) { return null; }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.userId),
            columns: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        return user;
    }
}