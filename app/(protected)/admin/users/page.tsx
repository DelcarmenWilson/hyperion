import { userGetAll } from "@/data/user";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./components/columns";
import { PageLayoutAdmin } from "../../../../components/custom/page-layout-admin";

const UsersPage = async () => {
  const users = await userGetAll();

  return (
    <PageLayoutAdmin
      title={`Users (${users.length})`}
      description="Manage all users"
    >
      <DataTable columns={columns} data={users} searchKey="userName" />
    </PageLayoutAdmin>
  );
};

export default UsersPage;
