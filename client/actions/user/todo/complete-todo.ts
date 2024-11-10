"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { TodoStatus } from "@/types/todo";

export const completeTodo = async ( id:string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };
  

  const todo = await db.userTodo.update({
    where: { id,  userId: user.id },
    data: {
      status:TodoStatus.COMPLETED,
      nextReminder:undefined
    },
  });

  return { success: todo };
};
