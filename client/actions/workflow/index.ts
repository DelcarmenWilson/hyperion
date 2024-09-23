"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  FullNodeSchemaType,
  FullWorkFlowSchemaType,
  WorkflowEdgeSchema,
  WorkflowEdgeSchemaType,
  WorkflowNodeSchema,
  WorkflowNodeSchemaType,
  WorkFlowSchema,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";
import { JsonObject } from "@prisma/client/runtime/library";
//DATA

export const workFlowGetById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const workFlow = await db.workflow.findUnique({
      where: { id },
      include: {
        nodes: { include: { position: true } },
        edges: true,
      },
    });
    return workFlow as FullWorkFlowSchemaType;
  } catch (error) {
    return null;
  }
};

export const workFlowsGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const workFlows = await db.workflow.findMany({
      where: { userId: user.id },
    });
    return workFlows;
  } catch (error) {
    return [];
  }
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

  const existingWorkFlow = await db.workflow.findFirst({
    where: { userId: user.id, title },
  });

  if (existingWorkFlow) {
    return { error: "Workflow with this title already exists!!" };
  }

  const newWorkFlow = await db.workflow.create({
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

  const existingWorkFlow = await db.workflow.findUnique({ where: { id } });

  if (!existingWorkFlow) {
    return { error: "Workflow does not exists!!" };
  }

  const updatedWorkFlow = await db.workflow.update({
    where: { id },
    data: {
      title,
      description,
    },
  });
  return { success: updatedWorkFlow };
};

export const workFlowUpdateByIdPublish = async ({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const existingWorkFlow = await db.workflow.findUnique({ where: { id } });

  if (!existingWorkFlow) return { error: "Workflow does not exists!!" };

  const updatedWorkFlow = await db.workflow.update({
    where: { id },
    data: { published },
  });
  if (!updatedWorkFlow) return { error: "Something went wrong!" };
  return {
    success: published ? "Workflow published" : "Workflow unpublished!",
  };
};

export const workFlowDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingWorkFlow = await db.workflow.findUnique({ where: { id } });

  if (!existingWorkFlow) {
    return { error: "Workflow does not exists!!" };
  }

  if (existingWorkFlow.userId != user.id) {
    return { error: "Unauthorized!!" };
  }

  await db.workflow.delete({ where: { id: existingWorkFlow.id } });
  return { success: "WorkFlow deleted!!" };
};

// NODES
export const nodeInsert = async ({
  workflowId,
  id,
  type,
}: {
  workflowId: string;
  id: string;
  type: string;
}) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  //Check if trigger already exist inside the workflow
  if (type == "trigger") {
    const exisitingTrigger = await db.workflowNode.findFirst({
      where: { workflowId, type },
    });

    if (exisitingTrigger) {
      return { error: "Only one trigger allowed per workflow!" };
    }
  }
  //Find the corresponding node
  const node = await db.workflowDefaultNode.findUnique({ where: { id: id } });
  if (!node) {
    return { error: "Node does not exists!" };
  }

  // Create a new node
  const newNode = await db.workflowNode.create({
    data: {
      workflowId,
      data: node.data as JsonObject,
      type,
      position: {
        create: {
          x: Math.random() * 120 * -1,
          y: Math.random() * 120 * -1,
        },
      },
    },
    include: { position: true },
  });

  return { success: newNode as FullNodeSchemaType };
};

export const nodeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const existingNode = await db.workflowNode.findUnique({ where: { id } });

  if (!existingNode) {
    return { error: "Node does not exists!!" };
  }

  await db.workflowNodeEdge.deleteMany({
    where: { OR: [{ source: id }, { target: id }] },
  });

  const deletedNode = await db.workflowNode.delete({ where: { id } });
  return { success: "Node Deleted!!", data: deletedNode };
};

export const nodeUpdateById = async (node: WorkflowNodeSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = WorkflowNodeSchema.safeParse(node);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, data } = validatedFields.data;

  //Update Node
  const updatedNode = await db.workflowNode.update({
    where: { id },
    data: {
      data,
    },
    include: { position: true },
  });

  return { success: updatedNode as FullNodeSchemaType };
};

export const nodesUpdateAllPosition = async (nodes: FullNodeSchemaType[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  for (const node of nodes) {
    await db.workflowNodePosition.update({
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

export const edgeInsert = async (edge: WorkflowEdgeSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = WorkflowEdgeSchema.safeParse(edge);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { workflowId, source, target, animated, type } = validatedFields.data;
  //Create new edge
  const newEdge = await db.workflowNodeEdge.create({
    data: {
      workflowId,
      source,
      target,
      animated,
      type: type || "",
    },
  });

  return { success: newEdge };
};

export const edgeUpdateById = async (edge: WorkflowEdgeSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = WorkflowEdgeSchema.safeParse(edge);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, source, target, animated, type } = validatedFields.data;

  //Update Edge
  const updatedEdge = await db.workflowNodeEdge.update({
    where: { id },
    data: {
      source,
      target,
      animated,
      type: type || "",
    },
  });

  return { success: updatedEdge };
};

export const edgeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const existingEdge = await db.workflowNodeEdge.findUnique({ where: { id } });

  if (!existingEdge) {
    return { error: "Edge does not exists!!" };
  }

  const deletedEdge = await db.workflowNodeEdge.delete({ where: { id } });
  return { success: deletedEdge.id };
};
