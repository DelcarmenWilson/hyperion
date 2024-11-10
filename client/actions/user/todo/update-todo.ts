"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { TodoSchema, TodoSchemaType } from "@/schemas/user";

export const updateTodo = async (values: TodoSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const { success, data } = TodoSchema.safeParse(values);
  if (!success) return { error: "Invalid fields!" };


  const todo = await db.userTodo.update({
    where: { id: data.id, userId: user.id },
    data: {
      ...data,
    },
  });

  return { success: todo };
};
