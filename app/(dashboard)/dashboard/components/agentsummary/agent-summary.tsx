"use client";
import { Users } from "lucide-react";
import { AgentSummaryColumn, columns } from "./columns";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";
import { CardLayout } from "@/components/custom/card-layout";
import { TopMenu } from "./top-menu";

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

      <DashBoardTable columns={columns} data={agents} searchKey="username" />
    </CardLayout>
  );
};
