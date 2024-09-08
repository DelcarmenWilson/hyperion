"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptSchema,ScriptSchemaType } from "@/schemas/admin";

// DATA
export const scriptGetOne = async () => {
  try {
    const scripts = await db.script.findFirst({});
    return scripts;
  } catch (error: any) {
    return null;
  }
};

export const scriptGetById = async (id:string) => {
  try {
    const scripts = await db.script.findUnique({where:{id}});
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
export const scriptInsert = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const newScript = await db.script.create({
    data: {
      title:"New Script",
      script:"New Script",
      userId: user.id,
    },
  });

  return { success: newScript };
};

export const scriptUpdateById = async (values:ScriptSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = ScriptSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id,title,script } = validatedFields.data;

   await db.script.update({
    where:{id},
    data: {
      title,
      script,
    },
  });

  return { success: "Script updated" };
};
