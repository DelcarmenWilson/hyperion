import React, { Suspense } from "react";
import { InboxIcon } from "lucide-react";

import AlertError from "@/components/custom/alert-error";
import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import NewPageLayout from "@/components/custom/layout/new-page-layout";
import WorkflowCard from "./_components/workflow-card";
import { getWorkFlowForUser } from "@/actions/workflow/get-workflows-for-user";

const WorkflowPage = () => {
  return (
    <NewPageLayout
      title="Workflows"
      subTitle="Manage Workflows"
      topMenu={<CreateWorkflowDialog />}
    >
      <Suspense fallback={<UserWorkflowsSkeleton />}>
        <UserWorkflows />
      </Suspense>
    </NewPageLayout>
  );
};

const UserWorkflowsSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};

const UserWorkflows = async () => {
  const workflows = await getWorkFlowForUser();
  if (!workflows) return <AlertError />;
  if (workflows.length === 0)
    return (
      <NewEmptyCard
        title="No workflows created yet"
        subTitle="Click the button below to create your first workflow"
        icon={InboxIcon}
        button={
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        }
      />
    );

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
};

export default WorkflowPage;
