"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { ammLeadSchema, ammLeadSchemaType, HyperionLeadSchema,HyperionLeadSchemaType } from "@/schemas/admin";
import { smsSendNewHyperionLeadNotifications } from "./sms";

export const hyperionLeadInsert = async (
  values: HyperionLeadSchemaType
) => {
  const validatedFields = HyperionLeadSchema.safeParse(values);
  if (!validatedFields.success) {
    console.log("HYPERIONLEAD_INSERT_ERROR");
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
  values: HyperionLeadSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = HyperionLeadSchema.safeParse(values);
  if (!validatedFields.success) {
    console.log("HYPERIONLEAD_UPDATE_ERROR");
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


export const ammLeadInsert = async (
  values: ammLeadSchemaType
) => {
  const validatedFields = ammLeadSchema.safeParse(values);
  if (!validatedFields.success) {
    console.log("AAMM_INSERT_ERROR");
    return { error: "Invalid fields!" };
  }

  const {
  leadId,
  addId,
  
  coverage,
  beneficiary,
  firstName,
  lastName,
  
  email,
  cellPhone,
  state,
  dateOfBirth,
  recievedAt
  } = validatedFields.data;

  // const existingLead = await db.hyperionLead.findUnique({
  //   where: {
  //     id,
  //   },
  // });

  // if (existingLead) {
  //   return { error: "Lead already exist" };
  // }

  const newLead = await db.lead.create({
    data: {
  // addId,
  
 defaultNumber:"",
 userId:"",
 
 
     
     
      firstName: firstName,
      lastName: lastName!,

      address: "N/A",
      city: "N/A",
      state: state,
      cellPhone: cellPhone,
      gender: "NA",
      maritalStatus:"Single",
      email: email,
      dateOfBirth: dateOfBirth,
      policyAmount: "0",
      smoker: false,
      notes: `coverage: ${coverage} beneficiary ${beneficiary}`,
      recievedAt:recievedAt
    },
  });

  if (!newLead) {
    return { error: "Something Went Wrong" };
  }

  

  return { success: "Lead created" };
};
