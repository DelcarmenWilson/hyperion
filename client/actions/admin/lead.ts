"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
//LEAD
//DATA
export const adminLeadStatusGetAll = async () => {
  try {
    const status = await db.leadStatus.findMany({ where: { type: "default" } });
    return status;
  } catch (error) {
    return [];
  }
};

//ACTIONS
export const adminChangeLeadDefaultNumber = async (
  userId: string,
  oldPhone: string,
  newPhone: string
) => {
  const changes = await db.lead.updateMany({
    where: { userId, defaultNumber: oldPhone },
    data: { defaultNumber: newPhone },
  });

  return { success: `${changes} phone numbers have be changed` };
};

export const adminUpdateLeadNumbers = async (userId: string) => {
  const leads = await db.lead.findMany({
    where: { userId },
  });

  if (!leads.length) {
    return { error: "No leads found" };
  }

  for (const lead of leads) {
    await db.lead.update({
      where: { id: lead.id },
      data: {
        cellPhone: reFormatPhoneNumber(lead.cellPhone),
        defaultNumber: reFormatPhoneNumber(lead.defaultNumber),
      },
    });
  }

  return { success: "phone numbers have been updated" };
};

export const adminLeadStatusInsert = async (status: string) => {
  const user = await currentUser();

  if (!user?.id) 
    return { error: "Unathenticated" };
  
  if (user.role == "USER") 
    return { error: "Unauthorized" };
  

  const existingStatus = await db.leadStatus.findFirst({ where: { status } });
  if (existingStatus) {
    return { error: "Status already exists" };
  }

  await db.leadStatus.create({
    data: {
      status,
      type: "default",
      userId: user.id,
    },
  });

  return { success: "Status created" };
};
