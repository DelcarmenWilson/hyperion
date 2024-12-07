import {
  LucideIcon,
  MessageSquareText,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { DashboardDataType } from "@/types/dashboard";

import { getDashboardCards } from "@/actions/dashboard";

export type DataType = {
  icon: LucideIcon;
  title: string;
  value: number;
  href: string;
  hrefTitle: string;
};

export const useDashboardData = () => {
  const { data, isFetching:dashboardCardsLoading } = useQuery<DashboardDataType | null>({
    queryFn: () => getDashboardCards(),
    queryKey: ['dashboard-card-data'],
  });

  const dataCards: DataType[] = [
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
    // {
    //   icon: MessageSquarePlus,
    //   title: "Feeds",
    //   value: data?.feeds || 0,
    //   href: "/feeds",
    //   hrefTitle: "Go to feeds",
    // },
  ];
  return {  dataCards, dashboardCardsLoading };
};
