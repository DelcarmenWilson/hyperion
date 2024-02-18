import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { FullUserReport } from "@/types";

type UserClientProps = {
  users: FullUserReport[];
};

export const UsersClient = ({ users }: UserClientProps) => {
  return <DataTable columns={columns} data={users} searchKey="userName" />;
};
