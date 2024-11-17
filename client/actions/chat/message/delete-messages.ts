"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteMessages = async (chatId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!" );

  const existingChat = await db.chat.findUnique({
    where: { id: chatId },
    select: { userOneId: true, userTwoId: true, deletedBy: true },
  });

  if (!existingChat) throw new Error("Chat doesn't exists!" );
  if (existingChat.deletedBy) throw new Error("This Chat has been already deleted!" );

  if (existingChat.userOneId != user.id && existingChat.userTwoId != user.id)
    throw new Error("UnAuthorized!" );

  await db.chatMessage.updateMany({
    where: { chatId, hidden: false, deletedBy: null },
    data: { hidden: true, deletedBy: user.id },
  });

  await db.chat.update({
    where: { id: chatId },
    data: { lastMessage: { disconnect: true } },
  });

  return chatId
};
//TODO - this is the old version, see if we can delete it
// export const deleteMessages = async (chatId: string) => {
//   const user = await currentUser();
//   if (!user) throw new Error("Unauthenticated!" );

//   const existingChat = await db.chat.findUnique({
//     where: { id: chatId },
//     select: { userOneId: true, userTwoId: true, deletedBy: true },
//   });

//   if (!existingChat) return { error: "Chat doesn't exists" };

//   if (existingChat.deletedBy)
//     return { error: "This Chat has been already deleted" };

//   if (existingChat.userOneId != user.id && existingChat.userTwoId != user.id)
//     return { error: "UnAuthorized" };

//   await db.chatMessage.updateMany({
//     where: { chatId, hidden: false, deletedBy: null },
//     data: { hidden: true, deletedBy: user.id },
//   });

//   await db.chat.update({
//     where: { id: chatId },
//     data: { lastMessage: { disconnect: true } },
//   });

//   return { success: "Chat has been deleted", data: chatId };
// };