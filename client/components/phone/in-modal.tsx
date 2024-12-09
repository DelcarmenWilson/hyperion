"use client";
import { Call } from "@twilio/voice-sdk";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  Phone,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePhoneStore,
  usePhoneData,
  useIncomingCallData,
} from "@/hooks/use-phone";

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatSecondsToTime } from "@/formulas/numbers";
import { usePhoneContext } from "@/providers/phone";
import { PhoneAgents } from "@/constants/phone";
import { PhoneLeadInfo } from "./addins/lead-info";
import { formatPhoneNumber } from "@/formulas/phones";

export const PhoneInModal = () => {
  const {
    isOnCall,
    isPhoneInOpen,
    onPhoneInOpen,
    isPhoneOutOpen,
    isLeadInfoOpen,
    onLeadInfoToggle,
    onIncomingCallOpen,
  } = usePhoneStore();
  const { phone } = usePhoneContext();
  const {
    isCallMuted,
    time,
    onDisconnect,
    onCallMuted,
    onIncomingCallAccept,
    onIncomingCallReject,
  } = usePhoneData(phone);
  const [agent, setAgent] = useState("");
  const { from, setFrom, onGetLeadByPhone } = useIncomingCallData();
  // const { lead: testLead } = onGetLeadByPhone("+13478030962");

  const { lead } = onGetLeadByPhone(from.number);
  const incoming = (incomingCall: Call) => {
    // if (phone.status() == "busy") {
    //   incomingCall?.reject();
    //   return;
    // }

    //On Call disconnect or cancel - call the diconnect function
    ["disconnect", "cancel"].forEach((type) => {
      incomingCall.on(type, (call) => {
        console.log("call disconnected", call);
        onDisconnect();
      });
    });

    //Get the leads infomation based on the phone number
    // setFrom(prev=>{...prev,number:incomingCall.parameters.From})
    setFrom({
      id: "",
      name: "",
      number: incomingCall.parameters.From,
    });

    if (isPhoneOutOpen) onIncomingCallOpen();
    else onPhoneInOpen(incomingCall);
  };
  const addDeviceListeners = () => {
    if (!phone) return;
    //If the phone out dialog is open then dont display this modal. instead display the smaller incoming dialogs
    phone.audio?.incoming(!isPhoneOutOpen);
    // phone.removeListener("incoming", incoming);
    phone.on("incoming", incoming);
  };

  useEffect(() => {
    if (phone?.state == "registered") return;
    addDeviceListeners();
  }, [addDeviceListeners]);

  useEffect(() => {
    if (!lead) return;
    // onSetLead(data);
    setFrom((prev) => {
      return {
        ...prev,
        id: lead.id,
        name: lead.firstName
          ? `${lead.firstName} ${lead.lastName}`
          : "Unknown Caller",
      };
    });
  }, [lead]);
  //TODO - dont forget to remove this test data....
  // useEffect(() => {
  //   const test = async () => {
  //     if (testLead) {
  //       // onSetLead(data);
  //       setFrom({
  //         id: testLead.id,
  //         name: testLead.firstName
  //           ? `${testLead.firstName} ${testLead.lastName}`
  //           : "Unknown Caller",
  //         number: "+13478030962",
  //       });
  //     }
  //     // onSetLead(data);
  //   };
  //   test();
  // }, [testLead]);

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
              "flex justify-center w-full h-full overflow-hidden pointer-events-none p-10",
              isLeadInfoOpen ? "" : "items-center"
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
                  isLeadInfoOpen ? " min-w-full h-full" : "w-[400px]"
                )}
              >
                {isLeadInfoOpen ? (
                  <div className="relative flex flex-col bg-background gap-2 pt-6 p-2 shadow-xl rounded-md text-sm h-full overflow-y-auto lg:pt-2">
                    <div className="flex gap-2 absolute top-2 left-2 z-50">
                      <Button size="sm" onClick={onLeadInfoToggle}>
                        Return to call
                      </Button>
                      {isOnCall ? (
                        <div className="flex gap-2">
                          <Button
                            className="gap-2"
                            variant={
                              isCallMuted ? "destructive" : "outlinedestructive"
                            }
                            onClick={onCallMuted}
                          >
                            {isCallMuted ? (
                              <>
                                <MicOff size={16} /> Muted
                              </>
                            ) : (
                              <>
                                <Mic size={16} /> Mute
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2"
                            onClick={onDisconnect}
                          >
                            <PhoneOff size={16} /> Hang Up
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={onIncomingCallAccept}
                          >
                            <Phone size={16} /> Answer
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2"
                            onClick={onIncomingCallReject}
                          >
                            <PhoneOff size={16} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                    <PhoneLeadInfo leadId={from.id} />
                  </div>
                ) : (
                  <div className="flex flex-col bg-background gap-2 p-2 shadow-xl rounded-md text-sm overflow-y-auto">
                    <div className="flex items-center gap-2">
                      <PhoneIncoming size={16} />
                      {!isOnCall && <span>Incoming</span>}
                      <span>call from</span>
                      <span className="text-primary font-bold italic">
                        {formatPhoneNumber(from?.number)}
                      </span>
                      {from.id && (
                        <Button
                          size="sm"
                          className="ml-auto"
                          onClick={onLeadInfoToggle}
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
                    {isOnCall ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="gap-2"
                          variant={
                            isCallMuted ? "destructive" : "outlinedestructive"
                          }
                          onClick={onCallMuted}
                        >
                          {isCallMuted ? (
                            <>
                              <MicOff size={16} /> Muted
                            </>
                          ) : (
                            <>
                              <Mic size={16} /> Mute
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          className="gap-2"
                          onClick={onDisconnect}
                        >
                          <PhoneOff size={16} /> Hang Up
                        </Button>
                      </div>
                    ) : (
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
                    )}

                    <Select name="ddlAgent" onValueChange={(e) => setAgent(e)}>
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
