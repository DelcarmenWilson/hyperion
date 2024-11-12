"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";

export const getFeedback = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");

  return await db.feedback.findUnique({
    where: { id, userId: user.id },
    include: { user: true },
  });
};