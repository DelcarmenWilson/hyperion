"use client";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { pusherClient } from "@/lib/pusher";

import { AgentSummaryColumn, columns } from "./columns";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { Button } from "@/components/ui/button";
import { CardLayout } from "@/components/custom/card/layout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { TopMenu } from "./top-menu";

type AgentSummaryClientProps = {
  initialData: AgentSummaryColumn[] | null;
};

export const AgentSummaryClient = ({
  initialData,
}: AgentSummaryClientProps) => {
  const user = useCurrentUser();
  const [agents, setAgents] = useState<AgentSummaryColumn[]>(initialData!);

  useEffect(() => {
    pusherClient.subscribe(user?.id as string);
    const agentHandler = (agent: AgentSummaryColumn) => {
      setAgents((current) => {
        const existingAgent = current.find((e) => e.id == agent.id);
        if (existingAgent) {
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
    <CardLayout title="Agent Summary" icon={Users} topMenu={<TopMenu />}>
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

      <DashBoardTable columns={columns} data={agents} />
    </CardLayout>
  );
};
