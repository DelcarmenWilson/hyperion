import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FullCall } from "@/types";
import { weekStartEnd } from "@/formulas/dates";
import { DateRange } from "react-day-picker";
import {
  getCallsFiltered,
  getCallsForUserFiltered,
  getCallsForToday,
} from "@/actions/call";
import { useSocketStore } from "@/hooks/use-socket-store";
import { useInvalidate } from "@/hooks/use-invalidate";

export const useCallHistoryData = (
  dateRange?: DateRange,
  userId?: string,
  showDate?: boolean
) => {
  const { socket } = useSocketStore();
  const { invalidate } = useInvalidate();

  const {
    data: calls,
    isFetching: callsFetching,
    isLoading: callsLoading,
  } = useQuery<FullCall[]>({
    queryKey: ["agent-calls", dateRange?.from, dateRange?.to],
    queryFn: () =>
      userId
        ? getCallsForUserFiltered({ userId, dateRange: dateRange! })
        : showDate
        ? getCallsFiltered(dateRange!)
        : getCallsForToday(),
  });

  useEffect(() => {
    socket?.on("calllog-new", () => {
      invalidate("agent-calls");
    });
    return () => {
      socket?.off("calllog-new", () => {
        invalidate("agent-calls");
      });
    };
  }, []);
  return {
    calls,
    callsFetching,
    callsLoading,
  };
};
