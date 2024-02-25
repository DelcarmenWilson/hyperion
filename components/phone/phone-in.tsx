import { useEffect, useState } from "react";
import {
  Phone,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOff,
  X,
} from "lucide-react";
import axios from "axios";
import { Connection } from "twilio-client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePhoneModal } from "@/hooks/use-phone-modal";

import { formatSecondsToTime } from "@/formulas/numbers";
import { usePhoneContext } from "@/providers/phone-provider";
import { PhoneAgents } from "@/constants/phone";

export const PhoneIn = () => {
  const { onPhoneInClose: onClose, onPhoneInOpen: onOpen } = usePhoneModal();
  const { phone } = usePhoneContext();
  const [agent, setAgent] = useState("");

  // PHONE VARIABLES
  const [call, setCall] = useState<Connection>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [fromNumber, setFromNumber] = useState("");
  const [fromName, setFromName] = useState("");
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const onDisconnect = () => {
    call?.disconnect();
    setCall(undefined);
    setIsCallAccepted(false);
    setFromName("");
    setFromNumber("");
    setRunning(false);
    setTime(0);
    onClose();
  };

  const onAccept = () => {
    call?.accept();
    setIsCallAccepted(true);
    setRunning(true);
  };

  const onReject = () => {
    call?.reject();
    setCall(undefined);
    setIsCallAccepted(false);
    onClose();
  };

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => {
        setTime((state) => state + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const addDeviceListeners = () => {
      if (!phone) return;
      phone.on("ready", function () {
        console.log("ready from phone in");
      });

      phone.on("error", function (error: any) {
        console.log(error);
      });

      phone.on("incoming", async function (call: Connection) {
        call.on("disconnect", function (error: any) {
          onDisconnect();
        });
        call.on("cancel", function (error: any) {
          onDisconnect();
        });
        const response = await axios.post("/api/leads/details", {
          phone: call.parameters.From,
        });

        const data = response.data;
        const fullName = data.firstName
          ? `${data.firstName} ${data.lastName}`
          : "Unknown Caller";
        setFromName(fullName);
        setFromNumber(data.cellPhone || call.parameters.From);

        onOpen();
        setCall(call);
      });
    };
    return () => addDeviceListeners();
  }, [phone, onDisconnect, onOpen]);
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <PhoneIncoming className="w-4 h-4" />
        <span>
          Incoming call from{" "}
          <span className="text-primary font-bold italic">{fromNumber}</span>
        </span>
      </div>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>Lead name: {fromName}</span>
        <span className="text-primary font-bold">
          {formatSecondsToTime(time)}
        </span>
      </div>
      {!isCallAccepted ? (
        <div className="flex flex-col gap-2">
          <Button
            className="flex justify-center items-center gap-2"
            onClick={onAccept}
          >
            <Phone className="w-4 h-4" /> Answer
          </Button>

          <Button
            variant="destructive"
            className="flex justify-center items-center gap-2"
            onClick={onReject}
          >
            <PhoneOff className="w-4 h-4" /> Reject
          </Button>
        </div>
      ) : (
        <Button
          variant="destructive"
          className="flex justify-center items-center gap-2"
          onClick={onDisconnect}
        >
          <PhoneOff className="w-4 h-4" /> Hang Up
        </Button>
      )}

      <Select name="ddlState" onValueChange={(e) => setAgent(e)}>
        <SelectTrigger>
          <SelectValue placeholder="Forward to agent" />
        </SelectTrigger>
        <SelectContent>
          {PhoneAgents.map((agent) => (
            <SelectItem key={agent.title} value={agent.text}>
              {agent.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="secondary"
        disabled={!agent}
        className="flex justify-center items-center gap-2"
      >
        <PhoneForwarded className="w-4 h-4" /> Forward Call
      </Button>
    </>
  );
};
