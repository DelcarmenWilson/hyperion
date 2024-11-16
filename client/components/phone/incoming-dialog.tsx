import React, { useState } from "react";
import { usePhoneStore } from "@/hooks/use-phone";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Phone } from "lucide-react";

const IncomingDialog = () => {
  const { isIncomingCallOpen, onIncomingCallClose } = usePhoneStore();

  return (
    <div
      className={cn(
        "absolute -bottom-full w-full border bg-primary text-white h-[100px] transition-bottom duration-500 ease-in-out",
        isIncomingCallOpen && "bottom-0"
      )}
    >
      <p>Incoming Call</p>
      <p>Wilson Del Carmen TODO: Leads Name</p>

      <Button variant="gradientDark" className="gap-2">
        <Phone size={16} /> Call
      </Button>

      <Button
        className="gap-2"
        variant="destructive"
        onClick={onIncomingCallClose}
      >
        <Phone size={16} /> Hang up
      </Button>
    </div>
  );
};

export default IncomingDialog;
