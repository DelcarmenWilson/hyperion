
"use server"
import { db } from "@/lib/db";

  export const getLeadByPhone = async (cellPhone: string) => {
    try {
      // const lead = await db.lead.findFirst({
      //   where: {
      //     cellPhone,
      //   },
      //   include: {
      //     conversations: true,
      //     appointments: { orderBy: { startDate: "desc" } },
      //     calls: {
      //       where: { status: "completed" },
      //       orderBy: { createdAt: "desc" },
      //     },
      //     activities: { orderBy: { createdAt: "desc" } },
      //     expenses: true,
      //     beneficiaries: true,
      //     conditions: { include: { condition: true } },
      //     policy: true,
      //   },
      // });

      const lead = await db.lead.findFirst({
        where: {
          cellPhone,
        },
     select:{id:true,firstName:true,lastName:true}
      });
  
      return lead;
    } catch {
      return null;
    }
  };