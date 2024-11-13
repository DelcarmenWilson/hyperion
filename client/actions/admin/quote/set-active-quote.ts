"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const setActiveQuote = async () => {
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
await db.quote.update({
    where: { id: randomQuote.id },
    data: { active: true },
  });

  revalidatePath("admin/page-settings")
  
};
