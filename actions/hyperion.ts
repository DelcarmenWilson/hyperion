"use server";

import * as z from "zod";
import { db } from "@/lib/db";

import { HyperionLeadSchema } from "@/schemas";

export const hyperionLeadInsert = async (
  values: z.infer<typeof HyperionLeadSchema>
) => {
  const validatedFields = HyperionLeadSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    id,
    formId,
    adName,
    campaignName,
    firstName,
    lastName,
    address,
    city,
    state,
    cellPhone,
    gender,
    maritalStatus,
    email,
    dateOfBirth,
    weight,
    height,
    policyAmount,
    smoker,
  } = validatedFields.data;

  const existingLead = await db.hyperionLead.findUnique({
    where: {
      id,
    },
  });

  if (!existingLead) {
    return { error: "Lead already exist" };
  }

  const newLead=await db.hyperionLead.create({
    data: {
      id,
      formId,
      adName,
      campaignName,

      firstName,
      lastName,
      address,
      city,
      state,
      cellPhone,
      gender,
      maritalStatus,
      email,
      dateOfBirth,
      weight,
      height,
      policyAmount,
      smoker,
    },
  });

  if(!newLead){
    return { success: "Something Went Wrong" }
  }

  return { success: "Lead created" };
};
