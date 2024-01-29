"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { LeadSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";

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

  const existingLead = await db.lead.findMany({
    where: {
      cellPhone: reFormatPhoneNumber(cellPhone),
    },
  });

  if (!homePhone) {
    homePhone == cellPhone;
  }

  if (existingLead.length) {
    return { error: "Lead already exist" };
  }

  const st = states.find((e) => e.state == state || e.abv == state);
  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id,status:{not:"Deactive"} },
  });

  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
  const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);

  const newLead = await db.lead.create({
    data: {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone: homePhone ? reFormatPhoneNumber(homePhone) : "",
      cellPhone: reFormatPhoneNumber(cellPhone),
      gender: gender || "",
      maritalStatus: maritalStatus || "",
      email,
      dateOfBirth: new Date(dateOfBirth!),
      defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
      owner: user.id,
    },
  });

  return { success: newLead };
};

export const leadsImport = async (values: z.infer<typeof LeadSchema>[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id,status:{not:"Deactive"} },
  });
  
  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
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

    const st = states.find((e) => e.state == state || e.abv == state);
    const phoneNumber = phoneNumbers.find((e) => e.state == state);

    await db.lead.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state: st?.abv ? st.abv : state,
        zipCode,
        homePhone,
        cellPhone,
        gender,
        maritalStatus,
        email,
        //TODO - 
        dateOfBirth:new Date(),
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
        owner: user?.id,
      },
    });
  }
  return { success: `${values.length} Leads have been imported` };
};

export const leadUpdateById = async (
  values: z.infer<typeof LeadSchema>,
  leadId: string
) => {
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

   await db.lead.update({
    where: { id: existingLead.id },
    data: {
      ...values,
    },
  });

  return { success: "Lead has been updated" };
};

export const leadUpdateByIdAutoChat = async (leadId: string, autoChat: boolean) => {
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      autoChat,
    },
  });

  return { success: `Lead hyper chat has been turned ${autoChat?"on":"off"}!` };
};

export const leadUpdateByIdNotes = async (leadId: string, notes: string) => {
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      notes,
    },
  });
  return { success: "Lead notes have been updated" };
};
