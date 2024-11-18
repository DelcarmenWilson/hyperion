"use server";
import { db } from "@/lib/db";

export const updateBlueprintData = async (
  userId: string,
  type: "calls" | "appointments" | "premium",
  value?: number
) => {
  const oldBluePrint = await db.bluePrint.findFirst({
    where: { userId, active: true },
  });
  if (!oldBluePrint) return { error: "bluePrint does not exists!!" };

  await db.bluePrint.update({
    where: { id: oldBluePrint.id },
    data: {
      calls: type == "calls" ? oldBluePrint.calls + 1 : oldBluePrint.calls,
      appointments:
        type == "appointments"
          ? oldBluePrint.appointments + 1
          : oldBluePrint.appointments,
      premium:
        type == "premium"
          ? oldBluePrint.premium + value!
          : oldBluePrint.premium,
    },
  });
  return { success: "BluPrint Updated!" };
};
