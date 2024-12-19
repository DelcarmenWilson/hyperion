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
export const getOnlineUser = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.user.findUnique({
    where: { id: user.id },
  });
};
export const getUserByUserName = async (userName: string) => {
  return await db.user.findUnique({
    where: { userName },
  });
};
export const getUsers = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const filter = user.role == "MASTER" ? undefined : user.organization;
  return await db.user.findMany({
    where: { team: { organizationId: filter } },
    orderBy: { firstName: "asc" },
  });
};
export const getOtherUsers = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const filter = user.role == "MASTER" ? undefined : user.organization;
  return await db.user.findMany({
    where: { team: { organizationId: filter }, id: { not: user.id } },
    orderBy: { firstName: "asc" },
  });
};

export const getUserById = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.user.findUnique({
    where: { id },
  });
};

export const getUsersChat = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const dbUsers = await db.user.findMany({
      where: {
        role: { not: "MASTER" },
        id: { not: user.id },
        team: { organizationId: user.organization },
      },
      include: {
        communications: { where: {type: { not: "sms" }, createdAt: { gte: getEntireDay().start } } },
        loginStatus: { where: { createdAt: { gte: getEntireDay().start } } },
      },
      orderBy: { firstName: "asc" },
    });

    const chats = await db.chat.findMany({
      where: {
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
        unread: { gt: 0 },
      },
      include: { lastMessage: { select: { senderId: true, body: true } } },
    });

    const getMoreData = (
      userId: string
    ): { chatId: string; lastMessage: string; unread: number } => {
      const chat = chats.find(
        (e) => e.userOneId == userId || e.userTwoId == userId
      );
      if (!chat) return { chatId: "", lastMessage: "", unread: 0 };

      if (chat.lastMessage?.senderId == userId)
        return {
          chatId: chat.id,
          lastMessage: chat.lastMessage?.body || "",
          unread: chat.unread,
        };
      return { chatId: "", lastMessage: "", unread: 0 };
    };
    const users: OnlineUser[] = dbUsers.map((usr) => {
      return {
        ...usr,
        // chatId:
        //   chats.find((e) => e.userOneId == usr.id || e.userTwoId == usr.id)
        //     ?.id || "",
        online: false,
        calls: usr.communications.length,
        duration: usr.loginStatus.reduce(
          (sum, login) => sum + login.duration,
          0
        ),
        // unread: getUnreadMessages(usr.id),
        ...getMoreData(usr.id),
      };
    });

    // const users: OnlineUser[] = dbUsers.map((usr) => {
    //   return {
    //     ...usr,
    //     chatId:
    //       chats.find((e) => e.userOneId == usr.id || e.userTwoId == usr.id)
    //         ?.id || "",
    //     online: false,
    //     calls: usr.calls.length,
    //     duration: usr.loginStatus.reduce(
    //       (sum, login) => sum + login.duration,
    //       0
    //     ),
    //     unread: getUnreadMessages(usr.id),
    //   };
    // });

    return users;
  } catch {
    return [];
  }
};

export const getUsersByRole = async (role: UserRole) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.user.findMany({
    where: { role, id: { not: user.id } },
    orderBy: { firstName: "asc" },
  });
};

export const getUserSummaryByTeam = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "MASTER") throw new Error("Unauthorized!");

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
};

export const getUserAdAccount = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  const account = await db.user.findUnique({
    where: { id: user.id },
    select: { adAccount: true },
  });
  if (!account) throw new Error("No account!");
  return account.adAccount;
};

//ACTIONS
export const createUser = async (values: RegisterSchemaType) => {
  //Validate the data passed in
  const { success, data } = RegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!success) return { error: "Invalid fields!" };

  //Destructure the fields
  const { team, npn, userName, password, email, firstName, lastName } = data;

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
  await createUserSettings(user);

  //If everything went well return a success message
  return { success: "Account created continue to login" };
};

export const createAssistant = async (values: RegisterSchemaType) => {
  //Validate the data passed in
  const { success, data } = RegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!success) throw new Error("Invalid fields!");

  //Destructure the fields
  const { id, team, userName, password, email, firstName, lastName } = data;

  //Try to get the agent associated with this account
  const existingAgent = await db.user.findUnique({ where: { id } });
  //If no agent was found return an error
  if (!existingAgent) throw new Error("Agent does not exists!");

  //If the agent already has an assitant return and error
  if (existingAgent.assitantId)
    throw new Error("Agent already has an assitant!");

  //Get matching assistant based on email or username
  const existingAssistant = await userGetByEmailOrUsername(email, userName);
  //If email or username already exist return an error
  if (existingAssistant) throw new Error("Email or UserName already in use!");

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
    throw new Error("Assitant could not be created at this time!");

  //Assign asistant to agent
  await db.user.update({ where: { id }, data: { assitantId: assistant.id } });

  //Insert all the user settings for the newly created user
  await createUserSettings(assistant);

  //If everything went well return a success message
  return "Assistant account created!";
};

export const createMaster = async (values: MasterRegisterSchemaType) => {
  //Validate the data passed in
  const { success, data } = MasterRegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!success) throw new Error("Invalid fields!");

  //Destructure the fields
  const { organization, team, userName, password, email, firstName, lastName } =
    data;

  //Get matching user based on email or username
  const existingUser = await userGetByEmailOrUsername(email, userName);
  //If email or username already exist return an error
  if (existingUser) throw new Error("Email or Username already in use!");

  //Get the master account if it already exist
  const existingMaster = await db.user.findFirst({
    where: {
      role: "MASTER",
    },
  });

  //if the master account already exist return an error
  if (existingMaster) throw new Error("Master account already exist");

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
    throw new Error("Organization could not be created at this time!");

  //Insert all the user settings for the newly created user
  await createUserSettings(newUser);

  //If everything went well return a success message
  return "Master account created";
};

export const updateUser = async (values: SettingsSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const dbUser = await userGetById(user.id);
  if (!dbUser) throw new Error("Unauthorized");

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await userGetByEmail(values.email);
    if (existingUser && existingUser.id !== user.id)
      throw new Error("Email already in use!");

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return "Verification email sent";
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordsMatch) throw new Error("Incorrect password");
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
  return "Settings Updated! ";
};

export const updateUserImage = async (image: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      image,
    },
  });

  revalidatePath("/");
  return "User profile image updated!";
};

export const updateUserAboutMe = async (values: UserAboutMeSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = UserAboutMeSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  await db.user.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
    },
  });

  return "About Me section updated!";
};

export const updateUserEmailVerification = async (token: string) => {
  if (!token) return { error: "Missing token!" };

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token does not exist" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await userGetByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist!" };

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

export const updateUserPassword = async (
  values: NewPasswordSchemaType,
  token?: string | null
) => {
  if (!token) return { error: "Missing token!" };

  const { success, data } = NewPasswordSchema.safeParse(values);

  if (!success) return { error: "Invalid fields!" };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Invalid token!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await userGetByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist!" };

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.$transaction([
    db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    }),

    db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    }),
  ]);

  return { success: "Password updated!" };
};

//FACEBOOK
export const updateUserAdAccount = async (adAccount: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  await db.user.update({
    where: { id: user.id },
    data: {
      adAccount,
    },
  });

  return "Ad account has been added!";
};

//HELPER FUNCTION
export const getAssitantForUser = async () => {
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

export const createUserSettings = async (user: User) => {
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
