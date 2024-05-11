"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { useGlobalContext } from "@/providers/global";
import { useCurrentRole } from "@/hooks/user-current-role";

import { UserLicense } from "@prisma/client";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LicenseForm } from "./form";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { LicenseList } from "./list";

export const LicenseClient = () => {
  const { licenses, setLicenses } = useGlobalContext();
  const role = useCurrentRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);

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
        return licenses
          .filter((e) => e.id != updatedLicense.id)
          .concat(updatedLicense);
      });
    };
    userEmitter.on("licenseDeleted", (id) => onLicenseDeleted(id));
    userEmitter.on("licenseInserted", (info) => onLicenseInserted(info));
    userEmitter.on("licenseUpdated", (info) => onLicenseUpdated(info));
    return () => {
      userEmitter.on("licenseDeleted", (id) => onLicenseDeleted(id));
      userEmitter.on("licenseInserted", (info) => onLicenseInserted(info));
      userEmitter.on("licenseUpdated", (info) => onLicenseUpdated(info));
    };
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
          topMenu={
            <ListGridTopMenu
              text="Add License"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={setIsDrawerOpen}
              showButton={role != "ASSISTANT"}
            />
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Licenses</h4>
            <ListGridTopMenu
              text="Add License"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
              showButton={role != "ASSISTANT"}
            />
          </div>
          <LicenseList licenses={licenses!} />
        </>
      )}
    </>
  );
};
