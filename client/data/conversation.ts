import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { userGetByAssistant } from "./user";

export const conversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }

    let agentId = user.id;
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }

    const conversations = await db.conversation.findMany({
      where: { agentId },
      include: {
        lead: true,
        lastMessage:true,
        messages: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return conversations;
  } catch {
    return [];
  }
};
// export const conversationGetById = async (conversationId: string) => {
//   try {
//     const user = await currentUser();
//     if (!user?.email) {
//       return null;
//     }
//     const conversation = await db.conversation.findUnique({
//       where: { id: conversationId, agentId: user.id },
//       include: {
//         lead: true,
//         messages:true
//       },
//     });
//     return conversation;
//   } catch (error) {
//     return null;
//   }
// };
export const conversationGetById = async (conversationId: string) => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    
    let agentId = user.id;
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId, agentId },
      include: {
        lead: {
          include: {

            calls: true,
            appointments: true,
            activities: true,
            beneficiaries: true,
            expenses: true,
            conditions: { include: { condition: true } },
            policy: true,
          },
        },
        lastMessage:true,
        messages: true,
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};
export const conversationGetByLeadId = async (leadId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: { leadId },
      include: {
        lead: {
          include: { calls: true, appointments: true, activities: true },
        },
        messages: true,
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};
