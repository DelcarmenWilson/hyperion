"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { AgentSummaryColumn, columns } from "./columns";
import { DashBoardTable } from "../dashboard-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";

interface AgentSummaryBoxProps {
  initialData: AgentSummaryColumn[] | null;
}

export const AgentSummary = ({ initialData }: AgentSummaryBoxProps) => {
  const user = useCurrentUser();
  const [agents, setAgents] = useState<AgentSummaryColumn[]>(initialData!);

  useEffect(() => {
    pusherClient.subscribe(user?.id as string);
    const agentHandler = (agent: AgentSummaryColumn) => {
      setAgents((current) => {
        if (find(current, { id: agent.id })) {
          current.shift();
        }
        return [agent, ...current];
      });
    };
    pusherClient.bind("messages:new", agentHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("messages:new", agentHandler);
    };
  }, [user?.id]);

  if (!initialData?.length) return null;
  return (
    <Card className="relative  overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Agent Summary
          </CardTitle>
        </div>
        <CardTitle className=" text-sm text-muted-foreground text-right mr-6">
          Agent count
          <p className="font-bold text-primary">1</p>
        </CardTitle>
      </div>

      <CardContent className="items-center space-y-0 pb-2">
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <Button variant="outlineprimary" disabled size="sm">
              RENEW SUBSCRIPTIONS
            </Button>
            <Button variant="outlineprimary" disabled size="sm">
              FUND ACCOUNTS
            </Button>
          </div>
          <Button size="sm">INVITE USER</Button>
        </div>

        <DashBoardTable columns={columns} data={agents} searchKey="username" />
      </CardContent>
    </Card>
  );
};
