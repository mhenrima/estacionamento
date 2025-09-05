// src/use-cases/reports.ts
import { db } from "@/db";
import { parkingRecords } from "@/db/schemas";
import { sql } from "drizzle-orm";

interface DailySummary {
    date: string;
    entries: number;
    exits: number;
    revenue: number;
}

export class ReportsUseCase {
    async getDailySummary() {
        const entriesByDay = await db
            .select({
                date: sql<string>`DATE(${parkingRecords.entryAt})`,
                count: sql<number>`count(${parkingRecords.id})`.mapWith(Number),
            })
            .from(parkingRecords)
            .groupBy(sql`DATE(${parkingRecords.entryAt})`);

        const exitsByDay = await db
            .select({
                date: sql<string>`DATE(${parkingRecords.exitAt})`,
                count: sql<number>`count(${parkingRecords.id})`.mapWith(Number),
                revenue: sql<number>`sum(${parkingRecords.totalPrice})`.mapWith(Number),
            })
            .from(parkingRecords)
            .where(sql`${parkingRecords.exitAt} IS NOT NULL`)
            .groupBy(sql`DATE(${parkingRecords.exitAt})`);

        const summaryMap = new Map<string, Partial<DailySummary>>();

        for (const entry of entriesByDay) {
            // -> CORREÇÃO AQUI: Usamos a string de data diretamente, sem conversões
            const date = entry.date;
            summaryMap.set(date, { ...summaryMap.get(date), date, entries: entry.count });
        }

        for (const exit of exitsByDay) {
            // -> CORREÇÃO AQUI: Usamos a string de data diretamente, sem conversões
            const date = exit.date;
            summaryMap.set(date, { ...summaryMap.get(date), date, exits: exit.count, revenue: exit.revenue });
        }

        const finalSummary = Array.from(summaryMap.values()).map(day => ({
            date: day.date!,
            entries: day.entries || 0,
            exits: day.exits || 0,
            revenue: day.revenue || 0,
        }));

        return finalSummary.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
}