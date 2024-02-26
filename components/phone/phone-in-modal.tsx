"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Phone,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOff,
  X,
} from "lucide-react";
import axios from "axios";
import { Connection } from "twilio-client";

import { Dialog, Transition } from "@headlessui/react";
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

export const PhoneInModal = () => {
  const { isPhoneInOpen, onPhoneInClose, onPhoneInOpen } = usePhoneModal();
  const { phone } = usePhoneContext();
  const [agent, setAgent] = useState("");

  // PHONE VARIABLES
  const [call, setInComingCall] = useState<Connection>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [fromNumber, setFromNumber] = useState("");
  const [fromName, setFromName] = useState("");
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  function addDeviceListeners() {
    if (!phone) return;
    phone.on("ready", function () {
      console.log("ready");
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

      onPhoneInOpen();
      setInComingCall(call);
    });
  }

  const onIncomingCallDisconnect = () => {
    call?.disconnect();
    setInComingCall(undefined);
    setIsCallAccepted(false);
    setFromName("");
    setFromNumber("");
    setRunning(false);
    setTime(0);
    onPhoneInClose();
  };

  const onIncomingCallAccept = () => {
    call?.accept();
    setIsCallAccepted(true);
    setRunning(true);
  };

  const onIncomingCallReject = () => {
    call?.reject();
    setInComingCall(undefined);
    setIsCallAccepted(false);
    onPhoneInClose();
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
    addDeviceListeners();
  }, []);
  return (
    <Transition.Root show={isPhoneInOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onPhoneInClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden pointer-events-none ">
          <div className="flex justify-center items-center w-full h-full overflow-hidden pointer-events-none ">
            <div className="pointer-events-none">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="pointer-events-auto w-[400px] ">
                  <div className="flex flex-col gap-2 overflow-y-auto bg-white p-2 shadow-xl rounded-md text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <PhoneIncoming className="w-4 h-4" />
                      <span>
                        Incoming call from{" "}
                        <span className="text-primary font-bold italic">
                          {fromNumber}
                        </span>
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
// "use client";
// import { usePhoneModal } from "@/hooks/use-phone-modal";
// import { DialogHp } from "../custom/dialog-hp";
// import { PhoneIn } from "./phone-in";

// export const PhoneInModal = () => {
//   const { isPhoneInOpen } = usePhoneModal();
//   return (
//     <DialogHp isOpen={isPhoneInOpen}>
//       <PhoneIn />
//     </DialogHp>
//   );
// };
