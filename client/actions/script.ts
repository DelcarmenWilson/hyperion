"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ScriptSchema, ScriptSchemaType } from "@/schemas/admin";
import { ScriptStatus } from "@/types/script";
///TODO - dont forget to remove this file once the new scipt function are completed
// DATA
export const getScriptOne = async (type:string|null|undefined) => {
 return await db.script.findFirst({where:{type:type||"General",status:ScriptStatus.PUBLISHED}});  
};

export const getScript = async (id: string) => {
 return  await db.script.findUnique({ where: { id } });    
};

export const getScripts = async () => {
 return await db.script.findMany({});   
};

// ACTIONS
export const deleteScript = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const existingScript = await db.script.findUnique({ where: { id } });

  if (!existingScript) return { error: "Script does not exists!" };

  if (existingScript.userId != user.id) return { error: "Unathorized!" };

  await db.script.delete({
    where: { id },
  });

  return "script was delete succesfully" ;
};

//TODO - this needs to be removed-- posinly the entire file along with the main hook
export const createScript = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized!")
  const previousScript = await db.script.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if(previousScript && !previousScript.content) throw new Error("Previous script content is empty!" );
 
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

  return  newScript ;
};

export const updateScript = async (values: ScriptSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized!")
    
  const {success,data} = ScriptSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!" );
  

  await db.script.update({
    where: { id:data.id },
    data: {
      ...data,
    },
  });

  return  "Script updated" ;
};
