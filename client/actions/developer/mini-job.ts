"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import {MiniJobSchema, MiniJobSchemaType } from "@/schemas/job";

//DATA
export const miniJobsGetAll = async () => {
  try {
    const role = await currentRole();
    if (role != "DEVELOPER") return [];
    const miniJobs = await db.miniJob.findMany();
    return miniJobs;
  } catch (error) {
    return [];
  }
};

export const miniJobGetById = async (id: string) => {
  try {
    const role = await currentRole();
    if (role != "DEVELOPER") return null;
    const miniJob = await db.miniJob.findUnique({ where: { id } });
    return miniJob;
  } catch (error) {
    return null;
  }
};

export const miniJobGetPrevNextById = async (id: string) => {
  try {
    const prev = await db.miniJob.findMany({
      take: 1,
      select: { id: true },
      where: {
        id: {
          lt: id,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const next = await db.miniJob.findMany({
      take: 1,
      select: { id: true },
      where: {
        id: {
          gt: id,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return { prev: prev[0]?.id || null, next: next[0]?.id || null };
  } catch {
    return null;
  }
};

export const miniJobInsert = async (values: MiniJobSchemaType) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const validatedFields = MiniJobSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const {jobId, name, description,  comments } = validatedFields.data;

  const newMiniJob = await db.miniJob.create({
    data: {
      jobId:jobId!,
      name,
      description,
      comments,
    },
  });

  return { success: newMiniJob };
};

export const miniJobUpdateById = async (values: MiniJobSchemaType) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const validatedFields = MiniJobSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, name, description,  comments } =
    validatedFields.data;

  const updatedFeedback = await db.miniJob.update({
    where: { id },
    data: {
      name,
      description,
      comments,
    },
  });

  return { success: updatedFeedback };
};

export const miniJobUpdateByIdStarted = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const updatedMiniJob = await db.miniJob.update({
    where: { id },
    data: {
      startAt: new Date(),
    },
  });

  return { success: updatedMiniJob };
};

export const miniJobUpdateByIdEnded = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const updatedMiniJob = await db.miniJob.update({
    where: { id },
    data: {
      endAt: new Date(),
    },
  });

  return { success: updatedMiniJob };
};
