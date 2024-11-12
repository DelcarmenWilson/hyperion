"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const updateNotification = async (values: {
  id:string;
  reference: string;
  content: string;
  linkText: string | undefined;
  link: string | undefined;
}) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthenticated");

   await db.notification.update({
    where: { id: values.id },
    data: {
      ...values,
    },
  });

  revalidatePath("/notifications");
};
