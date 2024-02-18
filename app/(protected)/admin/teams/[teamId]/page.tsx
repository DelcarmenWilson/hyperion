import { teamsGetById } from "@/data/team";
import { TeamClient } from "./components/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";
import { FullTeamReport, FullUserReport } from "@/types";
import { UsersClient } from "./components/users";

const TeamPage = async ({
  params,
}: {
  params: {
    teamId: string;
  };
}) => {
  const team = await teamsGetById(params.teamId);
  if (!team) {
    return null;
  }

  const teamReport: FullTeamReport = {
    id: team.id,
    organization: team.organization,
    name: team.name,
    image: team.image,
    banner: team.banner,
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

  const userReport: FullUserReport[] = team.users.map((user) => ({
    id: user.id,
    image: user.image,
    userName: user.userName,
    role: user.role,
    calls: user.calls.length,
    appointments: user.conversations.length,
    conversations: user.appointments.length,
    revenue: user.leads.reduce((sum, lead) => sum + lead.saleAmount!, 0),
  }));
  return (
    <>
      <TeamClient team={teamReport} />

      <Card className="mt-4">
        <CardHeader>
          <Heading
            title={`Users (${team.users.length})`}
            description={`${team.name}'s users`}
          />
          <CardContent className="p-0">
            <UsersClient users={userReport} />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default TeamPage;
