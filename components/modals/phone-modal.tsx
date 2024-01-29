"use client";
// import { device } from "@/lib/device";
import { Fragment, useEffect, useState } from "react";
import {
  Phone,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOff,
  X,
} from "lucide-react";

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
import { Connection } from "twilio-client";
import axios from "axios";
import { device } from "@/lib/device";

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

export const PhoneModal = () => {
  const usePm = usePhoneModal();
  const [agent, setAgent] = useState("");

  // PHONE VARIABLES
  const [inCommingCall, setInComingCall] = useState<Connection>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [fromNumber, setFromNumber] = useState("");
  const [fromName, setFromName] = useState("");

  function addDeviceListeners() {
    if (!device) return;
    device.on("ready", function () {
      console.log("ready");
    });

    device.on("error", function (error: any) {
      console.log(error);
    });

    device.on("incoming", async function (call: Connection) {
      call.on("disconnect", function (error: any) {
        onIncomingCallDisconnect();
      });
      call.on("cancel", function (error: any) {
        onIncomingCallDisconnect();
      });
      const response = await axios.post("/api/leads/details", {
        phone: call.parameters.from,
      });

      const data = response.data;
      const fullName = `${data?.firstName} ${data?.lastName}`;
      setFromName(fullName);
      setFromNumber(data.cellPhone);

      usePm.onOpen();
      setInComingCall(call);
    });
  }

  const onIncomingCallDisconnect = () => {
    inCommingCall?.disconnect();
    setInComingCall(undefined);
    setIsCallAccepted(false);
    setFromName("");
    setFromNumber("");
    usePm.onClose();
  };

  const onIncomingCallAccept = () => {
    inCommingCall?.accept();
    setIsCallAccepted(true);
  };

  const onIncomingCallReject = () => {
    inCommingCall?.reject();
    setInComingCall(undefined);
    setIsCallAccepted(false);
    usePm.onClose();
  };

  useEffect(() => {
    addDeviceListeners();
  });

  return (
    <Transition.Root show={usePm.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={usePm.onClose}>
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
                      <span>Leads name: {fromName}</span>
                      {/* <span className="text-primary font-bold">30</span> */}
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
