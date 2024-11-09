"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const deleteScript = async (id: string) => {
  
  const user= await currentUser();
  if (!user) throw new Error("unauthenticated");

 await db.script.delete({
    where: {
        id,
      userId:user.id!,
    },
  });
  
revalidatePath("/scripts");
};
