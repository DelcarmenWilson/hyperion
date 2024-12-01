"use server";
import { db } from "@/lib/db";
import { currentUser, currentRole } from "@/lib/auth";
import {
  CreateMiniJobSchema,
  CreateMiniJobSchemaType,
  UpdateMiniJobSchema,
  UpdateMiniJobSchemaType,
} from "@/schemas/job";
import { JobStatus } from "@/types/job";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// DATA
export const getMiniJobs = async () => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!" );
  return await db.miniJob.findMany();
};

export const getMiniJob = async (id: string) => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!" );
  return db.miniJob.findUnique({ where: { id } });
};

export const getMiniJobsForJob = async (jobId: string) => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!" );
  return await db.miniJob.findMany({ where: { jobId } });
};

// ACTIONS

export const createMiniJob = async (values: CreateMiniJobSchemaType) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const { success, data } = CreateMiniJobSchema.safeParse(values);

  if (!success) throw new Error("invalid form data");

  const result = await db.miniJob.create({
    data: {
      ...data,
    },
  });

  if (!result) throw new Error("failed to create minjob");

  redirect(`/admin/jobs/${result.jobId}/${result.id}`);
};

export const deleteMiniJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const result = await db.miniJob.delete({ where: { id } });

  const newMiniJob = await db.miniJob.findFirst({
    where: { jobId: result.jobId },
  });
  const url = "/admin/jobs";

  revalidatePath(`${url}/${result.jobId}`);
  if (newMiniJob) redirect(`${url}/${result.jobId}/${newMiniJob.id}`);
  redirect(`${url}/${result.jobId}`);
};

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

export const completeMiniJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");
  const date = new Date();

  const miniJob = await db.miniJob.update({
    where: { id },
    data: {
      completedAt: date,
      status: JobStatus.COMPLETED,
    },
  });

  const pendingJobs = await db.miniJob.findMany({
    where: { jobId: miniJob.jobId, NOT: { status: JobStatus.COMPLETED } },
  });
  if (pendingJobs.length == 0) {
    await db.job.update({
      where: { id: miniJob.jobId },
      data: {
        completedAt: date,
        status: JobStatus.COMPLETED,
      },
    });
  }

  revalidatePath(`/admin/jobs/${miniJob.jobId}/${miniJob.id}`);
};

export const startMiniJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const date = new Date();

  const miniJob = await db.miniJob.update({
    where: { id },
    data: {
      startedAt: date,
      status: JobStatus.IN_PROGRESS,
    },
  });

  const job = await db.job.findUnique({
    where: { id: miniJob.jobId, status: JobStatus.OPEN },
  });
  if (job) {
    await db.job.update({
      where: { id: job.id },
      data: {
        startedAt: date,
        status: JobStatus.IN_PROGRESS,
      },
    });
  }

  revalidatePath(`/admin/jobs/${miniJob.jobId}/${miniJob.id}`);
};
