import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { FullUserTeamReport } from "@/types";

type UserClientProps = {
  users: FullUserTeamReport[];
};

export const UsersClient = ({ users }: UserClientProps) => {
  return <DataTable columns={columns} data={users} searchKey="userName" />;
};
