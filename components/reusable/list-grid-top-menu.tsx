"use client";
import React from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type ListGridTopMenuProps = {
  text: string;
  isList: boolean;
  setIsList: (e: boolean) => void;
  setIsDrawerOpen: (e: boolean) => void;
};
export const ListGridTopMenu = ({
  text,
  isList,
  setIsList,
  setIsDrawerOpen,
}: ListGridTopMenuProps) => {
  return (
    <div className="flex gap-2 justify-end col-span-3 text-end">
      <Button
        variant={isList ? "ghost" : "default"}
        size="icon"
        onClick={() => setIsList(false)}
      >
        <LayoutGrid size={16} />
      </Button>
      <Button
        variant={isList ? "default" : "ghost"}
        size="icon"
        onClick={() => setIsList(true)}
      >
        <List size={16} />
      </Button>
      <Button className="gap-2" onClick={() => setIsDrawerOpen(true)}>
        <Plus size={16} /> {text}
      </Button>
    </div>
  );
};
