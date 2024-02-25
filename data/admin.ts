import { db } from "@/lib/db";

export const adminUsersGetAll = async () => {
    try {
      const users = await db.user.findMany({
        select: { id: true, userName: true },
      });
  
      return users;
    } catch {
      return [];
    }
  };

  // LEAD_STATUS
  export const adminLeadStatusGetAll = async () => {
    try {
      const status =await db.leadStatus.findMany({
      });
      return status
    } catch (error) {
      return []
    }
  };

   // LEAD_STATUS
   export const adminCarriersGetAll = async () => {
    try {
      const carriers =await db.carrier.findMany({
      });
      return carriers
    } catch (error) {
      return []
    }
  };