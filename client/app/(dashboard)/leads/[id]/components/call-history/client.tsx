"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

import { CallHistoryCard } from "./card";
import { Call } from "@prisma/client";

interface CallHistoryClientProps {
  leadId: string;
  initialCalls: Call[];
}

export const CallHistoryClient = ({
  leadId,
  initialCalls,
}: CallHistoryClientProps) => {
  const [calls, setCalls] = useState<Call[]>(initialCalls);

  useEffect(() => {
    pusherClient.subscribe(leadId as string);

    const callHandler = (newCall: Call) => {
      setCalls((current) => {
        const existingCall = current.find((e) => e.id == newCall.id);
        if (existingCall) {
          current.shift();
        }
        return [newCall, ...current];
      });
    };
    pusherClient.bind("call:coach", callHandler);
    return () => {
      pusherClient.unsubscribe(leadId as string);
      pusherClient.unbind("call:coach", callHandler);
    };
  }, [leadId]);
  return (
    <div className="text-sm">
      <div className="grid grid-cols-5 items-center  gap-2 text-md text-muted-foreground">
        <span>Direction</span>
        <span>Duration</span>
        <span className="col-span-2">Date / Time</span>
        <span>Recording</span>
      </div>
      {calls?.map((call) => (
        <CallHistoryCard key={call.id} call={call} />
      ))}
      {!calls.length && (
        <p className="text-muted-foreground text-center mt-2">No calls found</p>
      )}
    </div>
  );
};
