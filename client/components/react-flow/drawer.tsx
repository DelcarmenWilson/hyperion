"use client";
import React from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { useWorkFlow } from "@/hooks/use-workflow";
import { ActionList } from "./actions/list";
import { TriggerList } from "./triggers/list";
import { capitalize } from "@/formulas/text";
import { EdgeForm } from "./edge/form";

export const WorkFlowDrawer = () => {
  const { isDrawerOpen, onDrawerClose, type } = useWorkFlow();
  const title = capitalize(type as string).replace("list", "");
  return (
    <DrawerRight
      title={`Workflow ${title}s`}
      isOpen={isDrawerOpen}
      onClose={onDrawerClose}
      scroll={false}
      closeButton="simple"
      autoClose
    >
      <div className="flex flex-1 border-t h-full overflow-hidden">
        {type == "actionlist" && <ActionList />}
        {type == "triggerlist" && <TriggerList />}
        {type == "edge" && <EdgeForm />}
      </div>
    </DrawerRight>
  );
};
