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
import Link from "next/link";

type CallHistoryClientProps = {
  initialCalls: FullCall[];
  duration?: number;
  showLink?: boolean;
  showDate?: boolean;
};

export const CallHistoryClient = ({
  initialCalls,
  duration = 0,
  showLink = false,
  showDate = false,
}: CallHistoryClientProps) => {
  const user = useCurrentUser();
  const [calls, setCalls] = useState<FullCall[]>(initialCalls);
  const leadId = initialCalls[0]?.lead?.id;

  useEffect(() => {
    if (!user?.id) return;
    // pusherClient.subscribe(user?.id as string);

    const callHandler = (newCall: FullCall) => {
      console.log("we are here");
      setCalls((current) => {
        if (find(current, { id: newCall.id })) {
          current.shift();
        }
        return [newCall, ...current];
      });
    };
    // pusherClient.bind("calllog:new", callHandler);
    return () => {
      // pusherClient.unsubscribe(user?.id as string);
      // pusherClient.unbind("calllog:new", callHandler);
    };
  }, [leadId, user?.id]);
  return (
    <CardLayout
      title="Call History"
      icon={Phone}
      topMenu={
        <TopMenu showLink={showLink} showDate={showDate} duration={duration} />
      }
    >
      <DataTable
        columns={columns}
        data={calls}
        headers
        striped
        paginationType="advance"
        filterType="call"
        hidden={{ direction: false, status: false }}
      />
    </CardLayout>
  );
};
