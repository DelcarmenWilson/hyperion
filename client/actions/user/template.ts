"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserTemplateSchema, UserTemplateSchemaType } from "@/schemas/user";

// DATA
export const getTemplates = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.userTemplate.findMany({
    where: { userId: user.id },
  });
};

//ACTIONS
export const deleteTemplate = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  await db.userTemplate.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  return "Template deleted!";
};
export const createTemplate = async (values: UserTemplateSchemaType) => {
  const { success, data } = UserTemplateSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const exisitingTemplate = await db.userTemplate.findFirst({
    where: { name: data.name, userId: user.id },
  });

  if (exisitingTemplate)
    throw new Error("Template with the same name already exist!");

  return await db.userTemplate.create({
    data: {
      ...data,
      userId: user.id,
      message: data.message || "",
    },
  });
};
export const updateTemplate = async (values: UserTemplateSchemaType) => {
  const { success, data } = UserTemplateSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const exisitingTemplate = await db.userTemplate.findUnique({
    where: { id: data.id, userId: user.id },
  });

  if (!exisitingTemplate) throw new Error("Template does not exist!");

  return await db.userTemplate.update({
    where: { id: exisitingTemplate.id },
    data: {
      ...data,
      message: data.message || "",
    },
  });
};
