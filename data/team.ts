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

export const teamsGetById = async (id: string) => {
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
            leads: true,
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

export const teamsGetByIdStats = async (
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
            leads: { where: { createdAt: { lte: toDate, gte: fromDate } } },
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

export const teamsGetByIdYearlySales = async (from: string) => {
  try {
    const currentDate = new Date(from);

    const fromDate = new Date(currentDate.getFullYear(), 0, 1);
    const toDate = new Date(currentDate.getFullYear(), 11, 31);

    const sales = await db.lead.findMany({
      where: {
        status: "Sold",
        saleAmount: { gt: 10 },
        updatedAt: {
          lte: toDate,
          gte: fromDate,
        },
      },
      include: { user: { select: { firstName: true,lastName:true,image:true } } },
    });

    return sales;
  } catch (error: any) {
    return null;
  }
};
