"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateBluePrintSchema, CreateBluePrintSchemaType } from "@/schemas/blueprint";
import { yearStartEnd } from "@/formulas/dates";

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

  const newBluePrint = await db.bluePrint.create({
    data: {
      ...data,
      userId: user.id,    
      endAt: year.to,
    },
  });

  return   newBluePrint ;
};