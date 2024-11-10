"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { TodoSchema, TodoSchemaType } from "@/schemas/user";
import { TodoStatus } from "@/types/todo";

export const createTodo = async (values: TodoSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const { success, data } = TodoSchema.safeParse(values);
  if (!success) return { error: "Invalid fields!" };

  const nextReminder = data.reminder ? data.startAt : undefined;

  const todo = await db.userTodo.create({
    data: {
      userId: user.id,
      ...data,
      nextReminder,
      status: TodoStatus.PENDING,
    },
  });

  return { success: todo };
};
