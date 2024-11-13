"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {  currentUser } from "@/lib/auth";
import {
  CreateQuoteSchemaType,
  CreateQuoteSchema,
} from "@/schemas/admin";

export const createQuote = async (values: CreateQuoteSchemaType) => {
  const user = await currentUser();

  if (!user) throw new Error('Unathenticated') 
  if (user.role == "USER") throw new Error('Unauthorized') 

  const {success,data} = CreateQuoteSchema.safeParse(values);

  if (!success) throw new Error('Invalid form data')  

  const existingQuote = await db.quote.findFirst({ where: { quote:data.quote } });
  if (existingQuote) throw new Error('Quote already exists') 

 await db.quote.create({
    data: {
      ...data
    },
  });

revalidatePath("admin/page-settings")
};