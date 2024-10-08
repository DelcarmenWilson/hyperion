"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

import { User, UserRole } from "@prisma/client";
import { OnlineUser } from "@/types/user";
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
import {
  userGetByEmail,
  userGetByEmailOrUsername,
  userGetById,
} from "@/data/user";

import { notificationSettingsInsert } from "@/actions/settings/notification";
import { scheduleInsert } from "@/actions/user/schedule";
import { phoneSettingsInsert } from "../settings/phone";
import { displaySettingsInsert } from "../settings/display";

import { capitalize } from "@/formulas/text";
import { getEntireDay } from "@/formulas/dates";

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
    const user = await currentUser();
    if (!user) return [];

    const filter = user.role == "MASTER" ? undefined : user.organization;
    const users = await db.user.findMany({
      where: { team: { organizationId: filter } },
      orderBy: { firstName: "asc" },
    });
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
  //Validate the data passed in
  const validatedFields = RegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!validatedFields.success) return { error: "Invalid fields!" };

  //Destructure the fields
  const { team, npn, userName, password, email, firstName, lastName } =
    validatedFields.data;

  //Get matching user based on email or username
  const existingUser = await userGetByEmailOrUsername(email, userName);

  //If email or username already exist return an error
  if (existingUser) return { error: "Email or UserName already in use!" };

  //Encrypt the users password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Create the user with the data previously specified
  const user = await db.user.create({
    data: {
      teamId: team,
      npn,
      userName: userName.toLocaleLowerCase(),
      password: hashedPassword,
      email: email.toLocaleLowerCase(),
      firstName: capitalize(firstName),
      lastName: capitalize(lastName),
      //TODO dont forget to remove this after fixing token
      emailVerified: new Date(),
    },
  });

  //If the user was not created return an error
  if (!user) return { error: "User could not be created at this time!" };

  //Insert all the user settings for the newly created user
  await userInsertAllSettings(user);

  //If everything went well return a success message
  return { success: "Account created continue to login" };
};

export const userInsertAssistant = async (values: RegisterSchemaType) => {
  //Validate the data passed in
  const validatedFields = RegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!validatedFields.success) return { error: "Invalid fields!" };

  //Destructure the fields
  const { id, team, userName, password, email, firstName, lastName } =
    validatedFields.data;

  //Try to get the agent associated with this account
  const existingAgent = await db.user.findUnique({ where: { id } });
  //If no agent was found return an error
  if (!existingAgent) return { error: "Agent does not exists!" };

  //If the agent already has an assitant return and error
  if (existingAgent.assitantId)
    return { error: "Agent already has an assitant!" };

  //Get matching assistant based on email or username
  const existingAssistant = await userGetByEmailOrUsername(email, userName);
  //If email or username already exist return an error
  if (existingAssistant) return { error: "Email or UserName already in use!" };

  //Encrypt the users password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Create the assistant with the data previously specified
  const assistant = await db.user.create({
    data: {
      teamId: team,
      userName: userName.toLocaleLowerCase(),
      password: hashedPassword,
      email: email.toLocaleLowerCase(),
      firstName: capitalize(firstName),
      lastName: capitalize(lastName),
      //TODO dont forget to remove this after fixing token
      emailVerified: new Date(),
      role: "ASSISTANT",
    },
  });
  //If the assistant was not created return an error
  if (!assistant)
    return { error: "Assitant could not be created at this time!" };

  //Assign asistant to agent
  await db.user.update({ where: { id }, data: { assitantId: assistant.id } });

  //Insert all the user settings for the newly created user
  await userInsertAllSettings(assistant);

  //If everything went well return a success message
  return { success: "Assistant account created!" };
};

export const userInsertMaster = async (values: MasterRegisterSchemaType) => {
  //Validate the data passed in
  const validatedFields = MasterRegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  //Destructure the fields
  const { organization, team, userName, password, email, firstName, lastName } =
    validatedFields.data;

  //Get matching user based on email or username
  const existingUser = await userGetByEmailOrUsername(email, userName);
  //If email or username already exist return an error
  if (existingUser) return { error: "Email or Username already in use!" };

  //Get the master account if it already exist
  const existingMaster = await db.user.findFirst({
    where: {
      role: "MASTER",
    },
  });

  //if the master account already exist return an error
  if (existingMaster) return { error: "Master account already exist" };

  //Encrypt the users password
  const hashedPassword = await bcrypt.hash(password, 10);
  //Create the user with the data previously specified
  const newUser = await db.user.create({
    data: {
      userName: userName.toLocaleLowerCase(),
      password: hashedPassword,
      email: email.toLocaleLowerCase(),
      firstName: capitalize(firstName),
      lastName: capitalize(lastName),
      emailVerified: new Date(),
      role: "MASTER",
    },
  });

  //Create a new organization and team. then assign the new team to the organization and newly created user
  const newOrganization = await db.organization.create({
    data: {
      name: organization,
      userId: newUser.id,
      teams: {
        create: {
          name: team,
          userId: newUser.id,
          users: { connect: { id: newUser.id } },
          ownerId: newUser.id,
        },
      },
    },
  });

  //If the organition was not created return an error
  if (!newOrganization)
    return { error: "Organization could not be created at this time!" };

  //Insert all the user settings for the newly created user
  await userInsertAllSettings(newUser);

  //If everything went well return a success message
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

export const userInsertAllSettings = async (user: User) => {
  //create phone settings
  await phoneSettingsInsert(user.id);

  //create display settings
  await displaySettingsInsert(user.id);

  //create chat settings
  await chatSettingsInsert(user);

  //create notification settings
  await notificationSettingsInsert(user.id);

  //create schedule
  const hours =
    user.role == "MASTER" ? "Not Available" : "09:00-17:00,12:00-13:00";
  await scheduleInsert(user.id, user.firstName, hours);

  //TODO
  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  // return { success: "Confirmation Email sent!" };
};
