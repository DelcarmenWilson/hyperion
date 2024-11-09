"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Presets } from "@prisma/client";
import { PresetSchema,PresetSchemaType } from "@/schemas/settings";

//DATA
export const presetsGetAll = async () => {
  try {
    const user = await currentUser();

    if (!user) return [];
    const presets = await db.presets.findMany({
      where: { agentId:user.id },
    });

    return presets;
  } catch (error: any) {
    return [];
  }
};

//ACTIONS
export const presetDeleteById = async (id: string) => {
  try {
    await db.presets.delete({where:{id}})

    return { success: "Preset deleted!" };
  } catch (error: any) {
    console.log("PRESET_DELETE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
export const presetInsert = async (values: PresetSchemaType) => {
  const validatedFields = PresetSchema.safeParse(values);
  const user = await currentUser();

  if (!user?.id)  return { error: "Unathenticated!" };

  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  

  const { type, content } =
    validatedFields.data;

  if(!content){
    return { error: "message cannot be empty!" };
  }
  const preset=await db.presets.create({
    data: {
      type,
      content,
      agentId: user.id,
    },
  });

  return { success: preset };
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



