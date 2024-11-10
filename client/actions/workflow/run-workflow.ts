"use server";

import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";
import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { WorkflowExecutionPlan } from "@/types/workflow/workflow";

export const runWorkflow = async (form: {
  workflowId: string;
  flowDefinition?: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated");

  const { workflowId, flowDefinition } = form;

  if (!workflowId) throw new Error("workflowId is required");

  const workflow = await db.workflow.findUnique({
    where: { id: workflowId, userId:user.id! },
  });
  if (!workflow) throw new Error("workflow not found");

  let executionPlan: WorkflowExecutionPlan;

  if (!flowDefinition) throw new Error("flowDefinition is not defined");

  const flow=JSON.parse(flowDefinition)

  const result=FlowToExecutionPlan(flow.nodes,flow.edges)

  if(result.error) throw new Error("flow definition not valid")

    if(!result.executionPlan) throw new Error("no executionPlan generated")
        executionPlan=result.executionPlan
    console.log("Execution plan",executionPlan)

};
