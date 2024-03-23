"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

import { UserLicense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LicenseForm } from "./form";

type LicenseClientProps = {
  initLicenses: UserLicense[];
  role: string;
};

export const LicenseClient = ({ initLicenses, role }: LicenseClientProps) => {
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
      <Heading title={"Licences"} description="Manage all your licenses" />
      <DataTable
        columns={columns}
        data={licenses!}
        headers
        topMenu={
          <div className="col-span-3 text-end">
            {role != "ASSISTANT" && (
              <Button onClick={() => setIsDrawerOpen(true)}>
                <Plus size={16} className="mr-2" /> New License
              </Button>
            )}
          </div>
        }
      />
    </>
  );
};
