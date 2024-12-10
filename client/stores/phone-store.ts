
import { create } from "zustand";
import { Call } from "@twilio/voice-sdk";

import { FullCall, FullLead, PipelineLead } from "@/types";
import { Pipeline, Script } from "@prisma/client";
import { TwilioParticipant, TwilioShortConference } from "@/types";

import { getScriptOne } from "@/actions/script";

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
  //INCOMING CALL
  isIncomingCallOpen: boolean;
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

  //INCOMING CALL
  onIncomingCallOpen: () => void;
  onIncomingCallClose: () => void;
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
      isIncomingCallOpen: false,
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
      isLeadInfoOpen: e != undefined ? true : false,
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
  //INCOMING CALL
  isIncomingCallOpen: false,
  onIncomingCallOpen: () => set({ isIncomingCallOpen: true }),
  onIncomingCallClose: () => set({ isIncomingCallOpen: false }),

  fetchData: async () => {
    //NEED TO REPLACE THIS WITH A MORE SPECIFIC SCRIPT
    const script = await getScriptOne(get().lead?.type);
    set({ script: script as Script });
  },
}));