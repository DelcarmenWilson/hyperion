"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import {
  SuperAdminRegisterSchema,
  SuperAdminRegisterSchemaType,
} from "@/schemas/register";
import { userGetByEmailOrUsername } from "@/data/user";
import { createUserSettings } from "./user";
import { capitalize } from "@/formulas/text";
//DATA
export const organizationsGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const filter = user.role == "MASTER" ? undefined : user.organization;
    const organizations = await db.organization.findMany({
      where: { id: filter },
      include: { teams: true },
    });
    return organizations;
  } catch (error: any) {
    return [];
  }
};

export const organizationGetById = async (id: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { id },
      include: { teams: true },
    });
    return organization;
  } catch (error: any) {
    return null;
  }
};

//ACTIONS
export const organizationInsert = async (
  values: SuperAdminRegisterSchemaType
) => {
  //Get the current logged in user
  const user = await currentUser();
  //If there is not logged in user retunr an unauthenticated error
  if (!user) return { error: "Unauthenticated" };
  //If the user is not a the master account  return an unauthorized error
  if (user.role != "MASTER") return { error: "Unauthorized" };

  //Validate the data passed in
  const validatedFields = SuperAdminRegisterSchema.safeParse(values);

  //If the data was not succesfully validated return an error
  if (!validatedFields.success) return { error: "Invalid fields!" };

  //Destructure the fields
  const {
    organization,
    team,
    npn,
    userName,
    password,
    email,
    firstName,
    lastName,
  } = validatedFields.data;
  //Try to get an exisiting organization based on the provided name
  const existingOrganization = await db.organization.findFirst({
    where: { name: organization },
  });

  //If the organization with this name already exist return an error
  if (existingOrganization)
    return { error: "An organization already exist with this name!" };

  //Get matching user based on email or username
  const existingUser = await userGetByEmailOrUsername(email, userName);
  //If email or username already exist return an error
  if (existingUser) return { error: "Email or Username already in use!" };

  //Encrypt the users password
  const hashedPassword = await bcrypt.hash(password, 10);
  //Create the user with the data previously specified
  const newUser = await db.user.create({
    data: {
      npn,
      userName: userName.toLocaleLowerCase(),
      password: hashedPassword,
      email: email.toLocaleLowerCase(),
      firstName: capitalize(firstName),
      lastName: capitalize(lastName),
      role: "SUPER_ADMIN",
      //TODO dont forget to remove this after fixing token
      emailVerified: new Date(),
    },
  });

  //If the user was not created return an error
  if (!newUser) return { error: "User could not be created at this time!" };

  //Create a new organization and team. then assign the new team to the organization and newly created user
  const newOrganization = await db.organization.create({
    data: {
      name: organization,
      userId: newUser.id,
      teams: {
        create: {
          name: team,
          userId: user.id,
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
  await createUserSettings(newUser);

  //If everything went well return a success message
  return { success: "Organization created!" };
};
