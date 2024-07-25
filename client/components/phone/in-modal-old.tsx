"use client";

import { Connection } from "twilio-client";
import { Fragment, useEffect, useState } from "react";
import { Phone, PhoneForwarded, PhoneIncoming, PhoneOff } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePhone } from "@/hooks/use-phone-old";
import { formatSecondsToTime } from "@/formulas/numbers";
import { usePhoneContext } from "@/providers/phone";
import { PhoneAgents } from "@/constants/phone";
import { PhoneLeadInfo } from "./addins/lead-info";
import { chatSettingsUpdateCurrentCall } from "@/actions/chat-settings";

export const PhoneInModal = () => {
  const {
    call,
    isRunning,
    time,
    setTime,
    isOnCall,
    onPhoneInConnect,
    onPhoneDisconnect,
    isPhoneInOpen,
    onPhoneInOpen,
    onSetLead,
    lead,
    isLeadInfoOpen,
    onLeadInfoToggle: onToggleLeadInfo,
  } = usePhone();
  const { phone } = usePhoneContext();
  const [agent, setAgent] = useState("");

  // PHONE VARIABLES
  const [from, setFrom] = useState<{ name: string; number: string }>();

  const addDeviceListeners = () => {
    if (!phone) return;

    phone.on("incoming", async function (incomingCall: Connection) {
      // if (phone.status() == "busy") {
      //   incomingCall?.reject();
      //   return;
      // }

      incomingCall.on("disconnect", function (error: any) {
        onCallDisconnect();
      });
      incomingCall.on("cancel", function (error: any) {
        onCallDisconnect();
      });
      const response = await axios.post("/api/leads/details", {
        phone: incomingCall.parameters.From,
      });

      const data = response.data;
      if (data) {
        onSetLead(data);

        setFrom({
          name: data.firstName
            ? `${data.firstName} ${data.lastName}`
            : "Unknown Caller",
          number: data.cellPhone || incomingCall.parameters.From,
        });
      }
      onPhoneInOpen(incomingCall);
    });
  };
  ///Disconnect an in progress call
  const onCallDisconnect = () => {
    chatSettingsUpdateCurrentCall("");
    call?.disconnect();
    onPhoneDisconnect();
  };
  ///Accept an incoming call
  const onIncomingCallAccept = () => {
    chatSettingsUpdateCurrentCall(call?.parameters.CallSid!);
    call?.accept();
    onPhoneInConnect();
  };
  //Disconnect an in progress call - Direct the call to voicemail
  const onIncomingCallReject = () => {
    call?.reject();
    onPhoneDisconnect();
  };

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTime();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (phone?.status() == "busy") return;
    addDeviceListeners();
  }, [addDeviceListeners]);

  //TODO - dont forget to remove this test data....
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
                  isLeadInfoOpen ? " min-w-full" : "w-[400px]"
                )}
              >
                {isLeadInfoOpen ? (
                  <div className="relative flex flex-col bg-background gap-2 p-2 shadow-xl rounded-md text-sm overflow-y-auto">
                    <div className=" flex gap-2 absolute top-2 left-2 z-50">
                      <Button size="sm" onClick={onToggleLeadInfo}>
                        Return to call
                      </Button>
                      {!isOnCall ? (
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
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          onClick={onCallDisconnect}
                        >
                          <PhoneOff size={16} /> Hang Up
                        </Button>
                      )}
                    </div>
                    <PhoneLeadInfo />
                  </div>
                ) : (
                  <div className="flex flex-col bg-background gap-2 p-2 shadow-xl rounded-md text-sm overflow-y-auto">
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
                          onClick={onToggleLeadInfo}
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
                    {!isOnCall ? (
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
                        onClick={onCallDisconnect}
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

                    {/* <div className="grid grid-cols-2 items-center gap-2">
                      <Button className="gap-2" onClick={onGetConferences}>
                        Get Conference
                      </Button>

                      <Button
                        variant="outlineprimary"
                        className="gap-2"
                        onClick={onStarted}
                      >
                        Start Conference
                      </Button>
                    </div> */}
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
