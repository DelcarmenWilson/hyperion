"use server";
import { yearStartEnd } from "@/formulas/dates";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BluePrintSchema, BluePrintSchemaType } from "@/schemas/blueprint";

//DATA
export const bluePrintsGetAllByUserId = async () => {
  const user = await currentUser();
  if (!user) return [];

  const bluePrints = await db.bluePrint.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return bluePrints;
};

// DATA OF ACTIVE BLUEPRINT

export const bluePrintGetActive = async () => {
  const user = await currentUser();
  if (!user) return null;
  const blueprint = await db.bluePrint.findFirst({
    where: { userId: user.id, active: true },
  });

  return blueprint;
};

//ACTIONS
export const bluePrintInsert = async (values: BluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = BluePrintSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const year= yearStartEnd();
  const { callsTarget, appointmentsTarget, premiumTarget } =
    validatedFields.data;

  await db.bluePrint.updateMany({
    where: { userId: user.id, active: true },
    data: { active: false },
  });

  const newBluePrint = await db.bluePrint.create({
    data: {
      callsTarget,
      appointmentsTarget,
      premiumTarget,
      userId: user.id,    
      endAt: year.to,
    },
  });

  return { success: newBluePrint };
};

export const bluePrintUpdateByUserIdData = async (
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
