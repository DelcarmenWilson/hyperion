"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";
import {
  QuoteSchema,
  QuoteSchemaType,
} from "@/schemas/admin";


//QUOTES
//DATA
export const adminQuotesGetAll = async () => {
  try {
    const quotes = await db.quote.findMany({});
    return quotes;
  } catch (error) {
    return [];
  }
};
export const adminQuotesGetActive = async () => {
  try {
    const quote = await db.quote.findFirst({ where: { active: true } });
    return quote;
  } catch (error) {
    return null;
  }
};
//ACTIONS
export const adminQuoteInsert = async (values: QuoteSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = QuoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { quote, author } = validatedFields.data;

  const existingQuote = await db.quote.findFirst({ where: { quote } });
  if (existingQuote) {
    return { error: "Quote already exists" };
  }

  const newQuote = await db.quote.create({
    data: {
      quote,
      author,
    },
  });

  return { success: newQuote };
};

export const adminQuoteUpdateActive = async () => {
  const quotes = await db.quote.findMany({});
  const random = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[random];

  const activeQuote = quotes.find((e) => e.active);
  if (activeQuote) {
    await db.quote.update({
      where: { id: activeQuote.id },
      data: { active: false },
    });
  }
  const newQuote = await db.quote.update({
    where: { id: randomQuote.id },
    data: { active: true },
  });

  return { success: newQuote };
};
