"use client";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { cn } from "@/lib/utils";
import {
  useLeadConditionActions,
  useLeadConditionData,
  useLeadConditionStore,
} from "@/hooks/lead/use-condition";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { ConditionsList } from "./list";
import { ConditionForm } from "./form";
import { columns } from "./columns";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type ConditionsClientProp = {
  leadId: string;
  size?: string;
};

export const ConditionsClient = ({
  leadId,
  size = "full",
}: ConditionsClientProp) => {
  const user = useCurrentUser();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const { onConditionFormOpen } = useLeadConditionStore();

  const { onGetLeadConditions } = useLeadConditionData(leadId);
  const { conditions, conditionsFetching } = onGetLeadConditions();

  const topMenu = (
    <SkeletonWrapper isLoading={conditionsFetching}>
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
        <SkeletonWrapper isLoading={conditionsFetching}>
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
          <SkeletonWrapper isLoading={conditionsFetching}>
            <ConditionsList conditions={conditions || []} size={size} />
          </SkeletonWrapper>
        </>
      )}
    </>
  );
};
