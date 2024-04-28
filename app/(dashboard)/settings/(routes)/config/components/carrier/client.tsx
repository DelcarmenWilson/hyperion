"use client";
import { useEffect, useState } from "react";
import { emitter } from "@/lib/event-emmiter";
import { useGlobalContext } from "@/providers/global";
import { useCurrentRole } from "@/hooks/user-current-role";
import { FullUserCarrier } from "@/types";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { CarrierForm } from "./form";
import { CarrierList } from "./list";

export const CarrierClient = () => {
  const { carriers, setCarriers } = useGlobalContext();
  const role = useCurrentRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);

  useEffect(() => {
    const onCarrierDeleted = (id: string) => {
      setCarriers((carriers) => {
        if (!carriers) return carriers;
        return carriers.filter((e) => e.id !== id);
      });
    };
    const onCarrierInserted = (newCarrier: FullUserCarrier) => {
      const existing = carriers?.find((e) => e.id == newCarrier.id);
      if (existing == undefined)
        setCarriers((carriers) => [...carriers!, newCarrier]);
    };

    const onCarrierUpdated = (updatedCarrier: FullUserCarrier) => {
      setCarriers((carriers) => {
        if (!carriers) return carriers;
        return carriers
          .filter((e) => e.id != updatedCarrier.id)
          .concat(updatedCarrier);
      });
    };
    emitter.on("carrierDeleted", (id) => onCarrierDeleted(id));
    emitter.on("carrierInserted", (info) => onCarrierInserted(info));
    emitter.on("carrierUpdated", (info) => onCarrierUpdated(info));
    return () => {
      emitter.on("carrierDeleted", (id) => onCarrierDeleted(id));
      emitter.on("carrierInserted", (info) => onCarrierInserted(info));
      emitter.on("carrierUpdated", (info) => onCarrierUpdated(info));
    };
  }, []);

  return (
    <>
      <DrawerRight
        title={"New Carrier"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CarrierForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      {isList ? (
        <DataTable
          columns={columns}
          data={carriers!}
          headers
          title="Carrier"
          topMenu={
            <ListGridTopMenu
              text="Add Carrier"
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
            <h4 className="text-2xl font-semibold">Carriers</h4>
            <ListGridTopMenu
              text="Add Carrier"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
              showButton={role != "ASSISTANT"}
            />
          </div>
          <CarrierList carriers={carriers!} />
        </>
      )}
    </>
  );
};
