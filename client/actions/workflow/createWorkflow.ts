"use server";


import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schemas/workflow";
import { AppNode } from "@/types/workflow/app-node";
import { TaskType } from "@/types/workflow/task";
import { WorkflowStatus } from "@/types/workflow/workflow";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export const createWorkflow = async (form: createWorkflowSchemaType) => {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) throw new Error("invalid form data");

  const user= await currentUser();
  if (!user) throw new Error("unauthenticated");

  const intialFlow:{nodes:AppNode[],edges:Edge[]}={
    nodes:[],
    edges:[]
  }
  //Lets add the fow entry point
  intialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER))
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
