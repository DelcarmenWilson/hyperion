import React from "react";
import { useQuery } from "@tanstack/react-query";

import { WorkflowDefaultNode } from "@prisma/client";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { ActionCard } from "./card";
import { workflowNodesGetAllByType } from "@/actions/workflow/default";

export const ActionList = () => {
  const { data: actions, isFetching } = useQuery<WorkflowDefaultNode[]>({
    queryKey: ["adminActions"],
    queryFn: () => workflowNodesGetAllByType("action"),
  });

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <div className="w-full space-y-2">
        {actions?.map((action) => (
          <ActionCard
            key={action.id}
            action={action as unknown as WorkflowActionSchemaType}
          />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
