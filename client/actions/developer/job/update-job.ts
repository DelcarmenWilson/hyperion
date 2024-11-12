"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UpdateJobSchema, UpdateJobSchemaType } from "@/schemas/job";

export const updateJob = async (values: UpdateJobSchemaType) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const { success, data } = UpdateJobSchema.safeParse(values);

  if (!success) return { error: "Invalid fields!" };

  const updatedFeedback = await db.job.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });

  return { success: updatedFeedback };
};
