"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserLicenseSchema, UserLicenseSchemaType } from "@/schemas/user";
import { userGetByAssistant } from "@/actions/user";

//DATA

export const userLicensesGetAll = async (
) => {
  try {
    const userId = await userGetByAssistant();
    if(!userId) return[]
    const licenses = await db.userLicense.findMany({ where: { userId } });
    return licenses;
  } catch {
    return [];
  }
};
// ACTIONS
export const userLicenseDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };

  const existingLicense = await db.userLicense.findUnique({
    where: { id },
  });

  if (!existingLicense) {
    return { error: "License does not exist!" };
  }

  if (user.id != existingLicense?.userId) {
    return { error: "Unauthorized" };
  }

  await db.userLicense.delete({ where: { id } });

  return { success: "License Deleted" };
};
export const userLicenseInsert = async (values: UserLicenseSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };

  const validatedFields = UserLicenseSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { state, type, licenseNumber, dateExpires, comments } =
    validatedFields.data;

  const existingLicense = await db.userLicense.findFirst({
    where: { state, licenseNumber },
  });

  if (existingLicense) return { error: "License already exist!" };

  const license = await db.userLicense.create({
    data: {
      state,
      type,
      licenseNumber,
      dateExpires: new Date(dateExpires),
      comments,
      userId: user.id,
    },
  });

  return { success: license };
};
export const userLicenseUpdateById = async (values: UserLicenseSchemaType) => {
  const validatedFields = UserLicenseSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };

  const { id, image, state, type, licenseNumber, dateExpires, comments } =
    validatedFields.data;

  const existingLicense = await db.userLicense.findUnique({
    where: { id },
  });

  if (!existingLicense) return { error: "License does not exist!" };

  const license = await db.userLicense.update({
    where: { id },
    data: {
      image,
      state,
      type,
      licenseNumber,
      dateExpires: new Date(dateExpires),
      comments,
      userId: user.id,
    },
  });

  return { success: license };
};
