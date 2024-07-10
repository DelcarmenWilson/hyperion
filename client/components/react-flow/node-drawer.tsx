"use client";
import React from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { useWorkFlow } from "@/hooks/use-workflow";
import { BirthdayForm } from "./triggers/forms/birthday";

export const NodeDrawer = () => {
  const { node, isNodeDrawerOpen, onNodeDrawerClose } = useWorkFlow();
  if (!node) return null;
  const title = node.data.name;
  const type = node.data.name;
  return (
    <DrawerRight
      title={title}
      isOpen={isNodeDrawerOpen}
      onClose={onNodeDrawerClose}
      scroll={false}
      closeButton="simple"
      autoClose
    >
      <div className="flex flex-1 border-t h-full overflow-hidden">
        {/* {type == "birthdayreminder" && ( */}
        <BirthdayForm node={node} onClose={onNodeDrawerClose} />
        {/* )} */}
      </div>
    </DrawerRight>
  );
};
