"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  WorkflowActionSchema,
  WorkflowActionSchemaType,
} from "@/schemas/workflow/action";

import {
  WorkflowTriggerSchema,
  WorkflowTriggerSchemaType,
} from "@/schemas/workflow/trigger";

//DATA
export const workflowDefaultNodesGetAll = async () => {
  const nodes = await db.workflowDefaultNode.findMany();
  return nodes;
};
export const workflowDefaultNodesGetAllByType = async (
  type: "trigger" | "action"
) => {
  const nodes = await db.workflowDefaultNode.findMany({ where: { type } });
  return nodes;
};
export const workflowDefaultNodeGetById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const node = await db.workflowDefaultNode.findUnique({
    where: { id },
  });
  return node;
};

//ACTIONS
export const workflowDefaultNodeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingNode = await db.workflowDefaultNode.findUnique({
    where: { id },
  });

  if (!existingNode) {
    return { error: "Node does not exists!!" };
  }

  await db.workflowDefaultNode.delete({ where: { id: existingNode.id } });
  return { success: "Node deleted!!" };
};
export const workflowDefaultNodeInsert = async (
  values: WorkflowTriggerSchemaType | WorkflowActionSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields =
    values.type == "action"
      ? WorkflowActionSchema.safeParse(values)
      : WorkflowTriggerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, data, type, category } = validatedFields.data;

  const existingNode = await db.workflowDefaultNode.findFirst({
    where: { name, type },
  });

  if (existingNode) {
    return { error: `${type} with this name already exists!!` };
  }

  const insertedNode = await db.workflowDefaultNode.create({
    data: {
      name,
      data,
      type,
      category,
    },
  });
  return { success: insertedNode };
};

export const workflowDefaultNodeUpdateById = async (
  values: WorkflowTriggerSchemaType | WorkflowActionSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields =
    values.type == "action"
      ? WorkflowActionSchema.safeParse(values)
      : WorkflowTriggerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, name, type, data } = validatedFields.data;

  const existingNode = await db.workflowDefaultNode.findUnique({
    where: { id },
  });

  if (!existingNode) {
    return { error: `${type} does not exists!!` };
  }

  const updatedAction = await db.workflowDefaultNode.update({
    where: { id },
    data: {
      name,
      type,
      data,
    },
  });
  return { success: updatedAction };
};
