"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const updateUnreadConversation = async (id: string) => {
  const user = await currentUser();
   if (!user) throw new Error("Unauthenticated!");

  if (id == "clear") {
    id = "";
    await db.leadConversation.updateMany({
      where: {
        agentId: user.id,
           lastMessage: { senderId: { not: user.id  } },
           unread: { gt: 0 } ,
        
      },
      data: { unread: 0 },
    });
  } else {
    const existingConversation = await db.leadConversation.findUnique({
      where: { id },
    });
    if (!existingConversation) 
      throw new Error("Conversation does not exist!");
  
    await db.leadConversation.update({ where: { id }, data: { unread: 0 } });
  }

  return { success: id };
};
