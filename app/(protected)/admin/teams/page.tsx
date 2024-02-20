import { teamsGetAll } from "@/data/team";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./components/columns";
import { PageLayoutAdmin } from "../../../../components/custom/page-layout-admin";
import { TeamForm } from "./components/team-form";

const TeamsPage = async () => {
  const teams = await teamsGetAll();

  return (
    <PageLayoutAdmin
      title={`Teams (${teams.length})`}
      description="Manage teams for your organization."
      topMenu={<TeamForm />}
    >
      <DataTable data={teams} columns={columns} searchKey="name" />
    </PageLayoutAdmin>
  );
};

export default TeamsPage;
