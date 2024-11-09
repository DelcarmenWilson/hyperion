"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptSchema, ScriptSchemaType } from "@/schemas/admin";
import { ScriptStatus } from "@/types/script";
///TODO - dont forget to remove this file once the new scipt function are completed
// DATA
export const scriptGetOne = async (type:string|null|undefined) => {
  try {
    const scripts = await db.script.findFirst({where:{type:type||"General",status:ScriptStatus.PUBLISHED}});
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

//TODO - this needs to be removed-- posinly the entire file along with the main hook
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
      name: "New Script",
      content: "",
      userId: user.id!,
      default: user.role == "MASTER" ? true : false,
      status:ScriptStatus.DRAFT,
      type:"General"
    },
  });

  return { success: newScript };
};

export const scriptUpdateById = async (values: ScriptSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const {success,data} = ScriptSchema.safeParse(values);

  if (!success) 
    return { error: "Invalid fields!" };
  



  await db.script.update({
    where: { id:data.id },
    data: {
      ...data,
    },
  });

  return { success: "Script updated" };
};
