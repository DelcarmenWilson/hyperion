import React, { useEffect } from "react";

import { PhoneIncoming, PhoneOff } from "lucide-react";
import { Call } from "@twilio/voice-sdk";
import { cn } from "@/lib/utils";

import { usePhoneContext } from "@/providers/phone";
import {
  useIncomingCallData,
  usePhoneData,
  usePhoneStore,
} from "@/hooks/use-phone";

import { Button } from "../ui/button";

const IncomingDialog = () => {
  const { phone } = usePhoneContext();
  const { onDisconnect, onIncomingCallAccept, onIncomingCallReject } =
    usePhoneData(phone);
  const { isIncomingCallOpen, onIncomingCallClose, onIncomingCallOpen } =
    usePhoneStore();
  const { from } = useIncomingCallData();

  return (
    <div
      className={cn(
        "absolute -bottom-full w-full border bg-primary border-black-100 text-background transition-bottom duration-500 p-2 ease-in-out",
        isIncomingCallOpen && "bottom-0"
      )}
    >
      <p className="font-bold">Incoming Call</p>
      <p>
        Call From: {from.number} {from.name}
      </p>

      <Button
        variant="gradientDark"
        className="gap-2 mr-2"
        onClick={onIncomingCallAccept}
      >
        <PhoneIncoming size={16} /> Answer
      </Button>

      <Button
        className="gap-2"
        variant="destructive"
        onClick={() => {
          onIncomingCallReject();
          onIncomingCallClose();
        }}
      >
        <PhoneOff size={16} /> Decline
      </Button>
    </div>
  );
};

export default IncomingDialog;
