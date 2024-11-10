"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { useCurrentUser } from "@/hooks/user/use-current";
import { useAgentLicenseData } from "../../hooks/use-license";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer/right";
import { LicenseForm } from "./form";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { LicenseList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const LicenseClient = () => {
  const user = useCurrentUser();
  const { licenses, isFetchingLicenses } = useAgentLicenseData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingLicenses}>
      <ListGridTopMenu
        text="Add License"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={() => setIsDrawerOpen(true)}
        showButton={user?.role != "ASSISTANT"}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <DrawerRight
        title={"New License"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <LicenseForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      {isList ? (
        <SkeletonWrapper isLoading={isFetchingLicenses}>
          <DataTable
            columns={columns}
            data={licenses || []}
            headers
            title="Licences"
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Licenses</h4>
            {topMenu}
          </div>
          <LicenseList />
        </>
      )}
    </>
  );
};
