"use server";
import { db } from "@/lib/db";

export const getConversationForLead = async (leadId: string) => {
  //TODO - may need to add the unthentcated user
  return await db.leadConversation.findFirst({
    where: { leadId },
    include: {
      lead: {
        include: { calls: true, appointments: true, activities: true },
      },
      messages: true,
    },
  });
};