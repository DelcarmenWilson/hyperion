import { teamsGetAll } from "@/data/team";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";
import { columns } from "./components/columns";

const TeamsPage = async () => {
  const teams = await teamsGetAll();

  return (
    <>
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
    </>
  );
};

export default TeamsPage;
