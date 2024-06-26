import { db } from "@/lib/db";

export const teamsGetAll = async () => {
  try {
    //TODO need to aggregate the use count
    const teams = await db.team.findMany({
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

    const sales = await db.lead.findMany({
      where: {
        user: { teamId: id },
        status: "Sold",
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
