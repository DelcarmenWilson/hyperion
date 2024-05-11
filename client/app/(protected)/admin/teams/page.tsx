import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { TeamForm } from "./components/form";
import { teamsGetAll } from "@/data/team";
import { TeamClient } from "./components/client";

const TeamsPage = async () => {
  const teams = await teamsGetAll();

  return (
    <PageLayoutAdmin
      title={`Teams (${teams.length})`}
      description="Manage teams for your organization."
      topMenu={<TeamForm />}
    >
      <TeamClient intitTeams={teams} />
    </PageLayoutAdmin>
  );
};

export default TeamsPage;
