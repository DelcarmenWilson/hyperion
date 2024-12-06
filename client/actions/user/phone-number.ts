"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
import {
  CreatePhoneNumberSchema,
  CreatePhoneNumberSchemaType,
} from "@/schemas/user";

import {
  PhoneNumberSchema,
  PhoneNumberSchemaType,
} from "@/schemas/phone-number";

//DATA
export const getPhoneNumbersForAgent = async (agentId: string) => {
  return await db.phoneNumber.findMany({ where: { agentId } });
};

export const getAssignedPhoneNumbers = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const filter = user.role == "MASTER" ? undefined : user.organization;
  return await db.phoneNumber.findMany({
    where: {
      agent: { team: { organizationId: filter } },
      NOT: {
        agentId: null,
      },
    },
    include: { agent: { select: { firstName: true, lastName: true } } },
    orderBy: {
      agent: { firstName: "asc" },
    },
  });
};
export const getUnassignedPhoneNumbers = async () => {
  const role = await currentRole();
  if (role != "MASTER") throw new Error("Unauthorized!");
  return await db.phoneNumber.findMany({
    where: {
      agentId: null,
    },
  });
};
//ACTIONS

export const createPhoneNumber = async (values: {
  phone: string;
  state: string;
  agentId: string | null;
  sid: string;
  app: string;
}) => {
  const existingPhoneNumber = await db.phoneNumber.findFirst({
    where: { phone:values.phone },
  });

  if (existingPhoneNumber) throw new Error("Phone number already exists");

  let status = "Unassigned";
  if (values.agentId == "unassigned") {
    values.agentId = null;
  } else {
    const usernumber = await db.phoneNumber.findFirst({
      where: { agentId:values.agentId },
    });
    status = usernumber ? "Active" : "Default";
  }
  var date = new Date();
  date.setDate(date.getDate() + 30);
  const newPhoneNumber = await db.phoneNumber.create({
    data: {
      ...values,
      phone: reFormatPhoneNumber(values.phone),     
      status,
      renewAt: date,
    },
  });

  if (!newPhoneNumber) throw new Error("Phone number was not purchased!");

  return newPhoneNumber.id;
};

export const updatePhoneNumber = async (values: PhoneNumberSchemaType) => {
  //Authenticate the current logged In user
  const user = await currentUser();
  //If no user is found return an error
  if (!user) throw new Error("Unauthenticated!");

  //Validate the data coming in
  const { success, data } = PhoneNumberSchema.safeParse(values);
  //If the data cannot be validated return an error
  if (!success) throw new Error("Invalid fields!");
  //Destructure the values from the data
  const { id, agentId, app, registered } = data;

  //Get the information about the current phonenumber in question
  const thisNumber = await db.phoneNumber.findUnique({
    where: { id },
  });
  //If this phone number does not exist return an error
  if (!thisNumber) throw new Error("Number does not exist!");
  //Get the first number assigned to this agent
  const usernumber = await db.phoneNumber.findFirst({
    where: { agentId },
  });

  //Create a new date that will be used for the renew date
  var date = new Date();
  date.setDate(date.getDate() + 30);
  //create temporary values to update the current record
  let newStatus = usernumber ? "Active" : "Default";
  let newDate = date;

  //If the current agent is the same as the previous agent keep the defaults of the previous agent
  if (thisNumber.agentId == agentId) {
    newStatus = thisNumber.status;
    newDate = thisNumber.renewAt;
  }

  //Update the phone number record with the values provided
  const updatePhoneNumber = await db.phoneNumber.update({
    where: { id: thisNumber.id },
    data: { app, status: newStatus, agentId, renewAt: newDate, registered },
  });
  if (!updatePhoneNumber)
    throw new Error("The phone number could not be updated at this time");
  //If everything went well return an success message with the update phonenumber record
  return {
    changes: app == thisNumber.app,
    app: updatePhoneNumber.app,
    sid: updatePhoneNumber.sid,
  };
};

export const activatePhoneNumber = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const existingNumber = await db.phoneNumber.findUnique({
    where: { id, agentId: user.id },
  });

  if (!existingNumber) return { error: "Unauthorized!" };

  await db.phoneNumber.update({
    where: { id: existingNumber.id },
    data: { status: "Active" },
  });

  return { success: "Phone number has been activated!" };
};

export const deactivatePhoneNumber = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const userPhoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Inactive" } },
  });
  const thisNumber = userPhoneNumbers.find((e) => e.id == id);

  if (!thisNumber) return { error: "Unauthorized!" };

  let status: string = "";
  if (thisNumber.status == "Default") {
    if (userPhoneNumbers.length == 1)
      return { error: "Can not deactive the only phone number you have!" };
    status = "Default";
  }

  await db.phoneNumber.update({
    where: { id: thisNumber?.id },
    data: { status: "Inactive" },
  });

  if (status == "Default") {
    const nextNumber = userPhoneNumbers.find((e) => e.id != id);
    await db.phoneNumber.update({
      where: { id: nextNumber?.id },
      data: { status },
    });
  }

  return { success: "Phone number has been deactivated!" };
};

export const updatePhoneNumberDefault = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const thisNumber = await db.phoneNumber.findUnique({
    where: { id, agentId: user.id },
  });

  if (!thisNumber) {
    return { error: "Unauthorized!" };
  }

  const defaultNumber = await db.phoneNumber.findFirst({
    where: { agentId: user.id, status: "Default" },
  });

  if (defaultNumber) {
    await db.phoneNumber.update({
      where: { id: defaultNumber?.id },
      data: { status: "Active" },
    });
  }

  await db.phoneNumber.update({
    where: { id: thisNumber?.id },
    data: { status: "Default" },
  });

  return { success: "Phone number is now default!" };
};
