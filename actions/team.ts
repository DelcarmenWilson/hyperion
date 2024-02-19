"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const teamCreate = async (name: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated" };
  }

  const existingTeam = await db.team.findFirst({ where: { name } });

  if (existingTeam) {
    return { error: "A team already exist with this name!" };
  }
  const userTeam = await db.user.findUnique({
    where: { id: user.id },
    include: { team: true, teamOwned: true },
  });

  if (!userTeam?.teamOwned) {
    return { error: "Unauthorized" };
  }

  await db.team.create({
    data: {
      name,
      organizationId:
        userTeam.teamOwned?.organizationId ||
        userTeam.team?.organizationId as string,
      userId: userTeam.id,
    },
  });

  return { success: "Team created!" };
};
