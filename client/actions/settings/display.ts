import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

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
