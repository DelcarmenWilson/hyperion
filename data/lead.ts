import { db } from "@/lib/db";

export const LeadsGetAll = async () => {
  try {
    const leads = await db.lead.findMany({include:{conversation:true}});
    
    return leads;
  } catch {
    return [];
  }
};

export const LeadGetById = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
    });

    return lead;
  } catch {
    return null;
  }
};
