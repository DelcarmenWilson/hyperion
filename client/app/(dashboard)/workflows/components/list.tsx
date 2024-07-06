"use client";
import { cn } from "@/lib/utils";
import { WorkFlowCard } from "./card";
import { WorkFlow } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type WorkFlowListProps = {
  workflows: WorkFlow[];
  size?: string;
  isLoading?: boolean;
};
export const WorkFlowList = ({
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
              <WorkFlowCard initWorkFlow={workflow} />
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
