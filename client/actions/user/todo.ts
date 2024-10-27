"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  UserTemplateSchema,
  UserTemplateSchemaType,
  UserTodoSchema,
  UserTodoSchemaType,
} from "@/schemas/user";

// DATA
export const userTodoGetAll = async () => {
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
export const userGetById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const todo = await db.userTodo.findUnique({
      where: { id },
    });

    return todo;
  } catch {
    return null;
  }
};

//ACTIONS
export const userTodoDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };

  const existingTodo = await db.userTodo.findUnique({
    where: { id },
  });

  if (!existingTodo) return { error: "Todo does not exist!" };

  if (user.id != existingTodo.userId) return { error: "Unauthorized" };

  await db.userTodo.delete({
    where: {
      id,
    },
  });

  return { success: "Todo deleted!" };
};

export const userTodoInsert = async (values: UserTodoSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const validatedFields = UserTodoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { userId, name, description, comments, reminder } =
    validatedFields.data;

  const exisitingTodo = await db.userTodo.findFirst({
    where: { name, userId: user.id },
  });

  if (exisitingTodo) return { error: "Todo with the same name already exist!" };

  const todo = await db.userTodo.create({
    data: {
      userId: user.id,
      name,
      description,
      comments,
      reminder,
    },
  });

  return { success: todo };
};
export const userTodoUpdateById = async (
  values: UserTodoSchemaType
) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const validatedFields = UserTodoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };
  const {id, userId, name, description, comments, reminder } =
  validatedFields.data;

  const exisitingTodo = await db.userTodo.findUnique({
    where: { id },
  });

  if (!exisitingTodo) return { error: "Todo does not exist!" };

  const todo = await db.userTodo.update({
    where: { id },
    data: {
      name,
      description,
      comments,
      reminder,
    },
  });
 

  return { success: todo };
};
