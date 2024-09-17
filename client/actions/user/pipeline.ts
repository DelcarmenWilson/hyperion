"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { userGetByAssistant } from "@/actions/user";
import { PipelineSchemaType, PipelineSchema } from "@/schemas/pipeline";

//DATA
export const pipelineGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if (!userId) return [];

    const pipelines = await db.pipeline.findMany({
      where: { userId },
      include: { status: { select: { status: true } } },
      orderBy: { order: "asc" },
    });
    return pipelines;
  } catch {
    return [];
  }
};
export const pipelineGetById = async (id: string | undefined) => {
  try {
    if (!id) return null;
    const user = await currentUser();
    if (!user) return null;
    const pipeline = await db.pipeline.findUnique({
      where: { id },
    });
    console.log(pipeline);
    return pipeline;
  } catch {
    return null;
  }
};
//ACTIONS
export const pipelineInsert = async (values: PipelineSchemaType) => {
  const userId = await userGetByAssistant();
  if (!userId) return { error: "Unauthenticated" };

  const validatedFields = PipelineSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { statusId, name } = validatedFields.data;

  const pipelines = await db.pipeline.findMany({
    where: { userId },
  });

  const exisitingStatus = pipelines.find(
    (e) => e.name == name || e.statusId == statusId
  );

  if (exisitingStatus) {
    return { error: "Stage with same status or title already exists" };
  }

  await db.pipeline.create({
    data: {
      userId,
      statusId,
      name,
      order: pipelines.length,
    },
  });

  return { success: "Pipeline stage created!" };
};

export const pipelineUpdateOrder = async (
  pipelines: { id: string; order: number }[]
) => {
  const user = await currentUser();

  if (!user || !user.email) {
    return { error: "Unathenticated" };
  }
//TODO see if we can remove the for by just passing the data
  for (const pipeline of pipelines) {
    await db.pipeline.updateMany({
      where: { id: pipeline.id },
      data: {
        order: pipeline.order,
      },
    });
  }

  return { success: "Pipeline stages ordered!" };
};

export const pipelineDeleteById = async (id: string | undefined) => {
  if (!id) return { error: "id was not supplied!" };
  const user = await currentUser();

  if (!user || !user.email) return { error: "Unathenticated" };

  const exisitingPipeline = await db.pipeline.findUnique({
    where: { id },
  });

  if (!exisitingPipeline) {
    return { error: "stage does not exists!" };
  }
  if (exisitingPipeline.userId != user.id) {
    return { error: "Unauthorized" };
  }

  await db.pipeline.delete({ where: { id: exisitingPipeline.id } });

  return { success: "stage has been deleted!" };
};

export const pipelineUpdateById = async (values: PipelineSchemaType) => {
  const user = await currentUser();

  if (!user || !user.email) {
    return { error: "Unathenticated" };
  }

  const validatedFields = PipelineSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { id, statusId, name } = validatedFields.data;

  const exisitingStatus = await db.pipeline.findFirst({
    where: { userId: user.id, name, statusId },
  });

  if (exisitingStatus)
    return { error: "Another  with same status or title already exists" };

  await db.pipeline.update({
    where: { id },
    data: {
      statusId,
      name,
    },
  });

  return { success: "Pipeline updated!" };
};

type piptype = { id: string; index: number };
export const pipelineUpdateByIdIndex = async (values: piptype) => {
  const user = await currentUser();

  if (!user || !user.email) {
    return { error: "Unathenticated" };
  }
  const { id, index } = values;
  await db.pipeline.update({
    where: { id },
    data: {
      index,
    },
  });

  return { success: "Pipeline index updated!" };
};
