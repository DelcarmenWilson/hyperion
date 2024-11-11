"use server"
import { db } from "@/lib/db";

export const createEmail = async (data: {
    id: string;
    type: string;
    body: string;
    subject: string;
    leadId: string | undefined;
    userId: string | undefined;
  }) => {
    await db.email.create({
      data: {
        ...data,
      },
    });
    return { success: "Email created" };
  };