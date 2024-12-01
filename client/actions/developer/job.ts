"use server";
import { db } from "@/lib/db";
import { currentUser, currentRole } from "@/lib/auth";
import {
  CreateJobSchema,
  CreateJobSchemaType,
  UpdateJobSchema,
  UpdateJobSchemaType,
} from "@/schemas/job";
import { JobStatus } from "@/types/job";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

//DATA
export const getJobs = async () => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!");

  return await db.job.findMany();
};

export const getJob = async (id: string) => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!");
  return await db.job.findUnique({ where: { id } });
};

//ACTIONS
export const createJob = async (values: CreateJobSchemaType) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!");

  const { success, data } = CreateJobSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  const job = await db.job.create({
    data: {
      ...data,
    },
  });

  redirect(`/admin/jobs/${job.id}`);
};

export const deleteJob = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!");

  const exisitingJob = await db.job.findUnique({
    where: { id },
    include: { miniJobs: true, feedbacks: true },
  });

  if (!exisitingJob) return { error: "Job does not exisits!" };
  if (exisitingJob.miniJobs.length > 0)
    return { error: "Please delete all the miniJobs first!" };
  if (exisitingJob.feedbacks.length > 0)
    return { error: "Please detach all the feedbacks first!" };

  await db.job.delete({ where: { id } });
  redirect("/admin/jobs");
};

export const updateJob = async (values: UpdateJobSchemaType) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!");

  const { success, data } = UpdateJobSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  const job = await db.job.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });

  revalidatePath(`/admin/jobs/${job.id}`);
};

export const startJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!");

  const job = await db.job.update({
    where: { id },
    data: {
      startedAt: new Date(),
      status: JobStatus.IN_PROGRESS,
    },
  });

  revalidatePath(`/admin/jobs/${job.id}`);
};
export const completeJob = async (id: string) => {
    const user = await currentUser();
  
    if (!user) throw new Error("Unauthenticated!");
    if (user.role != "DEVELOPER") throw new Error("Unauthorized!" );
  
    const job = await db.job.update({
      where: { id },
      data: {
        completedAt: new Date(),
      },
    });
    revalidatePath(`/admin/jobs/${job.id}`)
  };