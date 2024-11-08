"use client";
import { cn } from "@/lib/utils";
import { useAgentLeadStatusData } from "../../hooks/use-lead-status";

import { LeadStatusCard } from "./card";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { EmptyData } from "@/components/lead/info/empty-data";

type LeadStatusListProps = {
  size?: string;
};
export const LeadStatusList = ({ size = "full" }: LeadStatusListProps) => {
  const { leadStatuses, isFetchingLeadStatuses } = useAgentLeadStatusData();
  return (
    <SkeletonWrapper isLoading={isFetchingLeadStatuses}>
      {leadStatuses?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {leadStatuses
            ?.filter((e) => e.type != "default")
            .map((leadStatus) => (
              <LeadStatusCard key={leadStatus.id} leadStatus={leadStatus} />
            ))}
        </div>
      ) : (
        <EmptyData title="No Lead Status Found<" />
      )}
    </SkeletonWrapper>
  );
};
