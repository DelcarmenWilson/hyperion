"use server";
import { db } from "@/lib/db";

export const getActiveQuote = async () => {
  return await db.quote.findFirst({ where: { active: true } });   
};