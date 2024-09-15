"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAgentLeadStatusData } from "../../hooks/use-lead-status";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { DrawerRight } from "@/components/custom/drawer-right";
import { columns } from "./columns";
import { LeadStatusForm } from "./form";
import { LeadStatusList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const LeadStatusClient = () => {
  const user = useCurrentUser();
  const { leadStatuses, isFetchingLeadStatuses } = useAgentLeadStatusData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingLeadStatuses}>
      <ListGridTopMenu
        text="Add Status"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={() => setIsDrawerOpen(true)}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <DrawerRight
        title={"New Lead Status"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <LeadStatusForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>

      {isList ? (
        <SkeletonWrapper isLoading={isFetchingLeadStatuses}>
          <DataTable
            columns={columns}
            data={leadStatuses?.filter((e) => e.type != "default")!}
            headers
            title="Lead Status"
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Lead Status</h4>
            {topMenu}
          </div>
          <LeadStatusList />
        </>
      )}
    </>
  );
};
