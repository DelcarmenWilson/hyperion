"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useWorkflowData } from "@/hooks/workflow/use-workflow";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer-right";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { WorkflowForm } from "./form";
import { WorkflowList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const WorkFlowClient = () => {
  const user = useCurrentUser();
  const { workflows, isFetchingWorkflows } = useWorkflowData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
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
      <WorkflowForm
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {isList ? (
        <SkeletonWrapper isLoading={isFetchingWorkflows}>
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
          <WorkflowList
            workflows={workflows || []}
            isLoading={isFetchingWorkflows}
          />
        </>
      )}
    </>
  );
};
