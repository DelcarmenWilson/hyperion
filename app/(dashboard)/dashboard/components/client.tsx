"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
} from "lucide-react";

import { CardBox, BoxSkeleton } from "@/components/custom/card/box";
import { pusherClient } from "@/lib/pusher";
import { useCurrentUser } from "@/hooks/use-current-user";

type DashBoardClientProps = {
  leadCount: number;
  messagesCount: number;
  outBoundCallsCount: number;
  inBoundCallsCount: number;
};
export const DashBoardClient = ({
  leadCount,
  messagesCount,
  outBoundCallsCount,
  inBoundCallsCount,
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <CardBox
        icon={Users}
        title="Leads today"
        value={leadCount}
        href="/leads"
        hrefTitle="Go to leads"
      />

      <CardBox
        icon={MessageSquareText}
        title="New texts"
        value={message}
        href="/conversations"
        hrefTitle="Go to conversations"
      />

      <CardBox
        icon={PhoneOutgoing}
        title="Outbound calls"
        value={outBoundCallsCount}
        href="/calls"
        hrefTitle="Go to calls"
      />
      <CardBox
        icon={PhoneIncoming}
        title="Inbound calls"
        value={inBoundCallsCount}
        href="/calls"
        hrefTitle="Go to calls"
      />
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
