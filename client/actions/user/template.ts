"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserTemplateSchema, UserTemplateSchemaType } from "@/schemas/user";

// DATA
export const userTemplatesGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const templates = await db.userTemplate.findMany({
      where: { userId: user.id },
    });

    return templates;
  } catch {
    return [];
  }
};

//ACTIONS
export const userTemplateDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) 
    return { error: "Unauthenticated" };
  

  const exisitingTemplate = await db.userTemplate.findUnique({
    where: { id },
  });

  if (!exisitingTemplate) 
    return { error: "Template does not exist!" };
  

  if (user.id != exisitingTemplate.userId) {
    return { error: "Unauthorized" };
  }
  await db.userTemplate.delete({
    where: {
      id,
    },
  });

  return { success: "Template deleted!" };
};
export const userTemplateInsert = async (values: UserTemplateSchemaType) => {
  const validatedFields = UserTemplateSchema.safeParse(values);
  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  

  const user = await currentUser();
  if (!user?.id)  return { error: "Unathenticated!" };
  
  const { name, message, description, attachment } = validatedFields.data;

  const exisitingTemplate = await db.userTemplate.findFirst({
    where: { name, userId: user.id },
  });

  if (exisitingTemplate) 
    return { error: "Template with the same name already exist!" };
  
  const template = await db.userTemplate.create({
    data: {
      userId: user.id,
      name,
      message: message!,
      description,
      attachment,
    },
  });

  return { success: template };
};
export const userTemplateUpdateById = async (
  values: UserTemplateSchemaType
) => {
  const validatedFields = UserTemplateSchema.safeParse(values);
  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  

  const user = await currentUser();
  if (!user) 
    return { error: "Unauthorized" };
  
  const { id, name, message, description, attachment } = validatedFields.data;

  const exisitingTemplate = await db.userTemplate.findUnique({
    where: { id },
  });

  if (!exisitingTemplate) 
    return { error: "Template does not exist!" };
  
  const template = await db.userTemplate.update({
    where: { id },
    data: {
      userId: user.id,
      name,
      message: message!,
      description,
      attachment,
    },
  });

  return { success: template };
};
