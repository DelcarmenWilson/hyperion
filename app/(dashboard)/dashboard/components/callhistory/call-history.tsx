"use client";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";
import { pusherClient } from "@/lib/pusher";
import { Phone } from "lucide-react";

import { DashBoardTable } from "@/components/tables/dashboard-table";
import { columns } from "./columns";
import { CardLayout } from "@/components/custom/card-layout";
import { TopMenu } from "./top-menu";
import { FullCall } from "@/types";

interface CallHistoryClientProps {
  initialCalls: FullCall[];
}

export const CallHistoryClient = ({ initialCalls }: CallHistoryClientProps) => {
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
    <CardLayout title="Call history" icon={Phone} topMenu={<TopMenu />}>
      <DashBoardTable columns={columns} data={calls} searchKey="fullName" />
    </CardLayout>
  );
};
