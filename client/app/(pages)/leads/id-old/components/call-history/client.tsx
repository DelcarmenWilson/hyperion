"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Call } from "@prisma/client";
import { FullCall } from "@/types";

import { CallHistoryCard } from "./card";
import { callsGetAllByLeadId } from "@/actions/call";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const CallHistoryClient = ({ leadId }: { leadId: string }) => {
  const { data: calls, isFetching } = useQuery<FullCall[]>({
    queryFn: () => callsGetAllByLeadId(leadId),
    queryKey: ["leadCalls"],
  });
  //TODO find the other component that looks just like this one
  useEffect(() => {
    const callHandler = (newCall: Call) => {
      //TODO - need to invalidate the quesry instead
      // setCalls((current) => {
      //   const existingCall = current.find((e) => e.id == newCall.id);
      //   if (existingCall) {
      //     current.shift();
      //   }
      //   return [newCall, ...current];
      // });
    };

    return () => {};
  }, []);
  return (
    <SkeletonWrapper isLoading={isFetching}>
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
