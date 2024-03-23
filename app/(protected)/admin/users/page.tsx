import { userGetAll, userGetAllByRole } from "@/data/user";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./components/columns";
import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { UserTopMenu } from "./components/top-menu";
import { teamsGetAll } from "@/data/team";

const UsersPage = async () => {
  const users = await userGetAll();
  const teams = await teamsGetAll();
  const admins = await userGetAllByRole("ADMIN");

  return (
    <PageLayoutAdmin
      title={`Users (${users.length})`}
      description="Manage all users"
      topMenu={<UserTopMenu teams={teams} admins={admins} />}
    >
      <DataTable columns={columns} data={users} headers />
    </PageLayoutAdmin>
  );
};

export default UsersPage;
