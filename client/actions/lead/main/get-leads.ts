
"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { FullLead } from "@/types";
import { LeadDefaultStatus } from "@/types/lead";

import { states } from "@/constants/states";
import { formatTimeZone } from "@/formulas/dates";

export const getLeads = async () => {
    try {
      const user = await currentUser();
      if (!user) {
        return [];
      }
  
      const leads = await db.lead.findMany({
        where: {
          OR: [
            { userId: user.id },
            { assistantId: user.id },
            { sharedUserId: user.id },
          ],
          NOT:{statusId:LeadDefaultStatus.DELETED}
        },
        include: {
          conversations: { where: { agentId: user.id } },
          appointments: { where: { status: "scheduled" } },
          calls: true,
          activities: true,
          beneficiaries: true,
          expenses: true,
          conditions: { include: { condition: true } },
          policy: { include: { carrier: true } },
          assistant: true,
          sharedUser: true,
        },
      });
      const currentTime = new Date();
      const fullLeads: FullLead[] = leads.map((lead) => {
        const timeZone =
          states.find(
            (e) => e.abv.toLocaleLowerCase() == lead.state.toLocaleLowerCase()
          )?.zone || "US/Eastern";
        return {
          ...lead,
          policy: { ...lead.policy },
          conversation: lead.conversations[0],
          zone: timeZone,
          time: formatTimeZone(currentTime, timeZone),
        };
      });
  
      return fullLeads;
    } catch {
      return [];
    }
  };