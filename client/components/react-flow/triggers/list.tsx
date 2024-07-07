import React from "react";
import { useQuery } from "@tanstack/react-query";

import { WorkflowDefaultNode } from "@prisma/client";
import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TriggerCard } from "./card";
import { workflowNodesGetAllByType } from "@/actions/workflow/default";

export const TriggerList = () => {
  const { data: triggers, isFetching } = useQuery<WorkflowDefaultNode[]>({
    queryKey: ["adminTriggers"],
    queryFn: () => workflowNodesGetAllByType("trigger"),
  });

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <div className="w-full space-y-2">
        {triggers?.map((trigger) => (
          <TriggerCard
            key={trigger.id}
            trigger={trigger as unknown as WorkflowTriggerSchemaType}
          />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
