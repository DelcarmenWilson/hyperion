"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { LeadActivityType } from "@/types/lead";
import {
  LeadBeneficiarySchema,
  LeadBeneficiarySchemaType,
} from "@/schemas/lead";

import { createLeadActivity } from "@/actions/lead/activity";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { getNewTextCode, createLeadRelationship } from ".";
import { chatSettingGetTitan } from "../settings/chat";
import { states } from "@/constants/states";

//LEAD BENFICIARIES
//DATA
export const getLeadBeneficiaries = async (leadId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.leadBeneficiary.findMany({
    where: { leadId },
  });
};
export const getLeadBeneficiary = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.leadBeneficiary.findUnique({
    where: { id },
  });
};

//ACTIONS
export const createLeadBeneficiary = async (
  values: LeadBeneficiarySchemaType
) => {
  const { success, data } = LeadBeneficiarySchema.safeParse(values);
  if (!success) throw new Error(" Invalid fields!");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { leadId, firstName, state, cellPhone } = data;

  const existingBeneficiery = await db.leadBeneficiary.findFirst({
    where: {
      leadId,
      firstName,
    },
  });

  if (existingBeneficiery) throw new Error("Benficiary already exists!");

  const newBeneficiary = await db.leadBeneficiary.create({
    data: {
      ...data,
      cellPhone: reFormatPhoneNumber(cellPhone as string),
      state: state as string,
    },
  });

  await createLeadActivity({
    leadId,
    type: LeadActivityType.BENEFICIARY,
    activity: "Beneficiary Added",
    userId: user.id,
    newValue: firstName,
  });
  return newBeneficiary;
};

export const updateLeadBeneficiary = async (
  values: LeadBeneficiarySchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = LeadBeneficiarySchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const { id, cellPhone, gender } = data;

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id,
    },
  });

  if (!existingBeneficiery) throw new Error("Benficiary does not exists!");

  const modifiedBeneficiary = await db.leadBeneficiary.update({
    where: { id },
    data: {
      ...data,
      gender,
      cellPhone: reFormatPhoneNumber(cellPhone as string),
    },
  });
  return modifiedBeneficiary;
};

export const deleteLeadBeneficiary = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id,
    },
  });

  if (!existingBeneficiery) if (!user) throw new Error("Benficiary does not exists!" );  

  const modifiedBeneficiary = await db.leadBeneficiary.delete({
    where: { id },
  });

  await createLeadActivity({
    leadId: modifiedBeneficiary.leadId,
    type: LeadActivityType.BENEFICIARY,
    activity: "Beneficiary Removed",
    userId: user.id,
    newValue: modifiedBeneficiary.firstName,
  });

  return  "Beneficiary Deleted" ;
};

export const convertLeadToBeneficiary = async (data: {
  leadId: string;
  beneficiaryId: string;
}) => {
  const user = await currentUser(); 
  if (!user) throw new Error("Unauthenticated!");

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id: data.beneficiaryId,
    },
  });

  if (!existingBeneficiery) throw new Error("Benficiary does not exists!" );

  const existingLead = await db.lead.findUnique({
    where: {
      cellPhone: reFormatPhoneNumber(existingBeneficiery.cellPhone),
    },
  });

  if (existingLead) throw new Error("Lead already exist!" );

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

  await db.leadBeneficiary.update({
    where: { id: data.beneficiaryId },
    data: {
      convertedLeadId: newLead.id,
    },
  });

  await createLeadRelationship(data.leadId, newLead.id, relationship);

  return  newLead ;
};
