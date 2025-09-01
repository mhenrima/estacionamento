import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
    path: ".env",
});

const config: Config = {
    schema: "./src/db/schemas/*.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
} as any;

export default config; 