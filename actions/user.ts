"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

import { UserRole } from "@prisma/client";
import {
  MasterRegisterSchema,
  NewPasswordSchema,
  UserCarrierSchema,
  UserLicenseSchema,
  UserTemplateSchema,
} from "@/schemas";
import { RegisterSchema } from "@/schemas";
import { SettingsSchema } from "@/schemas";

import { chatSettingsInsert } from "./chat-settings";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { userGetByEmail, userGetById } from "@/data/user";
import { notificationSettingsInsert } from "./notification-settings";
import { scheduleInsert } from "./schedule";

//ACTIONS
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

  //CREATE CHAT SETTINGS
  await chatSettingsInsert(user);

  //NOTIFICATION SETTINGS
  await notificationSettingsInsert(user.id);

  //SCHEDULE
  const hours = "09:00-17:00,12:00-13:00";
  await scheduleInsert({
    userId: user.id,
    type: "",
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
  });

  //TODO
  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  // return { success: "Confirmation Email sent!" };
  return { success: "Account created continue to login" };
};

export const userInsertAssistant = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, team, userName, password, email, firstName, lastName } =
    validatedFields.data;

  const existingUser = await db.user.findUnique({ where: { id } });
  if (!existingUser) {
    return { error: "Agent does not exists!" };
  }

  if (existingUser.assitantId) {
    return { error: "Agent already has an assitant!" };
  }
  const existingAssistant = await userGetByEmail(email);

  if (existingAssistant) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const assistant = await db.user.create({
    data: {
      teamId: team,
      userName,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      //TODO dont forget to remove this after fixing token
      emailVerified: new Date(),
      role: "ASSISTANT",
    },
  });

  //TODO
  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  // return { success: "Confirmation Email sent!" };

  //ASSIGN ASISTANT TO AGENT
  await db.user.update({ where: { id }, data: { assitantId: assistant.id } });
  //CREATE CHAT SETTINGS
  await chatSettingsInsert(assistant);
  const hours = "09:00-17:00,12:00-13:00";
  await db.schedule.create({
    data: {
      userId: assistant.id,
      title: "Book an Appointment with #first_name".replace(
        "#first_name",
        assistant.firstName
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

  return { success: "Asistant account created" };
};

export const userInsertMaster = async (
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
  //NEW USER
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
  //NEW ORGANIZATION
  const newOrganization = await db.organization.create({
    data: { name: organization, userId: newUser.id },
  });
  //NEW TEAM
  const newTeam = await db.team.create({
    data: {
      name: team,
      organizationId: newOrganization.id,
      userId: newUser.id,
    },
  });

  //UPDATE USER WITH NEW TEAM INFO
  await db.user.update({
    where: { id: newUser.id },
    data: {
      teamId: newTeam.id,
    },
  });
  //CHAT SETTINGS
  await chatSettingsInsert(newUser);

  //NOTIFICATION SETTINGS
  await notificationSettingsInsert(newUser.id);

  //SCHEDULE
  const hours = "Not Available";

  await scheduleInsert({
    userId: newUser.id,
    type: "",
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

export const userUpdateEmailVerification = async (token: string) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await userGetByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await chatSettingsInsert(existingUser);

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified" };
};

export const userUpdatePassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await userGetByEmail(existingToken.email);
  if (!existingUser) {
    return { error: " Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated!" };
};

// USER_LICENSES
export const userLicenseInsert = async (
  values: z.infer<typeof UserLicenseSchema>
) => {
  const validatedFields = UserLicenseSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const { state, type, licenseNumber, dateExpires, comments } =
    validatedFields.data;

  const existingLicense = await db.userLicense.findFirst({
    where: { state,licenseNumber },
  });

  if (existingLicense) {
    return { error: "License already exist!" };
  }
  const license = await db.userLicense.create({
    data: {
      state,
      type,
      licenseNumber,
      dateExpires: new Date(dateExpires),
      comments,
      userId: user.id,
    },
  });

  return { success: license };
};
//USER_CARRIER
export const userCarrierInsert = async (
  values: z.infer<typeof UserCarrierSchema>
) => {
  const validatedFields = UserCarrierSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const { agentId, carrierId, comments } = validatedFields.data;

  const existingLicense = await db.userCarrier.findFirst({
    where: { carrierId },
  });

  if (existingLicense) {
    return { error: "Carrier relationship already exist!" };
  }
  const carrier = await db.userCarrier.create({
    data: {
      agentId,
      carrierId,
      comments,
      userId: user.id,
    },
    include: { carrier: { select: { name: true } } },
  });

  return { success: carrier };
};



//USER_TEMPLATE
export const userTemplateInsert = async (
  values: z.infer<typeof UserTemplateSchema>
) => {
  const validatedFields = UserTemplateSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const { name,message,description,attachment } = validatedFields.data;

  const exisitingTemplate = await db.userTemplate.findFirst({
    where: { name,userId:user.id },
  });

  if (exisitingTemplate) {
    return { error: "Template with the same name already exist!" };
  }
  const template = await db.userTemplate.create({
    data: {
      userId: user.id,
      name,
      message:message!,
      description,
      attachment
    },
  });

  return { success: template };
};
