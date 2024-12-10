import { useEffect } from "react";
import { useSocketStore } from "@/stores/socket-store";
import { useQuery } from "@tanstack/react-query";
import { useInvalidate } from "@/hooks/use-invalidate";

import { FullCall } from "@/types";
import { DateRange } from "react-day-picker";
import {
  getCallsFiltered,
  getCallsForUserFiltered,
  getCallsForToday,
} from "@/actions/call";

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
