"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useAgentCarrierData } from "../../hooks/use-carrier";

import { columns } from "./columns";
import CarrierDrawer from "./drawer";
import CarrierList from "./list";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const CarrierClient = () => {
  const user = useCurrentUser();
  const { carriers, isFetchingCarriers } = useAgentCarrierData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingCarriers}>
      <ListGridTopMenu
        text="Add Carrier"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={() => setIsDrawerOpen(true)}
        showButton={user?.role != "ASSISTANT"}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <CarrierDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {isList ? (
        <SkeletonWrapper isLoading={isFetchingCarriers}>
          <DataTable
            columns={columns}
            data={carriers || []}
            headers
            title="Carrier"
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Carriers</h4>
            {topMenu}
          </div>
          <CarrierList />
        </>
      )}
    </>
  );
};
