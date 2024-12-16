import React from "react";
import { currentUser } from "@/lib/auth";
import Editor from "../../_components/editor";
import { getWorkflow } from "@/actions/workflow";
import Unauthenticated from "@/components/global/unauthenticated";
import { EmptyCard } from "@/components/reusable/empty-card";
const WorkflowPage = async ({ params }: { params: { workflowId: string } }) => {
  const user = currentUser();
  const { workflowId } = params;
  if (!user) return <Unauthenticated />;

  const workflow = await getWorkflow(workflowId);

  if (!workflow)
    return (
      <EmptyCard
        title="Workflow not found"
        subTitle="If you believe this was a mistake please contact your administrator."
      />
    );
  return <Editor workflow={workflow} />;
};

export default WorkflowPage;
