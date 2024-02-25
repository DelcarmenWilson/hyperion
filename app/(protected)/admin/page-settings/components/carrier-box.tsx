import { DrawerRight } from "@/components/custom/drawer-right";
import React, { useState } from "react";
import { CarrierForm } from "./carrier-form";

export const CarrierBox = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  return (
    <>
      <DrawerRight
        title={"New Carrier"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CarrierForm />
      </DrawerRight>
    </>
  );
};
