"use client";
import { useState } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";

import { WorkFlow } from "@prisma/client";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer-right";
import { WorkFlowForm } from "./form";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { WorkFlowList } from "./list";
import { useQuery } from "@tanstack/react-query";
import { workFlowsGetAllByUserId } from "@/actions/workflow";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const WorkFlowClient = () => {
  const user = useCurrentUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const { data: workflows, isFetching } = useQuery<WorkFlow[]>({
    queryKey: ["agentWorkFlows"],
    queryFn: () => workFlowsGetAllByUserId(),
  });
  const topMenu = (
    <ListGridTopMenu
      text="Add WorkFlow"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={setIsDrawerOpen}
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
        <WorkFlowForm onClose={() => setIsDrawerOpen(false)} />
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
          <WorkFlowList workflows={workflows || []} isLoading={isFetching} />
        </>
      )}
    </>
  );
};
