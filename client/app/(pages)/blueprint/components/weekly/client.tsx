"use client";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useBluePrintActions, useBluePrintData } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";
import { allAdmins } from "@/constants/page-routes";

export const BluePrintWeeklyClient = () => {
  const role = useCurrentRole();
  const { bluePrintsWeekly, isFetchingBluePrintsWeekly } = useBluePrintData();
  const { onCalculateBlueprintTargets } = useBluePrintActions();

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
            {allAdmins.includes(role!) && (
              <Button onClick={onCalculateBlueprintTargets}>
                Create Next Week
              </Button>
            )}
          </div>
        }
      />
    </SkeletonWrapper>
  );
};
