import { db } from "@/lib/db";

export const appointmentsGetAll = async () => {
  try {
    const appointments = await db.appointment.findMany({
      include: { agent: true, lead: true },
    });
    
    return appointments;
  } catch {
    return [];
  }
};



export const appointmentsGetAllByUserId = async (agentId:string) => {
  try {
    const appointments = await db.appointment.findMany({where:{agentId},
      include: { agent: true, lead: true },
    });
    
    return appointments;
  } catch {
    return [];
  }
};