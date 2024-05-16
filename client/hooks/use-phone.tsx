import { create } from "zustand";
import { FullLead, FullLeadNoConvo } from "@/types";
import { PipeLine } from "@prisma/client";
import { TwilioParticipant, TwilioShortConference } from "@/types/twilio";

type phoneStore = {
  //Auto calling
  autoCall: boolean;

  isPhoneInOpen: boolean;
  onPhoneInOpen: () => void;
  onPhoneInClose: () => void;

  isPhoneDialerOpen: boolean;
  onPhoneDialerOpen: (e?: FullLead[], f?: PipeLine) => void;
  onPhoneDialerClose: () => void;

  isPhoneOutOpen: boolean;
  onPhoneOutOpen: (e?: FullLeadNoConvo, c?: TwilioShortConference) => void;
  onPhoneOutConference: (
    e?: FullLeadNoConvo,
    c?: TwilioShortConference
  ) => void;
  onPhoneOutClose: () => void;
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
  setAutoCall: (e: boolean) => void;
};

export const usePhone = create<phoneStore>((set) => ({
  autoCall: false,
  pipeIndex: 0,
  isPhoneInOpen: false,
  isPhoneDialerOpen: false,
  isPhoneOutOpen: false,
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
  onPhoneOutConference: (e, c) =>
    set({ isPhoneOutOpen: true, lead: e, conference: c, autoCall: true }),
  onPhoneOutClose: () => set({ isPhoneOutOpen: false }),
  onSetLead: (e) => set({ lead: e }),
  onSetLeads: (e) => set({ leads: e }),
  onSetIndex: (e) => set({ pipeIndex: e }),
  setConference: (e) => set({ conference: e }),
  setParticipants: (e) => set({ participants: e }),
  setAutoCall: (e) => set({ autoCall: e }),
}));
