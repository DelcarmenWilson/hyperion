"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getAssitantForUser } from "@/actions/user";
import {
  CreatePipelineSchema,
  CreatePipelineSchemaType,
  UpdatePipelineSchema,
  UpdatePipelineSchemaType,
} from "@/schemas/pipeline";
import { states } from "@/constants/states";
import { FullLead, PipelineLead } from "@/types";
import { formatTimeZone } from "@/formulas/dates";

//DATA
export const getPipelines = async () => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated!");

  return await db.pipeline.findMany({
    where: { userId },
    include: { status: { select: { status: true } } },
    orderBy: { order: "asc" },
  });
};

export const getPipelinesAndLeads = async () => {
  // Empty variable of no data return
  const empty = { pipelines: [], leads: [] };

  try {
    //get the online user and if the user is an assistant get the userid of the agent
    const userId = await getAssitantForUser();
    if (!userId) throw new Error("Unauthenticated!");

    //Get all the pipeline for this agent
    const pipelines = await db.pipeline.findMany({
      where: { userId },
      include: { status: { select: { status: true } } },
      orderBy: { order: "asc" },
    });

    //If there are no pipelines then return an empty object
    if (!pipelines) return empty;

    const leads = await db.lead.findMany({
      where: {
        OR: [{ userId }, { assistantId: userId }, { sharedUserId: userId }],
        statusId: { in: pipelines.map((p) => p.statusId) },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cellPhone: true,
        maritalStatus: true,
        dateOfBirth: true,
        state: true,
        statusId: true,
        defaultNumber: true,
        address: true,
        smoker: true,
        recievedAt: true,
        type: true,
      },
    });

    //If there are no leads then return an empty object
    if (!leads) return empty;
    //return the list of pipelines and the list of leads
    const currentTime = new Date();
    const fullLeads: PipelineLead[] = leads.map((lead) => {
      const timeZone =
        states.find(
          (e) => e.abv.toLocaleLowerCase() == lead.state.toLocaleLowerCase()
        )?.zone || "US/Eastern";
      return {
        ...lead,
        zone: timeZone,
        time: formatTimeZone(currentTime, timeZone),
      };
    });
    return { pipelines, leads: fullLeads };
  } catch {
    return empty;
  }
};
export const getPipeline = async (id: string | undefined) => {
  if (!id) throw new Error("id cannot be empty!");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.pipeline.findUnique({
    where: { id },
  });
};
//ACTIONS
export const createPipeline = async (values: CreatePipelineSchemaType) => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated!");

  const { success, data } = CreatePipelineSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!");

  const pipelines = await db.pipeline.findMany({
    where: { userId },
  });

  const exisitingStatus = pipelines.find(
    (e) => e.name == data.name || e.statusId == data.statusId
  );

  if (exisitingStatus)
    throw new Error("Stage with same status or title already exists");

  return await db.pipeline.create({
    data: {
      ...data,
      userId,
      order: pipelines.length,
    },
    include: { status: { select: { status: true } } },
  });
};

export const updatePipelineOrder = async (
  pipelines: { id: string; order: number }[]
) => {
  const user = await currentUser();

  if (!user || !user.email) throw new Error("Unauthenticated!");

  for (const pipeline of pipelines) {
    await db.pipeline.update({
      where: { id: pipeline.id },
      data: {
        order: pipeline.order,
      },
    });
  }

  return "Pipeline stages ordered!";
};

export const deletedPipeline = async (id: string | undefined) => {
  if (!id) throw new Error("id was not supplied!");

  const user = await currentUser();
  if (!user || !user.email) throw new Error("Unauthenticated!");

  const exisitingPipeline = await db.pipeline.findUnique({
    where: { id },
  });

  if (!exisitingPipeline) throw new Error("Stage does not exists!");

  if (exisitingPipeline.userId != user.id) throw new Error("Unauthorized");

  await db.pipeline.delete({ where: { id: exisitingPipeline.id } });

  return exisitingPipeline.id;
};

export const updatePipeline = async (values: UpdatePipelineSchemaType) => {
  const user = await currentUser();

  if (!user || !user.email) throw new Error("Unauthenticated!");

  const { success, data } = UpdatePipelineSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields");

  const exisitingStatus = await db.pipeline.findFirst({
    where: { userId: user.id, statusId: data.statusId },
  });

  if (exisitingStatus)
    throw new Error("Another  with same status or title already exists");

  await db.pipeline.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });

  return "Pipeline updated!";
};


export const pipelineUpdateByIdIndex = async (values: { id: string; index: number }) => {
  const user = await currentUser();

  if (!user || !user.email) throw new Error("Unauthenticated!"); 
  const { id, index } = values;
  await db.pipeline.update({
    where: { id },
    data: {
      index,
    },
  });

   "Pipeline index updated!" ;
};
