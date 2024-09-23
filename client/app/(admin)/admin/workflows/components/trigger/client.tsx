"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { DataTable } from "@/components/tables/data-table";
import { DrawerRight } from "@/components/custom/drawer-right";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { columns } from "./columns";
import { TriggerForm } from "./form";
import { TriggerList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useWorkFlowDefaultData } from "@/hooks/workflow/use-workflow";

export const TriggersClient = () => {
  const user = useCurrentUser();

  const { onGetWorkflowDefaultNodesByType } = useWorkFlowDefaultData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");

  const { data, isFetching } = onGetWorkflowDefaultNodesByType("trigger");
  const topMenu = (
    <ListGridTopMenu
      text="Add Trigger"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
      showButton={user?.role != "ASSISTANT"}
    />
  );

  return (
    <>
      <DrawerRight
        title={"New Trigger"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <TriggerForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      {isList ? (
        <SkeletonWrapper isLoading={isFetching}>
          <DataTable
            columns={columns}
            data={data || []}
            headers
            title=""
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Triggers</h4>
            {topMenu}
          </div>
          <TriggerList triggers={data || []} isLoading={isFetching} />
        </>
      )}
    </>
  );
};
