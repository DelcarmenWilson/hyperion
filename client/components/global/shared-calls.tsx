"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Share2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/user/use-current";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FullCall } from "@/types";

import { CardLayout } from "@/components/custom/card/layout";

const AudioPlayerHp = dynamic(
  () => import("@/components/custom/audio-player-hp"),
  {
    ssr: false,
  }
);
// import { AudioPlayerHp } from "@/components/custom/audio-player-hp";

import { Button } from "../ui/button";
import SkeletonWrapper from "../skeleton-wrapper";

import { formatDateTime } from "@/formulas/dates";
import { formatSecondsToTime } from "@/formulas/numbers";
import { getSharedCalls, shareCall } from "@/actions/call";
//TODO - need to put this logic into a hook
export const SharedCallsClient = ({ columns = 3 }: { columns?: number }) => {
  const user = useCurrentUser();
  const { data: calls, isFetching } = useQuery<FullCall[] | []>({
    queryFn: () => getSharedCalls(),
    queryKey: ["shared-calls"],
  });

  const queryClient = useQueryClient();
  const onCallUnshare = async (id: string) => {
    const unsharedCall = await shareCall({ id, shared: false });
    if (unsharedCall) {
      queryClient.invalidateQueries({ queryKey: ["shared-calls"] });
      toast.success(unsharedCall);
    } else toast.error("Something went wrong");
  };

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
            calls.map((call) => (
              <SharedCallsCard
                key={call.id}
                call={call}
                showBtn={user?.id == call.conversation.agentId}
                onCallUnshare={onCallUnshare}
              />
            ))
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
  showBtn?: boolean;
  onCallUnshare: (e: string) => void;
};
const SharedCallsCard = ({
  call,
  showBtn = false,
  onCallUnshare,
}: SharedCallsCardProps) => {
  return (
    <div className="flex flex-col gap-2 border rounded-[10px] p-2 text-sm">
      <div className="flex justify-between items-center">
        <Button size="sm" onClick={() => onCallUnshare(call.id)}>
          Unshare
        </Button>
        <p className="text-end">
          {call.createdAt && formatDateTime(call.createdAt)}
        </p>
      </div>
      <p className="capitalize">
        <span className="text-muted-foreground">Lead: </span>
        <span className="text-primary font-medium">
          {call.conversation.lead
            ? `${call.conversation.lead.firstName} ${call.conversation.lead.lastName}`
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
        <span className="text-primary font-medium">
          {call.conversation.agent?.firstName}
        </span>
      </p>
    </div>
  );
};
