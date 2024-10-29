"use server";
import { db } from "@/lib/db";
import { UserAccountStatus, UserRole } from "@prisma/client";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentRole } from "@/lib/auth";
import { UPPERADMINS } from "@/constants/user";

//DATA
export const adminUsersGetAll = async () => {
  try {
    const users = await db.user.findMany({
      select: { id: true, userName: true },
    });

    return users;
  } catch {
    return [];
  }
};

//ACTIONS
export const adminUpdateUserNumber = async (userId: string) => {
  const role=await currentRole()
  if(!role)return {error:"unauthenticated!" };

  if(!UPPERADMINS.includes(role))return {error:"Unauthorized" };

  const phoneNumbers = await db.phoneNumber.findMany({ where: { agentId:userId } });
  if (!phoneNumbers.length) {
    return { error: "No phone number found" };
  }

  for (const number of phoneNumbers) {
    await db.phoneNumber.update({
      where: { id: number.id },
      data: {
        phone: reFormatPhoneNumber(number.phone),
      },
    });
  }
  return { success: "user number have been updated" };
};

export const adminConfirmUserEmail = async (userId: string, date: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User does not exist" };
  }

  await db.user.update({
    where: { id: userId },
    data: { emailVerified: new Date(date) },
  });

  return { success: "Email has been confirmed" };
};

export const adminChangeUserRole = async (userId: string, newRole: string) => {
  const role=await currentRole()
  if(!role)return {error:"unauthenticated!" };

  if(!UPPERADMINS.includes(role))return {error:"Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: userId },
  });  

  if (!user) 
    return { error: "User does not exist" }; 

  await db.user.update({
    where: { id: userId },
    data: { role:  UserRole[newRole as keyof typeof UserRole] },
  });

  return { success: "Role has been changed" };
};
export const adminChangeUserAccountStatus = async (userId: string, newStatus: string) => {
  const role=await currentRole()
  if(!role)return {error:"unauthenticated!" };

  if(!UPPERADMINS.includes(role))return {error:"Unauthorized" };

  const user = await db.user.findUnique({
    where: { id:userId },
  });

  if (!user) 
    return { error: "user does not exist" }; 
  

  await db.user.update({
    where: { id:user.id },
    data: { accountStatus:  UserAccountStatus[newStatus as keyof typeof UserAccountStatus] },
  });

  return { success: "Account has been updated" };
};

export const adminSuspendAccount = async (id: string) => {
  const role=await currentRole()
  if(!role)return {error:"unauthenticated!" };

  if(!UPPERADMINS.includes(role))return {error:"Unauthorized" };

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) 
    return { error: "user does not exist" }; 
  

  await db.user.update({
    where: { id },
    data: { accountStatus: "SUSPENDED" },
  });

  return { success: "Account has been Suspended" };
};



