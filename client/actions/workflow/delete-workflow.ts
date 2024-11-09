"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const deleteWorkflow = async (id: string) => {
  
  const user= await currentUser();
  if (!user?.id) throw new Error("unauthenticated");

 await db.workflow.delete({
    where: {
        id,
      userId:user.id,
    },
  });
  
revalidatePath("/workflows");
};
