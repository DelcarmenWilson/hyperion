"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { LeadDefaultStatus } from "@/types/lead";
//DATA
export const teamsGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    //TODO need to aggregate the use count
    const filter = user.role == "MASTER" ? undefined : user.organization;
    const teams = await db.team.findMany({
      where: { organizationId: filter },
      include: { users: true, organization: true, owner: true },
    });
    return teams;
  } catch (error: any) {
    return [];
  }
};

export const teamsGetAllByOrganization = async (organizationId: string) => {
  try {
    const teams = await db.team.findMany({
      where: { organizationId },
      include: { users: true, organization: true, owner: true },
    });
    return teams;
  } catch (error: any) {
    return [];
  }
};

export const teamGetById = async (id: string) => {
  try {
    //TODO need to aggregate the use count
    const teams = await db.team.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            calls: true,
            appointments: true,
            conversations: true,
            leads: { include: { policy: true } },
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

export const teamGetByIdStats = async (
  id: string,
  from: string,
  to: string
) => {
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const teams = await db.team.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            calls: { where: { createdAt: { lte: toDate, gte: fromDate } } },
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

export const teamGetByIdSales = async (
  id: string,
  from: string,
  to: string
) => {
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
export const teamInsert = async (name: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };
  if (user.role != "SUPER_ADMIN") return { error: "Unauthorized" };
  const existingTeam = await db.team.findFirst({ where: { name } });
  //TODO - need to ask johnny if the same team name can exist in another organization
  if (existingTeam) return { error: "A team already exist with this name!" };

  // const userTeam = await db.team.findUnique({
  //   where: { ownerId: user.id },
  // });

  // if (!userTeam )
  //   return { error: "Unauthorized" };

  await db.team.create({
    data: {
      name,
      organizationId: user.organization,
      userId: user.id,
    },
  });

  return { success: "Team created!" };
};
