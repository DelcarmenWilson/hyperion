"use client";
import { cn } from "@/lib/utils";
import { ActionCard } from "./card";
import { WorkflowDefaultNode } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";

type ActionListProps = {
  actions: WorkflowDefaultNode[];
  size?: string;
  isLoading?: boolean;
};
export const ActionList = ({
  actions,
  size = "full",
  isLoading = false,
}: ActionListProps) => {
  return (
    <>
      {actions.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {actions.map((action) => (
            <SkeletonWrapper key={action.id} isLoading={isLoading}>
              <ActionCard action={action as WorkflowActionSchemaType} />
            </SkeletonWrapper>
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Actions Found</p>
        </div>
      )}
    </>
  );
};
