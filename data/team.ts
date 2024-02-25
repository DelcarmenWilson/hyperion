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
            calls: { where: { createdAt: { lte: fromDate, gte: toDate } } },
            appointments:  { where: { createdAt: { lte: fromDate, gte: toDate } } },
            conversations:  { where: { createdAt: { lte: fromDate, gte: toDate } } },
            leads:  { where: { createdAt: { lte: fromDate, gte: toDate } } },
          },
        },
        organization: true,
        owner: true,
      },
    });
    // const teams = await db.team.findUnique({
    //   where: { id },
    //   include: {
    //     users: {
    //       include: {
    //         calls: {
    //           where: {
    //             createdAt: {
    //               lte: fromDate,
    //               gte: toDate,
    //             },
    //           },
    //         },
    //         appointments: {
    //           where: {
    //             createdAt: {
    //               lte: fromDate,
    //               gte: toDate,
    //             },
    //           },
    //         },
    //         conversations: {
    //           where: {
    //             createdAt: {
    //               lte: fromDate,
    //               gte: toDate,
    //             },
    //           },
    //         },
    //         leads: {
    //           where: {
    //             createdAt: {
    //               lte: fromDate,
    //               gte: toDate,
    //             },
    //           },
    //         },
    //       },
    //     },
    //     organization: true,
    //     owner: true,
    //   },
    // });
    return teams;
  } catch (error: any) {
    return null;
  }
};
