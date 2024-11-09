import { useEffect } from "react";
import { create } from "zustand";
import { FullCall, FullLead, FullLeadNoConvo, PipelineLead } from "@/types";
import { Pipeline, Script } from "@prisma/client";
import { TwilioParticipant, TwilioShortConference } from "@/types";
import { Call, Device } from "@twilio/voice-sdk";
import {
  phoneSettingsUpdateCurrentCall,
  phoneSettingsUpdateRemoveCurrentCall,
} from "@/actions/settings/phone";
import { scriptGetOne } from "@/actions/script";

type State = {
  //PHONE SPECIFIC
  call: Call | undefined;
  time: number;
  setTime: () => void;
  isRunning: boolean;
  isCallMuted: boolean;

  isPhoneInOpen: boolean;
  isPhoneDialerOpen: boolean;
  isPhoneOutOpen: boolean;

  isCallOpen: boolean;
  fullCall?: FullCall;
  callType?: string;

  lead?: PipelineLead;
  leads?: PipelineLead[];
  pipeline?: Pipeline;

  // LEADINFO
  isLeadInfoOpen: boolean;

  //CONFERENCE
  isConferenceOpen: boolean;
  conference?: TwilioShortConference;
  participants?: TwilioParticipant[];

  //SCRIPT
  script?: Script;
  showScript: boolean;
  //QUOTER
  showQuoter: boolean;
  //CALL
  isOnCall: boolean;
};

type Actions = {
  //PHONE SPECIFIC
  setTime: () => void;
  onCallMutedToggle: () => void;

  onPhoneConnect: (c: Call) => void;
  onPhoneInConnect: () => void;
  onPhoneDisconnect: () => void;

  onPhoneInOpen: (c?: Call) => void;
  onPhoneInClose: () => void;

  onPhoneDialerOpen: () => void;
  onPhoneDialerClose: () => void;

  onPhoneOutOpen: (e?: PipelineLead, c?: TwilioShortConference) => void;
  onPhoneOutClose: () => void;

  onCallOpen: (e: FullCall, t?: string) => void;
  onCallClose: () => void;

  onSetLead: (e?: PipelineLead) => void;
  onSetLeads: (e?: FullLead[]) => void;

  // LEADINFO
  onLeadInfoToggle: () => void;

  //CONFERENCE
  setConference: (e?: TwilioShortConference) => void;
  setParticipants: (e?: TwilioParticipant[]) => void;
  onConferenceToggle: () => void;

  //SCRIPT
  onScriptOpen: () => void;
  onScriptClose: () => void;
  //QUOTER
  onQuoterOpen: () => void;
  onQuoterClose: () => void;
  fetchData: () => void;
};

export const usePhoneStore = create<State & Actions>((set, get) => ({
  //PHONE SPECIFIC STUFF
  call: undefined,
  setCall: (c: Call) => set({ call: c }),
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
  onPhoneDialerOpen: () => set({ isPhoneDialerOpen: true }),
  onPhoneDialerClose: () =>
    set({ isPhoneDialerOpen: false, showScript: false }),
  onPhoneOutOpen: (e, c) => {
    set({
      isPhoneOutOpen: true,
      lead: e,
      conference: c,
      isLeadInfoOpen: e ? true : false,
    });
    get().fetchData();
  },

  onPhoneOutClose: () =>
    set({ isLeadInfoOpen: false, isPhoneOutOpen: false, showScript: false }),

  onCallOpen: (e, t = "call") =>
    set({ isCallOpen: true, fullCall: e, callType: t }),
  onCallClose: () => set({ isCallOpen: false }),

  onSetLead: (e) => {
    set({ lead: e });
    get().fetchData();
  },
  onSetLeads: (e) => set({ leads: e }),
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
  onScriptOpen: () => set({ showScript: true, showQuoter: false }),
  onScriptClose: () => set({ showScript: false }),
  //QUOTER
  showQuoter: false,
  onQuoterOpen: () => set({ showQuoter: true, showScript: false }),
  onQuoterClose: () => set({ showQuoter: false }),
  isOnCall: false,
  setOnCall: (e: boolean) => set({ isOnCall: e }),
  fetchData: async () => {
    //NEED TO REPLACE THIS WITH A MORE SPECIFIC SCRIPT
    const script = await scriptGetOne(get().lead?.type);
    set({ script: script as Script });
  },
}));

export const usePhoneData = (phone: Device | null) => {
  const {
    call,
    isRunning,
    time,
    setTime,
    isCallMuted,
    onCallMutedToggle,
    onPhoneInConnect,
    onPhoneConnect,
    onPhoneDisconnect,
    onPhoneDialerClose,
    leads,
    lead,
    pipeline,
  } = usePhoneStore();

  //GENERAL FUNCTIIONS
  ///Disconnect an in progress call
  const onDisconnect = () => {
    call?.disconnect();
    onPhoneDisconnect();
    phone?.calls.forEach((call) => {
      call.disconnect();
    });
    phoneSettingsUpdateRemoveCurrentCall();
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
    phoneSettingsUpdateCurrentCall(call.parameters.CallSid);
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
    call,
    lead,
    leads,
    onPhoneConnect,
    onPhoneDisconnect,
    onDisconnect,
    time,
    isRunning,
    isCallMuted,
    onCallMuted,
    onCallMutedToggle,
    onIncomingCallAccept,
    onIncomingCallReject,
    pipeline,
    onPhoneDialerClose,
  };
};
