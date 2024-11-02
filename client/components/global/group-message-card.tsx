"use client";
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGroupMessageStore } from "@/hooks/use-group-message";

import { Button } from "../ui/button";

export const GroupMessageCard = () => {
  const { isOpen, onClose, message, userName } = useGroupMessageStore();
  return (
    <div
      className={cn(
        "fixed transition-[bottom] -bottom-full ease-in-out duration-500 w-full z-[100] pl-4",
        isOpen && "bottom-0"
      )}
    >
      <div className="flex flex-col bg-background  border border-primary w-full lg:w-[25%] gap-2 p-2 rounded-tr-sm rounded-tl-sm ">
        <div className="flex justify-between items-center">
          <span>Group Message</span>
          <Button variant="simple" size="icon" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="flex-1 max-h-[100px] overflow-y-auto text-sm">
          {message}
        </div>
        <h4 className="text-end italic">From: {userName} (ADMIN)</h4>
      </div>
    </div>
  );
};
