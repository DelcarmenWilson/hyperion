"use server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { reFormatPhoneNumber } from "@/formulas/phones";
//USER
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
export const adminUpdateUserNumber = async (agentId: string) => {
  const phoneNumbers = await db.phoneNumber.findMany({ where: { agentId } });
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

export const adminChangeUserRole = async (userId: string, role: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  const newRole: UserRole = UserRole[role as keyof typeof UserRole];

  if (!user) {
    return { error: "User does not exist" };
  }

  await db.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  return { success: "Role has been changed" };
};
