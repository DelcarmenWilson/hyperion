"use client";
import { CallHistoryCard } from "./card";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useLeadData } from "@/hooks/use-lead";

export const CallHistoryClient = () => {
  const { calls, isFetchingCalls } = useLeadData();
  //TODO find the other component that looks just like this one

  return (
    <SkeletonWrapper isLoading={isFetchingCalls}>
      <div className="text-sm">
        <div className="grid grid-cols-5 items-center  gap-2 text-md text-muted-foreground">
          <span>Direction</span>
          <span>Duration</span>
          <span className="col-span-2">Date / Time</span>
          <span>Actions</span>
        </div>

        {calls?.length ? (
          <>
            {calls?.map((call) => (
              <CallHistoryCard key={call.id} call={call} />
            ))}
          </>
        ) : (
          <p className="text-muted-foreground text-center mt-2">
            No calls found
          </p>
        )}
      </div>
    </SkeletonWrapper>
  );
};
