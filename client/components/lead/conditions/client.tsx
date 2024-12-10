"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useLeadConditionStore } from "@/stores/lead-condition-store";
import { useLeadConditionData } from "@/hooks/lead/use-condition";

import { columns } from "./columns";
import { ConditionsList } from "./list";
import { ConditionForm } from "./form";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
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
