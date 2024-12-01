"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schemas/category";

export const getCategories = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.userTodoCategory.findMany({
    where: { OR: [{ userId: user.id }, { default: true }] },
  });
};

export const getCategory = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.userTodoCategory.findUnique({
    where: { id, userId: user.id },
  });
};

export const createCategory = async (form: CreateCategorySchemaType) => {
  const { success, data } = CreateCategorySchema.safeParse(form);

  if (!success) throw new Error("bad request");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const categories = await db.userTodoCategory.findMany({
    where: { userId: user.id },
  });

  return await db.userTodoCategory.create({
    data: {
      ...data,
      userId: user.id,
      order: categories.length,
    },
  });
};
