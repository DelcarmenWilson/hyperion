"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { useGlobalContext } from "@/providers/global";
import { useCurrentUser } from "@/hooks/use-current-user";

import { UserLicense } from "@prisma/client";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LicenseForm } from "./form";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { LicenseList } from "./list";

export const LicenseClient = () => {
  const user = useCurrentUser();
  const { licenses, setLicenses } = useGlobalContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="Add License"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
      showButton={user?.role != "ASSISTANT"}
    />
  );

  useEffect(() => {
    const onLicenseDeleted = (id: string) => {
      setLicenses((licenses) => {
        if (!licenses) return licenses;
        return licenses.filter((e) => e.id !== id);
      });
    };
    const onLicenseInserted = (newLicense: UserLicense) => {
      const existing = licenses?.find((e) => e.id == newLicense.id);
      if (existing == undefined)
        setLicenses((licenses) => [...licenses!, newLicense]);
    };

    const onLicenseUpdated = (updatedLicense: UserLicense) => {
      setLicenses((licenses) => {
        if (!licenses) return licenses;
        return licenses.map((license) => {
          if (license.id == updatedLicense.id) {
            license = updatedLicense;
          }
          return license;
        });
      });
    };
    userEmitter.on("licenseDeleted", (id) => onLicenseDeleted(id));
    userEmitter.on("licenseInserted", (info) => onLicenseInserted(info));
    userEmitter.on("licenseUpdated", (info) => onLicenseUpdated(info));
    // eslint-disable-next-line
  }, []);
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
        <DataTable
          columns={columns}
          data={licenses!}
          headers
          title="Licences"
          topMenu={topMenu}
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Licenses</h4>
            {topMenu}
          </div>
          <LicenseList licenses={licenses!} />
        </>
      )}
    </>
  );
};
