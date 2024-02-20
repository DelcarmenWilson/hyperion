import { TeamClient } from "./components/client";
import { UsersClient } from "./components/users";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";
import { FullTeamReport, FullUserTeamReport } from "@/types";
import { teamsGetById } from "@/data/team";
import { adminUsersGetAll } from "@/actions/admin";

const TeamPage = async ({
  params,
}: {
  params: {
    teamId: string;
  };
}) => {
  const team = await teamsGetById(params.teamId);
  const users = await adminUsersGetAll();
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
    revenue: team.users.reduce(
      (sum, user) =>
        sum + user.leads.reduce((sum, lead) => sum + lead.saleAmount!, 0),
      0
    ),
  };

  const userReport: FullUserTeamReport[] = team.users.map((user) => ({
    id: user.id,
    image: user.image,
    userName: user.userName,
    role: user.role,
    calls: user.calls.length,
    appointments: user.appointments.length,
    conversations: user.conversations.length,
    revenue: user.leads.reduce((sum, lead) => sum + lead.saleAmount!, 0),
  }));
  return (
    <>
      <TeamClient team={teamReport} users={users} />

      <Card className="mt-4">
        <CardHeader>
          <Heading
            title={`Users (${team.users.length})`}
            description={`${team.name}'s users`}
          />
          <CardContent className="p-0">
            <UsersClient users={userReport} teamId={params.teamId} />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default TeamPage;
