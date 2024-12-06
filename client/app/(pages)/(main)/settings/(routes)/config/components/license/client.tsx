"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useAgentLicenseData } from "../../hooks/use-license";

import { columns } from "./columns";
import { DataTable } from "@/components/tables/data-table";
import LicenseDrawer from "./drawer";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import LicenseList from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const LicenseClient = () => {
  const user = useCurrentUser();
  const { onGetLicences } = useAgentLicenseData();
  const { licenses, licensesFetching } = onGetLicences();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={licensesFetching}>
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
      <LicenseDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {isList ? (
        <SkeletonWrapper isLoading={licensesFetching}>
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
