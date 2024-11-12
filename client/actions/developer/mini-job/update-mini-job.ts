"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UpdateMiniJobSchema, UpdateMiniJobSchemaType } from "@/schemas/job";
import { revalidatePath } from "next/cache";

export const updateMiniJob = async (values: UpdateMiniJobSchemaType) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const { success, data } = UpdateMiniJobSchema.safeParse(values);

  if (!success) throw new Error("Invalid form data");

  await db.miniJob.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });

  revalidatePath(`/admin/jobs/${data.jobId}/${data.id}`);
};
