import { create } from "zustand";
import { FullCall, FullLead, FullLeadNoConvo } from "@/types";
import { PipeLine } from "@prisma/client";
import { TwilioParticipant, TwilioShortConference } from "@/types";

type phoneStore = {
  isPhoneInOpen: boolean;
  onPhoneInOpen: () => void;
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
  call?: FullCall;
  callType?: string;

  lead?: FullLeadNoConvo;
  leads?: FullLead[];
  pipeline?: PipeLine;
  pipeIndex: number;
  onSetLead: (e?: FullLeadNoConvo) => void;
  onSetLeads: (e?: FullLead[]) => void;
  onSetIndex: (e: number) => void;

  //CONFERENCE
  conference?: TwilioShortConference;
  participants?: TwilioParticipant[];
  setConference: (e?: TwilioShortConference) => void;
  setParticipants: (e?: TwilioParticipant[]) => void;
  //SCRIPT
  showScript: boolean;
  onScriptOpen: () => void;
  onScriptClose: () => void;
  //CALL
  isOnCall: boolean;
  setOnCall: (e: boolean) => void;
};

export const usePhone = create<phoneStore>((set) => ({
  pipeIndex: 0,
  isPhoneInOpen: false,
  isPhoneDialerOpen: false,
  isPhoneOutOpen: false,
  isCallOpen: false,
  onPhoneInOpen: () => set({ isPhoneInOpen: true }),
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
    set({ isPhoneOutOpen: true, lead: e, conference: c }),

  onPhoneOutClose: () => set({ isPhoneOutOpen: false }),

  onCallOpen: (e, t = "call") =>
    set({ isCallOpen: true, call: e, callType: t }),
  onCallClose: () => set({ isCallOpen: false }),

  onSetLead: (e) => set({ lead: e }),
  onSetLeads: (e) => set({ leads: e }),
  onSetIndex: (e) => set({ pipeIndex: e }),
  setConference: (e) => set({ conference: e }),
  setParticipants: (e) => set({ participants: e }),
  showScript: false,
  onScriptOpen: () => set({ showScript: true }),
  onScriptClose: () => set({ showScript: false }),
  isOnCall: false,
  setOnCall: (e: boolean) => set({ isOnCall: e }),
}));
