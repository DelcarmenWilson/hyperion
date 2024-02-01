"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

import { MasterRegisterSchema } from "@/schemas";
import { RegisterSchema } from "@/schemas";

import { userGetByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { chatSettingsInsert } from "./chat-settings";

export const userInsert = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { team, npn, username, password, email, firstName, lastName } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await userGetByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // return {success:"Register Diasabled!"}

  const user = await db.user.create({
    data: {
      teamId: team,
      npn,
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      //TODO dont forget to remove this after fixing token
      emailVerified: new Date(),
    },
  });
  //TODO
  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  // return { success: "Confirmation Email sent!" };

  //CREATE CHAT SETTINGS
  await chatSettingsInsert(user);

  return { success: "Account created continue to login" };
};

export const userMasterInsert = async (
  values: z.infer<typeof MasterRegisterSchema>
) => {
  const validatedFields = MasterRegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { organization, team, username, password, email, firstName, lastName } =
    validatedFields.data;

  const existingMaster = await db.user.findFirst({
    where: {
      role: "MASTER",
    },
  });

  if (existingMaster) {
    return { error: "Master account already exist" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      emailVerified: new Date(),
      role: "MASTER",
    },
  });

  const newOrganization = await db.organization.create({
    data: { name: organization, userId: newUser.id },
  });
  const newTeam = await db.team.create({
    data: {
      name: team,
      organizationId: newOrganization.id,
      userId: newUser.id,
    },
  });

  await db.user.update({
    where: { id: newUser.id },
    data: {
      teamId: newTeam.id,
    },
  });

  return { success: "Master account created" };
};



