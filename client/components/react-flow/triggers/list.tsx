import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TriggerCard } from "./card";
import { triggersGetAll } from "@/actions/triggers";
import { Trigger } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TriggerSchemaType } from "@/schemas/trigger";

export const TriggerList = () => {
  const { data: triggers, isFetching } = useQuery<Trigger[]>({
    queryKey: ["adminTriggers"],
    queryFn: () => triggersGetAll(),
  });

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <div className="w-full space-y-2">
        {triggers?.map((trigger) => (
          <TriggerCard
            key={trigger.id}
            trigger={trigger as unknown as TriggerSchemaType}
          />
        ))}
      </div>
    </SkeletonWrapper>
  );
};
