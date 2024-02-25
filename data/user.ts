import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const userGetAll = async () => {
  try {
    const users = await db.user.findMany();

    return users;
  } catch {
    return [];
  }
};


export const userGetByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const userGetById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: { phoneNumbers: true, chatSettings: true, team: true },
    });

    return user;
  } catch {
    return null;
  }
};
export const userGetByIdDefault = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};

export const userGetByIdReport = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        phoneNumbers: true,
        calls: true,
        leads: true,
        appointments: true,
        conversations: true,
        team: {include:{organization:true,owner:true}},
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const userGetByUserName = async (userName: string) => {
  try {
    const user = await db.user.findUnique({
      where: { userName },
      include: { phoneNumbers: true, chatSettings: true, team: true },
    });

    return user;
  } catch {
    return null;
  }
};

export const usersGetSummaryByTeamId = async (
  userId: string,
  role: UserRole,
  teamId: string
) => {
  try {
    if (role != "MASTER") return [];

    const agents = await db.user.findMany({
      where: { teamId, NOT: { id: userId } },
      include: {
        phoneNumbers: {
          where: { status: "default" },
        },
        chatSettings: true,
      },
    });

    return agents;
  } catch {
    return [];
  }
};

// USER LICENSES
export const userLicensesGetAllByUserId = async (
  userId:string
) => {
  try {
    const licenses = await db.userLicense.findMany({where:{userId}});

    return licenses;
  } catch {
    return [];
  }
};