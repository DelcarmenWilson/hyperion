"use client";
import { useCurrentRole } from "@/hooks/user/use-current";
import { useBluePrintActions, useBluePrintData } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { columns } from "./columns";
import { ALLADMINS } from "@/constants/user";

export const BluePrintWeeklyClient = () => {
  const role = useCurrentRole();
  const { onGetBluePrintsWeekly } = useBluePrintData();
  const { onCalculateBlueprintTargets } = useBluePrintActions(() => {});
  const { bluePrintsWeekly, bluePrintsWeeklyFetching } =
    onGetBluePrintsWeekly();

  return (
    <SkeletonWrapper isLoading={bluePrintsWeeklyFetching}>
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
            {ALLADMINS.includes(role!) && (
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
