"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAgentCarrierData } from "../../hooks/use-carrier";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { CarrierForm } from "./form";
import { CarrierList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const CarrierClient = () => {
  const user = useCurrentUser();
  const { carriers, isFetchingCarriers } = useAgentCarrierData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingCarriers}>
      <ListGridTopMenu
        text="Add Carrier"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={() => setIsDrawerOpen(true)}
        showButton={user?.role != "ASSISTANT"}
      />
    </SkeletonWrapper>
  );

  // useEffect(() => {
  //   const onCarrierDeleted = (id: string) => {
  //     setCarriers((carriers) => {
  //       if (!carriers) return carriers;
  //       return carriers.filter((e) => e.id !== id);
  //     });
  //   };
  //   const onCarrierInserted = (newCarrier: FullUserCarrier) => {
  //     const existing = carriers?.find((e) => e.id == newCarrier.id);
  //     if (existing == undefined)
  //       setCarriers((carriers) => [...carriers!, newCarrier]);
  //   };

  //   const onCarrierUpdated = (updatedCarrier: FullUserCarrier) => {
  //     setCarriers((carriers) => {
  //       if (!carriers) return carriers;
  //       return carriers
  //         .filter((e) => e.id != updatedCarrier.id)
  //         .concat(updatedCarrier);
  //     });
  //   };
  //   userEmitter.on("carrierDeleted", (id) => onCarrierDeleted(id));
  //   userEmitter.on("carrierInserted", (info) => onCarrierInserted(info));
  //   userEmitter.on("carrierUpdated", (info) => onCarrierUpdated(info));
  //   return () => {
  //     userEmitter.on("carrierDeleted", (id) => onCarrierDeleted(id));
  //     userEmitter.on("carrierInserted", (info) => onCarrierInserted(info));
  //     userEmitter.on("carrierUpdated", (info) => onCarrierUpdated(info));
  //   };

  //   // eslint-disable-next-line
  // }, []);

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
        <SkeletonWrapper isLoading={isFetchingCarriers}>
          <DataTable
            columns={columns}
            data={carriers!}
            headers
            title="Carrier"
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Carriers</h4>
            {topMenu}
          </div>
          <CarrierList />
        </>
      )}
    </>
  );
};
