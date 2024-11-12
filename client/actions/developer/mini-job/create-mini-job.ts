"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {CreateMiniJobSchema, CreateMiniJobSchemaType } from "@/schemas/job";

export const createMiniJob = async (values: CreateMiniJobSchemaType) => {
  const user = await currentUser();
  if (!user?.id || !user?.email)throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const {success,data} = CreateMiniJobSchema.safeParse(values);


  if (!success) throw new Error("invalid form data");

    const result = await db.miniJob.create({
    data: {
      ...data
    },
  });

  if (!result) throw new Error("failed to create minjob");

  
  redirect(`/admin/jobs/${result.jobId}/${result.id}`);
};