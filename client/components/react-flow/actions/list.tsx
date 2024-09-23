import React from "react";
import { useWorkFlowDefaultData } from "@/hooks/use-workflow";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { ActionCard } from "./card";
import { INodeTypeBaseDescription } from "@/nodes/node_type";

export const ActionList = () => {
  const { onGetWorkflowDefaultNodesByType } = useWorkFlowDefaultData();
  const { data, isFetching } = onGetWorkflowDefaultNodesByType("action");

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <div className="w-full space-y-2">
        {data?.map((action) => (
          <ActionCard
            key={action.id}
            action={action as unknown as WorkflowActionSchemaType}
          />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
