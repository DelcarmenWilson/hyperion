"use client";
import React from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { TriggerList } from "./list";
import { useWorkFlow } from "@/hooks/use-workflow";

export const TriggerDrawer = () => {
  const { isTriggerOpen, onTriggerClose } = useWorkFlow();
  return (
    <DrawerRight
      title="Workflow Triggers"
      isOpen={isTriggerOpen}
      onClose={onTriggerClose}
      scroll={false}
    >
      <div className="flex flex-1 border-t h-full overflow-hidden">
        <TriggerList />
      </div>
    </DrawerRight>
  );
};
