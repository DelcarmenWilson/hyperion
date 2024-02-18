import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { userGetAll } from "@/data/user";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
import { columns } from "./components/columns";

const UsersPage = async () => {
  const users = await userGetAll();
  return (
    <>
      <Card className="mt-2">
        <CardHeader>
          <Heading
            title={`Users (${users.length})`}
            description="Manage all users"
          />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} searchKey="userName" />
        </CardContent>
      </Card>
    </>
  );
};

export default UsersPage;
