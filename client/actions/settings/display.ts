"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";


export const displaySettingsInsert = async (userId: string) => {
  
  await db.displaySettings.create({    
    data: {
      userId,
    },
  });
  return { success: "display settings created!" };
};
export const displaySettingsUpdate = async (dataStyle: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  await db.displaySettings.update({
    where: {
      userId: user.id,
    },
    data: {
      dataStyle,
    },
  });
  return { success: `Data style updated to ${dataStyle}!` };
};
