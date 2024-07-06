"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  FullNodeSchemaType,
  WorkFlowSchema,
  WorkFlowSchemaType,
} from "@/schemas/workflow";
import { JsonObject } from "@prisma/client/runtime/library";
//DATA
export const flowGetAll = async () => {
  //   const user = await currentUser();
  //   if (!user) {
  //     return [];
  //   }
  //TODO remove this after the new test is completed
  // const nodes = await db.node.findMany({
  //   include: {
  //     data: { select: { label: true } },
  //     position: { select: { x: true, y: true } },
  //   },
  // });
  const nodes = await db.node.findMany({
    include: {
      position: { select: { x: true, y: true } },
    },
  });
  return nodes;
};
export const workFlowGetById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const workFlow = await db.workFlow.findUnique({
    where: { id },
    include: {
      nodes: { include: { position: true } },
      nodeEdges: true,
    },
  });
  return workFlow;
};

export const workFlowsGetAllByUserId = async () => {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const workFlows = await db.workFlow.findMany({ where: { userId: user.id } });
  return workFlows;
};

//ACTIONS
export const workFlowInsert = async (values: WorkFlowSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = WorkFlowSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { title, description } = validatedFields.data;

  const existingWorkFlow = await db.workFlow.findFirst({
    where: { userId: user.id, title },
  });

  if (existingWorkFlow) {
    return { error: "Workflow with this title already exists!!" };
  }

  const newWorkFlow = await db.workFlow.create({
    data: {
      title,
      description,
      userId: user.id,
    },
  });
  return { success: newWorkFlow };
};

export const workFlowUpdateById = async (values: WorkFlowSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = WorkFlowSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, title, description } = validatedFields.data;

  const existingWorkFlow = await db.workFlow.findUnique({ where: { id } });

  if (!existingWorkFlow) {
    return { error: "Workflow does not exists!!" };
  }

  const updatedWorkFlow = await db.workFlow.update({
    where: { id },
    data: {
      title,
      description,
    },
  });
  return { success: updatedWorkFlow };
};

export const workFlowDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingWorkFlow = await db.workFlow.findUnique({ where: { id } });

  if (!existingWorkFlow) {
    return { error: "Workflow does not exists!!" };
  }

  if (existingWorkFlow.userId != user.id) {
    return { error: "Unauthorized!!" };
  }

  await db.workFlow.delete({ where: { id: existingWorkFlow.id } });
  return { success: "WorkFlow deleted!!" };
};

// NODES
export const nodeInsert = async (
  workflowId: string,
  json: any,
  type: string
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  //Create a new node
  const newNode = await db.node.create({
    data: { workFlowId: workflowId, data: json, type },
  });

  //Create a new position
  await db.nodePosition.create({
    data: {
      nodeId: newNode.id,
      x: Math.random() * 120 * -1,
      y: Math.random() * 120 * -1,
    },
  });

  //Create a new data
  //await db.nodeData.create({ data: { nodeId: newNode.id } });

  //Update the node with the data and position
  const updateNode = await db.node.findUnique({
    where: { id: newNode.id },
    include: {
      position: true,
    },
  });

  return { success: updateNode as FullNodeSchemaType };
};
export const nodeInsert2 = async (workflowId: string, triggerId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  //Check if trigger already exist inside the workflow
  const exisitingTrigger = await db.node.findFirst({
    where: { workFlowId: workflowId, type: "trigger" },
  });

  if (exisitingTrigger) {
    return { error: "Only one trigger allowed per workflow!" };
  }

  //Find Trigger
  const trigger = await db.trigger.findUnique({ where: { id: triggerId } });
  if (!trigger) {
    return { error: "Trigger does not exist" };
  }
  //Create a new node
  const newNode = await db.node.create({
    data: {
      workFlowId: workflowId,
      data: trigger.data as JsonObject,
      type: trigger.type,
      position:{create:{
        x:Math.random() * 120 * -1,y:Math.random() * 120 * -1,
      }}
    },include:{position:true}
  });

  //Create a new position
  // await db.nodePosition.create({
  //   data: {
  //     nodeId: newNode.id,
  //     x: Math.random() * 120 * -1,
  //     y: Math.random() * 120 * -1,
  //   },
  // });

  //Create a new data
  //await db.nodeData.create({ data: { nodeId: newNode.id } });

  //Update the node with the data and position
  // const updateNode = await db.node.findUnique({
  //   where: { id: newNode.id },
  //   include: {
  //     position: true,
  //   },
  // });

  return { success: newNode as FullNodeSchemaType };
};

export const nodeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingNode = await db.node.findUnique({ where: { id } });

  if (!existingNode) {
    return { error: "Node does not exists!!" };
  }

  await db.nodeEdge.deleteMany({
    where: { OR: [{ source: id }, { target: id }] },
  });

  await db.node.delete({ where: { id } });
  return { success: "Node Deleted!!" };
};

export const nodesUpdateAllPosition = async (nodes: FullNodeSchemaType[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  for (const node of nodes) {
    await db.nodePosition.update({
      where: { nodeId: node.id },
      data: {
        x: node.position.x,
        y: node.position.y,
      },
    });
  }

  return { success: "All nodes have been updated (Position)" };
};

//EDGES

export const edgeInsert = async (source: string, target: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  //Create a new node
  const newEdge = await db.nodeEdge.create({
    data: {
      source,
      target,
      workFlowId: "cly7qebji00012v01l9u2fswt",
      animated: false,
    },
  });

  return { success: newEdge };
};

export const edgeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingEdge = await db.nodeEdge.findUnique({ where: { id } });

  if (!existingEdge) {
    return { error: "Edge does not exists!!" };
  }

  await db.nodeEdge.delete({ where: { id } });
  return { success: "Edge Deleted!!" };
};
