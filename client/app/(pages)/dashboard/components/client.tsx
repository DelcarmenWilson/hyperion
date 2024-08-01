"use client";

import { useContext, useEffect, useRef } from "react";
import SocketContext from "@/providers/socket";
import {
  LucideIcon,
  MessageSquarePlus,
  MessageSquareText,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
} from "lucide-react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { DashboardDataType } from "@/types/dashboard";

import { CardBox, BoxSkeleton } from "@/components/custom/card/box";
import { dashboardGetAllCards } from "@/actions/dashboard";

export type DataType = {
  icon: LucideIcon;
  title: string;
  value: number;
  href: string;
  hrefTitle: string;
};

export const DashBoardClient = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data, isFetching } = useQuery<DashboardDataType | null>({
    queryKey: ["dashboardData"],
    queryFn: () => dashboardGetAllCards(),
  });

  const dataCard: DataType[] = [
    {
      icon: Users,
      title: "Leads today",
      value: data?.leads || 0,
      href: "/leads",
      hrefTitle: "Go to leads",
    },
    {
      icon: MessageSquareText,
      title: "New texts",
      value: data?.texts || 0,
      href: "/conversations",
      hrefTitle: "Go to conversations",
    },

    {
      icon: PhoneOutgoing,
      title: "Outbound calls",
      value: data?.outbound || 0,
      href: "/calls",
      hrefTitle: "Go to calls",
    },
    {
      icon: PhoneIncoming,
      title: "Inbound calls",
      value: data?.inbound || 0,
      href: "/calls",
      hrefTitle: "Go to calls",
    },
    {
      icon: MessageSquarePlus,
      title: "Feeds",
      value: data?.feeds || 0,
      href: "/feeds",
      hrefTitle: "Go to feeds",
    },
  ];
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["dashboardData"],
    });
  };

  useEffect(() => {
    socket?.on("conversation-messages-new", () => invalidate());
    return () => {
      socket?.on("conversation-messages-new", () => invalidate());
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      {dataCard.map((data) => (
        <CardBox
          key={data.title}
          icon={data.icon}
          title={data.title}
          value={data.value}
          href={data.href}
          hrefTitle={data.hrefTitle}
          isFetching={isFetching}
        />
      ))}

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
