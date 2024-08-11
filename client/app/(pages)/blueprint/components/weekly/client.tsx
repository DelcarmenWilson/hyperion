"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { BluePrintWeek } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";
import {
  bluePrintWeeksGetAllByUserId,
  calculateBlueprintTargets,
} from "@/actions/blueprint/blueprint-week";

export const BluePrintWeeklyClient = () => {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery<BluePrintWeek[]>({
    queryFn: () => bluePrintWeeksGetAllByUserId(),
    queryKey: ["agentBluePrintsWeekly"],
  });
  const handleCreate = async () => {
    calculateBlueprintTargets();
    queryClient.invalidateQueries({ queryKey: ["agentBluePrintsWeekly"] });
  };
  return (
    <SkeletonWrapper isLoading={isFetching}>
      <DataTable
        columns={columns}
        data={data || []}
        striped
        headers
        placeHolder="Search"
        paginationType="simple"
        //todo remove button
        topMenu={<Button onClick={handleCreate}>Create Next Week</Button>}
      />
    </SkeletonWrapper>
  );
};
