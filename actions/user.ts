"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import path from "path";
import { writeFile } from "fs/promises";

import { MasterRegisterSchema } from "@/schemas";
import { RegisterSchema } from "@/schemas";
import { SettingsSchema } from "@/schemas";

import { userGetByEmail, userGetById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { chatSettingsInsert } from "./chat-settings";

export const userInsert = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { team, npn, userName, password, email, firstName, lastName } =
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
      userName,
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
  const hours = "09:00-17:00,12:00-13:00";
  await db.schedule.create({
    data: {
      userId: user.id,
      title: "Book an Appointment with #first_name".replace(
        "#first_name",
        user.firstName
      ),
      subTitle:
        "Pick the time that best works for you. I am looking forward to connecting with you.",
      monday: hours,
      tuesday: hours,
      wednesday: hours,
      thursday: hours,
      friday: hours,
      saturday: "Not Available",
      sunday: "Not Available",
    },
  });

  return { success: "Account created continue to login" };
};

export const userMasterInsert = async (
  values: z.infer<typeof MasterRegisterSchema>
) => {
  const validatedFields = MasterRegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { organization, team, userName, password, email, firstName, lastName } =
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
      userName,
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

  await chatSettingsInsert(newUser);

  const hours = "Not Available";

  await db.schedule.create({
    data: {
      userId: newUser.id,
      title: "Book an Appointment with #first_name".replace(
        "#first_name",
        newUser.firstName
      ),
      subTitle:
        "Pick the time that best works for you. I am looking forward to connecting with you.",
      monday: hours,
      tuesday: hours,
      wednesday: hours,
      thursday: hours,
      friday: hours,
      saturday: hours,
      sunday: hours,
    },
  });

  return { success: "Master account created" };
};

export const userUpdateById = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await userGetById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await userGetByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordsMatch) {
      return { error: "Incorrect password" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });
  return { success: "Settings Updated! " };
};
