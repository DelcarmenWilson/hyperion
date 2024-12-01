"use server";
import { db } from "@/lib/db";
//TEAM
//DATA

//ACTIONS
export const updateUserTeam = async ({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) => {
  console.log("@@@ TESTING",userId,teamId)
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User does not exist");

  const exisitingTeam = await db.team.findUnique({ where: { id: teamId } });
  if (!exisitingTeam) throw new Error("Team does not exist!t");

  if (!exisitingTeam.ownerId)
    throw new Error("Team does not have an owner yet");

  await db.user.update({
    where: { id: userId },
    data: { teamId },
  });

  return "Team has been changed";
};

export const adminChangeTeamManager = async (
  teamId: string,
  userId: string
) => {
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
    return { error: `${exisitingUser.firstName} already manages a team!` };
  }

  await db.team.update({
    where: { id: teamId },
    data: {
      ownerId: exisitingUser.id,
    },
  });

  return {
    success: `${exisitingUser.firstName} now manages ${exisitingTeam.name}!`,
  };
};
