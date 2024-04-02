"use client";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";
import { pusherClient } from "@/lib/pusher";
import { Phone } from "lucide-react";

import { columns } from "./columns";
import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import { TopMenu } from "./top-menu";
import { FullCall } from "@/types";
import { DatesFilter } from "../dates-filter";

type CallHistoryClientProps = {
  initialCalls: FullCall[];
  duration?: number;
  showDate?: boolean;
};

export const CallHistoryClient = ({
  initialCalls,
  duration = 0,
  showDate = false,
}: CallHistoryClientProps) => {
  const user = useCurrentUser();
  const [calls, setCalls] = useState<FullCall[]>(initialCalls);
  const leadId = initialCalls[0]?.lead?.id;

  useEffect(() => {
    if (!user?.id) return;
    pusherClient.subscribe(user?.id as string);

    const callHandler = (newCall: FullCall) => {
      setCalls((current) => {
        if (find(current, { id: newCall.id })) {
          current.shift();
        }
        return [newCall, ...current];
      });
    };
    pusherClient.bind("calllog:new", callHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("calllog:new", callHandler);
    };
  }, [leadId, user?.id]);
  return (
    <CardLayout
      title="Call History"
      icon={Phone}
      topMenu={
        showDate ? (
          <DatesFilter link="/calls" />
        ) : (
          <TopMenu duration={duration} />
        )
      }
    >
      <DataTable columns={columns} data={calls} headers search={false} />
    </CardLayout>
  );
};
