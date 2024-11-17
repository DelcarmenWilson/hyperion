"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteChat = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!" );
  
  await db.chat.delete({ where: { id,userOneId:user.id } });

//TODO - this is the old code i beleieve we still need this strucuture - if not believe remove it
  // const existingChat = await db.chat.findUnique({
  //   where: { id },
  // });
  // if (!existingChat) return { error: "Chat does not exist!" };

  // if (existingChat.lastMessageId) return { error: "Cannot delete chat!" };

  // if (existingChat.userOneId != user.id) return { error: "Unauthorized!" };


 // return { success: "chat has been deleted" };
};