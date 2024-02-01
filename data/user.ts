import { useCurrentUser } from "@/hooks/use-current-user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

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

export const usersGetSummaryByTeamId = async (
  userId: string,
  role: UserRole,
  teamId: string,
) => {
  try {
    if (role != "MASTER") return [];
    
    const agents = await db.user.findMany({
      where: { teamId, NOT: { id: userId } },
      include: {
        phoneNumbers: {
          where: { status: "default" },
        },chatSettings:true
      },
    });

    return agents;
  } catch {
    return [];
  }
};
