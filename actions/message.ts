"use server";
import * as z from "zod";

import { MessageSchema } from "@/schemas";
import { db } from "@/lib/db";

export const messageInsert = async (values: z.infer<typeof MessageSchema>) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    toCountry,
    toState,
    smsMessageSid,
    numMedia,
    toCity,
    fromZip,
    smsSid,
    fromState,
    smsStatus,
    fromCity,
    body,
    fromCountry,
    to,
    messagingServiceSid,
    toZip,
    numSegments,
    messageSid,
    accountSid,
    from,
    apiVersion,
  } = validatedFields.data;

  await db.message.create({
    data: {
      toCountry,
      toState,
      smsMessageSid,
      numMedia,
      toCity,
      fromZip,
      smsSid,
      fromState,
      smsStatus,
      fromCity,
      body,
      fromCountry,
      to,
      messagingServiceSid,
      toZip,
      numSegments,
      messageSid,
      accountSid,
      from,
      apiVersion,
    },
  });

  return { success: "Message Created!" };
};
