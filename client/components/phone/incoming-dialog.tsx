import React, { useState } from "react";
import { usePhoneStore } from "@/hooks/use-phone";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Phone, PhoneIncoming, PhoneOff } from "lucide-react";

const IncomingDialog = () => {
  const { isIncomingCallOpen, onIncomingCallClose } = usePhoneStore();

  return (
    <div
      className={cn(
        "absolute -bottom-full w-full border bg-primary border-black-100 text-background transition-bottom duration-500 p-2 ease-in-out",
        isIncomingCallOpen && "bottom-0"
      )}
    >
      <p className="font-bold" >Incoming Call</p>
      <p>Call From: Phone Number (Lead Name) </p>

      <Button variant="gradientDark" className="gap-2 mr-2">
        <PhoneIncoming size={16} /> Answer
      </Button>

      <Button
        className="gap-2"
        variant="destructive"
        onClick={onIncomingCallClose}
      >
        <PhoneOff size={16} /> Decline
      </Button>
    </div>
  );
};

export default IncomingDialog;
