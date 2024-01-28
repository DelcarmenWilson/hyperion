"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";

export const phoneNumberInsert = async (phone: string, state: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const existingPhoneNumber = await db.phoneNumber.findFirst({
    where: { phone },
  });

  if (existingPhoneNumber) {
    return { error: "Phone number already exists" };
  }

  const usernumbers = await db.phoneNumber.findFirst({
    where: { agentId: user.id },
  });
  var date = new Date();
  date.setDate(date.getDate() + 30);
  const newPhoneNumber = await db.phoneNumber.create({
    data: {
      phone: reFormatPhoneNumber(phone),
      state,
      agentId: user.id,
      status: usernumbers ? "Active" : "Default",
      renewAt: date,
    },
  });

  if (!newPhoneNumber) {
    return { error: "Phone number was not purchased!" };
  }

  return { success: "Phone number was purchased!" };
};

export const phoneNumberUpdateByIdActivate = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const existingNumber = await db.phoneNumber.findUnique({
    where: { id,agentId:user.id },
  });

  if (!existingNumber) {
    return { error: "Unauthorized!" };
  }
 
  await db.phoneNumber.update({
    where: { id: existingNumber.id },
    data: { status:"Active"},
  });

 

  return { success: "Phone number has been activated!" };
};

export const phoneNumberUpdateByIdDeactivate = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const userPhoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id,status:{not:"Inactive"} },
  });
  const thisNumber = userPhoneNumbers.find((e) => e.id == id);

  if (!thisNumber) {
    return { error: "Unauthorized!" };
  }
  let status: string = "";
  if (thisNumber.status == "Default") {
    if (userPhoneNumbers.length == 1) {
      return { error: "Can not deactive the only phone number you have!" };
    }
    status = "Default";
  }

  await db.phoneNumber.update({
    where: { id: thisNumber?.id },
    data: { status:"Inactive"},
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
    where: { id,agentId: user.id },
  });

  const defaultNumber=await db.phoneNumber.findFirst({where: {agentId:user.id, status:"Default" },})


  if (!thisNumber) {
    return { error: "Unauthorized!" };
  }
 
  await db.phoneNumber.update({
    where: {id:defaultNumber?.id },
    data: { status:"Active"},
  });

  await db.phoneNumber.update({
    where: { id: thisNumber?.id },
    data: { status:"Default"},
  });

  return { success: "Phone number is now default!" };
};
