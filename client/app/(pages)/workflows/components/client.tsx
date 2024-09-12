"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useWorkFlowData } from "@/hooks/use-workflow";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer-right";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { WorkflowForm } from "./form";
import { WorkflowList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const WorkFlowClient = () => {
  const user = useCurrentUser();
  const { onGetWorkflowByUserId } = useWorkFlowData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const { data: workflows, isFetching } = onGetWorkflowByUserId();
  const topMenu = (
    <ListGridTopMenu
      text="Add WorkFlow"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
      showButton={user?.role != "ASSISTANT"}
    />
  );

  return (
    <>
      <DrawerRight
        title={"New WorkFlow"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <WorkflowForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      {isList ? (
        <SkeletonWrapper isLoading={isFetching}>
          <DataTable
            columns={columns}
            data={workflows || []}
            headers
            title=""
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">WorkFlows</h4>
            {topMenu}
          </div>
          <WorkflowList workflows={workflows || []} isLoading={isFetching} />
        </>
      )}
    </>
  );
};
