"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { LeadStatusSchema, LeadStatusSchemaType } from "@/schemas/lead";
import { userGetByAssistant } from "@/actions/user";

// USER LICENSES
export const userLicensesGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if (!userId) return [];

    const licenses = await db.userLicense.findMany({ where: { userId } });
    return licenses;
  } catch {
    return [];
  }
};

// ACTIONS
export const userLeadStatusDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated" };

  const existingStatus = await db.leadStatus.findUnique({
    where: { id },
  });
  if (!existingStatus) return { error: "Status does not exists" };

  if (user.id != existingStatus?.userId) return { error: "Unauthorized" };

  const leads = await db.lead.findMany({
    where: { statusId: existingStatus.id },
  });

  if (leads.length > 0) {
    return {
      error: `(${leads.length}) lead${
        leads.length > 1 ? "s are" : " is"
      } still using this status!`,
    };
  }

  await db.leadStatus.delete({
    where: { id },
  });

  return { success: "Lead Status deleted!" };
};
export const userLeadStatusInsert = async (values: LeadStatusSchemaType) => {
  const userId = await userGetByAssistant();
  if (!userId) return { error: "Unauthenticated" };

  const validatedFields = LeadStatusSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { status, description } = validatedFields.data;

  const existingStatus = await db.leadStatus.findFirst({
    where: { status, userId },
  });
  if (existingStatus) return { error: "Status already exists" };

  const leadStatus = await db.leadStatus.create({
    data: {
      status,
      description,
      userId,
    },
  });

  return { success: leadStatus };
};

export const userLeadStatusUpdateById = async (
  values: LeadStatusSchemaType
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated" };

  const validatedFields = LeadStatusSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  //TODO - see if jhoni is ok with this being down by the assistant
  // let userId = user.id;
  // if (user.role == "ASSISTANT") {
  //   userId = (await userGetByAssistant(userId)) as string;
  // }

  const { id, status, description } = validatedFields.data;

  const existingStatus = await db.leadStatus.findUnique({
    where: { id },
  });
  if (!existingStatus) return { error: "Status does not exists!" };

  if (user.id != existingStatus?.userId) return { error: "Unauthorized!" };

  const leadStatus = await db.leadStatus.update({
    where: { id },
    data: {
      status,
      description,
    },
  });

  return { success: leadStatus };
};
