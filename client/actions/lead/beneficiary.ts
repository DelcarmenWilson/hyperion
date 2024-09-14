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
    return []
  }
};
export const leadBeneficiaryGetById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) 
      return null
    
    const beneficiery = await db.leadBeneficiary.findUnique({
      where: { id },
    });
    return beneficiery;
  } catch (error) {
    console.log("LEAD BENEFICIERY_GET_ERROR:", error);
    return null
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
  const validatedFields = LeadBeneficiarySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

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
  if (!user) {
    return { error: "Unauthorized" };
  }

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
