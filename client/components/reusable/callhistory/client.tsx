"use client";
import { useEffect, useState } from "react";
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
import { pusherClient } from "@/lib/pusher";
import { useCurrentUser } from "@/hooks/use-current-user";

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
  const user = useCurrentUser();
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
    if (!user?.id) return;
    pusherClient.subscribe(user?.id as string);

    const callHandler = (newCall: FullCall) => {
      invalidate();
    };
    pusherClient.bind("calllog:new", callHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("calllog:new", callHandler);
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
