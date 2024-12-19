"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { LeadDefaultStatus } from "@/types/lead";
//DATA
export const getTeams = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  //TODO need to aggregate the use count
  const filter = user.role == "MASTER" ? undefined : user.organization;
  return await db.team.findMany({
    where: { organizationId: filter },
    include: { users: true, organization: true, owner: true },
  });
};

export const getTeamsForOrganization = async (organizationId: string) => {
  return await db.team.findMany({
    where: { organizationId },
    include: { users: true, organization: true, owner: true },
  });
};

export const getTeam = async (id: string) => {
  return await db.team.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          appointments: true,
          conversations: {include:{communications:true}},
          leads: { include: { policy: true } },
        },
      },
      organization: true,
      owner: true,
    },
  });
};

export const getTeamStats = async ({
  id,
  from,
  to,
}: {
  id: string;
  from: string;
  to: string;
}) => {
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const teams = await db.team.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            appointments: {
              where: { createdAt: { lte: toDate, gte: fromDate } },
            },
            conversations: {
              where: { createdAt: { lte: toDate, gte: fromDate } },
            },
            leads: {
              include: { policy: true },
              where: { createdAt: { lte: toDate, gte: fromDate } },
            },
          },
        },
        organization: true,
        owner: true,
      },
    });
    return teams;
  } catch (error: any) {
    return null;
  }
};

export const getTeamSales = async ({
  id,
  from,
  to,
}: {
  id: string;
  from: string;
  to: string;
}) => {
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // const fromDate = new Date(new Date().getFullYear(), 0, 1)
    // const toDate = new Date(new Date().getFullYear(), 11, 31)

    const sales = await db.lead.findMany({
      where: {
        user: { teamId: id },
        statusId: LeadDefaultStatus.SOLD,
        policy: { ap: { not: "0.00" } },
        updatedAt: {
          lte: toDate,
          gte: fromDate,
        },
      },
      include: {
        user: { select: { firstName: true, lastName: true, image: true } },
        policy: true,
      },
    });
    return sales;
  } catch (error: any) {
    return null;
  }
};
//ACTIONS
export const createTeam = async (name: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  if (user.role != "SUPER_ADMIN") throw new Error("Unauthorized");
  const existingTeam = await db.team.findFirst({ where: { name } });
  //TODO - need to ask johnny if the same team name can exist in another organization
  if (existingTeam) throw new Error("A team already exist with this name!");

  await db.team.create({
    data: {
      name,
      organizationId: user.organization,
      userId: user.id,
    },
  });

  return "Team created!";
};
