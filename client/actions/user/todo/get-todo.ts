"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getTodo = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const todo = await db.userTodo.findUnique({
      where: { id, userId: user.id },
    });

    return todo;
  } catch {
    return null;
  }
};
