"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db"
import { PageUpdateSchema, PageUpdateSchemaType } from "@/schemas/admin";

export const pageUpdatesGetAll = async()=> {
const updates=await db.pageUpdate.findMany({orderBy:{updatedAt:"desc"}})
return updates
}

export const pageUpdateInsert = async (values: PageUpdateSchemaType) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unathenticated" };
    }
    if (user.role == "USER") {
      return { error: "Unauthorized" };
    }
    const validatedFields = PageUpdateSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { type,title,image, description } = validatedFields.data;
  
    const existingUpdate = await db.pageUpdate.findFirst({ where: { title } });
    if (existingUpdate) {
      return { error: "Update already exists" };
    }
  
    const newUpdate = await db.pageUpdate.create({
      data: {
        type,title,image, description
      },
    });
  
    return { success: newUpdate };
  };