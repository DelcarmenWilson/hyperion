"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  WorkflowActionSchema,
  WorkflowActionSchemaType,
} from "@/schemas/workflow/action";

import {
  WorkflowTriggerDataSchemaType,
  WorkflowTriggerSchema,
  WorkflowTriggerSchemaType,
} from "@/schemas/workflow/trigger";
import { Prisma } from "@prisma/client";

//DATA
export const workflowNodesGetAll = async () => {
  const actions = await db.workflowDefaultNode.findMany();
  return actions;
};
export const workflowNodesGetAllByType = async (type: "trigger" | "action") => {
  const nodes = await db.workflowDefaultNode.findMany({ where: { type } });
  return nodes 
};
export const workflowNodeGetById = async (id: string) => {
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
export const workflowNodeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingTrigger = await db.workflowDefaultNode.findUnique({
    where: { id },
  });

  if (!existingTrigger) {
    return { error: "Node does not exists!!" };
  }

  await db.workflowNode.delete({ where: { id: existingTrigger.id } });
  return { success: "Node deleted!!" };
};
export const actionInsert = async (values: WorkflowActionSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = WorkflowActionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, data, type, category } = validatedFields.data;

  const existingAction = await db.workflowDefaultNode.findFirst({
    where: { name },
  });

  if (existingAction) {
    return { error: "Action with this name already exists!!" };
  }

  const newAction = await db.workflowDefaultNode.create({
    data: {
      name,
      data,
      type,
      category,
    },
  });
  return { success: newAction };
};

export const actionUpdateById = async (values: WorkflowActionSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = WorkflowActionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, name, type, data } = validatedFields.data;

  const existingAction = await db.workflowDefaultNode.findUnique({
    where: { id },
  });

  if (!existingAction) {
    return { error: "Action does not exists!!" };
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

export const triggerInsert = async (values: WorkflowTriggerSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = WorkflowTriggerSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, data, type, category } = validatedFields.data;

  const existingTrigger = await db.workflowDefaultNode.findFirst({
    where: { name },
  });

  if (existingTrigger) {
    return { error: "Trigger with this name already exists!!" };
  }

  const newTrigger = await db.workflowDefaultNode.create({
    data: {
      name,
      data,
      type,
      category,
    },
  });
  return { success: newTrigger };
};

export const triggerUpdateById = async (values: WorkflowTriggerSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = WorkflowTriggerSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, name, type, data } = validatedFields.data;

  const existingTrigger = await db.workflowDefaultNode.findUnique({
    where: { id },
  });

  if (!existingTrigger) {
    return { error: "Trigger does not exists!!" };
  }

  const updatedTrigger = await db.workflowDefaultNode.update({
    where: { id },
    data: {
      name,
      type,
      data,
    },
  });
  return { success: updatedTrigger };
};
