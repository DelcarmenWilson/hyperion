"use client";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import { Connection, Device } from "twilio-client";

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
  const user = useCurrentUser();
  // PHONE VARIABLES
  const [device, setDevice] = useState<Device>();
  const [inCommingCall, setInComingCall] = useState<Connection>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);

  async function startupClient() {
    if (!user?.phoneNumbers.length) {
      console.log("no phone number have been set up");
      return null;
    }

    try {
      const response = await axios.post("/api/token", { identity: user?.id });
      const data = response.data;
      intitializeDevice(data.token);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  function intitializeDevice(token: string) {
    const device = new Device(token, {
      logLevel: 1,
    });
    addDeviceListeners(device);
    setDevice(device);
  }

  function addDeviceListeners(device: Device) {
    device.on("ready", function () {});

    device.on("error", function (error: any) {});

    device.on("incoming", function (call: Connection) {
      usePm.onOpen();
      setInComingCall(call);
    });
  }

  const onIncomingCallDisconnect = () => {
    inCommingCall?.disconnect();
    setInComingCall(undefined);
    setIsCallAccepted(false);
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
    startupClient();
  }, []);

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
                          561-899-8575
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Leads name: Wilson Del Carmen</span>{" "}
                      <span className="text-primary font-bold">30</span>
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
