"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserLicenseSchema, UserLicenseSchemaType } from "@/schemas/user";
import { getAssitantForUser } from "@/actions/user";

//DATA

export const getLicenses = async () => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated!");
  return await db.userLicense.findMany({ where: { userId } });
};
export const getLicensesForUser = async (userId: string) => {
  return await db.userLicense.findMany({ where: { userId } });
};
// ACTIONS
export const deleteLicense = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  await db.userLicense.delete({ where: { id, userId: user.id } });

  return "License Deleted";
};
export const createLicense = async (values: UserLicenseSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = UserLicenseSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");  

  const existingLicense = await db.userLicense.findFirst({
    where: {
      state: data.state,
      licenseNumber: data.licenseNumber,
      userId: user.id,
    },
  });

  if (existingLicense) throw new Error("License already exist!");

return await db.userLicense.create({
    data: {
      ...data,     
      userId: user.id,
    },
  });


};
export const updateLicense = async (values: UserLicenseSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const {success,data} = UserLicenseSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");  

  const existingLicense = await db.userLicense.findUnique({
    where: { id:data.id,userId:user.id },
  });

  if (!existingLicense) throw new Error("License does not exist!" );

return await db.userLicense.update({
    where: { id:existingLicense.id },
    data: {
     ...data,
    },
  });

};
