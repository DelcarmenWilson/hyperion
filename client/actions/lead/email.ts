"use server";
import { db } from "@/lib/db";

// DATA
export const leadEmailsGetByLeadId = async (leadId: string) => {
  try {
    const emails = await db.email.findMany({
      where: {
        leadId,
      },
      orderBy: { createdAt: "desc" },
    });
    return emails;
  } catch {
    return [];
  }
};


