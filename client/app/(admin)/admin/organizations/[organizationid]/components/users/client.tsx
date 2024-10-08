"use client";
import { FullUserTeamReport } from "@/types";

import { columns } from "./columns";

import { DataTable } from "@/components/tables/data-table";
import { DatesFilter } from "@/components/reusable/dates-filter";

type UserClientProps = {
  users: FullUserTeamReport[];
  teamId: string;
};

export const UsersClient = ({ users, teamId }: UserClientProps) => {
  return (
    <DataTable
      columns={columns}
      data={users}
      headers
      topMenu={<DatesFilter link={`/admin/teams/${teamId}`} />}
    />
  );
};
