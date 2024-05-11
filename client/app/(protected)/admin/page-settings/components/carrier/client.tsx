"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
import { Carrier } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { CarrierForm } from "./form";
import { columns } from "./columns";

type CarrierClientProps = {
  initCarriers: Carrier[];
};

export const CarrierClient = ({ initCarriers }: CarrierClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [carriers, setCarriers] = useState(initCarriers);
  const onCarrierCreated = (e?: Carrier) => {
    if (e) {
      setCarriers((carriers) => {
        return [...carriers, e];
      });
    }
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title={"New Carrier"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CarrierForm onClose={onCarrierCreated} />
      </DrawerRight>
      <Heading
        title="Carriers"
        description="Manage all carriers for your organization"
      />
      <DataTable
        columns={columns}
        data={carriers}
        headers
        topMenu={
          <div className="col-span-3 text-end">
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus size={16} className="mr-2" /> New Carrier
            </Button>
          </div>
        }
      />
    </>
  );
};
