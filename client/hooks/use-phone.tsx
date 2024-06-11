import { create } from "zustand";
import { FullLead, FullLeadNoConvo, Voicemail } from "@/types";
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

  isVoicemailOpen: boolean;
  onVoicemailOpen: (e: Voicemail) => void;
  onVoicemailClose: () => void;
  voicemail?: Voicemail;

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
};

export const usePhone = create<phoneStore>((set) => ({
  pipeIndex: 0,
  isPhoneInOpen: false,
  isPhoneDialerOpen: false,
  isPhoneOutOpen: false,
  isVoicemailOpen: false,
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

  onVoicemailOpen: (e) => set({ isVoicemailOpen: true, voicemail: e }),
  onVoicemailClose: () => set({ isVoicemailOpen: false }),

  onSetLead: (e) => set({ lead: e }),
  onSetLeads: (e) => set({ leads: e }),
  onSetIndex: (e) => set({ pipeIndex: e }),
  setConference: (e) => set({ conference: e }),
  setParticipants: (e) => set({ participants: e }),
}));
