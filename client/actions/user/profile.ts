"use server";
import { db } from "@/lib/db";
import { DateRange } from "react-day-picker";

export const getUserProfile = async ({
  id,
  dateRange,
}: {
  id: string;
  dateRange: DateRange;
}) => {
  return await db.user.findUnique({
    where: { id },
    include: {
      phoneNumbers: true,
      calls: {
        where: {
          createdAt: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        },
      },
      leads: {
        include: { policy: true },
        where: {
          policy: {
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
          },
        },
      },
      licenses: true,
      appointments: {
        where: {
          createdAt: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        },
      },
      conversations: {
        where: {
          createdAt: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        },
      },
      team: { include: { organization: true, owner: true } },
    },
  });
  // return await db.user.findUnique({
  //   where: { id },
  //   include: {
  //     phoneNumbers: true,
  //     team: {
  //       select: { name: true, organization: { select: { id:true,name: true } } },
  //     },
  //   },
  // });
};
