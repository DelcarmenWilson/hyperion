"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const createChat = async (userId: string) => {
  const user = await currentUser();

  if (!user)  throw new Error("Unauthenticated!" );

  const exisitingChat = await db.chat.findFirst({
    where: {
      OR: [
        { userOneId: userId, userTwoId: user.id },
        { userOneId: user.id, userTwoId: userId },
      ],
    },
  });
  if (exisitingChat) 
    return  exisitingChat.id ;
  

  const userTwo = await db.user.findUnique({ where: { id: userId } });
  if (!userTwo) throw new Error("User was not found!" ); 

  const chat = await db.chat.create({
    data: {
      userOneId: user.id,
      userTwoId: userTwo.id,
      // name: userTwo.userName,
      name: `${userTwo.firstName.substring(0, 1)}${userTwo.lastName.substring(
        0,
        1
      )}`,
      isGroup: false,
    },
  });

  if (!chat.id) throw new Error("Chat was not created!" ); 

  return  chat.id ;
};
//TODO - this is the old code- check if we still need it, if not delete it
// export const createChat = async (userId: string) => {
//   const user = await currentUser();

//   if (!user)  throw new Error("Unauthenticated!" );

//   const exisitingChat = await db.chat.findFirst({
//     where: {
//       OR: [
//         { userOneId: userId, userTwoId: user.id },
//         { userOneId: user.id, userTwoId: userId },
//       ],
//     },
//   });
//   if (exisitingChat) {
//     return { success: exisitingChat };
//   }

//   if (!userId) {
//     return { error: "Userd is Required!" };
//   }

//   const userTwo = await db.user.findUnique({ where: { id: userId } });
//   if (!userTwo) {
//     return { error: "User was not found" };
//   }

//   const chat = await db.chat.create({
//     data: {
//       userOneId: user.id,
//       userTwoId: userTwo.id,
//       // name: userTwo.userName,
//       name: `${userTwo.firstName.substring(0, 1)}${userTwo.lastName.substring(
//         0,
//         1
//       )}`,
//       isGroup: false,
//     },
//   });

//   if (!chat.id) {
//     return { error: "Chat was not created!" };
//   }

//   return { success: chat };
// };
