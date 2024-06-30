"use client";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { SummaryUser } from "@/types";
import { AgentSummaryColumn, columns } from "./columns";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { Button } from "@/components/ui/button";
import { CardLayout } from "@/components/custom/card/layout";
import { TopMenu } from "./top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { usersGetSummaryByTeamId } from "@/actions/user";

export const AgentSummaryClient = () => {
  const { data: agents, isFetching } = useQuery<SummaryUser[]>({
    queryKey: ["agentSummary"],
    queryFn: () => usersGetSummaryByTeamId(),
  });

  const formattedAgents: AgentSummaryColumn[] | undefined = agents?.map(
    (agent) => ({
      id: agent.id,
      username: agent.userName,
      email: agent.email as string,
      subscriptionExpires: "12-31-2029",
      balance: "100",
      leadsPending: "0",
      carrierViolations: "0",
      coaching: agent.chatSettings?.coach!,
      currentCall: agent.chatSettings?.currentCall!,
    })
  );

  return (
    <CardLayout title="Agent Summary" icon={Users} topMenu={<TopMenu />}>
      <SkeletonWrapper isLoading={isFetching}>
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

        <DashBoardTable columns={columns} data={formattedAgents || []} />
      </SkeletonWrapper>
    </CardLayout>
  );
};
