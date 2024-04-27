"use client";
import { useState } from "react";

import { Carrier } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { CarrierForm } from "./form";
import { FullUserCarrier } from "@/types";
import { useGlobalContext } from "@/providers/global";
import { useCurrentRole } from "@/hooks/user-current-role";

type CarrierClientProps = {
  adminCarriers: Carrier[];
};

export const CarrierClient = ({ adminCarriers }: CarrierClientProps) => {
  const { carriers, setCarriers } = useGlobalContext();
  const role = useCurrentRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onCarrierCreated = (newCarrier?: FullUserCarrier) => {
    if (newCarrier) setCarriers((cr) => [...cr!, newCarrier]);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <DrawerRight
        title={"New Carrier"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CarrierForm carriers={adminCarriers} onClose={onCarrierCreated} />
      </DrawerRight>

      <Heading
        title={"Carrier"}
        description="Manage all your appointed carriers"
      />

      <DataTable
        columns={columns}
        data={carriers!}
        headers
        topMenu={
          <div className="col-span-3 text-end">
            {role != "ASSISTANT" && (
              <Button onClick={() => setIsDrawerOpen(true)}>
                <Plus size={16} className="mr-2" /> New Carrier
              </Button>
            )}
          </div>
        }
      />
    </>
  );
};
