"use client";
import React from "react";

import { useEditorStore } from "@/hooks/workflow/use-editor";

import { DrawerRight } from "@/components/custom/drawer-right";
import { ActionList } from "./actions/list";
import { TriggerList } from "./triggers/list";
import { EdgeForm } from "./edge/form";
import { NodeForm } from "./node/form";

import { capitalize } from "@/formulas/text";

export const WorkFlowDrawer = () => {
  const { isDrawerOpen, onDrawerClose, type } = useEditorStore();
  const title = type ? capitalize(type).replace("list", "") : "";
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
        {type == "node" && <NodeForm />}
      </div>
    </DrawerRight>
  );
};
