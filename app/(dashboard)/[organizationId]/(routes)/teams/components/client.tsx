"use client";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TeamColumn, columns } from "./columns";
import { DataTable } from "@/components/custom/data-table";
import { ApiList } from "@/components/custom/api-list";

interface TeamClientProps {
  data: TeamColumn[];
}
export const TeamClient = ({ data }: TeamClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Teams (${data.length})`}
          description="Manage teams for your organization"
        />
        <Button
          onClick={() => router.push(`/${params.organizationId}/teams/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for Teams" />
      <Separator />
      <ApiList entityName="teams" entityIdName="teamId" />
    </>
  );
};
