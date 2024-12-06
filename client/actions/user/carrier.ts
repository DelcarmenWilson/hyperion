"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserCarrierSchema, UserCarrierSchemaType } from "@/schemas/user";

import { getAssitantForUser } from "@/actions/user";

// DATA
export const getUserCarriers = async () => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated");

  return await db.userCarrier.findMany({
    where: { userId },
    include: { carrier: { select: { name: true, image: true } } },
  });
};

//ACTIONS
export const deleteUserCarrier = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  await db.userCarrier.delete({
    where: { id, userId: user.id },
  });

  return "Carrier Deleted";
};
export const createUserCarrier = async (values: UserCarrierSchemaType) => {
  const { success, data } = UserCarrierSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const existingLicense = await db.userCarrier.findFirst({
    where: { userId: user.id, carrierId: data.carrierId },
  });

  if (existingLicense) throw new Error("Carrier relationship already exist!");

  return await db.userCarrier.create({
    data: {
      ...data,
      userId: user.id,
    },
    include: { carrier: { select: { name: true } } },
  });
};
export const updateUserCarrier = async (values: UserCarrierSchemaType) => {
  const { success, data } = UserCarrierSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const existingCarrier = await db.userCarrier.findFirst({
    where: { id: data.id, userId: user.id },
  });

  if (!existingCarrier) throw new Error("Carrier does not exist!");

  const carrier = await db.userCarrier.update({
    where: { id: existingCarrier.id },
    data: {
      ...data,
    },
    include: { carrier: { select: { name: true } } },
  });

  return carrier;
};
