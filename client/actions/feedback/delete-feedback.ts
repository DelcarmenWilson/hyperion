"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const deleteFeedback = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  await db.feedback.delete({ where: { id, userId: user.id } });
  revalidatePath("/feedback");
  redirect("/feedback");
};
