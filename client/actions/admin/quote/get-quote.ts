"use server";
import { db } from "@/lib/db";

export const getQuote = async (id:string) => {
    return await db.quote.findMany({where:{id}});
};