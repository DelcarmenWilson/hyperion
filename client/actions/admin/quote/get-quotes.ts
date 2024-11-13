"use server";
import { db } from "@/lib/db";

export const getQuotes = async () => {
    return await db.quote.findMany({});
};