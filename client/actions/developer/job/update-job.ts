"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { UpdateJobSchema, UpdateJobSchemaType } from "@/schemas/job";

export const updateJob = async (values: UpdateJobSchemaType) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!" );

  const { success, data } = UpdateJobSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!" ); 

  const job = await db.job.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });

  
  revalidatePath(`/admin/jobs/${job.id}`)
};
