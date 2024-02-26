"use client";
import { useState } from "react";

import { UserLicense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";

import { DataTable } from "@/components/custom/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LicenseForm } from "./form";

type LicenseClientProps = {
  initLicenses: UserLicense[];
};

export const LicenseClient = ({ initLicenses }: LicenseClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [licenses, setLicenses] = useState(initLicenses);

  const onLicensesCreated = (e?: UserLicense) => {
    if (e) {
      setLicenses((licenses) => {
        return [...licenses, e];
      });
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      <DrawerRight
        title={"New License"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <LicenseForm onClose={onLicensesCreated} />
      </DrawerRight>
      <div className="flex items-center justify-between">
        <Heading title={"Licences"} description="Manage all your licenses" />
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New License
        </Button>
      </div>
      <DataTable columns={columns} data={licenses!} searchKey="licenseNumber" />
    </>
  );
};
