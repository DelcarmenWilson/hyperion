"use server";

import { db } from "@/lib/db";

export const conversationInsert = async (
  userId: string,
  leadId: string,
) => {
  if (!userId) {
    return { error: "User id is Required!" };
  }

  if (!leadId) {
    return { error: "Lead id is Required!" };
  }

  const conversation = await db.conversation.create({
    data: {
      leadId,
      users:{connect:[{id:userId}]
      }
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }


  return  ({success:conversation.id} );
};