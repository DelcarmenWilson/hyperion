import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { User } from "@prisma/client";
type UserClientProps = {
  users: User[];
};
export const UserClient = ({ users }: UserClientProps) => {
  return (
    <>
      <DataTable columns={columns} data={users} searchKey="userName" />
    </>
  );
};
