import { db } from "@/lib/db";

export const scheduleGetByUserId=async(userId:string)=>{
    try {
        const schedule = await db.schedule.findUnique({
            where:{userId}
        })
        return schedule
    } catch  {
        return null
    }
}

