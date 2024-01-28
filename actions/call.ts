"use server";

import { db } from "@/lib/db";
import { CallDirection } from "@prisma/client";

export const callInsert = async (id:string,agentId:string,leadId:string,direction:CallDirection) => {
    try {
        if(!agentId){
            return {error:"Agent id is required!"}
        }
        if(!leadId){
            return {error:"Lead id is required!"}
        }
        await db.call.create({
            data: {
               id,     
              agentId,
              leadId,
              direction:direction ,  
              status:""
            },
          });
          return {success:"Call created"}
    } catch (error) {
        return {error:"Internal server Error!"}
        
    }
 

  
};

