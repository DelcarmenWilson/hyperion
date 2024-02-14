"use client";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { FullTeam } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";

type TeamsClientProps = {
  teams: FullTeam[];
};
export const TeamsClient = ({ teams }: TeamsClientProps) => {
  return (
    <Card className="mt-2">
      <CardHeader>
        <Heading
          title={`Teams (${teams.length})`}
          description="Manage teams for your organization."
        />
      </CardHeader>
      <CardContent>
        <DataTable data={teams} columns={columns} searchKey="name" />
      </CardContent>
    </Card>
  );
};
