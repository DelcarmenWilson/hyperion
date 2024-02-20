"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { LeadSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";
import { LeadType } from "@prisma/client";
import { activityInsert } from "./activity";

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

  const st = states.find(
    (e) =>
      e.state.toLowerCase() == state.toLowerCase() ||
      e.abv.toLowerCase() == state.toLowerCase()
  );

  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Deactive" } },
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
      userId: user.id,
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
    where: { agentId: user.id, status: { not: "Deactive" } },
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
      weight,
      height,
      income,
      policyAmount,
      smoker,
      currentlyInsured,
      currentInsuranse,
      vendor,
      recievedAt,
    } = values[i];

    const st = states.find(
      (e) =>
        e.state.toLowerCase() == state.toLowerCase() ||
        e.abv.toLowerCase() == state.toLowerCase()
    );
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
        dateOfBirth:
          Date.parse(dateOfBirth!) > 0 ? new Date(dateOfBirth!) : null,
        weight,
        height,
        income,
        policyAmount,
        smoker,
        currentlyInsured,
        currentInsuranse,
        vendor,
        recievedAt:
          Date.parse(recievedAt!) > 0 ? new Date(recievedAt!) : new Date(),
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
        userId: user?.id,
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

export const leadUpdateByIdQuote = async (leadId: string, quote: number) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }
  
  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      quote,
    },
  });
  activityInsert(leadId, "Quote updated","Quote", user.id, quote.toString());
  return { success: "Lead quote has been updated" };
};

export const leadUpdateByIdType = async (leadId: string, type: LeadType) => {

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }
  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  await db.lead.update({
    where: { id: leadId },
    data: {
      type,
    },
  });
  activityInsert(leadId, "Type updated","Type", user.id, type);
  return { success: "Lead type has been updated" };
};

export const leadUpdateByIdStatus = async (
  leadId: string,
  status: string
) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      status,
    },
  });
  activityInsert(leadId, "Status updated","status", user.id, status);
  return { success: "Lead status has been updated" };
};

export const leadUpdateByIdVendor = async (leadId: string, vendor: string) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      vendor,
    },
  });

  activityInsert(leadId, "Vendor updated","Vendor", user.id, vendor);
  return { success: "Lead vendor has been updated" };
};

//TODO the folowing 3 functions can be combined into 1
export const leadUpdateByIdCommision = async (
  leadId: string,
  commision: number
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      commision,
    },
  });
  activityInsert(leadId, "Ap updated", "Ap", user.id, commision.toString());
  return { success: "Lead Ap has been updated" };
};

export const leadUpdateByIdCost = async (
  leadId: string,
  costOfLead: number
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      costOfLead,
    },
  });
  activityInsert(
    leadId,
    "cost of lead updated",
    "Cost of Lead",
    user.id,
    costOfLead.toString()
  );
  return { success: "Lead cost has been updated" };
};

export const leadUpdateByIdSale = async (
  leadId: string,
  saleAmount: number
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      saleAmount,
    },
  });
  activityInsert(
    leadId,
    "Coverage amount updated",
    "Coverage amount",
    user.id,
    saleAmount.toString()
  );
  return { success: "Lead coverage amount has been updated" };
};

// LEADSTATUS
export const leadStatusInsert = async (status: string) => {
  
  const user = await currentUser()

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingStatus=await db.leadStatus.findFirst({where:{status}})
  if(existingStatus){    
    return { error: "Status already exists" };
  }
  
  const leadStatus=await db.leadStatus.create({
    data: {
      status,
      userId:user.id
    },
  });

  return { success: leadStatus };
};