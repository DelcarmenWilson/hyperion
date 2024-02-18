"use client";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";
import { pusherClient } from "@/lib/pusher";
import { Phone } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { CallHistoryColumn, columns } from "./columns";

interface AgentSummaryBoxProps {
  initialCalls: CallHistoryColumn[];
}

export const CallHistory = ({ initialCalls }: AgentSummaryBoxProps) => {
  const user = useCurrentUser();
  const [calls, setCalls] = useState<CallHistoryColumn[]>(initialCalls);
  const leadId = initialCalls[0]?.lead?.id;

  useEffect(() => {
    pusherClient.subscribe(user?.id as string);

    const callHandler = (newCall: CallHistoryColumn) => {
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
    <Card className="relative  overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Call history
          </CardTitle>
        </div>
        <CardTitle className=" text-sm text-muted-foreground text-right mr-6">
          add search and block list
          <p className="font-bold text-primary">1</p>
        </CardTitle>
      </div>

      <CardContent className="items-center space-y-0 pb-2">
        <DashBoardTable columns={columns} data={calls} searchKey="fullName" />
      </CardContent>
    </Card>
  );
};
