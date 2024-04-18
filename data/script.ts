import { db } from "@/lib/db";

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