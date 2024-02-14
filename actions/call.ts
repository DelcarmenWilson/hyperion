"use server";
import { db } from "@/lib/db";

export const callInsert = async (
  id: string,
  userId: string,
  leadId: string,
  direction: string
) => {
  try {
    if (!userId) {
      return { error: "User id is required!" };
    }
    if (!leadId) {
      return { error: "Lead id is required!" };
    }
    await db.call.create({
      data: {
        id,
        userId,
        leadId,
        direction: direction,
        status: "",
        from: "",
      },
    });
    return { success: "Call created" };
  } catch (error) {
    return { error: "Internal server Error!" };
  }
};
