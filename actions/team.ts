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
  const userTeam = await db.team.findUnique({
    where: { ownerId: user.id },
  });
  
  if (!userTeam ) {
    return { error: "Unauthorized" };
  }

  await db.team.create({
    data: {
      name,
      organizationId:
        userTeam.organizationId,
      userId: user.id,
    },
  });

  return { success: "Team created!" };
};
