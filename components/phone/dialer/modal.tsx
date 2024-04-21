"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  ArrowRightCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RefreshCcw,
  X,
} from "lucide-react";
import { MdDialpad } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhoneModal } from "@/hooks/use-phone-modal";

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { formatSecondsToTime } from "@/formulas/numbers";
import { usePhoneContext } from "@/providers/phone";
import { PhoneLeadInfo } from "@/components/phone/addins/lead-info";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadDialerCard } from "./lead-card";
import { pipelineUpdateByIdIndex } from "@/actions/pipeline";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";

export const PhoneDialerModal = () => {
  const user = useCurrentUser();
  const {
    isPhoneDialerOpen,
    onPhoneDialerClose,
    onSetLead,
    leads,
    lead,
    pipeline,
  } = usePhoneModal();
  const [index, setIndex] = useState(0);
  const indexRef = useRef<HTMLDivElement>(null);
  const [dialing, setDialing] = useState(false);

  const { phone, call, setCall } = usePhoneContext();

  // PHONE VARIABLES
  const [record, setRecord] = useState(user?.record);
  const [coach, setCoach] = useState(false);
  const [isCallMuted, setIsCallMuted] = useState(false);

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  function addDeviceListeners() {
    if (!phone) return;
    phone.on("ready", function () {
      console.log("Dialer ready");
    });

    phone.on("error", function (error: any) {
      console.log(error);
    });
  }

  const onStartCall = (newLeadPhone: string, newPhone: string) => {
    if (!phone) return;
    const call = phone.connect({
      To: reFormatPhoneNumber(newLeadPhone),
      AgentNumber: newPhone,
      Recording: record ? "record-from-answer-dual" : "do-not-record",
      Coach: coach ? "on" : "off",
      Direction: "outbound",
    });

    call.on("disconnect", onDisconnect);
    setCall(call);
  };

  const onDisconnect = (keepDailing: boolean = true) => {
    call?.disconnect();
    setCall(null);
    if (keepDailing) {
      onNextLead();
    } else {
      setDialing(false);
      onSetLead(undefined);
      setRunning(false);
    }
  };

  const onCallMuted = () => {
    if (call) {
      call.mute(false);
      setIsCallMuted((state) => {
        call.mute(!state);
        return !state;
      });
    }
  };

  const onStartDialing = () => {
    setDialing(true);
    onNextLead(index - 1, true);
  };

  const onStopDailing = () => {
    onDisconnect(false);
  };
  const onNextLead = (idx: number = index, dial: boolean = false) => {
    if (!leads) return;
    let nextIndex = idx + 1;

    if (nextIndex == leads.length) {
      onDisconnect(false);
      nextIndex = 0;
      toast.error("No more lead available in this stage");
    } else {
      const newLead = leads[nextIndex];
      onSetLead(newLead);
      console.log("here");
      if (!dial) return;
      const newPhone =
        user?.phoneNumbers.find((e) => e.phone == newLead?.defaultNumber)
          ?.phone || user?.phoneNumbers[0]?.phone;
      onStartCall(newLead.cellPhone, newPhone!);
    }

    setIndex(nextIndex);
    pipelineUpdateByIdIndex(pipeline?.id!, nextIndex);
  };

  const onReset = () => {
    if (!pipeline) return;
    setIndex(0);
    pipelineUpdateByIdIndex(pipeline?.id!, 0);
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

  useEffect(() => {
    if (!pipeline) return;
    setIndex(pipeline.index);
  }, []);

  useEffect(() => {
    if (!indexRef.current) return;
    indexRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [index]);

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
  if (leads == undefined) return null;
  return (
    <Transition.Root show={isPhoneDialerOpen} as={Fragment}>
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
          <div className="flex flex-col w-full h-full overflow-hidden pointer-events-none py-5 px-20 items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="pointer-events-auto w-full h-full overflow-hidden  m-4">
                <div className="flex flex-col justify-between gap-2 overflow-hidden h-full bg-background p-2 shadow-xl rounded-md text-sm">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <MdDialpad size={16} />
                      Dialer
                      <span className="text-primary font-bold italic">
                        {formatPhoneNumber(lead?.cellPhone as string) || ""}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outlineprimary"
                        className="gap-2"
                        onClick={onReset}
                      >
                        <RefreshCcw size={16} /> Reset
                      </Button>
                      <Button
                        className="gap-2"
                        onClick={() => onNextLead(index)}
                      >
                        <ArrowRightCircle size={16} /> Next Lead
                      </Button>
                      {call && (
                        <>
                          <Button
                            variant={
                              isCallMuted ? "destructive" : "outlinedestructive"
                            }
                            onClick={onCallMuted}
                          >
                            {isCallMuted ? (
                              <span className="flex gap-2">
                                <MicOff /> CALL IS MUTED
                              </span>
                            ) : (
                              <span className="flex gap-2">
                                <Mic /> Mute
                              </span>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => onDisconnect(true)}
                          >
                            <Phone size={16} /> Hang up
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {dialing && (
                        <Button variant="destructive" onClick={onStopDailing}>
                          Stop Dialing
                        </Button>
                      )}
                      <Button
                        disabled={dialing}
                        size="icon"
                        onClick={onPhoneDialerClose}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>
                      Stage: {pipeline?.name} - {leads.length} Leads
                    </span>
                    <span className="text-primary font-bold">
                      {formatSecondsToTime(time)}
                    </span>
                  </div>
                  {/* <div className="flex flex-1 gap-2 overflow-hidden h-full backdrop-filter bg-pentagon bg-cover backdrop-grayscale backdrop-blur-md backdrop-contrast-200"> */}
                  <div className="flex flex-1 gap-2 overflow-hidden h-full">
                    <div className="glassmorphism w-1/4 overflow-hidden h-full">
                      <ScrollArea className="h-full">
                        {leads.map((lead, i) => (
                          <LeadDialerCard
                            key={lead.id}
                            lead={lead}
                            indexRef={i == index ? indexRef : null}
                          />
                        ))}
                      </ScrollArea>
                    </div>
                    <div className="flex-1 h-full">
                      {lead ? (
                        <PhoneLeadInfo open />
                      ) : (
                        <div className="h-full  p-2">
                          <div className="glassmorphism flex-center h-full shadow-sm">
                            <Button onClick={onStartDialing}>
                              Start Dailing
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
