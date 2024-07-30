"use client";
import React from "react";
import { Share2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { FullCall } from "@/types";
import { CardLayout } from "@/components/custom/card/layout";
import { AudioPlayerHp } from "@/components/custom/audio-player-hp";

import { formatSecondsToTime } from "@/formulas/numbers";
import { formatDateTime } from "@/formulas/dates";
import { callsGetAllShared } from "@/actions/call";
import SkeletonWrapper from "../skeleton-wrapper";
import { cn } from "@/lib/utils";

export const SharedCallsClient = ({ columns = 3 }: { columns?: number }) => {
  const { data: calls, isFetching } = useQuery<FullCall[]>({
    queryFn: () => callsGetAllShared(),
    queryKey: ["agentSharedCalls"],
  });

  return (
    <CardLayout className="lg:col-span-2" title="Shared Calls" icon={Share2}>
      <SkeletonWrapper isLoading={isFetching}>
        <div
          className={cn(
            "grid grid-cols-1  gap-2 w-full",
            columns == 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          )}
        >
          {calls?.length ? (
            calls.map((call) => <SharedCallsCard key={call.id} call={call} />)
          ) : (
            <p className="col-span-4 text-center">No calls have been shared</p>
          )}
        </div>
      </SkeletonWrapper>
    </CardLayout>
  );
};

type SharedCallsCardProps = {
  call: FullCall;
};
export const SharedCallsCard = ({ call }: SharedCallsCardProps) => {
  return (
    <div className="flex flex-col gap-2 border rounded-[10px] p-2 text-sm">
      <p className="text-end">
        {call.createdAt && formatDateTime(call.createdAt)}
      </p>
      <p className="capitalize">
        <span className="text-muted-foreground">Lead: </span>
        <span className="text-primary font-medium">
          {call.lead
            ? `${call.lead.firstName} ${call.lead.lastName}`
            : "Unknown Caller"}
        </span>
      </p>
      <p>
        <span className="text-muted-foreground">Duration: </span>
        <span className="text-primary font-medium">
          {call.duration && formatSecondsToTime(call.duration)}
        </span>
      </p>
      <AudioPlayerHp src={call.recordUrl!} />
      <p className="text-end">
        <span className="text-muted-foreground">Agent: </span>
        <span className="text-primary font-medium">{call.user?.firstName}</span>
      </p>
    </div>
  );
};
