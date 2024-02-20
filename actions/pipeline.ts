"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";


// TODO DATA- should be moved
export const pipelineGetAllByAgentId = async (userId: string) => {
  try {
    const pipelines = await db.pipeLine.findMany({
      where: { userId },include:{status:{select:{status:true}}},
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

  const exisitingStatus = await db.pipeLine.findFirst({
    where: { userId: user.id, OR: [{ statusId }, { name }] },
  });
  if (exisitingStatus) {
    return { error: "Stage with same status or title already exists" };
  }

  await db.pipeLine.create({
    data: {
      userId: user.id,
      statusId,
      name,
    },
  });

  return { success: "Pipeline stage created!" };
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

  await db.pipeLine.delete({where:{id:exisitingPipeLine.id}
  });

  return { success: "stage has been deleted!" };
};


