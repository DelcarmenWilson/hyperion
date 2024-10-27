"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { JobSchema, JobSchemaType } from "@/schemas/job";

//DATA

export const jobsGetAll = async () => {
  try {
    const role = await currentRole();

    if (role != "DEVELOPER") return [];

    const jobs = await db.job.findMany();
    return jobs;
  } catch (error) {
    return [];
  }
};

export const jobGetById = async (id: string) => {
  try {
    const role = await currentRole();

    if (role != "DEVELOPER") return null;

    const job = await db.job.findUnique({ where: { id } });
    return job;
  } catch (error) {
    return null;
  }
};

export const jobGetPrevNextById = async (id: string) => {
  try {
    const prev = await db.job.findMany({
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

    const next = await db.job.findMany({
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

//ACTIONS
export const jobDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const exisitingJob=await db.job.findUnique({where:{id},include:{miniJobs:true,feedbacks:true}})
  if(!exisitingJob)return {error:"Job does not exisits!"}
  if(exisitingJob.miniJobs.length>0)return {error:"Please delete all the miniJobs first!"}
  if(exisitingJob.feedbacks.length>0)return {error:"Please delete all the feedbacks first!"}

  await db.job.delete({ where: { id } });

  return { success: "Job has been deleted" };
};
export const jobInsert = async (values: JobSchemaType) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const validatedFields = JobSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { headLine, description, category, comments } = validatedFields.data;

  const newJob = await db.job.create({
    data: {
      headLine,
      description,
      category,
      comments,
    },
  });

  return { success: newJob };
};

export const jobUpdateById = async (values: JobSchemaType) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const validatedFields = JobSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, headLine, description, category, comments } =
    validatedFields.data;

  const updatedFeedback = await db.job.update({
    where: { id },
    data: {
      headLine,
      description,
      category,
      comments,
    },
  });

  return { success: updatedFeedback };
};

export const jobUpdateByIdStarted = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const updatedJob = await db.job.update({
    where: { id },
    data: {
      startAt: new Date(),
    },
  });

  return { success: updatedJob };
};

export const jobUpdateByIdEnded = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const updatedJob = await db.job.update({
    where: { id },
    data: {
      endAt: new Date(),
    },
  });

  return { success: updatedJob };
};
