"use client";
import { cn } from "@/lib/utils";
import { TriggerCard } from "./card";
import { WorkflowDefaultNode } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

type TriggerListProps = {
  triggers: WorkflowDefaultNode[];
  size?: string;
  isLoading?: boolean;
};
export const TriggerList = ({
  triggers,
  size = "full",
  isLoading = false,
}: TriggerListProps) => {
  return (
    <>
      {triggers.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {triggers.map((trigger) => (
            <SkeletonWrapper key={trigger.id} isLoading={isLoading}>
              <TriggerCard trigger={trigger as WorkflowTriggerSchemaType} />
            </SkeletonWrapper>
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Triggers Found</p>
        </div>
      )}
    </>
  );
};
