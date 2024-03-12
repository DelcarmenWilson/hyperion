"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentRole, currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { CarrierSchema, MedicalConditionSchema, QuoteSchema } from "@/schemas";

export const admin = async () => {
  const role = await currentRole();
  if (role === UserRole.ADMIN) {
    return { success: "Allowed" };
  }

  return { error: "Forbidden!" };
};

export const adminChangeLeadDefaultNumber = async (
  userId: string,
  oldPhone: string,
  newPhone: string
) => {
  const changes = await db.lead.updateMany({
    where: { userId, defaultNumber: oldPhone },
    data: { defaultNumber: newPhone },
  });

  return { success: `${changes} phone numbers have be changed` };
};

export const adminUpdateLeadNumbers = async (userId: string) => {
  const leads = await db.lead.findMany({
    where: { userId },
  });

  if (!leads.length) {
    return { error: "No leads found" };
  }

  for (const lead of leads) {
    await db.lead.update({
      where: { id: lead.id },
      data: {
        cellPhone: reFormatPhoneNumber(lead.cellPhone),
        defaultNumber: reFormatPhoneNumber(lead.defaultNumber),
      },
    });
  }

  return { success: "phone numbers have been updated" };
};

export const adminUpdateUserNumber = async (agentId: string) => {
  const phoneNumbers = await db.phoneNumber.findMany({ where: { agentId } });
  if (!phoneNumbers.length) {
    return { error: "No phone number found" };
  }

  for (const number of phoneNumbers) {
    await db.phoneNumber.update({
      where: { id: number.id },
      data: {
        phone: reFormatPhoneNumber(number.phone),
      },
    });
  }
  return { success: "user number have been updated" };
};

export const adminConfirmUserEmail = async (userId: string, date: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User does not exist" };
  }

  await db.user.update({
    where: { id: userId },
    data: { emailVerified: new Date(date) },
  });

  return { success: "Email has been confirmed" };
};

export const adminChangeUserRole = async (userId: string, role: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  const newRole: UserRole = UserRole[role as keyof typeof UserRole];

  if (!user) {
    return { error: "User does not exist" };
  }

  await db.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  return { success: "Role has been changed" };
};
// TEAM
export const adminChangeTeam = async (userId: string, teamId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User does not exist" };
  }
  const exisitingTeam = await db.team.findUnique({ where: { id: teamId } });
  if (!exisitingTeam) {
    return { error: "Team does not exist!t" };
  }

  if (!exisitingTeam.ownerId) {
    return { error: "Team does not have an owner yet" };
  }
  await db.user.update({
    where: { id: userId },
    data: { teamId },
  });

  return { success: "Team has been changed" };
};

export const adminChangeTeamManager = async (
  teamId: string,
  userId: string
) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User does not exist" };
  }
  const exisitingTeam = await db.team.findUnique({ where: { id: teamId } });
  if (!exisitingTeam) {
    return { error: "Team does not exist!" };
  }
  const exisitingUser = await db.user.findUnique({
    where: { id: userId },
    include: { teamOwned: true },
  });
  if (!exisitingUser) {
    return { error: "User does not exist!" };
  }

  if (exisitingUser.teamOwned) {
    return { error: `${exisitingUser.firstName} already manages a team!` };
  }

  await db.team.update({
    where: { id: teamId },
    data: {
      ownerId: exisitingUser.id,
    },
  });

  return {
    success: `${exisitingUser.firstName} now manages ${exisitingTeam.name}!`,
  };
};
// LEAD_STATUS
export const adminLeadStatusInsert = async (status: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }

  const existingStatus = await db.leadStatus.findFirst({ where: { status } });
  if (existingStatus) {
    return { error: "Status already exists" };
  }

  await db.leadStatus.create({
    data: {
      status,
      type: "default",
      userId: user.id,
    },
  });

  return { success: "Status created" };
};

//CARRIER
export const adminCarrierInsert = async (
  values: z.infer<typeof CarrierSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = CarrierSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { image, name, description } = validatedFields.data;

  const existingCarrier = await db.carrier.findFirst({ where: { name } });
  if (existingCarrier) {
    return { error: "Carrier already exists" };
  }

  const carrier = await db.carrier.create({
    data: {
      image: image as string,
      name,
      description,
    },
  });

  return { success: carrier };
};
export const adminCarrierUpdateById = async (
  values: z.infer<typeof CarrierSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = CarrierSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id,name, description,website,portal } = validatedFields.data;

  const existingCarrier = await db.carrier.findUnique({ where: { id } });
  if (!existingCarrier) {
    return { error: "Carrier does not exists" };
  }

 await db.carrier.update({where: { id },
    data: {
      name, description,website,portal
    },
  });

  return { success: "Carrier updated" };
};

//MEDICAL CONDITIONS
export const adminMedicalInsert = async (
  values: z.infer<typeof MedicalConditionSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = MedicalConditionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {  name, description } = validatedFields.data;

  const existingCondition = await db.carrier.findFirst({ where: { name } });
  if (existingCondition) {
    return { error: "Condition already exists" };
  }

  const condition = await db.medicalCondition.create({
    data: {
      name,
      description:description as string,
    },
  });

  return { success: condition };
};

//QUOTES
export const adminQuoteInsert = async (
  values: z.infer<typeof QuoteSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = QuoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { quote, author } = validatedFields.data;

  const existingQuote= await db.quote.findFirst({ where: { quote } });
  if (existingQuote) {
    return { error: "Quote already exists" };
  }

  const newQuote = await db.quote.create({
    data: {
      quote,
      author    },
  });

  return { success: newQuote };
};