"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteTodo = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };
 
  await db.userTodo.delete({
    where: {
      id,userId:user.id
    },
  });

  return { success: "Todo deleted!" };
};