"use client";
import { cn } from "@/lib/utils";
import { WorkflowCard } from "./card";
import { Workflow } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type WorkFlowListProps = {
  workflows: Workflow[];
  size?: string;
  isLoading?: boolean;
};
export const WorkflowList = ({
  workflows,
  size = "full",
  isLoading = false,
}: WorkFlowListProps) => {
  return (
    <>
      {workflows.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {workflows.map((workflow) => (
            <SkeletonWrapper key={workflow.id} isLoading={isLoading}>
              <WorkflowCard initWorkFlow={workflow} />
            </SkeletonWrapper>
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No WorkFlows Found</p>
        </div>
      )}
    </>
  );
};
