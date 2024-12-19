"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getEntireDay } from "@/formulas/dates";
import { MessageType } from "@/types/message";
import { LeadCommunicationType } from "@/types/lead";

//DATA
export const getDashboardCards = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  const date = getEntireDay();
  const calls = await db.leadCommunication.groupBy({
    by: ["direction"],
    where: {
      conversation:{agentId:user.id},
      type:{not:LeadCommunicationType.SMS},
      createdAt: { gte: date.start },
      OR: [
        { direction: "inbound",status:{not:"no-anwser"} },
        { direction: "outbound", recordDuration: { gt: 5 } },
      ],
    },
    _count: {
      direction: true,
    },
  });

  
  const leads = await db.lead.aggregate({
    _count: { id: true },
    where: {
      userId: user.id,
      createdAt: { gte: date.start },
    },
  });

  const messages = await db.leadCommunication.aggregate({
    _count: { id: true },
    where: {
      conversation: { agentId: user.id },
      from: MessageType.LEAD,
      createdAt: { gte: date.start },
    },
  });

  return {
    leads: leads._count.id,
    texts: messages._count.id,
    inbound:
      calls.find((e) => e.direction.toLowerCase() == "inbound")?._count
        .direction || 0,
    outbound:
      calls.find((e) => e.direction.toLowerCase() == "outbound")?._count
        .direction || 0,
  };
};
