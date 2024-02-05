"use client";
import { useEffect, useState } from "react";
import { find } from "lodash";
import { pusherClient } from "@/lib/pusher";

import { CallBox } from "./call-box";
import { Call } from "@prisma/client";

interface CallHistoryBoxProps {
  initialCalls: Call[];
}

export const CallHistory = ({ initialCalls }: CallHistoryBoxProps) => {
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const leadId = initialCalls[0].leadId;

  useEffect(() => {
    pusherClient.subscribe(leadId as string);

    const callHandler = (newCall: Call) => {
      setCalls((current) => {
        if (find(current, { id: newCall.id })) {
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
        <CallBox key={call.id} call={call} />
      ))}
    </div>
  );
};
