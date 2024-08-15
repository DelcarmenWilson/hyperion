"use client";
import { useBluePrintActions } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";

export const BluePrintWeeklyClient = () => {
  const {
    bluePrintsWeekly,
    isFetchingBluePrintsWeekly,
    onCalculateBlueprintTargets,
  } = useBluePrintActions();

  return (
    <SkeletonWrapper isLoading={isFetchingBluePrintsWeekly}>
      <DataTable
        columns={columns}
        data={bluePrintsWeekly || []}
        striped
        headers
        placeHolder="Search"
        paginationType="simple"
        //todo remove button
        topMenu={
          <div className=" col-span-3 flex justify-end gap-2">
            <Button onClick={onCalculateBlueprintTargets}>
              Create Next Week
            </Button>
          </div>
        }
      />
    </SkeletonWrapper>
  );
};
