"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateBluePrintSchema, CreateBluePrintSchemaType } from "@/schemas/blueprint";
import { yearStartEnd } from "@/formulas/dates";

export const getBlueprints = async () => {
  const user = await currentUser();
  if (!user) return [];

 return await db.bluePrint.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
};

export const getActiveBlueprint = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
 return await db.bluePrint.findFirst({
    where: { userId: user.id, active: true },
  });
};


export const createBlueprint = async (values: CreateBluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const {success,data} = CreateBluePrintSchema.safeParse(values);
  if (!success) return { error: "Invalid Fields" };
  const year= yearStartEnd();

  await db.bluePrint.updateMany({
    where: { userId: user.id, active: true },
    data: { active: false },
  });

  return await db.bluePrint.create({
    data: {
      ...data,
      userId: user.id,    
      endAt: year.to,
    },
  });
};



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
