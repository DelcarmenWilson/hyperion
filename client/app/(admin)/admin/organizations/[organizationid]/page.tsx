import { FullTeamReport, FullUserTeamReport } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";

import { OrganizationClient } from "./components/client";
import { UsersClient } from "./components/users/client";
import { RecentSales } from "./components/sales/client";
import { OverviewChart } from "@/components/reports/chart";

import { getTeamStats, getTeamSales } from "@/actions/team";
import { adminUsersGetAll } from "@/actions/admin/user";

const OrganizationPage = () => {
  return (
    <div className="h-full overflow-y-auto">
      <OrganizationClient />

      {/* <div className="grid gap-y-4 lg:gap-4 grid-cols-1 lg:grid-cols-3 mt-4">
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
            <UsersClient users={userReport} teamId={params.id} />
          </CardContent>
        </CardHeader>
      </Card> */}
    </div>
  );
};

export default OrganizationPage;
