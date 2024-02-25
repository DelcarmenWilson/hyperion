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

type AgentType = {
  name: string;
  phone: string;
};

const agents: AgentType[] = [
  {
    name: "Wilson",
    phone: "6589584123",
  },
  {
    name: "Victoria",
    phone: "7873096122",
  },
  {
    name: "Saundra",
    phone: "3652548894",
  },
  {
    name: "Johnni",
    phone: "2547845615",
  },
];

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
        onIncomingCallDisconnect();
      });
      call.on("cancel", function (error: any) {
        onIncomingCallDisconnect();
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

  const onIncomingCallDisconnect = () => {
    call?.disconnect();
    setCall(undefined);
    setIsCallAccepted(false);
    setFromName("");
    setFromNumber("");
    setRunning(false);
    setTime(0);
    onClose();
  };

  const onIncomingCallAccept = () => {
    call?.accept();
    setIsCallAccepted(true);
    setRunning(true);
  };

  const onIncomingCallReject = () => {
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
    return () => addDeviceListeners();
  }, [phone, onDisconnect]);
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
            onClick={onIncomingCallAccept}
          >
            <Phone className="w-4 h-4" /> Answer
          </Button>

          <Button
            variant="destructive"
            className="flex justify-center items-center gap-2"
            onClick={onIncomingCallReject}
          >
            <PhoneOff className="w-4 h-4" /> Reject
          </Button>
        </div>
      ) : (
        <Button
          variant="destructive"
          className="flex justify-center items-center gap-2"
          onClick={onIncomingCallDisconnect}
        >
          <PhoneOff className="w-4 h-4" /> Hang Up
        </Button>
      )}

      <Select name="ddlState" onValueChange={(e) => setAgent(e)}>
        <SelectTrigger>
          <SelectValue placeholder="Forward to agent" />
        </SelectTrigger>
        <SelectContent>
          {agents.map((agent) => (
            <SelectItem key={agent.name} value={agent.phone}>
              {agent.name}
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
