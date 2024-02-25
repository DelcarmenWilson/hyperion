"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const scriptInsert = async (title: string, script: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const newScript = await db.script.create({
    data: {
      title,
      script,
      userId: user.id,
    },
  });

  return { success: newScript };
};

export const scriptUpdateById = async (id:string,title: string, script: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

   await db.script.update({
    where:{id},
    data: {
      title,
      script,
    },
  });

  return { success: "Script updated" };
};
