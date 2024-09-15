"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserCarrierSchema, UserCarrierSchemaType } from "@/schemas/user";

import { userGetByAssistant } from "@/actions/user";

// DATA
export const userCarriersGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if(!userId) return[]

    const carriers = await db.userCarrier.findMany({
      where: { userId },
      include: { carrier: { select: { name: true } } },
    });

    return carriers;
  } catch {
    return [];
  }
};

//ACTIONS
export const userCarrierDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated" };
  }

  const existingCarrier = await db.userCarrier.findUnique({
    where: { id },
  });

  if (!existingCarrier) {
    return { error: "Carrier does not exist!" };
  }

  if (user.id != existingCarrier?.userId) {
    return { error: "Unauthorized" };
  }
  await db.userCarrier.delete({
    where: { id },
  });

  return { success: "Carrier Deleted" };
};
export const userCarrierInsert = async (values: UserCarrierSchemaType) => {
  const validatedFields = UserCarrierSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated" };
  }
  const { agentId, carrierId, comments } = validatedFields.data;

  const existingLicense = await db.userCarrier.findFirst({
    where: { carrierId },
  });

  if (existingLicense) {
    return { error: "Carrier relationship already exist!" };
  }
  const carrier = await db.userCarrier.create({
    data: {
      agentId,
      carrierId,
      comments,
      userId: user.id,
    },
    include: { carrier: { select: { name: true } } },
  });

  return { success: carrier };
};
export const userCarrierUpdateById = async (values: UserCarrierSchemaType) => {
  const validatedFields = UserCarrierSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated" };
  }
  const { id, agentId, carrierId, comments } = validatedFields.data;

  const existingCarrier = await db.userCarrier.findFirst({
    where: { carrierId },
  });

  if (!existingCarrier) {
    return { error: "Carrier does not exist!" };
  }
  const carrier = await db.userCarrier.update({
    where: { id },
    data: {
      agentId,
      carrierId,
      comments,
      userId: user.id,
    },
    include: { carrier: { select: { name: true } } },
  });

  return { success: carrier };
};
