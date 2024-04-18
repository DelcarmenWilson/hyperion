"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const teamInsert = async (name: string) => {
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
