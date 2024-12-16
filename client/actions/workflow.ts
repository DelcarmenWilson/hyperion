"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createWorkflowSchema,
  createWorkflowSchemaType,
  updateWorkflowSchema,
  updateWorkflowSchemaType,
} from "@/schemas/workflow";
import { AppNode } from "@/types/workflow/app-node";
import { TaskType } from "@/types/workflow/task";
import { WorkflowExecutionPlan } from "@/types/workflow/workflow";
import { WorkflowStatus } from "@/types/workflow/workflow";

import { Edge } from "@xyflow/react";

//DATA
export const getWorkflows = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");

  return db.workflow.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
};

export const getWorkflow = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");

  return db.workflow.findUnique({
    where: { id, userId: user.id },
  });
};

//ACTIONS
export const createWorkflow = async (form: createWorkflowSchemaType) => {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) throw new Error("invalid form data");

  const user = await currentUser();
  if (!user) throw new Error("unauthenticated");

  const intialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };
  //Lets add the fow entry point
  intialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));
  const result = await db.workflow.create({
    data: {
      userId:user.id!,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(intialFlow),
      ...data,
    },
  });
  if (!result) throw new Error("failed to create workflow");

  redirect(`/workflow/editor/${result.id}`);
};

export const deleteWorkflow = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthenticated");

  await db.workflow.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/workflows");
};

export const executeWorkflow = async ({ workflowId, flowDefinition } : {
  workflowId: string;
  flowDefinition?: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated");

  if (!workflowId) throw new Error("workflowId is required");

  const workflow = await db.workflow.findUnique({
    where: { id: workflowId, userId: user.id! },
  });
  if (!workflow) throw new Error("workflow not found");

  let executionPlan: WorkflowExecutionPlan;

  if (!flowDefinition) throw new Error("flowDefinition is not defined");

  const flow = JSON.parse(flowDefinition);

  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) throw new Error("flow definition not valid");

  if (!result.executionPlan) throw new Error("no executionPlan generated");
  executionPlan = result.executionPlan;
  console.log("Execution plan", executionPlan);
};


export const updateWorkflow = async (values: updateWorkflowSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated");

  const { success, data } = updateWorkflowSchema.safeParse(values);
  if (!success) throw new Error("invalid form data");

  const workflow = await db.workflow.findUnique({
    where: { id: data.id, userId: user.id! },
  });
  if (!workflow) throw new Error("workflow not found");
  if (workflow.status !== WorkflowStatus.DRAFT)
    throw new Error("workflow is not a draft");

  const result = await db.workflow.update({
    where: { id:workflow.id, userId: user.id! },
    data: {...data},
  });

  revalidatePath("/workflow")
  revalidatePath(`/workflow/editor/${result.id}`)
  revalidatePath("/workflows");
};

export const saveWorkflow = async ({
    id,
    definition,
  }: {
    id: string;
    definition: string;
  }) => {
    const user = await currentUser();
    if (!user) throw new Error("Unathenticated");
  
    const workflow = await db.workflow.findUnique({ where: { id, userId:user.id! } });
    if (!workflow) throw new Error("workflow not found");
    if (workflow.status !== WorkflowStatus.DRAFT)
      throw new Error("workflow is not a draft");
  
    const result = await db.workflow.update({
      where: { id, userId:user.id! },
      data: {
        definition,
      },
    });
    revalidatePath("/workflows");
  };