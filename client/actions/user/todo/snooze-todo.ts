"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const snoozeTodo = async ( id:string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };

  const nextReminder=new Date()
  nextReminder.setMinutes(nextReminder.getMinutes()+5)  

  const todo = await db.userTodo.update({
    where: { id,  userId: user.id },
    data: {
      nextReminder:nextReminder
    },
  });

  return { success: todo };
};