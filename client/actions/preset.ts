"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Presets } from "@prisma/client";
import { PresetSchema } from "@/schemas";

export const presetDeleteById = async (id: string) => {
  try {
    await db.presets.delete({where:{id}})

    return { success: "Preset deleted!" };
  } catch (error: any) {
    console.log("PRESET_Delete_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
export const presetInsert = async (values: z.infer<typeof PresetSchema>) => {
  const validatedFields = PresetSchema.safeParse(values);
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized!" };
  }

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { type, content } =
    validatedFields.data;

  if(!content){
    return { error: "message cannot be empty!" };
  }
  await db.presets.create({
    data: {
      type,
      content,
      agentId: user.id,
    },
  });

  return { success: "Preset text saved" };
};

export const presetUpdateById = async (values: Presets) => {
  try {
    const { id, content } = values;
    await db.presets.update({where:{id},data:{content}})
    return { success: "Preset updated!" };
  } catch (error: any) {
    console.log("PRESET_UPDATE_ERROR", error,values);
    return { error: "Something went wrong!" };
  }
};


