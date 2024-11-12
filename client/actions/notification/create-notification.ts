"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const createNotification = async (values: {
  reference: string;
  title:string;
  content: string;
  linkText: string | undefined;
  link: string | undefined;
  userId: string ;
}) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthenticated");

  await db.notification.create({
    data: {
      ...values,
    },
  });

  revalidatePath("/notifications");
};
