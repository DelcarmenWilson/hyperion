"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getScriptsForUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    return await db.script.findMany({
      where: {
        userId: user.id,
      },
    });
  } catch (error) {
    console.log("@GET_SCRIPTS_FOR_USER", error);
    return [];
  }
};
