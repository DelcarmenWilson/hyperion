"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptSchema, ScriptSchemaType } from "@/schemas/admin";
import { use } from "react";

// DATA
export const scriptGetOne = async () => {
  try {
    const scripts = await db.script.findFirst({});
    return scripts;
  } catch (error: any) {
    return null;
  }
};

export const scriptGetById = async (id: string) => {
  try {
    const scripts = await db.script.findUnique({ where: { id } });
    return scripts;
  } catch (error: any) {
    return null;
  }
};

export const scriptsGetAll = async () => {
  try {
    const scripts = await db.script.findMany({});
    return scripts;
  } catch (error: any) {
    return [];
  }
};

// ACTIONS

export const scriptDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const existingScript = await db.script.findUnique({ where: { id } });

  if (!existingScript) return { error: "Script does not exists!" };

  if (existingScript.userId != user.id) return { error: "Unathorized!" };

  const deletedScript = await db.script.delete({
    where: { id },
  });

  return { success:"script was delete succesfully" };
};

export const scriptInsert = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const previousScript = await db.script.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if(previousScript){
  if (!previousScript.content) {
    return { error: "Previous script content is empty!" };
  }}
  const newScript = await db.script.create({
    data: {
      title: "New Script",
      content: "",
      userId: user.id,
      type: user.role == "MASTER" ? "Default" : "User Generated",
    },
  });

  return { success: newScript };
};

export const scriptUpdateById = async (values: ScriptSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = ScriptSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, title, content } = validatedFields.data;

  await db.script.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  return { success: "Script updated" };
};
