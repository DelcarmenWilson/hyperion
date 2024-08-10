"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { GptMessageSchema,GptMessageSchemaType } from "@/schemas/test";

//DATA
export const gptConversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }
    const conversations = await db.gptConversation.findMany({
      where: {
        userId: user.id,
      },
      include: { lastMessage: true},
    });
    return conversations;
  } catch {
    return [];
  }
};
export const gptMessagesGetByConversationId = async (conversationId:string) => {
  try {
    if (!conversationId) {
      return [];
    }
    const messages = await db.gptMessage.findMany({
      where: {
        conversationId,
      },
    });
    return messages;
  } catch {
    return [];
  }
};
//ACTIONS
export const gptConversationInsert = async () => {
  const user = await currentUser();
    if (!user?.email) {
      return [];
    }

  const conversation = await db.gptConversation.create({
    data: {
      userId:user.id
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }

  return { success: conversation.id };
};

export const gptConversationDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingConversation = await db.gptConversation.findUnique({
    where: { id },
  });
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }

  if (existingConversation.userId !== user.id) {
    return { error: "Unauthorized!" };
  }

  await db.gptConversation.delete({ where: { id } });

  return { success: "conversation has been deleted" };
};



export const messageInsert = async (values: GptMessageSchemaType) => {
  const validatedFields = GptMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role, content, conversationId } =
    validatedFields.data;

    const conversation = await db.gptConversation.findUnique({
      where: { id: conversationId }
    });

  if(!conversation){  
    return { error: "Conversation does not exists!" };
  }

  const newMessage = await db.gptMessage.create({
    data: {
      conversationId,
      role,
      content,
    },
  });

   await db.gptConversation.update({
    where: { id: conversationId },
    data: { lastMessageId: newMessage.id },
  });

  return { success: newMessage };
};