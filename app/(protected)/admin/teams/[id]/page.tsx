import { FullTeamReport, FullUserTeamReport } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";

import { TeamClient } from "./components/client";
import { UsersClient } from "./components/users/client";
import { RecentSales } from "./components/sales/client";
import { OverviewChart } from "./components/overview/client";

import { teamGetByIdStats, teamGetByIdSales } from "@/data/team";
import { adminUsersGetAll } from "@/data/admin";
import { weekStartEnd } from "@/formulas/dates";
import { convertSalesData } from "@/formulas/reports";

const TeamPage = async ({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const week = weekStartEnd();
  const from = searchParams.from || week.from.toString();
  const to = searchParams.to || week.to.toString();
  const team = await teamGetByIdStats(params.id, from as string, to as string);

  const users = await adminUsersGetAll();
  const sales = await teamGetByIdSales(params.id, from as string, to as string);
  if (!team) {
    return null;
  }

  const teamReport: FullTeamReport = {
    id: team.id,
    organization: team.organization,
    name: team.name,
    image: team.image,
    banner: team.banner,
    userId: team.userId,
    owner: team.owner,
    calls: team.users.reduce((sum, user) => sum + user.calls.length, 0),
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
    id: user.id,
    image: user.image,
    userName: user.userName,
    role: user.role,
    calls: user.calls.length,
    appointments: user.appointments.length,
    conversations: user.conversations.length,
    revenue: user.leads.reduce(
      (sum, lead) => sum + parseInt(lead.policy?.ap!),
      0
    ),
  }));

  return (
    <>
      <TeamClient team={teamReport} users={users} />

      <div className="grid gap-y-4 lg:gap-4 grid-cols-1 lg:grid-cols-3 mt-4">
        <OverviewChart data={convertSalesData(sales!)} />
        <RecentSales sales={sales!} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <Heading
            title={`Users (${team.users.length})`}
            description={`${team.name}'s users`}
          />
          <CardContent className="p-0">
            <UsersClient users={userReport} teamId={params.id} />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default TeamPage;
