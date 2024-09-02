import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./components/columns";
import { UserTopMenu } from "./components/top-menu";

import { usersGetAll } from "@/actions/user";
import { usersGetAllByRole } from "@/actions/user";
import { teamsGetAll } from "@/data/team";

const UsersPage = async () => {
  const users = await usersGetAll();
  const teams = await teamsGetAll();
  const admins = await usersGetAllByRole("ADMIN");

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
