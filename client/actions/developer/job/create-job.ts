"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateJobSchema, CreateJobSchemaType } from "@/schemas/job";
import { revalidatePath } from "next/cache";

export const createJob = async (values: CreateJobSchemaType) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const { success, data } = CreateJobSchema.safeParse(values);

  if (!success) return { error: "Invalid fields!" };

 await db.job.create({
    data: {
      ...data,
    },
  });

 revalidatePath("/admin/jobs")
};
