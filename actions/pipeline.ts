"use server";

import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { forIn } from "lodash";
import { PipeLine } from "@prisma/client";
import { userGetByAssistant } from "@/data/user";

// TODO DATA- should be moved
export const pipelineGetAllByAgentId = async (userId: string) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const pipelines = await db.pipeLine.findMany({
      where: { userId },
      include: { status: { select: { status: true } } },
      orderBy: { order: "asc" },
    });
    return pipelines;
  } catch {
    return [];
  }
};

export const pipelineInsert = async (statusId: string, name: string) => {
  const user = await currentUser();

  if (!user || !user.email) {
    return { error: "Unathenticated" };
  }
  let userId=user.id;
  if (user.role=="ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }
  const pipelines = await db.pipeLine.findMany({
    where: { userId },
  });

  const exisitingStatus = pipelines.find(
    (e) => e.name == name || e.statusId == statusId
  );

  if (exisitingStatus) {
    return { error: "Stage with same status or title already exists" };
  }

  await db.pipeLine.create({
    data: {
      userId: user.id,
      statusId,
      name,
      order:pipelines.length
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

  for (const pipeline of pipelines) {
    await db.pipeLine.updateMany({
      where: { id: pipeline.id },
      data: {
        order: pipeline.order,
      },
    });
  }

  return { success: "Pipeline stages ordered!" };
};

export const pipelineDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user || !user.email) {
    return { error: "Unathenticated" };
  }

  const exisitingPipeLine = await db.pipeLine.findUnique({
    where: { id },
  });

  if (!exisitingPipeLine) {
    return { error: "stage does not exists!" };
  }
  if (exisitingPipeLine.userId != user.id) {
    return { error: "Unauthorized" };
  }

  await db.pipeLine.delete({ where: { id: exisitingPipeLine.id } });

  return { success: "stage has been deleted!" };
};

export const pipelineUpdateById = async (pipeline: PipeLine) => {
  const user = await currentUser();

  if (!user || !user.email) {
    return { error: "Unathenticated" };
  }

  const userStatus = await db.pipeLine.findMany({
    where: { userId: user.id },
  });
  const { statusId, name } = pipeline;
  const exisitingStatus = userStatus.find(
    (e) => e.id!=pipeline.id && (e.name == name || e.statusId == statusId)
  );

  if (exisitingStatus) {
    return { error: "Another  with same status or title already exists" };
  }

  await db.pipeLine.update({
    where: { id: pipeline.id },
    data: {
      statusId,
      name,
    },
  });

  return { success: "Pipeline updated!" };
};
