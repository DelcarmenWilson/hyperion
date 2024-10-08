"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
import {
  UserPhoneNumberSchema,
  UserPhoneNumberSchemaType,
} from "@/schemas/user";

//DATA
export const phoneNumbersGetByAgentId = async (agentId: string) => {
  try {
    const phones = await db.phoneNumber.findMany({ where: { agentId } });

    return phones;
  } catch (error: any) {
    return [];
  }
};

export const phoneNumbersGetAssigned = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const filter = user.role == "MASTER" ? undefined : user.organization;
    const phones = await db.phoneNumber.findMany({
      where: {
        agent: { team: { organizationId: filter } },
        NOT: {
          agentId: null,
        },
      },
      include: { agent: { select: { firstName: true, lastName: true } } },
    });

    return phones;
  } catch (error: any) {
    return [];
  }
};
export const phoneNumbersGetUnassigned = async () => {
  try {
    const role = await currentRole();
    if (role != "MASTER") return [];
    const phones = await db.phoneNumber.findMany({
      where: {
        agentId: null,
      },
    });

    return phones;
  } catch (error: any) {
    return [];
  }
};
//ACTIONS
export const phoneNumberInsert = async (values: UserPhoneNumberSchemaType) => {
  // const user = await currentUser();
  // if (!user) {
  //   return { error: "Unauthenticated!" };
  // }
  // const validatedFields = UserPhoneNumberSchema.safeParse(values);
  // if (!validatedFields.success) {
  //   return { error: "Invalid fields!" };
  // }
  // const {
  //   state,phone
  // } = validatedFields.data;

  // const existingPhoneNumber = await db.phoneNumber.findFirst({
  //   where: { phone },
  // });

  // if (existingPhoneNumber) {
  //   return { error: "Phone number already exists" };
  // }

  // const usernumbers = await db.phoneNumber.findFirst({
  //   where: { agentId: user.id },
  // });
  // var date = new Date();
  // date.setDate(date.getDate() + 30);
  // const newPhoneNumber = await db.phoneNumber.create({
  //   data: {
  //     phone: reFormatPhoneNumber(phone),
  //     state,
  //     agentId: user.id,
  //     status: usernumbers ? "Active" : "Default",
  //     renewAt: date,
  //   },
  // });

  // if (!newPhoneNumber) {
  //   return { error: "Phone number was not purchased!" };
  // }

  return { success: "Phone number was purchased!" };
};

export const phoneNumberInsertTwilio = async (
  phone: string,
  state: string,
  agentId: string | null,
  sid: string,
  app: string
) => {
  // const user = await currentUser();
  // if (!user) {
  //   return { error: "Unauthenticated!" };
  // }

  const existingPhoneNumber = await db.phoneNumber.findFirst({
    where: { phone },
  });

  if (existingPhoneNumber) return { error: "Phone number already exists" };

  let status = "Unassigned";
  if (agentId == "unassigned") {
    agentId = null;
  } else {
    const usernumber = await db.phoneNumber.findFirst({
      where: { agentId },
    });
    status = usernumber ? "Active" : "Default";
  }
  var date = new Date();
  date.setDate(date.getDate() + 30);
  const newPhoneNumber = await db.phoneNumber.create({
    data: {
      phone: reFormatPhoneNumber(phone),
      state,
      agentId,
      status,
      renewAt: date,
      sid,
      app,
    },
  });

  if (!newPhoneNumber) return { error: "Phone number was not purchased!" };

  return { success: newPhoneNumber.id };
};

export const phoneNumberUpdateByIdActivate = async (id: string) => {
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

export const phoneNumberUpdateByIdDeactivate = async (id: string) => {
  const user = await currentUser();
  if (!user) 
    return { error: "Unauthenticated!" };
  

  const userPhoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Inactive" } },
  });
  const thisNumber = userPhoneNumbers.find((e) => e.id == id);

  if (!thisNumber) 
    return { error: "Unauthorized!" };
  
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

export const phoneNumberUpdateByIdDefault = async (id: string) => {
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

export const phoneNumberUpdateByIdAssign = async (
  id: string,
  agentId: string
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const thisNumber = await db.phoneNumber.findUnique({
    where: { id },
  });

  if (!thisNumber) {
    return { error: "Number does not exist!" };
  }
  const usernumber = await db.phoneNumber.findFirst({
    where: { agentId },
  });

  var date = new Date();
  date.setDate(date.getDate() + 30);
  await db.phoneNumber.update({
    where: { id: thisNumber?.id },
    data: { status: usernumber ? "Active" : "Default", agentId, renewAt: date },
  });

  return { success: "Phone number is now assigned!" };
};

export const phoneNumberUpdateByIdApp = async (id: string, app: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const thisNumber = await db.phoneNumber.findUnique({
    where: { id },
  });

  if (!thisNumber) {
    return { error: "Number does not exist!" };
  }

  await db.phoneNumber.update({
    where: { id: thisNumber?.id },
    data: { app },
  });

  return { success: "Phone number app updated!" };
};
