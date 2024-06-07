"use server";
import { db } from "@/lib/db";
//TEAM
//DATA

//ACTIONS
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