"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getTodos = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const todos = await db.userTodo.findMany({
      where: { userId: user.id },
    });

    return todos;
  } catch {
    return [];
  }
};


