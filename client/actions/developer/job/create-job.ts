"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateJobSchema, CreateJobSchemaType } from "@/schemas/job";
import { redirect } from "next/navigation";

export const createJob = async (values: CreateJobSchemaType) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!" );

  const { success, data } = CreateJobSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!" ); 

 const job=await db.job.create({
    data: {
      ...data,
    },
  });

 redirect(`/admin/jobs/${job.id}`)
};
