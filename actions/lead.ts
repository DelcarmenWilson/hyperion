"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import {
  LeadGeneralSchema,
  LeadMainSchema,
  LeadSaleSchema,
  LeadSchema,
  LeadStatusSchema,
} from "@/schemas";
import { currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";
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

  const existingLead = await db.lead.findUnique({
    where: {
      cellPhone: reFormatPhoneNumber(cellPhone),
    },
  });

  if (!homePhone) {
    homePhone == cellPhone;
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
  let newLead
  if(existingLead){
     newLead = await db.leadDuplicates.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        homePhone: homePhone ? reFormatPhoneNumber(homePhone) : "",
        cellPhone: reFormatPhoneNumber(cellPhone),
        gender: gender,
        maritalStatus: maritalStatus,
        email,
        dateOfBirth,
        userId: user.id,
      },
    });
  }
  else{
   newLead = await db.lead.create({
    data: {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone: homePhone ? reFormatPhoneNumber(homePhone) : "",
      cellPhone: reFormatPhoneNumber(cellPhone),
      gender: gender,
      maritalStatus: maritalStatus,
      email,
      dateOfBirth,
      defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
      userId: user.id,
    },
  });
}
  return { success: newLead };
};

export const leadsImport = async (values: z.infer<typeof LeadSchema>[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  let duplicates=0
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
      type,
      vendor,
      recievedAt,
    } = values[i];

    const st = states.find(
      (e) =>
        e.state.toLowerCase() == state.toLowerCase() ||
        e.abv.toLowerCase() == state.toLowerCase()
    );
    const phoneNumber = phoneNumbers.find((e) => e.state == state);
    const existingLead=await db.lead.findUnique({where:{cellPhone}})
    if(existingLead){
      duplicates++
      await db.leadDuplicates.create({
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
          dateOfBirth,
          weight,
          height,
          income,
          policyAmount,
          smoker,
          currentlyInsured,
          currentInsuranse,
          type,
          vendor,
          recievedAt:
            Date.parse(recievedAt!) > 0 ? new Date(recievedAt!) : new Date(),
          userId: user?.id,
        },
      });
    }else{

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
          dateOfBirth,
          weight,
          height,
          income,
          policyAmount,
          smoker,
          currentlyInsured,
          currentInsuranse,
          type,
          vendor,
          recievedAt:
            Date.parse(recievedAt!) > 0 ? new Date(recievedAt!) : new Date(),
          defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
          userId: user?.id,
        },
      });
    }
  }
  return { success: `${values.length} Leads have been imported - duplicates(${duplicates})` };
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
export const leadUpdateByIdDefaultNumber = async (id: string, defaultNumber: string) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id },
    data: {
      defaultNumber,
    },
  });

  activityInsert(id, "caller id", "Caller id updated", user.id, existingLead.defaultNumber);
  return { success: "Lead default number has been updated" };
};
export const leadUpdateByIdNotes = async (id: string, notes: string) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id },
    data: {
      notes,
    },
  });

  activityInsert(id, "notes", "Notes updated", user.id, existingLead.notes as string);
  return { success: "Lead notes have been updated" };
};

export const leadUpdateByIdQuote = async (id: string, quote: number) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id },
    data: {
      quote,
    },
  });
  activityInsert(id, "Quote", "Quote updated", user.id, existingLead.quote.toString());
  return { success: "Lead quote has been updated" };
};

export const leadUpdateByIdType = async (leadId: string, type: string) => {
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
  activityInsert(leadId, "Type", "Type updated", user.id, existingLead.type);
  return { success: "Lead type has been updated" };
};

export const leadUpdateByIdStatus = async (leadId: string, status: string) => {
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
  activityInsert(leadId, "status", "Status updated", user.id, existingLead.status);
  return { success: "Lead status has been updated" };
};

export const leadUpdateByIdMainInfo = async (
  values: z.infer<typeof LeadMainSchema>
) => {
  const validatedFields = LeadMainSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, email, address, city, state, zipCode } = validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      email,
      address,
      city,
      state,
      zipCode,
    },
  });
  activityInsert(leadInfo.id!, "main", "Main info updated", user.id);
  return { success: leadInfo };
};
export const leadUpdateByIdGeneralInfo = async (
  values: z.infer<typeof LeadGeneralSchema>
) => {
  const validatedFields = LeadGeneralSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    id,
    gender,
    maritalStatus,
    dateOfBirth,
    weight,
    height,
    income,
    smoker,
  } = validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      gender,
      maritalStatus,
      dateOfBirth,
      weight,
      height,
      income,
      smoker,
    },
  });
  activityInsert(leadInfo.id!, "general", "General info updated", user.id);
  return { success: leadInfo };
};
export const leadUpdateByIdSaleInfo = async (
  values: z.infer<typeof LeadSaleSchema>
) => {
  const validatedFields = LeadSaleSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, vendor, saleAmount, commision, costOfLead } =
    validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  const status = saleAmount ? "Sold" : existingLead.status;
  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      vendor,
      saleAmount,
      commision,
      costOfLead,
      status,
    },
  });
  activityInsert(leadInfo.id!, "sale", "Sale info updated", user.id);
  return { success: leadInfo };
};

// LEADSTATUS
export const leadStatusInsert = async (
  values: z.infer<typeof LeadStatusSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = LeadStatusSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { status, description } = validatedFields.data;

  const existingStatus = await db.leadStatus.findFirst({ where: { status } });
  if (existingStatus) {
    return { error: "Status already exists" };
  }

  const leadStatus = await db.leadStatus.create({
    data: {
      status,
      userId: user.id,
    },
  });

  return { success: leadStatus };
};
