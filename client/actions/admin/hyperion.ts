"use server"
import { db } from "@/lib/db";

export const hyperionLeadsGetAll = async () => {
  try {
    const leads = await db.hyperionLead.findMany();
    return leads;
  } catch {
    return [];
  }
};
