"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
//DATA
export const leadDuplicatesGetAllByUserId = async () => {
   
  try {
    const user = await currentUser();
    if (!user) return [];
    const leads = await db.leadDuplicates.findMany({
      where: { userId:user.id }, orderBy:{firstName:"asc"}
    });
    return leads;
  } catch {
    return [];
  }
};
