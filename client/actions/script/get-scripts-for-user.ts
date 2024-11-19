"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

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
