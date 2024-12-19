import { FullTeamReport, FullUserTeamReport } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";

import { TeamClient } from "./components/client";
import { UsersClient } from "./components/users/client";
import { RecentSales } from "./components/sales/client";
import { OverviewChart } from "@/components/reports/chart";

import { weekStartEnd } from "@/formulas/dates";
import { convertSalesData } from "@/formulas/reports";
import { getTeamStats, getTeamSales } from "@/actions/team";
import { adminUsersGetAll } from "@/actions/admin/user";

const TeamPage = async ({
  params,
  searchParams,
}: {
  params: {
    teamid: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const week = weekStartEnd();
  const from = searchParams.from || week.from.toString();
  const to = searchParams.to || week.to.toString();
  const team = await getTeamStats({
    id: params.teamid,
    from: from as string,
    to: to as string,
  });

  const users = await adminUsersGetAll();
  const sales = await getTeamSales({
    id: params.teamid,
    from: from as string,
    to: to as string,
  });
  if (!team) return null;

  const teamReport: FullTeamReport = {
    ...team,
    calls: team.users.reduce((sum, user) => sum + user.conversations.length, 0),
    appointments: team.users.reduce(
      (sum, user) => sum + user.appointments.length,
      0
    ),
    conversations: team.users.reduce(
      (sum, user) => sum + user.conversations.length,
      0
    ),
    revenue:
      sales?.reduce((sum, sale) => sum + parseInt(sale.policy?.ap!), 0) || 0,
  };

  const userReport: FullUserTeamReport[] = team.users.map((user) => ({
    ...user,
    //TODO - wee need to change this to use the communications but only for any calls
    calls: user.conversations.length,
    appointments: user.appointments.length,
    conversations: user.conversations.length,
    revenue: user.leads.reduce(
      (sum, lead) => sum + parseInt(lead.policy?.ap!),
      0
    ),
  }));

  return (
    <div className="h-full overflow-y-auto">
      <TeamClient team={teamReport} users={users} />

      <div className="grid gap-y-4 lg:gap-4 grid-cols-1 lg:grid-cols-3 mt-4">
        <OverviewChart data={convertSalesData(sales!)} title="Overview" />
        <RecentSales sales={sales!} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <Heading
            title={`Agents (${team.users.length})`}
            description={`${team.name}'s agents`}
          />
          <CardContent className="p-0">
            <UsersClient users={userReport} teamId={params.teamid} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TeamPage;
