"use server";

import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentRole();
  if (role === UserRole.ADMIN) {
    return { success: "Allowed" };
  }

  return { error: "Forbidden!" };
};

export const adminChangeLeadDefaultNumber = async (
  userId: string,
  oldPhone: string,
  newPhone: string
) => {

  const changes = await db.lead.updateMany({
    where: { userId, defaultNumber: oldPhone },
    data: { defaultNumber: newPhone },
  });

  return {success:`${changes} phone numbers have be changed`};
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
      data: { cellPhone: reFormatPhoneNumber(lead.cellPhone),
        defaultNumber: reFormatPhoneNumber(lead.defaultNumber) },
    });
  }

  return { success: "phone numbers have been updated" };
};
