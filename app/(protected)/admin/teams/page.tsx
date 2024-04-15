import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./components/columns";
import { TeamForm } from "./components/team-form";
import { teamsGetAll } from "@/actions/team";

const TeamsPage = async () => {
  const teams = await teamsGetAll();

  return (
    <PageLayoutAdmin
      title={`Teams (${teams.length})`}
      description="Manage teams for your organization."
      topMenu={<TeamForm />}
    >
      <DataTable data={teams} columns={columns} />
    </PageLayoutAdmin>
  );
};

export default TeamsPage;
