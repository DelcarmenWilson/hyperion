import { db } from "@/lib/db"

export const phoneNumbersGetByAgentId =async(agentId:string)=>{   
    try {
        const phones=await db.phoneNumber.findMany({where:{agentId}})
    
        return phones;
      } catch (error: any) {
        return [];
      }

}