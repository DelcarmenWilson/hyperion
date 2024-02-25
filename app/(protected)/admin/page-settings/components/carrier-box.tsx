"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/custom/data-table";
import { Heading } from "@/components/custom/heading";
import { Carrier } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CarrierForm } from "./carrier-form";
import { columns } from "./columns";
type CarrierBoxProps = {
  initCarriers: Carrier[];
};
export const CarrierBox = ({ initCarriers }: CarrierBoxProps) => {
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
      <div className="flex justify-between items-end">
        <Heading
          title="Carriers"
          description="Manage all carriers for your organization"
        />
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Carrier
        </Button>
      </div>

      <DataTable columns={columns} data={carriers} searchKey="name" />
    </>
  );
};
