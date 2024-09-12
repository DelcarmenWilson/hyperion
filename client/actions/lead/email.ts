"use server"
import { db } from "@/lib/db";

// DATA
export const leadEmailsGetByLeadId = async (leadId: string) => {
  try {
    const emails = await db.leadEmail.findMany({  where: {
      leadId,
    },orderBy:{createdAt:"desc"}});
    return emails;
  } catch {
    return [];
  }
};

//ACTIONS
export const leadEmailInsert = async (
  id: string,
  type: string,
  body: string,
  subject: string,
  leadId:string
) => {
  await db.leadEmail.create({
    data: {
      id,
type,
body,
subject,
leadId
    },
  });
  return { success: "Activity created" };
};
