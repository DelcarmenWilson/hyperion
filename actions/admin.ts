"use server";

import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentRole();
  if (role === UserRole.ADMIN) {
    return { success: "Allowed" };
  }

  return { error: "Forbidden!" };
};
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
export const adminChangeLeadDefaultNumber = async (
  userId: string,
  oldPhone: string,
  newPhone: string
) => {
  const changes = await db.lead.updateMany({
    where: { userId, defaultNumber: oldPhone },
    data: { defaultNumber: newPhone },
  });

  return { success: `${changes} phone numbers have be changed` };
};

export const adminUpdateLeadNumbers = async (userId: string) => {
  const leads = await db.lead.findMany({
    where: { userId },
  });

  if (!leads.length) {
    return { error: "No leads found" };
  }

  for (const lead of leads) {
    await db.lead.update({
      where: { id: lead.id },
      data: {
        cellPhone: reFormatPhoneNumber(lead.cellPhone),
        defaultNumber: reFormatPhoneNumber(lead.defaultNumber),
      },
    });
  }

  return { success: "phone numbers have been updated" };
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

export const adminChangeTeam = async (userId: string, teamId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User does not exist" };
  }
  const exisitingTeam = await db.team.findUnique({ where: { id: teamId } });
  if (!exisitingTeam) {
    return { error: "Team does not exist!t" };
  }

  if (!exisitingTeam.ownerId) {
    return { error: "Team does not have an owner yet" };
  }
  await db.user.update({
    where: { id: userId },
    data: { teamId },
  });

  return { success: "Team has been changed" };
};

export const adminChangeTeamManager = async (teamId: string, userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User does not exist" };
  }
  const exisitingTeam = await db.team.findUnique({ where: { id: teamId } });
  if (!exisitingTeam) {
    return { error: "Team does not exist!" };
  }
  const exisitingUser = await db.user.findUnique({
    where: { id: userId },
    include: { teamOwned: true },
  });
  if (!exisitingUser) {
    return { error: "User does not exist!" };
  }

  if (exisitingUser.teamOwned) {
    return { error: `${exisitingUser.firstName} already manages a team!`};
  }

  await db.team.update({
    where: { id: teamId },
    data: {
      ownerId: exisitingUser.id,
    },
  });

  return { success: `${exisitingUser.firstName} now manages ${exisitingTeam.name}!` };
};
