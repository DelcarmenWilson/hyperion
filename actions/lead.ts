import * as z from "zod";
import { db } from "@/lib/db";
import { LeadSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { Lead } from "@prisma/client";
import { formatPhoneNumber } from "@/lib/utils";

export const leadUpdateById = async (values: z.infer<typeof LeadSchema>,leadId:string) => {

  const existingLead = await db.lead.findUnique({ where: { id:leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  const updateduser = await db.lead.update({
    where: { id: existingLead.id },
    data: {
      ...values,
    },
  });

  return { success: "Lead has been updated" };
};

export const leadInsert = async (values: z.infer<typeof LeadSchema>) => {
  const validatedFields = LeadSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const {
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    homePhone,
    cellPhone,
    gender,
    maritalStatus,
    email,
    dateOfBirth,
  } = validatedFields.data;

  await db.lead.create({
    data: {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone:formatPhoneNumber(homePhone),
      cellPhone:`+${formatPhoneNumber(cellPhone)}`,
      gender: gender || "",
      maritalStatus: maritalStatus || "",
      email,
      dateOfBirth,
      owner: user.id,
    },
  });

  return { success: "Lead created!" };
};

export const leadsImport = async (values: Lead[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  console.log(user)

  return {error:"testing"}
  for (let i = 0; i < values.length; i++) {
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone,
      cellPhone,
      gender,
      maritalStatus,
      email,
      dateOfBirth,
    } = values[i];

    await db.lead.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        homePhone,
        cellPhone,
        gender,
        maritalStatus,
        email,
        dateOfBirth,
        owner: user?.id,
      },
    });
  }

  // await db.lead.createMany(data)
  return { success: "Fields have been validated" };
};
