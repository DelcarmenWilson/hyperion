"use client";
import React, { useContext, useEffect, useState } from "react";
import { Mic, MicOff, Phone, X } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";

import { cn } from "@/lib/utils";
import axios from "axios";

import SocketContext from "@/providers/socket";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { usePhoneContext } from "@/providers/phone";

import {
  TwilioParticipant,
  TwilioShortConference,
  TwilioShortParticipant,
} from "@/types/twilio";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneSwitcher } from "./addins/switcher";

import { EmptyCard } from "../reusable/empty-card";
import { ParticipantList } from "./participant/list";
import { TouchPad } from "./addins/touch-pad";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";
import { formatSecondsToTime } from "@/formulas/numbers";

import { chatSettingsUpdateCurrentCall } from "@/actions/chat-settings";
//import { testConference, testParticipants } from "@/test-data/phone";

export const PhoneOut = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const { lead, conference, setConference, setParticipants } = usePhone();
  const { phone, call, setCall } = usePhoneContext();
  const [onCall, setOnCall] = useState(false);
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [disabled, setDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConferenceOpen, setIsConferenceOpen] = useState(false);

  const [empty, setEmpty] = useState(false);

  // PHONE VARIABLES
  const [to, setTo] = useState<{ name: string; number: string }>({
    name: lead ? leadFullName : "New Call",
    number: formatPhoneNumber(lead?.cellPhone as string) || "",
  });
  const [selectedNumber, setSelectedNumber] = useState(
    user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone ||
      ""
  );
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [isCallMuted, setIsCallMuted] = useState(false);

  const startupClient = () => {
    if (!user?.phoneNumbers.length) {
      setEmpty(true);
      console.log("no phone number has been set up");
      return;
    }
    addDeviceListeners();
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

  const onStarted = async () => {
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
      Direction: "outbound",
      AgentName: `${user?.name} (Agent)`,
    });

    setTimeout(async () => {
      const participant = await addParticipant({
        conferenceSid: user?.id as string,
        from: selectedNumber as string,
        to: reFormatPhoneNumber(to.number),
        label: lead?.id as string,
        record: true,
        coaching: false,
        callSidToCoach: null,
        earlyMedia: true,
        endConferenceOnExit: true,
        startConferenceOnEnter: true,
      });

      onGetParticipants(participant.conferenceSid, participant);

      const conf: TwilioShortConference = {
        agentId: user?.id as string,
        agentName: user?.name as string,
        conferenceSid: participant.conferenceSid,
        callSidToCoach: call.parameters.CallSid,
        coaching: false,
        leadId: lead?.id as string,
        leadName: to.name,
      };
      setConference(conf);
      chatSettingsUpdateCurrentCall(participant.callSid);
    }, 2000);

    call.on("disconnect", onDisconnect);
    userEmitter.emit("newCall", lead?.id!);
    setOnCall(true);
    setRunning(true);
    setCall(call);
  };

  const onDisconnect = () => {
    call?.disconnect();
    setOnCall(false);
    setConference(undefined);
    setParticipants(undefined);
    setIsConferenceOpen(false);
    setRunning(false);
    setTime(0);
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
  const onGetParticipants = (
    conferenceId: string,
    newParticipant: TwilioParticipant | null = null
  ) => {
    axios
      .post("/api/twilio/conference/participant", {
        conferenceId: conferenceId,
      })
      .then((response) => {
        const participants = response.data as TwilioParticipant[];
        if (newParticipant) participants.push(newParticipant);
        setParticipants(participants);
      });
  };
  const addParticipant = async (participant: TwilioShortParticipant) => {
    const response = await axios.post(
      "/api/twilio/voice/conference",
      participant
    );
    return response.data as TwilioParticipant;
  };

  const onAddCoach = async (coachId: string, coachName: string) => {
    const participant = await addParticipant({
      conferenceSid: user?.id as string,
      from: lead?.cellPhone as string,
      to: `client:${coachId}`,
      label: coachId,
      record: true,
      earlyMedia: false,
      coaching: true,
      callSidToCoach: conference?.callSidToCoach as string,
      endConferenceOnExit: false,
      startConferenceOnEnter: false,
    });
    const updatedConference: TwilioShortConference = {
      ...conference!,
      coachId: coachId,
      coachName: coachName,
    };
    setConference(updatedConference);
    onGetParticipants(participant.conferenceSid, participant);
    chatSettingsUpdateCurrentCall(participant.callSid);
  };
  useEffect(() => {
    onCheckNumber();
    startupClient();
  }, []);

  useEffect(() => {
    socket?.on(
      "coach-joined-received",
      (data: { conferenceId: string; coachId: string; coachName: string }) => {
        console.log(data.conferenceId, data.coachId, data.coachName);
        if (!conference) return;
        onAddCoach(data.coachId, data.coachName);
      }
    );
  }, [socket, conference]);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);
  //TODO - Test data dont forget to remove
  // useEffect(() => {
  //   setConference(testConference);
  //   setParticipants(testParticipants);
  // }, []);

  return (
    <div className="flex flex-col flex-1 gap-2 p-2 overflow-hidden">
      {empty ? (
        <EmptyCard title="No phone Number has been setup" />
      ) : (
        <>
          <div className="flex justify-between items-center">
            {to.name}

            {lead && (
              <Button
                variant={isOpen ? "default" : "outlineprimary"}
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
            )}
            <span className="text-primary font-bold">
              {formatSecondsToTime(time)}
            </span>
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
            <span>Caller Id</span>
            <PhoneSwitcher
              number={selectedNumber}
              onSetDefaultNumber={setSelectedNumber}
            />
          </div>
          <div className="relative flex flex-col gap-2 flex-1 overflow-hidden">
            <TouchPad onNumberClick={onNumberClick} />

            {!onCall ? (
              <Button
                className="gap-2"
                disabled={!disabled}
                onClick={onStarted}
              >
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

            <div
              className={cn(
                "flex flex-col absolute bg-background  transition-[bottom] left-0 -bottom-full ease-in-out duration-500 w-full h-full overflow-hidden",
                isConferenceOpen && " bottom-0"
              )}
            >
              <ParticipantList onClose={() => setIsConferenceOpen(false)} />
            </div>
            {conference?.agentId == user?.id && (
              <Button
                className="mt-auto"
                variant="outlineprimary"
                size="sm"
                onClick={() => setIsConferenceOpen((open) => !open)}
              >
                See Paricipants
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};