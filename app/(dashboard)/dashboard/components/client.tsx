"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
} from "lucide-react";

import { Box, BoxSkeleton } from "../components/box";
import {
  AppointmentBox,
  AppointmentBoxSkeleton,
} from "./appointment/appointment-box";
import { AppointmentColumn } from "./appointment/columns";
import { AgentSummary } from "./agentsummary/agent-summary";
import { AgentSummaryColumn } from "./agentsummary/columns";
import { CallHistory } from "./callhistory/call-history";
import { pusherClient } from "@/lib/pusher";
import { useCurrentUser } from "@/hooks/use-current-user";

import TurnOverRate from "./turnover/turn-over-rate";
import { CallHistoryColumn } from "./callhistory/columns";

interface DashBoardClientProps {
  leadCount: number;
  messagesCount: number;
  outBoundCallsCount: number;
  inBoundCallsCount: number;
  appointments: AppointmentColumn[];
  agents: AgentSummaryColumn[];
  callHistory: CallHistoryColumn[];
}
export const DashBoardClient = ({
  leadCount,
  messagesCount,
  outBoundCallsCount,
  inBoundCallsCount,
  appointments,
  agents,
  callHistory,
}: DashBoardClientProps) => {
  const user = useCurrentUser();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [message, setMessage] = useState(messagesCount);

  useEffect(() => {
    pusherClient.subscribe(user?.id as string);

    const messageHandler = (message: string) => {
      // axios.post(`/api/conversations/${conversationId}/seen`);
      if (audioRef.current) {
        audioRef.current.play();
      }
      setMessage((current) => {
        return (current += 1);
      });
    };
    pusherClient.bind("messages:new", messageHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("messages:new", messageHandler);
    };
  }, [user?.id]);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Box
          icon={Users}
          title="Leads today"
          value={leadCount}
          href="/leads"
          hrefTitle="Go to leads"
        />

        <Box
          icon={MessageSquareText}
          title="New texts"
          value={message}
          href="/inbox"
          hrefTitle="Go to inbox"
        />

        <Box
          icon={PhoneOutgoing}
          title="Outbound calls"
          value={outBoundCallsCount}
          href="/calls"
          hrefTitle="Go to calls"
        />
        <Box
          icon={PhoneIncoming}
          title="Inbound calls"
          value={inBoundCallsCount}
          href="/calls"
          hrefTitle="Go to calls"
        />
      </div>
      {/* <AppointmentBoxSkeleton /> */}
      <AppointmentBox data={appointments} />
      <AgentSummary initialData={agents} />
      <div className="flex flex-col items-center gap-4 h-[400px] lg:flex-row">
        <div className="w-full lg:w-[25%] h-full">
          <TurnOverRate />
        </div>
        <div className="w-full lg:w-[75%] h-full">
          <CallHistory initialCalls={callHistory} />
        </div>
      </div>
      <audio ref={audioRef} src="/sounds/message.mp3" />
    </div>
  );
};

export const DashBoardClientSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        {[...Array(4)].map((_, i) => (
          <BoxSkeleton key={i} />
        ))}
      </div>
      {/* <AppointmentBox data={appointments} />
      <AgentSummary initialData={agents} /> */}
      {/* <div className="flex items-center gap-4 h-[400px]">
        <div className="w-[25%] h-full">
          <TurnOverRate />
        </div>
        <div className="w-[75%] h-full">
          <CallHistory initialCalls={callHistory} />
        </div>
      </div> */}
    </div>
  );
};
