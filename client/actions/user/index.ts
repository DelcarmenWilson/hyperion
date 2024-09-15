"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

import { SummaryUser } from "@/types";
import { UserAboutMeSchema, UserAboutMeSchemaType } from "@/schemas/user";
import {
  MasterRegisterSchema,
  MasterRegisterSchemaType,
  NewPasswordSchema,
  NewPasswordSchemaType,
  RegisterSchema,
  RegisterSchemaType,
} from "@/schemas/register";
import { SettingsSchemaType } from "@/schemas/settings";

import { chatSettingsInsert } from "@/actions/settings/chat";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { userGetByEmail, userGetById } from "@/data/user";
import { notificationSettingsInsert } from "@/actions/settings/notification";
import { scheduleInsert } from "@/actions/user/schedule";
import { UserRole } from "@prisma/client";
import { OnlineUser } from "@/types/user";
import { getEntireDay } from "@/formulas/dates";
import { phoneSettingsInsert } from "../settings/phone";
import { displaySettingsInsert } from "../settings/display";

//DATA
export const userGetByIdOnline = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const onlinUser = await db.user.findUnique({
      where: { id: user.id },
    });

    return onlinUser;
  } catch {
    return null;
  }
};
export const userGetByUserName = async (userName: string) => {
  try {
    const user = await db.user.findUnique({
      where: { userName },
    });

    return user;
  } catch {
    return null;
  }
};
export const usersGetAll = async () => {
  try {
    const users = await db.user.findMany({ orderBy: { firstName: "asc" } });
    return users;
  } catch {
    return [];
  }
};

export const usersGetAllChat = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const dbUsers = await db.user.findMany({
      where: { role: { not: "MASTER" }, id: { not: user.id } },
      include: {
        calls: { where: { createdAt: { gte: getEntireDay().start } } },
        loginStatus: { where: { createdAt: { gte: getEntireDay().start } } },
      },
      orderBy: { firstName: "asc" },
    });
    const users: OnlineUser[] = dbUsers.map((usr) => {
      return {
        ...usr,
        chatId: "",
        online: false,
        calls: usr.calls.length,
        duration: usr.loginStatus.reduce(
          (sum, login) => sum + login.duration,
          0
        ),
      };
    });

    return users;
  } catch {
    return [];
  }
};

export const usersGetAllByRole = async (role: UserRole) => {
  try {
    const users = await db.user.findMany({
      where: { role },
      orderBy: { firstName: "asc" },
    });
    return users;
  } catch {
    return [];
  }
};

export const usersGetSummaryByTeamId = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }
    if (user.role != "MASTER") return [];

    const agents = await db.user.findMany({
      where: { teamId: user.team, NOT: { id: user.id } },
      include: {
        phoneNumbers: {
          where: { status: "default" },
        },
        chatSettings: true,
        phoneSettings: { select: { currentCall: true } },
      },
    });

    return agents as SummaryUser[];
  } catch {
    return [];
  }
};

export const userGetAdAccount = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    const account = await db.user.findUnique({
      where: { id: user.id },
      select: { adAccount: true },
    });
    if (!account) {
      return null;
    }
    return account.adAccount;
  } catch {
    return null;
  }
};

//ACTIONS
export const userInsert = async (values: RegisterSchemaType) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { team, npn, userName, password, email, firstName, lastName } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await userGetByEmail(email);

  if (existingUser) return { error: "Email already in use!" };

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

  //create phone settings
  await phoneSettingsInsert(user.id);

  //create display settings
  await displaySettingsInsert(user.id);

  //create chat settings
  await chatSettingsInsert(user);

  //create notification settings
  await notificationSettingsInsert(user.id);

  //create schedule
  const hours = "09:00-17:00,12:00-13:00";
  await scheduleInsert(user.id,user.firstName,hours);

  //TODO
  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  // return { success: "Confirmation Email sent!" };
  return { success: "Account created continue to login" };
};

export const userInsertAssistant = async (values: RegisterSchemaType) => {
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

export const userInsertMaster = async (values: MasterRegisterSchemaType) => {
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

  await scheduleInsert(newUser.id,
      newUser.firstName,hours);

  return { success: "Master account created" };
};

export const userUpdateById = async (values: SettingsSchemaType) => {
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

export const userUpdateByIdImage = async (image: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      image,
    },
  });

  revalidatePath("/");
  return { success: "User profile image updated!" };
};

export const userUpdateByIdAboutMe = async (values: UserAboutMeSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = UserAboutMeSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, aboutMe, title } = validatedFields.data;

  await db.user.update({
    where: {
      id,
    },
    data: {
      aboutMe,
      title,
    },
  });

  return { success: "About Me section updated!" };
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
  values: NewPasswordSchemaType,
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

//FACEBOOK
export const userUpdateAdAccount = async (adAccount: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthentiocated" };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      adAccount,
    },
  });

  return { success: "Ad account has been added!" };
};

//HELPER FUNCTION
export const userGetByAssistant = async () => {
  //check if the user is currently logged in
  const user = await currentUser();
  //if there is no logged in used return null
  if (!user) return null;
  //if the currently logged in user is an assistant
  //get the account associted with this assitant and return the agent
  if (user?.role == "ASSISTANT") {
    const assistant = await db.user.findUnique({
      where: { assitantId: user.id },
    });
    if (!assistant) return user?.id;
    return assistant.id;
  }
  //retun the currently logged in user.id
  return user?.id;
};
