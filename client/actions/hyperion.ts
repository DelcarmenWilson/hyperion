"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { HyperionLeadSchema } from "@/schemas";
import { smsSendNewHyperionLeadNotifications } from "./sms";

export const hyperionLeadInsert = async (
  values: z.infer<typeof HyperionLeadSchema>
) => {
  const validatedFields = HyperionLeadSchema.safeParse(values);
  if (!validatedFields.success) {
    console.log(validatedFields.error);
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

  if (existingLead) {
    return { error: "Lead already exist" };
  }

  const newLead = await db.hyperionLead.create({
    data: {
      id: id?.replace("Id", "")!,
      formId: formId!,
      adName: adName!,
      campaignName: campaignName!,
      firstName: firstName!,
      lastName: lastName!,
      address: address!,
      city: city!,
      state: state!,
      cellPhone: cellPhone!,
      gender: gender!,
      maritalStatus: maritalStatus!,
      email: email!,
      dateOfBirth: dateOfBirth!,
      weight: weight!,
      height: height!,
      policyAmount: policyAmount!,
      smoker: smoker!,
    },
  });

  if (!newLead) {
    return { error: "Something Went Wrong" };
  }

  await smsSendNewHyperionLeadNotifications(newLead);

  return { success: "Lead created" };
};

export const hyperionLeadUpdateById = async (
  values: z.infer<typeof HyperionLeadSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = HyperionLeadSchema.safeParse(values);
  if (!validatedFields.success) {
    console.log(validatedFields.error);
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
    return { error: "Lead does not exist" };
  }

  const newLead = await db.hyperionLead.update({
    where: { id },
    data: {
      formId: formId!,
      adName: adName!,
      campaignName: campaignName!,
      firstName: firstName!,
      lastName: lastName!,
      address: address!,
      city: city!,
      state: state!,
      cellPhone: cellPhone!,
      gender: gender!,

      maritalStatus: maritalStatus!,
      email: email!,
      dateOfBirth: dateOfBirth!,
      weight: weight!,
      height: height!,
      policyAmount: policyAmount!,
      smoker: smoker!,
    },
  });

  if (!newLead) {
    return { error: "Something Went Wrong" };
  }

  return { success: newLead };
};
