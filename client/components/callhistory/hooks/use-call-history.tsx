import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FullCall } from "@/types";
import { weekStartEnd } from "@/formulas/dates";
import { DateRange } from "react-day-picker";
import {
  callsGetAllByUserIdFiltered,
  callsGetAllByAgentIdFiltered,
  callsGetAllByAgentIdToday,
} from "@/actions/call";

export const useCallHistoryData = (userId?: string, showDate?: boolean) => {
  const { socket } = useContext(SocketContext).SocketState;
  const queryClient = useQueryClient();
  const [dates, setDates] = useState<DateRange | undefined>(weekStartEnd());

  const { data: calls, isLoading: callsLoading } = useQuery<FullCall[]>({
    queryKey: ["agent-calls"],
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
      queryKey: ["agent-calls"],
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
  return {
    dates,
    setDates,
    calls,
    callsLoading,
    onDateSelected,
  };
};
