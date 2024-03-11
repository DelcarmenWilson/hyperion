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
import { cn } from "@/lib/utils";
import { PhoneLeadInfo } from "./addins/lead-info";

export const PhoneInModal = () => {
  const { isPhoneInOpen, onPhoneInClose, onPhoneInOpen, onSetLead, lead } =
    usePhoneModal();
  const { phone, call, setCall } = usePhoneContext();
  const [agent, setAgent] = useState("");
  const [showLeadInfo, setShowLeadInfo] = useState(false);

  // PHONE VARIABLES
  // const [call, setInComingCall] = useState<Connection>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [from, setFrom] = useState<{ name: string; number: string }>();
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

    phone.on("incoming", async function (call: any) {
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
      onSetLead(data);

      setFrom({
        name: data.firstName
          ? `${data.firstName} ${data.lastName}`
          : "Unknown Caller",
        number: data.cellPhone || call.parameters.From,
      });

      onPhoneInOpen();
      setCall(call);
    });
  }

  const onIncomingCallDisconnect = () => {
    call?.disconnect();
    setIsCallAccepted(false);
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

  // useEffect(() => {
  //   const test = async () => {
  //     const response = await axios.post("/api/leads/details", {
  //       phone: "+13478030962",
  //     });

  //     const data = response.data;

  //     onSetLead(data);

  //     setFrom({
  //       name: data.firstName
  //         ? `${data.firstName} ${data.lastName}`
  //         : "Unknown Caller",
  //       phone: data.cellPhone || "+3478030962",
  //     });
  //   };
  //   test();
  // }, []);
  return (
    <Transition.Root show={isPhoneInOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 pointer-events-none"
        onClose={() => {}}
      >
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
          <div
            className={cn(
              "flex justify-center  w-full h-full overflow-hidden pointer-events-none p-10",
              showLeadInfo ? "" : "items-center"
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel
                className={cn(
                  "pointer-events-auto w-screen",
                  showLeadInfo ? " min-w-full" : "w-[400px]"
                )}
              >
                {showLeadInfo ? (
                  <div className="flex flex-col gap-2 overflow-y-auto bg-white p-2 shadow-xl rounded-md text-sm relative">
                    <div className=" flex gap-2 absolute top-2 left-2 z-50">
                      <Button size="sm" onClick={() => setShowLeadInfo(false)}>
                        Return to call
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        onClick={onIncomingCallDisconnect}
                      >
                        <PhoneOff size={16} /> Hang Up
                      </Button>
                    </div>
                    <PhoneLeadInfo open={true} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 overflow-y-auto bg-white p-2 shadow-xl rounded-md text-sm">
                    <div className="flex items-center gap-2">
                      <PhoneIncoming size={16} />
                      Incoming call from
                      <span className="text-primary font-bold italic">
                        {from?.number}
                      </span>
                      {lead && (
                        <Button
                          size="sm"
                          className="ml-auto"
                          onClick={() => setShowLeadInfo(true)}
                        >
                          Show Lead
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Lead name: {from?.name}</span>
                      <span className="text-primary font-bold">
                        {formatSecondsToTime(time)}
                      </span>
                    </div>
                    {!isCallAccepted ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="gap-2"
                          onClick={onIncomingCallAccept}
                        >
                          <Phone size={16} /> Answer
                        </Button>

                        <Button
                          variant="destructive"
                          className="gap-2"
                          onClick={onIncomingCallReject}
                        >
                          <PhoneOff size={16} /> Reject
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="destructive"
                        className="gap-2"
                        onClick={onIncomingCallDisconnect}
                      >
                        <PhoneOff size={16} /> Hang Up
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
                      className="gap-2"
                    >
                      <PhoneForwarded size={16} /> Forward Call
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
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
