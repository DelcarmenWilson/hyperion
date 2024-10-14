"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import {
  LeadBeneficiarySchema,
  LeadBeneficiarySchemaType,
} from "@/schemas/lead";

import { leadActivityInsert } from "@/actions/lead/activity";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { getNewTextCode, leadsOnLeadsInsert } from ".";
import { chatSettingGetTitan } from "../settings/chat";
import { states } from "@/constants/states";

//LEAD BENFICIARIES
//DATA
export const leadBeneficiariesGetAllById = async (leadId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }
    const beneficieries = await db.leadBeneficiary.findMany({
      where: { leadId },
    });
    return beneficieries;
  } catch (error) {
    console.log("LEAD BENEFICIERY_GET_ALL_ERROR:", error);
    return [];
  }
};
export const leadBeneficiaryGetById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const beneficiery = await db.leadBeneficiary.findUnique({
      where: { id },
    });
    return beneficiery;
  } catch (error) {
    console.log("LEAD BENEFICIERY_GET_ERROR:", error);
    return null;
  }
};

//ACTIONS
export const leadBeneficiaryInsert = async (
  values: LeadBeneficiarySchemaType
) => {
  const validatedFields = LeadBeneficiarySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const {
    leadId,
    type,
    relationship,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    cellPhone,
    gender,
    email,
    dateOfBirth,
    share,
    ssn,
    notes,
  } = validatedFields.data;

  const existingBeneficiery = await db.leadBeneficiary.findFirst({
    where: {
      leadId,
      firstName,
    },
  });

  if (existingBeneficiery) {
    return { error: "Benficiary already exists!" };
  }

  const newBeneficiary = await db.leadBeneficiary.create({
    data: {
      leadId,
      type,
      relationship,
      firstName,
      lastName,
      address,
      city,
      state: state as string,
      zipCode,
      cellPhone: reFormatPhoneNumber(cellPhone as string),
      gender: gender,
      email,
      dateOfBirth,
      share,
      ssn,
      notes,
    },
  });
  await leadActivityInsert(
    leadId,
    "Beneficiary",
    "Beneficiary Added",
    user.id,
    firstName
  );
  return { success: newBeneficiary };
};
export const leadBeneficiaryUpdateById = async (
  values: LeadBeneficiarySchemaType
) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const validatedFields = LeadBeneficiarySchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const {
    id,
    type,
    relationship,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    cellPhone,
    gender,
    email,
    dateOfBirth,
    share,
    ssn,
    notes,
  } = validatedFields.data;

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id,
    },
  });

  if (!existingBeneficiery) {
    return { error: "Benficiary does not exists!" };
  }

  const modifiedBeneficiary = await db.leadBeneficiary.update({
    where: { id },
    data: {
      type,
      relationship,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      cellPhone: reFormatPhoneNumber(cellPhone as string),
      gender: gender,
      email,
      dateOfBirth,
      share,
      ssn,
      notes,
    },
  });
  return { success: modifiedBeneficiary };
};

export const leadBeneficiaryDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id,
    },
  });

  if (!existingBeneficiery) {
    return { error: "Benficiary does not exists!" };
  }

  const modifiedBeneficiary = await db.leadBeneficiary.delete({
    where: { id },
  });

  await leadActivityInsert(
    modifiedBeneficiary.leadId,
    "Beneficiary",
    "Beneficiary Removed",
    user.id,
    modifiedBeneficiary.firstName
  );

  return { success: "Beneficiary Deleted" };
};

export const leadBeneficiaryConvertById = async (
  {leadId,
    beneficiaryId}:
  {leadId: string,
  beneficiaryId: string}
) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id: beneficiaryId,
    },
  });

  if (!existingBeneficiery) return { error: "Benficiary does not exists!" };

  const existingLead = await db.lead.findUnique({
    where: {
      cellPhone: reFormatPhoneNumber(existingBeneficiery.cellPhone),
    },
  });

  if (existingLead) return { error: "Lead already exist!" };

  const {
    relationship,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    cellPhone,
    gender,
    email,
    dateOfBirth,
  } = existingBeneficiery;

 
  const st = states.find((e) => e.state.toLowerCase() == state.toLowerCase());

  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Deactive" } },
  });

  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
  const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);

  //Get a new new Text code
  const textCode = await getNewTextCode(firstName, lastName, cellPhone);
  //Get titan (autoChat) from chat settings
  const titan = await chatSettingGetTitan(user.id);

  const newLead = await db.lead.create({
    data: {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone: cellPhone ? reFormatPhoneNumber(cellPhone) : "",
      cellPhone: reFormatPhoneNumber(cellPhone),
      gender,
      maritalStatus: "Single",
      email,
      dateOfBirth,
      defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
      userId: user.id,
      height: "",
      weight: "",
      textCode,
      titan,
    },
  });

  await db.leadBeneficiary.update({where:{id:beneficiaryId},data:{
    convertedLeadId:newLead.id
  }})

  await leadsOnLeadsInsert(leadId, newLead.id, relationship);

  return { success: newLead };
};
