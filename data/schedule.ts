import { db } from "@/lib/db";
import { userGetByAssistant } from "./user";
import { UserRole } from "@prisma/client";

export const scheduleGetByUserId=async(userId:string,role:UserRole="USER") => {
    try {
      if(role=="ASSISTANT"){
        userId=await userGetByAssistant(userId) as string
      }
        const schedule = await db.schedule.findUnique({
            where:{userId}
        })
        return schedule
    } catch  {
        return null
    }
}

