"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const chatMessageReactionsGetByMessageId = async (
  chatMessageId: string
) => {
  try {
    const reactions = await db.chatMessageReaction.findMany({
      where: { chatMessageId },
      orderBy: { createdAt: "desc" },
    });

    return reactions;
  } catch (error: any) {
    return [];
  }
};

//ACTIONS
export const chatMessageReactionToggle = async ({
  chatMessageId,
  name,
  value,
}: {
  chatMessageId: string;
  name:string
  value: string;
}) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated!" };
  const userId = user.id;

  const existingReaction = await db.chatMessageReaction.findFirst({
    where: { chatMessageId, userId, name },
  });

  if (existingReaction) {
    await db.chatMessageReaction.delete({ where: { id: existingReaction.id } });
    return { success: "Reaction deleted!" };
  } else {
    await db.chatMessageReaction.create({
      data: {
        userId,
        chatMessageId,
        name,
        value,
      },
    });
    return { success: "Reaction created!" };
  }
};
