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

import { dashboardGetAllCards } from "@/actions/dashboard";

export type DataType = {
  icon: LucideIcon;
  title: string;
  value: number;
  href: string;
  hrefTitle: string;
};

export const useDashboardData = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["dashboardData"],
    });
  };

  const { data, isFetching } = useQuery<DashboardDataType | null>({
    queryFn: () => dashboardGetAllCards(),
    queryKey: ["dashboardData"],
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

  useEffect(() => {
    socket?.on("conversation-messages-new", () => invalidate());
    return () => {
      socket?.on("conversation-messages-new", () => invalidate());
    };
    // eslint-disable-next-line
  }, []);

  return {  dataCard, isFetching };
};
