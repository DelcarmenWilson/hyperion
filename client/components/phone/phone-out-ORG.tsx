"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, Mic, MicOff, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { userEmitter } from "@/lib/event-emmiter";
import SocketContext from "@/providers/socket";

import { cn } from "@/lib/utils";
import axios from "axios";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { usePhoneContext } from "@/providers/phone";
import { TwilioParticipant } from "@/types/twilio";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { PhoneSwitcher } from "./addins/switcher";

import { touchPadNumbers } from "@/constants/touch-pad-numbers";
import { EmptyCard } from "../reusable/empty-card";
import { ParticipantList } from "./participant/list";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";

import {
  chatSettingsUpdateCoach,
  chatSettingsUpdateCurrentCall,
  chatSettingsUpdateRecord,
} from "@/actions/chat-settings";

export const PhoneOutORG = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const { update } = useSession();
  const user = useCurrentUser();
  const { lead, conference } = usePhone();
  const { phone, call, setCall } = usePhoneContext();
  const [onCall, setOnCall] = useState(false);
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [disabled, setDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConferenceOpen, setIsConferenceOpen] = useState(false);
  const [participants, setParticipants] = useState<TwilioParticipant[] | null>(
    null
  );

  const [empty, setEmpty] = useState(false);

  // PHONE VARIABLES
  const [to, setTo] = useState<{ name: string; number: string }>({
    name: lead ? leadFullName : "New Call",
    number: formatPhoneNumber(lead?.cellPhone as string) || "",
  });
  const [settings, setSettings] = useState({
    record: user?.record || false,
    coach: false,
  });

  const [selectedNumber, setSelectedNumber] = useState(
    user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone ||
      ""
  );

  const [isCallMuted, setIsCallMuted] = useState(false);

  const startupClient = () => {
    if (!user?.phoneNumbers.length) {
      setEmpty(true);
      console.log("no phone number has been set up");
      return;
    }
    addDeviceListeners;
  };

  const addDeviceListeners = () => {
    if (!phone) return;
    phone.on("ready", function () {
      console.log("ready");
    });

    phone.on("error", function (error: any) {
      console.log(error);
    });
  };

  const onStarted = () => {
    if (!phone) return;
    if (!lead) {
      setTo((state) => {
        return { ...state, number: formatPhoneNumber(state.number) };
      });
      axios
        .post("/api/leads/details", { phone: reFormatPhoneNumber(to.number) })
        .then((response) => {
          const { id, firstName, lastName } = response.data;
          if (id) {
            setTo((state) => {
              return { ...state, name: `${firstName} ${lastName}` };
            });
          }
        });
    }

    const call = phone.connect({
      To: reFormatPhoneNumber(to.number),
      AgentNumber: selectedNumber as string,
      Recording: settings.record.toString(),
      Coach: settings.coach ? "on" : "off",
      Direction: "outbound",
    });

    if (settings.coach) {
      setTimeout(() => {
        axios
          .post("/api/twilio/voice/conference", {
            conferenceId: user?.id as string,
            from: selectedNumber as string,
            to: reFormatPhoneNumber(to.number),
            label: to.name,
            record: settings.record,
          })
          .then((response) => {
            const data = response.data;
            setParticipants((participants) => {
              if (participants) return [...participants, data];
              return [data];
            });
            setIsConferenceOpen(true);
            chatSettingsUpdateCurrentCall(data.callSid);
            socket?.emit("coach-request", user?.name, lead, data);
          });
      }, 2000);
    }

    call.on("disconnect", onDisconnect);
    userEmitter.emit("newCall", lead?.id!);
    setOnCall(true);
    setCall(call);
  };

  const onDisconnect = () => {
    call?.disconnect();
    setOnCall(false);
    setIsConferenceOpen(false);
    chatSettingsUpdateCurrentCall(null);
    setCall(null);
  };

  const onNumberClick = (num: string) => {
    if (call) {
      call.sendDigits(num);
    } else {
      setTo((state) => {
        return { ...state, number: (state.number += num) };
      });
      onCheckNumber();
    }
  };

  const onNumberTyped = (num: string) => {
    setTo((state) => {
      return { ...state, number: num };
    });
    setDisabled(num.length > 9 ? true : false);
  };

  const onCheckNumber = () => {
    if (to.number.length > 9) {
      setDisabled(true);
    }
  };

  const onRecordUpdate = () => {
    setSettings((settings) => {
      update();
      chatSettingsUpdateRecord(!settings.record).then((data) => {
        if (data.error) toast.error(data.error);

        if (data.success) toast.error(data.success);
      });
      return { ...settings, record: !settings.record };
    });
  };

  const onCoachUpdate = () => {
    setSettings((settings) => {
      chatSettingsUpdateCoach(!settings.coach).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
      return { ...settings, coach: !settings.coach };
    });
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

  const onReset = () => {
    setTo({ name: "", number: "" });
    setDisabled(false);
  };

  //CONFERENCES AND PARTICIPANTS
  const onGetParticipants = (conferenceId: string) => {
    axios
      .post("/api/twilio/conference/participant", {
        conferenceId: conferenceId,
      })
      .then((response) => {
        const data = response.data;
        setParticipants(data);
      });
  };

  const onStartConference = () => {
    if (!phone || !conference) return;
    if (call != null) return;

    const newCall = phone.connect({
      To: reFormatPhoneNumber(to.number),
      AgentNumber: selectedNumber as string,
      Recording: settings.record.toString(),
      Coach: settings.coach ? "on" : "off",
      Direction: "coach",
      ConferenceId: conference.conferenceSid,
      CallSidToCoach: conference.callSidToCoach as string,
    });

    onGetParticipants(conference.conferenceSid!);

    if (settings.coach) {
      setTimeout(() => {
        onGetParticipants(conference.conferenceSid!);
        socket?.emit("coach-joined", conference.conferenceSid);
      }, 2000);
    }

    newCall.on("disconnect", onDisconnect);
    setOnCall(true);
    setCall(newCall);
  };

  useEffect(() => {
    onCheckNumber();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    startupClient();
    if (conference) {
      onStartConference();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket?.on("coach-joined-recieved", (conferenceId: string) => {
      onGetParticipants(conferenceId);
    });
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-2 p-2 overflow-hidden">
      {empty ? (
        <EmptyCard title="No phone Number has been setup" />
      ) : (
        <>
          <div className="flex justify-between items-center">
            {to.name}
            <Button
              variant="outlineprimary"
              size="sm"
              // onClick={() => setIsConferenceOpen((open) => !open)}
              onClick={() => {
                socket?.emit("test");
              }}
            >
              Conference
            </Button>
            <Button
              variant="outlineprimary"
              size="sm"
              onClick={() =>
                setIsOpen((open) => {
                  userEmitter.emit("toggleLeadInfo", !open);
                  return !open;
                })
              }
            >
              LEAD INFO
            </Button>
          </div>
          <div className="relative">
            <Input
              placeholder="Phone Number"
              value={to.number}
              maxLength={10}
              onChange={(e) => onNumberTyped(e.target.value)}
            />
            <X
              className={cn(
                "h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer transition-opacity ease-in-out",
                to.number.length == 0 ? "opacity-0" : "opacity-100"
              )}
              onClick={onReset}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="w-40">Caller Id</span>
            <PhoneSwitcher
              number={selectedNumber}
              onSetDefaultNumber={setSelectedNumber}
            />
          </div>
          <div className="grid grid-cols-2 text-sm gap-2">
            {user?.role != "ASSISTANT" && (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} /> Recording
                <Switch
                  disabled={!!call}
                  checked={settings.record}
                  onCheckedChange={onRecordUpdate}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <AlertCircle size={16} /> Coaching
              <Switch
                disabled={!!call}
                checked={settings.coach}
                onCheckedChange={onCoachUpdate}
              />
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden">
            {/* <div className="absolute right-0 inset-0 bg-background border"> */}
            <div
              className={cn(
                "flex flex-col absolute bg-background border transition-[right] -right-full ease-in-out duration-500 w-full h-full overflow-hidden",
                isConferenceOpen && " right-0"
              )}
            >
              <ParticipantList onClose={() => setIsConferenceOpen(false)} />
            </div>
            <div className="grid grid-cols-3 gap-1">
              {touchPadNumbers.map((number) => (
                <Button
                  key={number.value}
                  className="flex-col gap-1 h-14"
                  variant="outlineprimary"
                  onClick={() => onNumberClick(number.value)}
                >
                  <p>{number.value}</p>
                  <p>{number.letters}</p>
                </Button>
              ))}
            </div>
          </div>
          {!onCall ? (
            <Button className="gap-2" disabled={!disabled} onClick={onStarted}>
              <Phone size={16} /> Call
            </Button>
          ) : (
            <Button
              className="gap-2"
              variant="destructive"
              onClick={onDisconnect}
            >
              <Phone size={16} /> Hang up
            </Button>
          )}
          {onCall && (
            <Button
              className="gap-2"
              variant={isCallMuted ? "destructive" : "outlinedestructive"}
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
          )}
        </>
      )}
    </div>
  );
};
