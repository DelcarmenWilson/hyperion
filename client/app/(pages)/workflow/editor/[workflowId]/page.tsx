import React from "react";
import { currentUser } from "@/lib/auth";
import Editor from "../../_components/editor";
import { getWorkflowById } from "@/actions/workflow/get-workflow-by-id";
const WorkflowPage = async ({ params }: { params: { workflowId: string } }) => {
  const user = currentUser();
  const { workflowId } = params;
  if (!user) return <div>unauthenticated</div>;

  const workflow = await getWorkflowById(workflowId);

  if (!workflow) return <div>workflow not found</div>;
  return <Editor workflow={workflow} />;
};

export default WorkflowPage;
