import { db } from "@/lib/db";

export const leadsGetAll = async () => {
  try {
    const leads = await db.lead.findMany({include:{conversations:true}});
    
    return leads;
  } catch {
    return [];
  }
};

export const leadsGetAllByAgentId = async (agentId:string) => {
  try {
    const leads = await db.lead.findMany({where:{owner:agentId},include:{calls:true}});
    return leads;
  } catch {
    return [];
  }
};

export const leadGetById = async (id: string) => {
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

export const leadGetPrevNextById = async (id: string) => {
  try {
    const prev = await db.lead.findMany({
      take: 1,
      select:{id:true},
      where: {
        id: {
          lt: id,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const next = await db.lead.findMany({
      take: 1,
      select:{id:true},
      where: {
        id: {
          gt: id,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return {prev:prev[0]?.id||null,next:next[0]?.id};
  } catch {
    return null;
  }
};

export const leadsGetByAgentIdTodayCount = async (agentId: string) => {
  const lastdate=new Date()
  lastdate.setDate(lastdate.getDate()-1)
  try {
    const leads = await db.lead.aggregate({
      _count:{id:true},      
      where: {
        owner:agentId,
        createdAt:{gte: new Date(lastdate)}
      },
    });

    return leads._count.id;
  } catch {
    return 0;
  }
};



