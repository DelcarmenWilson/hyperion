"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { LeadDefaultStatus } from "@/types/lead";

export const deleteLead = async (id: string) => {
    //get current logged in user
    const user = await currentUser();
  
    // check if there is no user. yes, return an error
    if (!user) return { error: "Unauthenticated!" };
  
    //get existing lead with the ID.
    const existingLead = await db.lead.findUnique({ where: { id } });
    // if there is no lead return an error
    if (!existingLead) return { error: "Lead does not exist!" };
  
    //if existing lead's agent id is not equal to userid returns an error
    if (user.id != existingLead.userId) return { error: "Unauthorized!" };
  
    //if doesn't fall under above conditions change lead status into deleted
    await db.lead.update({
      where: { id },
      data: { statusId: LeadDefaultStatus.DELETED },
    });
      
    // if everything is correct return success
    return { success: id };
  };