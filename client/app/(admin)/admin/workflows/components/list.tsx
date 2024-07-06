"use client";
import { cn } from "@/lib/utils";
import { TriggerCard } from "./card";
import { Trigger } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TriggerSchemaType } from "@/schemas/trigger";

type TriggerListProps = {
  triggers: Trigger[];
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
              <TriggerCard initTrigger={trigger as TriggerSchemaType} />
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
