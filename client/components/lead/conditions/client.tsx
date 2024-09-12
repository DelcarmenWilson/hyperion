"use client";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useLeadConditionActions } from "@/hooks/lead/use-condition";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { ConditionsList } from "./list";
import { ConditionForm } from "./form";
import { columns } from "./columns";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type ConditionsClientProp = {
  size?: string;
};

export const ConditionsClient = ({ size = "full" }: ConditionsClientProp) => {
  const user = useCurrentUser();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const { conditions, onConditionFormOpen, isFetchingConditions } =
    useLeadConditionActions();
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingConditions}>
      <ListGridTopMenu
        text="Add Condition"
        setIsDrawerOpen={onConditionFormOpen}
        isList={isList}
        setIsList={setIsList}
        size={size}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <ConditionForm />
      {isList ? (
        <SkeletonWrapper isLoading={isFetchingConditions}>
          <DataTable
            columns={columns}
            data={conditions || []}
            headers
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div
            className={cn(
              "flex justify-between items-center p-1",
              size == "sm" && "flex-col text-center"
            )}
          >
            <h4 className="text-2xl font-semibold">Medical Conditions</h4>
            {topMenu}
          </div>
          <SkeletonWrapper isLoading={isFetchingConditions}>
            <ConditionsList conditions={conditions || []} size={size} />
          </SkeletonWrapper>
        </>
      )}
    </>
  );
};
