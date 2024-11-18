"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  UpdateAgentWorkInfoSchema,
  UpdateAgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

export const updateAgentWorkInfo = async (
  values: UpdateAgentWorkInfoSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = UpdateAgentWorkInfoSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!");

  const agentWorkInfoOld = await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
  if (!agentWorkInfoOld) throw new Error("Work details not available!");
  const updateAgentWorkInfo = await db.agentWorkInfo.update({
    where: { userId: user.id },
    data: {
      ...data,
    },
  });

  revalidatePath("/blueprint")
};
