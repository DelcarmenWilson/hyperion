import React from "react";
import { useWorkFlowDefaultData } from "@/hooks/use-workflow";
import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TriggerCard } from "./card";

export const TriggerList = () => {
  const { onGetWorkflowDefaultNodesByType } = useWorkFlowDefaultData();
  const { data, isFetching } = onGetWorkflowDefaultNodesByType("trigger");

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <div className="w-full space-y-2">
        {data?.map((trigger) => (
          <TriggerCard
            key={trigger.id}
            trigger={trigger as unknown as WorkflowTriggerSchemaType}
          />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
