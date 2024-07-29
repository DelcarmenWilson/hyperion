import { create } from "zustand";
import { FullCall, FullLead, FullLeadNoConvo } from "@/types";
import { PipeLine } from "@prisma/client";
import { TwilioParticipant, TwilioShortConference } from "@/types";
import { Connection, Device } from "twilio-client";
import { useEffect } from "react";
import {
  chatSettingsUpdateCurrentCall,
  chatSettingsUpdateRemoveCurrentCall,
} from "@/actions/chat-settings";

type PhoneStore = {
  //PHONE SPECIFIC
  call: Connection | undefined;
  time: number;
  setTime: () => void;
  isRunning: boolean;
  isCallMuted: boolean;
  onCallMutedToggle: () => void;

  onPhoneConnect: (c: Connection) => void;
  onPhoneInConnect: () => void;
  onPhoneDisconnect: () => void;

  isPhoneInOpen: boolean;
  onPhoneInOpen: (c?: Connection) => void;
  onPhoneInClose: () => void;

  isPhoneDialerOpen: boolean;
  onPhoneDialerOpen: (e?: FullLead[], f?: PipeLine) => void;
  onPhoneDialerClose: () => void;

  isPhoneOutOpen: boolean;
  onPhoneOutOpen: (e?: FullLeadNoConvo, c?: TwilioShortConference) => void;
  onPhoneOutClose: () => void;

  isCallOpen: boolean;
  onCallOpen: (e: FullCall, t?: string) => void;
  onCallClose: () => void;
  fullCall?: FullCall;
  callType?: string;

  lead?: FullLeadNoConvo;
  leads?: FullLead[];
  pipeline?: PipeLine;
  pipeIndex: number;
  onSetLead: (e?: FullLeadNoConvo) => void;
  onSetLeads: (e?: FullLead[]) => void;
  onSetIndex: (e: number) => void;

  // LEADINFO
  isLeadInfoOpen: boolean;
  onLeadInfoToggle: () => void;

  //CONFERENCE
  isConferenceOpen: boolean;
  conference?: TwilioShortConference;
  participants?: TwilioParticipant[];
  setConference: (e?: TwilioShortConference) => void;
  setParticipants: (e?: TwilioParticipant[]) => void;
  onConferenceToggle: () => void;

  //SCRIPT
  showScript: boolean;
  onScriptOpen: () => void;
  onScriptClose: () => void;
  //CALL
  isOnCall: boolean;
};

export const usePhone = create<PhoneStore>((set, get) => ({
  //PHONE SPECIFIC STUFF
  call: undefined,
  setCall: (c: Connection) => set({ call: c }),
  time: 0,
  setTime: () => set({ time: get().time + 1 }),
  isRunning: false,
  onRunningToggle: () => set({ isRunning: !get().isRunning }),
  isCallMuted: false,
  onCallMutedToggle: () => set({ isCallMuted: !get().isCallMuted }),
  onPhoneConnect: (c) => set({ call: c, isOnCall: true, isRunning: true }),
  onPhoneInConnect: () => set({ isOnCall: true, isRunning: true }),
  onPhoneDisconnect: () =>
    set({
      call: undefined,
      isOnCall: false,
      isCallOpen: false,
      isConferenceOpen: false,
      conference: undefined,
      participants: undefined,
      isRunning: false,
      time: 0,
      isPhoneInOpen: false,
    }),

  pipeIndex: 0,
  isPhoneInOpen: false,
  isPhoneDialerOpen: false,
  isPhoneOutOpen: false,
  isCallOpen: false,
  onPhoneInOpen: (c) => set({ call: c, isPhoneInOpen: true }),
  onPhoneInClose: () => set({ isPhoneInOpen: false }),
  onPhoneDialerOpen: (e, f) =>
    set({
      isPhoneDialerOpen: true,
      leads: e,
      pipeline: f,
      pipeIndex: f?.index,
    }),
  onPhoneDialerClose: () => set({ isPhoneDialerOpen: false }),
  onPhoneOutOpen: (e, c) =>
    set({
      isPhoneOutOpen: true,
      lead: e,
      conference: c,
      isLeadInfoOpen: e ? true : false,
    }),

  onPhoneOutClose: () => set({ isLeadInfoOpen: false, isPhoneOutOpen: false }),

  onCallOpen: (e, t = "call") =>
    set({ isCallOpen: true, fullCall: e, callType: t }),
  onCallClose: () => set({ isCallOpen: false }),

  onSetLead: (e) => set({ lead: e }),
  onSetLeads: (e) => set({ leads: e }),
  onSetIndex: (e) => set({ pipeIndex: e }),
  //CONFERENCE
  isConferenceOpen: false,
  setConference: (e) => set({ conference: e }),
  setParticipants: (e) => set({ participants: e }),
  onConferenceToggle: () => set({ isConferenceOpen: !get().isConferenceOpen }),
  // LEADINFO
  isLeadInfoOpen: false,
  onLeadInfoToggle: () => set({ isLeadInfoOpen: !get().isLeadInfoOpen }),
  //SCRIPT
  showScript: false,
  onScriptOpen: () => set({ showScript: true }),
  onScriptClose: () => set({ showScript: false }),
  isOnCall: false,
  setOnCall: (e: boolean) => set({ isOnCall: e }),
}));

export const usePhoneData = (
  phone: Device | null,
  call: Connection | undefined,
  isCallMuted: boolean,
  onCallMutedToggle: () => void,
  onPhoneInConnect: () => void,
  onPhoneDisconnect: () => void,
  isRunning: boolean,
  setTime: () => void
) => {
  //GENERAL FUNCTIIONS
  ///Disconnect an in progress call
  const onDisconnect = () => {
    call?.disconnect();
    onPhoneDisconnect();
    phone?.connections.forEach((connection) => {
      connection.disconnect();
    });
    chatSettingsUpdateRemoveCurrentCall();
  };
  const onCallMuted = () => {
    if (call) {
      call.mute(!isCallMuted);
      onCallMutedToggle();
    }
  };

  //INCOMING FUNCTIONS
  ///Accept an incoming call
  const onIncomingCallAccept = () => {
    if (!call) return;
    call.accept();
    //TODO - this is not working as intended
    chatSettingsUpdateCurrentCall(call.parameters.CallSid);
    onPhoneInConnect();
  };
  //Disconnect an in progress call - Direct the call to voicemail
  const onIncomingCallReject = () => {
    call?.reject();
    onPhoneDisconnect();
  };
  //TIME FUNCTION
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

  return {
    onDisconnect,
    onCallMuted,
    onIncomingCallAccept,
    onIncomingCallReject,
  };
};
