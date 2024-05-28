"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptSchema,ScriptSchemaType } from "@/schemas/admin";

export const scriptInsert = async (values:ScriptSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = ScriptSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { title,script } = validatedFields.data;

  const newScript = await db.script.create({
    data: {
      title,
      script,
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
