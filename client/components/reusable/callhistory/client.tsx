"use client";
import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { Phone } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { columns } from "./columns";
import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import { TopMenu } from "./top-menu";
import { FullCall } from "@/types";
import { callsGetAllByAgentIdToday } from "@/actions/call";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { weekStartEnd } from "@/formulas/dates";
import { DateRange } from "react-day-picker";
import {
  callsGetAllByUserIdFiltered,
  callsGetAllByAgentIdFiltered,
} from "@/actions/call";

type CallHistoryClientProps = {
  userId?: string;
  duration?: number;
  showLink?: boolean;
  showDate?: boolean;
};

export const CallHistoryClient = ({
  userId,
  duration = 0,
  showLink = false,
  showDate = false,
}: CallHistoryClientProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const queryClient = useQueryClient();
  const [dates, setDates] = useState<DateRange | undefined>(weekStartEnd());

  const { data: calls, isFetching } = useQuery<FullCall[]>({
    queryKey: ["agentCalls"],
    queryFn: () =>
      userId
        ? callsGetAllByAgentIdFiltered(
            userId,
            dates?.from?.toString() as string,
            dates?.to?.toString() as string
          )
        : showDate
        ? callsGetAllByUserIdFiltered(
            dates?.from?.toString() as string,
            dates?.to?.toString() as string
          )
        : callsGetAllByAgentIdToday(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["agentCalls"],
    });
  };

  const onDateSelected = (e: DateRange) => {
    if (!e) return;
    setDates(e);
    invalidate();
  };

  useEffect(() => {
    socket?.on("calllog-new", invalidate);
    return () => {
      socket?.off("calllog-new", invalidate);
    };
  }, []);
  return (
    <CardLayout
      title="Call History"
      icon={Phone}
      topMenu={
        <TopMenu
          showLink={showLink}
          showDate={showDate}
          duration={duration}
          onDateSelected={onDateSelected}
        />
      }
    >
      <SkeletonWrapper isLoading={isFetching}>
        <DataTable
          columns={columns}
          data={calls || []}
          headers
          striped
          paginationType="advance"
          filterType="call"
          hidden={{ direction: false, status: false }}
        />
      </SkeletonWrapper>
    </CardLayout>
  );
};
