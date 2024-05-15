"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

import { FullTermCarrier } from "@/types";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { TermCarrierForm } from "./form";

import { columns } from "./columns";

type TermClientProps = {
  initTermCarriers: FullTermCarrier[];
};

export const TermCarrierClient = ({ initTermCarriers }: TermClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [carriers, setCarriers] = useState(initTermCarriers);
  const onTermCarrierCreated = (e?: FullTermCarrier) => {
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
        title={"New Term Carrier"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <TermCarrierForm onClose={onTermCarrierCreated} />
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
              <Plus size={16} className="mr-2" /> New Term Carrier
            </Button>
          </div>
        }
      />
    </>
  );
};
