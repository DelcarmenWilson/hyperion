"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useWorkflowDefaultData } from "@/hooks/workflow/use-workflow";

import { DataTable } from "@/components/tables/data-table";
import { DrawerRight } from "@/components/custom/drawer/right";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { columns } from "./columns";
import { ActionForm } from "./form";
import { ActionList } from "./list";

export const ActionsClient = () => {
  const user = useCurrentUser();
  const { onGetWorkflowDefaultNodesByType } = useWorkflowDefaultData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const { data, isFetching } = onGetWorkflowDefaultNodesByType("action");

  const topMenu = (
    <ListGridTopMenu
      text="Add Action"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
      showButton={user?.role != "ASSISTANT"}
    />
  );

  return (
    <>
      <DrawerRight
        title={"New Action"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <ActionForm onClose={() => setIsDrawerOpen(false)} />
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
            <h4 className="text-2xl font-semibold">Actions</h4>
            {topMenu}
          </div>
          <ActionList actions={data || []} isLoading={isFetching} />
        </>
      )}
    </>
  );
};
