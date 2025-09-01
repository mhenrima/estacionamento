import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set in .env file");
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
    console.log("Applying migrations...");

    await migrate(db, { migrationsFolder: "drizzle" });

    console.log("Migrations applied successfully!");

    await sql.end();
}

main();